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

        let statusquo = this.props.data.statusquo;
        let quolist = statusquo.map((status, i) =>
            <li className="description-listitem" key={i}> {status} </li>
        );

        return (
            <div className="topic-container">
                <div className="topic-header">
                    {this.state.topic} 
                </div>
                <div className="topic-content">
                    <div className="topic-description-container">
                        <div className="topic-description">
                        <h2> Facts </h2>
                        <ol>
                        {quolist}
                        </ol>
                        </div>
                    </div>
                    {/*
                        <ChoicePane question={this.props.data.question} onSelect={this.onSelect.bind(this)} />
                    */}
                    <SpectrumPane topic={this.state.topic} currentValue={this.state.data.current} options={this.state.data.options} direction={this.state.direction} />
                </div>
            </div>
        )
    }
}

export default Topic;