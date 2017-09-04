import React from 'react';

import ColorPicker from './ColorPicker.jsx';
import {strContains, isArray} from '../../helper.js';


const Entry = ({
    name, 
    data
}) => {
    if (isArray(data)) {
        // special case for colors
        if (strContains(name, "color")) {
            return <ColorPickerEntry name={name} data={data} />
        } else {
            return <ArrayEntry name={name} data={data} />
        }
    } else if (typeof data === 'object') {
        return <ObjectEntry name={name} data={data} />
    } else {
        if ( typeof data === "string" ) {
            // check special case for images
            let split = data.split('.');
            let suffix = split[split.length - 1].toLowerCase();
            let image_types = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'bmp'];
            if (image_types.indexOf(suffix) != -1) {
                return <ImageEntry name={name} src={data} />
            } else {
                return <StringEntry name={name} data={data} />
            }
        } else if ( typeof data=== "number" ) {
            return <NumberEntry name={name} data={data} />
        } else {
            //<GenericEntry name={name} data={data} />
        }
    }
}


class ObjectEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: true    // toggle collapse
        };
    }

    render() {
        let name = this.props.name;
        let data = this.props.data;
        return (
        <div className="entry-container"> 
                <span className="entry-title">
                    {name}
                </span>
                <span className="entry-title-details">
                    object, {Object.keys(data).length} keys
                </span>
            <div className="entry-content">
                {/*<JSONEditor data={data} />*/}
                {
                    Object.keys(data).map((n, index) =>
                        <Entry name={n} data={data[n]} key={index} />
                    )
                }
            </div>
        </div>
        )
    }
}

class ArrayEntry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: true    // toggle collapse
        };
    }

    render() {
        let name = this.props.name;
        let data = this.props.data;
        return (
        <div className="entry-container">
            <div className="entry-heading">
                <span className="entry-title">
                    {name}
                </span>
                <span className="entry-title-details">
                    array, {data.length} items
                </span>
            </div>
            <div className="entry-content">
                {
                    data.map((value, index) =>
                        <Entry name={index} data={value} key={index} /> 
                    )
                }
            </div>
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
             <div className="entry-container">
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


// TODO make these inline
const StringEntry = ({
    name, data
}) => (
    <div className="entry-container">
        <div className="entry-heading">
            {name}
        </div>
        <div className="entry-content" contentEditable="true">
            {data}
        </div>
    </div>
);

const ImageEntry = ({
    name, src
}) => (
    <div className="entry-container">
        <div className="entry-heading">
            {name}
        </div>
        <div className="entry-content">
            <img className="entry-image" src={src} />
        </div>
    </div>
);

const NumberEntry = ({
    name, data
}) => (
    <div className="entry-container">
        <div className="entry-heading">
            {name}
        </div>
        <div className="entry-content" contentEditable="true">
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
                   <Entry name={name} data={this.props.json[name]} key={index} />
                )
            }
            </div>
        )
    }
}


export default JSONEditor;