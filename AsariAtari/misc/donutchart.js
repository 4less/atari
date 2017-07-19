
var filename = "http://localhost:8000/countries.csv";

function loadCSV(csv) {
	d3.csv(csv, function(error, data) {
		var colDict = columnDict(data);

		var year = colDict["Year"];
		var life = colDict["Life Expectency"];
		var work = colDict["Average Working hours"];
		var ctry = colDict["Country"];

		bubblechart("#idea", work, life, year, ctry, plotWidth, plotHeight, "work hours per week", "life expectency");
	});
}

function columnDict(data) {
	console.log("columns.");
	var coldict = {}
	var cols = Object.keys(data[0]);
	for (i = 0; i < cols.length; i++) {
		var col = cols[i];		
		coldict[col] = [];
		var count = 0
		for (j = 0; j < data.length; j++) {
			row = data[j];

			coldict[col].push(masterCaster(row[col]));
		}
	}
	
	return coldict;
}


function masterCaster(element) {
	if (!isNaN(Number(element))) {
		return(Number(element));
	} else {
		return element;
	}
}

function bubblechart (parent, xdata, ydata, zdata, catdata, width, height, xlabel, ylabel) {
	var svg = d3.select(parent).append("svg");
	var data = d3.zip(xdata, ydata, zdata, catdata);

	var leftMargin = 50;
	var rightMargin = 200;
	var topMargin = 50;
	var bottomMargin = 50;

	var chartWidth = width - leftMargin - rightMargin;
	var chartHeight = height - topMargin - bottomMargin;

	svg.attr("width", width).attr("height", height);

	var xscale = d3.scaleLinear()
		.range([0, chartWidth])
		.domain([d3.min(xdata), d3.max(xdata)]);
	var yscale = d3.scaleLinear()
		.range([chartHeight, 0])
		.domain([d3.min(ydata), d3.max(ydata)]);	
	var zscale = d3.scaleSqrt()
		.range([10, 30])
		.domain([d3.min(zdata), d3.max(zdata)]);

	var chartGroup = svg.append("g");


	var colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628'];
	var colorDict = [];
	var colorIndex = 0;

	chartGroup.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(yscale));
	chartGroup.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + chartHeight + ")") 
		.call(d3.axisBottom(xscale));

	chartGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -chartHeight/2)
		.attr("y", -30)
		.attr("fill", "black")
		.attr("font-family", "sans-serif")
		.style("text-anchor", "middle") 
		.text(ylabel);

	chartGroup.append("text")
		.attr("x", chartWidth/2)
		.attr("y", chartHeight + 40)
		.attr("fill", "black")
		.attr("font-family", "sans-serif")
		.style("text-anchor", "middle")
		.text(xlabel);

	chartGroup.
		attr("transform", "translate(" + leftMargin + ", " + topMargin + ")");
	


	chartGroup.selectAll(".circle")
		.data(data)
		.enter()
			.append("circle")
				.attr("cx", function(data) {
						return xscale(data[0]); 
					})
				.attr("cy", function(data) {
						return yscale(data[1]); 
					})
				.attr("r", function(data) {
						return zscale(data[2]);
					})
				.attr("fill", function(data) {
						if (!colorDict.hasOwnProperty(data[3])) {
							colorDict [data[3]] = colors[colorIndex];
							colorIndex += 1;
						}

						console.log("dict: " + colorDict);
						return colorDict[data[3]];
					})
				.attr("stroke", "white")
				.attr("data-legend", function(d) { return d[3]})
				.attr("stroke-width", function(data) { return 2;})
				.attr("fill-opacity", function(data) { return 0.5;});

	var legend = svg.append("g");

	var l = legend.selectAll(".legend")
		.data(d3.entries(colorDict))
		.enter();

	var radius = 4;
	var lineHeight = 20;

	var lastIndex = 0;

	l.append("circle")
		.attr("cx", 0)
		.attr("cy", function(data, i) { return i*lineHeight - radius-1; })
		.attr("r", radius)
		.attr("fill-opacity", function(data) { return 0.5;})
		.attr("fill", function(data) { return data.value; });
	l.append("text")
		.attr("x", 2* radius + 4)
		.attr("y", function(data, i) { lastIndex = i; return i*lineHeight; })
		.text(function(data) { console.log(data.key); return data.key;});

	legend.append("circle")
		.attr("cx", 0)
		.attr("cy", (lastIndex+2)*lineHeight- radius -1)
		.attr("r", zscale(d3.min(zdata)))
		.attr("fill", "grey")
		.attr("stroke-width", 5)
		.attr("stroke", "white");
	legend.append("text")
		.attr("x", zscale(d3.min(zdata)) + 15)
		.attr("y", (lastIndex+2) * lineHeight)
		.text(d3.min(zdata));

	legend.append("circle")
		.attr("cx", 0)
		.attr("cy", (lastIndex+3)*lineHeight + zscale(d3.max(zdata)) - radius -1)
		.attr("r", zscale(d3.max(zdata)))
		.attr("fill", "grey")
		.attr("stroke-width", 5)
		.attr("stroke", "white");
	legend.append("text")
		.attr("x", zscale(d3.max(zdata)) + 15)
		.attr("y", (lastIndex+3) * lineHeight + zscale(d3.max(zdata)))
		.text(d3.max(zdata));

	legend.attr("transform", "translate(" + (leftMargin + chartWidth + 30) + " , 50)");
}

function shadowPlot(svg, width, height, pivot, plotWidth, plotHeight) {
	svg.append('rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', width)
		.attr('height', pivot[1])
		.attr('fill', 'white');
	svg.append('rect')
		.attr('x', 0)
		.attr('y', pivot[1])
		.attr('width', width)
		.attr('height', height-pivot[1])
		.attr('fill', 'white');
	svg.append('rect')
		.attr('x', 0)
		.attr('y', pivot[1])
		.attr('width', pivot[0])
		.attr('height', plotHeight)
		.attr('fill', 'white');
	svg.append('rect')
		.attr('x', pivot[0]+plotWidth)
		.attr('y', pivot[1])
		.attr('width', width-pivot[0]-plotWidth)
		.attr('height', plotHeight)
		.attr('fill', 'white');
		
}

var axisMargin = 50;
var plotWidth = 1200;
var plotHeight = 800;

loadCSV(filename);
