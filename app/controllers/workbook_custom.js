  XLSX = require('XLSX');
  path = require('path');

const StaffTrainingCellStart = { col_srt: 'M4', col_end: 'AD4', srv_srt: 'B4', srv_end:'L4' },
 HealthServicesCellStart = { col_srt: 'M4', col_end: 'M4', srv_srt: 'B4', srv_end:'L4' };
 GuidelinesJobAidAvailabilityStart = { col_srt: 'M4', col_end: 'T4', srv_srt: 'B4', srv_end:'L4' },
ToolsAvailabilityStart =  { col_srt: 'M4', col_end: 'T4', srv_srt: 'B4', srv_end:'L4' };


	function wb_custom(){
	 console.log('new wb custom obj');
	 //this.cells = {col_srt: 'M4', col_end: 'AD4', srv_srt: 'B4', srv_end:'L4'};
	 
	};
 wb_custom.prototype.setNewWorkBook= function (survey_type, survey_section,sectionTitleDes ){ 
 	self = this;
 	switch(survey_type){ 
 		case 'CH':  
 			switch(survey_section){ 
 				case 'SECTION1':
 				if(sectionTitleDes == 'StaffTraining' && typeof sectionTitleDes != null && typeof sectionTitleDes != undefined){ 
 					// myworkbook is the setNewWorkBook function (survey type, survey section )
 					this.cells = StaffTrainingCellStart;
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


 				}else if(sectionTitleDes == 'HealthServices' && typeof sectionTitleDes != null && typeof sectionTitleDes != undefined){

 					this.cells = HealthServicesCellStart;
 					myworkbook = {};
					myworkbook.SheetNames = ["CH"];//stores sheetnames as strings
					myworkbook.Sheets = {};
					myworkbook.Sheets['CH'] = {};
					myworkbook.Sheets['CH']['!ref'] = "A1:M1000";

					var sec1Row1Titles = ["Health Services"];
					var sec1Row2Titles = [ "County","Sub County","MFL No","Facility Name","Level","Type","Owner","Date of Assessment"
						,"Assessment Type","Version","Assessment Term", "Where are sick children seen?" ];
					var HealthServicesCell = "B2";
					var de_HealthServicesTtl =  XLSX.utils.decode_cell(HealthServicesCell);//get {c: , r :  }
					var de_ttlBelowHealthServices= {c:de_HealthServicesTtl.c,r:de_HealthServicesTtl.r+1};// i.e next row in {c: , r: }

					for (var i = 0; i < sec1Row1Titles.length; i++) {// for each title item 
						if(i == 0){
							myworkbook.Sheets['CH'][HealthServicesCell] = {v: sec1Row1Titles[0], t : 's'};

						}

					};

					for (var k = 0; k < sec1Row2Titles.length; k++) {
							
							var en_belowHealthServices = XLSX.utils.encode_cell(de_ttlBelowHealthServices);//C2
							console.log('en_belowStaff: '+ en_belowHealthServices);
							myworkbook.Sheets['CH'][en_belowHealthServices] = {v: sec1Row2Titles[k], t: 's'};
							de_ttlBelowHealthServices = {c:de_ttlBelowHealthServices.c+1,r:de_ttlBelowHealthServices.r};


						};
					//stores generated sheets
					console.log('en_belowHealthServices : ' + en_belowHealthServices);

					return myworkbook;// return the wb object with the sheets and sheetnames setup



 				} else{

 					console.log('Unknown section selected');
 					return;

 				}

 				
 				break;

 				case 'SECTION2':
 					if(sectionTitleDes == 'GuidelinesJobAidAvailability' && typeof sectionTitleDes != null && typeof sectionTitleDes != undefined){

 						this.cells = GuidelinesJobAidAvailabilityStart;
		 					myworkbook = {};
							myworkbook.SheetNames = ["CH"];//stores sheetnames as strings
							myworkbook.Sheets = {};
							myworkbook.Sheets['CH'] = {};
							myworkbook.Sheets['CH']['!ref'] = "A1:T1000";

							var sec1Row1Titles = ["Guidelines & Job Aids Availability"];
							var sec1Row2Titles = [ "County","Sub County","MFL No","Facility Name","Level","Type","Owner","Date of Assessment"
							,"Assessment Type","Version","Assessment Term", "2012 IMCI Guidelines" , "ORT Guidelines", "ICCM", "Paediatric Protocol 2010/2013",
							"Diarrhoea Management Job Aid", "IEC Materials", "ART Guidelines", "EID Algorithm 2009/12/14 "];

							var GuidelinesJobAidCell = "B2";
							var de_GuidelinesJobAidCell = XLSX.utils.decode_cell(GuidelinesJobAidCell);//get {c: , r :  }
							var de_ttlBelowGuidelinesJobAid = {c:de_HealthServicesTtl.c,r:de_HealthServicesTtl.r+1};// i.e next row in {c: , r: }

							//set heading / title cell
							myworkbook.Sheets['CH'][GuidelinesJobAidCell] = {v: sec1Row1Titles[0], t : 's'};

							for (var k = 0; k < sec1Row2Titles.length; k++) {
							
							var en_ttlBelowGuidelinesJobAid = XLSX.utils.encode_cell(de_ttlBelowGuidelinesJobAid);//C2
							console.log('en_ttlBelowGuidelinesJobAid: '+ en_ttlBelowGuidelinesJobAid);
							myworkbook.Sheets['CH'][en_ttlBelowGuidelinesJobAid] = {v: sec1Row2Titles[k], t: 's'};
							de_ttlBelowGuidelinesJobAid = {c:de_ttlBelowGuidelinesJobAid.c+1,r:de_ttlBelowGuidelinesJobAid.r};


								};

							return myworkbook;// return the wb object with the sheets and sheetnames setup



 					} else if(sectionTitleDes == 'ToolsAvailability' && typeof sectionTitleDes != null && typeof sectionTitleDes != undefined){

 						this.cells = ToolsAvailabilityStart;
		 					myworkbook = {};
							myworkbook.SheetNames = ["CH"];//stores sheetnames as strings
							myworkbook.Sheets = {};
							myworkbook.Sheets['CH'] = {};
							myworkbook.Sheets['CH']['!ref'] = "A1:T10000";

							var sec1Row1Titles = ["Tools Availability"];
							var sec1Row2Titles = [ "County","Sub County","MFL No","Facility Name","Level","Type","Owner","Date of Assessment"
							,"Assessment Type","Version","Assessment Term", "EID Register" , "Under 5 Register", "ORT Corner Register (Improvised)", "Mother Child Booklet",
							"ORT Corner Register (MoH)", "IMCI Case Recording Form", "Referral Slips", " ICCM Tools "];

							var ToolsAvailabilityCell = "B2";
							var de_ToolsAvailabilityCell = XLSX.utils.decode_cell(ToolsAvailabilityCell);//get {c: , r :  }
							var de_ttlBelowToolsAvailability = {c:de_ToolsAvailabilityCell.c,r:de_ToolsAvailabilityCell.r+1};// i.e next row in {c: , r: }
							
							myworkbook.Sheets['CH'][ToolsAvailabilityCell] = {v: sec1Row1Titles[0], t : 's'};

							for (var k = 0; k < sec1Row2Titles.length; k++){
								var en_ttlBelowToolsAvailability = XLSX.utils.encode_cell(de_ToolsAvailabilityCell);
								console.log('en_ttlBelowToolsAvailability: '+ en_ttlBelowToolsAvailability);
								myworkbook.Sheets['CH'][en_ttlBelowToolsAvailability] = {v: sec1Row2Titles[k], t: 's'};
								de_ttlBelowToolsAvailability = {c:de_ttlBelowToolsAvailability.c+1,r:de_ttlBelowToolsAvailability.r};

							};




 					} else{
 						console.log('no valid section 2 chv2 section selected to prepare custom workbook');
 						return;
 					}

 				break;
 				 
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
	if(typeof this.cells != null && typeof this.cells != undefined)
	{
		return this.cells;
	}
	else{
		console.log("section start was undefined");
		return undefined;
	}

};


module.exports= wb_custom;