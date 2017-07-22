var testdata = {
    "K1001100 Metabolism": [136048, 1409520, 141476, 141414, 123135, 138340, 124549, 130718, 130375, 133148,
        125157, 125530],
    "Kartoffelpuffer": [1387924, 1918628, 1404787, 2005017, 1334583, 1874740, 1441470,
        1761100, 1435870, 1412325, 1298925, 1359854],
    "K2000016 Environmental Information Processing": [118717, 150030, 110363, 157731, 111666, 149708, 117329, 131665, 108223, 118062,
        115652, 113388],
    "K2000020 Cellular Processes": [312190, 322720, 397361, 313971, 345793, 319993, 336657, 276876, 359491, 333782,
        336064, 342454],
    "K2000025 Organismal Systems": [4844330, 5375386, 5705003, 5434182, 4825587, 5552616, 4991606, 5018688,
        5317224, 5411519, 4755607, 5021955],
    "K2000034 Human Diseases": [525311, 695853, 659029, 655018, 547221, 753171, 611034,
        727973, 737763, 602771, 508000, 551082]
};




var margin = 100;

var svg_width = 700, svg_height = 300;
var width_heat = svg_width - 2*margin, height_heat = svg_height - 2*margin;

var minVal = [], maxVal = [];

var data = [];

d3.csv('data.csv', function (error, input) {

    keyList = Object.keys(input[0]);
    data = input.map(function (item) {
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

    for (var i = 0; i < keyList.length - 2; i++) {
        dataset = input.map(function (d) {
            return +d[keyList[i]];
        });
        minVal.push(d3.min(dataset));
        maxVal.push(d3.max(dataset));
    }

    var svg = d3.select('.heatmap')
        .append("svg")
        .attr("width", width_heat + 2 * margin)
        .attr("height", height_heat + 2 * margin)
        .append("g")
        .attr("transform", "translate(" + margin + "," + margin + ")");

    var x_labels_heat = d3.set(data.map(function (i) {
        return i.kegg;
    })).values();
    var y_labels_heat = d3.set(data.map(function (i) {
        return i.person;
    })).values();

    var xScale_heat = d3.scalePoint()
        .domain(x_labels_heat)
        .range([0, width_heat]);

    var xAxis_heat = svg.append("g")
        .attr("class", "axis")
        .call(d3.axisTop(xScale_heat))
        .selectAll('text')
        .attr('font-weight', 'normal')
        .style("text-anchor", "start")
        .attr("dx", ".8em")
        .attr("dy", ".5em")
        .attr("transform", function (d) {
            return "rotate(-65)";
        });

    var yScale_heat = d3.scalePoint()
        .range([height_heat, 0])
        .domain(y_labels_heat);

    var yAxis_heat = svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(yScale_heat))
        .selectAll('text')
        .attr('font-weight', 'normal');

    var colorScale = d3.scaleSequential(d3.interpolateRainbow)
        .domain([d3.min(minVal), d3.max(maxVal)]);

    var cells = svg.selectAll('#svg')
        .data(data)
        .enter()
        .append('rect')
        .attr("id", "cell")
        .attr("class", "cell")
        .attr("width", width_heat / x_labels_heat.length)
        .attr("height", height_heat / y_labels_heat.length)
        .attr("y", function (d) {
            return yScale_heat(d.person);
        })
        .attr("x", function (d) {
            return xScale_heat(d.kegg);
        })
        .attr("fill", function (d) {
            return colorScale(d.value0);
        });


    d3.selectAll("#cell").on('mouseout', function () {
        d3.select(this)
            .attr("r", 5);
    });

    var time = document.getElementById('time-point').innerHTML;
    d3.selectAll("#cell").on('click', function () {
        var test = [719079.0, 722975.0, 653050.0, 690245.0, 654167.0, 758876.0, 649471.0, 679961.0, 759505.0, 686394.0,
            703282.0, 681793.0];
        update_line(test);
        changeBarInput(testdata, time);
        dayLabel = document.getElementById('time-point').innerHTML;
        //changeBarInput(testInput, dayLabel);
        console.log(d3.event.pageX);
        console.log(d3.select(this).attr('fill'));
    });

    });


function change_color() {

    var colorScale = d3.scaleSequential(d3.interpolateRainbow)
        .domain([0, 34]);

    console.log("update");
        newVal = document.getElementById("time-point").innerHTML;
        svg.selectAll("#cell")
            .attr("fill", function (d) { return colorScale(d["value"+String(newVal)]); });
        console.log(document.getElementById('time-point').innerHTML);
}
