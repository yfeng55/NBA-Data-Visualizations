import React from 'react';
import {render} from 'react-dom';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import ThreeAndD from './charts/three-and-d'


var App = React.createClass({
	render: function(){
		return (
		    <div id="wrapper">
		        <div id="sidebar-wrapper">
		            <ul className="sidebar-nav">
		                <li id="sidebar-brand"><Link to="">
		                	<img src="../imgs/bball-filled.svg" width="27px" height="27px" />3&D</Link>
		                </li>
		                
		                <li><Link to="/three-and-d">3PT% vs. Defensive Rating</Link></li>
		                <li><Link to="chart-2">Chart 2</Link></li>
		                <li><Link to="chart-3">Chart 3</Link></li>
		                <li><Link to="chart-4">Chart 4</Link></li>
		                <li><Link to="chart-5">Chart 5</Link></li>
		            </ul>
		        </div>

		        <div id="page-content-wrapper"><div className="container-fluid"><div className="row"><div className="col-lg-12">
	                {this.props.children}
		        </div></div></div></div>
		    </div>
	    );
	}
});


render((
	<Router history={hashHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={ThreeAndD} />
			<Route path="three-and-d" component={ThreeAndD} />
			<Route path="chart-2" component={ThreeAndD} />
			<Route path="chart-3" component={ThreeAndD} />
			<Route path="chart-4" component={ThreeAndD} />
			<Route path="chart-5" component={ThreeAndD} />
		</Route>
	</Router>
), document.body);









