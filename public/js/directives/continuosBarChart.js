  //takes full processed Data to display: [{age: number, count: number, average?:boolean}]
app.directive('lineChart', function() {
    return {
      restrict: 'E',
      scope: {
        color: '=', //number
        data: '=', //number
      },
      link: function(scope, element, attrs) {
        var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = d3.select(element[0]).node().getBoundingClientRect().width,
            height = d3.select(element[0]).node().getBoundingClientRect().height;

        var svg = d3.select(element[0]).append("svg")
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain([0, d3.max(scope.data, function(d) { return d.time; })]);
        y.domain([0, d3.max(scope.data, function(d) { return d.v; })]);

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "%"))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("Frequency");

        g.selectAll(".bar")
            .data(scope.data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.time); })
            .attr("y", function(d) { return y(d.v); })
            .attr("width", x.bandwidth())
            .attr("height", function(d) { return height - y(d.v); });

      }
    };

  })