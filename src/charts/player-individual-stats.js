import React from 'react';
import config from '../config';
import xhr from 'xhr';
import d3 from 'd3';
import chartUtil from '../util/chart-util';


var PlayerIndividualStats = React.createClass({

	getInitialState: function (){

		var c = function(x) {
			var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#009BFF", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
			return colors[x % colors.length];
		}

		return { season_select: "career", player_select: "201939", data_obj: {}, selected_tab: "percentage",
			stat_fields: [27, 22, 21, 23, 24, 13], selected_stats: [27, 22],
			colorscale: c
		};
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
			this.drawPercentageChart(nextState.data_obj, nextState.season_select, nextState.selected_stats);
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


	drawPercentageChart: function(dataobj, season, selected_stats){
		d3.selectAll('svg').remove();

		var data = [];

		if(season == "career"){
			dataobj['seasons_played'].forEach(function(season){
				var season_formatted = season-1 + "-" + season.toString().slice(-2)

				dataobj[season_formatted].forEach(function(datum){
					if(datum.length >= 27){ data.push(datum) }
				}.bind(this))

			}.bind(this));
		}else{
			dataobj[season].forEach(function(datum){
				if(datum.length >= 27){ data.push(datum) }
			}.bind(this))	
		}

		var maxYVal = 0; var gamesplayed = [];
		selected_stats.forEach(function(statindex){
			data.forEach(function(datum){
				if(parseInt(datum[statindex]) > maxYVal){ console.log("NEW MAXY VAL: " + datum[statindex]); maxYVal = datum[statindex] }
				gamesplayed.push(datum[2])
			}.bind(this))
		}.bind(this))
		

		// chart dimensions
    	var p = 40, w = 900, h = 370;
    	var svg = d3.select("#chart2-individualstats").append("svg")
    		.attr("width", w + 3*p)
			.attr("height", h + 3*p)
			.append("g")
			.attr("transform", "translate(" + 1.25*p + "," + p + ")");


		// define scales
	    var x = d3.scale.ordinal().domain(gamesplayed).rangePoints([0, w]);
	    var y = d3.scale.linear().domain([0, maxYVal]).range([h, 0]);
	    var c = this.state.colorscale;

	    // define x/y axis
	    var xAxis = d3.svg.axis().scale(x).orient("bottom");
	    var yAxis = d3.svg.axis().scale(y).orient("left");

	    var tickwidth = Math.round((data.length / w) * 32.9268)
	    console.log("===== tick width =====")
	    console.log(tickwidth)

	    svg.append('g')
	    	.attr('class', 'axis')
	    	.call(xAxis)
	    	.attr("transform", "translate(" + 0 + "," + (h)+")")
	    	.selectAll("text")
	    		.style("text-anchor", "end")
	    		.attr("dx", "-.5em")
	    		.attr("dy", "0em")
	    		.attr("transform", function(d){ return "rotate(-45)" })
	    		.each(function(d, i){ if( Math.ceil(i % tickwidth) != 0 && gamesplayed.length > 60){ this.remove(); } });


		svg.append("g")
			.attr("class", "axis")
			.call(yAxis)


		svg.selectAll(".tick").each(function(d, i){ if (d==0){ this.remove(); }});

	    // draw lines
	    selected_stats.forEach(function(statindex, i){
	    	var line = d3.svg.line()
		    	.x(function(d){ return x(d[2]) })
		    	.y(function(d){ return y(d[statindex]) });

	    	svg.append("path")
		    	.datum(data)
		    	.attr("class", "line")
		    	.attr("d", line)
		    	.style({"stroke": c(statindex) })

	    	// append line label
	    	svg.append("text")
	    		.attr("x", x(data[data.length-1][2]))
	    		.attr("y", y(data[data.length-1][statindex]))
	    		.attr("dx", "5px")
	    		.text(chartUtil.getStatKeyFromIndexInGamelog(statindex));
	    }.bind(this));

	},

	drawVolumeChart: function(dataobj, season){
		d3.selectAll('svg').remove();
	},


	selectFilter: function(statindex){
		if(this.state.selected_stats.includes(statindex)){
			var newset = this.state.selected_stats;
			newset.splice(newset.indexOf(statindex), 1);
			this.setState({selected_stats: newset})
		}else{
			var newset = this.state.selected_stats;
			newset.push(statindex);
			this.setState({selected_stats: newset})
		}
	},


	render: function() {

		// create seasons select options //
		const seasons = []
		seasons.push(<option value="career">career</option>)
		if(this.state.data_obj.seasons_played){
			this.state.data_obj.seasons_played.forEach(function(season){
				var season_formatted = season-1 + "-" + season.toString().slice(-2)
				seasons.push(<option value={season_formatted}>{season_formatted}</option>)
			}.bind(this))
		}
		seasons.reverse()


		// create chart filters //
		var filters = [];
		this.state.stat_fields.forEach(function(statindex){
			var filterstyle = null;
			if(this.state.selected_stats.includes(statindex)){
				filterstyle = { backgroundColor: this.state.colorscale(statindex), border: "3px solid " + this.state.colorscale(statindex) };
			}else{
				filterstyle = { backgroundColor: "#ffffff", border: "3px solid " + this.state.colorscale(statindex) }
			}

			var filter = (
				<div className="statfilter">
					<div className="filtercircle" style={filterstyle} onClick={this.selectFilter.bind(this, statindex)}></div>
					{chartUtil.getStatKeyFromIndexInGamelog(statindex)}
				</div>
			)
			filters.push(filter)
		}.bind(this))


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
						<select className="select-filter" defaultValue="career" onChange={this.onSelectSeason}>
							{seasons}
						</select>
					</div>


					<button id="percentage-tab" className={percentTabClass} onClick={this.onSwitchTabs}>Per-Game Stats</button>
					<button id="volume-tab" className={volumeTabClass} onClick={this.onSwitchTabs}>Efficiency</button>
					<div id="chart2-individualstats" className="chart"></div>

					{filters}

				</div>
			</div>
		);
	}



})


export default PlayerIndividualStats








