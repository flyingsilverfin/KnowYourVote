import React from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';

import Topic from '../components/Topic.jsx';
/*
import ChoicePane from './ChoicePane';
import DetailedSubtopicFacts from './DetailedSubtopicFacts';
import SpectrumPane from './SpectrumPane';
import PartiesKey from './PartiesKey';
*/
// import {smooth_scroll_to, getCoords, capitalizeWord} from '../src/helper';


class TopicPage extends React.Component {

    constructor(props) {
        super(props);
        console.log("constructing Topic");
        let topic = this.props.routeParams.splat;
        this.state = {
            topic: topic,
            direction: null,
            activeParty: null,
            activeSubtopic:null
        };
    }

/*    
    componentWillReceiveProps(nextProps) {
        if (nextProps.topic === this.state.topic) {
            return;
        }
    }
*/

    render() {

        let data = this.props.route.data.topics[this.state.topic];

        return (
            <div className="topic-container">
                <div className="header">
                    <Link to="/">
                        <div id="topic-header-home-button">
                            Home
                        </div>
                    </Link>
                    {/*<div id="topic-header-text">
                        {this.state.topic}
                    </div> 
                    */}
                    What Floats Your Vote
                    
                </div>
                <Topic 
                    name={this.state.topic}
                    data={data.data}
                    partyStyles={this.props.route.data.partyStyles}
                    statusquo={data.statusquo}
                    questions={{
                        'question-left': data['question-left'], 
                        'question-right': data['question-right']}
                    }
                    direction={this.state.direction}
                    activeParty={this.state.activeParty}
                    activeSubtopic={this.state.activeSubtopic}
                    optionSelected={this.optionSelected.bind(this)}
                    directionSelected={this.setDirection.bind(this)}
                />
            </div>
        )
    }

    setDirection(direction) {
        this.setState({direction: direction});

        let choicePane = this.refs['choice-pane'];
        choicePane = ReactDOM.findDOMNode(choicePane);
        
        $('html, body').animate({
            scrollTop: $(choicePane).offset().top
        }, 500);
    }

    optionSelected(party, subtopic) {
        console.log('party selected: ' + party + ', subtopic: ' + subtopic);
        this.setState({
            activeParty : party,
            activeSubtopic: subtopic
        });

        let subtopics = this.refs['subtopics-container'];
        subtopics = ReactDOM.findDOMNode(subtopics);
        
        $('html, body').animate({
            scrollTop: $(subtopics).offset().top
        }, 500)
        
    }
    
}

export default TopicPage;