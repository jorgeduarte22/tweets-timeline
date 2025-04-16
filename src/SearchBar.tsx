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
      <input type="text" placeholder="Busca una cuenta:" onChange={onChange} value={searchQuery}/>
      <div style={{position: "absolute", backgroundColor: "rgb(255 255 255 / 100%)", zIndex:1}}>
        <SearchBarDropdown searchQuery={searchQuery} onSelect={(actor) => {
          props.onSelect(actor.did);
          setSearchQuery('');
        }}></SearchBarDropdown>
      </div>
    </div>
  </>;
}

export default SearchBar;