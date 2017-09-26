import React from 'react';

import ColorPicker from './ColorPicker.jsx';
import {strContains, isArray} from '../../helper.js';


const Entry = ({
    name, 
    data,
    no_border,
    emptyType
}) => {


    if (emptyType === 'any') {
        return <div>  </div>
    }


    if (isArray(data)) {
        // special case for colors
        if (strContains(name, "color")) {
            return <ColorPickerEntry name={name} data={data} no_border={no_border} />
        } else {
            return <ArrayEntry name={name} data={data} no_border={no_border} />
        }
    } else if (typeof data === 'object') {
        return <ObjectEntry name={name} data={data} no_border={no_border} />
    } else {
        if ( typeof data === "string" || emptyType === 'string') {

            // in this case, data is empty so need to avoid using that
            if (emptyType === 'string') {
                return <StringEntry name={name} data={data} no_border={no_border} empty={true} />
            }

            // check special case for images
            let split = data.split('.');
            let suffix = split[split.length - 1].toLowerCase();
            let image_types = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp'];
            if (image_types.indexOf(suffix) != -1) {
                return <ImageEntry name={name} src={data} no_border={no_border} />
            } else {
                return <StringEntry name={name} data={data} no_border={no_border} />
            }
        } else if ( typeof data=== "number" ) {
            return <NumberEntry 
                        name={name} 
                        data={data}
                        no_border={no_border} 
                        empty={emptyType==='number'? true : false}
                   />
        } else {
            //<GenericEntry name={name} data={data} />
        }
    }
}


class ObjectEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true    // toggle collapse
        };
    }

    render() {
        let name = this.props.name;
        let data = this.props.data;
        return (
        <div className="entry-container"
             style={this.props.no_border? {border:'none', marginLeft:0, paddingLeft:0}: {}} >
            <div className="entry-heading">


                <div className="cssCircle inline minus-circle">
                    &#8211;
                </div>

                <div 
                    className="entry-collapse"
                    onClick={() => this.setState({visible:!this.state.visible})}
                    style={!this.state.visible?{'transform':'rotateZ(0deg)'} : {}}
                    >
                    ▶
                </div>
                <span className="entry-title">
                    {name}
                </span>
                <span className={"entry-title-details" + (!this.state.visible ? " entry-title-details-emph" : " entry-title-details-normal")}>
                    object, {Object.keys(data).length} keys
                </span>
            </div>
            {this.state.visible ? 
                <div className="entry-content">
                    {
                        Object.keys(data).map((n, index) =>
                            <Entry name={n} data={data[n]} key={index} />
                        )
                    }

                    
                </div>
                :
                ""
            }
        </div>
        )
    }
}

class ArrayEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: true    // toggle collapse
        };
    }

    render() {
        let name = this.props.name;
        let data = this.props.data;
        return (
        <div className="entry-container"
            style={this.props.no_border? {border:'none', marginLeft:0, paddingLeft:0}: {}} >
            <div className="entry-heading">

                <div className="cssCircle inline minus-circle">
                    &#8211;
                </div>


                <div 
                    className="entry-collapse"
                    onClick={() => this.setState({visible:!this.state.visible})}
                    style={!this.state.visible?{'transform':'rotateZ(0deg)'} : {}}
                    >
                    ▶
                </div>

                <span className="entry-title">
                    {name}
                </span>
                <span className={"entry-title-details" + (!this.state.visible ? " entry-title-details-emph" : " entry-title-details-normal")}>
                    array, {data.length} items
                </span>
            </div>
            {this.state.visible ?
                <div className="entry-content">
                    {
                        data.map((value, index) =>
                            <Entry name={index+"."} data={value} key={index} /> 
                        )
                    }
                </div>
                :
                ""
            }
        </div>
        );
    }
}

class ColorPickerEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
             <div className="entry-container"
                style={this.props.no_border? {border:'none', marginLeft:0, paddingLeft:0}: {}} >
                <div className="entry-heading">
                    {this.props.name}
                </div>
                <div className="entry-content">
                    <ColorPicker rgba={this.props.data} />
                </div>
            </div>
        )
    }
}


const StringEntry = ({
    name, data, no_border, empty
}) => (
    <div className="entry-container entry-container-empty"
        style={no_border? {border:'none', marginLeft:0, paddingLeft:0}: {}} >


        <div className="cssCircle inline minus-circle">
            &#8211;
        </div>
        
        <div className="entry-heading inline">
            {name}
        </div>
        <div className="entry-content inline value editable-area" contentEditable="true">
            {data}
        </div>
    </div>
);

const ImageEntry = ({
    name, src, no_border
}) => (
    <div className="entry-container"
        style={no_border? {border:'none', marginLeft:0, paddingLeft:0}: {}} >


        <div className="cssCircle inline minus-circle">
            &#8211;
        </div>

        <div className="entry-heading inline">
            {name}
        </div>
        <div className="entry-content inline">
            <img className="entry-image" src={src} />
        </div>
    </div>
);

const NumberEntry = ({
    name, data, no_border
}) => (
    <div className="entry-container"
        style={no_border? {border:'none', marginLeft:0, paddingLeft:0}: {}} >


        <div className="cssCircle inline minus-circle">
            &#8211;
        </div>

        <div className="entry-heading inline">
            {name}
        </div>
        <div className="entry-content inline value editable-area" contentEditable="true">
            {data}
        </div>
    </div>
);

class JSONEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            active: true    // toggle collapse
        };
    }

    render() {

        return (
            <div> 
            {
                Object.keys(this.props.json).map( (name, index) => 
                   <Entry name={name} data={this.props.json[name]} key={index} no_border={true}/>
                )
            }
            </div>
        )
    }
}


export default JSONEditor;