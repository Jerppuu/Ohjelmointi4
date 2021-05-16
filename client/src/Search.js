import {useRef, useState} from "react";
import Parser from 'html-react-parser';
import kunnat from "./other/kunnat";
import {LocationNotFoundError} from "./Errors";

let options = '';
for (let i = 0; i < kunnat.length; i++) {
	options += '<option value="' + kunnat[i] + '"/>\n';
}

function Search(props) {
	const inputCity = useRef();
	const [errorState, setErrorState] = useState(false);
	const delayms = 1000; //= 1 seconds

	function handleSearch() {
		console.log()
		const city = inputCity.current.value;
		if (city === '') return;
		props.getForecast(city).then(error => {
			inputCity.current.value = null;
			if (error===0) {
				setErrorState(false);
				return;
			}
			switch (error.constructor) {
				case LocationNotFoundError:
					setErrorState(true);
					inputCity.current.value = null;
					setTimeout(function () {
						setErrorState(false)
					}, delayms);
					return;
				default:
					// TODO: REMEMBER TO CODE THIS BEFORE THE RETURN
					console.log("Should we handle this in Search?",error)
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
				   placeholder={errorState? "Yritä uudelleen!" : "Syötä kaupunki..."}
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
