(function() {

var margin = {top: 8, right: 8, bottom: 8, left: 8},
    width = 594 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

var xSteps = 20;

// Scales _____________________________________________________________________

// Horizontal scale
var xScale = d3.scale.linear()
                .domain([-x_steps/2, x_steps/2])
                .range([0, width]);    

var yScaleHist = d3.scale.linear()
                    .domain([0, 10])
                    .range([0, width]);

// Data _______________________________________________________________________

// Generate an Irwin–Hall distribution of 10 random variables.
// var values = d3.range(xSteps).map(d3.random.irwinHall(10));

var values = [-5, -3, 1, 7, -18, -18, 4, 7, 9]

console.log(values)

// console.log(xScale.ticks(xSteps))

// Generate a histogram using twenty[?] uniformly-spaced bins.
var histData = d3.layout.histogram()
    // .bins(xScale.ticks(xSteps))
    .bins(5)
    (values);

console.log(histData)

var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

var svg = d3.select("article").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .classed("d3-panel", true)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var bars = svg.selectAll(".bar")
    .data(histData)
    .enter()
    .append("g")
    .attr("class", "bar")
    // .attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScaleHist(d.y) + ")"; });

// bar.append("rect")
//     .attr("x", 1)
//     .attr("width", x(data[0].dx) - 1)
//     .attr("height", function(d) { return height - y(d.y); });

console.log(histData[0].x)
console.log(histData[0].dx)

bars.append("rect")
    .attr("x", function(d) { return d.x })
    .attr("y", xScale(0))
    .attr("width", function(d) { return xScale(d.dx) })
    .attr("height", function(d) { return height - yScaleHist(d.y) });

console.log(bars[0].x)

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

})()