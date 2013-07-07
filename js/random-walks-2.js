var w = 594 - 2;
var h = 320-2;

var x_step = w/10;
var num_steps = 20;
var delay = 1000;

var y_step = h/10;

var walker_size = 4;

var x_pos = w/2;
var y_pos = 0;

// Move the walker along the walk
function walk_the_walker(walk, walker, i, step_delay) {
    setTimeout(function() {
        console.log("Walker pos:" + walk[i]);
        walker.transition()
              .attr("cx",x_scale(walk[i]));
        i++;
        if (i < walk.length) {
            walk_the_walker(walk, walker, i, step_delay);
        } else {
            button_1.attr('disabled', null);
        }
    }, step_delay)
    return walk;   
}

// Create the SVG object
var svg_2 = d3.select("article")
            .append("svg")
            .attr("width", w+2*8-2)
            .attr("height", h)
            .classed("d3-panel", true);

// Create an axis
//         var x_axis_2 = d3.svg_2.axis()
//                        .scale(x_scale)
//                        .orient("bottom");

// Walker
var walker_2 = svg_2.append("circle");
walker_2.attr("cx", x_scale(0))
        .attr("cy", y_scale(0.5))
        .attr("r", walker_size)
        .classed("d3-red", true);