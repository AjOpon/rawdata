 // use Array.isArray or Object.prototype.toString.call
// to differentiate regular objects from arrays
//typeof [1, 2, 4] === 'object';
 
 var XLSX = require('XLSX');
 var fs = require('fs');
 var sync = require('synchronize');
 var Assessment = require('../models/assessment');
 var Facility = require('../models/facility');

 function CH_RawData(setupInfo){
  this.cells= setupInfo.cells;
  this.wb_filepath = setupInfo.filepath_wb;
  this.wb = setupInfo.workbk;
  this.cur_surv = undefined;
  this.cur_faciDets  = undefined;
  this.sec_rows = undefined;
  this.wb_ready = false;

 };



 CH_RawData.prototype.findCurFaci= function(srv_fac_id, cb){

 	
	 	sync.fiber(function(){
	 		console.log('Beginning findCurFaci function');
 	var query_cur_faci  = Facility.findOne().where('FacilityCode').equals(srv_fac_id).select('County SubCounty FacilityCode FacilityName Tier Type Owner');
	 		facidets1 = sync.await(query_cur_faci.exec(sync.defer()));
	 		console.log('facidets1 is : '+ typeof facidets1);
	 		console.log(facidets1);
	 		//self.cur_surv_count += 1;
	 		cb(null,facidets1);
	 		//return self.getFaciDets();
	 		//query_cur_faci.exec(self.getFaciDets)
	 		
	 		}
 		);
 	
	

 };


 CH_RawData.prototype.getCHAssessments = function(cb){
 self = this; //store reference to original CH-RawData Object
 console.log('this.filepath: '+ self.wb_filepath);
 console.log('this.wb: '+ typeof self.wb);
 console.log('Beginning getCHAssessments function...');
 var quer = Assessment.find().where('Survey').equals('CHV2').where('Status').equals('Submitted').limit(100);
 console.log('/ch_excel route is about to query for assessments');
 sync.fiber(function(){
 	var chassess1 = sync.await(quer.exec(sync.defer()));
 	console.log('chassess1 is : ' + typeof chassess1);
 	self.getValidCHAssessments(null,chassess1,self);
 	cb(null,self.write_dets);
 });


 };


 CH_RawData.prototype.getValidCHAssessments = function(err, chassess,rawdata_obj){
			
		 	//var query_s= { /*'Survey': { $in: ['CHV1', 'CHV2'] },*/ 'Status' : 'Submitted'};
		 	if (err != null) {
		 		console.log(error);
		 		res.send(err);
		 		return err;
		 	}
		 		else{
		 			console.log('rawdata_obj is: '+ typeof rawdata_obj);
		 			self = rawdata_obj;
		 			console.log('self.wb is: '+ typeof self.wb);
		 			console.log('found assessments for query: ');
		 			console.log(chassess.length);
		 			//this.all_ch_survs = JSON.parse(JSON.stringify(chassess));
		 			self.total_survs = chassess.length;
		 			self.cur_surv_count = 1;
		 			/*
		 			ch_rawdata.cur_surv = chassess.shift();

			 			console.log(ch_rawdata.cur_surv);
			 			var srv_fac_id = ch_rawdata.cur_surv.Facility_ID;
			 			console.log('facility id: ' + srv_fac_id);
			 			console.log(ch_rawdata.getFaciDets);
			 			var query_cur_faci  = Facility.findOne().where('FacilityCode')
			 			.equals(srv_fac_id)
			 			.select('County SubCounty FacilityCode FacilityName Tier Type Owner');
		 			   query_cur_faci.exec(ch_rawdata.getFaciDets);*/
		 			   
		 			   	 if (Array.isArray(chassess) && self.total_survs>1 ) {
			 				console.log('Array.isArray(chassess) && ch_rawdata.total_survs>1');
			 				for (; self.cur_surv_count <=self.total_survs;) {
			 					self.cur_surv = chassess.shift();	
			 				if(typeof self.cur_surv === 'object' ){
				 				console.log('self.cur_surv is : '+ typeof self.cur_surv);
					 			console.log('this.wb test is : '+ typeof self.wb);
					 			console.log('self.wb test is : '+ typeof self.wb);
					 			var srv_fac_id = self.cur_surv.Facility_ID;
					 			console.log('facility id: ' + srv_fac_id);
					 			console.log('item# : ' + self.cur_surv_count);
					 			console.log(self.getFaciDets);
					 			var facidets2 = sync.await(self.findCurFaci(srv_fac_id, sync.defer()));
					 			console.log('facidets2 is : '+ typeof facidets2);
					 			console.log(facidets2);
					 			self.comp_dets = sync.await(self.getFaciDets(null,facidets2,sync.defer()));
					 			console.log('self.comp_dets is : '+ typeof self.comp_dets);
					 			self.sec_rows = sync.await(self.getRowsArray(self.cur_surv,sync.defer()));
					 			console.log('On to the next..');
				 				self.wb = sync.await(self.setFacilitySummaryExcel(self.wb, self.cur_surv, self.sec_rows, self.cells, sync.defer())) ;
				 				console.log('cur_surv_count test = '+ self.cur_surv_count);
			 				}
			 				else if(self.cur_surv_count == self.total_survs) {
			 					console.log('self.cur-surv is undefined');
			 					if(self.wb_ready=== true){
			 						console.log('self.wb_ready = true');
				 					return self.write_dets = sync.await(self.writeSec1Book(self.wb,self.wb_filepath, sync.defer()));

				 				}
				 					else{
				 					return console.log('self.wb_ready was false couldnt produce write file');
				 				}
			 					
			 				}
				 			
			 				};
				 			
			 			} 
			 			else{
			 				console.log('only one found result');
			 			}
		 			   
			 			
		 			
					
		 			//console.log('Completed storing found Facility IDs');
		 			//get
		 			//this.setupSurveyExcelSection(chassess);
		 			//res.send(ch_surv_data);
		 			//chassessments = chassess;
		 			//return chassess;
		 		}
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

		};

CH_RawData.prototype.getSecDataKeys = function(fsum_datakeys,pattern){
			var reg_pat;
			reg_pat = pattern;
			if(reg_pat != null && reg_pat != undefined){
			re = new RegExp(reg_pat,'i');	

			if(Array.isArray(fsum_datakeys)){
				console.log('array size is '+fsum_datakeys.length );
				console.log('returning col_blk_keys');
				var col_blk_keys = [];
				for (var i = 0; i < fsum_datakeys.length; i++) {
					var col_item = fsum_datakeys[i];
					var myArray = re.exec(col_item);
					if(myArray !== null ){
						col_blk_keys.push(myArray.input);
						console.log('displaying myArray item after pushing col_item #'+i );
						console.log(myArray);
						//console.log(col_blk_keys);
					}else{
						console.log('col_item #'+ i + ' was a regex mismatch');
						console.log('Check other sections');
						continue;
				}

				
			}
			
				return col_blk_keys;
			}

				else{
					return 'failed my man, fsum_datakeys not of type Array';
				}
			}

			else{
				return console.log('regex pattern null or undefined');
			}


			
			
		};

	CH_RawData.prototype.getRowsArray =  function(assess,cb ){
		self = this;
		if(assess){
			if(assess!= undefined){
				console.log('Beginning getRowsArray function');
				var cell_points = self.cells;
				console.log('self.wb is : ' + typeof self.wb);
				if(self.wb != undefined){
					var ch_survey = self.cur_surv;//the current survey to be written information for.
					var surv_keys = Object.keys(ch_survey.Data); // array of all the keys for the survey.Data object used to make sec_keys
					var sec_keys = self.getSecDataKeys(surv_keys,'CHV2SEC1BLK1RW');// Section 1 datakeys according to rows. used to make rowArrays
					console.log('sec_keys'); 
					console.log(sec_keys);
					var sec_rows = self.makeRowsArray(sec_keys,ch_survey);//get array of rows in order with each col.
					console.log(sec_rows);
					console.log('returning sec_rows');
					cb(null, sec_rows);
					// self.wb = self.setFacilitySummaryExcel(self.wb, ch_survey, sec_rows, self.cells);
				}else{

					return console.log('self.wb is empty');
				}

			}else{
				console.log('no faci_details argument in getRowsArray');
			}
		}else{
			console.log('no assess argument in getRowsArray');
		}
		};

	CH_RawData.prototype.getFaciDets =  function (err, facilitydets, cb){
		console.log(' getting Faci dets for cur_survey');
		if(err){
			self.cur_faciDets = undefined;
			return console.log(err);
		}
		else{
			if(facilitydets != undefined && facilitydets != null){
				self= this;
				console.log('self.cur_faciDets before: ');
				console.log(self.cur_faciDets);
				self.cur_faciDets = facilitydets;
				console.log('self.cur_faciDets after: ');
				console.log(self.cur_faciDets);
				console.log('We got the dets for facility: ' + facilitydets.FacilityName);
				self.assess_dets  = self.getfaciAssessDets(self.cur_surv);
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
							assessArr = self.assess_dets;
							comp_dets= faciliArr.concat(assessArr);
							console.log('comp_dets: ');
							console.log(comp_dets);
							cb(null, comp_dets);
							//self.writeAssessmentToWb(self.cur_surv,comp_dets);
							//return comp_dets;

							}
							else{
								return console.log('fac_info.assess_dets is not an array');
							}
			}
			else{
				return console.log('We dont got nada');
			}
			
		}

	};

	CH_RawData.prototype.getSingleRowArray = function(secRowsCols1,row_pattern){
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

	CH_RawData.prototype.setFacilitySummaryExcel =  function(wbk,ch_surv,s_datakeys,srt_stp, cb){
		self = this;
	console.log('Launching setFacilitySummaryExcel');
		// Get worksheet 
			if(typeof ch_surv == 'object' && wbk != undefined && wbk != null && s_datakeys != null)
			{	
				var faciDets = self.comp_dets;
				console.log('faciDets is : '+ typeof faciDets);
				var work_buch = {};
				var first_sheet = wbk.SheetNames[0];
				 console.log('name of first sheet is : ' + first_sheet);
				 var worksheet = wbk.Sheets[first_sheet];

				if(Array.isArray(s_datakeys) &&  typeof faciDets != undefined ){

					var col_srt = srt_stp.col_srt, col_end = srt_stp.col_end, //get starting and ending column for survey.Data
					srv_srt = srt_stp.srv_srt, srv_end = srt_stp.srv_end;
					console.log('col_srt = '+ col_srt + ' col_end = '+ col_end);
					console.log('srv_srt = '+ srv_srt + ' srv_end = '+ srv_end)
					var de_col_srt = XLSX.utils.decode_cell(col_srt);
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

					var cur_col= de_col_srt.c,
						cur_col_srv =de_srv_srt.c,
						col_dataky = 2,
						last_col = de_col_end.c,
						last_col_srv = de_srv_end.c,
						cur_rw = de_col_srt.r;
					console.log('cur_col  = '+ cur_col);


					for (; cur_col_srv <= last_col_srv;) {//for first cell for facility details to last
							for (var i = 0; i < faciDets.length;) { // run through each value for Facility details
								console.log(faciDets);
								var cell_add_faci= {c:cur_col_srv,r:cur_rw};
								var en_cell_add_faci = XLSX.utils.encode_cell(cell_add_faci); //e.g M9
								console.log('Writing to cell address '+ en_cell_add_faci);	
								worksheet[en_cell_add_faci] = {v:faciDets[i], t:'s'};
								/*console.log('datakey_rc : '+ datakey_rc);
								console.log('val_datakey_rc : ' + val_datakey_rc);
								worksheet[en_cell_add] = {v:val_datakey_rc, t:'s'};*///safe_val instead of val_datakey_rc
								cur_col_srv++;
								i++;
							};
						};


					for (; cur_col <= last_col;) {
						for (var i = 0; i < s_datakeys.length; i++) {
							var cell_add= {c:cur_col,r:cur_rw};
							var en_cell_add = XLSX.utils.encode_cell(cell_add); //e.g M9
							console.log('Writing to cell address '+ en_cell_add);
							var datakey_rc = s_datakeys[i][col_dataky];//CHV2SEC1BLK1RW02COL04 address on assessment 
							var val_datakey_rc = ch_surv.Data[datakey_rc];
							var safe_val = surv_datatypeCheck(val_datakey_rc);
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
							cur_col++;
							
							if (cur_col == last_col && cur_col_srv==last_col_srv) {
								console.log('done with current survey');
								console.log('moving on');

							}
						};
						console.log('cur_col: '+ cur_col);
						console.log('cur_col_srv: '+ cur_col_srv);
						console.log('col_dataky is : ' + col_dataky);
						col_dataky++;
					};

					nxt_rw = de_col_srt.r + 1; 

					var nw_colsrt = {c:de_col_srt.c , r:nxt_rw },nw_colend = {c:de_col_end.c , r:nxt_rw },
						 nw_srvsrt = {c:de_srv_srt.c , r:nxt_rw }, nw_srvend ={c:de_srv_end.c , r:nxt_rw } ;
					en_nw_colsrt = XLSX.utils.encode_cell(nw_colsrt);
					en_nw_colend = XLSX.utils.encode_cell(nw_colend);
					en_nw_srvsrt = XLSX.utils.encode_cell(nw_srvsrt);
					en_nw_srvend = XLSX.utils.encode_cell(nw_srvend);
					
					//xlsx.writeFile(workbook, 'rand.xlsx');
					/* console.log('start column index : '+  m_index );
					 console.log('end column index : '+  ad_index);*/

					 self.cells = {col_srt: en_nw_colsrt ,col_end: en_nw_colend ,
					 			srv_srt: en_nw_srvsrt , srv_end: en_nw_srvend };
					 work_buch.wb = wbk;
					 console.log('new start cells: ');
					 console.log(self.cells);
					 console.log('written current survey stuff to the row');
					 
					 console.log('cur_surv_count is: ' + self.cur_surv_count);
					 if(!(self.cur_surv_count >= self.total_survs)){
					 	console.log('returning the wb');
					 	console.log('Bring the next one in for writing');
					 	self.cur_surv_count+=1;
					 	self.wb_ready = false;
					 	cb(null,work_buch.wb) ;
					 }
					 else if((self.cur_surv_count == self.total_survs)){
					 	console.log('total_survs = '+ self.total_survs);
					 	self.wb_ready = true;
					 	console.log('we are at an end : self.cur_surv_count == self.total_survs ');
					 	return cb(null,work_buch.wb) ;
					 }
					 else{
					 	console.log('self.cur_surv_count ('+ self.cur_surv_count + ') is >= self.total_survs ');
					 }
				

				} 
				else{

					console.log('Sec Arrays expected, something else was found');

				}
				//work_buch.lastRow = x;
				

			} else {
				console.log('Error with ch_surv / wbk /s_datakeys make sure they are variables with values');
			}

		
		 
		 
		};

	CH_RawData.prototype.writeSec1Book =  function( wb_sec1,writepath_sec1,cb ){
			if (typeof wb_sec1 != null && typeof wb_sec1!= undefined && writepath_sec1!=undefined) {

		 		console.log('Book wb_sec1 was defined , attempting to write');
		 		bk1=XLSX.writeFile(wb_sec1, writepath_sec1);
		 		if(typeof blk1 != undefined && typeof blk1 != null ){
		 			//fs.writeFileSync( bk1); 
		 			console.log('should be in the folder ' + writepath_sec1);
		 			sync.fiber(function(){
		 				var excel_wrt_stats = sync.await(fs.stat(writepath_sec1, sync.defer()));
			 			console.log('excel_wrt_stats: '+ typeof excel_wrt_stats );
			 			console.log(excel_wrt_stats);
			 			if(excel_wrt_stats){
			 				//console.log('content type : '+ res.get('Content-Type'));
			 				//res.download(write_filepath);
			 				console.log('File written...I think');
			 				var write_dets={};
			 				write_dets.write_filepath = writepath_sec1;
			 				write_dets.wb = wb_sec1;
			 				return cb(null,write_dets);
			 				//return write_dets;
			 			}
			 			else{
			 				var write_dets = undefined;
			 				return console.log('apparently the file couldnt be found');
			 			}
		 			});
		 			
		 		}
		 		else
		 		{	
		 			var write_dets = undefined;
		 			return console.log('blk1 was undefined/null ');
		 		}
		 		
		 		

		 	}else{
		 		console.log('Book was undefined');
		 	}
		};

	CH_RawData.prototype.getfaciAssessDets = function(ch_surv_det){
		 	console.log('starting the getfaciAssessDets function');
		 	console.log('ch_surv_det');
		 	console.log(ch_surv_det);
		 	console.log('ch_rawdata.cur_surv:');
		 	console.log(this.cur_surv);
		 	if(ch_surv_det!= undefined){
		 		var assessType = ch_surv_det.Survey;
			var spos  =assessType.length - 2;
			var lpos= assessType.length + 1;
			var version = assessType.substring(spos,lpos);
			var term = ch_surv_det.Assessment_Term;
			var arr_assess_dets = [assessType,version, term];
			return arr_assess_dets;
		 	} 
		 	else{

		 		console.log('undefined ch_surv_det');
		 	}
			
		};

	CH_RawData.prototype.makeRowsArray = function (secRowsCols, assessment){
		  	console.log('makeRowsArray function called');
		 if(Array.isArray(secRowsCols) && typeof assessment !== null && typeof assessment !== undefined ){
			var rowsArray = [];
			for (var i = 0; i < secRowsCols.length; i++) {
				var row_col = secRowsCols[i];
				var row_pat = row_col.substring(0,16);//e.g CHV2SEC1BLK1RW02
				console.log('look for rows like' );
				console.log(row_pat);
				if(i>0){
					old_col = secRowsCols[ i -1];//old_col is prev item in secRowCols iteration
					old_pat = old_col.substring(0,16);
					console.log('old_pat is: ');
					console.log(old_pat);
					if(old_pat === row_pat){
					console.log('cur_item #'+ i + ' has same row_pattern as the previous, skipping row');
					continue;	
					}
				}
				else{
					console.log('first cur_item. So Im setting old pattern');
					old_pat = secRowsCols[0];
				}
			//using ch_rawdata.getSingleRowArray to make array of cols in a single row based on the row_pat
				var row = self.getSingleRowArray( secRowsCols,row_pat);
				if(Array.isArray(row)){
					if(row.length >= 1){
						rowsArray.push(row);//Make an array of rows with items of cols of the respective row
						console.log('pushed row to rowsArray');
					}
					else{
						console.log('row array was empty (no items) ');
					}
				}
			}

			return rowsArray;
		}
		else{
				console.log('secRowsCols or Assessment undefined');
			}
		};

function isStatSync(aPath) {
  try {
    return fs.statSync(aPath).isFile();
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
};

function surv_datatypeCheck(val_datakey_rc){
	if(typeof val_datakey_rc != 'undefined' && val_datakey_rc != null ){
	 		if(!Array.isArray(val_datakey_rc)){
	 			if(typeof val_datakey_rc === 'number' || typeof val_datakey_rc === 'string'){
	 				//console.log(' val_datakey_rc is a number or string');
	 				return val_datakey_rc;

	 			}
	 		}
	 		else{
	 			console.log('array coming through');
	 			console.log(val_datakey_rc);
	 			var assess_col = val_datakey_rc;
	 			var arraystring='';
	 			for (var z = 0; z < assess_col.length; z++) {
	 				
	 				if(assess_col.length >1 && z != (assess_col.length - 1) )
	 				{

	 				arraystring += assess_col[z] + ','; 
	 				}
	 				if(z == (assess_col.length - 1) || assess_col.length == 1){
	 					arraystring += assess_col[z] ;
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





