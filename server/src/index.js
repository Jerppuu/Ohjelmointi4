const express = require('express');
const app = express();
const port = 3001;
const fetch = require("node-fetch");
const dummy = require("./other/dummy.json");
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
var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wZmEuZm9yZWNhLmNvbVwvYXV0aG9yaXplXC90b2tlbiIsImlhdCI6MTYxOTY3NjQ2OSwiZXhwIjoxNjE5NjgzNjY5LCJuYmYiOjE2MTk2NzY0NjksImp0aSI6ImE4MTE5NDBmYjY5ZTM5MDEiLCJzdWIiOiJha2tlcGVra2EiLCJmbXQiOiJYRGNPaGpDNDArQUxqbFlUdGpiT2lBPT0ifQ.f0Ex6NAK_MOxYwTXLGEDBhB1i331deK_LfPPnrFS9-w";
var responseJSON = {
						"forecast":[
							"daily", "hourly"
						]
					};

app.get('/api/:word', (req, res) => {
	res.json(dummy); // uncomment to send dummy.json for dev purposes

	// proper response below in the works, does not compile
	/*
	try {
		getLocation(req.params.word, token)
			.then(result => {
				let id = result;
				responseJSON.forecast.daily.append(getDaily(id, token).forecast)
					.then(() => responseJSON.forecast.hourly.append(getHourly(id, token).forecast))
			}).then(result => res.json(result));
	} catch(error) {
		console.log('error: ', error);
		res.code(400).end();

	}
	*/
});

app.listen(port, () => {
	console.log(`Express app listening at http://localhost:${port}`);
});

async function getLocation(municipality, token) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};
	try {
		return fetch("https://pfa.foreca.com/api/v1/location/search/" + municipality, requestOptions)
			.then(response => response.json())
			.then(data => data.locations[0].id)
			.catch(error =>
				console.log('error: ', error));
	} catch (error) {
		console.log('error: ', error);
	}
}

function getDaily(id, token) {
	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};

	return fetch("https://pfa.foreca.com/api/v1/forecast/daily/" + id +"?periods=15?dataset=full", requestOptions).json().forecast
		.catch(error => console.log('error', error));
}

function getHourly(id, token) {

	let requestOptions = {
		method: 'GET',
		headers: {
			Authorization: 'Bearer '+token,
		},
		redirect: 'follow'
	};

	return fetch("https://pfa.foreca.com/api/v1/forecast/hourly/" + id +"?periods=169?dataset=full", requestOptions).json().forecast
		.catch(error => console.log('error', error));
}
