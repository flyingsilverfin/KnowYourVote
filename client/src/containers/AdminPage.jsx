import React from 'react';
import ReactDOM from 'react-dom';

import Editor from "../components/admin/Editor.jsx";
import {SchemaChecker, DEFAULT_NEW_OBJECT_PROP_PREFIX} from "../SchemaChecker.js";

import {httpGet, httpPost, type_of, assert, isArray} from '../helper.js';


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
        this.schemaChecker = new SchemaChecker(schema);

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
            this.schemaChecker.check(this.state.data);
            console.log("data.json passed schema check");
        } catch (err) {
            console.error("data.json failed schema check.");
            console.error(err.toString());
            throw err;  // maybe skip this?
        }

        this.regenerate_meta();
    }

    regenerate_meta() {
        let meta = this.schemaChecker.generateMetaJson(this.state.data);
        this.setState({meta: meta});
    }
    

    onAdd(json_path, key) {

        this.setState({
            status: "Saving"
        })

        let new_structure = this.schemaChecker.get_required_data_structure(json_path);
        let ptr = this.state.data;
        for (let elem of json_path) {
            ptr = ptr[elem];
        }

        // key is null if new_structure is an object ie. we are not extending an array
        if (key === null) {
            assert(type_of(new_structure) === 'object', "New Structure being added is not object (array) and key is null, ??");


            let start_new_prop_name_index = 0;
            for (let existing_key in ptr) {
                if (existing_key.startsWith(DEFAULT_NEW_OBJECT_PROP_PREFIX)) {
                    let tmp = existing_key.split('_');
                    if (start_new_prop_name_index < Number(tmp[tmp.length-1])){
                        start_new_prop_name_index = Number(tmp[tmp.length-1]);
                    }
                }
            }
            start_new_prop_name_index++;

            for (let default_name in new_structure) {
                let default_name_split = default_name.split("_");
                default_name_split[default_name_split.length-1] = start_new_prop_name_index + "";
                let new_prop_name = default_name_split.join("_");
                ptr[new_prop_name] = new_structure[default_name];
            }
        } else {
            assert(type_of(new_structure) === 'array', "new structure being added is not an array and key is not null, ??")
            ptr[key] = new_structure[0];
        }

        this.regenerate_meta();
    }



    onEdit(json_path, get_value_fn, set_value_fn) {

        // TODO this may not be a primitive - take a color picker for example, it's compound

        
        


        // retrieve correct place to update JSON
        let ptr = this.state.data;
        for (let elem of json_path.slice(0,json_path.length-1)) {
            ptr = ptr[elem];
        }

        let old_value = ptr[json_path[json_path.length-1]];
        let new_value;
        try {
            new_value = get_value_fn(); // attempts to retrieve correctly typed value eg a number
            if (isNaN(new_value)) {
                throw Error("Number required");
            }
        } catch (err) {
            console.error(err);
            //TODO some sort of error handling to notify user
            

            // hack to set the editabletext back
            set_value_fn(old_value);

        }        

        // skip if unchanged
        if (new_value === old_value) {
            return;
        }


        let valid = this.validate_edit(json_path, new_value);

        if (valid !== undefined) {
            // TODO error notification


            // hack to set the editabletext back
            set_value_fn(old_value);

        } else {
            this.setState({
                status: "Saving"
            });
            
            ptr[json_path[json_path.length-1]] = new_value;

            // TODO post change

            // httpPost('/admin/edit', {path: JSONPath, value: newValue}, () => {
            //     this.setState({
            //         status: "Saved",
            //         modified: true
            //     })
            // });
        }
        
    }

    onDelete(json_path) {

        this.setState({
            status: "Saving"
        });

        let ptr = this.state.data;
        for (let elem of json_path.slice(0,json_path.length-1)) {
            ptr = ptr[elem];
        }
        if (isArray(ptr)) {
            // cut out array and reindex array, saves much pain elsewhere in exchange for inefficiency
            ptr.splice(json_path[json_path.length-1], 1);   
        } else {
            // deleting works fine in objects
            debugger
            delete ptr[json_path[json_path.length-1]];
        }
        this.regenerate_meta();

        // TODO post change
    }

    // rename only possible for Object props
    onRename(json_path, get_value_fn, set_value_fn, new_name_in_sidebar) {
        

        let ptr = this.state.data;
        for (let elem of json_path.slice(0,json_path.length-1)) {
            ptr = ptr[elem];
        }

        let old_name = json_path[json_path.length-1];
        let new_name;
        try {
            new_name = get_value_fn();
        } catch (err) {
            console.error(err);

            // hack to set the editabletext back
            set_value_fn(old_name);

            return;
        }

        if (old_name === new_name) {
            return;
        }


        let valid = this.validate_rename(json_path, old_name, new_name, ptr);
        if (valid !== undefined) {

            // SOME kind of alert mechanism telling user the validation failed?
            // TODO
            
            // hack to set the editabletext back
            set_value_fn(old_name);
            

        } else {
            this.setState({
                status: "Saving"
            });

            let value = ptr[old_name];
            delete ptr[old_name];
            ptr[new_name] = value;

            if (new_name_in_sidebar) {
                new_name_in_sidebar(value);
            }
            
            this.regenerate_meta();

            // TODO post change

        }

    }

    validate_edit(json_path, new_value) {
        let err = this.schemaChecker.validate_value(json_path, new_value);
        if (err) {
            return err;
        }
    }

    validate_rename(json_path, old_name, new_name, object_to_rename_in) {
        // nothing to do with json_path atm
        if (object_to_rename_in[new_name] !== undefined) {
            return "Name already exists, use unique name"; 
        }
    }



    render() {
        if (!this.schemaChecker) {
            return null;
        }
        
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

                        on_add={this.onAdd.bind(this)}
                        on_edit={this.onEdit.bind(this)}
                        on_delete={this.onDelete.bind(this)}
                        on_rename={this.onRename.bind(this)}

                        /> 
                    : 
                    ""
                }
            </div>
        )
    }
}

export default AdminPage;