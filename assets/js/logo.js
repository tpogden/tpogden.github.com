function drawLogo() {

    var logo_canvas = document.getElementById("logo-canvas");
    var logo_context = logo_canvas.getContext("2d");
  
    var centre = 0.5*logo_canvas.width;
    var circle_radius = 0.35*logo_canvas.width;
    var cross_radius = 0.5*circle_radius;
    
    logo_context.lineWidth = (1.5/32)*logo_canvas.width;
    logo_context.strokeStyle = 'rgba(189,54,19,1)'
    
    logo_context.beginPath();
    logo_context.arc(centre, centre, circle_radius, 0, 2*Math.PI, false);
    logo_context.stroke();
  
    logo_context.beginPath();
    logo_context.moveTo(centre - cross_radius, centre - cross_radius);
    logo_context.lineTo(centre + cross_radius, centre + cross_radius);
    logo_context.stroke();
    
    logo_context.beginPath();
    logo_context.moveTo(centre - cross_radius, centre + cross_radius);
    logo_context.lineTo(centre + cross_radius, centre - cross_radius);
    logo_context.stroke();

}