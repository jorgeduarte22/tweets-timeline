import 'zingchart/es6';
import { useState } from 'react';
import SearchBarDropdown, { Actor } from './SearchBarDropdown';

function SearchBar(props: {onSelect: (actorDid: string) => void}) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const onChange = async (e: React.ChangeEvent<HTMLInputElement >) => {
    setSearchQuery(e.target.value);
  }

	return <>
    <div>
      <input type="text" style={{width:"200px"}} placeholder="Busca una cuenta:" onChange={onChange} value={searchQuery}/>
      {searchQuery != "" && <div style={{position: "absolute", width:"200px", marginTop: "5px", backgroundColor: "rgb(250 250 250 / 100%)", borderRadius: "5px", border: "1px solid #a6a6a6", padding: "3px", zIndex:1}}>
        <SearchBarDropdown searchQuery={searchQuery} onSelect={(actor) => {
          props.onSelect(actor.did);
          setSearchQuery('');
        }}></SearchBarDropdown>
      </div>}
    </div>
  </>;
}

export default SearchBar;