/* EXCEL SHEET*/

 var Assessment = require('../models/assessment'),
 path = require('path'),
 XLSX = require('XLSX'),
 CHRawData = require('../controllers/ch_rawdata');
 wb_custom = require('../controllers/workbook_custom');
var fs = require('fs');
 var sync = require('synchronize');



 //req objects to be set by client side controller
 /*rfilename = 'sec1_temp200.xlsx';
 readfile= path.join(__dirname+ "/uploads/"+ rfilename) ;
 wfilename= 'SEC1_StaffTraining.xlsx';*/
 
 half_filepath = "/uploads/"
 write_filepath= path.join(__dirname+ half_filepath) ;


 console.log('Rawdata router ready');
 
 


module.exports=function(app,express){
 
 var rawdataRouter = express.Router();

rawdataRouter.route('/ch_excel')
 .post(function(req,res){
 	//setup from the req object to decide what rawdata to present e.g Survey Version, Term, County, Num of Surveys 
var raw_file_options  = req.body;
console.log('Showing the request body');
console.log(raw_file_options); // raw_data obj from client
if(typeof raw_file_options != undefined && typeof raw_file_options != null)
{
	
		 //req objects to be set by client side controller
		 filterstring = raw_file_options.surv_max + raw_file_options.surv_ver;
		 if(raw_file_options.tog_term == 'true' || raw_file_options.tog_county== 'true'){
		 	if(raw_file_options.tog_term == 'true' && raw_file_options.tog_county == 'false'){

		 		filterstring += raw_file_options.surv_term;
		 		console.log('filterstring : '+ filterstring);

		 	} else if(raw_file_options.tog_term == 'false' && raw_file_options.tog_county == 'true')
		 	{
		 		filterstring += raw_file_options.surv_county;

		 	} else{

		 		filterstring = raw_file_options.surv_term + raw_file_options.surv_county;
		 	}
		 }

		 wfilename= raw_file_options.gen_name+ filterstring + '.xlsx';// SurvVer+ SurvMax+ [..SurvTerm, ..SurvCounty] + '.xlsx' name of excel file

		console.log('filterstring : '+ filterstring);

		 

		half_filepath = "/uploads/" + wfilename ; 
		//console.log('file location : '+ readfile);
		  var wb_new = new wb_custom(); //new workbook object
		  var workbook = wb_new.setNewWorkBook(raw_file_options.surv_Title, raw_file_options.surv_Sec,raw_file_options.surv_secTitle);//e.g ('CH', 'SECTION1', 'StaffTraining');
		 
		 console.log('workbook is : '+ typeof workbook);
		 write_filepath= path.join(__dirname + half_filepath) ;

		 var cells = wb_new.getWorkBookSectionStart();//get start position for facility cells and section data value cells

		 var setup = { cells : cells,//depending on switch case
					filepath_wb: write_filepath,
					wb_name : wfilename,
					workbk: workbook,//remove when cell addresses are the reference to the start points for the xlsx file
					wb_options: raw_file_options

				};

	switch(raw_file_options.surv_Title){//determine type of survey being requested e.g CH

		case 'CH':

			//logic for ch assessments
			console.log('user requested for a CH rawdata file');
			

				console.log('setup.workbk is: '+ typeof setup.workbk);

				var ch_rawdata = new CHRawData(setup);//change logic to depend on switch case

				sync.fiber(function(){
					write_dets1 = sync.await(ch_rawdata.getCHAssessments(sync.defer())) ;
					console.log('write_dets1 is : '+ typeof write_dets1);
					
					
					if(typeof write_dets1 === 'object' && typeof write_dets1 !== 'null' && typeof write_dets1 != undefined){
						console.log(write_dets1.write_filepath);
						console.log('Found xlsx file for download');
						//res.download(write_dets1.write_filepath);
						res.send({ 
							success : true,
							wb_name: write_dets1.wb_name

						});

					}else{
						console.log('Undefined writedets , issues within');
						res.send({
							success: false ,
							message: 'something went wrong'
						});
					}
				});

			break;
		case 'MNH':
			//mnh assessment file logic
			console.log('MNH rawdata file requested by user');
			break;
		case 'IMCI':
			//imci assessment file logic
			console.log('MNH rawdata file requested by user');
			break;
		default:
		console.log('No valid selection of survey title');
		return;

	}//end switch statement 


		
	} else{
		console.log('appears the req.body is empty');
	}



//chassessments = chdata;

/*
var fruits = ["Banana", "Orange", "Apple", "Mango"];
fruits.unshift("Lemon","Pineapple");

var obj = { foo: "bar", baz: 42 };
console.log(Object.entries(obj)); // [ ['foo', 'bar'], ['baz', 42] ]

console.log('chassessments : ');
console.log(chassessments);
if(typeof chassessments !== 'undefined' && chassessments!='nothing' ){
	if(chassessments.isArray ){
	var assess_props = propcheck(chassessments);
	console.log('Displaying props');
	console.log(asses_props);
	res.json({
		
		success: true,
		sheetname: first_sheet_name,
		objprops: assess_props,
		//workbook: workbook,
		assessments_arr: chassessments,
		sheet: worksheet

	});
}

else{
	console.log('chassessments wasnt an array it was : ' + chassessments);
	res.send(chassessments);
}
}
else{
	console.log('we found undefined chassessments');
	res.send('Yup, found undefined chassessments');
}*/

});

rawdataRouter.route('/ch_download/:filename')
	.get(function(req,res){
		if(typeof req.params != undefined && typeof req.params != null){
			console.log('req.params...');
			console.log(req.params.filename);
		  var curfilename =  req.params.filename;
		  half_filepath  = '/uploads/' +curfilename;
		  curwrite_filepath= path.join(__dirname+ half_filepath ) ;
		  console.log('Sending file for download');
		  sync.fiber(function(){

		 				var excel_wrt_stats = sync.await(fs.stat(curwrite_filepath, sync.defer()));
			 			console.log('excel_wrt_stats: '+ typeof excel_wrt_stats );
			 			console.log(excel_wrt_stats);
			 			if(excel_wrt_stats){
			 				//console.log('content type : '+ res.get('Content-Type'));
			 				//res.download(write_filepath);
			 				console.log('File Valid');
			 				res.download(curwrite_filepath);
			 				//return write_dets;
			 			}
			 			else{
			 				res.send({success: false, message: 'No file found'});
			 				return console.log('apparently the file couldnt be found');
			 			}
		 			});
		  //res.download(write_dets1.write_filepath);
		}else{
			return console.log('Params was empty');
		}
		 
	});

rawdataRouter.route('/showworkbook')
	.get(function(req,res){
		console.log('showworkbook route called');
		var file2 = path.join(__dirname + '/uploads/wb_testing.xlsx');
		/*console.log('file location : '+ readfile2);*/
		 /*var workbook22 = XLSX.readFile(readfile2);*/
		 //res.send(workbook22);
		 wb_new = new wb_custom(); 
		 wb_new = wb_new.setNewWorkBook('CH', 'SECTION1','StaffTraining');
		 XLSX.writeFile(wb_new, file2);
       //res.send(wb_new);

		 
	});
		

/*

var workbook = XLSX.readFile('/uploads/test.xlsx');

// Using query builder
Person.
  find({ occupation: /host/ }).
  where('name.last').equals('Ghost').
  where('age').gt(17).lt(66).
  where('likes').in(['vaporizing', 'talking']).
  limit(10).
  sort('-occupation').
  select('name occupation').
  exec(callback);

var first_sheet_name = workbook.SheetNames[0];
var address_of_cell = 'A1';
 
// Get worksheet 
var worksheet = workbook.Sheets[first_sheet_name];
 
// Find desired cell 
var desired_cell = worksheet[address_of_cell];
 
// Get the value 
var desired_value = desired_cell.v;

function datenum(v, date1904) {
	if(date1904) v+=1462;
	var epoch = Date.parse(v);
	return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
	var ws = {};
	var range = {s: {c:10000000, r:10000000}, e: {c:0, r:0 }};
	for(var R = 0; R != data.length; ++R) {
		for(var C = 0; C != data[R].length; ++C) {
			if(range.s.r > R) range.s.r = R;
			if(range.s.c > C) range.s.c = C;
			if(range.e.r < R) range.e.r = R;
			if(range.e.c < C) range.e.c = C;
			var cell = {v: data[R][C] };
			if(cell.v == null) continue;
			var cell_ref = XLSX.utils.encode_cell({c:C,r:R});
			
			if(typeof cell.v === 'number') cell.t = 'n';
			else if(typeof cell.v === 'boolean') cell.t = 'b';
			else if(cell.v instanceof Date) {
				cell.t = 'n'; cell.z = XLSX.SSF._table[14];
				cell.v = datenum(cell.v);
			}
			else cell.t = 's';
			
			ws[cell_ref] = cell;
		}
	}
	if(range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
	return ws;
}

/* original data */
/*var data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar",new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]]
var ws_name = "SheetJS";

function Workbook() {
	if(!(this instanceof Workbook)) return new Workbook();
	this.SheetNames = [];
	this.Sheets = {};
}

var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

/* add worksheet to workbook *//*
wb.SheetNames.push(ws_name);
wb.Sheets[ws_name] = ws;

 write file 

*/
return rawdataRouter;
};