import React from 'react';
import ReactDOM from 'react-dom';

import ChoicePane from './ChoicePane';
import SpectrumPane from './SpectrumPane';


class Topic extends React.Component {

    constructor(props) {
        super(props);
        console.log("constructing Topic");
        console.log(this.props);
        this.state = {
            topic : this.props.name,
            data: this.props.data.data,
            direction: null
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
        return (
            <div>
                <p>{this.state.topic} </p>
                <div className="topic-description">
                    {this.props.data.statusquo}
                </div>
                <ChoicePane question={this.props.data.question} onSelect={this.onSelect.bind(this)} />
                <SpectrumPane topic={this.state.topic} currentValue={this.state.data.current} options={this.state.data.options} direction={this.state.direction} />
            </div>
        )
    }
}

export default Topic;