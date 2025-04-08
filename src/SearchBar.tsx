import 'zingchart/es6';
import { useState } from 'react';
import { AtpAgent } from '@atproto/api'

const agent = new AtpAgent({
  service: 'https://public.api.bsky.app'
})

function TimelineChart() {
  const [actorResponse, setActorResponse] = useState(''); 
  
  const searchValue = async (e: React.ChangeEvent<HTMLInputElement >) => {
    const newValue = e. currentTarget.value;
    if(newValue != "") {
      // TODO handle loading and error msking this sync (removing the await)
      const { data } = await agent.searchActorsTypeahead({
        term: newValue
      });
      const outputString = data.actors.map(a => a.handle).toString();
      setActorResponse(outputString);
    } else {
      setActorResponse("");
    }
  }

	return <>
    <input type="text" placeholder="Busca una cuenta:" onChange={searchValue}/>
    <div>
      {actorResponse}
    </div>
  </>;
}

export default TimelineChart;
