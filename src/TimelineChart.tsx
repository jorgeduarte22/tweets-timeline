import 'zingchart/es6';
import ZingChart from 'zingchart-react';
import { useState } from 'react';
import AtpAgent from '@atproto/api';
import { useQuery } from 'react-query';
import {
  AppBskyFeedGetAuthorFeed,
} from '@atproto/api'

const agent = new AtpAgent({
  service: 'https://public.api.bsky.app'
})

function TimelineChart(props: {actorDid: string}) {
  const [loadedPosts, setLoadedPosts] = useState(0);
  
  const [config] = useState({
    type: 'scatter',
    series: [{
      values: []
    }]
  })

  const getAllPosts = async (actorDid: string): Promise<string[]> => {
    let postTimelines:string[] = []
    let cursor: string | undefined = undefined;
    do {
      console.log(cursor);
      const response:AppBskyFeedGetAuthorFeed.Response = await agent.getAuthorFeed({
        actor: actorDid,
        cursor: cursor,
        filter: 'posts_with_replies',
        limit: 100,
        includePins: true
      });

      console.log(response);

      //TODO find a more efficient way of concatenating arrays
      postTimelines = postTimelines.concat(response.data.feed.filter(viewPost => viewPost.reason === undefined).map(viewPost => viewPost.post.indexedAt));
      cursor = response.data.cursor;
      console.log("SIZE " + response.data.feed.length);
      console.log("TOTAL SIZE " + postTimelines.length);
      setLoadedPosts(postTimelines.length)
    } while (cursor != undefined)
    return postTimelines.sort();
  }

  const getConfig = (sortedTimestamps: string[]) => {
    //TODO Set a timezone
    const values = sortedTimestamps.map(t => {
      const date = new Date(t);
      const hour = date.getHours()*60 + date.getMinutes();
      return [date.setHours(0, 0, 0, 0), hour]
    });
    console.log(values);
    console.log("FIRST POST " + sortedTimestamps[0]);
    console.log("FIRST POST " + new Date(sortedTimestamps[0]).valueOf());
    return {
      type: 'scatter',
      plot: {
        marker: {
          size: 3,
          backgroundColor: "red",
          borderWidth: 0,
          alpha: 0.3
        }
      },
      plotarea:{
          margin:"100px"
      },
      series: [{
        values: values
      }],
      scaleX: {
        maxValue: new Date().valueOf(),
        step: 60000,
        transform: {
          type: 'date',
          all: '%D, %d %M %Y',
          itemsOverlap: true,
        },
        item: {
          fontSize: 10
        }
      },
      scaleY: {
        minValue: 0,
        maxValue: 1440,
        step: 60
      },
      source: {
        text: "Bluesky API",
        url: "https://docs.bsky.app/"
      }
    };
  }
  
  const {data, isLoading, error} = useQuery(['results', props.actorDid], () => getAllPosts(props.actorDid || ''));

  if (isLoading)
    return <><div>{loadedPosts} posts loaded...</div></>
  
  if (error)
    return <><div>Error calculating chart</div></>

	return <>
    <div>{props.actorDid}</div>
    <ZingChart data={getConfig(data || [])} />
  </>;
}

export default TimelineChart;
