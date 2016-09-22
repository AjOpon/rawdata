$( document ).ready(function(){

	 var TogVer = false;
  var TogTerm = false;
  var TogCounty = false;
  var cur_surTitle = $('input[name = surv_radio]').val();
  var cur_secSelect = 'None';
  var cur_secOpt = undefined ;
  var curFilters = [];
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
    		curFilters.push('Term');
    		for (var z = 0; z < curFilters.length; z++) {
    				filterString1 =filterString1 +',' + curFilters[z];
    				
    			};
    			$('#FiltTitle').text(filterString1);

    	}else{
    		if(curFilters.length>2){
    			for (var f = 0; f < curFilters.length; f++) {
    				if(curFilters[f] === 'Term'){
    					curFilters[f] = 'None';
    					for (var w = 0; w < curFilters.length; w++) {
		    			filterString1 =filterString1 +',' + curFilters[w];
		    				
		    			};
		    			$('#FiltTitle').text(filterString);
    				}else{
    					continue;
    				}
    			};
    		}
    	}
    } );

    $( "#ToggleCounty" ).on( "click", function(){
    	TogCounty = toggleCountyFilt(TogCounty);

    	var filterString2 = ' ';
    	if(TogCounty){
    		curFilters.push('County');
    		for (var y = 0; y < curFilters.length; y++) {
    				filterString =filterString +',' + curFilters[y];
    				
    			};
    			$('#FiltTitle').text(filterString);

    	}else{
    		if(curFilters.length>2){
    			for (var d = 0; d < curFilters.length; d++) {
    				if(curFilters[d] === 'County'){
    					curFilters[d] = 'None';
    					for (var y = 0; y< curFilters.length; y++) {
	    				filterString = filterString + ',' + curFilters[y];
	    				
	    			};
    			$('#FiltTitle').text(filterString2);
    				}else{
    					continue;
    				}
    			};
    		}
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
    		curFilters.push('Version');
    		curFilters.push('Max');
    		filterString = ' ';
    		if(curFilters.length >1){
    			for (var i = 0; i < curFilters.length; i++) {
    				filterString =filterString + ' ' + curFilters[i];
    				
    			};
    			$('#FiltTitle').text(filterString);

    		}
    		
			
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
    	if(cur_secOpt!= undefined){
    		$('#SecTitle2').text(cur_secOpt);
    	}else{
    		$('#SecTitle2').text('None');
    	}
    } );


    $( "#gen_rd" ).on( "click", function(){
    
    	var ver_val = $('#SurVer').val();
    	var term_val = $('#SurTerm').val();
		var county_val = $('#SurCounty').val();
		var max_val = $('#SurMax').val();
		max_val = parseInt(max_val);

		console.log('SurVer input value is of type ' + typeof ver_val);
		console.log(ver_val);
		console.log('SurCounty input value is of type ' + typeof county_val);
		console.log(county_val);

		rd_setup = {
			SurVer: ver_val,
			SurTerm: term_val,
			SurCounty: county_val,
			SurMax: max_val,
			TogCounty: TogCounty,
			TogTerm: TogTerm

		};
		console.log(rd_setup);
		var raw_data = new RawData(rd_setup);

    } );



 
    // Now create a new button element with the alert class. This button
    // was created after the click listeners were applied above, so it
    // will not have the same click behavior as its peers
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

				if(setup.TogCounty){

					console.log('County filter was selected');
					this.surv_county = setup.SurCounty;
					console.log(this);
					//this.GenerateRawData();

				} else{
					console.log('No County filter was selected');
					this.surv_county = 'all';
					this.tog_county = setup.TogCounty;//boolean county toggle value
					console.log(this);
					//this.GenerateRawData();
				}

			}else{

				console.log('No Term filter was selected');
				this.surv_term = 'all';
				this.tog_term = setup.TogTerm;//boolean term toggle value

				if(setup.TogCounty){

					console.log('County filter was selected');
					this.surv_county = setup.SurCounty;
					console.log(this);
					//this.GenerateRawData();

				} else{
					console.log('No County filter was selected');
					this.surv_county = 'all';
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

RawData.prototype.GenerateRawData = function(){
 return;
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