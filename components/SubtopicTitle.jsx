import React from 'react';


export default class SubtopicTitle extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        let style = this.props.active ? { "backgroundColor" : "rgba(96,0,0,0.2)" } : {}

        return (
            <div className="subtopic-title" onClick={this.props.onSelect} style={style}>
                {this.props.subtopic}
            </div>
        )

    }
}