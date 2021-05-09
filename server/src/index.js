const express = require('express');
const fetch = require("node-fetch");
const path = require("path");
const dummy = require("./other/dummy.json");
const cors = require('cors');

const app = express();
const port = 3002;
const mapMunicipalities = ["Pelkosenniemi","Oulu","Kuopio","Tampere"];

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
app.use(express.static(path.join(__dirname, "../../client/build")));

app.get(apiLocation, (req, res) => {
	//res.json(dummy); // uncomment to send dummy.json for dev purposes
	//return;
	// proper response below in the works, atm uses the id of first hit i gets from locations
	// TODO: implement better location id implementation and timeout for Foreca servers.
	getLocation(req.params.location, token)
		.then(async (result) => {
			let responseJSON = {"forecast": []};
			switch (result) {
				case 0:
					throw 0;
				case 1:
					throw 1;
				default:
					responseJSON.forecast.push({"daily": await getDaily(result, token)});
					responseJSON.forecast.push({"hourly": await getHourly(result, token)});
					return responseJSON;
			}
		})
		.then(responseJSON => {res.json(responseJSON);})
		.catch(error => {
			errorCatch(error,apiLocation);
	});
});
// TODO: solve responseJSON scope problem. Loop pushes data correctly, but response is sent after 2/4 fetches.
app.get(apiMap, (req,res) => {
	let responseJSON = {"map":[]};

	async function asyncForEach(arr, callback) {
		for (let i=0;i<arr.length; i++) {
			await callback(arr[i], i, arr);
		}
	}

	const loop = async () => {
		asyncForEach(mapMunicipalities, async (municipality) => {
			await getLocation(municipality, token)
				.then(result => {
					switch (result) {
						case 0:
							throw 0;
						case 1:
							throw 1;
						default:
							getDaily(result, token)
								.then(response => {
									console.log(1)
									responseJSON.map.push({
										"location" : municipality,
										"symbol": response[0].symbol,
										"minTemp": response[0].minTemp,
										"maxTemp": response[0].maxTemp,
										"precipAccum": response[0].precipAccum,
										"precipProb": response[0].precipProb,
										"maxWindSpeed": response[0].maxWindSpeed,
										"windDir": response[0].windDir

									});
								}).catch(error => errorCatch(error,apiMap));
					}
				}).catch(error => errorCatch(error,apiMap));
		}).then(res.json(responseJSON).end);
	}
	loop();
});

// atm uses the id of first hit it gets from locations
//TODO: Solve problem with ÄÖÅ. Returns Otherwise incorrectly notfound. Fetch supports utf-8 as def.
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
			errorCatch(error,getLocation.name);
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
		.then(result => result.json())
		.then(result => result.forecast)
		.catch(error => errorCatch(error,getDaily.name));
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
		.then(result => result.json())
		.then(result => result.forecast)
		.catch(error => errorCatch(error,getHourly.name));
}


function errorCatch(error, context){
	switch (error) {
	case 0:
		res.sendStatus(400).end;
		console.log("Foreca Server error (",context,"):", error);
		return;
	case 1:
		res.sendStatus(404).end;
		console.log("Location Not Found error (",context,"):", error);
		return;
	default:
		console.log("Express Server error (",context,"):", error);
	}
}