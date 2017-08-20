import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';


import ChoicePane from './ChoicePane.jsx';
import DetailedSubtopicFacts from './DetailedSubtopicFacts.jsx';
import SpectrumPane from './SpectrumPane.jsx';
import PartiesKey from './PartiesKey.jsx';

import {smooth_scroll_to, getCoords, capitalizeWord} from '../helper';


let headingStyle = {"marginLeft": "7%", "fontSize":"1.3em",  "marginTop": "20px"};


const Topic = ({
    name,
    data,
    statusquo,
    questions,
    partyStyles,
    direction,
    activeParty,
    activeSubtopic,
    optionSelected,
    directionSelected
  }) => (
    <div className="topic-container">
        {/* TODO <Header /> */ }
        <div className="topic-content">
            <div className="topic-description-container">
                <h2 style={{"textAlign":"center"}}> {capitalizeWord(name)}</h2>
                <u style={headingStyle}> Learn </u>
                <div className="topic-description">
                    <ol>
                    {
                        statusquo.map((status, i) =>
                            <li className="description-listitem" key={i}>
                                {status}
                            </li>
                        )
                    }
                    </ol>
                </div>
                <div style={headingStyle}>
                    <u >Choose</u>
                </div>
                <ChoicePane leftQuestion={questions["question-left"]} rightQuestion={questions["question-right"]} onSelect={directionSelected} />
            
            
                <div style={headingStyle}>
                    <u >Explore</u>
                    <PartiesKey partyStyles={partyStyles} />

                </div>
            </div>
            <SpectrumPane topic={name} currentValue={data.current} options={data.options} direction={direction} optionSelected={optionSelected} partyStyles={partyStyles}/>
        
            {/*<Subtopics ref="subtopics-container" options={this.state.data.options} activeParty={this.state.activeParty} />*/}
            <DetailedSubtopicFacts options={data.options} activeParty={activeParty} activeSubtopic={activeSubtopic} />
        </div>
    </div>
  );


Topic.propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    statusquo: PropTypes.array.isRequired,
    questions: PropTypes.object.isRequired,
    partyStyles: PropTypes.object.isRequired,
    direction: PropTypes.string, //.isRequired,
    activeParty: PropTypes.string, //.isRequired,
    activeSubtopic: PropTypes.string, //.isRequired,
    optionSelected: PropTypes.func.isRequired,
    directionSelected: PropTypes.func.isRequired
};
    

export default Topic;