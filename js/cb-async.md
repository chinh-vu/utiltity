## Callback function

### Code Refactoring
- common code
```
const express = require('express');
const fs = require('fs')
const datafile = 'server/data/users.json';
const router = express.Router();
```
- Original Code
```
router.route('/')
  .get(function(req, res) {
    fs.readFile(datafile, 'utf8', (err, data) => {
      if(err) console.log(err);
      else {
	let usersData = JSON.parse(data);
				
	console.log('Returning Users');
	res.send(usersData);
     }
  });
})
```
- Refactored Code
  - Callback is a MUST when. NodeJS <b>callback</b> convention expects 2 input parameters
   - error
   - data
```
router.route('/')
  .get(function(req, res) {
    getUsers( (err, data) => {
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
