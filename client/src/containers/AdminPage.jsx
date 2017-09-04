import React from 'react';
import ReactDOM from 'react-dom';

import Editor from "../components/admin/Editor.jsx";

import {httpGet, httpPost} from '../helper.js';


class AdminPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            status: "Loading",
            saved: true
        }

        this.getData();
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
        httpGet('/data_admin/data.json', this.dataLoaded.bind(this));
    }

    saveData(callback) {
        if (callback) {
            c = function() {
                callback();
                this.setState({
                    status: "Ready",
                    saved: true
                });
            }.bind(this);
        } else {
            c = () => this.setState({status: "Ready", saved: true});
        }
        this.setState({
            status: "Saving"
        })
        httpPost('/admin/save', this.data, c)
    }

    revertData() {
        this.setState({
            status: "Reverting",
            saved: true
        })
        httpPost('/admin/revert', {}, this.getData.bind(this));
    }

    publishData() {
        this.setState({
            status: "Saving",
            saved: true
        })
        this.saveData(function() {
            this.setState({
                status: 'Publishing'
            });
            httpPost('/admin/publish', {}, function() {
                this.setState({
                    status: "Published. Ready"
                });
                this.delayedSetState(3000, "status", "Ready");
            }.bind(this));
        });
    }

    onAnyChange() {
        this.setState({
            saved: false
        })
    }

    dataLoaded(raw) {
        let data = JSON.parse(raw);
        this.setState({
            data: data,
            status: "Ready"
        });
    }

    render() {
        return (
            <div>
                <div className="header">
                    Admin Interface
                </div>

                {this.state.data ? 
                    <Editor raw_json={this.state.data} /> 
                    : 
                    ""
                }
            </div>
        )
    }
}

export default AdminPage;