var margin = 100;

var svg_width = 700, svg_height = 300;
var width = svg_width - 2*margin, height = svg_height - 2*margin;

d3.csv('data.csv', function (error, input) {

    keyList = Object.keys(input[0]);
    var data = input.map(function (item) {
        var newItem = {};
        newItem.person = item.person;
        newItem.kegg = item.kegg;
        newItem.value0 = parseInt(item["0"]);
        newItem.value1 = parseInt(item["1"]);
        newItem.value3 = parseInt(item["3"]);
        newItem.value6 = parseInt(item["6"]);
        newItem.value8 = parseInt(item["8"]);
        newItem.value34 = parseInt(item["34"]);
        return newItem;
    });

    var minVal = [], maxVal = [];
    for (var i = 0; i < keyList.length - 2; i++) {
        dataset = input.map(function (d) {
            return +d[keyList[i]];
        });
        minVal.push(d3.min(dataset));
        maxVal.push(d3.max(dataset));
    }

    var svg = d3.select('.heatmap')
        .append("svg")
        .attr("width", width + 2 * margin)
        .attr("height", height + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    var x_labels = d3.set(data.map(function (i) {
        return i.kegg;
    })).values();
    var y_labels = d3.set(data.map(function (i) {
        return i.person;
    })).values();

    var xScale = d3.scalePoint()
        .domain(x_labels)
        .range([0, width]);

    var xAxis = svg.append("g")
        .attr("class", "axis")
        .call(d3.axisTop(xScale))
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".5em")
        .attr("transform", function (d) {
            return "rotate(-65)";
        });

    var yScale = d3.scalePoint()
        .range([height, 0])
        .domain(y_labels);

    var yAxis = svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale))
        .selectAll('text')
        .attr('font-weight', 'normal');

    var colorScale = d3.scaleSequential(d3.interpolateRainbow)
        .domain([d3.min(minVal), d3.max(maxVal)]);

    var cells = svg.selectAll('#svg')
        .data(data)
        .enter()
        .append('rect')
        .attr("class", "cell")
        .attr("width", width / x_labels.length)
        .attr("height", height / y_labels.length)
        .attr("y", function (d) {
            return yScale(d.person);
        })
        .attr("x", function (d) {
            return xScale(d.kegg);
        })
        .attr("fill", function (d) {
            return colorScale(d.value0);
        });

    d3.selectAll("rect").on("click", function () {
        console.log("ania hat dicke haarige eier");
        console.log(this);
    });

    // when the input range changes update the heatmap
    d3.select("#chart").on("click", function () {
        console.log("update");
        newVal = document.getElementById("output").innerHTML;
        svg.selectAll("rect")
            .attr("fill", function (d) { return colorScale(d["value"+String(newVal)]); });
    });

    // tooltips
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.selectAll("rect").on('mouseover', function () {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("Alice: " + 42 + "</br>" + "Bob: " + 42)
            .style("left", (d3.event.pageX - 25) + "px")
            .style("top", (d3.event.pageY) + "px");
    });
    d3.selectAll("rect").on('mouseout', function () {
        d3.select(this)
            .attr("r", 5);
        div.transition()
            .duration(600)
            .style("opacity", 0);
    });

    d3.selectAll("rect").on('click', function () {
        console.log(d3.event.pageX);
        console.log(d3.select(this).attr('fill'));
        console.log("meh");
    });

});
