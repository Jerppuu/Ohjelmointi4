const express = require('express');
const app = express();
const port = 3001;
const fetch = require("node-fetch");
const dummy = require("./other/dummy.json");
const path = require("path");
/*
	dummy structure:
		{
			"forecast" :
 						 [
    						{
      							"daily": [
        							{ ... } ,
        							  ...   ,
        							{ ... }
        							]
							}
							,
							{
      							"hourly": [
        							{ ... } ,
        							  ...   ,
								    { ... }
        							]
							}
						]
		}
 */
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTYxOTY5NzA5OSwiZXhwIjoxNjE5NzA0Mjk5LCJuYmYiOjE2MTk2OTcwOTksImp0aSI6IjA4ODdmNzcxODJiMWU4MzIiLCJzdWIiOiJha2tlcGVra2EiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.3l5sIBBFvvoazNhwYumklRK9VhlGhH4rzNtYxu5L_L0";


app.get('/api/search/:location', (req, res) => {
	//res.json(dummy); // uncomment to send dummy.json for dev purposes

	// proper response below in the works, atm uses the id of first hit i gets from locations
	var responseJSON = {"forecast": []};
	try {
		getLocation(req.params.location, token)
			.then(async (result) => {
				let id = result;
			//	console.log(id);
				if (id === 0) {
					res.json("notfound");
					return;
				}
				let daily = await getDaily(id,token);
			//	console.log(JSON.stringify(daily));
				let hourly = await getHourly(id,token);
			//	console.log(JSON.stringify(hourly));
				responseJSON.forecast.push({"daily": daily});
				responseJSON.forecast.push({"hourly": hourly});
			}).then(result => {
			//console.log(JSON.stringify(responseJSON));
			res.json(responseJSON);
			});
	} catch(error) {
		console.log('error: ', error);
		res.code(400).end();

	}

});

app.use(express.static(path.join(__dirname, "../../client", "./build")));

app.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});

// atm uses the id of first hit i gets from locations
async function getLocation(municipality, token) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};
	try {
		// if you need more detailed dataset use argument: ?dataset=full
		return fetch("https://pfa.foreca.com/api/v1/location/search/" + municipality, requestOptions)
			.then(response => response.json())
			.then(data => {
				if (data.locations[0].name === municipality)
					return data.locations[0].id;
				else
					return 0;
			})
			.catch(error =>
				console.log('error: ', error));
	} catch (error) {
		console.log('error: ', error);
	}
}

async function getDaily(id, token) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};
	// if you need more detailed dataset use argument: ?dataset=full
	return fetch("https://pfa.foreca.com/api/v1/forecast/daily/" + id +"?periods=15", requestOptions)
		.then(async result => {
			let promise = result.json();
			let data = await promise;
			return data.forecast;
		})
		.catch(error => console.log('error', error));
}

async function getHourly(id, token) {

	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};

	return fetch("https://pfa.foreca.com/api/v1/forecast/hourly/" + id +"?periods=169", requestOptions)
		.then(async result => {
			let promise = result.json();
			let data = await promise;
			return data.forecast;
		})
		.catch(error => console.log('error', error));
}
