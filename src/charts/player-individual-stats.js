import React from 'react';
import config from '../config';
import xhr from 'xhr';
import d3 from 'd3';
import chartUtil from '../util/chart-util';


var PlayerIndividualStats = React.createClass({

	getInitialState: function (){
		return { season_select: "2015-16", player_select: "201939", data_obj: {}, available_seasons: [], selected_tab: "shot_volume"};
	},


	componentDidMount: function(){

		// get gamelogs data for selected player
		var gamelogsurl = config.api + '/gamelogs/' + this.state.player_select;
		xhr.get(gamelogsurl, function(err, resp){
			var playerstats_obj = JSON.parse(resp.body)[0]
			this.setState({data_obj: playerstats_obj});

			// get available seasons
			var availableseasonsurl = config.api + '/available_seasons';
			xhr.get(availableseasonsurl, function(err, resp){
				var availableseasonsobj = JSON.parse(resp.body)[0]['available_seasons']
				this.setState({available_seasons: availableseasonsobj});
			}.bind(this))
	
		}.bind(this))

	},


	componentWillUpdate: function(nextProps, nextState){
		console.log("===== GAMELOGS DATA =====");
		console.log(nextState.data_obj);
		d3.select('#loading-spinner').style('display', 'none');
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


	render: function() {

		const seasons = []
		if(this.state.available_seasons){
			this.state.available_seasons.forEach(function(season){
				seasons.push(<option value={season}>{season}</option>)
			}.bind(this))
		}
		seasons.reverse()

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

					<div id="chart2-individualstats" className="chart"></div>

				</div>
			</div>
		);
	}



})


export default PlayerIndividualStats








