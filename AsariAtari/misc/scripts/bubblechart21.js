function bubbleChart (myDivId, xData, yData, zData, categories, width, height, xlabel="xlabel", ylabel="ylabel") {
	var returnDictionary = {};

	returnDictionary["init"] = function() {
		var svg = d3.select(myDivId).append("svg");


		// set svg dimensions
		svg.attr("width", width).attr("height", height);

		var data = d3.zip(xData, yData, zData, categories);

		// set the margins for the actual charts
		var leftMargin = 50;
		var rightMargin	= 200;
		var topMargin = 20;
		var bottomMargin = 50;

		// calculate width and height of chart
		var chartWidth = width - leftMargin - rightMargin;
		var chartHeight = height - topMargin - bottomMargin;


		// define scales
		var xScale = d3.scaleLinear()
			.range([0, chartWidth])
			.domain([d3.min(xData), d3.max(xData)]);
		var yScale = d3.scaleLinear()
			.range([chartHeight, 0])
			.domain([d3.min(yData), d3.max(yData)]);	
		var zScale = d3.scaleSqrt()
			.range([10, 30])
			.domain([d3.min(zData), d3.max(zData)]);
		
		// create group that contains all elements of the chart
		var chartGroup = svg.append("g");

		// set the x and y axis
		setAxis(chartGroup, chartWidth, chartHeight, xScale, yScale);

		// label the axis
		setAxisLabels(chartGroup, chartWidth, chartHeight, xlabel, ylabel);

		// colors
		var colors = generateColorArray(4);
		colorDict = [];

		// fill data in the chart
		circleGroup = fillBubbleChart(chartGroup, data, colorDict, xScale, yScale, zScale);

		// create group for elements in the legend and on click information
		var legendGroup = chartGroup.append("g");

		// place legend
		var legend = setLegend(legendGroup, colorDict, chartWidth, zData, zScale);

		// place placeholder for information element
		var informationGroup = legendGroup.append("g");

		initInformationBox(informationGroup, data);
		

		// set tooltips
		//tooltipGroup = addTooltips(chartGroup, data, colorDict, xScale, yScale, zScale);

		// move legendGroup to its position in the chartGroup
		legendGroup.attr("transform", "translate(" + (chartWidth + 50) + ", 0 )");

		// move information to its position in the legendGroup
		informationGroup.attr("transform", "translate(" + 0 + ", " + (legend.node().getBBox().height + topMargin) + ")");
 
		// move chartgroup to its position in the svg.
		chartGroup.attr("transform", "translate(" + leftMargin + ", " + topMargin + ")");


		svg.append("rect")
			.attr("x", 0)
			.attr("y", 0)
			.attr("width", 100)
			.attr("height", 100)
			.attr("fill", "black")

	};

	returnDictionary["update"] = function(newData) {
		console.log("update");
		circleGroup.on("mouseover", function(){
			console.log();
			//d3.select(this).attr("fill",	"orange");	
		});
		/*tooltipGroup.on("mouseover", function() {
			d3.select(this).attr("fill-opacity", 100);
		});
		tooltipGroup.on("mouseout", function() {
			d3.select(this).attr("fill-opacity", 0);
		});*/
	};

	returnDictionary["doWhenClicked"] = function() {
		console.log("select items enabled");
		lastItem = null;
		selectedItem = null;
		circles.on("click", function() {
			// set the last item to the previously selected item
			lastItem = selectedItem;

			// set selected item to item that was clicked
			selectedItem = d3.select(this);

			// Set stroke of selected item to black
			d3.select(this).attr("stroke", "black");

			// if there is a last selected item, set its stroke back to white
			if (lastItem != null)
				lastItem.attr("stroke", "white");

			//set the information in some panel
			setItemInformation(selectedItem, xInformation, yInformation, zInformation, catInformation);
		});
	};

	returnDictionary["doOnMouseOver"] = function() {
		var tooltip = d3.select("body")
			.append("div")
				.attr("class", "tooltip")
				.text("a simple tooltip");
		circles.on("mouseover", function() { 
			d3.select(this)
				.attr("stroke", "black");
			
			tooltip.html(generateTooltipText(d3.select(this).data()[0][0], d3.select(this).data()[0][1], d3.select(this).data()[0][2], d3.select(this).data()[0][3]));
			return tooltip.style("visibility", "visible");
		});
		circles.on("mousemove", function() {
			tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		});
		circles.on("mouseout", function() {
			// set stroke of mousover item back to white after leaving the area of the item
			// Except for the item is currently selected
			if (!_.isEqual(selectedItem, d3.select(this)))
				d3.select(this)
					.attr("stroke", "white");
			return tooltip.style("visibility", "hidden");
		});
	}

	return returnDictionary;
}

function generateTooltipText(x, y, z, category) {
	var text = "";//"<p>";
	text = text.concat("x: " + x + "<br/>");
	text = text.concat("y: " + y + "<br/>");
	text = text.concat("z: " + z + "<br/>");
	text = text.concat("category: " + category);// + "</p>");
	return text;
}


/* 
 * HELPER FUNCTIONS
 */

// Set axis according to a given x scale, y scale, width, height and zero pos of the plot
function setAxis(chartGroup, width, height, xScale, yScale) {
	chartGroup.append("g")
		.attr("class", "axis")
		.call(d3.axisLeft(yScale));
	chartGroup.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + height + ")") 
		.call(d3.axisBottom(xScale));
}

function setAxisLabels(chartGroup, width, height, xlabel, ylabel) {
	chartGroup.append("text")
		.attr("transform", "rotate(-90)")
		.attr("x", -height/2)
		.attr("y", -30)
		.attr("fill", "black")
		.attr("font-family", "sans-serif")
		.style("text-anchor", "middle") 
		.text(ylabel);

	chartGroup.append("text")
		.attr("x", width/2)
		.attr("y", height + 40)
		.attr("fill", "black")
		.attr("font-family", "sans-serif")
		.style("text-anchor", "middle")
		.text(xlabel);
}

function generateColorArray(count) {
	return ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
}

function fillBubbleChart(chartGroup, data, categoryColors, xScale, yScale, zScale) {
	colorIndex = 0
	colors = generateColorArray(4);

	var circleGroup = chartGroup.selectAll(".circle")
		.data(data)
		.enter()

	circles = circleGroup.append("circle")
				.attr("cx", function(data) {
						return xScale(data[0]); 
					})
				.attr("cy", function(data) {
						return yScale(data[1]); 
					})
				.attr("r", function(data) {
						return zScale(data[2]);
					})
				.attr("fill", function(data) {
						if (!colorDict.hasOwnProperty(data[3])) {
							categoryColors [data[3]] = colors[colorIndex];
							colorIndex += 1;
						}
						return categoryColors[data[3]];
					})
				.attr("stroke", "white")
				.attr("stroke-width", function(data) { return 2;})
				.attr("fill-opacity", function(data) { return 0.5;});
	return circleGroup;
}

function addTooltips(chartGroup, data, categoryColors, xScale, yScale, zScale) {
	var tooltipGroup = chartGroup.selectAll(".tooltip")
		.data(data)
		.enter()
			.append("rect")
				.attr("x", function(data) {
						return xScale(data[0])+/*zScale(data[2]) + */10;
					})
				.attr("y", function(data) {
						return yScale(data[1]) + 10;
					})
				.attr("width", 100)
				.attr("height", 100);
	tooltipGroup.attr("fill-opacity", 0);
	return tooltipGroup;
}

function setLegend(chartGroup, colorDict, chartWidth, zData, zScale) {
	var legend = chartGroup.append("g");

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
		.attr("r", zScale(d3.min(zData)))
		.attr("fill", "grey")
		.attr("stroke-width", 5)
		.attr("stroke", "white");
	legend.append("text")
		.attr("x", zScale(d3.min(zData)) + 15)
		.attr("y", (lastIndex+2) * lineHeight)
		.text(d3.min(zData));

	legend.append("circle")
		.attr("cx", 0)
		.attr("cy", (lastIndex+3)*lineHeight + zScale(d3.max(zData)) - radius -1)
		.attr("r", zScale(d3.max(zData)))
		.attr("fill", "grey")
		.attr("stroke-width", 5)
		.attr("stroke", "white");
	legend.append("text")
		.attr("x", zScale(d3.max(zData)) + 15)
		.attr("y", (lastIndex+3) * lineHeight + zScale(d3.max(zData)))
		.text(d3.max(zData));

	return legend;
}

function setItemInformation(item, xInfo, yInfo, zInfo, catInfo) {
	var x = item.data()[0][0];
	var y = item.data()[0][1];
	var z = item.data()[0][2];
	var cat = item.data()[0][3];

	console.log("x: " + x);
	console.log("y: " + y);
	console.log("z: " + z);
	console.log("cat: " + cat);

	xInfo.text("x: " + x);
	yInfo.text("y: " + y);
	zInfo.text("z: " + z);
	catInfo.text("category: " + cat);

	console.log(xInfo.text);
}

function initInformationBox(informationGroup, data) {
	var fontSize = 16;
	var lineHeight = fontSize*1.4;
	
	/*informationGroup.append("rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 100)
		.attr("height", 200)
		.attr("fill", "yellow");*/

	xInformation = informationGroup.append("text")
		.attr("x", 0)
		.attr("y",fontSize)
		.attr("font-size", fontSize)
		.text("x:");
	yInformation = informationGroup.append("text")
		.attr("x", 0)
		.attr("y", fontSize + lineHeight*1)
		.attr("height", fontSize)
		.text("y:");
	zInformation = informationGroup.append("text")
		.attr("x", 0)
		.attr("y", fontSize + lineHeight*2)
		.attr("height", fontSize)
		.text("z:");
	catInformation = informationGroup.append("text")
		.attr("x", 0)
		.attr("y", fontSize + lineHeight*3)
		.attr("height", fontSize)
		.text("category:");
}

