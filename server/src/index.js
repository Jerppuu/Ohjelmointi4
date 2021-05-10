const express = require('express');
const fetch = require("node-fetch");
const path = require("path");
const dummy = require("./other/dummy.json");
const cors = require('cors');

const app = express();
const port = 3002;
const mapMunicipalities = ["Sodankylä","Oulu","Kuopio","Tampere"];
timeoutms = 100;

const apiLocation = '/api/search/:location';
const apiMap = '/api/map';

const ForecaAddr = 'https://pfa.foreca.com';
const ForecaApiLocationSearch = '/api/v1/location/search/';
const ForecaApiForecastDaily = '/api/v1/forecast/daily/';
const ForecaApiForecastHourly = '/api/v1/forecast/hourly/';
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTYyMDYyOTY4MiwiZXhwIjoxNjIwNjcyODgyLCJuYmYiOjE2MjA2Mjk2ODIsImp0aSI6ImUwMzJmMWYyMjg2OWVlYmIiLCJzdWIiOiJha2tlcGVra2EiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.FlXO9eIwmZSwxBYXneMRFJFzfGZrYeUdEOvqDtsQ4h8";

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
	res.setTimeout(timeoutms, () => errorCatch([3,"timeout"],apiLocation,res));
	getLocation(req.params.location, token)
		.then(async (result) => {
			let responseJSON = {"forecast": []};
			responseJSON.forecast.push({"daily": await getDaily(result, token)});
			responseJSON.forecast.push({"hourly": await getHourly(result, token)});
			return responseJSON;
		})
		.then(responseJSON => {res.json(responseJSON);})
		.catch(error => {
			errorCatch(error,apiLocation,res);
	});
});
// The async Loop pushes data correctly, but response is sent after 2/4 fetches. Explicit fetch works fine.
app.get(apiMap, (req,res) => {
	let responseJSON = {"map":[]};
	res.setTimeout(timeoutms, () => {
		errorCatch([3,"timeout"],apiLocation,res);
	});
	getLocation(mapMunicipalities[0], token)
		.then(async (result) =>
			getDaily(result, token).then(result => responseJSON.map.push({"Sodankylä": result[0]})))
		.then(()=>getLocation(mapMunicipalities[1], token))
			.then(async (result) =>
				getDaily(result, token).then(result => responseJSON.map.push({"Oulu": result[0]})))
		.then(()=>getLocation(mapMunicipalities[2], token))
			.then(async (result) =>
				getDaily(result, token).then(result => responseJSON.map.push({"Kuopio": result[0]})))
		.then(()=>getLocation(mapMunicipalities[3], token))
			.then(async (result) =>
				getDaily(result, token).then(result => responseJSON.map.push({"Tampere": result[0]})))
		.then(()=>{
			if (!res.headersSent) res.json(responseJSON)
		})
		.catch(error => errorCatch(error,apiMap,res));

	/* Async Loop:
	async function asyncForEach(arr, callback) {
		for (let i=0;i<arr.length; i++) {
			await callback(arr[i], i, arr);
		}
	}

	const loop = async () => {
		await asyncForEach(mapMunicipalities, async (municipality) => {
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
								}).catch(error => errorCatch(error,apiMap,res));
					}
				}).catch(error => errorCatch(error,apiMap,res));
		});
		res.json(responseJSON);
	}
	loop();
	*/

});

// atm uses the id of first hit it gets from locations
async function getLocation(municipality, token) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token
		},
		redirect: 'follow'
	};
	// if you need more detailed dataset use argument: ?dataset=full
	return fetch(encodeURI(ForecaAddr + ForecaApiLocationSearch + municipality), requestOptions)
		.then(response => {
			if (response.status===401) throw [2,"Invalid Token"];
			if (response.ok) return response.json();
		})
		.then(data => {
			let result = 1;
			data.locations.forEach(location => {
				if (location.name === municipality) {
					result = location.id;
				}
			});
			if (result === 1) throw [1,"Not Found"];
			return result;
		}).catch(error => {throw error;});
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
		.catch(error => {throw [0,error];});
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
		.catch(error => {throw [0,error];});
}


function errorCatch(error, context, res){
	switch (error[0]) {
		case 0:
			res.sendStatus(400).end;
			console.log("Foreca Server error (",context,"):", error);
			return;
		case 1:
			res.sendStatus(404).end;
			console.log("Location Not Found error (",context,"):", error);
			return;
		case 2:
			res.sendStatus(400).end;
			console.log("Invalid Token error (",context,"):", error);
			return;
		case 3:
			res.sendStatus(408).end; // express sends response already
			console.log("Foreca Request Timeout error (",context,"):", error);
			return;
		default:
			res.sendStatus(400).end;
			console.log("General Express Server error (",context,"):", error);
	}
}