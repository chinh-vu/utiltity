## Callback function

### Code Refactoring
- common code
```
const express = require('express');
const fs = require('fs')
const datafile = 'server/data/clothing.json';
const router = express.Router();
```
- Original code
```
router.route('/')
	.get(function(req, res) {
		
		/** (1) refactor for reusability
		  */
		/*
		fs.readFile(datafile, 'utf8', (err, data) => {
			if(err) console.log(err);
			else {
				let clothingData = JSON.parse(data);
				
				console.log('Returning clothing data');
				res.send(clothingData);
			}
		});
		*/
		
		/**
		  * this won't work because of the getClothingData is async
		  */
		/* 
		console.log('Returning clothing data');
		let clothingData = getClothingData();
		res.send(clothingData);
		*/
		/** (2) therefore callback is required
		  * where node callback convention has 2 parameters 'error' and 'data'
		  *  	error is error which enconter
		  *		data is data which returned
		  * as following
		  */
		
		console.log('Returning clothing data');
		let clothingData = getClothingData((err, data) => {
			if(err) console.log(err);
			else {
				console.log('Returning data');
				res.send(data);
			}
		});
		// res.send(clothingData);
		// console.log('Doing more work');
	})
```
