import 'zingchart/es6';
import { useState } from 'react';
import SearchBarDropdown, { Actor } from './SearchBarDropdown';

function SearchBar() {
  const [selectedActor, setSelectedActor] = useState<Actor | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  
  const onChange = async (e: React.ChangeEvent<HTMLInputElement >) => {
    setSearchQuery(e.target.value);
  }

	return <>
    <div>
      <input type="text" placeholder="Busca una cuenta:" onChange={onChange} value={searchQuery}/>
      <SearchBarDropdown searchQuery={searchQuery} onSelect={(actor) => {
        setSelectedActor(actor);
        setSearchQuery('');
      }}></SearchBarDropdown>
      {selectedActor && <div>SelectedActor: {selectedActor.handle}</div>}
    </div>
  </>;
}

export default SearchBar;