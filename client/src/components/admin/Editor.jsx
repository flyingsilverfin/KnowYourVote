import React, { PropTypes } from 'react';

import EditorSidebar from './EditorSidebar.jsx';
import JSONEditor from './JSONEditor.jsx';

/*
Full width with its own side bar
*/


class Editor extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: 'parties'
        }
    }

    setActive(key) {
        this.setState({
            active: key
        });
    }

    render() {
        return (
            <div>
                <div className="admin-sidebar">
                    <EditorSidebar choices={Object.keys(this.props.raw_json)} setActive={this.setActive.bind(this)} active={this.state.active} />
                </div>

                <div className="admin-main-content"> 
                    <JSONEditor json={this.props.raw_json[this.state.active]} />
                </div>
            </div>
        );
    }
}


export default Editor;