import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';

import App from '../components/App.jsx';
import Home from '../components/Home.jsx';
import Topic from '../components/Topic.jsx';

import data from 'json!../dist/data.json';

//have to deal with server side not handlinging it later


// let topics = Object.keys(data).map( 
// 	(key) => <Topic name={key} />
// )

// let routes = topics.map(
// 	(topic, index) => <Route key={index} path={"/"+topic.props.name} display={topic} component={App} />
// )

// I can't get the dynamic route creation to work for some reason...

//	    
ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App} data={data} />
		<Route path="/:topic" component={App} data={data} />
	</Router>,
	document.getElementById('app')
); 