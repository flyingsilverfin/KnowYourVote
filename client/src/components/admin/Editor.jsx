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

        if (this.props.data_json === null || this.props.json_meta === null) {
            return <div> Loading </div>;
        }

        debugger

        let choices = ['parties'];
        choices = choices.concat(Object.keys(this.props.raw_json.topics));
        let choices_meta = this.props.json_meta['parties'];
        choices_meta = Object.assign(choices_meta, this.props.json_meta['topics']);

        let active_json = null;
        let active_meta = null;
        if (this.state.active === 'parties') {
            active_json = this.props.raw_json['parties'];
            active_meta = this.props.json_meta['parties'];
        } else {
            active_json = this.props.raw_json.topics[this.state.active];
            active_meta = this.props.json_meta.topics[this.state.active];
        }

        
        return (
            <div className="admin-container">
                <div className="admin-leftbar">
                    <div className="admin-sidebar">
                        <EditorSidebar 
                            choices={choices} 
                            choices_meta={choices_meta}
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
                    <JSONEditor json={active_json} meta={active_meta} />
                </div>
            </div>
        );
    }
}


export default Editor;