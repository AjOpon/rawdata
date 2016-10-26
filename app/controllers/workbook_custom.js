  XLSX = require('XLSX');
  path = require('path');

	function wb_custom(){
	 console.log('new wb custom obj');
	 this.cells = {col_srt: 'M4', col_end: 'AD4', srv_srt: 'B4', srv_end:'L4'};
	 
	};
 wb_custom.prototype.setNewWorkBook= function (survey_type, survey_section,sectionTitleDes ){ 
 	self = this;
 	switch(survey_type){
 		case 'CH': 
 			switch(survey_section){
 				case 'SECTION1':
 				if(sectionTitleDes == 'StaffTraining' && typeof sectionTitleDes != null && typeof sectionTitleDes != undefined){
 					// myworkbook is the setNewWorkBook function (survey type, survey section )
 					myworkbook = {};
					myworkbook.SheetNames = ["CH"];//stores sheetnames as strings
					myworkbook.Sheets = {};
					myworkbook.Sheets['CH'] = {};
					myworkbook.Sheets['CH']['!ref'] = "A1:AD1000";

					var staffTrnCell = 'B2';
					var sec1Row1Titles = ["Staff Training","IMCI","ICCM","Enhanced Diarrhoea Management",
						"Diarrhoea & Pneumonia CMEs for U5s","EID Sample Collection","Trained in IMCI & Still Working in CHU" ], 
						sec1Row2Titles = ["County","Sub County","MFL No","Facility Name","Level","Type","Owner","Date of Assessment"
						,"Assessment Type","Version","Assessment Term","Doctor","Nurse","RCO","Doctor","Nurse","RCO","Doctor","Nurse","RCO",
						"Doctor","Nurse","RCO","Doctor","Nurse","RCO","Doctor","Nurse","RCO"];
					// preset starts and ends for the stafftraining portion
					var de_staffTrnTtl =  XLSX.utils.decode_cell(staffTrnCell);//get {c: , r :  }
					var de_imciCell = {c: de_staffTrnTtl.c+ 11 ,r: de_staffTrnTtl.r };// set {c: , r :  }
					var de_nxt_title = {c: (de_imciCell.c+3) ,r: de_imciCell.r };//set {c: , r :  }
					var de_ttlBelowStaff= {c:de_staffTrnTtl.c,r:de_staffTrnTtl.r+1};// i.e next row in {c: , r: }

					for (var i = 0; i < sec1Row1Titles.length; i++) {// for each title item 
						if(i == 0){
							myworkbook.Sheets['CH'][staffTrnCell] = {v: sec1Row1Titles[0], t : 's'};

						}
						else if(sec1Row1Titles[i] == 'IMCI' && i != 0){
							var en_imciCell =  XLSX.utils.encode_cell(de_imciCell);// get 'A1' version
							myworkbook.Sheets['CH'][en_imciCell] = {v: sec1Row1Titles[i],t:'s'};
							console.log('en_imciCell: '+ en_imciCell);

						} else {
							var en_nxt_title = XLSX.utils.encode_cell(de_nxt_title);//get 'A1' version
							de_nxt_title = {c: (de_nxt_title.c+3) ,r: de_nxt_title.r };
							myworkbook.Sheets['CH'][en_nxt_title] = {v: sec1Row1Titles[i], t:'s'} ;
							console.log("en_nxt_title: "+ en_nxt_title);

						}



					};

					for (var k = 0; k < sec1Row2Titles.length; k++) {
							
							var en_belowStaff = XLSX.utils.encode_cell(de_ttlBelowStaff);//C2
							console.log('en_belowStaff: '+ en_belowStaff);
							myworkbook.Sheets['CH'][en_belowStaff] = {v: sec1Row2Titles[k], t: 's'};
							de_ttlBelowStaff = {c:de_ttlBelowStaff.c+1,r:de_ttlBelowStaff.r};


						};
					//stores generated sheets
					console.log('en_ttlBelowStaff : ' + en_belowStaff);

					return myworkbook;// return the wb object with the sheets and sheetnames setup


 				}else{
 					console.log('another part of ch section 1 was selected. You need to check which one');

 				}
 			}
 			break;
 		case'MNH': 
 			break;
 		case 'IMCI': 
 			break;
 		default:
 			console.log('No viable survey_type was selected to prepare the custom workbook.');
 			return;
 	}
 };

wb_custom.prototype.getWorkBookSectionStart = function (){
	console.log('this.cells');
	console.log(this.cells);
	return this.cells;

};


module.exports= wb_custom;