import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Hello } from './pages/Hello';
import { Index } from './pages/Index';
import { Info } from './pages/Info';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const AppRouter = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {user && (
        <>
          <Route path="/hello" element={<Hello />} />
          <Route path="/info" element={<Info />} />
        </>
      )}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};
