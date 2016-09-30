//RawData Service

angular.module( 'RawDataService' , [])

 .factory( 'RawData', function($http){
 	//create the object
 	var rawDataFactory = {};

 	//a function to a get all the users

 	rawDataFactory.addRawDataCritiria = function(){
 		return $http.post( '/rawdata/ch_excel');
 	};



 	return rawDataFactory;
 });