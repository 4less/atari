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
							.attr("align","center"); //put it in the middle
	
	//get data ready
	var data = div_ali_bob(listi);
	
	//get time points
	var time_points = [0, 1, 2, 3, 4, 5];
	var time_stands = ["0", "1", "3", "6", "8", "34"];

	
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
					.tickValues(time_points)
					.tickFormat(function(d,i){ return time_stands[i] });;
	
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

	/*
	//give title
	svg.append("text")
			.attr("class", "title")
			.attr("text-anchor", "middle")
			.attr("x", mySvgWidth/2 + margin.left + margin.right)
			.attr("y",  mySvgHeight-5)
			.text("figure: comparison Alice and Bob")
			.style("font-size", "34px");
	*/

	//legend for identifying Alice and Bob
	
	//names and colors for each line
	var names = ["Alice", "Bob"];
	var colors = ["#FF1493", "#6495ED"];
		
	//print them
	//+ print circles
	for(var index = 0; index < 2; index++){

		var bubble = svg.selectAll("#chart")
					.data(data[index])
					.enter();

		 svg.append("text")
				.attr("x", 70 + margin.left)
				.attr("y", margin.top + 8 + 20 * index)
				.attr("dy", ".35em")
				.text(names[index]);
				
		svg.append("rect")
				.attr("x", 50 + margin.left)
				.attr("y", margin.top + 20 * index)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", colors[index]);


		bubble.append("circle") // Uses the enter().append() method
   		 		.attr("class", "dot") // Assign a class for styling
		 		.attr("cx", function(d, i) { return xScale(i) + margin.left; })
				.attr("cy", function(d) { return yScale(d) + margin.top; })
				.attr("r", 5)
				.style("fill", colors[index]);
	};

    //draw line
    svg.append("svg:line")
		.attr("id", "selected")
        .attr("class", "line")
        .attr("x1", xScale(0) + margin.left)
        .attr("y1", margin.top)
        .attr("x2", xScale(0) + margin.left)
        .attr("y2", myChartHeight + margin.top)
        .style("stroke-width", 2)
        .style("stroke", "black");

	//get all circles
	var circle = d3.selectAll("circle");

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

	circle.on('mouseover', function () {
        d3.select(this)
            .attr("r", 10);
		div.transition()
			.duration(200)
			.style("opacity", .9);
		div.html("Alice: " + 42 + "</br>" + "Bob: " + 42)
			.style("left", (d3.event.pageX - 25) + "px")
			.style("top", (d3.event.pageY) + "px");
    });
    circle.on('mouseout', function () {
        d3.select(this)
            .attr("r", 5);
        div.transition()
			.duration(600)
			.style("opacity", 0);
    });

	//get label value
	circle.on('click',	function(){
		var coords = Math.round(xScale.invert(d3.mouse(this)[0]));
		d3.select("#selected")
			.attr("x1", xScale(coords) + margin.left)
            .attr("x2", xScale(coords) + margin.left);

        console.log(coords);
        if (coords == 2) {
            dayLabel = 3;
        }
        else if (coords == 3) {
            dayLabel = 6;
        }
        else if (coords == 4) {
            dayLabel = 8;
        }
        else if (coords == 5) {
            dayLabel = 34;
        }
        else {
            dayLabel = coords;
        }
        document.getElementById('output').innerHTML = dayLabel;
    });
};

print_line(test, 700, 300);