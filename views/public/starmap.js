var width; 
var height;
var svg;
var radius;
var stars;
var g;
var gBehind;
var scaleX;
var scaleY;

renderSVG();


function renderSVG(){
    width = document.getElementById('mapContainer').offsetWidth;
    height = document.getElementById('mapContainer').offsetHeight;
    radius = Math.min(width, height) * 0.5;
    svg = d3.select(".mapContainer")
        .append("svg")
        .attr("id","starmap") 
        .style("opacity", 0)
        .attr("width", width)
        .attr("height", height)
        .style("pointer-events", "none") 

    g = svg.append("g");

     
    g.append("circle")
        .attr("stroke", "#fff")
        .attr("fill", "none")
        .attr("cy", (height/2))
        .attr("cx", (width/2))
        .attr("r", radius);
    
    for(var i = 0; i < 360; i+=15){
        g.append("line")
            .attr("stroke", "#fff")
            .attr("x1",width/2)
            .attr("y1",height/2)
            .attr("x2", ((radius+10) * Math.cos(radians(i)))+(width/2))
            .attr("y2", ((radius+10) * Math.sin(radians(i)))+(height/2));
    }
    
    svg.call(d3.zoom()
        .scaleExtent([1 / 2, 8])
        .on("zoom", zoomed));


    loadStars();
    
    svg.transition()
        .ease(d3.easeCubic)
        .duration(1000)
        .style("opacity",1)
        .on("end", function(){
            svg.style("pointer-events", "all");
        });

}

function loadStars(){
    $.get("allstars", function(data, status){
    
        var maxBrightness = getMaxBrightness(data);
        var minBrightness = getMinBrightness(data);

        var scaleRadius = d3.scaleLinear()
            .domain([minBrightness, maxBrightness])
            .range([0.5, 3]);

        var maxX = getMaxX(data);
        var minX = getMinX(data);
        var maxY = getMaxY(data);
        var minY = getMinY(data);

        scaleX = d3.scaleLinear()
            .domain([minX, maxX])
            .range([Math.round((width/2) - radius), Math.round((width/2) + radius)]);
        scaleY = d3.scaleLinear()
            .domain([minY, maxY])
            .range([Math.round((height/2) - radius), Math.round((height/2) + radius)]);
       
        console.log("Scale values: " + scaleX.range() +" "+ scaleY.range());

        stars = g.selectAll("stars")
            .data(data, function(d) { 
                d.id
            })
            .enter()
            .append("circle")
            .attr("fill", function(d){
                return d.properName.length > 0 ? "#98ff1c" : "#fff"
            })
            .attr("cx", function(d){
                //console.log("x: "+ getUnitX(d));
                return scaleX(getUnitX(d));
            })
            .attr("cy", function(d){
                //console.log("y: "+ getUnitY(d));
                return scaleY(getUnitY(d));
            })
            .attr("r", function(d){
                return scaleRadius(d.magnitude);
            })
            .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
            .on("click", handleMouseClick);
    });
}

function handleMouseClick(d, i){
    console.log(d.properName);
}

function handleMouseOver(d, i){
    // Use D3 to select element, change color and size
    d3.select(this)
        .attr("fill", "orange")
        .attr("r", 4);

    // Specify where to put label of text
    g.append("text")
        .attr("id", "t"+d.id)
        .attr("x", function() { return scaleX(getUnitX(d)) - 30; }) // TODO: use the getScale(...) sf val
        .attr("y",  function() { return scaleY(getUnitY(d))- 15; })
        .attr("fill", "#fff")
        .text(function() {
          return d.properName.length > 0 ? d.properName + " - " + d.hr : d.hr;  // Value of the text
        }); 
}

//function getScale(data) {
//    return Math.sqrt(d3.max(data, (d) => {
//        var abs = Math.sqrt(d.x * d.x) + (d.y * d.y) + (d.z * d.z);
//
//        //var unit_x = d.x / (abs - d.z);
//        //var unit_y = d.y / (abs - d.z);
//
//        var ux = d.x / abs;
//        var uy = d.y / abs;
//        var uz = d.z / abs;
//
//        var x = ux / (1 - uz);
//        var y = uy / (1 - uz);
//
//        return (x * x) + (y * y);
//    }));
//}

function getMaxX(data){
    return d3.max(data, function(d) { return getUnitX(d)});
}

function getMaxY(data){
    return d3.max(data, function(d) { return getUnitY(d)});
}

function getMinX(data){
    return d3.min(data, function(d) { return getUnitX(d)});
}

function getMinY(data){
    return d3.min(data, function(d) { return getUnitY(d)});
}

function getMaxBrightness(data){
    return d3.max(data, function(d) { return +d.magnitude;} );
}
function getMinBrightness(data){
    return  d3.min(data, function(d) { return +d.magnitude;} );
}

function handleMouseOut(d, i){
    // Use D3 to select element, change color back to normal
    d3.select(this)
        .attr("fill", function(d) {return d.properName.length > 0 ? "#98ff1c" : "#fff"})
        .attr("r", 2);

    // Select text by id and then remove
    d3.select("#t"+d.id).remove();  // Remove text location
}

function getUnitX(d){
    var abs = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.y, 2) + Math.pow(d.z, 2));
    var x = d.x/abs;
    var z = d.z/abs;
    return (x/1);
}

function getUnitY(d){
    var abs = Math.sqrt(Math.pow(d.x, 2) + Math.pow(d.y, 2) + Math.pow(d.z, 2));
    var y = d.y/abs;
    var z = d.z/abs;
    return (y/1);
}

function update(data, status){
    
}

function zoomed() {
  g.attr("transform", d3.event.transform);
}

function radians(degrees) {
  return degrees * Math.PI / 180;
};

