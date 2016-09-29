import React from 'react';
import ReactDOM from 'react-dom';

import {Link} from 'react-router';

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: null
        }
    }

    render() {
        // let topicTiles = this.state.topics.map(
        let topicTiles = Object.keys(this.props.data).map(
            (topic, i) =>
                <Link to={"/" + topic} key={i}>
                    <div className={"topic-tile" +
                                    (this.state.active === topic ? " tile-active" : "")
                                    } 
                         onMouseEnter={(function(event) {
                             this.setState({active: topic});
                         }).bind(this)}
                         
                         onMouseLeave={(function(event) {
                             this.setState({active: null});
                         }).bind(this)}
                         
                          >



                        <div className="topic-tile-image-container" title={this.state.active}>
                        {( () => {
                            console.log('hi');
                            if (this.state.active === topic) {
                                  return <img className="tile-image" src={this.props.data[topic].image}/>  
                            }
                        }
                        ) () }
                         </div>
                        <div className="topic-tile-text">
                            {topic[0].toUpperCase() + topic.slice(1)}
                        </div>
                    </div>
                </Link>
        );
        return (
            <div className="full-height">
                <div className="header">
                    Election Erection
                </div>
                <div className="home-not-header">
                    <div id="home-text">
                        This topic gets me going
                    </div>
                    <div className="topic-tiles-container">
                        {topicTiles}
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;