  //takes full processed Data to display: [{age: number, count: number, average?:boolean}]
app.directive('lineChart', function() {
    return {
      restrict: 'E',
      scope: {
        color: '=', //number
        data: '=', //number
      },
      link: function(scope, element, attrs) {
          //console.log(scope.data)
        var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = d3.select(element[0]).node().getBoundingClientRect().width,
            height = d3.select(element[0]).node().getBoundingClientRect().height;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var line = d3.svg.line()
            .interpolate("basis")
            .x(function(d) { return x(d.time); })
            .y(function(d) { return y(d.v); });

        var svg = d3.select(element[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(scope.data, function(d) { return d.time; }));
        y.domain(d3.extent(scope.data, function(d) { return d.v; }));

        svg.append("path")
            .datum(scope.data)
            .attr("class", "line")
            .attr("stroke", scope.color)
            .attr("d", line);

      }
    };

  })