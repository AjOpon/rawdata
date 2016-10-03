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
    	cur_secSelect =elem.text();


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
    	cur_secOpt =$(this).text();
    	console.log("cur_secOpt: ");
    	//console.log($(this).children('label').text());
    	console.log(cur_secOpt);
    	cur_secOpt = ': '+ cur_secOpt;
    	if(cur_secOpt!= undefined && cur_secOpt !== 'None'){
    		$('#SecTitle2').text(cur_secOpt);
    		$('.filt-info').removeClass('hidden');
    	}else{
    		$('#SecTitle2').text('None');
    	}
    } );

    $('#downloadit').on('click',function(){
    	var elem = $(this);
    	elem.toggleClass('hidden');
    });

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
		var curFullSectionTitle = cur_secSelect.replace(/\r?\n|\r/g, " ") + cur_secOpt.replace(/\r?\n|\r/g, " ") ; 
		curFullSectionTitle = curFullSectionTitle.replace(/\r?\n|\r/g, " ");

		rd_setup = {
			SurTitle: cur_surTitle,
			SurSec: curFullSectionTitle,
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
				      hide: { effect: "explode", duration: 1000 }
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
				          $( "#gen_rd2" ).toggleClass('hidden');
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
 		console.log('err: ' );
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
