const fs = require('fs')

let path = "./dummy.json";

let dummy = JSON.parse(fs.readFileSync(path, 'utf8'));
[days, hours] = parseForecast(dummy);
//days.forEach(day => console.log(day));//JSON.stringify(day)));
//hours.forEach(hour => console.log(hour));//JSON.stringify(day)));
console.log(days[0].date);						// 2021-05-03
console.log(new Date(days[0].date).getDay());	// tulostaa 1, koska 5.3 oli maanantai, ti = 2,...,la = 6,su = 0

function parseForecast(forecastJSON){
	let daysArr = [], hoursArr = [];

	forecastJSON.forecast[0].daily.forEach(day => {
		daysArr.push(day);
		});
	forecastJSON.forecast[1].hourly.forEach(hour => {
		hoursArr.push(hour);
		});
	return [daysArr,hoursArr];
}
