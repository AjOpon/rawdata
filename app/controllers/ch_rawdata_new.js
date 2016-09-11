 // use Array.isArray or Object.prototype.toString.call
// to differentiate regular objects from arrays
//typeof [1, 2, 4] === 'object';
 var Facility = require('../models/facility');
 var ch_rawdata2 = {
 	cur_surv2 :undefined,
 	cur_surv3 :undefined,
 };
 var ch_rawdata = {
 	all_ch_survs :undefined,
 	cur_surv :undefined,
 	total_survs: undefined,
 	cur_surv_count: undefined,
 	cur_faciDets: undefined,
 	assess_dets: undefined,
 	faci_detsAll: undefined,
 	wb: undefined ,
 	wb_filepath: undefined,
 	wb_ready: false,
 	cells: {col_srt: 'M9', col_end: 'AD9', srv_srt: 'B9', srv_end:'L9'},

 	makeRowsArray : function (secRowsCols, assessment){
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
				var row = ch_rawdata.getSingleRowArray( secRowsCols,row_pat);
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
		},

	getValidCHAssessments : function(err, chassess){
			
		 	//var query_s= { /*'Survey': { $in: ['CHV1', 'CHV2'] },*/ 'Status' : 'Submitted'};
		 	if (err != null) {
		 		console.log(error);
		 		res.send(err);
		 		return err;
		 	}
		 		else{
		 			console.log('founc assessments for query: ');
		 			console.log(chassess.length);
		 			//this.all_ch_survs = JSON.parse(JSON.stringify(chassess));
		 			ch_rawdata.total_survs = chassess.length;
		 			ch_rawdata.cur_surv_count = 1;/*
		 			ch_rawdata.cur_surv = chassess.shift();

			 			console.log(ch_rawdata.cur_surv);
			 			var srv_fac_id = ch_rawdata.cur_surv.Facility_ID;
			 			console.log('facility id: ' + srv_fac_id);
			 			console.log(ch_rawdata.getFaciDets);
			 			var query_cur_faci  = Facility.findOne().where('FacilityCode')
			 			.equals(srv_fac_id)
			 			.select('County SubCounty FacilityCode FacilityName Tier Type Owner');
		 			query_cur_faci.exec(ch_rawdata.getFaciDets);*/
		 			if (Array.isArray(chassess) && ch_rawdata.total_survs>1) {
		 				console.log('Array.isArray(chassess) && ch_rawdata.total_survs>1');
		 				for (; ch_rawdata.cur_surv_count <=ch_rawdata.total_survs;) {
		 					ch_rawdata2.cur_surv2 = ch_rawdata.cur_surv = chassess.shift();	
			 			console.log(ch_rawdata.cur_surv);
			 			var srv_fac_id = ch_rawdata.cur_surv.Facility_ID;
			 			console.log('facility id: ' + srv_fac_id);
			 			console.log(ch_rawdata.getFaciDets);
			 			var query_cur_faci  = Facility.findOne().where('FacilityCode')
			 			.equals(srv_fac_id)
			 			.select('County SubCounty FacilityCode FacilityName Tier Type Owner');
			 			query_cur_faci.exec(ch_rawdata.getFaciDets);
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

		},
	getSecDataKeys : function(fsum_datakeys,pattern){
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


			
			
		},

	writeAssessmentToWb : function(assess, faci_details  ){
		if(assess){
			if(faci_details != undefined){
				console.log('Beginning writeAssessmentToWb function');
				var cell_points = ch_rawdata.cells;
				if(ch_rawdata.wb != undefined){
					var ch_survey = ch_rawdata.cur_surv;//the current survey to be written information for.
					var surv_keys = Object.keys(ch_survey.Data); // array of all the keys for the survey.Data object
					var sec_keys = ch_rawdata.getSecDataKeys(surv_keys,'CHV2SEC1BLK1RW');// Section 1 datakeys according to rows.
					console.log('sec_keys'); 
					console.log(sec_keys);
					var sec_rows = ch_rawdata.makeRowsArray(sec_keys,ch_survey);//get array of rows in order with each col
					console.log(sec_rows);
					var sec_wb = ch_rawdata.wb;
					 ch_rawdata.wb = ch_rawdata.setFacilitySummaryExcel(ch_rawdata.wb, ch_survey, sec_rows, ch_rawdata.cells);
				}else{
					return console.log('ch_rawdata.wb is empty');
				}

			}else{
				console.log('no faci_details argument in writeAssessmentToWb')
			}
		}else{
			console.log('no assess argument in writeAssessmentToWb')
		}
		},
	setupSurveyExcelSection : function(array) {
		 		console.log('Starting Survey Setup to run through array');
		 		console.log('Length of survey as array with items is: ');
		 		console.log(array.length);

		 if(Array.isArray(array)){//check if it arg is a valid array

		 	console.log('Beginning to run through array for provided survey');	
		 	x = 0;

		//MAIN FUNCTION CALLS

		 	var celladdrs = {col_srt: 'M9', col_end: 'AD9', srv_colsrt: 'B9', srv_colend:'L9'}, cell_range = 'A0:AH';
		 
		 	console.log('Setting first assessment');
		 	//Remove first element in arrray of assessments

		 	ch_surv_data.firstAssess = array.shift();//take first survey in array
		 	ch_surv_data.datakeys=Object.keys(ch_surv_data.firstAssess.Data);//create datakeys array from key values of survey.Data object items
		 	//surveydata_check(ch_surv_data.firstAssess,ch_surv_data.datakeys);
		 	ch_surv_data.col_blk1 = ch_rawdata.getSecDataKeys(ch_surv_data.datakeys,'CHV2SEC1BLK1RW');// Section 1 datakeys according to rows. 
		 	ch_surv_data.SecRowsArray= makeRowsArray(ch_surv_data.col_blk1, ch_surv_data.firstAssess);//get array row arrays with respective columns
		 	ch_rawdata.FaciSumCurSurv = ch_surv_data.firstAssess;
		 	console.log('Showing FaciSumCurSurv');
		 	console.log(ch_rawdata.FaciSumCurSurv);
		 	ch_surv_data.workbook_first = ch_rawdata.setFacilitySummaryExcel(workbook, ch_surv_data.firstAssess, ch_surv_data.SecRowsArray, celladdrs);

		 	wb_first = ch_surv_data.workbook_first;
		 	console.log('next up should be the setFaciSumInfoExcel');

		 	var cell_srt_de = XLSX.utils.decode_cell(celladdrs.col_srt);
		 	console.log('cell_srt_de: '+ cell_srt_de );
		 	var srv_colsrt_de = XLSX.utils.decode_cell(celladdrs.srv_colsrt);
		 	console.log('cell_srt_de: '+ srv_colsrt_de );
		 	var cell_end_de = XLSX.utils.decode_cell(celladdrs.col_end);
		 	console.log('cell_end_de: '+ cell_end_de);
		 	var srv_colend_de = XLSX.utils.decode_cell(celladdrs.srv_colend);
		 	console.log('cell_end_de: '+ srv_colend_de);

		 	old_len = array.length;
		 	console.log('old_len: '+ old_len);
		 	for (var i = 0; i < old_len; i++) {
		 		cur_celladdrs = {};
		 		cell_srt_de.r = cell_srt_de.r+1 ;//change to next start col on new row 
		 		cell_end_de.r = cell_end_de.r+1;//change to next end col on new row
		 		srv_colsrt_de.r = srv_colsrt_de.r+1;
		 		srv_colend_de.r = srv_colend_de.r+1;
		 		cur_celladdrs.col_srt = XLSX.utils.encode_cell(cell_srt_de);// convert col to 'A1' type
		 		cur_celladdrs.col_end = XLSX.utils.encode_cell(cell_end_de);// convert col to 'A1' type
		 		cur_celladdrs.srv_colsrt = XLSX.utils.encode_cell(srv_colsrt_de);// convert col to 'A1' type
		 		cur_celladdrs.srv_colend = XLSX.utils.encode_cell(srv_colend_de);
		 		console.log('next survey at cur_celladdrs.col_srt = '+ cur_celladdrs.col_srt+ ' , cur_celladdrs.srv_colsrt = '+ cur_celladdrs.srv_colsrt );
		 		console.log('next survey at cur_celladdrs.col_end = '+ cur_celladdrs.col_end + ', cur_celladdrs.srv_colend = ' + cur_celladdrs.srv_colend );
		 		cur_Assess = array.shift();
		 		ch_rawdata.FaciSumCurSurv = cur_Assess;
		 		cur_Datakeys = Object.keys(cur_Assess.Data);
		 		cur_RowswColsArr=  ch_rawdata.makeRowsArray(ch_surv_data.col_blk1, cur_Assess);
		 		wb_first = ch_rawdata.setFacilitySummaryExcel(wb_first, cur_Assess, cur_RowswColsArr, cur_celladdrs);
		 		ch_rawdata.FaciSumCurWb = wb_first; //Set object property for current workbook with excel data modified
		 	};
		 	/*if (typeof wb_first != null && typeof wb_first!= undefined) {
		 		console.log('Book was defined , attempting to write');
		 		var sheet_nm = wb_first.SheetNames[0];
		 		wb_first.Sheets[sheet_nm]['!ref'] = "A1:AH10000"; 
		 		write_dets = ch_rawdata.writeSec1Book(wb_first,write_filepath );
		 		//bk1=XLSX.writeFile(wb_first, write_filepath);
		 		if(typeof write_dets != undefined && typeof write_dets != null ){
		 			//fs.writeFileSync( bk1); 
		 			console.log('should be in the folder ' + write_dets.write_filepath);
		 			res.download(write_dets.write_filepath);
		 			console.log('File written and sent...');
		 		}
		 		else
		 		{
		 			console.log('blk1 was undefined/null ');
		 		}
		 		
		 		

		 	}else{
		 		console.log('Book was undefined');
		 	}*/
		 }
		 	else
		 	{
		 			console.log('that wan\'snt an array');
		 			return 'failed to assessprops 2';
		 	}
		  

		},	

	getFaciDets : function (err, facilitydets){
		console.log(' getting Faci dets for cur_survey');
		if(err){
			ch_rawdata.cur_faciDets = undefined;
			return console.log(err);
		}
		else{
			if(facilitydets != undefined && facilitydets != null){
				console.log('ch_rawdata.cur_faciDets before: ');
				console.log(ch_rawdata.cur_faciDets);
				ch_rawdata.cur_faciDets = facilitydets;
				console.log('ch_rawdata.cur_faciDets after: ');
				console.log(ch_rawdata.cur_faciDets);
				console.log('We got the dets for facility: ' + facilitydets.FacilityName);
				console.log('ch_rawdata2.cur_surv2:');
		 		console.log(ch_rawdata2.cur_surv2);
				ch_rawdata.assess_dets  = ch_rawdata.getfaciAssessDets(ch_rawdata.cur_surv);
				console.log('ch_rawdata.assess_dets: ');
				console.log(ch_rawdata.assess_dets);
				console.log('cur_faciDets : ');
				console.log(ch_rawdata.cur_faciDets);
							if(Array.isArray(ch_rawdata.assess_dets)){
							console.log('assess_dets again: ');
							console.log(ch_rawdata.assess_dets);
							var faciliArr = [ch_rawdata.cur_faciDets.County,ch_rawdata.cur_faciDets.SubCounty,
							ch_rawdata.cur_faciDets.FacilityCode,ch_rawdata.cur_faciDets.FacilityName,
							ch_rawdata.cur_faciDets.Tier, 
							ch_rawdata.cur_faciDets.Type,
							ch_rawdata.cur_faciDets.Owner];// store all ecessary facility information for current facility
							assessArr = ch_rawdata.assess_dets;
							comp_dets= faciliArr.concat(assessArr);
							console.log('comp_dets: ');
							console.log(comp_dets);
							ch_rawdata.faci_detsAll = comp_dets;
							ch_rawdata.writeAssessmentToWb(ch_rawdata.cur_surv,comp_dets);

							}
							else{
								return console.log('fac_info.assess_dets is not an array');
							}
			}
			else{
				return console.log('We dont got nada');
			}
			
		}

	},

	getSingleRowArray: function(secRowsCols1,row_pattern){
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
	},

	setFacilitySummaryExcel: function(wbk,ch_surv,s_datakeys,srt_stp){

	console.log('Launching setFacilitySummaryExcel');
		// Get worksheet 
			if(typeof ch_surv == 'object' && wbk != undefined && wbk != null && s_datakeys != null)
			{	
				var faciDets = ch_rawdata.faci_detsAll;
				console.log('faciDets: ');
				console.log(faciDets);
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
							for (var i = 0; i < faciDets.length; i++) { // run through each value for Facility details
								
								var cell_add_faci= {c:cur_col_srv,r:cur_rw};
								var en_cell_add_faci = XLSX.utils.encode_cell(cell_add_faci); //e.g M9
								console.log('Writing to cell address '+ en_cell_add_faci);	
								worksheet[en_cell_add] = {v:faciDets[i], t:'n'};
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

					 ch_rawdata.cells = {col_srt: en_nw_colsrt ,col_end: en_nw_colend ,
					 			srv_srt: en_nw_srvsrt , srv_end: en_nw_srvend };
					 work_buch.wb = wbk;
					 console.log('new start cells: ');
					 console.log(ch_rawdata.cells);
					 console.log('written current survey stuff to the row');
					 ch_rawdata.cur_surv_count++;
					 console.log('cur_surv_count is: ' + ch_rawdata.cur_surv_count);
					 if(!ch_rawdata.cur_surv_count == ch_rawdata.total_survs){
					 	return work_buch.wb;
					 }
					 else{
					 	ch_rawdata.wb = work_buch.wb;
					 }
				

				} 
				else{

					console.log('Sec Arrays expected, something else was found');

				}
				//work_buch.lastRow = x;
				

			} else {
				console.log('Error with ch_surv / wbk /s_datakeys make sure they are variables with values');
			}

		
		 
		 
		},

		 writeSec1Book : function( wb_sec1,writepath_sec1 ){
			if (typeof wb_sec1 != null && typeof wb_sec1!= undefined && wb_filepath!=undefined) {

		 		console.log('Book wb_sec1 was defined , attempting to write');
		 		bk1=XLSX.writeFile(wb_sec1, writepath_sec1);
		 		if(typeof blk1 != undefined && typeof blk1 != null ){
		 			//fs.writeFileSync( bk1); 
		 			console.log('should be in the folder ' + writepath_sec1);
		 			var excel_wrt_stats = isStatSync(writepath_sec1);
		 			console.log('excel_wrt_stats: '+ excel_wrt_stats );
		 			if(excel_wrt_stats){
		 				console.log('content type : '+ res.get('Content-Type'));
		 				res.download(write_filepath);
		 				console.log('File written and sent...I think');
		 				var write_dets={};
		 				write_dets.write_filepath = writepath_sec1;
		 				write_dets.wb = wb_sec1;
		 				return write_dets;
		 			}
		 			else{
		 				var write_dets = undefined;
		 				return console.log('apparently the file couldnt be found');
		 			}
		 		}
		 		else
		 		{	
		 			var write_dets = undefined;
		 			return console.log('blk1 was undefined/null ');
		 		}
		 		
		 		

		 	}else{
		 		console.log('Book was undefined');
		 	}
		},

		 getfaciAssessDets : function(ch_surv_det){
		 	console.log('starting the getfaciAssessDets function');
		 	console.log('ch_surv_det');
		 	console.log(ch_surv_det);
		 	console.log('ch_rawdata.cur_surv:');
		 	console.log(ch_rawdata.cur_surv);
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
			
		}





 };
 var XLSX = require('XLSX');

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


module.exports= ch_rawdata;





