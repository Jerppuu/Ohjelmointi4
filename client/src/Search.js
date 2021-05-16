import {useRef, useState} from "react";
import Parser from 'html-react-parser';
import kunnat from "./other/kunnat";
import {LocationNotFoundError} from "./Errors";
import { store } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import 'animate.css';

let options = '';
for (let i = 0; i < kunnat.length; i++) {
	options += '<option value="' + kunnat[i] + '"/>\n';
}

function Search(props) {
	const inputCity = useRef();
	const [errorState, setErrorState] = useState(false);
	const delayms = 1000;

	function handleSearch() {
		const city = inputCity.current.value;
		if (city === '') return;
		props.getForecast(city).then(() => {
			inputCity.current.value = null;
			setErrorState(null);
			}).catch(error => {
				switch (error.constructor) {
					case LocationNotFoundError:
						setErrorState(true);
						inputCity.current.value = null;
						setTimeout(function () {setErrorState(false)}, delayms);
						return;
					default:
						setErrorState(true);
						inputCity.current.value = null;
						setTimeout(function () {setErrorState(false)}, delayms);
						store.addNotification({
							title: 'Meidän Virhe!',
							message: error.usermessage,
							type: 'warning',                         // 'default', 'success', 'info', 'warning'
							container: 'bottom-right',                // where to position the notifications
							animationIn: ["animated", "fadeIn"],     // animate.css classes that's applied
							animationOut: ["animated", "fadeOut"],   // animate.css classes that's applied
							dismiss: {
								duration: 5000
							}
						});
				}
			});
	}

	function handleKeyPress(e){
		if (e.key === 'Enter'){
			handleSearch()
		}

	}
	return (
		<div>
			<input className={errorState? "searchInputError" : "searchInput"}
				   placeholder={errorState? "Yritä uudelleen..." : "Syötä kaupunki..."}
				   ref={inputCity} list={"paikkakunta-lista"} id={"valitse-paikkakunta"}
				   onKeyDown={handleKeyPress} type="text"/>
			<datalist id={"paikkakunta-lista"}>
				{Parser(options)}
			</datalist>
			<button className="searchButton" onClick={handleSearch}>Hae</button>
		</div>
	);
}

export default Search;
