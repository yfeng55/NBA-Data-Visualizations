import React from 'react';
import config from '../config';
import xhr from 'xhr';
import d3 from 'd3';
import $ from 'jquery';
import chartUtil from '../util/chart-util';


var ThreeAndD = React.createClass({

  getInitialState: function (){
    return { season_select: "2015-16", team_select: "All Teams", position_select: "SG/SF", min3pm_select: 0.0,
              team_obj: {}, data_obj: {}};
  },

  componentDidMount: function(){
    $("#loading-spinner").show();

    // get player stats
    var playerstatsurl = config.api + '/agg_playerstats'
    xhr.get(playerstatsurl, function(err, resp){
      var playerstats_obj = JSON.parse(resp.body)[0]
      this.setState({data_obj: playerstats_obj});

      // get team list
      var teamsurl = config.api + '/activeteams'
      xhr.get(teamsurl, function(err, resp){
        var teams_obj = JSON.parse(resp.body)[0]
        this.setState({team_obj: teams_obj});
      }.bind(this))

    }.bind(this))


  },

  componentWillUpdate: function(nextProps, nextState){
    this.drawChart(nextState.data_obj.data, nextState.team_select, nextState.position_select, nextState.min3pm_select);
    $("#loading-spinner").hide();
  },


  drawChart: function(unfiltered_data, teamselect, positionselect, min3pmselect){
    d3.select("svg").remove();

    //filter data
    var data = [];
    unfiltered_data.forEach(function(datum){
      // filter by team and position
      if( (datum.team == teamselect || teamselect == "All Teams") && 
          (chartUtil.containsPosition(datum.position, positionselect) || positionselect == "All Positions") &&
          (datum.stats[10] >= min3pmselect) ){

        data.push(datum)
      
      }
    }.bind(this))

    // chart dimensions
    var p = 40, w = 930, h = 420;    

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
        return 1 / parseFloat(datum.per100stats[22])
      }catch(e){
        return 0
      }
    } 

    // 3pt percentage
    var yVal = function(datum){ 
      try{
        // console.log(datum.stats[12])
        return parseFloat(datum.stats[12])
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
    var yScale = d3.scale.linear().domain([Math.max(d3.min(data, yVal)-0.02, 0), Math.min(d3.max(data, yVal)+0.02, 1.0)]).range([h, 0]);
    var circleRadius = function(mpg){
      return mpg/30 * 7 + 1; 
    }

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
        .text("1 / Defensive Rating");

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

    // create tooltip element
    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // add dots for all elements in the dataset 
    data.forEach(function(datum){

      svg.append("circle")
        .attr("class", "dot")
        .attr("r", circleRadius(datum.stats[6]))
        .attr("cx", xScale(xVal(datum)))
        .attr("cy", yScale(yVal(datum)))
        .style("fill", chartUtil.getTeamColors(datum.team).primary)
        .style("stroke", chartUtil.getTeamColors(datum.team).secondary)

        .style("opacity", .7)
        .on("mouseover", function(){
            tooltip.transition()
              .duration(100)
              .style("opacity", 1);
            tooltip.html(chartUtil.getTooltipHTML(datum))
              .style("left", (d3.event.pageX - 230) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(){
          tooltip.transition()
          .duration(100)
          .style("opacity", 0);
        }.bind(this));

    }.bind(this));
  }, 

  onSelectTeam: function(event){
    this.setState({team_select: event.target.value});
  },
  onSelectPosition: function(event){
    this.setState({position_select: event.target.value});
  },
  onSelectMin3PM: function(event){
    var min3pm = event.target.value.split('>=')[1].split(' ')[1];
    this.setState({min3pm_select: parseFloat(min3pm) });
  },

  render: function() {

    const teamoptions = []

    if(this.state.team_obj.teams){
      var teamkeys = Object.keys(this.state.team_obj.teams)
      teamkeys.forEach(function(key){
        teamoptions.push(<option value={key}>{key}</option>)
      }.bind(this))
    }

    return (
      <div>

        <h3>3PT% vs. Defensive Rating</h3>

        <div className="chart-container">

          <div id="loading-spinner" className="loading-spinner" ref="loading-spinner"><img className="spinning-ball" src="../../assets/imgs/bball-outline.svg" /></div>

          <div className="filters-container">
            <select className="select-filter" defaultValue="All Teams" onChange={this.onSelectTeam}>
              <option>All Teams</option>
              {teamoptions}
            </select>
            
            <select className="select-filter" defaultValue="2015-16">
              <option>2015-16</option>
              <option>2014-15</option>
              <option>2013-14</option>
            </select>

            <select className="select-filter" defaultValue="SG/SF" onChange={this.onSelectPosition}>
              <option>SG/SF</option>
              <option>All Positions</option>
              <option>PG</option>
              <option>SG</option>
              <option>SF</option>
              <option>PF</option>
              <option>C</option>
            </select>

            <select className="select-filter" defaultValue="> 0.0 3P Made" onChange={this.onSelectMin3PM}>
              <option>>= 0.0 3PM/Game</option>
              <option>>= 0.5 3PM/Game</option>
              <option>>= 1.0 3PM/Game</option>
              <option>>= 1.5 3PM/Game</option>
              <option>>= 2.0 3PM/Game</option>
              <option>>= 2.5 3PM/Game</option>
              <option>>= 3.0 3PM/Game</option>
            </select>
          </div>

          <div id="chart1-3andd" className="chart"></div>
        
        </div>


      </div>
    );
  }

});

export default ThreeAndD;





























