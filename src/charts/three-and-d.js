import React from 'react';
import config from '../config';
import xhr from 'xhr';



var ThreeAndD = React.createClass({

  getInitialState: function (){
    return { data: {}};
  },

  componentDidMount: function(){

  },

  componentWillUpdate: function(nextProps, nextState){

  },

  drawChart: function(){

  }, 

  render: function() {
    console.log("CONFIG")
    console.log(config.api)
    return (
      <div><h3>Three-And-D</h3></div>
    );
  }

});

export default ThreeAndD;
