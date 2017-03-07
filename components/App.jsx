import React from 'react';
import ReactDOM from 'react-dom';


import Home from './Home.jsx';
import Topic from './Topic.jsx';
import Nav from './Nav.jsx'; //need the ./ for some reason

class App extends React.Component {

    constructor(props) {
        super(props);    //gets this for component
        console.log('constructing app');

        this.state = {
            data: this.props.route.data,    // route contains the params passed to the Route
            humanPath: ['Home'],
            path: ['/'],
            display: <Home data={this.props.route.data.topics} />
        }
    }

    componentWillReceiveProps(nextProps) {
        let currentTopic = this.props.params.topic;     // params contains the /:topic parsed from the URL
        let nextTopic = nextProps.params.topic;
        if (currentTopic === nextTopic) {
            return;
        }

        if (nextTopic === undefined || nextTopic === 'index.html') {
            this.setState({
                path: [''],
                humanPath: ['Home'],
                display: <Home data={this.state.data.topics} />
            });
        } else {
            this.setState({
                path: ['', nextTopic],
                humanPath: ['Home', nextTopic],
                display: <Topic name={nextTopic} data={this.state.data.topics[nextTopic]} partyStyles={this.state.data.partyStyles}/>
            });
        }

    }

    render() {

        return (
            <div id="container">
                {/*
                <div id="navigation">
                    <Nav path={this.state.path} humanPath={this.state.humanPath}/>
                </div> 
                */}
                <div id="content">
                    {this.state.display}
                </div>
            </div>
        )
    }
}

export default App;