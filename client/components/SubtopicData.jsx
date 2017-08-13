import React from 'react';


export default class SubtopicData extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let formattedFacts = this.props.facts.map(
            (fact, i) =>
                <li 
                    key={i}
                    className="subtopic-fact">
                    {fact}
                </li>
        );

        return (
            <div className="subtopic-facts-container">
                <ul>
                    {formattedFacts}
                </ul>
            </div>
        )
    }
}