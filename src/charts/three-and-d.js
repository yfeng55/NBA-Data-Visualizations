import React from 'react';
import config from '../config';
import xhr from 'xhr';
import playerstats from '../../data-local/agg-playerstats/agg-playerstats_2015-16.json';


var ThreeAndD = React.createClass({

  getInitialState: function (){
    return { data: {}};
  },

  componentDidMount: function(){
    this.drawChart();
  },

  componentWillUpdate: function(nextProps, nextState){

  },

  drawChart: function(){
    console.log("drawChart()");
    console.log(playerstats);
  }, 

  render: function() {
    console.log("CONFIG")
    console.log(config.api)
    return (
      <div>
        <h3>3PT% vs. Defensive Rating</h3>
        <div className="chart"></div>
      </div>
    );
  }

});

export default ThreeAndD;
