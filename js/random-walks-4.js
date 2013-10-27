(function() {

// Variables

var w = 594 - 2;
var h = 320 - 2;

// SVG object _________________________________________________________________

var svg_obj = d3.select("article")
              .append("svg")
              .attr("width", w+2*8-2)
              .attr("height", h+2*8-2)
              .classed("d3-panel", true);

// Scales _____________________________________________________________________

x_steps = 80

// Horizontal scale
var x_scale = d3.scale.linear()
                .domain([-x_steps/2, x_steps/2])
                .range([8, w+8]);    

y_steps = 40

// Vertical scale
var y_scale = d3.scale.linear()
                .domain([0, y_steps])
                .range([8, h+8]);

// Random walk functions ______________________________________________________

function take_random_step(pos, step_size) {
    if (Math.random() < 0.5) {
        pos_next = pos + step_size;
    } else {
        pos_next = pos - step_size;
    }
    return pos_next;
}

function take_random_walk(pos_start, num_steps, step_size) {
    var random_walk = new Array();
    random_walk[0] = pos_start;
    for (i = 0; i < num_steps; i++) {
        random_walk[i+1] = take_random_step(random_walk[i], step_size);
    }
    return random_walk;
}

function get_line_data(random_walk) {
    var line_data = new Array();
    for (i = 0; i < random_walk.length; i++) {
        line_data[i] = { "step": i, "pos": random_walk[i] }
    }
    return line_data
}

// Accessor function
 var lineFunction = d3.svg.line()
                          .x(function(d) { return x_scale(d.pos); })
                          .y(function(d) { return y_scale(d.step); })
                          .interpolate("linear");

// Walker _____________________________________________________________________

var start_pos = 0;
var num_steps = 40;
var step_size = 1;

walk = take_random_walk(start_pos,num_steps,step_size)

var line_data = get_line_data(walk)

// The line SVG Path we draw
var lineGraph = svg_obj.append("path")
                            .attr("stroke", "blue")
                            .attr("stroke-width", 1)
                            .attr("fill", "none");

// Move the walker along the walk
function walk_the_walker(walk, walker, i, step_delay) {
    setTimeout(function() {
        console.log("Walker pos:" + walk[i]);
        walker.transition()
              .attr("d", lineFunction(line_data.slice(0,i)))
        i++;
        if (i < walk.length) {
            walk_the_walker(walk, walker, i, step_delay);
        } //else {
            //button_1.attr('disabled', null);
        // }
    }, step_delay)
    return walk;   
}

var step_delay = 100; // [ms]

walk_the_walker(walk, lineGraph, 0, step_delay)



})()