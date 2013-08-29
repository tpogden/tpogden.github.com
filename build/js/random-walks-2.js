var w = 594 - 2;
var h = 320 - 2;

var walker_size = 4;

var start_x_pos = 0;
var num_steps = 10;
var step_size = 1;

var step_delay = 500;

var y_step = h/10;

// Horizontal scale
var x_scale_2 = d3.scale.linear()
                .domain([-5, 5])
                .range([8, w+8]);    

// Vertical scale
var y_scale_2 = d3.scale.linear()
                .domain([0, 10])
                .range([0, h]);

// SVG object
var svg_2 = d3.select("article")
              .append("svg")
              .attr("width", w+2*8-2)
              .attr("height", h)
              .classed("d3-panel", true);
              
// Walker
var walker_2 = svg_2.append("circle");
walker_2.attr("cx", x_scale_2(0))
        .attr("cy", y_scale_2(0.5))
        .attr("r", walker_size)
        .classed("d3-red", true);