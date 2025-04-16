import SearchBarDropdownItem from './SearchBarDropdownItem';
import { useQuery } from "react-query";
import { AtpAgent } from '@atproto/api'

const agent = new AtpAgent({
  service: 'https://public.api.bsky.app'
})

export interface Actor {
  did: string;
  handle: string;
  displayName?: string;
}

function SearchBarDropdown(props: {searchQuery: string, onSelect: (actor: Actor) => void}) {
  const searchQuery = async (term: string): Promise<Actor[]> => {
    if(term != "") {
      const { data } = await agent.searchActorsTypeahead({
        term: term
      });
      return data.actors.map(a => { return {did: a.did, handle: a.handle, displayName: a.displayName || ""} });
    }
    return [];
  }

  const {data, isLoading, error} = useQuery(['results', props.searchQuery], () => searchQuery(props.searchQuery));

  if (isLoading) {
      return <div>Loading ....</div>;
  }

  if (error) {
      return <div>Error fetching results</div>;
  }

	return <>
    <div>
      {data && data.map(actor=>{
          return <SearchBarDropdownItem actor={actor} onClick={props.onSelect} key={actor.did} />
      })}
    </div>
  </>;
}

export default SearchBarDropdown;
