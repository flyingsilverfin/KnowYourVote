import React, { PropTypes } from 'react';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import {strContains, isArray} from '../helper.js';

const Editor = ({
    data,
    onAnyChange
}) => (
    <div className="container">
        {
            Object.keys(data).map(function(name, index) {
                if  ( typeof data[name] === 'object' ) {
                    return (
                        <div className="json-item-name">
                            <Editor data={data[name]} onAnyChange={onAnyChange} />
                        </div>
                    )
                } else {
                    if (strContains("color", name) && isArray(data[name])) {
                        // TODO color picker display
                    } else if ( typeof data[name] === "string" ) {

                    } else if ( typeof data[name] === "number" ) {

                    } else if ( isArray(data[name]) ) {

                    }
                }
            })

        }

    </div>
);

export default Editor;