(function() {

var w = 594 - 2;
var h = 64 - 2;

var walker_size = 8;

var start_pos = 0;
var num_steps = 20;
var step_size = 1;

var step_delay = 500; // [ms]

function take_random_walk(pos_start, num_steps, step_size) {

    var random_walk = new Array();
    random_walk[0] = pos_start;
    
    for (i = 0; i < num_steps; i++) {
        if (Math.random() < 0.5) {
            random_walk[i+1] = random_walk[i] + step_size;
        } else {
            random_walk[i+1] = random_walk[i] - step_size;
        }
    }
    return random_walk;
}

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

// SVG object
var svg_1 = d3.select("article")
              .append("svg")
              .attr("width", w+2*8-2)
              .attr("height", h)
              .classed("d3-panel", true);
    
// Horizontal scale
var x_scale = d3.scale.linear()
                  .domain([-5, 5])
                  .range([8, w+8]);    

// Vertical scale
var y_scale = d3.scale.linear()
                  .domain([0, 1])
                  .range([0, h]);
    
// Walker
var walker = svg_1.append("circle");
walker.attr("cx", x_scale(0))
        .attr("cy", y_scale(0.5))
        .attr("r", walker_size)
        .classed("d3-red", true);

// Run button
run_button = d3.select("#button-1")
             .attr('disabled', null)
             .on("click", function() {
                if (run_button.attr('disabled') != true) {
                    run_button.attr('disabled', true);
                    walk_the_walker(take_random_walk(start_pos,num_steps,step_size), walker, 0,                  
                    step_delay);
                }
             });

})()
