import React, { PropTypes } from 'react';

import EditorSidebar from './EditorSidebar.jsx';
import EditorStatusbar from './EditorStatusbar.jsx';
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

        let choices = ['parties'];
        choices = choices.concat(Object.keys(this.props.raw_json.topics));

        let active_json = null;
        if (this.state.active === 'parties') {
            active_json = this.props.raw_json[this.state.active];
        } else {
            active_json = this.props.raw_json.topics[this.state.active];
        }

        
        return (
            <div className="admin-container">
                <div className="admin-leftbar">
                    <div className="admin-sidebar">
                        <EditorSidebar 
                            choices={choices} 
                            setActive={this.setActive.bind(this)} 
                            active={this.state.active} 
                            />
                    </div>
                    <div className="admin-statusbar">
                        <EditorStatusbar
                            status={this.props.status}
                            modified={this.props.modified}
                            revertData={this.props.revertData}
                            />
                    </div>
                </div>

                <div className="admin-main-content"> 
                    <JSONEditor json={active_json} />
                </div>
            </div>
        );
    }
}


export default Editor;