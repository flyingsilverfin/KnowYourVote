import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// useful link: http://stackoverflow.com/questions/34660385/how-to-position-a-react-component-relative-to-its-parent

class SpectrumOption extends React.Component {


    constructor(props) {
        super(props);

        console.log(props);

        this.state = {
            styles: {
                top: 0,
                left: 0
            }
        };

    }


    render() {
        let bg;
        let transparency;
        if (this.props.active === null) {
            transparency = 0.7;
        } else if (this.props.active) {
            transparency = 1.0;
        } else {
            transparency = 0.3;
        }

        if (this.props.partyStyles[this.props.partyName] !== undefined) {
            bg = this.props.partyStyles[this.props.partyName]["background-color"];
        } else {
            // default background color
            bg = [68,68,68];
        }
        console.log(this.props)

        let style = Object.assign(this.state.styles, {
            "background-color": "rgba(" + bg[0] + "," + bg[1] + "," + bg[2] + "," + transparency + ")"
        })

        console.log(style);

        return (
            <div ref="child" className="spectrum-option" style={style} onClick={this.props.onClick}>
                <div className="title">
                    {this.props.name}
                </div>
                <div className="short">
                    {this.props.values.short}
                </div>
            
        
        
            {/*
            <ReactCSSTransitionGroup transitionName="activate" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                <div className={"spectrum-option-enter spectrum-option-deactivate-enter" + (this.props.active === null ? '' : (this.props.active ? ' spectrum-option-enter-activate' : ' spectrum-option-deactivate-enter-activate'))}>
                    <div className="title">
                        {this.props.name}
                    </div>
                    <div className="short">
                        {this.props.values.short}
                    </div>
                </div>
            </ReactCSSTransitionGroup>
            */}
            </div>
            
        );
    }
}

export default SpectrumOption;