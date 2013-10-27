(function() {

// Variables __________________________________________________________________

var w = 594 - 2;
var h = 320 - 2;

var walker_size = 4;

x_steps = 40
y_steps = 40

var start_x_pos = 0;
var num_steps = 40;
var step_size = 1;

var step_delay = 200;

// SVG object _________________________________________________________________

var svg_obj = d3.select("article")
              .append("svg")
              .attr("width", w+2*8-2)
              .attr("height", h+2*8-2)
              .classed("d3-panel", true);

// Scales _____________________________________________________________________

// Horizontal scale
var x_scale = d3.scale.linear()
                .domain([-x_steps/2, x_steps/2])
                .range([8, w+8]);    

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

// Draw Walker Line and Dot ___________________________________________________

// Walker dot
var walker_dot = svg_obj.append("circle")
                        .attr("cx", x_scale(0))
                        .attr("cy", y_scale(0))
                        .attr("r", walker_size)
                        .classed("d3-red", true);

// Walk the walker ____________________________________________________________

// Move the walker along the walk, draw a path behind
function walk_the_walker(walk_array, walker_dot, walker_path, i, step_delay) {
    setTimeout(function() {
        // console.log("Walker pos:" + walk_array[i]);
        var walk_line_data = get_line_data(walk_array)

        // walker_dot.transition()
        //       .duration(0)
        //       .attr("cx",x_scale(walk_array[i]))
        //       .attr("cy",y_scale(i));
        walker_path.transition()
                   .duration(0)
                   .attr("d", lineFunction(walk_line_data.slice(0,i+1)))
        i++;
        if (i < walk_array.length) {
            walk_the_walker(walk_array, walker_dot, walker_path, i, step_delay);
        }
        else {
            // run_button.attr('disabled', null);
        }
    }, step_delay)
    return walk_array;   
}

function multiple_walkers(num_walkers, walker_dot, walk_delay, j) {
    setTimeout(function() {

        console.log("Walker:" + j);
        // The line SVG Path we draw
        var walker_path = svg_obj.append("path")
                         .attr("stroke", "blue")
                         .attr("stroke-width", 1)
                         .attr("fill", "none")
                         .style("opacity", 0.2);
        walk_the_walker(take_random_walk(start_x_pos,num_steps,step_size), 
            walker_dot, walker_path, 0, 50)
        j++;
        if (j < num_walkers) {
            multiple_walkers(num_walkers, walker_dot, walk_delay, j);
        }
        else {
            run_button.attr('disabled', null);
        }
    }, walk_delay)


}


// Run button
run_button = d3.select("#button-6")
             .attr('disabled', null)
             .on("click", function() {
                if (run_button.attr('disabled') != true) {
                    run_button.attr('disabled', true);
                    multiple_walkers(100, walker_dot, 2000, 0)
                    // walk_the_walker(take_random_walk(start_x_pos,num_steps,
                    //                 step_size), walker_dot, walker_path, 0,                  
                    // step_delay);
                }
             });



})()