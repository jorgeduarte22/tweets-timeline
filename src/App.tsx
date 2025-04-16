import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query'
import TimelineChart from './TimelineChart';
import SearchBar from './SearchBar';
import { useState } from 'react';

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
});

function App() {
  const [selectedActor, setSelectedActor] = useState<string | undefined>(undefined);

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div>Título temporal</div>
        <SearchBar onSelect={(actorDid) => setSelectedActor(actorDid)}/>
        {selectedActor && <TimelineChart actorDid={selectedActor} />}
      </div>
   </QueryClientProvider>
  );
}

export default App;
