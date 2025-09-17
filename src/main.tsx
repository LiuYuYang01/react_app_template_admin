import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { HeroUIProvider } from '@heroui/react';
import Home from '@/pages/home';
import './styles/global.css';

const app = createRoot(document.getElementById('root')!);
app.render(
  <HeroUIProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </HeroUIProvider>
);
