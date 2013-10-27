(function() {

// Variables

var w = 594 - 2;
var h = 320 - 2;

var walker_size = 4;

var start_x_pos = 0;
var num_steps = 10;
var step_size = 1;

var step_delay = 500;

var y_step = h/10;

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

// Move the walker along the walk
function walk_the_walker(walk, walker, i, step_delay) {
    setTimeout(function() {
        console.log("Walker pos:" + walk[i]);
        walker.transition()
              .attr("cx",x_scale(walk[i]))
              .attr("cy",y_scale(i));
        i++;
        if (i < walk.length) {
            walk_the_walker(walk, walker, i, step_delay);
        }
        else {
            run_button.attr('disabled', null);
        }
    }, step_delay)
    return walk;   
}

// Horizontal scale
var x_scale = d3.scale.linear()
                .domain([-5, 5])
                .range([8, w+8]);    

// Vertical scale
var y_scale = d3.scale.linear()
                .domain([0, 10])
                .range([8, h+8]);

// SVG object
var svg_2 = d3.select("article")
              .append("svg")
              .attr("width", w+2*8-2)
              .attr("height", h+2*8-2)
              .classed("d3-panel", true);
              
// Walker
var walker = svg_2.append("circle");
walker.attr("cx", x_scale(0))
        .attr("cy", y_scale(0))
        .attr("r", walker_size)
        .classed("d3-red", true);


// Run button
run_button = d3.select("#button-2")
             .attr('disabled', null)
             .on("click", function() {
                if (run_button.attr('disabled') != true) {
                    run_button.attr('disabled', true);
                    walk_the_walker(take_random_walk(start_x_pos,num_steps,step_size), walker, 0,                  
                    step_delay);
                }
             });

})()
