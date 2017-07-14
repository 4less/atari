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
		

		


		/*/ define scales
		var x1Scale = d3.scaleLinear()
			.range([0, chartWidth])
			.domain([d3.min(xData), d3.max(xData)]);
		var x2Scale = d3.scaleLinear()
			.range([chartHeight, 0])
			.domain([d3.min(yData), d3.max(yData)]);	*/
		
		// create group that contains all elements of the chart
		var chartGroup = svg.append("g");

          	// move chartgroup to its position in the svg.
		chartGroup.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

		rectGroup = fillHeatmap(chartGroup, data, colors, "x1Scale", "x2Scale", gridSize);
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


	rects = rectGroup.append("rect");

	rects
				.attr("x", function(data, index) {
						return index*gridSize; 
					})
				.attr("y", 0)
				.attr("width", gridSize)
				.attr("height", gridSize*2)
				.attr("fill", function(data) {
						//if (!colorDict.hasOwnProperty(data[3])) {
						//	categoryColors [data[3]] = colors[colorIndex];
						//	colorIndex += 1;
						//}
						return "red";
					})
				.attr("fill-opacity", function(data) { return 0.9;});
	return rectGroup;
}

function udpateBubbleChart(newData) {

}


