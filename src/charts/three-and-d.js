import React from 'react';
import config from '../config';
import xhr from 'xhr';
import d3 from 'd3';


var ThreeAndD = React.createClass({

  getInitialState: function (){
    return { data_obj: {}};
  },

  componentDidMount: function(){
    
    var apiurl = config.api + '/agg_playerstats'
    xhr.get(apiurl, function(err, resp){
      var resp_obj = JSON.parse(resp.body)[0]
      this.setState({data_obj: resp_obj});
    }.bind(this))

  },

  componentWillUpdate: function(nextProps, nextState){
    this.drawChart(nextState.data_obj.data);
  },


  drawChart: function(data){

    console.log("drawChart()");
    console.log(data);

    // chart dimensions
    var p = 50, w = 960, h = 350;    

    // add canvas element
    var svg = d3.select("#chart1-3andd").append("svg")
      .attr("width", w + 2*p)
      .attr("height", h + 2*p)
      .append("g")
      .attr("transform", "translate(" + p + "," + p + ")");

    // define accessor functions

    // defensive rating
    var xVal = function(datum){
      try{
        // console.log(datum.per100stats[22])
        return datum.per100stats[22] 
      }catch(e){
        return 0
      }
    } 

    // 3pt percentage
    var yVal = function(datum){ 
      try{
        // console.log(datum.stats[12])
        return datum.stats[12] 
      }catch(e){
        return 0
      }
    } 

    // define scales

    console.log("MIN 3PT%: " + d3.min(data, yVal))
    console.log("MAX 3PT%: " + d3.max(data, yVal))

    console.log("MIN DRating: " + d3.min(data, xVal))
    console.log("MAX DRating: " + d3.max(data, xVal))

    var xScale = d3.scale.linear().domain([d3.min(data, xVal), d3.max(data, xVal)]).range([0, w]);
    var yScale = d3.scale.linear().domain([d3.min(data, yVal), d3.max(data, yVal)]).range([h, 0]);

    // add x/y axis
    var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", w)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Defensive Rating");

    // y-axis
    var yAxis = d3.svg.axis().scale(yScale).orient("left");
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("3PT %");

    // add dots for all elements in the dataset 
    data.forEach(function(datum){
      svg.append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xScale(xVal(datum)))
        .attr("cy", yScale(yVal(datum)))
        .style("fill", "blue") 
    }.bind(this));



  }, 


  render: function() {
    return (
      <div>
        <h3>3PT% vs. Defensive Rating</h3>
        <div id="chart1-3andd" className="chart"></div>
      </div>
    );
  }

});

export default ThreeAndD;
