import 'zingchart/es6';
import ZingChart from 'zingchart-react';
import { useState } from 'react';

function TimelineChart() {
  const [config] = useState({
    type: 'bar',
    series: [{
      values: [4,5,3,4,5,3,5,4,11]
    }]
  })

	return <ZingChart data={config} />
}

export default TimelineChart;
