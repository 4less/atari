var test = [4748.0, 2310.0, 4862.0, 2293.0, 5164.0, 2365.0, 4239.0, 2260.0, 3643.0, 4439.0, 5313.0, 5057.0]

function div_ali_bob(listi){
	
	//put alice and bob in the correct order
	var alice = [];
	var bob = [];
	alice.push(listi[1], listi[3], listi[7], listi[0], listi[10], listi[5]);
	bob.push(listi[4], listi[6], listi[2], listi[8], listi[9], listi[11]);
	
	//put both lists together and let them print
	var together = [];
	together.push(alice, bob);
	
	return together;
}

div_ali_bob(test);

function print_line(listi, width, height){
	
	//choose a svg postion and align it
	var svg = d3.select("#chart").append("svg")
							.attr("width", width)
							.attr("height", height)
							.attr("align","center") //put it in the middle
	
	//get data ready
	var data = div_ali_bob(listi);
	
	//get time points
	var time_points = [0, 1, 3, 6, 8, 34]
	
	//frame the margin
	var mySvgWidth = width;	
	var mySvgHeight = height;	
	var margin = { top: 50, right: 20, bottom: 100, left: 30 };
	var myChartWidth	=	mySvgWidth	-	margin.left	-	margin.right ;	
	var myChartHeight	=	mySvgHeight	-	margin.top	-	margin.bottom ;
	
	//project it in form of a panel
	var	panel	=	svg.append("g")	
						.attr("transform",	"translate(" +	margin.left	+ "," + margin.top + ")");
	
	//get the axis ready
	//x-Axis
	var	xScale	=	d3.scaleLinear()
						.range([margin.right,	myChartWidth])	
						.domain([0, d3.max(time_points)]);	
						
	var xAxis = d3.axisBottom(xScale)
					.tickValues(time_points);	
	
	panel.append("g")	
		  .attr("class",	"axis")	
		  .attr("transform",	"translate(0,"	+	myChartHeight	+	")")	
		  .call(xAxis);

	//y-Axis
	
	//get highest value of the data
	if (d3.max(data[0]) > d3.max(data[1])){
		var maximum = d3.max(data[0]) 
	} else {
		var maximum = d3.max(data[1]) 
	}
	
	var	yScale	=	d3.scaleLinear()	
					  .range([myChartHeight, 0])	
					  .domain([0, maximum]);
					  
	var yAxis = d3.axisLeft(yScale);
	
	panel.append("g")	
		 .attr("class",	"axis")	
		 .call(yAxis)
		 .attr("transform",	"translate(" +	margin.right + "," + 0 + ")");
 
	// d3's line generator
	var line = d3.line()
		.x(function(d) { return xScale(d.time_point); }) // set the x values for the line generator
		.y(function(d) { return yScale(d.value); }); // set the y values for the line generator 
		//.curve(d3.curveMonotoneX) // apply smoothing to the line
		
	// create dict for Alice and Bob line
	var arr_1 = [];
	var arr_2 = [];
	for( i = 0; i < time_points.length; i++){
		arr_1[i] = {"time_point" : time_points[i], "value": data[0][i]};
		arr_2[i] = {"time_point" : time_points[i], "value": data[1][i]};
	}

	console.log(arr_1);
	console.log(arr_2);
	
	// Append the pathfor Alice, bind the data, and call the line generator 
	panel.append("path")
		.datum(arr_1) // 10. Binds data to the line 
		.attr("class", "line") // Assign a class for styling 
		.attr("d", line) // 11. Calls the line generator 
		.attr("stroke", "#FF1493");
		
	
	// Append the path for Bob, bind the data, and call the line generator 
	panel.append("path")
		.datum(arr_2) // 10. Binds data to the line 
		.attr("class", "line") // Assign a class for styling 
		.attr("d", line) // 11. Calls the line generator 
		.attr("stroke", "#6495ED");
		
	//label axes
	//x axis
	panel.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "end")
			.attr("x", mySvgWidth/2 + margin.left + margin.right)
			.attr("y",  myChartHeight + 30)
			.text("time points of measuring")
			.style("font-size", "13px")
			.style("font-weight", "bold");
	
	//y axis
	svg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("x", -myChartHeight/2)
			.attr("y", 0)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text("number of reads")
			.style("font-size", "13px")
			.style("font-weight", "bold");
			
	//give title
	svg.append("text")
			.attr("class", "title")
			.attr("text-anchor", "middle")
			.attr("x", mySvgWidth/2 + margin.left + margin.right)
			.attr("y",  mySvgHeight-5)
			.text("figure: comparison Alice and Bob")
			.style("font-size", "34px");
		
	//legend for identifying Alice and Bob
	
	//names and colors for each line
	var names = ["Alice", "Bob"];
	var colors = ["#FF1493", "#6495ED"];
		
	//print them
	for( i = 0; i < 2; i++){
		
		 svg.append("text")
				.attr("x", 70 + margin.left)
				.attr("y", margin.top + 8 + 20 * i)
				.attr("dy", ".35em")
				.text(names[i]);
				
		svg.append("rect")
				.attr("x", 50 + margin.left)
				.attr("y", margin.top + 20 * i)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", colors[i]);
	};
	
	
	};
	
print_line(test, 1000, 800);