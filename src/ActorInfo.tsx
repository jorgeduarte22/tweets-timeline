import AtpAgent from '@atproto/api';
import { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';
import { useQuery } from 'react-query';

const agent = new AtpAgent({
  service: 'https://public.api.bsky.app'
})

function SearchBar(props: {actorDid: string}) {
  const getActorProfile = async (did: string): Promise<ProfileViewDetailed> => {
    const { data } = await agent.getProfile({
      actor: did
    });
    return data;
  }

  const {data, isLoading, error} = useQuery(['actorInfo', props.actorDid], () => getActorProfile(props.actorDid));

  const style = {margin: "10px"}

  if (isLoading) {
      return <div style={style}>Loading ....</div>;
  }

  if (error || !data) {
      return <div style={style}>Error fetching results</div>;
  }

	return <>
    <div style={style}>
      <div>
        User: @{data.handle}
      </div>
      <div>
        Posts: {data.postsCount}
      </div>
    </div>
  </>;
}

export default SearchBar;