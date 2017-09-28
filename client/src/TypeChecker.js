import {type_of, assert} from './helper.js';

class TypeChecker {

    constructor(schema) {
        this.schema = schema;
    }

    _is_primitive(value) {
        let type = type_of(value);
        return this._is_primitive_type(type);
    }

    _is_primitive_type(type) {
        return (type === 'number' || type === 'string' || type === 'boolean');      
    }

    _is_simple_builtin_type(type) {
        return (type === 'object'   || 
                type === 'array'    || 
                type === 'number'   ||
                type === 'string'   ||
                type === 'boolean');
    }

    _user_type_exists(type) {
        return this.schema.types[type] !== undefined;
    }

    _check(json, required_type) {

        console.log("checking: " + JSON.stringify(json) + ", required_type: " + JSON.stringify(required_type));

        let t = required_type['type'];

        if (this._is_simple_builtin_type(t)) {

            // require type to conform if it's one of object, array, string, number
            if (type_of(json) !== t) {
                throw Error("Expected type " + t + " from " + JSON.stringify(json) + ", got: " + type_of(json));
            }

            if ( t === "object" || t === 'array' ) {

                // any key/index with values conforming to 'subtype' key in required_type
                // flexible size
                if (required_type['props'] === undefined && required_type['subtype'] !== undefined) {

                    // check schema for required specs
                    if (required_type['min-size'] === undefined ||             required_type['max-size'] === undefined) {
                        throw Error("Flexible size schema type must define min- & max-size");
                    }

                    // check size bounds for flexibly objects and arrays
                    let size = Object.keys(json).length;
                    if (size < required_type['min-size'] ||
                         (required_type['max-size'] !== -1 && size > required_type['max-size'])) {
                        throw Error("Number of keys must be between " + required_type['min-size'] + ' and ' + required_type['max-size'] + ': ' + JSON.stringify(json));
                    }

                    let required_subtype = required_type['subtype'];

                    for (let key in json) {
                        let value = json[key];

                        // check type of json[key] to match a simple builtin type
                        // the schema actually shouldn't define 'object' or 'array' types here
                        if (this._is_simple_builtin_type(required_subtype)) {
                            if (type_of(value) !== required_subtype) {
                                throw Error("Required subtype does not match actual");
                            }
                            if (required_subtype === 'object' || required_subtype == 'array') {
                                throw Error('ERROR: found a subtype that is object or array. Please move this into a separate, new definition');
                            }
                        } else {
                            // assume uniform types for now ie. no string|number|array
                            // check the required user subtype is defined
                            if (!this._user_type_exists(required_subtype)) {
                                throw Error("User type " + required_subtype + " is not defined");
                            }
                            // recursive call
                            this._check(value, this.schema.types[required_subtype]);
                        }
                    }
                }
                // object with prescribed required keys
                // therefore has fixed size
                else if (required_type['props'] !== undefined) {
                    let required_props = required_type['props'];
                    for (let key in required_props) {

                        // array indices are numbers not strings though json keys are strings
                        if (t === 'array') {    
                            key = Number(key);
                        }

                        // missing key doesn't conform to spec
                        if (json[key] === undefined) {
                            throw Error("Missing key " + key + " in json " + JSON.stringify(json));
                        }
                        
                        // TODO
                        // Test that this works when the array/object 
                        // specified props are primitives?
                        
                        // recursive schema check
                        this._check(json[key], required_props[key]);
                    }
                } else {
                    throw Error("Incorrect schema - need either 'props' or 'subtype' to be defined in schema for object types " + JSON.stringify(required_type));
                }
            } else if (t === "number") { /* number builtin type */

                if (required_type['min'] !== undefined && json < required_type['min']) {
                    throw Error("Number is too small: " + json);
                }

                if (required_type['max'] !== undefined && json > required_type['max']) {
                    throw Error("Number is too large:" + json);
                }

                // if we get here, all OK!

            } else if (t === "string") { /* string builtin type */
                // only require the original type check passes :)
            } else if (t === 'boolean') {
                // only require the original type check passes :)
            } else {
                throw Error(" ????? how'd we get here...");
            }
        } else {    /* use user defined types */
            if (!this._user_type_exists(t)) {
                throw Error("User type " + t + " is not defined");
            }
            
            this._check(json, this.schema.types[t]);
        }
    }


    check(json) {
        let toplevel = this.schema.toplevel;
        // anything defined in the JSON must conform to the schema
        for (let key in json) {
            if (toplevel[key] !== undefined) {
                this._check(json[key], toplevel[key], this.schema.types);
            }
        }
    }



    // generate metadata for object/array subtypes
    // primitives have already been handled!
    _generateMeta(json, schema_type) {

        console.log("Generating meta for: " + JSON.stringify(json) + ", " + JSON.stringify(schema_type));

        // values conforming to 'subtype' key in required_type
        // flexible size
        // each of these elements are individually NOT required!
        if (schema_type['props'] === undefined && schema_type['subtype'] !== undefined) {

            for (let key in json) {
                if (key === '_deletable') { // skip this special key
                    continue;
                }
                if (this._is_primitive(json[key])) {    // primitive subtype
                    json[key] = true;   // NOT required
                } else {    // compound subtype
                    json[key]['_deletable'] = true; // NOT required

                    if (this._is_simple_builtin_type(schema_type['subtype'])) {
                        json[key] = false;
                    } else {
                        this._generateMeta(json[key], this.schema.types[schema_type['subtype']]);
                    }

                    
                }
            }
        }
        // object with prescribed required keys
        // therefore has fixed size
        // and we require each prop to exist and not be deleted!
        else if (schema_type['props'] !== undefined) {
            let required_props = schema_type['props'];

            for (let key in json) {
                if (key === '_deletable') { // skip special key
                    continue;
                }
                if (required_props[key] === undefined) {
                    // these are all keys in the JSON not defined in the schema, therefore NOT required
                    if (this._is_primitive_type(toplevel[key].type)) {
                        json[key] = true;
                    } else {
                        json[key]['_deletable'] = true;
                        this._mark_all_children_deletable(json[key]);
                    }
                }
            }

            for (let key in required_props) {

                // array indices are numbers not strings though json keys are strings
                if (schema_type['type'] === 'array') {    
                    key = Number(key);
                }

                if (this._is_primitive(json[key])) {
                    json[key] = false;  // REQUIRED!
                } else {      
                    json[key]['_deletable'] = false; // REQUIRED!
                    // recurse on compound types
                    this._generateMeta(json[key], required_props[key]);
                }
            }
        } else  {   // both 'props' and 'subtype' undefined implies it's just got 'type' and we need to recurse on this user type...
            assert(!this._is_simple_builtin_type(schema_type['type']));
            this._generateMeta(json, this.schema.types[schema_type['type']]);
        }
    }


    // takes a JSON conforming to the schema
    // then generates a skeleton of the same keys/values etc
    // but all primitives are replaced with booleans for deletable/not deletable
    // and objects/arrays gain an additional property _deletable
    // making full use of JS arrays being objects!
    generateMetaJson(json_original) {
        let toplevel = this.schema.toplevel;
        // clone JSON
        let json = JSON.parse(JSON.stringify(json_original));

        for (let key in json) {
            // key not in schema is definitely not required!
            // can be deleted
            if (toplevel[key] === undefined) {
                if (this._is_primitive_type(toplevel[key].type)) {
                    json[key] = true;
                } else {
                    json[key]['_deletable'] = true;
                    this._mark_all_children_deletable(json[key]);
                }
            } else {    // in schema
                if (this._is_primitive_type(toplevel[key].type)) {
                    // rare, unlikely case
                    // assume toplevel keys that are defined in schema are required...
                    json[key] = false;  
                } else {
                    json[key]['_deletable'] = false; // toplevels never deleteable
                    this._generateMeta(json[key], toplevel[key]);
                }
            }
        }
        return json;
    }

    _mark_all_children_deletable(json) {
        for (let key in json) {
            if (key === '_deletable') { // skip special keys
                continue;
            }
            if (this._is_primitive(json[key])) {
                json[key] = true;
            } else {
                json[key]['_deletable'] = true;
                this._mark_all_children_deletable(json[key]);   //recurse
            }
        }
    }



}

export default TypeChecker;