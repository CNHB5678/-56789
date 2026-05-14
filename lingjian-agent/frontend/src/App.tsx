import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import MainLayout from './components/layout/MainLayout';
import InspirationSquare from './pages/InspirationSquare';
import MyProjects from './pages/MyProjects';
import AudioPage from './pages/AudioPage';
import MediaPage from './pages/MediaPage';
import EditorPage from './pages/EditorPage';
import SettingsPage from './pages/SettingsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<InspirationSquare />} />
            <Route path="my-projects" element={<MyProjects />} />
            <Route path="audio" element={<AudioPage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="editor" element={<EditorPage />} />
            <Route path="editor/:projectId" element={<EditorPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
