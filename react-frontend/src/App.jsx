import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import VideoUploaderPage from "./pages/VideoUploaderPage";
import VideoHistoryPage from "./pages/VideoHistoryPage";
import { ToastProvider } from "./components/ui/Toast";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/upload" element={<VideoUploaderPage />} />
            <Route path="/history" element={<VideoHistoryPage />} />
          </Routes>
        </Layout>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
