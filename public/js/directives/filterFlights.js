app.directive('filterFlights', function() {
    return {
      restrict: 'E',
      templateUrl: '/templates/steps/filterFlights.html',
      scope: {
        step: '='
      },
      link: function(scope, element, attrs) {
          console.log('filterFlights')
          if(!scope.step.region){
            scope.step.region = {}
          }
          if(!scope.step.minDuration){
              scope.step.minDuration = 0;
          }
          console.log(scope.step)
      }
    };

  })