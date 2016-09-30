angular.module('RawRouter', ['ui.router'])


 .config(function($locationProvider,$stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  /*$urlRouterProvider
            .when('/', '/home')
            .otherwise("/home");*/
  //
  // Now set up the states
  $stateProvider
    //chill default state
   /* .state('home', {
      url:"/home",
      templateUrl: "/app/views/rd_home.html",
        
      
    })
    
    .state('profile', {
      url: '/users/profile/{user_id}',
      views: {
        "":{
          //route to place within named parent (index.html) ui-view 'slide'
          templateUrl: "/app/views/pages/users/one.html",
          controller:"userEditController as user"
        }

      }
      
      
      
    })
    .state('login', {
      url: "/login",
      views: {
        "":{
          //route to place within named parent (index.html) ui-view 'slide'
          templateUrl: "/app/views/pages/login.html",
          controller:"vipiController as vipi"
          
        }

      }
      
      
    })*/
      //  set our app up  to  have  pretty  URLS 30         
    $locationProvider.html5Mode(true);
});