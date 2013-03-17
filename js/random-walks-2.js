        var w = 592;
        var h = 320;
        
        var x_step = w/10;
        var num_steps = 20;
        var delay = 1000;
        
        var y_step = h/10;
        
        var walker_size = 4;
        
        var x_pos = w/2;
        var y_pos = 0;
        
		// Create the SVG object
        var svg_2 = d3.select("article")
                    .append("svg")
                    .attr("width", w)
                    .attr("height", h)
                    .classed("d3-panel", true);

        // Create an axis
//         var x_axis_2 = d3.svg_2.axis()
//                        .scale(x_scale)
//                        .orient("bottom");
        
        // Draw the walker
        var walker_2 = svg_2.append("circle");
        walker_2.attr("cx", x_pos)
              .attr("cy", y_step)
              .attr("r",walker_size)
              .attr("fill","red");