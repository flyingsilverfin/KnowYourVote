import React from 'react';
import ReactDOM from 'react-dom';

import ChoicePane from './ChoicePane';
import Subtopics from './Subtopics';
import SpectrumPane from './SpectrumPane';
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

        return (
            <div className="topic-container">
                <div className="header">
                    <Link to="/whatfloatsyourvote/">
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
                        <div className="topic-description">
                        <h2> <u>{capitalizeWord(this.state.topic)} </u></h2>
                        <ol>
                        {quolist}
                        </ol>
                        </div>
                    </div>
                    
                    <ChoicePane ref="choice-pane" leftQuestion={this.props.data["question-left"]} rightQuestion={this.props.data["question-right"]} onSelect={this.setDirection.bind(this)} />

                    <SpectrumPane topic={this.state.topic} currentValue={this.state.data.current} options={this.state.data.options} direction={this.state.direction} partySelected={this.partySelected.bind(this)} partyStyles={this.props.partyStyles}/>
                
                    <Subtopics ref="subtopics-container" options={this.state.data.options} activeParty={this.state.activeParty} />

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

    partySelected(party) {
        console.log('party selected: ' + party);
        this.setState({
            "activeParty" : party
        });

        let subtopics = this.refs['subtopics-container'];
        subtopics = ReactDOM.findDOMNode(subtopics);
        
        $('html, body').animate({
            scrollTop: $(subtopics).offset().top
        }, 500)
    }
    
}

export default Topic;