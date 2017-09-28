import React from 'react';
import ReactDOM from 'react-dom';

import Editor from "../components/admin/Editor.jsx";
import TypeChecker from "../TypeChecker.js";

import {httpGet, httpPost} from '../helper.js';


class AdminPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            schema: null,
            meta: null,
            status: "Loading",
            modified: false
        }
    }

    componentDidMount() {
        this.getData();
        this.getSchema();
    }

    delayedSetState(delay, v, val) {
        let newState = {}
        newState[v] = val;
        setTimeout(function() {
            this.setState(newState)
        }.bind(this), delay);
    }

    getData() {
        this.setState({
            status: "Loading"
        })
        httpGet('/data_admin/data.json', (raw) => this.dataLoaded(raw));
    }

    getSchema() {
        this.setState({
            status: "Loading"
        });
        httpGet('/data_admin/schema.json', (raw) => this.schemaLoaded(raw));
    }


    revertData() {
        this.setState({
            status: "Reverting",
        });
        httpPost('/admin/revert', {}, this.getData.bind(this));
    }

    publishData() {
        httpPost('/admin/publish', {}, () => {
            this.setState({
                status: "Published. Ready",
                modified: false
            });
            this.delayedSetState(1500, "status", "Ready");
        });
    }

    dataLoaded(raw) {
        let data = JSON.parse(raw);
        if (this.state.schema != null) {
            this.setState({
                data: data,
                modified: false,
                status: "Ready"
            });

            this.checkDataWithSchema();

        } else {
            this.setState({
                data: data,
                modified: false
            });
        }
    }

    schemaLoaded(raw) {
        let schema = JSON.parse(raw);
        this.typeChecker = new TypeChecker(schema);

        if (this.state.data != null) {
            this.setState({
                schema: schema,
                status: "Ready"
            });

            this.checkDataWithSchema();


        } else {
            this.setState({
                schema:schema
            })
        }
    }

    checkDataWithSchema() {
        try {
            this.typeChecker.check(this.state.data);
            console.log("data.json passed schema check");
        } catch (err) {
            console.error("data.json failed schema check.");
            console.error(err.toString());
            throw err;  // maybe skip this?
        }

        let meta = this.typeChecker.generateMetaJson(this.state.data);
        // console.log(JSON.stringify(meta, null, 3));
        this.setState({meta: meta});
    }

    onEdit(JSONPath, newValue) {
        this.setState({
            status: "Saving"
        })
        httpPost('/admin/edit', {path: JSONPath, value: newValue}, () => {
            this.setState({
                status: "Saved",
                modified: true
            })
        });
    }

    render() {
        
        return (
            <div className="">
                <div className="header admin-header">
                    Admin Interface
                </div>

                {this.state.data ? 
                    <Editor 
                        raw_json={this.state.data} 
                        json_meta={this.state.meta}
                        status={this.state.status}
                        modified={this.state.modified}
                        onRevert={this.revertData.bind(this)}
                        onPublish={this.publishData.bind(this)}
                        onEdit={this.onEdit.bind(this)}
                        /> 
                    : 
                    ""
                }
            </div>
        )
    }
}

export default AdminPage;