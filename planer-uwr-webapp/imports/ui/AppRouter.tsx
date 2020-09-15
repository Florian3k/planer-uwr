import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Hello } from './pages/Hello';
import { LandingPage } from './pages/LandingPage';
import { UserLandingPage } from './pages/UserLandingPage';
import { Info } from './pages/Info';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const AppRouter = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<UserLandingPage />} />
          <Route path="/hello" element={<Hello />} />
          <Route path="/info" element={<Info />} />
        </>
      ) : (
        <Route path="/" element={<LandingPage />} />
      )}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
};
