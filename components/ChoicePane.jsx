import React from 'react';
import ReactDOM from 'react-dom';


class ChoicePane extends React.Component {

    constructor(props) {
        super(props);
        console.log('constructing ChoicePane');
    }

    leftClicked() {
        this.props.onSelect('left');
    }

    rightClicked() {
        this.props.onSelect('right');
    }

    render() {
        return (
            <div className="choice-pane">
                <div className="choice-question">
                    {this.props.question}
                </div>
                <div className="choice-input-container">
                    <button className="choice-button" onClick={this.leftClicked.bind(this)}> &lt;- Less </button>
                    <button className="choice-button" onClick={this.rightClicked.bind(this)}> More -&gt; </button>
                </div>
            </div>
        )
    }

}

export default ChoicePane;