## Callback function
- common code
```javascript
const express = require('express');
const fs = require('fs')
const datafile = 'server/data/users.json';
const router = express.Router();
```
- Original Code
```javascript
router.route('/')
  .get(function(req, res) {
    // refactor this code block to function, make sure callback being implemented
    // callback takes in 2 input parameters (error, data)
    fs.readFile(datafile, 'utf8', (err, data) => {
      if(err){
      	console.log(err);
	// invoke callback - callback(err, null)
      } else {
	let usersData = JSON.parse(data);
				
	console.log('Returning Users');
	// invoke callback as callback(null, usersData)
	res.send(usersData);
     }
  });
})
```
- Refactored Code
  - Callback is a MUST when. NodeJS <b>callback</b> convention expects 2 input parameters ```error, data```
```javascript
router.route('/')
  .get(function(req, res) {
    getUsers( /* callback function */ (err, data) => {
    	if(err) console.log(err);
	else {
	  res.send(data);
	}
    });
  });
})
function getUsers(callback) {
  fs.readFile(datafile, 'utf8', (err, data) => {
    if(err) {
      console.log(err);
      callback(err, null)
    } else {
      let usersData = JSON.parse(data);
      callback(null, usersData);
    }
  });
}
```
- Promises
```javascript
router.route('/')
  .get(function(req, res) {
    getUsers()
      .then( data => {
      	console.log('Returing users');
	res.send(data);
      })
      .catch(error => res.status(500).send(error))
      .finally( () => console.log('Clean up if there is');)
  });
})

// no longer needed to passed in call back function since the code is implemening promise
function getUsers() {
  return new Promise( (resolve, reject) => {
    fs.readFile(datafile, 'utf8', (err, data) => {
      if(err) {
        console.log(err);
        reject(err);
      } else {
        let usersData = JSON.parse(data);
        resolve(usersData);
      }
    });
  })
}
```
