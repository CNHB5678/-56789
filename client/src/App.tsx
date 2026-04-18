import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AppLayout from './components/Layout';
import Home from './pages/Home';
import StyleTraining from './pages/StyleTraining';
import ContentGeneration from './pages/ContentGeneration';
import CommentsReply from './pages/CommentsReply';
import MultiPlatformPublish from './pages/MultiPlatformPublish';
import Analytics from './pages/Analytics';
import SettingsPage from './pages/Settings';
import './index.css';

function App() {
  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#8b5cf6',
          borderRadius: 8,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="style" element={<StyleTraining />} />
            <Route path="content" element={<ContentGeneration />} />
            <Route path="comments" element={<CommentsReply />} />
            <Route path="publish" element={<MultiPlatformPublish />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;