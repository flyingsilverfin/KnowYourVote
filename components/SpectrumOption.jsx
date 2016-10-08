import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
            <div ref="child" className="spectrum-option" style={this.state.styles} >
            <ReactCSSTransitionGroup transitionName="activate" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                <div className={"spectrum-option-enter" + (this.props.active === 'null' ? '' : (this.props.active ? ' spectrum-option-enter-activate' : ' spectrum-option-enter-deactivate'))}>
                    <div className="title">
                        {this.props.name}
                    </div>
                    <div className="short">
                        {this.props.values.short}
                    </div>
                </div>
            </ReactCSSTransitionGroup>
            </div>
            
        );
    }
}

export default SpectrumOption;