var data = [
    //{
    //    "title": "Title",
    //    "subtitle": "Subtitle",
    //    "ranges": [
    //        { "label": "range1", "value": 500 }
    //    ],
    //    "measures": [
    //        { "label": "measure1", "value": 290 },
    //    ],
    //    "markers": [{ "label": "marker1", "value": 250 }, { "label": "marker1", "value": 350 }]
    //},
    {
        "title": "Title",
        "subtitle": "Subtitle",
        "ranges": [
            400
            
        ],
        "measures": [
            { "label": "measure2", "value": 270 }
        ],
        "markers": [{ "label": "marker1", "value": 350 }]
    }];


var drawSpace = d3.select("#chartspace");

var margin = { top: 5, right: 40, bottom: 20, left: 50 },
    width = drawSpace.style("width");
    height = (drawSpace.style("height").match(/\d+/g) / data.length) - margin.top - margin.bottom;

var chart = d3.bullet()
    .width(width)
    .height(height)
    .showMeasureLabel(true)
    .showRangeLabel(true)
    .showMarkerLabel(true);

var svg = d3.select("#chartspace").selectAll("svg")
        .data(data)
        .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(chart);

var title = svg.append("g")
    .style("text-anchor", "end")
    .attr("transform", "translate(-6," + height / 2 + ")");

title.append("text")
    .attr("class", "title")
    .text(function (d) { return d.title; });

title.append("text")
    .attr("class", "subtitle")
    .attr("dy", "1em")
    .text(function (d) { return d.subtitle; });
