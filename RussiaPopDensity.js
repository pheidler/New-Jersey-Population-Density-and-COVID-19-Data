//Width and height
var w = 1000;
var h = 1000;

      /*
      var projection = d3.geoAlbersUsa().translate([-2200, 780]).scale([9500]);

      var path = d3.geoPath().projection(projection);

      var colorScale = d3.scaleSqrt()
        .range([0.3,1]);

      var densityData;
      d3.csv("density.csv").then(function(data){
        densityData = data;
        colorScale.domain([
          0, 
          d3.max(data, function(data){
            return parseFloat(data.density);
          })
        ]);
        console.log(colorScale.domain());
        console.log(densityData);

      });

      //Create SVG element
      var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

      //Load in GeoJSON data
      d3.json("counties-10m.json").then(function(data) {
        console.log(data);



        var countyData = topojson.feature(data, data.objects.counties).features;
        var states = topojson.feature(data, data.objects.states).features;

        var counties = [];

        for(i = 0; i < countyData.length; i++){
          if(countyData[i].id > 34000 && countyData[i].id < 34042){
            countyData[i].id -= 34000;
            for(j = 0; j < densityData.length; j++){
              if(countyData[i].id == densityData[j].id){
                console.log("this is happening");
                countyData[i].density = densityData[j].density;
                countyData[i].covid = densityData[j].covid;
              }
            }
            counties.push(countyData[i]);
          }
        }
        console.log(counties);
        //counties.reduce

        console.log(counties);

        svg.selectAll(".state")
          .data(states)
          .enter()
          .append("path")
          .attr("class", "state")
          .attr("stroke", "gray")
          .attr("fill", "white")
          .attr("d", path);

        svg.selectAll(".county")
          .data(counties)
          .enter()
          .append("path")
          .attr("class", "county")
          //.attr("fill", "lightgray")
          .attr("stroke", "black")
          .attr("fill", function(d){ 
            console.log(d.density);
            return d3.interpolateBlues(colorScale(d.density)); })
          .attr("d", path);
       
      });

      */

/*
var path = d3.geoPath();

var svg = d3.select("body")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

var populationData;

d3.json("population.json").then(function(data) {
	populationData = data;
	console.log(data);
})

      //Load in GeoJSON data
d3.json("e.json").then(function(data) {
    console.log(data);

    //data = data.features;

    //var counties = topojson.feature(data, data.objects.counties).features;
    var states = topojson.feature(data, data.objects.states).features;
    var subcounties = topojson.feature(data, data.objects.cb_2014_34_cousub_500k)

    console.log(states);



    for(i = 0; i < data.length; i++){
    	for(j = 0; j < populationData.length; j++){
    		if(parseInt(data[i].properties.COUSUBFP) == parseInt(populationData[j][3])){
    			data[i].properties.populationDensity = parseInt(populationData[j][0])/parseInt(data[i].properties.ALAND);
    		}
    	}
    }
    //console.log(countyData);

   // svg.append("path")
    svg.selectAll(".counties")
        .data(data)
        .enter()
        .append("path")
        //.attr("class", "state")
        .attr("stroke", "black")
        .attr("fill", "none")
        .attr("d", path);

    console.log("done");
})
*/
/*

shp2json cb_2014_34_cousub_500k.shp -o nj.json

geoproject 'd3.geoConicEqualArea().parallels([34, 40.5]).rotate([90, 0]).fitSize([960, 960], d)' < counties-10m.json > nj-counties-albers.json

*/
var color = d3.scaleThreshold()
    .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
    .range(d3.schemeOrRd[9]);

/*
var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);
    */

var fixPopulationDensity = d3.scaleLinear().domain([0,11]).range([1, 4000]);

var projection = d3.geoAlbersUsa().translate([-4300,1400]).scale([17000]);

var path = d3.geoPath().projection(projection);

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

//Load in GeoJSON data
d3.json("data_final/counties.json").then(function(data) {


   data = data.features;
   counties = [];

   for(i = 0; i < data.length; i++){
   	  if(data[i].id > 34000 && data[i].id < 34042){
   	  	counties.push(data[i]);
   	  }
   }


    svg.selectAll(".counties")
        .data(counties)
        .enter()
        .append("path")
        .attr("class", "county")
        .attr("stroke", "grey")
        .attr("fill", "none")
        .attr("d", path);


})



d3.json("data_final/mygeodata_merged.json").then(function(data) {
   console.log(data);
   
   data = data.features;


   d3.json("data_final/population.json").then(function(populationData){
  	
   	for(i = 0; i < data.length; i++){
    	for(j = 0; j < populationData.length; j++){
    		if(parseInt(data[i].properties.COUSUBFP) === parseInt(populationData[j][3])){
    			data[i].properties.populationDensity = parseInt(populationData[j][0])/parseInt(data[i].properties.ALAND) * 1000;
    			console.log(data[i].properties.populationDensity);
    		}
    	}
    }

    //console.log(fixPopulationDensity.domain());

    //console.log(data);

    svg.selectAll(".subcounty")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "subcounty")
        .attr("stroke", "none")
        .attr("fill", function(d){ 
        	console.log(fixPopulationDensity(d.properties.populationDensity));
        	return color(fixPopulationDensity(d.properties.populationDensity)); })
        .attr("d", path);

   })
 


})


d3.json("data_final/states.json").then(function(data) {


   data = data.features;
   


    svg.selectAll(".state")
        .data(data)
        .enter()
        .append("path")
        .attr("class", "state")
        .attr("stroke", "lightgray")
        .attr("fill", "none")
        .attr("stroke-width", "1.5px")
        .attr("d", path);


})