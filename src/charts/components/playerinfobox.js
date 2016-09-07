import React from 'react';
import d3 from 'd3';
import chartUtil from '../../util/chart-util';


var PlayerInfo = React.createClass({


  render: function() {

    var imgsrc = "../../../public/imgs/profilepics/large/" + this.props.id + ".png";



    return (
      <div id="playerprofile" className="playerprofile">
        <img src={imgsrc} />

        {this.props.name}
      </div>
    );
  }


});

export default PlayerInfo;