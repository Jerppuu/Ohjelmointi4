const express = require('express');
const fetch = require("node-fetch");
const path = require("path");
const dummy = require("./other/dummy.json");
const cors = require('cors');

const app = express();
const port = 3002;
const mapMunicipalities = ["Sodankylä","Oulu","Kuopio","Tampere"];

const apiLocation = '/api/search/:location';
const apiMap = '/api/map';

const ForecaAddr = 'https://pfa.foreca.com';
const ForecaApiLocationSearch = '/api/v1/location/search/';
const ForecaApiForecastDaily = '/api/v1/forecast/daily/';
const ForecaApiForecastHourly = '/api/v1/forecast/hourly/';
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTYyMDU0NTU1MCwiZXhwIjoxNjIwNTg4NzUwLCJuYmYiOjE2MjA1NDU1NTAsImp0aSI6IjVhMzNiMDNjZjBiM2M2NDIiLCJzdWIiOiJha2tlcGVra2EiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.8MZlzKk-4wNHTtBd_W0C6_Mf0UUDpjQcwL36nU1AS4g";

app.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});

app.use(cors());
// host static images and other content
app.use(express.static(path.join(__dirname,'public')));
// host static website
app.use(express.static(path.join(__dirname, "../../client", "./build")));

app.get(apiLocation, (req, res) => {
	//res.json(dummy); // uncomment to send dummy.json for dev purposes
	//return;
	// proper response below in the works, atm uses the id of first hit i gets from locations
	// TODO: implement better location id implementation and timeout for Foreca servers.
	try {
		getLocation(req.params.location, token)
			.then(async (result) => {
				let responseJSON = {"forecast": []};
				switch (result) {
					case 0:
						throw 0;
					case 1:
						throw 1;
					default:
						console.log("result:" ,result);
						responseJSON.forecast.push({"daily": await getDaily(result, token)});
						responseJSON.forecast.push({"hourly": await getHourly(result, token)});
						return responseJSON;
				}
			})
			.then(responseJSON => {res.json(responseJSON);})
			.catch(error => console.log("error:", error))
	} catch (error) {
		console.log('error: ', error);
		switch (error) {
			case 0:
				res.code(400).end;
				return;
			case 1:
				res.code(404).end;
				return;
		}
	}
});
// TODO: test if this works
app.get(apiMap), (req,res) => {
	let responseJSON = {"map":[]};
	try {
		mapMunicipalities.forEach(municipality => {
			getLocation(municipality, token)
				.then(async (result) => {
					switch (result) {
						case 1:
							res.code(404).end;
							return;
						case 0:
							res.code(400).end;
							return;
					}
					getDaily(result,token)
						.then(response => {
							result.map.push({municipality: {"symbol":response.forecast[0].symbol,
															"minTemp":response.forecast[0].minTemp,
															"maxTemp":response.forecast[0].maxTemp,
															"precipAccum": response.forecast[0].precipAccum,
															"precipProb": response.forecast[0].precipProb,
															"maxWindSpeed": response.forecast[0].maxWindSpeed,
															"windDir": response.forecast[0].windDir
															}})
						})
					})
				})
		res.json(responseJSON);
	} catch(error) {
		console.log('error', error)
		res.code(400).end();
	}
}

// atm uses the id of first hit it gets from locations
async function getLocation(municipality, token) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};
	// if you need more detailed dataset use argument: ?dataset=full
	return fetch(ForecaAddr + ForecaApiLocationSearch + municipality, requestOptions)
		.then(response => response.json())
		.then(data => {
			let result = 1;
			data.locations.forEach(location => {
				if (location.name === municipality) {
					result = location.id;
				}
			});
			return result;
		}).catch(error => {
			console.log('error: ', error);
			return 0;
		});
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
	return fetch( ForecaAddr + ForecaApiForecastDaily + id +"?periods=15", requestOptions)
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

	return fetch(ForecaAddr + ForecaApiForecastHourly + id +"?periods=169", requestOptions)
		.then(async result => {
			let promise = result.json();
			let data = await promise;
			return data.forecast;
		})
		.catch(error => console.log('error', error));
}
