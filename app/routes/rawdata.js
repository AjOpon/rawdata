/* EXCEL SHEET*/

 var Assessment = require('../models/assessment'),
 path = require('path'),
 XLSX = require('XLSX'),
 RawData = require('../controllers/ch_rawdata');
var fs = require('fs');
 var sync = require('synchronize');



 //req objects to be set by client side controller
 rfilename = 'sec1_temp2.xlsx';
 readfile= path.join(__dirname+ "/uploads/"+ rfilename) ;
 wfilename= 'SEC1_StaffTraining.xlsx';
 write_filepath= path.join(__dirname+ "/uploads/"+ wfilename) ;


 console.log('Executing excel read route');
 console.log('file location : '+ readfile);
 var workbook = XLSX.readFile(readfile);
 console.log('reading from ' + rfilename);
 console.log('workbook is : '+ typeof workbook);
 


module.exports=function(app,express){
 
 var rawdataRouter = express.Router();

rawdataRouter.route('/ch_excel')
 .get(function(req,res){
 	//setup from the req object to decide what rawdata to present e.g Survey Version, Term, County, Num of Surveys 
var setup = {cells : {col_srt: 'M9', col_end: 'AD9', srv_srt: 'B9', srv_end:'L9'},
	filepath_wb: write_filepath,
	workbk: workbook

};
console.log('setup.workbk is: '+ typeof setup.workbk);
var ch_rawdata = new RawData(setup);

sync.fiber(function(){
	write_dets1 = sync.await(ch_rawdata.getCHAssessments(sync.defer())) ;
	console.log('write_dets1 is : '+ typeof write_dets1);
	console.log(write_dets1.write_filepath);
	if(typeof write_dets1 === 'object'){
		console.log('Found xlsx file for download');
		res.download(write_dets1.write_filepath);
	}else{
		res.send({
			success: false ,
			write_dets_obj: write_dets1
		});
	}
});


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