import {useRef, useState} from "react";
import Parser from 'html-react-parser';
import kunnat from "./other/kunnat";

let options = '';
for (let i = 0; i < kunnat.length; i++) {
	options += '<option value="' + kunnat[i] + '"/>\n';
}

function Search(props) {
	const inputCity = useRef();
	const [errorState, setErrorState] = useState(false);
	const delayInMs = 1000; //= 1 seconds

	function handleSearch() {
		const city = inputCity.current.value;
		if (city === '') return;
		props.getForecast(city).then(errorCode => {
			console.log("Handle search error code: ", errorCode);
			switch (errorCode) {
				case 0:
					setErrorState(false);
					inputCity.current.value = null;
					break;
				case 1:
				case 2:
					setErrorState(true);
					inputCity.current.value = null;
					setTimeout(function () {
						setErrorState(false)
						props.setAppErrorState(0);
					}, delayInMs);

					break;
				case 3:
				case 4:
			}
		});
	}

	function handleSearchError(){

	}

	function handleKeyPress(e){
		if (e.key === 'Enter'){
			handleSearch()
		}

	}
	return (
		<div>
			<input className={errorState? "searchInputError" : "searchInput"} placeholder={errorState? "Yritä uudelleen!" : "Syötä kaupunki..."} ref={inputCity} list={"paikkakunta-lista"} id={"valitse-paikkakunta"} onKeyDown={handleKeyPress} type="text"/>
			<datalist id={"paikkakunta-lista"}>
				{Parser(options)}
			</datalist>
			<button className="searchButton" onClick={handleSearch}>Hae</button>
		</div>
	);
}

export default Search;
