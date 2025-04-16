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

  const getAllPosts = async (actorDid: string): Promise<string[]> => {
    let postTimelines:string[] = []
    let cursor: string | undefined = undefined;
    setLoadedPosts(0);
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
    } while (cursor !== undefined)
    return postTimelines.sort();
  }

  const dateToStringFormat = (date: Date): string => {
    return date.getDate() + ' ' + (date.toLocaleString('default', { month: 'short' })) + ' ' + date.getFullYear();
  }

  const getScatterConfig = (sortedTimestamps: string[]) => {
    // TODO Set a timezone
    let postsByDate = new Map<string, number[]>();

    console.log(sortedTimestamps);
    sortedTimestamps.forEach(t => {
      const date = new Date(t);
      const dateString = dateToStringFormat(date);
      let currentPosts = postsByDate.get(dateString) || [];
      console.log(t);
      console.log(dateString);
      console.log(currentPosts);
      currentPosts.push(date.valueOf());
      postsByDate.set(dateString, currentPosts);
    });
    
    let values: (string | number | undefined)[][] = [];
    var now = new Date();
    for (var d = new Date(sortedTimestamps[0]); d <= now; d.setDate(d.getDate() + 1)) {
      const date = new Date(d);
      const dateString = dateToStringFormat(date);
      let posts = postsByDate.get(dateString) || [];
      values.push([dateString, 186400000]);
      posts.forEach(p => {
        const postDate = new Date(p);
        let millis = (postDate.getHours()*3600 + postDate.getMinutes()*60 + postDate.getSeconds()) * 1000;
        console.log("PUSH " + millis);
        values.push([dateString, millis]);
      });
    }
    console.log(values);

    return {
      type: 'scatter',
      utc: true,
      plot: {
        marker: {
          size: 2,
          backgroundColor: "red",
          borderWidth: 0,
          alpha: 0.15
        },
        tooltip: {
          text: '%scale-value-value',
          transform: {
            type: 'date',
            all: '%H:%i'
          }
        }
      },
      plotarea:{
          marginLeft:"100px",
          marginRight:"100px",
          marginTop:"10px"
      },
      scaleX: {
        label: {
          text: 'Date'
        },
        item: {
          fontSize: 10,
          angle: -30
        },
      },
      scaleY: {
        minValue: 0,
        maxValue: 86400000,
        step: 3600000, //1 hour
        mirrored: true,
        transform: {
          type: 'date',
          all: '%H:%i'
        },
        label: {
          text: 'Time (UTC)'
        },
        item: {
          fontSize: 10,
        },
        guide: {
          lineStyle: 'dotted'
        }
      },
      series: [
        {
          values: values,
        }
      ]
    }
  }
  
  const {data, isLoading, error} = useQuery(['results', props.actorDid], () => getAllPosts(props.actorDid || ''));

  if (isLoading)
    return <><div>{loadedPosts} posts loaded...</div></>
  
  if (error)
    return <><div>Error calculating chart</div></>

	return <>
    <ZingChart data={getScatterConfig(data || [])} />
  </>;
}

export default TimelineChart;
