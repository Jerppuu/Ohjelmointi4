import kartta from './imgs/karttaesim.png';
const mapImgURL = "localhost:3002/imgs/map"

const serverPort = 3002;
const serverAddr = "http://localhost:"
const api = "/api/map";

// TODO: finish map
function getMap() {
	async function getForecast(cityName_var){
		var requestOptions = {
			method: 'GET',
			redirect: 'follow'
		};
		fetch(serverAddr + serverPort + api, requestOptions)
			.then(response => response.json())
			.catch(error => console.log('error', error));
	}
}

function Map() {
	return (
		<div className="map">
			<img src={kartta} alt="Map"/>
		</div>
	);
}

export default Map;