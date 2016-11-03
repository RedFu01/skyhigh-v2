app.controller('mainCtrl',function($rootScope, $scope, dataService, $state, $mdDialog){

    $scope.goTo = function(state){
        $state.go(state)
    }


    
});