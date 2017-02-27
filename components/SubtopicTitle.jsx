import React from 'react';


export default class SubtopicTitle extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="subtopic-title" onClick={this.props.onSelect}>
                {this.props.subtopic}
            </div>
        )

    }
}