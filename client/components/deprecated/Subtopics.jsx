import React from 'react';


import SubtopicTitle from './SubtopicTitle';
import SubtopicData from './SubtopicData';

export default class Subtopics extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            activeSubtopic: null
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.activeParty !== null) {
            this.setState({
                activeSubtopic: Object.keys(nextProps.options[nextProps.activeParty].subtopics)[0]
            })
        }
    }

    render() {

        if (this.props.activeParty !== null) {
            let subtopicComponents = Object.keys(this.props.options[this.props.activeParty].subtopics).map(
                (subtopic, i) =>
                <SubtopicTitle 
                    key={i}
                    subtopic={subtopic}
                    active={this.state.activeSubtopic === subtopic}
                    onSelect={(function() {this.setState({activeSubtopic: subtopic})}).bind(this)}
                />
            );

            return (
                <div className="subtopics-container">
                    <div className="subtopic-titles-container">
                        {subtopicComponents}
                    </div>
                    <SubtopicData facts={this.props.options[this.props.activeParty].subtopics[this.state.activeSubtopic]} />
                </div>
            )
        } else {
            return(
                <div className="subtopics-no-party-selected">
                    Select a party above to view more
                </div>
            )
        }


        
    }

}