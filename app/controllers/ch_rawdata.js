 // use Array.isArray or Object.prototype.toString.call
// to differentiate regular objects from arrays
//typeof [1, 2, 4] === 'object';
 
 var XLSX = require('XLSX');//Reading and writing the workbook
 var fs = require('fs'); //Checking if file exists
 var sync = require('synchronize'); //To run the code synchronously
 var Assessment = require('../models/assessment');//Get the DB model for Assessments
 var Facility = require('../models/facility');//Get the DB model for facilities
 const ver1 = 'CHV1', ver2 = 'CHV2', 
 	StaffTrainingRowPat = 'CHV2SEC1BLK1RW';//setup the survey versionsas  constants.

 function CH_RawData(setupInfo){ // initialize the CH_RAwData object 
  this.cells= setupInfo.cells; //cells for start postions on workbook
  this.wb_filepath = setupInfo.filepath_wb;// file path for workbook backend
  this.wb_name = setupInfo.wb_name;//name of wb depending on client side selections 
  this.wb = setupInfo.workbk;//workbook used as template for writing new XLSX 
  this.wb_options = setupInfo.wb_options;// workbook options for query searching
  this.cur_surv = undefined;// current assessment/survey in the data writing loop
  this.cur_faciDets  = undefined;//current details of the facility for the survey
  this.sec_rows = undefined;//neatly organized section row information for easier iteration 
  this.wb_ready = false;// Boolean to determine status of workbook writing completion

 };

function getWbQuery(options){// client specified options 
	//This function setups the query for search of a certain criteria range pf assessments
	'use strict';// need to use the let keyword.
	var wb_options = options;
	console.log('begining gerWbQuery');
	 console.log(wb_options);
 	let query_options = [];//to store selected options ['surv_ver', max, {..tog}]
	switch (wb_options.surv_ver){ //determine required versions of surveys
 		 case 'V1':
 		 	console.log('V1 selected');
 		 	query_options.push(ver1); //set query version
 		 	query_options.push(parseInt(wb_options.surv_max));//set query max num
 		 	break;
 		 case 'V2':
 		 	query_options.push(ver2);
 		 	query_options.push(parseInt(wb_options.surv_max));

 		 	break;
 		 case 'All':
 		 	//query_options.push('All'); // 'All' logic still missing
 		 	query_options.push(parseInt(wb_options.surv_max));
 		 default : 
 		 	return console.log('No Valid Selected version in wb_options.surv_ver');
 		}
 		console.log('setup manditories');
 	if(wb_options.tog_county =='true' || wb_options.tog_term =='true' ){//process each possible case of selected filters
 		console.log('Either both or one of the filters is active');
 		if(wb_options.tog_county == 'true' && wb_options.tog_term == 'true'){//if all filters are active NOT YET COMPLETE
 			console.log(' All filters active togs are both true');
 			console.log('wb_options.surv_county: ' + wb_options.surv_county);
	 		query_options.push({ surv_county: wb_options.surv_county });
	 		console.log('wb_options.surv_term: ' + wb_options.surv_term);
	 		query_options.push({ surv_term: wb_options.surv_term });
	 		var wb_query = Assessment.find().where('Survey').equals(query_options[0])
	 			.where('Status').equals('Submitted')
	 			.where('Assessment_Term').equals(query_options[2]['surv_term']).limit(parseInt(query_options[1])); 
	 		return wb_query;


 		}else{
 			if(wb_options.tog_county == 'true' && wb_options.tog_term =='false'){// if only the county filter is active
 				//CURRENTLY NOT WORKING DUE TO COUNTY FILTER ISSUE WITH FACI_ID
	 			console.log(' County filter is true only . No term filter');
	 			console.log('wb_options.surv_county: ' + wb_options.surv_county);
	 			query_options.push({ surv_county: wb_options.surv_county });//push the selected county as a selected option
	 			var wb_query = Assessment.find().where('Survey').equals(query_options[0])
	 			.where('Status').equals('Submitted').limit(parseInt(query_options[1])); 
	 			console.log('Returning query with County filter and 2 manditories.');
 			 	return wb_query;
	 		}else {// if only the term filter is active
	 			console.log(' Term filter is true only . No county filter');
	 			console.log('wb_options.surv_term: ' + wb_options.surv_term);
	 			query_options.push({ surv_term: wb_options.surv_term });//push the selected term as a selected option
	 			var wb_query = Assessment.find().where('Survey').equals(query_options[0])
	 			.where('Status').equals('Submitted')
	 			.where('Assessment_Term').equals(query_options[2]['surv_term']).limit(parseInt(query_options[1])); 
	 			console.log(query_options[2]['surv_term']);
	 			console.log('Returning query with Term filter and 2 manditories.');
 			 	return wb_query;
	 		}
 		}
 	}else{//only version and surv_max filters are active
 		console.log('no optional togs were true');
 		if(query_options[0] === 'All'){// Check if both of the version are wanted
 			var wb_query = Assessment.find().where('Status').equals('Submitted').limit(parseInt(query_options[1]));
 			console.log('Returning query with Max filter only');
 			 return wb_query;
 		} else{
 			var wb_query = Assessment.find().where('Survey').equals(query_options[0])
	 			.where('Status').equals('Submitted').limit(parseInt(query_options[1])); 
	 			console.log('Returning query with manditory Survey filter and Max filter');
	 			return wb_query;
 		}
 		
 		
 	}
};

 CH_RawData.prototype.findCurFaci= function(srv_fac_id, cb){// current survey Facility_ID and , a callback

 	//function returns the facility information for a given FACILITY_ID
 	
	 	sync.fiber(function(){
	 		console.log('Beginning findCurFaci function');
 	var query_cur_faci  = Facility.findOne().where('FacilityCode').equals(srv_fac_id).select('County SubCounty FacilityCode FacilityName Tier Type Owner');
	 		facidets1 = sync.await(query_cur_faci.exec(sync.defer()));
	 		console.log('facidets1 is : '+ typeof facidets1);
	 		console.log(facidets1);
	 		//self.cur_surv_count += 1;
	 		cb(null,facidets1);//call the callback with null errors and facility details data retrieved
	 		
	 		}
 		);
 	
	

 };


 CH_RawData.prototype.getCHAssessments = function(cb){
 	//function to initiate all other functions of CH_RawData used to write workbooks
 self = this; //store reference to original CH-RawData Object
 console.log('this.filepath: '+ self.wb_filepath);
 console.log('this.wb: '+ typeof self.wb);
 console.log('Beginning getCHAssessments function...');

 //check for any specific filters here in the mongodb query
 if(typeof self.wb_options !== undefined && typeof self.wb_options !== null){//make sure wb_options are available

 	quer = getWbQuery(self.wb_options);
 	if(typeof quer != undefined && typeof quer != null){ //make sure the query isnt empty
 		console.log('Got the required db query');
 	}
 	else{
 		console.log('quer from getWbQuery is empty cant continue without quer' );
 	}
 	
 } else{
 	console.log('wb_options are empty');
 	quer =undefined;//make sure we leave the quer undefined
 	return;//stop cause the wb_options is empty
 }


 console.log('/ch_excel route is about to query for assessments');
 console.log('quer: ' + typeof quer);
 console.log(quer);

 sync.fiber(function(){
 	var chassess1 = sync.await(quer.exec(sync.defer()));//execute the query and return the found surveys
 	console.log('chassess1 is : ' + typeof chassess1);
 	if(chassess1 !== undefined && chassess1 !== null){//if the chassessments aren't empty
 		self.prepValidCHAssessments(null,chassess1,self);
 		cb(null,self.write_dets);//call the callback returning the write_dets object
 	}
 	else{
 		cb(quer,undefined);//return the value of quer and send undefined
 		return console.log('Query result empty');
 	}
 	
 });


 };


 CH_RawData.prototype.prepValidCHAssessments = function(err, chassess,rawdata_obj){
			
			/*
			Function to iterate through each found assement/survey
			Calls alot of the CH_RawData object methods 
			Probably need to break it down more...

			*/
			console.log('Running the prepValidCHAssessments function ');
		 	if (err != null) {//if the error has something other than null
		 		console.log('was an error when calling the prepValidCHAssessments function');
		 		console.log('quer is ' + typeof err);
		 		console.log(err);
		 		return;
		 	}
		 		else{
		 			console.log('rawdata_obj is: '+ typeof rawdata_obj);
		 			self = rawdata_obj;//assign the this to self again
		 			console.log('self.wb is: '+ typeof self.wb);
		 			console.log('found assessments for query: ');
		 			console.log(chassess.length);
		 			self.total_survs = chassess.length;//number of assessments/surveys found for the given query
		 			self.cur_surv_count = 1; 
		 			   
		 			   	 if (Array.isArray(chassess) && self.total_survs>1 ) {//if it is an array and the length of the survey is greater than one
			 				console.log('Array.isArray(chassess) && ch_rawdata.total_survs>1');
			 				for (; self.cur_surv_count <=self.total_survs;) {//for each survey item in the array
			 					self.cur_surv = chassess.shift();//remove current survey from the array	
			 				if(typeof self.cur_surv === 'object' && typeof self.cur_surv != null ){
				 				console.log('self.cur_surv is : '+ typeof self.cur_surv);
					 			console.log('self.wb is : '+ typeof self.wb);
					 			var srv_fac_id = self.cur_surv.Facility_ID;// Assign current Survey FACILITY_ID to find its details
					 			console.log('facility id: ' + srv_fac_id);
					 			console.log('item# : ' + self.cur_surv_count);
					 			var facidets2 = sync.await(self.findCurFaci(srv_fac_id, sync.defer()));// Facility information from the faility table
					 			console.log('facidets2 is : '+ typeof facidets2);
					 			console.log(facidets2);
					 			self.comp_dets = sync.await(self.getFaciDets(null,facidets2,sync.defer())); //Get organized facility deltails in row order plus assesmnet info
					 			console.log('self.comp_dets is : '+ typeof self.comp_dets);
					 			/*
									switch case for the sec_row pattern to apply (sane switch case for the section option.)
					 			*/
					 			switch(self.wb_options.surv_secTitle){
										case 'StaffTraining':
										//setExcel for StaffTraining
										console.log('Prepping the excel for StaffTraining');
										self.sec_rows = sync.await(self.getRowsArray(self.cur_surv,StaffTrainingRowPat,sync.defer()));//Get neatly arranged section rows with orderly columns
					 					console.log('On to the next..');
							 			console.log(self.sec_rows);
						 				self.wb = sync.await(self.setStaffTrainingExcel(self.wb, self.cur_surv, self.sec_rows, self.cells, sync.defer())) ;//add current survey to workbook object
										
										break;
										case 'HealthServices':
										//setExcel for HealthServices
										return;
										break;
										default:
										console.log('Unable to determinethe survey section name');
										return;
									}
					 			
				 				/* 
									here we will have a switch for each possible section option e.g
									setStaffTraining
									setHealthServices
									etc

									switch(wb_options.surv_secTitle){
		
									}
									
				 				*/
				 				console.log('cur_surv_count test = '+ self.cur_surv_count);
			 				}
			 				else if(self.cur_surv_count == self.total_survs) {//if the last survey in the array has been removed
			 					console.log('self.cur-surv is undefined');
			 					if(self.wb_ready=== true){//if the workbook has been checked as ready
			 						console.log('self.wb_ready = true');
				 					return self.write_dets = sync.await(self.writeSec1Book(self.wb,self.wb_filepath,self.wb_name, sync.defer()));//write the wb object to a file

				 				}
				 					else{
				 					console.log('self.wb_ready was false couldnt produce write file');
				 					return ;
				 				}
			 					
			 				}
				 			
			 				};
				 			
			 			} 
			 			else{
			 				//ADD code for just a single found survey
			 				console.log('only one found result');
			 			}
		 			
		 		}
		 	

		};

CH_RawData.prototype.getSecDataKeys = function(fsum_datakeys,pattern){
			//Function to return the datakeys matching a specified section pattern eg.CHV2SEC1BLK1RW
			var reg_pat = pattern;
			if(typeof reg_pat != null && typeof reg_pat  != undefined){
			re = new RegExp(reg_pat,'i');	//create a REgExp obj

			if(Array.isArray(fsum_datakeys)){// if datakeys are indeed an array of datakeys from cur_surv.Data
				console.log('array size is '+fsum_datakeys.length );
				console.log('returning col_blk_keys');
				var col_blk_keys = [];
				for (var i = 0; i < fsum_datakeys.length; i++) {//for each item in the fsum_datakeys
					var col_item = fsum_datakeys[i];//current fsum_datakey
					var myArray = re.exec(col_item);//exec the RegEx function with current fsum_datakey
					if(myArray !== null ){//if a match  was found
						col_blk_keys.push(myArray.input);//add the value of col_item to col_blk_keys
						console.log('displaying myArray item after pushing col_item #'+i );
						console.log(myArray);
					}else{//if the col_key didnot match the regex
						console.log('col_item #'+ i + ' was a regex mismatch');
						console.log('Check other sections');
						continue;
						}

				
				}
			
				return col_blk_keys;
			}

				else{
					console.log('failed my man, fsum_datakeys not of type Array');
					return;
				}
			}

			else{
				 console.log('regex pattern null or undefined');
				 return;
			}


			
			
		};

	CH_RawData.prototype.getRowsArray =  function(assess,pattern,cb ){
		/*
		Funtion to return array of organized columns of each row in section DataKeys
		*/
		self = this;
		if(assess){
			if(typeof assess!= undefined && typeof assess != null){
				console.log('Beginning getRowsArray function');
				var cell_points = self.cells;
				console.log('self.wb is : ' + typeof self.wb);
				if(typeof self.wb != undefined && typeof self.wb != null){
					var ch_survey = self.cur_surv;//the current survey to be written information for.
					var surv_keys = Object.keys(ch_survey.Data); // array of all the keys for the survey.Data object used to make sec_keys
					var sec_keys = self.getSecDataKeys(surv_keys,pattern);// Section datakeys according to rows. used to make rowArrays
					console.log('sec_keys'); 
					console.log(sec_keys);
					var sec_rows = self.makeRowsArray(sec_keys);//get array of rows in order with each col.
					console.log(sec_rows);
					console.log('returning sec_rows');
					cb(null, sec_rows);//cb returning the organized section rows
					
				}else{

					console.log('self.wb is empty');
					return;
				}

			}else{
				console.log('no faci_details argument in getRowsArray');
				return;
			}
		}else{
			console.log('no assess argument in getRowsArray');
			return;
			}
		};

	CH_RawData.prototype.getFaciDets =  function (err, facilitydets, cb){
		/*
		Function to return the complete details of a facility for a given survey
		*/
		console.log(' getting Faci dets for cur_survey');
		if(err != null){
			self.cur_faciDets = undefined;
			console.log(err);
			console.log('Error found Running getFaciDets');
			return;
		}
		else{
			if(facilitydets != undefined && facilitydets != null){
				self= this;
				console.log('self.cur_faciDets before: ');
				console.log(self.cur_faciDets);
				self.cur_faciDets = facilitydets;//get current facility information 
				console.log('self.cur_faciDets after: ');
				console.log(self.cur_faciDets);
				console.log('We got the dets for facility: ' + facilitydets.FacilityName);
				self.assess_dets  = self.getfaciAssessDets(self.cur_surv);//get the organized assessment details for an assessment
				console.log('self.assess_dets: ');
				console.log(self.assess_dets);
				console.log('cur_faciDets : ');
				console.log(self.cur_faciDets);
							if(Array.isArray(self.assess_dets)){
							console.log('assess_dets again: ');
							console.log(self.assess_dets);
							var faciliArr = [self.cur_faciDets.County,self.cur_faciDets.SubCounty,
							self.cur_faciDets.FacilityCode,self.cur_faciDets.FacilityName,
							self.cur_faciDets.Tier, 
							self.cur_faciDets.Type,
							self.cur_faciDets.Owner];// store all ecessary facility information for current facility
							var assessArr = self.assess_dets;
							var comp_dets= faciliArr.concat(assessArr);//combine the facility details and assessment arrayDetails to make complete facility details
							console.log('comp_dets: ');
							console.log(comp_dets);
							cb(null, comp_dets);
							//self.writeAssessmentToWb(self.cur_surv,comp_dets);
							//return comp_dets;

							}
							else{
								console.log('fac_info.assess_dets is not an array');
								return;
							}
			}
			else{
				 console.log('No facility details found');
				 console.log('We dont got nada');
				 console.log('Facility wasnt found, setting default facility data' );
				 var faciliArr = ['Not Found','Not Found',
							self.cur_surv.Facility_ID,'Not Found',
							'Not Found', 
							'Not Found',
							'Not Found'];
				self.assess_dets  = self.getfaciAssessDets(self.cur_surv);
				console.log('self.assess_dets: ');
				console.log(self.assess_dets);

				if(typeof self.assess_dets != null && typeof self.assess_dets != undefined && Array.isArray(self.assess_dets)){
					var assessArr = self.assess_dets;
					var comp_dets= faciliArr.concat(assessArr);
							console.log('comp_dets: ');
							console.log(comp_dets);
							cb(null, comp_dets);
				} else {
					console.log('assess_dets is not valid check type');
					return;
				}
				
			}
			
		}

	};

	CH_RawData.prototype.getSingleRowArray = function(secRowsCols1,row_pattern){
		/*
			function to return a single organized array of columns representing a rorw of Data
		*/
		var re = new RegExp(row_pattern, 'i');
		var cur_row = [];
		if(Array.isArray(secRowsCols1) && typeof row_pattern !== null && typeof row_pattern !== undefined){
			for (var i = 0; i < secRowsCols1.length; i++) {
				var cur_item = secRowsCols1[i];
				var rwMatch = re.exec(cur_item);//match regString for row
				if(rwMatch !== null){
					cur_row.push(rwMatch.input);//add match to cur_row array
					console.log('cur_item #'+ i + 'was a match for '+ row_pattern );
				}
				else{
					console.log('rwMatch was null');
					console.log('col_item : '+ cur_item + 'didn\'t match '+ row_pattern);
					continue;
				}
			}

			return cur_row; //return array of current row with matching columns
		}
	} ;

	CH_RawData.prototype.setStaffTrainingExcel =  function(wbk,ch_surv,s_datakeys,srt_stp, cb){

		/*
		Large function to generate the workbook object with survey data in place
		*/
		self = this;
	console.log('Launching setStaffTrainingExcel');
		// Get worksheet 
			if(typeof ch_surv == 'object' && typeof ch_surv != null && typeof wbk != undefined && typeof wbk != null && typeof s_datakeys != null && typeof s_datakeys != undefined)
			{	
				var faciDets = self.comp_dets;// complete organised facility information
				console.log('faciDets is : '+ typeof faciDets);
				var work_buch = {};
				var first_sheet = wbk.SheetNames[0];//get the name of the first sheet in the wb being read by XLSX
				 console.log('name of first sheet is : ' + first_sheet);
				 var worksheet = wbk.Sheets[first_sheet];//get the first sheet

				if(Array.isArray(s_datakeys) &&  typeof faciDets != undefined && typeof faciDets != undefined ){

					var col_srt = srt_stp.col_srt, col_end = srt_stp.col_end, //cell starting and ending column for survey.Data
					srv_srt = srt_stp.srv_srt, srv_end = srt_stp.srv_end;//cell start and end point for the facility data in the wb
					console.log('col_srt = '+ col_srt + ' col_end = '+ col_end);
					console.log('srv_srt = '+ srv_srt + ' srv_end = '+ srv_end)
					var de_col_srt = XLSX.utils.decode_cell(col_srt);//decode the start into an object of its row and col value
					var de_col_end = XLSX.utils.decode_cell(col_end);
					var de_srv_srt = XLSX.utils.decode_cell(srv_srt);
					var de_srv_end = XLSX.utils.decode_cell(srv_end);
					console.log('displaying decoded col_srt : ');
					console.log(de_col_srt);
					console.log('displaying decoded col_end: ');
					console.log(de_col_end);
					console.log('displaying decoded de_srv_srt :  ');
					console.log(de_srv_srt);
					console.log('displaying decoded de_srv_end: ');
					console.log(de_srv_end);

					var cur_col= de_col_srt.c,//set cur_col to the start etc
						cur_col_srv =de_srv_srt.c,
						col_dataky = 2,
						last_col = de_col_end.c,
						last_col_srv = de_srv_end.c,
						cur_rw = de_col_srt.r;//set current row
					console.log('cur_col  = '+ cur_col);


					for (; cur_col_srv <= last_col_srv;) {//for first cell for facility details to last
							for (var i = 0; i < faciDets.length;) { // run through each value for Facility details
								console.log(faciDets);
								var cell_add_faci= {c:cur_col_srv,r:cur_rw};
								var en_cell_add_faci = XLSX.utils.encode_cell(cell_add_faci); //encode back to cell name value e.g M9
								console.log('Writing to cell address '+ en_cell_add_faci);	
								worksheet[en_cell_add_faci] = {v:faciDets[i], t:'s'};//assign the value of faciDets to a worksheet cell
								/*console.log('datakey_rc : '+ datakey_rc);
								console.log('val_datakey_rc : ' + val_datakey_rc);
								worksheet[en_cell_add] = {v:val_datakey_rc, t:'s'};*///safe_val instead of val_datakey_rc
								cur_col_srv++;
								i++;
							};
						};


					for (; cur_col <= last_col;) {//for each column in the cell range
						for (var i = 0; i < s_datakeys.length; i++) {//for each row array in s_datakeys
							var cell_add= {c:cur_col,r:cur_rw};
							var en_cell_add = XLSX.utils.encode_cell(cell_add); //e.g M9
							console.log('Writing to cell address '+ en_cell_add);
							var datakey_rc = s_datakeys[i][col_dataky];//CHV2SEC1BLK1RW02COL04 address on assessment 
							var val_datakey_rc = ch_surv.Data[datakey_rc];//actual value of a datakey such as CHV2SEC1BLK1RW02COL04
							var safe_val = surv_datatypeCheck(val_datakey_rc);//check if it is a number , array or empty
								if (safe_val != undefined ) {
										console.log('datakey_rc : '+ datakey_rc);
										console.log('safe_val : ' + safe_val);
										worksheet[en_cell_add] = {v:safe_val, t:'n'};
								}else{
									console.log('safe_val at datakey_rc: '+ datakey_rc + 'was undefined');
									console.log('val_datakey_rc : ' + val_datakey_rc);
									break;
								}
							/*console.log('datakey_rc : '+ datakey_rc);
							console.log('val_datakey_rc : ' + val_datakey_rc);
							worksheet[en_cell_add] = {v:val_datakey_rc, t:'s'};*///safe_val instead of val_datakey_rc
							cur_col++;//increment the value of the current column to write to next cell
							
							if (cur_col == last_col && cur_col_srv==last_col_srv) {
								console.log('done with current survey');
								console.log('moving on');

							}
						};
						console.log('cur_col: '+ cur_col);
						console.log('cur_col_srv: '+ cur_col_srv);
						console.log('col_dataky is : ' + col_dataky);
						col_dataky++;//increment value to obtain next col_dataky containing next column item from current s_datakeys row array
					};

					nxt_rw = de_col_srt.r + 1; //increment the row to move to the next row in the worksheet

					var nw_colsrt = {c:de_col_srt.c , r:nxt_rw },nw_colend = {c:de_col_end.c , r:nxt_rw },
						 nw_srvsrt = {c:de_srv_srt.c , r:nxt_rw }, nw_srvend ={c:de_srv_end.c , r:nxt_rw } ;
					en_nw_colsrt = XLSX.utils.encode_cell(nw_colsrt);//encode new start to add next survey in the following row on worksheet
					en_nw_colend = XLSX.utils.encode_cell(nw_colend);
					en_nw_srvsrt = XLSX.utils.encode_cell(nw_srvsrt);
					en_nw_srvend = XLSX.utils.encode_cell(nw_srvend);
					

					 self.cells = {col_srt: en_nw_colsrt ,col_end: en_nw_colend ,
					 			srv_srt: en_nw_srvsrt , srv_end: en_nw_srvend };//assign CH_RawData.cells new value for next row
					 work_buch.wb = wbk;//wb with updated rows and columns
					 console.log('new start cells: ');
					 console.log(self.cells);
					 console.log('written current survey stuff to the row');
					 
					 console.log('cur_surv_count is: ' + self.cur_surv_count);
					 if(!(self.cur_surv_count >= self.total_survs)){//if self.cur_surv_count is still less than total number of surveys
					 	console.log('returning the wb');
					 	console.log('Bring the next one in for writing');
					 	self.cur_surv_count+=1;
					 	self.wb_ready = false;//workbook status is still incomplete
					 	cb(null,work_buch.wb) ;//cb return updated workbook
					 }
					 else if((self.cur_surv_count == self.total_survs)){// if at last survey
					 	console.log('total_survs = '+ self.total_survs);
					 	self.wb_ready = true;// update workbook completion status
					 	console.log('we are at an end : self.cur_surv_count == self.total_survs ');
					 	return cb(null,work_buch.wb) ; //return completed workbook
					 }
					 else{
					 	//incase for some reason the cur_surv_count is greater than actual total_number
					 	console.log('self.cur_surv_count ('+ self.cur_surv_count + ') is >= self.total_survs ');
					 	return;
					 }
				

				} 
				else{

					console.log('Sec Arrays expected, something else was found');
					return;


				}
				//work_buch.lastRow = x;
				

			} else {
				console.log('Error with ch_surv / wbk /s_datakeys make sure they are variables with values');
				return;
			}

		
		 
		 
		};

	CH_RawData.prototype.writeSec1Book =  function( wb_sec1,writepath_sec1,wb_name,cb ){
		/*
		function to write workbook to a file in rawdata/app/routes/uploads/
		*/
			if (typeof wb_sec1 != null && typeof wb_sec1!= undefined && writepath_sec1!=undefined) {

			
				
		 		console.log('Book wb_sec1 was defined , attempting to write');
		 		bk1=XLSX.writeFile(wb_sec1, writepath_sec1);//write to a file with given path


		 		if(typeof blk1 != undefined && typeof blk1 != null ){
		 			//fs.writeFileSync( bk1); 
		 			console.log('should be in the folder ' + writepath_sec1);
		 			sync.fiber(function(){
		 				var excel_wrt_stats = sync.await(fs.stat(writepath_sec1, sync.defer()));//check if the file exists in directory
			 			console.log('excel_wrt_stats: '+ typeof excel_wrt_stats );
			 			console.log(excel_wrt_stats);
			 			if(excel_wrt_stats){//if file found
			 				//console.log('content type : '+ res.get('Content-Type'));
			 				//res.download(write_filepath);
			 				console.log('File written...I think');
			 				var write_dets={};
			 				write_dets.write_filepath = writepath_sec1;
			 				write_dets.wb_name = wb_name;
			 				write_dets.wb = wb_sec1;
			 				return cb(null,write_dets);//send object with file details
			 				//return write_dets;
			 			}
			 			else{
			 				var write_dets = undefined;
			 				console.log('apparently the file couldnt be found');
			 				return ;
			 			}
		 			});
		 			
		 		}
		 		
		 	else
		 		{	
		 			var write_dets = undefined;
		 			 console.log('blk1 was undefined/null ');
		 			 return;
		 		}
		 		

		 	}else{
		 		console.log('Book was undefined');
		 		return;
		 	}
		};

	CH_RawData.prototype.getfaciAssessDets = function(ch_surv_det){

		/*
		Function to return array of Assessment information needed for facilityDetails section of wb
		*/
		 	console.log('starting the getfaciAssessDets function');
		 	console.log('ch_surv_det');
		 	console.log(ch_surv_det);
		 	console.log('ch_rawdata.cur_surv:');
		 	console.log(this.cur_surv);
		 	if(ch_surv_det!= undefined){
		 		var assessType = ch_surv_det.Survey;
			var spos  =assessType.length - 2;
			var lpos= assessType.length + 1;
			var version = assessType.substring(spos,lpos);//V2 or V1
			var assessDate = new Date(ch_surv_det.Date);//assessment date
			var dd = assessDate.getDate();//day value
			var mm = assessDate.getMonth()+1; //month value (January is 0)!

			var yyyy = assessDate.getFullYear();//year vaue
			if(dd<10){
			    dd='0'+dd//add a '0' for single digit days
			} 
			if(mm<10){
			    mm='0'+mm//add a '0' for single digit months
			} 
			var assessDateString = dd+'/'+mm+'/'+yyyy;

			var term = ch_surv_det.Assessment_Term;//Baseline etc
			var arr_assess_dets = [assessDateString,assessType,version, term];//['dd-mm-yy','CHV2','Baseline' ]
			return arr_assess_dets;
		 	} 
		 	else{

		 		console.log('undefined ch_surv_det');
		 		return;
		 	}
			
		};

	CH_RawData.prototype.makeRowsArray = function (secRowsCols){
		/*
		Function to make array of columns in order of respective column rows
		*/
		  	console.log('makeRowsArray function called');
		 if(Array.isArray(secRowsCols) ){
			var rowsArray = [];
			for (var i = 0; i < secRowsCols.length; i++) {
				var row_col = secRowsCols[i];
				var row_pat = row_col.substring(0,16);//e.g CHV2SEC1BLK1RW02
				console.log('look for rows like' );
				console.log(row_pat);
				if(i>0){
					var old_col = secRowsCols[ i -1];//old_col is prev item in secRowCols iteration
					var old_pat = old_col.substring(0,16);
					console.log('old_pat is: ');
					console.log(old_pat);
					if(old_pat === row_pat){//check if prev and current pattern match each other 
					console.log('cur_item #'+ i + ' has same row_pattern as the previous, skipping row');
					continue;	
					}
				}
				/*else{
					console.log('first cur_item. So Im setting old pattern');
					old_pat = secRowsCols[0].substring(0,16);
				}*/
			//using ch_rawdata.getSingleRowArray to make array of cols in a single row based on the row_pat
				var row = self.getSingleRowArray( secRowsCols,row_pat);
				if(Array.isArray(row)){//if single row is a row
					if(row.length >= 1){//if it has atleast 1 item
						rowsArray.push(row);//Make an array of rows with items of cols of the respective row
						console.log('pushed row to rowsArray');
					}
					else{
						console.log('row array was empty (no items) ');
						return;
					}
				}
			}

			return rowsArray;
		}
		else{
				console.log('secRowsCols or Assessment undefined');
				return;
			}
		};


function surv_datatypeCheck(val_datakey_rc){
	/*
	return the datakey value depending on its type
	*/
	if(typeof val_datakey_rc != 'undefined' && val_datakey_rc != null ){

	 		if(!Array.isArray(val_datakey_rc)){//if not an array
	 			if(typeof val_datakey_rc === 'number' || typeof val_datakey_rc === 'string'){
	 				//console.log(' val_datakey_rc is a number or string');
	 				return val_datakey_rc;

	 			}
	 		}
	 		else{//its an array
	 			console.log('array coming through');
	 			console.log(val_datakey_rc);
	 			var assess_col = val_datakey_rc;
	 			var arraystring='';
	 			for (var z = 0; z < assess_col.length; z++) {
	 				
	 				if(assess_col.length >1 && z != (assess_col.length - 1) )
	 				{

	 				arraystring += assess_col[z] + ','; //make string of array items separated by commas
	 				}
	 				else if(z == (assess_col.length - 1) || assess_col.length == 1){
	 					arraystring += assess_col[z] ;//if only one item in array
	 				}
	 				


	 			};
	 			
	 			console.log('returning arraystring from data array with : '+ assess_col.length);
	 			return arraystring;

	 		}
	 	}
	 	else{
	 				console.log('val_datakey_rc was undefined or null');
	 				console.log('val_datakey_rc value is : ');
	 				console.log(val_datakey_rc);
	 				return undefined ;
	 	}
};
 	/*Assessment.
 	find(query_s, function(err,assessments){
 		if(err){
 			console.log('we found errors');
 			console.log(err);
 			return err;
 		//return the assessments
 	}

 	else {

 		console.log(assessments.length);
 		console.log('returning assessments');
 		return assessments;
	}

});*/


module.exports= CH_RawData;





