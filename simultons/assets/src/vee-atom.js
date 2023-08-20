(function () {

  var margin = {
    top: 16,
    right: 16,
    bottom: 16,
    left: 16 
  },
    width = 286 - margin.left - margin.right,
    height = 286 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
    .range([0, width])
    .domain([0, 1]);

  var y = d3.scaleLinear()
    .range([0, height])
    .domain([0, 1]);

  var svg = d3.select("article").append("svg")
    .attr("class", "side")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var lineGenerator = d3.line()
    .x(function (i) {
      return x(i[0]);
    })
    .y(function (i) {
      return y(i[1]);
    });

  // Levels 

  var levelWidth = 0.3;
  var levelLabelPadding = 0.02;
  var fieldPadding = 0.05;

  // TODO: could use a data, enter loop to generate all of these 

  let levelGroup0 = svg.append("g")
    .attr("transform", function (d) {
      return "translate(" + x(0.3) + "," + y(0.9) + ")";
    });
  levelGroup0.append("path")
    .attr("class", "level")
    .attr("d", lineGenerator([[0, 0], [0 + levelWidth, 0]]))
  levelGroup0.append("g")
    .attr("transform", "translate(" + x(0.0 + levelWidth + levelLabelPadding) +
      "," + y(0.0 - levelLabelPadding) + ")" + "scale(1)")
    .append(() => MathJax.tex2svg(String.raw`\left| 0 \right>`).childNodes[0]);

  let levelGroup1 = svg.append("g")
    .attr("transform", function (d) {
      return "translate(" + x(0) + "," + y(0.3) + ")";
    });
  levelGroup1.append("path")
    .attr("class", "level")
    .attr("d", lineGenerator([[0, 0], [0 + levelWidth, 0]]))
  levelGroup1.append("g")
    .attr("transform", "translate(" + x(0.0 + levelWidth + levelLabelPadding) +
      "," + y(0.0 - levelLabelPadding) + ")" + "scale(1)")
    .append(() => MathJax.tex2svg(String.raw`\left| 1 \right>`).childNodes[0]);

  let levelGroup2 = svg.append("g")
    .attr("transform", function (d) {
      return "translate(" + x(0.6) + "," + y(0.2) + ")";
    });
  levelGroup2.append("path")
    .attr("class", "level")
    .attr("d", lineGenerator([[0, 0], [0 + levelWidth, 0]]))
  levelGroup2.append("g")
    .attr("transform", "translate(" + x(0.0 + levelWidth + levelLabelPadding) +
      "," + y(0.0 - levelLabelPadding) + ")" + "scale(1)")
    .append(() => MathJax.tex2svg(String.raw`\left| 2 \right>`).childNodes[0]);

  // Fields 

  // There must be an easier way to do line endings. 

  svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrow-start")
    .attr("class", "field-arrow fill-red")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 10)
    .attr("refY", 0)
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0 0 L10 -5 L10 5");

  svg.append("svg:defs").append("svg:marker")
    .attr("id", "arrow-end")
    .attr("class", "field-arrow fill-red")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", 5)
    .attr("markerHeight", 5)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0 -5 L10 0 L0 5");

  svg.append("path")
    .attr("class", "field stroke-red")
    .attr('d', lineGenerator(
      [[0 + levelWidth / 2, 0.3 + fieldPadding],
      [0.3 + levelWidth / 2 - fieldPadding, 0.9 - fieldPadding]]));

  svg.append("path")
    .attr("class", "field stroke-red")
    .attr('d', lineGenerator(
      [[0.6 + levelWidth / 2, 0.2 + fieldPadding],
      [0.3 + levelWidth / 2 + fieldPadding, 0.9 - fieldPadding]]));

})()
