import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from './components/common/Header';
import Home from './pages/Home';
import TestPage from './pages/Test';

function App() {
  return (
    <div className="antialiased h-screen overflow-hidden flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </main>
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
