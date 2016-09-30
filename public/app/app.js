//new angular module

var app = angular.module('RawDataApp', ['RawRouter','RawDataService','ngAnimate','ngTouch','ui.bootstrap']);
 
 app.controller('mainController', function(){
 	//bind this to vm
 	var vm = this;


//object containing artist form-data 
 vm.RawData={};

vm.RawData.message = 'Welcome';

 });






