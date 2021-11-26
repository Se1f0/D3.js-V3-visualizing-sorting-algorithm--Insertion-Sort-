var uArray = [9,3,1,2,4,7];
var sArray = [];
var arr = [];
var stop = false;
var durationTime = 200;

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var barWidth;

var xScale;
var yScale

var svg = d3.select('.sh').append("svg")
                          .attr("width", width + margin.left + margin.right)
                          .attr("height", height + margin.top + margin.bottom)

var rects;
var labels;

function submit(){
    document.getElementById("submit").disabled = true;
    var length = parseInt(document.getElementById("taille").value,10);
    console.log(length);
    while(arr.length < length){
        var r = Math.floor(Math.random() * 99) + 1;
        if(arr.indexOf(r) === -1) arr.push(r);
    }
    console.log(arr);
    uArray = [...arr];
    d3.select("#heading").attr("style","color : red;").html("Not Sorted");
    
    barWidth = width/length;

    xScale = d3.scale.linear().domain([0,length]).range([0,width]);
    yScale = d3.scale.linear().domain([0, d3.max(uArray)]).range([0, height]);

    rects = svg.append("g")
                .attr("transform", "translate(" + barWidth + ",2)")
                .selectAll("rect")
                .data(uArray)
                .enter().append("rect");
            
    rects.attr("id", function(d) {return "rect" + d})
            .attr("transform", function(d, i) {return "translate(" + (xScale(i) - barWidth) + ",0)"})
            .attr("width", barWidth * 0.98)
            .attr("height", function(d) {return yScale(d)});
    rects.attr("y",function(d){ return height - yScale(d); });
    
    labels = svg.selectAll("text")
                .data(uArray)
                .enter().append("text");
        
    labels.attr("id", function(d) {return "text" + d})
          .attr("transform", function(d, i) {return "translate(" + (xScale(i)) + ",480)"})
          .html(function(d) {return d;});
}

function reset() {
    uArray = [...arr];
    sArray = [];
    stop = false;

    labels.attr("class", "")                
          .transition().duration(1000)
          .attr("transform", function(d, i) {return "translate(" + (xScale(i)) + ", 480)"})            
    
    rects.attr("class", "")                
         .transition().duration(1000)
         .attr("transform", function(d, i) {return "translate(" + (xScale(i-1)) + ", 0)"})
    
    // rects.attr("id", function(d) {return "rect" + d})
    //      .attr("transform", function(d, i) {return "translate(" + (xScale(i) - barWidth) + ",0)"})
    //      .attr("width", barWidth *.98)
    //      .attr("height", function(d) {return yScale(d)});
    // rects.attr("y",function(d){ return height - yScale(d); });
}

function insertionSort() {
    document.getElementById("start").disabled = true;
    var value = uArray.shift();
    sArray.push(value);      
    reArrange(sArray.length-1);
    
    function reArrange(n) {
        if (stop) return stop = false;            
        
        d3.selectAll("rect").attr("class", "")                
        d3.select("#rect" + value).attr("class", "testing")
        d3.select("#text" + value).attr("class", "testing")     
        
        if (n > 0 && sArray[n-1] > value) {
            setTimeout(function() {
                sArray.splice(n,1);
                sArray.splice(n-1,0,value);
        
                slide(sArray[n], n);
                slide(sArray[n-1], n-1);
        
                reArrange(--n)
            }, durationTime * 2);
        } else if (uArray.length) {
            setTimeout(function() {insertionSort()}, durationTime * 2);
        } else {
            setTimeout(function() {
                d3.selectAll("rect").attr("class", "sorted");
                d3.selectAll("text").attr("class", "sorted");
                d3.select("#heading").attr("style","color : green;").html("Sorted");
            },durationTime * 2);
        }
    }
}

function slide(d, i) {
    d3.select("#text" + d)
        .transition().duration(durationTime)
        .attr("transform", function(d) {return "translate(" + (xScale(i)) + ",480)"})

    d3.select("#rect" + d)
        .transition().duration(durationTime)
        .attr("transform", function(d) {return "translate(" + (xScale(i-1)) + ", 0)"})
}