var uArray;
var sArray = [];
var arr = [];
var stop = false;
var delay = 200;

var width = 920,
    height = 460;

var barWidth;

var xScale;
var yScale;

var svg = d3.select('.sh').append("svg")
    .attr("width", width + 40)
    .attr("height", height + 40)

var rects;
var labels;

function submit() {
    if (document.getElementById("taille").value.length != 0) {
        document.getElementById("submit").disabled = true;
        document.getElementById("start").disabled = false;
        document.getElementById("taille").disabled = true;
        var length = parseInt(document.getElementById("taille").value, 10);
        console.log(length);
        while (arr.length < length) {
            var r = Math.floor(Math.random() * 99) + 1;
            if (arr.indexOf(r) === -1) arr.push(r);
        }
        console.log(arr);
        uArray = [...arr];
        d3.select("#heading").attr("style", "color : red;").html("Not Sorted");

        barWidth = width / length;

        xScale = d3.scale.linear().domain([0, length]).range([0, width]);
        yScale = d3.scale.linear().domain([0, d3.max(uArray)]).range([0, height]);

        rects = svg.append("g")
            .attr("transform", "translate(" + barWidth + ",2)")
            .selectAll("rect")
            .data(uArray)
            .enter().append("rect");

        rects.attr("id", function (d) {
                return "rect" + d
            })
            .attr("transform", function (d, i) {
                return "translate(" + (xScale(i) - barWidth) + ",0)"
            })
            .attr("width", barWidth * 0.98)
            .attr("height", function (d) {
                return yScale(d)
            });
        rects.attr("y", function (d) {
            return height - yScale(d);
        });
        rects.attr("class", "unsorted");

        labels = svg.selectAll("text")
            .data(uArray)
            .enter().append("text");

        labels.attr("id", function (d) {
                return "text" + d
            })
            .attr("transform", function (d, i) {
                return "translate(" + (xScale(i)) + ",480)"
            })
            .attr("class", "unsorted")
            .attr("font-size", "12px")
            .html(function (d) {
                return d;
            });
    }
}

function reset() {
    d3.select("#heading").attr("style", "color : red;").html("Not Sorted");
    uArray = [...arr];
    sArray = [];
    stop = false;

    labels.attr("class", "unsorted")
        .transition().duration(1000)
        .attr("transform", function (d, i) {
            return "translate(" + (xScale(i)) + ", 480)"
        })

    rects.attr("class", "unsorted")
        .transition().duration(1000)
        .attr("transform", function (d, i) {
            return "translate(" + (xScale(i - 1)) + ", 0)"
        })
    document.getElementById("start").disabled = false;
    document.getElementById("reset").disabled = true;
}

function pause() {
    stop = true;
    document.getElementById("reset").disabled = false;
    document.getElementById("pause").disabled = true;
}

function changePos(d, i) {
    d3.select("#text" + d)
        .transition().duration(delay)
        .attr("transform", function (d) {
            return "translate(" + (xScale(i)) + ",480)"
        })

    d3.select("#rect" + d)
        .transition().duration(delay)
        .attr("transform", function (d) {
            return "translate(" + (xScale(i - 1)) + ", 0)"
        })
}

function insertionSort() {
    document.getElementById("start").disabled = true;
    document.getElementById("pause").disabled = false;
    var value = uArray.shift();
    sArray.push(value);
    subSort(sArray.length - 1);

    function subSort(n) {
        if (stop) return stop = false;

        d3.select("#rect" + value).attr("class", "testing")
        d3.select("#text" + value).attr("class", "testing")

        if (n > 0 && sArray[n - 1] > value) {
            setTimeout(function () {
                sArray.splice(n, 1);
                sArray.splice(n - 1, 0, value);

                changePos(sArray[n], n);
                changePos(sArray[n - 1], n - 1);

                subSort(--n)
            }, delay * 2);
        } else if (uArray.length) {
            setTimeout(function () {
                insertionSort()
            }, delay * 2);
        } else {
            setTimeout(function () {
                d3.selectAll("rect").attr("class", "sorted");
                d3.selectAll("text").attr("class", "sorted");
                d3.select("#heading").attr("style", "color : green;").html("Sorted");
                document.getElementById("reset").disabled = false;
                document.getElementById("pause").disabled = true;
            }, delay * 2);
        }
    }
}