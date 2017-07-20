function get_data(subdict, key, level) {
	if (level == undefined)
		level = 0;

	console.log("subdict, path, length");
	console.log(subdict);
	
	var root = subdict['path'];
	console.log(root);
	
	var len = root.length -1;
	//console.log(len);
	
	if (root[len] == key) {
		return subdict;
	} else {
		var children = subdict['children'];
		for (var child in children) {
			var childdict = children[child];
			//console.log("child: " + child + " with dict:");
			//console.log(childdict);
	
			var solution = get_data(children[child], key, level+1);
			if (solution != undefined)
			return solution;
		}
	}
}

function getTimePoints(dict, entry) {
	subtree = get_data(dict[Object.keys(dict)[0]], entry);
	alice = subtree['read_count'].slice(0, 6);
	bob = subtree['read_count'].slice(6,12);
	return [entry, alice, bob];
}

function get_arrays_for_entry(dict, entry, index, node_only) {
	if (node_only == undefined) {
		node_only == false;
	}
	subtree = get_data(dict[Object.keys(dict)[0]], entry);
	var categories = [];
	var alice = [];
	var bob = [];

	if (node_only) {
		categories.push(entry);
		alice = dict['read_count'].slice(0, 6);
		bob = dict['read_count'].slice(6,12);
		return [categories, alice, bob];
	}

	for (var child in subtree['children']) {
		var child_dict = subtree['children'][child];
		var label = child_dict['path'][child_dict['path'].length-1];
		var alice_value = child_dict['read_count'][index];
		var bob_value = child_dict['read_count'][6 + index];

		categories.push(label);
		alice.push(alice_value);
		bob.push(bob_value);
	}
	//console.log(categories);
	//console.log(alice);
	//console.log(bob);

	return [categories, alice, bob];
}

function Heatmap (myDivId, dataset, width, height) {
	var returnDictionary = {};
	
	
	// set the margins for the actual charts
	margin = { top: 150, right: 0, bottom: 100, left: 100 };

	// calculate width and height of chart
	chartWidth = width - margin.left - margin.right;
	chartHeight = height - margin.top - margin.bottom;
	
	colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];
		


	stack = [];
	parent = "root";

	returnDictionary["init"] = function() {
		console.log(window.screen.availWidth);

		parent = Object.keys(dataset)[0];

		console.log("parent:");
		console.log(parent);

		var array = get_arrays_for_entry(dataset, parent, 0);
		categories = array[0];
		x1 = array[1];
		x2 = array[2];

		svg = d3.select(myDivId).append("svg");

		// set svg dimensions
		svg.attr("width", width).attr("height", height);

		var data = d3.zip(categories, x1, x2);


		var gridSize = Math.floor(chartWidth / x1.length);
		var legendElementWidth = gridSize*2;
		

		


		// define scales
		var min1 = d3.min(x1);
		var min2 = d3.min(x2);
		var max1 = d3.max(x1);
		var max2 = d3.max(x2);

		console.log(min1);
		console.log(min2);
		console.log(max1);
		console.log(max2);

		var buckets = 2;
		var colorScale = d3.scaleQuantile()
              		.domain([0, buckets - 1, d3.max([max1, max2])])
              		.range(colors);

		var x1Scale = d3.scaleLinear()
			.range([0, colors.length-0.0000000001])
			.domain([d3.min([min1, min2]), d3.max([max1, max2])]);

		for (var i = 0; i < x1.length; i++) {
			console.log(x1Scale(x1[i]));
		}
		
		// create group that contains all elements of the chart
		chartGroup = svg.append("g");

		  	// move chartgroup to its position in the svg.
		chartGroup.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

		rectGroup = fillHeatmap(chartGroup, data, colors, colorScale, "x2Scale", gridSize);

		backButton = chartGroup.append("rect")
			.attr("x", -55)
			.attr("y", 0)
			.attr("rx", 6)
			.attr("ry", 6)
			.attr("width", 50)
			.attr("height", element_height*2 + 3*padding)
			.attr("fill", d3.rgb("#AAAAAA"));

		
	};

	returnDictionary["update"] = function(newRoot) {

		if (newRoot == undefined) {
			newRoot == parent;
		}	


		/*this.alice_rects.exit().transition()
			.attr("width", 0)
			.attr("height", 0)
			.remove();

		this.bob_rects.exit().transition()
			.attr("fill", "transparent")
			.remove();*/

		//alice_rects.exit().remove();
		//svg.selectAll('rect').exit().remove();
			//.transition()
		xLabels.remove();
		alice_rects.remove();
		bob_rects.remove();		
		legend.remove();
		legendText.remove();

		console.log(newRoot);

		var array = get_arrays_for_entry(dataset, newRoot, 0);
		categories = array[0];
		x1 = array[1];
		x2 = array[2];

		
		var data = d3.zip(categories, x1, x2);

		var gridSize = Math.floor(chartWidth / categories.length);

		// define scales
		var min1 = d3.min(x1);
		var min2 = d3.min(x2);
		var max1 = d3.max(x1);
		var max2 = d3.max(x2);

		var buckets = 2;
		var colorScale = d3.scaleQuantile()
              		.domain([0, buckets - 1, d3.max([max1, max2])])
              		.range(colors);

		rectGroup = fillHeatmap(chartGroup, data, colors, colorScale, "x2Scale", gridSize);

		returnDictionary["doWhenClicked"]();
		returnDictionary["doOnMouseOver"]();
	};

	returnDictionary["doWhenClicked"] = function() {
		alice_rects.on("click", function() {
			clickedItem = d3.select(this);
			console.log(clickedItem.data()[0][0]);
			stack.push(parent);
			parent = clickedItem.data()[0][0];
			returnDictionary["update"](clickedItem.data()[0][0]);
		});
		

		backButton.on("click", function() {
			console.log(stack.length + "leeeenght");
			if (stack.length > 0) {
				parent = stack.pop();
				returnDictionary["update"](parent);
			}
		});
	};

	returnDictionary["doOnMouseOver"] = function() {
		var tooltip = d3.select("body")
			.append("div")
				.attr("class", "tooltip")
				.text("a simple tooltip");
		xLabels.on("mouseover", function() { 
			
			tooltip.html(generateTooltipText(d3.select(this).data()[0][0]));
			return tooltip.style("visibility", "visible");
		});
		xLabels.on("mousemove", function() {
			tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
		});
		xLabels.on("mouseout", function() {
			return tooltip.style("visibility", "hidden");
		});


		console.log("enable mouseover");
		alice_rects.on("mouseover", function() {
			console.log("mouseOver");
			d3.select(this)
				.attr("stroke", "black");

		});
		alice_rects.on("mouseout", function() {
			console.log("mouseOver");
			d3.select(this)
				.attr("stroke", d3.rgb("#E6E6E6"));

		});

		bob_rects.on("mouseover", function() {
			console.log("mouseOver");
			d3.select(this)
				.attr("stroke", "black");

		});
		bob_rects.on("mouseout", function() {
			console.log("mouseOver");
			d3.select(this)
				.attr("stroke", d3.rgb("#E6E6E6"));

		});

	};

	return returnDictionary;
}

function generateTooltipText(category) {
	var text = "";
	text = text.concat("category: " + category);
	return text;
}

function sharedStart(array){
	var A= array.concat().sort(), 
	a1= A[0], a2= A[A.length-1], L= a1.length, i= 0;
	while(i<L && a1.charAt(i)=== a2.charAt(i)) i++;
	return a1.substring(0, i);
}

function fillHeatmap(chartGroup, data, categoryColors, x1Scale, x2Scale, gridSize) {
	var rectGroup = chartGroup.selectAll(".rect")
		.data(data.filter(function(d) {
			console.log(d[1] + " - " + d[2]);
			console.log(d[1] != 0 || d[2] != 0);
			return d[1] != 0 || d[2] != 0;
		}))
		.enter();

	console.log("DAAAAAAAAAAAATAAAAAAAAAAAAAAAAAAAAA");
	console.log(rectGroup.data());

	var gridSize = Math.floor(chartWidth / rectGroup.data().length);
	//var gridSize = 50;
	console.log("DAATAAAAAAAAAAAAAAAAAAAAA");
	console.log(data);	
	categories = []
	for (var point in data)
		categories.push(data[point][0]);
	console.log(categories);

	

	highlightColor = "black";
	nohighlightColor = d3.rgb("#E6E6E6");
	
	padding = 1;
	element_height = (100 < gridSize-2*padding) ? 100 : gridSize-2*padding;
	element_height = 100;

	alice_rects = rectGroup.append("rect");
	
	alice_rects
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", gridSize-2*padding)
				.attr("height", element_height)
				.attr("class", "hour bordered")
				.attr("stroke", nohighlightColor)
				.attr("stroke-width", padding*2)
				.attr("rx", 6)
				.attr("ry", 6)
				.attr("fill", function(data, index) {
						console.log("floor color index test:");
						console.log(Math.floor(x1Scale(data[1])));
						//if (!colorDict.hasOwnProperty(data[3])) {
						//	categoryColors [data[3]] = colors[colorIndex];
						//	colorIndex += 1;
						//}
						//return categoryColors[Math.floor(x1Scale(data[1]))];
						return x1Scale(data[1]);
					})
				.attr("fill-opacity", function(data) { return 0.9;})
				.transition()
				.attr("x", function(data, index) {
						return index*gridSize+padding; 
					})
				.attr("y", padding);
	//alice_rects.exit().remove();

	bob_rects = rectGroup.append("rect");

	bob_rects
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", gridSize-2*padding)
				.attr("height", element_height)
				.attr("class", "hour bordered")
				.attr("stroke", nohighlightColor)
				.attr("stroke-width", padding*2)
				.attr("rx", 6)
				.attr("ry", 6)
				.attr("fill", function(data, index) {
						//if (!colorDict.hasOwnProperty(data[3])) {
						//	categoryColors [data[3]] = colors[colorIndex];
						//	colorIndex += 1;
						//}
						//return categoryColors[Math.floor(x1Scale(data[2]))];
						return x1Scale(data[1]);
					})
				.attr("fill-opacity", function(data) { return 0.9;})
				.transition()
				.attr("x", function(data, index) {
						return index*gridSize+padding; 
					})
				.attr("y", element_height+3*padding)



	//####################LABELS###############################################################

	var prefix = sharedStart(categories);
	var start = prefix.length;
	console.log("start" + start);

	var labelGroup = chartGroup.selectAll(".label")
		.data(data.filter(function(d) {
			return d[1] != 0 || d[2] != 0;
		}))
		.enter();


	
	xLabels = labelGroup.append("text");

	xLabels
		.text(function(d) { 
			var start = (start+14) < d[0].length ? prefix.length : (d[0].length - 14);
			var end = start+14;
			return d[0].substring(start, end) + ".."; 
		})

		//.attr("text-anchor", "middle")
		//.attr("transform", "rotate(90)")
		.attr("class", function(d,i) {			
			return "timeLabel mono axis"; 
		})
		.attr("y", function(d, i) { 
			console.log("xpos: " + (i*gridSize));
			return -i * gridSize; 
		})
		.attr("x", 0)
		.attr("transform", function(d,i) { 
			console.log(this.getComputedTextLength()+100);
			return "translate(" + gridSize/2 + ", -120) rotate(90)";
		});
 
	console.log("dataaaaa bitches");
	console.log([0].concat(x1Scale.quantiles()));

	legend = chartGroup.selectAll(".legend").data([0].concat(x1Scale.quantiles()), function(d) { return d; }).enter();

	legendElementWidth = chartWidth/9;
	/*chartGroup.append("rect")
		.attr("x", -50)
		.attr("y", -50)
		.attr("width", 200)
		.attr("height", 200)
		.attr("fill", "black");	*/	

	legend.enter().append("g")
		.attr("class", "legend");

	legend.append("rect")
		.attr("x", function(d, i) { 
			console.log("legendary");
			console.log("i: " + i)
			return legendElementWidth*i; 
		})
		.attr("y", 2*element_height + 10)
		.attr("width", legendElementWidth)
		.attr("height", 20)
		//.attr("fill", "black");
		.style("fill", function(d, i) {return colors[i]; });
	
	legendText = legend.append("text")
		.attr("class", "mono")
		.text(function(d) {return "≥ " + d.toFixed(2); })
		.attr("x", function(d,i) { return legendElementWidth * i; })
		.attr("y", 35 + 2*element_height + 10);


	return rectGroup;
}

function wrap(text, width) {
  text.each(function() {
	var text = d3.select(this),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.1, // ems
		y = text.attr("y"),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}
  });
}

function udpateBubbleChart(newData) {

}


