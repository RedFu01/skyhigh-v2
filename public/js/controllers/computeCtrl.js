app.controller('computeCtrl',function($rootScope, $scope, dataService, $state, moment){

var basicStep = {
    type:'',
}

$scope.stepTypes = [
    'FILTER_FLIGHTS',
    'USE_FILTERED_FLIGHTS',
    'COMPUTE_NETWORK',
    'USE_PATHES',
    'COMPUTE_PATHES',
    'COMPUTE_NETWORK_STATS',
];

$scope.IGWs = [{
        name:"Shannon Airport",
        key:"IGW_EUROPE_00",
        position: {
            lat: 52.6996573,
            lng: -8.9168798
        }
    },{
        name:"Gander Airport",
        key:"IGW_AMERICA_00",
        position: {
            lat: 48.9418259,
            lng: -54.5681016
        }
    }]

$scope.order={
    steps:[{}]
}

$scope.addStep = function(){
    $scope.order.steps.push({
        type:'',
    })
}
});