import React from 'react';
import { Container } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import AnimeList from './components/AnimeList';
import AnimeDetail from './components/AnimeDetail';

const App: React.FC = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/page/1" />} />
        <Route path="/page/:page" element={<AnimeList />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Container>
  );
};

export default App;
