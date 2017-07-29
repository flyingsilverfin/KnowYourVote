import React from 'react';


import SubtopicTitle from './SubtopicTitle';
import SubtopicData from './SubtopicData';

export default class DetailedSubtopicfacts extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

debugger
        if (!this.props.activeParty || !this.props.activeSubtopic) {
            return (
                <div className="subtopics-no-party-selected">
                    Select a box above for more
                </div>
            )
        } else {
        
            return (
                <div className="subtopics-container">
                    <div className="subtopic-titles-container">
                        <SubtopicTitle subtopic={this.props.activeSubtopic} />
                    </div>
                    <SubtopicData facts={this.props.options[this.props.activeParty].subtopics[this.props.activeSubtopic].facts} />
                </div>
            )
        }
    }

}