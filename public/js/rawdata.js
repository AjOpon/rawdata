$( document ).ready(function(){

	 var TogVer = false;
  var TogTerm = false;
  var TogCounty = false;
  var cur_surTitle = $('input[name = surv_radio]').val();
  var cur_secSelect = 'None';
  var cur_secOpt = 'None' ;
 console.log('cur_surTitle: ');
 console.log(cur_surTitle);
 $('#SurvTitle').text(cur_surTitle);
 $('#SecTitle').text(cur_secSelect);
$('#FiltTitle').text('None');
    // Sets up click behavior on all button elements with the alert class
    // that exist in the DOM when the instruction was executed
 //


    //EVENTS
    $( "#ToggleVersion" ).on( "click", function(){

    	TogVer  = toggleVerFilt(TogVer);



    });


    $( "#ToggleTerm" ).on( "click", function(){
    	TogTerm = toggleTermFilt(TogTerm);
    	var filterString1 = ' ';
    	if(TogTerm){
    		
    		$('#FiltTerm').removeClass(' hidden ');

    	}else{
    		$('#FiltTerm').addClass('hidden');
    	}
    } );

    $( "#ToggleCounty" ).on( "click", function(){
    	TogCounty = toggleCountyFilt(TogCounty);

    	if(TogCounty){
    		
    			$('#FiltCounty').removeClass('hidden');

    	}else{
    		$('#FiltCounty').addClass('hidden');
    	}
    } );

    $( ".surv_title" ).on( "click", function(){
    	var elem = $(this);
    	console.log('surv_radio.val() : ');
    	console.log($('#surv_radio').val());
    	cur_surTitle = elem.val();
    	if(cur_surTitle != undefined){
    		$('#SurvTitle').text(cur_surTitle);
    	}else{
    		$('#SurvTitle').text(': None');
    	}
    } );

    $( ".sec-selecta" ).on( "click", function(){
    	var elem = $ (this);
    	console.log('elem.html() : ');
    	console.log(elem.html());
    	cur_secSelect =elem.attr('sec-val');//change to the value of sec-val attr


    	if(cur_secSelect!= 'None' && cur_secSelect != undefined){

    		$('#SecTitle').text(cur_secSelect);
    		$('#SecTitle2').text(': ');
    		$('#rawdata_form').removeClass("hidden");
    		removed_instruct = $("#instruct").detach();
    		
			
    	}else{
    		$('#SecTitle').text(': None');
    		$('#SecTitle2').text(': ');
    	}
    } );

    $( ".sec-opt" ).on( "click", function(){
    	var elem = $ (this);
    	console.log('elem.html() : ');
    	console.log(elem.html());
    	cur_secOpt =$(this).attr('sec-opt-val');//change to the value of sec-opt-val attr
    	console.log("cur_secOpt: ");
    	//console.log($(this).children('label').text());
    	console.log(cur_secOpt);
    	var cur_secOptText = ': '+ cur_secOpt;
    	if(cur_secOpt!= undefined && cur_secOpt !== 'None'){
    		$('#SecTitle2').text(cur_secOptText);
    		$('#gen_rd2').removeClass('hidden');
    		$('.filt-info').removeClass('hidden');
    	}else{
    		$('#SecTitle2').text('None');
    	}
    } );


    $( "#gen_rd2" ).on( "click", function(){
    	var elem = $(this);
    	
    	var ver_val = $('#SurVer').val();
    	var term_val = $('#SurTerm').val();
		var county_val = $('#SurCounty').val();
		var max_val = $('#SurMax').val();
		max_val = parseInt(max_val);

		console.log('SurVer input value is of type ' + typeof ver_val);
		console.log(ver_val);
		console.log('SurCounty input value is of type ' + typeof county_val);
		console.log(county_val);
		var curFullSectionTitle = cur_secSelect + cur_secOpt; 

		rd_setup = {
			SurTitle: cur_surTitle,
			SurSec: cur_secSelect,
			SurSecTitle: cur_secOpt,
			SurVer: ver_val,
			SurTerm: term_val,
			SurCounty: county_val,
			SurMax: max_val,
			TogCounty: TogCounty,
			TogTerm: TogTerm

		};
		console.log(rd_setup);
		var raw_data = new RawData(rd_setup);
		console.log('Attempting to Generate RawData...');
		GenerateRawData(raw_data);

		$('#dialog-message').removeClass('hidden');
		$( function() {
				    $( "#dialog-message" ).dialog({
				      modal: true,
				      hide: { effect: "clip", duration: 500 }
				    });
				  } );

 				

    } );



 
    // Now create a new button element with the alert class. This button
    // was created after the click listeners were applied above, so it
    // will not have the same click behavior as its peers
});

$('#rawdata_form').submit(function(e){
    		e.preventDefault();
    	});

function RawData(setup){
	if(typeof setup !== undefined && typeof setup !== null ){
		this.surv_Title = setup.SurTitle;//e.g CH
		this.surv_Sec= setup.SurSec;//e.g SECTION1
		this.surv_secTitle= setup.SurSecTitle;//e.g StaffTraining
		this.gen_name = this.surv_Title + this.surv_Sec + this.surv_secTitle ;

		if(typeof setup.SurVer !== undefined && typeof setup.SurVer !== null && typeof setup.SurMax !== undefined && typeof setup.SurMax !== null){
			console.log('Setup has the SurVer && SurMax');
			this.surv_ver = setup.SurVer;
			this.surv_max = setup.SurMax;
			if(setup.TogTerm){
				console.log('Term filter was selected');
				this.surv_term = setup.SurTerm;
				this.tog_term = setup.TogTerm;//boolean term toggle value	
				if(setup.TogCounty){

					console.log('County filter was selected');
					this.surv_county = setup.SurCounty;
					this.tog_county = setup.TogCounty;//boolean county toggle value
					console.log(this);
					//this.GenerateRawData();

				} else{
					console.log('No County filter was selected');
					this.surv_county = 'All';
					this.tog_county = setup.TogCounty;//boolean county toggle value
					console.log(this);
					//this.GenerateRawData();
				}

			}else{

				console.log('No Term filter was selected');
				this.surv_term = 'All';
				this.tog_term = setup.TogTerm;//boolean term toggle value


				if(setup.TogCounty){

					console.log('County filter was selected');
					this.surv_county = setup.SurCounty;
					this.tog_county = setup.TogCounty;//boolean county toggle value
					console.log(this);
					//this.GenerateRawData();

				} else{
					console.log('No County filter was selected');
					this.surv_county = 'All';
					this.tog_county = setup.TogCounty;//boolean county toggle value
					console.log(this);
					//this.GenerateRawData();
				}
			}
			
			
			
			

		} else {
			console.log('Setup thing doesnt even have a survey version/ max num of surveys');
		}
		

	} 

	else{

		console.log('Setup object was empty');
	}
	

};

GenerateRawData = function(obj){

 $.ajax({ url:'http://127.0.0.1:3005/rawdata/ch_excel',
 	type: 'POST',
 	data: obj,
 	dataType: 'json',
 	success:function(data){
 		console.log(' Success');
 		console.log(data);
 		if(data){
 			if(data.success == true){
 				console.log(data.wb_name);
 				console.log(window.location.host);
 				cur_wblink ='http://' +window.location.host + '/rawdata/ch_download/' + data.wb_name;
 				$('#dl_btn').removeClass('hidden');
 				$( "#gen_rd2" ).addClass('hidden');
 				$( "#dialog-message" ).prop('title','Downloaded');
 				$('#downloadit').attr('href', cur_wblink);
 				$('#d-message').html('File was successfully generated! Click the download button below');
 				$( function() {
				    $( "#dialog-message" ).dialog({
				      modal: true,
				      buttons: {
				        Ok: function() {
				          $( this ).dialog( "close" );
				          $('#downloadit').attr('href', '#');
				          $('#dl_btn').addClass('hidden');
				          $(this).addClass('hidden');
				          $('#d-message').html('Generating requested excel...');
				          $( "#gen_rd2" ).removeClass('hidden');
				        }
				      }
				    });
				  } );

 				
 				

 			}
 			else if(data.success == false){
 				$('#d-message').html('Was unable to generate file. No surveys may have been found <br> .Please select other options and try again');
 				$( function() {
				    $( "#dialog-message" ).dialog({
				      modal: true,
				      buttons: {
				        Ok: function() {
				          $( this ).dialog( "close" );
				          $('#downloadit').attr('href', '#');
				          $(this).addClass('hidden');
				          $('#d-message').html('Generating requested excel...');
				        }
				      }
				    });
				  } );
 			}
 		}
 	},

 	error:function(err){
 		console.log(' Fail');
 		console.log(err);
 	} 



 	});
};
var toggleVerFilt = function(Ver) {
    	
    	
    	Ver = Ver != true;
        console.log(Ver);

        if(Ver === true){
        	$('#SurVer').prop("disabled", false);
        	return Ver;
        }
        else{
        	$('#SurVer').prop("disabled", true);
        	return Ver;	
        }
    };

var toggleTermFilt = function(Term) {
    	
    	
    	Term = Term != true;
        console.log(Term);

        if(Term === true){
        	$('#SurTerm').prop("disabled", false);
        	return Term;
        }
        else{
        	$('#SurTerm').prop("disabled", true);
        	return Term;
        }
    };

var toggleCountyFilt = function(County) {
    	
    	
    	County = County != true;
        console.log(County);

        if(County === true){
        	$('#SurCounty').prop("disabled", false);
        	return County;
        }
        else{
        	$('#SurCounty').prop("disabled", true);
        	return County;
        }
    };
