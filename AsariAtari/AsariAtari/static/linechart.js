var test = [4748.0, 2310.0, 4862.0, 2293.0, 5164.0, 2365.0, 4239.0, 2260.0, 3643.0, 4439.0, 5313.0, 5057.0];

function div_ali_bob(listi){
	
	//put alice and bob in the correct order
	var alice = [];
	var bob = [];
	alice.push(listi[1], listi[3], listi[7], listi[0], listi[10], listi[5]);
	bob.push(listi[4], listi[6], listi[2], listi[8], listi[9], listi[11]);
	
	//put both lists together and let them print
	var together = [];
	together.push(alice, bob) ;
	
	return together;
}

   var data = div_ali_bob(test);


	//choose a svg postion and align it
	var svg = d3.select("#linechart").append("svg")
							.attr("width", 800)
							.attr("height", 500)
							.attr("align","center"); //put it in the middle
	
	//get data ready
	var data = div_ali_bob(test);

	//get time points
	var time_points = [0, 1, 2, 3, 4, 5];
	var time_stands = ["0", "1", "3", "6", "8", "34"];


	//frame the marginBar
	var mySvgWidth = 700;
	var mySvgHeight = 500;
	var margin = { top: 50, right: 25, bottom: 100, left: 35 };
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
		  .attr("class", "x axis")
		  .attr("transform", "translate(0,"	+ myChartHeight	+ ")")
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
					  .domain([0, maximum]).nice();
					  
	var yAxis = d3.axisLeft(yScale);
	
	panel.append("g")	
		 .attr("class",	"yaxis lchart")
		 .call(yAxis)
		 .attr("transform",	"translate(" +	margin.right + "," + 0 + ")")
		.selectAll("text")
            .attr('dx', '-.5em');
 
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
	var arr = [arr_1, arr_2];
		
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
			.attr("x", mySvgWidth/2 + marginBar.left + marginBar.right)
			.attr("y",  mySvgHeight-5)
			.text("figure: comparison Alice and Bob")
			.style("font-size", "34px");
	*/

	//legend for identifying Alice and Bob
	
	//names and colors for each line
	var names = ["Alice", "Bob"];
	var colors = ["crimson", "#6495ED"];
		
	//print them
	//+ print circles
	for(var index = 0; index < 2; index++){

	    // Append the pathfor Alice, bind the data, and call the line generator
	    panel.append("svg:path")
            .attr('id',names[index])
		    .datum(arr[index]) // 10. Binds data to the line
		    .attr("class", "line") // Assign a class for styling
		    .attr("d", line) // 11. Calls the line generator
		    .attr("stroke", colors[index])

		var bubble = svg.selectAll("#linechart")
					.data(data[index])
					.enter();

		 svg.append("text")
				.attr("x", 800 - margin.left - 30)
				.attr("y", margin.top + 8 + 20 * index)
				.attr("dy", ".35em")
				.text(names[index]);
				
		svg.append("rect")
				.attr("x", 800 - margin.left - 50)
				.attr("y", margin.top + 20 * index)
				.attr("width", 18)
				.attr("height", 18)
				.style("fill", colors[index]);


		bubble.append("circle") // Uses the enter().append() method
            .attr("id", "circle" + names[index])
            .attr("class", "circle") // Assign a class for styling
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
        .style("stroke-width", 5)
        .style("stroke", "mediumspringgreen")
        .style("stroke-dasharray", ("6, 6"));

	//get all circles
	var circle = d3.selectAll("circle");

	d3.selectAll("circle").on('mouseover', function () {
        d3.select(this)
			.transition()
			.duration(200)
            .attr("r", 10);
    });
    circle.on('mouseout', function () {
        d3.select(this)
			.transition()
			.duration(500)
            .attr("r", 5);
        div.transition()
			.duration(500)
			.style("opacity", 0);
    });
	//get label value
	circle.on('click',	function(){
		var coords = Math.round(xScale.invert(d3.mouse(this)[0]));
		d3.select("#selected")
			.attr("x1", xScale(coords) + margin.left)
            .attr("x2", xScale(coords) + margin.left)

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
        document.getElementById('time-point').innerHTML = dayLabel;

        updateBars(dayLabel);
        change_color();
    });

	//update
function update_line(listi) {

	var data = div_ali_bob(listi);

	//get highest value of the data
	if (d3.max(data[0]) > d3.max(data[1])){
		var maximum = d3.max(data[0])
	} else {
		var maximum = d3.max(data[1])
	}

    yScale	=	d3.scaleLinear()
					  .range([myChartHeight, 0])
					  .domain([0, maximum]).nice();

	  yAxis = d3.axisLeft(yScale);

	  panel.selectAll("g .yaxis.lchart")
            .transition().duration(500)
            .call(yAxis);


	// create dict for Alice and Bob line
	var arr_1 = [];
	var arr_2 = [];
	for( i = 0; i < time_points.length; i++){
		arr_1[i] = {"time_point" : time_points[i], "value": data[0][i]};
		arr_2[i] = {"time_point" : time_points[i], "value": data[1][i]};
	}
	var arr = [arr_1, arr_2];

   // panel.selectAll("#selepath").remove();
   // svg.selectAll("circle").remove();

	for(var index = 0; index < 2; index++){

	      // Append the pathfor Alice, bind the data, and call the line generator
	     panel.select("#"+names[index])
		    .datum(arr[index]) // 10. Binds data to the line
            .transition().duration(500)
		    .attr("class", "line") // Assign a class for styling
		    .attr("d", line) // 11. Calls the line generator
		    .attr("stroke", colors[index]);


		svg.selectAll("#circle" + names[index]) // Uses the enter().append() method
                .data(data[index])
                .transition().duration(500)
   		 		.attr("class", "dot") // Assign a class for styling
		 		.attr("cx", function(d, i) { return xScale(i) + margin.left; })
				.attr("cy", function(d) { return yScale(d) + margin.top; })
				.attr("r", 5)
				.style("fill", colors[index]);
	};

    d3.selectAll("circle").on('click',	function(){
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
        document.getElementById('time-point').innerHTML = dayLabel;

        updateBars(dayLabel);
    });

    //get all circles
	var circle = d3.selectAll("circle");

	d3.selectAll("circle").on('mouseover', function () {
        d3.select(this)
			.transition()
			.duration(200)
            .attr("r", 10);
    });
    circle.on('mouseout', function () {
        d3.select(this)
			.transition()
			.duration(500)
            .attr("r", 5);
    });


}


