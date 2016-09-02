 // use Array.isArray or Object.prototype.toString.call
// to differentiate regular objects from arrays
//typeof [1, 2, 4] === 'object';
 var Facility = require('../models/facility'),
 ch_rawdata= {},
 XLSX = require('XLSX');
var fac_info={};
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

ch_rawdata.getRowName=function(sectionDatakeys){
	for (var i = 0; i < sectionDatakeys.length; i++) {
		sectionDatakeys[i]
	};
};

function getfaciAssessDets(ch_surv_det){
	var assessType = ch_surv_det.Survey;
	var spos  =assessType.length - 2;
	var lpos= assessType.length + 1;
	var version = assessType.substring(spos,lpos);
	var term = ch_surv_det.Assessment_Term;
	var arr_assess_dets = [assessType,version, term];
	return arr_assess_dets;
};

function writeSec1Book ( wb_sec1,writepath_sec1 ){
	if (typeof wb_sec1 != null && typeof wb_sec1!= undefined) {
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
};

ch_rawdata.getFaciDets = function (err, facilitydets){
	if(err){
		fac_info.faci_dets = undefined;
		return console.log(err);
	}
	else{
		if(facilitydets != undefined && facilitydets != null){
			fac_info.faci_dets = Object.keys(facilitydets);
			ch_surv_cur = this.FaciSumCurSurv;  
			console.log('ch_surv_cur: ');
			console.log(ch_surv_cur);
			console.log('We got the dets for facility: ' + facilitydets.FacilityName);
			fac_info.assess_dets  = getfaciAssessDets(ch_surv_cur);
			console.log('faci_dets : ');
			console.log(fac_info.faci_dets);
						if(Array.isArray(fac_info.assess_dets)){
						console.log('assess_dets : ');
						console.log(fac_info.assess_dets);
						var faciliArr = fac_info.faci_dets, assessArr = fac_info.assess_dets;
						comp_dets= faciliArr.concat(assessArr);
						console.log('comp_dets: ');
						console.log(comp_dets);
						var srv_colsrt = srt_stp.srv_colsrt, srv_colend = srt_stp.srv_colend;
						var de_srv_colsrt = XLSX.utils.decode_cell(srv_colsrt);
						var de_srv_colend = XLSX.utils.decode_cell(srv_colend);
						console.log('displaying decoded srv_colsrt : ');
						console.log(de_srv_colsrt);
						console.log('displaying decoded srv_colend : ');
						console.log(de_srv_colsrt);

						var srv_cur = de_srv_colsrt.c, srv_last_col = de_srv_colend.c,
						srv_cur_rw = de_srv_colsrt.r;
						console.log('srv_cur  = '+ srv_cur);

						var srv_celladd_arr= [];
						
						for (; srv_cur <= srv_last_col;) {
							var srvcell= {c:srv_cur,r:srv_cur_rw};
								var en_srvcell = XLSX.utils.encode_cell(srvcell);
								srv_celladd_arr.push(en_srvcell);
								srv_cur++;

						};

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



ch_rawdata.getSecDataKeys = function(fsum_datakeys,pattern){
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
		}

		
	}
	
		return col_blk_keys;
	}

		else{
			return 'failed my man, fsum_datakeys not of type Array';
		}
	}

	else{
		console.log('regex pattern null or undefined');
	}


	
	
};


ch_rawdata.getSingleRowArray = function(secRowsCols1,row_pattern){
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
};

ch_rawdata.setFaciSumInfoExcel = function (wbk_inf,ch_surv_inf,s_datakeys_inf,srt_stp_inf){
	var srv_fac_id = ch_surv.Facility_ID;
				console.log('Facility_ID : '+ srv_fac_id);
				var faci_query  = Facility.findOne().where('FacilityCode').equals(srv_fac_id).select('County SubCounty FacilityCode FacilityName Tier Type Owner');
				faci_query.exec(ch_rawdata.setFaciDets);
};

ch_rawdata.setFacilitySummaryExcel=function(wbk,ch_surv,s_datakeys,srt_stp){

	console.log('Launching setFacilitySummaryExcel');
		// Get worksheet 
			if(typeof ch_surv == 'object' && wbk != undefined && wbk != null && s_datakeys != null)
			{	
				
				var work_buch = {};
				var first_sheet = wbk.SheetNames[0];
				 console.log('name of first sheet is : ' + first_sheet);
				 var worksheet = wbk.Sheets[first_sheet];

				if(Array.isArray(s_datakeys)){

					var col_srt = srt_stp.col_srt, col_end = srt_stp.col_end; //get starting and ending column
					console.log('col_srt = '+ col_srt + ' col_end = '+ col_end);
					var de_col_srt = XLSX.utils.decode_cell(col_srt);
					var de_col_end = XLSX.utils.decode_cell(col_end);
					console.log('displaying decoded col_srt : ');
					console.log(de_col_srt);
					console.log('displaying decoded col_end: ');
					console.log(de_col_end);

					var cur_col= de_col_srt.c,col_dataky = 2,last_col = de_col_end.c
					cur_rw = de_col_srt.r;
					console.log('cur_col  = '+ cur_col);



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
						};
						console.log('col_dataky is : ' + col_dataky);
						col_dataky++;
					};

					
					//xlsx.writeFile(workbook, 'rand.xlsx');
					/* console.log('start column index : '+  m_index );
					 console.log('end column index : '+  ad_index);*/



				} else{

					console.log('Sec Arrays expected, something else was found');

				}
				//work_buch.lastRow = x;
				work_buch.wb = wbk;
				return work_buch.wb;

			} else {
				console.log('Error with ch_surv / wbk /s_datakeys make sure they are variables with values');
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

};

module.exports= ch_rawdata;





