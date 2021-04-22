
function Search() {
	return (
		<div>
			<input list={"paikkakunta-lista"} id={"valitse-paikkakunta"}/>
			<datalist id={"paikkakunta-lista"}>
				<option value={"kuusamo"}/>
				<option value={"oulu"}/>
				<option value={"helsinki"}/>
			</datalist><button>Hae</button>
		</div>
	);
}

export default Search;