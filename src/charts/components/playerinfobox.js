import React from 'react';
import d3 from 'd3';
import chartUtil from '../../util/chart-util';


var PlayerInfo = React.createClass({


  handleError: function(){

  },

  render: function() {

    var imgsrc = "../../../public/imgs/profilepics/large/" + this.props.id + ".png";
    var altsrc = "../../../public/imgs/profilepics/large/default-large.svg"


    return (
      <div id="playerprofile" className="playerprofile">
        <img src={imgsrc} onError={(e)=>{e.target.src=altsrc}} className="playerprofpic" />

        <div id="playerinfosection" className="playerinfosection">
          <span className="playername">{this.props.name}</span>
        </div>

      </div>
    );
  }


});

export default PlayerInfo;