import Parser from 'html-react-parser';

import kuntalista from './other/kunnat'

let options = '';
for (let i = 0; i < kuntalista.length; i++) {
	options += '<option value="' + kuntalista[i] + '"/>\n';
}

function Search() {
	return (
		<div>
			<input list={"paikkakunta-lista"} id={"valitse-paikkakunta"}/>
			<datalist id={"paikkakunta-lista"}>
				{Parser(options)}
			</datalist><button>Hae</button>
		</div>
	);
}

export default Search;