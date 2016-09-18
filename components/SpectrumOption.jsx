import React from 'react';


// useful link: http://stackoverflow.com/questions/34660385/how-to-position-a-react-component-relative-to-its-parent

class SpectrumOption extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            styles: {
                top: 0,
                left: 0
            }
        };
    }


    render() {
        return (
            <div ref="child" className="spectrum-option" style={this.state.styles}>
                <div className="title">
                    {this.props.name}
                </div>
                <div className="short">
                    {this.props.values.short}
                </div>
            </div>
        );
    }
}

export default SpectrumOption;