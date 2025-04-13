import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query'
import TimelineChart from './TimelineChart';
import SearchBar from './SearchBar';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
     <SearchBar />
     <TimelineChart />
   </QueryClientProvider>
  );
}

export default App;
