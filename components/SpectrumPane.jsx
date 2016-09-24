import React from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import SpectrumOption from './SpectrumOption';


let MARGIN = 10;

class SpectrumPane extends React.Component {

    constructor(props) {
        super(props);

        /*
            Props: props.topic, props.currentValue, props.options
        */
        this.state = {
            parties: null,
            seed: 0,
            dividerLabelLeft: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.topic === this.props.topic) {
            return;
        }
    }

    componentWillMount() {
        let parties = Object.keys(this.props.options);

        // we want to put Conservative, Labor, and Green at the front of the list for later
        let conservativesIndex = parties.indexOf('Conservative');
        this.swapElements(parties, conservativesIndex, 0);
        let laborIndex = parties.indexOf('Labor');
        this.swapElements(parties, laborIndex, 1);
        let greenIndex = parties.indexOf('Green');
        this.swapElements(parties, greenIndex, 2);


        this.setState({
            parties: parties
        });
    }

    render() {        

        let options = this.state.parties.map(
            (p, i) =>
                <SpectrumOption ref={p} name={p} values={this.props.options[p]} key={this.state.seed + i}/>
        )

        let dividerPosition = {
            'left': 100*(this.props.currentValue/10.0)+ "%"
        }



// ummmm
        // update after render
        let dividerLabelPosition = null;
        if (this.state.dividerLabelLeft === null) {
            dividerLabelPosition = {
                'left': dividerPosition.left
            }
        } else {
            dividerLabelPosition = {
                'left': this.state.dividerLabelLeft
            }
        }



        return (
            <div className="spectrum-pane-container">
                <div ref="spectrumPane" className="spectrum-pane">
                    <div className="overlay-container">
                        <ReactCSSTransitionGroup transitionName="overlay-slide" transitionEnterTimeout={500} transitionLeaveTimeout={300}>
                            <div ref="leftOverlay"
                                style={{right: 100 - this.props.currentValue/10.0*100 + "%"}}
                                className={'spectrum-overlay overlay-slide-enter ' + (this.props.direction === 'left' ? 'overlay-slide-enter-active' : '')}
                                key={0}/>
                            <div ref="rightOverlay"
                                style={{left: this.props.currentValue/10.0*100 + "%"}}
                                className={'spectrum-overlay overlay-slide-enter ' + (this.props.direction === 'right' ? 'overlay-slide-enter-active' : '')}
                                key={1}/>
                        </ReactCSSTransitionGroup>
                    </div>
                    <div id="current-value-divider-label" key={this.state.seed} ref="divider-label" style={dividerPosition}>
                        <h2>
                            Current State of Affairs
                        </h2>
                    </div>
                    <div id="current-value-divider" key={this.state.seed+1} style={dividerPosition}> </div>
                    {options}
                </div>
            </div>
        )
    }

    
    // fun fact: this is called after SpectrumOption's didMount (makes logical sense anyway)
    componentDidMount() {

        console.log('(SpectrumPane.componentDidMount)');

        window.addEventListener("resize", this.forceRedraw.bind(this));

        this.place();

        this.placeDividerLabel();

    }

    componentDidUpdate() {
        this.place();
    }

    placeDividerLabel() {
        let dividerLabelRef = this.refs['divider-label'];
        let dividerLabelElement = ReactDOM.findDOMNode(dividerLabelRef);

        let boundingRect = dividerLabelElement.getBoundingClientRect();
        let w = boundingRect.width;
        let left = boundingRect.left;
        dividerLabelElement.style.left = left - (w/2) + "px";
    }
    

    forceRedraw() {
        let container = ReactDOM.findDOMNode(this.refs.spectrumPane);

        let containerWidth = container.getBoundingClientRect().width;
        let MIN_WIDTH = 1000;
        if (containerWidth > 1000) {
            this.setState({
               seed: Math.random() 
            });
        }
        
        this.placeDividerLabel();

    }

    place() {
        
        let cd = new CollisionDetector();



        console.log(this.refs.spectrumPane);
        let container = ReactDOM.findDOMNode(this.refs.spectrumPane);

        let containerWidth = container.getBoundingClientRect().width;
        let containerHeight = container.getBoundingClientRect().height;

        let i  = 0;

        // we're doing this CPS sort of styles
        // because setState does not occur immediately and we require the prior one to be placed before placing the next one
        // holy this the CPS actually works! Thank you compilers :o
        let f = (function(i, limit, cH, cW, cd, func) {
            console.log('CPS - depth ' + i);
            if (i === limit) {
                return;
            } else {
                this.placeItem(
                    this.refs[this.state.parties[i]],
                    cH, cW, cd,
                    function() {
                        func(i+1, limit, cH, cW, cd, func);
                    }
                )
            }
        }).bind(this);

        f(0, this.state.parties.length, containerHeight, containerWidth, cd, f);

    }

    // takes ref, container height/width, and collision detector 
    // places optionin pane
    placeItem(ref, cHeight, cWidth, collisionDetector, callback) {
        let elem = ReactDOM.findDOMNode(ref);

        let rect = elem.getBoundingClientRect();

        let left = rect.left;
        let width = rect.width;
        let height = rect.height;
        let top = rect.top;

        let toBeLeft = ((ref.props.values.value/10.0) * cWidth - width/2);

        let collisions = collisionDetector.collisions(toBeLeft, width);
        collisionDetector.insert(ref, toBeLeft, width);

        top = this.placeVertical(height, cHeight/2, collisions);

        ref.setState({
            styles: {
                top: top + "px" ,
                left: toBeLeft + "px"
            }
        }, callback);
    }

    placeVertical(height, middle, collisions) { 
        // calculate everything vertical with respect to the middle of container as if it were 0

        let lowest = 0;
        let highest = 0;

        let centered = collisions.length === 0; // if no collisions, center vertically!

        if (!centered) {
            for (let i = 0; i < collisions.length; i++) {
                let option = collisions[i];
                let elem = ReactDOM.findDOMNode(option);

                let rect = elem.getBoundingClientRect();
                // so it hasn't reendered yet so the bounding box isn't really up to date
                // doesn't matter for height, matters for top!
                // top should be set in state.styles.top = "valpx"

                console.log(option.state.styles);

                let top = parseInt(option.state.styles.top.slice(0,-2));
                let _t = top - middle;
                let _b = _t + rect.height;

                let _c = rect.bottom - middle;

                if (_t < lowest) {
                    lowest = _t;
                }

                if (_b > highest) {
                    highest = _b
                }

            }

            // choose top if symmetrical, otherwise choose one closest to middle
            if (Math.abs(lowest) <= highest) {
                return lowest - height + middle - MARGIN;
            } else {
                return highest + middle + MARGIN;
            }
        } else {
            return middle - height/2;
        }

    }

    swapElements(arr, i1, i2) {
        let tmp = arr[i1];
        arr[i1] = arr[i2];
        arr[i2] = tmp;
    }

}



// detects and returns collision on a line
// insert refs
class CollisionDetector {

    //sadly not using typescript :( next time..
    constructor() {
        this.taken = [];
    }

    insert(object, left, width) {

        let center = left + width/2;

        let toInsert = {
            object: object,
            left: left,
            right: left+width,
            center: center
        };

        // base case empty list insert at 0
        if (this.taken.length === 0) {
            this.taken.push(toInsert);
            return;
        }

        // could do this by binary search but too lazy
        let beforeIndex = 0;
        while (beforeIndex < this.taken.length && center > this.taken[beforeIndex].center) {
            beforeIndex++;
        }

        this.taken.splice(beforeIndex, 0, toInsert);

    }

    collisions(left, width) {
        
        let collidesWith = [];
        let right = left + width;

        for (let i = 0; i < this.taken.length; i++) {
            let item = this.taken[i];
            // if left or right endpoint in the span of the current item, add it to collision list
            if ((item.left <= left && left <= item.right) ||
                (item.left <= right && right <= item.right)) {
                      // detected collision
                      collidesWith.push(item.object);
            }
        }
        return collidesWith;
    }
}

export default SpectrumPane;