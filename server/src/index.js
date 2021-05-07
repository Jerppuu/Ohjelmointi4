const express = require('express');
const fetch = require("node-fetch");
const path = require("path");
const dummy = require("./other/dummy.json");
const cors = require('cors');

const app = express();
const port = 3002;

var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTYyMDI4NzU3MCwiZXhwIjoxNjIwMzMwNzcwLCJuYmYiOjE2MjAyODc1NzAsImp0aSI6ImI4ZmRjMDE0M2JmZDA0OGYiLCJzdWIiOiJha2tlcGVra2EiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.eccqw6d1dgK-6-hbo8GrGQ9lLqU_8XUW1CwnGYLFTOY";

app.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});

app.use(cors());
// host static images and other content
app.use(express.static(path.join(__dirname,'public')));
// host static website
app.use(express.static(path.join(__dirname, "../../client", "./build")));

app.get('/api/search/:location', (req, res) => {
	res.json(dummy); // uncomment to send dummy.json for dev purposes
	return;
	// proper response below in the works, atm uses the id of first hit i gets from locations
	// TODO: implement better location id implementation and timeout for Foreca servers.
	try {
		let responseJSON = {"forecast": []};
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
			//	console.log(JSON.stringify(responseJSON));
				res.he
				res.json(responseJSON);
			});
	} catch(error) {
		console.log('error: ', error);
		res.code(400).end();

	}
});

// atm uses the id of first hit it gets from locations
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
