import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Hello } from './Hello';
import { Info } from './Info';

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<h1>Welcome to Meteor!</h1>} />
      <Route path="/hello" element={<Hello></Hello>} />
      <Route path="/info" element={<Info></Info>} />
    </Routes>
  );
};
