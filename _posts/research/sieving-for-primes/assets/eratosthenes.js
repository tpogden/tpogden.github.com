(function() {

  var box_size = 1;

//   var n = 1024;
//   var num_wide = 32;
//   var num_high = 32;

//   var n = 900;
//   var num_wide = 30;
//   var num_high = 30;

  // var n = 600;
  // var num_wide = 30;
  // var num_high = 30;

  var n = 400;
  var num_wide = 20;
  var num_high = 20;

  box_spacing = 1;

  delay = 2000;

  fadeInDuration = 500;
  fadeOutDuration = 1000;

  // Green, Orange, Blue, Pink, Yellow, Purple, Dark Grey
  colors = ["#a6e22e", "#fd971f", "#66d9ef", "#f92672", "#e6db74", "#ae81ff",
            "#49483e"];

  var margin = {top: 20, right: 20, bottom: 20, left: 20},
      width = 606 - margin.left - margin.right,
      height = 606 - margin.top - margin.bottom; // 480

  var x = d3.scale.linear()
      .range([0, width])
      .domain([0, num_wide]);

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([num_high, 0]);

  // Draw SVG
  var svg = d3.select("article").append("svg")
      .classed("svg-canvas", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var boxes = svg.selectAll("g")
      .data(d3.range(1,n))
      .enter()
      .append("g")
      .attr("class", "box")
      .attr("transform", function(d) { return "translate(" + x(d%num_wide) +
        "," + y(Math.floor(d/num_wide)) + ")"; });

  boxes.append("rect")
      .attr("width", x(box_size) - box_spacing)
      .attr("height", y(box_size) - box_spacing)
      .attr("x", 1)
      .attr("y", 1);

  boxes.append("text")
      .attr("dx", x(box_size/2))
      .attr("dy", y(box_size/2))
      .text(function(d) { return d+1; });

  function sieveMultiples(n, r, j, stepDelay_) {
    setTimeout(function() {

      var multiples = r.filter(function(d){ return (d+1)%n == 0; });

      var remaining = r.filter(function(d){ return (d+1)%n != 0; })

      multiples.selectAll("rect")
        .transition()
        .duration(fadeInDuration)
        .style("fill", "rgba(189,54,19,1)");

      var next = remaining.data()[0]+1;
      j++;

      if (multiples.data().length > 1) {

        // Remove the first element, I don't want to fade it
        multiples = multiples.filter(function(d, i){ return i != 0; });

        fadeMultiples(multiples);

        sieveMultiples(next, remaining, j, stepDelay_);

      }

      else {

        r.selectAll("rect")
            .transition()
            .delay(delay)
            .duration(fadeInDuration)
            .style("fill", "rgba(189,54,19,1)");

      }

    }, stepDelay_)

    return remaining;

  }

  function fadeMultiples(m) {
    setTimeout(function() {

      m.selectAll("rect")
        .transition()
        .duration(fadeOutDuration)
        .style("fill", "white");
      m.selectAll("text")
        .transition()
        // .duration(fadeOutDuration)
        .style("fill", "rgba(208,199,198,1)");

  }, delay)};

  function drawPlayButton() {

    play = svg.append("g")
        .attr("class", "play")
        .on("click", start);

    play.append("path")
        .attr("d", "M-48,-48L48,0L-48,48Z")
        .attr("transform", "translate(" + width / 2 + "," +
                height / 2 + ")scale(.6)");

    play.append("rect")
        .attr("width", width)
        .attr("height", height);

  }

  function removePlayButton() {

    play.remove();

  }

  function start() {

    removePlayButton();

    var remaining = boxes;
    sieveMultiples(2, remaining, 0, delay);

  }

  drawPlayButton();

})()
