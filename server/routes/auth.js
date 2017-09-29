const express = require('express');
const validator = require('validator');
const MongoClient = require('mongodb').MongoClient;

const router = new express.Router();


/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateSignupForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || !validator.isEmail(payload.email)) {
    isFormValid = false;
    errors.email = 'Please provide a correct email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.name !== 'string' || payload.name.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */
function validateLoginForm(payload) {
  const errors = {};
  let isFormValid = true;
  let message = '';

  if (!payload || typeof payload.email !== 'string' || payload.email.trim().length === 0) {
    isFormValid = false;
    errors.email = 'Please provide your email address.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res) => {
  const validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return res.status(200).end();
});

router.post('/login', (req, res) => {
  const validationResult = validateLoginForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }

  return res.status(200).end();
});










// --- DB stuff ---

var url = 'mongodb://localhost:5000/data';
var db;
// Use connect method to connect to the server
MongoClient.connect(url, function(err, conn) {
  console.log("Connected successfully to server");
  db = conn;

  let collection = db.collection('documents');
  collection.find({}).toArray(function(err, docs) {
    console.log(docs);
    if (docs.length < 2) {
      console.log("inserting basic docs");
      collection.insertMany([
        {
          name: 'active',
          data: {
              "parties": {
              },
              "topics": {
              }
          }
        },
        {
          name: 'staged',
          data: {
              "parties": {
              },
              "topics": {
              }
          }
        }
      ])
    }
  });
});


router.post('/staged/add', (req, res) => {
  let data = req.body;
  let json_path = data.json_path;
  let added = data.value;


  get_staged_data((staged) => {
    
    let root = staged;
    for (let elem of json_path) {
      root = root[elem];
    }

    for (let key in added) {
      root[key] = added[key]; //add to array or object!
    }

    // save it back to the DB
    save_staged_data(staged, (result) => {
      console.log('sucess writing new values');
      res.send({'status': 'sucess'})
      res.status(400);
    });
  });
});

router.post('/staged/delete', (req,res) => {
  let data = req.body;
  let json_path = data.json_path;

  get_staged_data((staged) => {
    let root = staged;
    for (let elem of json_path.slice(0,json_path.length-1)) {
      root = root[elem];
    }
    if (isArray(root)) {
      // cut out array and reindex array
      root.splice(json_path[json_path.length-1], 1);   
    } else {
      // deleting works fine in objects
      delete root[json_path[json_path.length-1]];
    }
  
    // save it back to the DB
    save_staged_data(staged, (result) => {
      console.log('sucess writing deletion to staged');
      console.log(result); 
      res.send({'status': 'sucess'})
      res.status(400);
    });
  });
});

router.post('/staged/edit', (req, res) => {
  let data = req.body;
  let json_path = data.json_path;
  let new_value = data.value;

  console.log("received path and data");

  get_staged_data((staged) => {
    let root = staged;
    for (let elem of json_path.slice(0,json_path.length-1)) {
      root = root[elem];
    }
    root[json_path[json_path.length-1]] = new_value;

    // save it back to the DB
    save_staged_data(staged, (result) => {
      console.log('sucess writing edit to staged');
      console.log(result);
      res.send({'status': 'sucess'})
      res.status(400);
    });
  });
});

router.post('/staged/rename', (req, res) => {
  let data = req.body;
  let json_path = data.json_path;
  let new_name = data.new_name;


  get_staged_data((staged) => {
    let ptr = staged;
    for (let elem of json_path.slice(0,json_path.length-1)) {
        ptr = ptr[elem];
    }
    let old_name = json_path[json_path.length-1]; 
    let tmp = ptr[old_name];
    delete ptr[old_name];
    ptr[new_name] = tmp;  // copy into new name
    
    // save it back to the DB
    save_staged_data(staged, (result) => {
      console.log('sucess writing rename to staged');
      console.log(result);
      res.send({'status': 'sucess'})
      res.status(400);
    });
  });
});

// this would be more elegant with a promise, once I figure those out
function get_staged_data(callback) {
  db.collection('documents').findOne({name:'staged'}, (err, doc) =>
    {
      if (err) throw err;
      console.log(doc);
      callback(doc.data);
  });
}

function save_staged_data(data, callback) {

  db.collection('documents').updateOne({name: 'staged'}, {name: 'staged', data: data}, (err, result) => {
    if (err) throw err;
    console.log(result);
    callback(result);
  });

}

module.exports = router;



//--- temporary helpers, move out later TODO ---
function isArray(arr) {
    if (Array.isArray) {
        return Array.isArray(arr);
    } else {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }
}