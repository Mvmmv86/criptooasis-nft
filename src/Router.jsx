import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Ranking from './pages/Ranking';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
