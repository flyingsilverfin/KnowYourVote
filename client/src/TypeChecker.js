import {type_of} from './helper.js';

class TypeChecker {

    constructor(schema) {
        this.schema = schema;
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

}

export default TypeChecker;