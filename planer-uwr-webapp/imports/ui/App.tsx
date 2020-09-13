import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { AppRouter } from './AppRouter';

export const App = () => (
  <BrowserRouter>
    <Link to="/">Index</Link>
    <Link to="/hello">Hello</Link>
    <Link to="/info">Info</Link>
    <AppRouter />
  </BrowserRouter>
);
