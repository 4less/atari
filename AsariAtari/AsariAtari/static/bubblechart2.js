function Heatmap (myDivId, categories, x1, x2, width, height) {
	var returnDictionary = {};

	returnDictionary["init"] = function() {
		var svg = d3.select(myDivId).append("svg");

		// set svg dimensions
		svg.attr("width", width).attr("height", height);

		var data = d3.zip(categories, x1, x2);

		// set the margins for the actual charts
		var margin = { top: 50, right: 0, bottom: 100, left: 30 };

		// calculate width and height of chart
		var chartWidth = width - margin.left - margin.right;
		var chartHeight = height - margin.top - margin.bottom;

		var gridSize = Math.floor(chartWidth / x1.length);
		var legendElementWidth = gridSize*2;
		var buckets = 2;
		var colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];
		

		


		// define scales
		var min1 = d3.min(x1);
		var min2 = d3.min(x2);
		var max1 = d3.max(x1);
		var max2 = d3.max(x2);

		console.log(min1);
		console.log(min2);
		console.log(max1);
		console.log(max2);

		var x1Scale = d3.scaleLinear()
			.range([0, colors.length-0.0000000001])
			.domain([d3.min([min1, min2]), d3.max([max1, max2])]);

		for (var i = 0; i < x1.length; i++) {
			console.log(x1Scale(x1[i]));
		}

		/*var x1Scale = d3.scaleLinear()
			.range([0, x1.length])
			.domain([d3.min([d3.min(x1), d3.min(x2)]), d3.max([d3.max(x1), d3.max(x2)])]);*/
		/*var x2Scale = d3.scaleLinear()
			.range([chartHeight, 0])
			.domain([d3.min(yData), d3.max(yData)]);*/
		
		// create group that contains all elements of the chart
		var chartGroup = svg.append("g");

          	// move chartgroup to its position in the svg.
		chartGroup.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

		rectGroup = fillHeatmap(chartGroup, data, colors, x1Scale, "x2Scale", gridSize);
	};

	returnDictionary["update"] = function(newData) {
		
	};

	returnDictionary["doWhenClicked"] = function() {

	};

	returnDictionary["doOnMouseOver"] = function() {

	}

	return returnDictionary;
}

function fillHeatmap(chartGroup, data, categoryColors, x1Scale, x2Scale, gridSize) {
	var rectGroup = chartGroup.selectAll(".rect")
		.data(data)
		.enter()

	
	


	alice_rects = rectGroup.append("rect");

	alice_rects
				.attr("x", function(data, index) {
						return index*gridSize; 
					})
				.attr("y", 0)
				.attr("width", gridSize)
				.attr("height", gridSize)
				.attr("class", "hour bordered")
				.attr("rx", 6)
				.attr("ry", 6)
				.attr("fill", function(data, index) {
						console.log("floor color index test:");
						console.log(Math.floor(x1Scale(data[1])));
						//if (!colorDict.hasOwnProperty(data[3])) {
						//	categoryColors [data[3]] = colors[colorIndex];
						//	colorIndex += 1;
						//}
						return categoryColors[Math.floor(x1Scale(data[1]))];
					})
				.attr("fill-opacity", function(data) { return 0.9;});

	bob_rects = rectGroup.append("rect");

	bob_rects
				.attr("x", function(data, index) {
						return index*gridSize; 
					})
				.attr("y", gridSize)
				.attr("width", gridSize)
				.attr("height", gridSize)
				.attr("class", "hour bordered")
				.attr("rx", 6)
				.attr("ry", 6)
				.attr("fill", function(data, index) {
						//if (!colorDict.hasOwnProperty(data[3])) {
						//	categoryColors [data[3]] = colors[colorIndex];
						//	colorIndex += 1;
						//}
						return categoryColors[Math.floor(x1Scale(data[2]))];
					})
				.attr("fill-opacity", function(data) { return 0.9;});

	return rectGroup;
}

function udpateBubbleChart(newData) {

}


