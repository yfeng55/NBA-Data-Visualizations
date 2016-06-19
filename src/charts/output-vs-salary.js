import React from 'react';
import config from '../config';
import xhr from 'xhr';
import d3 from 'd3';
import chartUtil from '../util/chart-util';


var OutputVsSalary = React.createClass({

  getInitialState: function (){
    return { season_select: "2015-16", team_select: "All Teams", position_select: "All Positions", stat_select: "PPG",
              team_obj: {}, data_obj: {}};
  },

  componentDidMount: function(){

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
    this.drawChart(nextState.data_obj.data, nextState.team_select, nextState.position_select, nextState.stat_select);
  },


  drawChart: function(unfiltered_data, teamselect, positionselect, statSelect){
    d3.select("svg").remove();

    //filter data
    var data = [];
    unfiltered_data.forEach(function(datum){
      // filter by team and position
      if( (datum.team == teamselect || teamselect == "All Teams") && 
          (chartUtil.containsPosition(datum.position, positionselect) || positionselect == "All Positions") ){
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
    // salary
    var xVal = function(datum){
      try{
        return parseFloat(datum.salary.replace(/\$|,/g, ''));
      }catch(e){
        return 0
      }
    } 

    // (stat selection)
    var yVal = function(datum){ 
      try{
        // return parseFloat(datum.stats[26])
        return parseFloat(chartUtil.getStat(statSelect, datum))
      }catch(e){
        return 0
      }
    } 

    // define scales

    console.log("MIN PPG: " + d3.min(data, yVal))
    console.log("MAX PPG: " + d3.max(data, yVal))

    console.log("MIN SALARY: " + d3.min(data, xVal))
    console.log("MAX SALARY: " + d3.max(data, xVal))

    var xScale = d3.scale.linear().domain([d3.min(data, xVal), d3.max(data, xVal)]).range([0, w]);
    var yScale = d3.scale.linear().domain([d3.min(data, yVal), d3.max(data, yVal)]).range([h, 0]);
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
        .text("Player Salary");

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
        .text(statSelect);

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
            tooltip.html(chartUtil.getTooltipHTML(datum, [{name: "Salary", value: datum.salary}] ))
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

  onSelectYStat: function(event){
    console.log("changed stat: " + event.target.value);
    this.setState({ stat_select: event.target.value });
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

        <h3 className="inline-header">Salary vs. </h3>
        <input ref="stat_select_field" name="stat_select_field" className="stat_select_field" type="text"
            defaultValue={this.state.stat_select} onChange={this.onSelectYStat}/>


        <div className="chart-container">

          <div id="loading-spinner" className="loading-spinner" ref="loading-spinner"><img className="spinning-ball" src="../../public/imgs/bball-outline.svg" /></div>

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
              <option>All Positions</option>
              <option>SG/SF</option>
              <option>PG</option>
              <option>SG</option>
              <option>SF</option>
              <option>PF</option>
              <option>C</option>
            </select>

          </div>

          <div id="chart1-3andd" className="chart"></div>
        
        </div>


      </div>
    );
  }

});

export default OutputVsSalary;





























