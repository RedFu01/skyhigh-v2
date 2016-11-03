app.config(function($stateProvider, $urlRouterProvider) {
$stateProvider
    .state('main', {
        url: '/',
        templateUrl: 'templates/main.html',
        controller: 'mainCtrl'
    })
    .state('main.dashboard', {
        url: 'dashboard/',
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
    })
    .state('main.explore', {
        url: 'explore/',
        templateUrl: 'templates/explore.html',
        controller: 'exploreCtrl'
    })
    .state('main.compute', {
        url: 'compute/',
        templateUrl: 'templates/compute.html',
        controller: 'computeCtrl'
    })
    
  

  $urlRouterProvider.otherwise('/');
});
