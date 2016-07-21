import React from 'react';
import config from '../config';
import xhr from 'xhr';
import d3 from 'd3';
import chartUtil from '../util/chart-util';


var PlayerIndividualStats = React.createClass({

	getInitialState: function (){
		return { season_select: "2015-16", player_select: "201939", data_obj: {}, selected_tab: "percentage"};
	},


	componentDidMount: function(){

		// get gamelogs data for selected player
		var gamelogsurl = config.api + '/gamelogs/' + this.state.player_select;
		xhr.get(gamelogsurl, function(err, resp){
			var playerstats_obj = JSON.parse(resp.body)[0]
			this.setState({data_obj: playerstats_obj});
		}.bind(this))

	},


	componentWillUpdate: function(nextProps, nextState){
		d3.select('#loading-spinner').style('display', 'none');
	
		if(nextState.selected_tab == "percentage"){
			this.drawPercentageChart(nextState.data_obj, nextState.season_select);
		}else{
			this.drawVolumeChart(nextState.data_obj, nextState.season_select);
		}
	},



	///// event handlers /////
	onSelectPlayer: function(event){
		var gamelogs = config.api + '/gamelogs/' + event.target.value;
		xhr.get(gamelogs, function(err, resp){
			var playerstats_obj = JSON.parse(resp.body)[0]
			this.setState({data_obj: playerstats_obj});
			d3.select('#loading-spinner').style('display', 'none')
		}.bind(this))

		this.setState({player_select: event.target.value});
	},

	onSelectSeason: function(event){
		this.setState({ season_select: event.target.value });
	},

	onSwitchTabs: function(){
		if(this.state.selected_tab == "volume"){
			this.setState({selected_tab: "percentage"})
		}else{
			this.setState({selected_tab: "volume"})
		}
	},


	drawPercentageChart: function(dataobj, season){
		d3.selectAll('svg').remove();

		var data = [];
		dataobj[season].forEach(function(datum){
			if(datum.length >= 27){ data.push(datum) }
		}.bind(this))

		var maxYVal = 0; var gamesplayed = [];
		data.forEach(function(datum){
			if(parseInt(datum[27]) > maxYVal){ console.log("NEW MAXY VAL: " + datum[27]); maxYVal = datum[27] }
			gamesplayed.push(datum[2])
		}.bind(this))

		// chart dimensions
    	var p = 40, w = 930, h = 380;
    	var svg = d3.select("#chart2-individualstats").append("svg")
    		.attr("width", w + 2*p)
			.attr("height", h + 4*p)
			.append("g")
			.attr("transform", "translate(" + 1.25*p + "," + p + ")");


		// define scales
	    var x = d3.scale.ordinal().domain(gamesplayed).rangePoints([0, w]);
	    var y = d3.scale.linear().domain([0, maxYVal]).range([h, 0]);
	    

	    // define x/y axis
	    var xAxis = d3.svg.axis().scale(x).orient("bottom");
	    var yAxis = d3.svg.axis().scale(y).orient("left");

	    svg.append('g')
	    	.attr('class', 'axis')
	    	.call(xAxis)
	    	.attr("transform", "translate(" + 0 + "," + (h)+")")
	    	.selectAll("text")
	    		.style("text-anchor", "end")
	    		.attr("dx", "-.5em")
	    		.attr("dy", "0em")
	    		.attr("transform", function(d){ return "rotate(-45)" })
	    		.each(function(d, i){ if(i%2 == 0 && gamesplayed.length > 60){ this.remove(); } });


		svg.append("g")
			.attr("class", "axis")
			.call(yAxis)


		svg.selectAll(".tick").each(function(d, i){ if (d==0){ this.remove(); }});



	    console.log("===== DATA =====")
	    console.log(data)
	    console.log("===== maxYVal =====")
	    console.log(maxYVal)
	    console.log("===== DOMAIN =====")
	    console.log(gamesplayed)

	    // draw lines
	    var line = d3.svg.line()
	    	.x(function(d){ return x(d[2]) })
	    	.y(function(d){ return y(d[27]) });


    	svg.append("path")
	    	.datum(data)
	    	.attr("class", "line")
	    	.attr("d", line)
	    	.style({"stroke": "#0099ff"})


	},

	drawVolumeChart: function(dataobj, season){
		d3.selectAll('svg').remove();
	},



	render: function() {

		const seasons = []
		if(this.state.data_obj.seasons_played){
			this.state.data_obj.seasons_played.forEach(function(season){
				var season_formatted = season-1 + "-" + season.toString().slice(-2)
				seasons.push(<option value={season_formatted}>{season_formatted}</option>)
			}.bind(this))
		}
		seasons.reverse()


		//set selected state of chart tabs
		var percentTabClass = "charttab"; var volumeTabClass = "charttab";
		percentTabClass += (this.state.selected_tab == "percentage") ? " selected" : "";
		volumeTabClass += (this.state.selected_tab == "volume") ? " selected" : "";

		console.log("PERCENT TAB CLASS: " + percentTabClass);
		console.log("VOLUME TAB CLASS: " + volumeTabClass);		

		return (
			<div>
				<h3 className="inline-header">Individual Stats View </h3>
				<input ref="player_select_field" name="player_select_field" className="stat_select_field" type="text"
            		defaultValue={this.state.player_select} onChange={this.onSelectPlayer}/>

				<div className="chart-container">

					<div id="loading-spinner" className="loading-spinner" ref="loading-spinner"><img className="spinning-ball" src="../../public/imgs/bball-outline.svg" /></div>

					<div className="filters-container">
						<select className="select-filter" defaultValue="2015-16" onChange={this.onSelectSeason}>
							{seasons}
						</select>
					</div>


					<button id="percentage-tab" className={percentTabClass} onClick={this.onSwitchTabs}>Per-Game Stats</button>
					<button id="volume-tab" className={volumeTabClass} onClick={this.onSwitchTabs}>Efficiency</button>
					<div id="chart2-individualstats" className="chart"></div>

				</div>
			</div>
		);
	}



})


export default PlayerIndividualStats








