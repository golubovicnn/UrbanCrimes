//Variable definitions
var margin = {top: 20, right: 20, bottom: 110, left: 50},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

//Load data
d3.csv("data/urbana_crimes.csv", function(data){

//----------------------------------------------------------------------------MAP VIEW - Aufgabe 1---------------------------------------------------------------------------------------------------------------

	//Create SVG - Map View
	var mySvg = d3.select("body")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	//Scale for longitute and latitute
	var longitudeScale = d3.scaleLinear()
			.domain([-125,-66])
			.range([0,width]);

	var latitudeScale = d3.scaleLinear()
			.domain([50,25])
			.range([0,height]);

	//Arrays for Longitude and latitude
	var latitudeArray = [];
	var longitudeArray = [];
	//var nameString = [];
	var counter=0;

	//Takes the Arrestee home city coordinates and puts them in an array
	for (var i = 0; i < data.length; i++) {
		if(data[i]['ARRESTEE HOME CITY - MAPPED']!=null){
			var result = data[i]['ARRESTEE HOME CITY - MAPPED'].split(/[,()]/);

			

			if((result[2]>25 && result[2]<50) || (result[3]>-66 && result[3]<-125) && (!isNaN(result[2]) || (!isNaN(result[3])))) // if mozda potrebna promena zbog name
			{
				latitudeArray[counter] = result[2];
				longitudeArray[counter] = result[3];
				
				//nameString[counter] = result[0];

				counter++;
			}
		}
	}	

	//coordinates of Urbana
	var URBANA_lat=40.106957;
	var URBANA_lon=-88.210905;

	var coordinates = [];
	for(var i = 0; i < latitudeArray.length; i++){
		coordinates[i] = {latitude: latitudeArray[i], longitude: longitudeArray[i]}; // jos jedan element 	name: nameString[i]
	}

	//Create a lines			
	mySvg.selectAll("line")
		.data(coordinates)
		.enter()
		.append("line")
        .attr("x1", function(){
				return longitudeScale(URBANA_lon);
		})
        .attr("y1", function(){
			return latitudeScale(URBANA_lat);
		})
	    .attr("x2", function(d){
			return longitudeScale(d.longitude);
		})
		.attr("y2", function(d){
			return latitudeScale(d.latitude);
		})
		.style("stroke", "blue")
		.style("stroke-width", 0.1); 

	 //Create a dots
	mySvg.selectAll("circle")
		.data(coordinates)
		.enter()
		.append("circle")
		.attr("cx", function(d){
			return longitudeScale(d.longitude);
		})
		.attr("cy", function(d){
			return latitudeScale(d.latitude);
		})
		.attr("r", 2)
		.style("fill", "#black");


		//jos jedna f-ja za Label u kojoj prolazis kroz sve koordinate i dodajes samo label


//---------------------------------------------------------------------------------END OF AUFGABE 1--------------------------------------------------------------------------------------------------------------










//---------------------------------------------------------------------------------BAR CHART AUFGABE 2-----------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------NUMBER OF RECORD FOR FEMALES AND MALES-------------------------------------------------------------------------------------------------
	
	//SVG for Bar chart
	var mySvg2 = d3.select("body")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	//Count records for males and females
	var countF = 0;
	var countM = 0;
	for (var i = 0; i < data.length; i++) {
		if(data[i]['ARRESTEE SEX'] == 'FEMALE')						
			countF++;
		else
			countM++;
	}
	
	var myData = [
		{sex: "FEMALE", count: countF},
		{sex: "MALE", count: countM}
	]

	var dataMax = d3.max(myData, function(d){ return d.count; });

	var barScale = d3.scaleLinear()
					.domain([0,dataMax])
					.range([0, height]);

	var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y = d3.scaleLinear().rangeRound([height, 0]);

    var g = mySvg2.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(myData.map(function(d) { return d.sex; }));
  	y.domain([0, dataMax]);

  	g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Number of Records");

	g.selectAll(".bar")
	    .data(myData)
	    .enter().append("rect")
	    .attr("class", "bar")
	    .attr("x", function(d) { return x(d.sex); })
	    .attr("y", function(d) { return y(d.count); })
	    .attr("width", x.bandwidth())
	    .attr("height", function(d) { return height - y(d.count); })
	    .style("fill", function(d){
					if (d.sex == "FEMALE") { return "#ff00aa";}
					if(d.sex == "MALE") { return "#000099";}
		});

//---------------------------------------------------------------------------------END OF AUFGABE 2--------------------------------------------------------------------------------------------------------------












//---------------------------------------------------------------------------------BEGIN AUFGABE 3---------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------HISTOGRAM------------------------------------------------------------------------------------------------------------------
	
	//SVG for Histogram
	var mySvg3 = d3.select("body")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	//Convert years to numbers
	data.forEach(function(d){
		d['YEAR OF ARREST'] = +d['YEAR OF ARREST'];
	})
	
	//Get all years in one array
	var yearsArray = [];
	for(var i = 0; i < data.length; i++){
		var found = false;
		var count = 0;
		while(count != yearsArray.length) {
			for(var j = 0; j < yearsArray.length; j++){
				if ( yearsArray[j] == data[i]['YEAR OF ARREST']){
					found=true;
				}
				count++;
			}
		}
		if(!found){
			yearsArray[yearsArray.length] = data[i]['YEAR OF ARREST'];
		}
	}
	//sort years ascending
	yearsArray.sort();

	//count number of records for each year
	var myData2 = [];
	for(var i = 0; i < yearsArray.length; i++){
		myData2[i] = {year: yearsArray[i], count: 0};		
	}

	data.forEach(function(d){
		myData2.forEach(function(f){
			if( f.year == d['YEAR OF ARREST'])
					f.count = f.count + 1;
		})
	})

	var dataMax2 = d3.max(myData2, function(d){
		return d.count;
	})

	//BarScale  for Histogram
	var barScale2 = d3.scaleLinear()
					.domain([0,dataMax2])
					.range([0, height]);

	var x2 = d3.scaleBand().rangeRound([0, width]).padding(0.1);
	var y2 = d3.scaleLinear().rangeRound([height, 0]);

    var g2 = mySvg3.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x2.domain(myData2.map(function(d) { return d.year; }));
  	y2.domain([0, dataMax2]);

  	g2.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x2));

    g2.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(5))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Number of Records");


	g2.selectAll(".bar")
		.data(myData2)
		.enter().append("rect")
	    .attr("class", "bar2")
	    .attr("x", function(d) { return x2(d.year); })
	    .attr("y", function(d) { return y2(d.count); })
	    .attr("width", function(d){
			return ((d.count/data.length)*100)*6;
		})
	    .attr("height", function(d) { return barScale2(d.count); })
	    .style("fill", "#5555AA");

//------------------------------------------------------------------------------------END OF AUFGABE 3-----------------------------------------------------------------------------------------------------------
















//-------------------------------------------------------------------------------------AUFGABE 4-----------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------SCATTERPLOT----------------------------------------------------------------------------------------------------------------
	
	//SVG for Scatterplot
	var mySvg4 = d3.select("body")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	var dateOfArrestArray = [];
	data.forEach(function(d, i) {
		dateOfArrestArray[i] = d['DATE OF ARREST'];
	})

	//Put date and distance in one array
	var myData3 = [];
	for (var i = 0; i < longitudeArray.length;i++){
		myData3[i] = {date: dateOfArrestArray[i], 
			distance: calculateDistance(URBANA_lon, URBANA_lat, longitudeArray[i], latitudeArray[i])}
	}

	//Format date
	var parseDate = d3.timeParse("%m/%d/%Y");
	myData3.forEach(function (d){
		d.date = parseDate(d.date);
	})

	//Calculate distance to Urbana
	function calculateDistance(lat1, lon1, lat2, lon2) {
	  var R = 6371; // km
	  var dLat = toRad(lat2 - lat1);
	  var dLon = toRad(lon2 - lon1);
	  var lat1 = toRad(lat1);
	  var lat2 = toRad(lat2);

	  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  var d = R * c;
	  return d;
}

	// Converts numeric degrees to radians
	function toRad(Value) {
	  return Value * Math.PI / 180;
		}
		
	var x1 = d3.scaleTime().range([0, width]),
	    y1 = d3.scaleLinear().range([height, 0]);

	    var xAxis1 = d3.axisBottom(x1),
	    yAxis1 = d3.axisLeft(y1);

	// create and setup main window
	var focusView = mySvg4.append("g")
	    .attr("class", "focusView")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    x1.domain(d3.extent(myData3, function(d) { return d.date; }));
	  	y1.domain([0, d3.max(myData3, function(d) { return d.distance; })]);

	focusView.append("g")
	      .attr("class", "axis x-axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis1);

	focusView.append("g")
	      .attr("class", "axis y-axis")
	      .call(yAxis1);

	// append scatter plot
	 var dots = focusView.append("g");
	 dots.attr("clip-path", "url(#clip)");
	 dots.selectAll("dot")
	    .data(myData3)
	    .enter().append("circle")
	    .attr('class', 'dot')
	    .attr("r",2)
	    .style("opacity", .5)
	    .style("fill", "#5555AA")
	    .attr("cx", function(d) { return x1(d.date); })
	    .attr("cy", function(d) { return y1(d.distance); });

	//Brushing

	margin2 = {top: 430, right: 20, bottom: 30, left: 40},
    height2 = 500 - margin2.top - margin2.bottom;

	var x2 = d3.scaleTime().range([0, width]),
    	y2 = d3.scaleLinear().range([height2, 0]);
	var xAxis2 = d3.axisBottom(x2);

	// setup the brush functionality
	var brush = d3.brushX()
	    .extent([[0, 0], [width, height2]])
	    .on("end", brushed);

	// create "invisible" defs-tag for clipping to main window
	mySvg4.append("defs").append("clipPath")
	    .attr("id", "clip")
	  .append("rect")
	    .attr("width", width)
	    .attr("height", height);
	// create and setup
	var contextView = mySvg4.append("g")
	    .attr("class", "contextView")
	    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

	x2.domain(x1.domain());
	y2.domain(y1.domain());

	// append scatter plot to brush chart area
	 var dots = contextView.append("g");
	     dots.attr("clip-path", "url(#clip)");
	     dots.selectAll("dot")
	        .data(myData3)
	        .enter().append("circle")
	        .attr('class', 'dotcontextView')
	        .attr("r",1)
	        .style("opacity", .5)
	        .attr("cx", function(d) { return x2(d.date); })
	        .attr("cy", function(d) { return y2(d.distance); })

	contextView.append("g")
	      .attr("class", "axis x-axis")
	      .attr("transform", "translate(0," + height2 + ")")
	      .call(xAxis2);

	contextView.append("g")
	      .attr("class", "brush")
	      // apply brushing to this group
	      .call(brush)
	      // set brush over full window
	      .call(brush.move, x1.range())
	      .select("rect.selection")
	      .style("fill","lightblue");

	//create brush function redraw scatterplot with selection
	function brushed() {
	  var selection = d3.event.selection;
	  x1.domain(selection.map(x2.invert, x2));
	  focusView.selectAll(".dot")
	        .attr("cx", function(d) { return x1(d.date); })
	        .attr("cy", function(d) { return y1(d.distance); });
	  focusView.select(".x-axis").call(xAxis1);
	}

//------------------------------------------------------------------------------------END OF AUFGABE 4-----------------------------------------------------------------------------------------------------------
  });//end of callback