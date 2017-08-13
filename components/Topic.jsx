import React from 'react';
import ReactDOM from 'react-dom';

import ChoicePane from './ChoicePane';
import DetailedSubtopicFacts from './DetailedSubtopicFacts';
import SpectrumPane from './SpectrumPane';
import PartiesKey from './PartiesKey';
import {Link} from 'react-router';

import {smooth_scroll_to, getCoords, capitalizeWord} from '../src/helper';


class Topic extends React.Component {

    constructor(props) {
        super(props);
        console.log("constructing Topic");
        this.state = {
            topic : this.props.data.name,
            data: this.props.data.data,
            direction: null,
            activeParty: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.topic === this.state.topic) {
            return;
        }
    }

    onSelect(choice) {
        console.log('Choice changed: ' + choice);
        this.setState({
            direction: choice
        });
    }

    render() {

        let statusquo = this.props.data.statusquo;
        let quolist = statusquo.map((status, i) =>
            <li className="description-listitem" key={i}> {status} </li>
        );

        let headingStyle = {"margin-left": "7%", "font-size":"1.3em", "margin-top": "20px"};

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
                <div className="topic-content">
                    <div className="topic-description-container">
                        <h2 style={{"text-align":"center"}}> {capitalizeWord(this.state.topic)}</h2>
                        <u style={headingStyle}> Learn </u>
                        <div className="topic-description">
                            <ol>
                            {quolist}
                            </ol>
                        </div>
                        <div style={headingStyle}>
                            <u >Choose</u>
                        </div>
                        <ChoicePane ref="choice-pane" leftQuestion={this.props.data["question-left"]} rightQuestion={this.props.data["question-right"]} onSelect={this.setDirection.bind(this)} />
                    
                    
                        <div style={headingStyle}>
                            <u >Explore</u>
                            <PartiesKey partyStyles={this.props.partyStyles} />

                        </div>
                    </div>
                    <SpectrumPane topic={this.state.topic} currentValue={this.state.data.current} options={this.state.data.options} direction={this.state.direction} optionSelected={this.optionSelected.bind(this)} partyStyles={this.props.partyStyles}/>
                
                    {/*<Subtopics ref="subtopics-container" options={this.state.data.options} activeParty={this.state.activeParty} />*/}
                    <DetailedSubtopicFacts ref="subtopics-container" options={this.state.data.options} activeParty={this.state.activeParty} activeSubtopic={this.state.activeTopic} />

                </div>
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
            "activeParty" : party,
            "activeTopic": subtopic
        });

        let subtopics = this.refs['subtopics-container'];
        subtopics = ReactDOM.findDOMNode(subtopics);
        
        $('html, body').animate({
            scrollTop: $(subtopics).offset().top
        }, 500)
        
    }
    
}

export default Topic;