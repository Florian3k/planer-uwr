import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { UserLandingPage } from './pages/UserLandingPage';
import { PlanPage } from './pages/PlanPage';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

export const AppRouter = () => {
  const [user, loggingIn] = useTracker(() => [
    Meteor.user(),
    Meteor.loggingIn(),
  ]);

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/" element={<UserLandingPage />} />
          <Route path="/plan/:planId" element={<PlanPage />} />
        </>
      ) : (
        <Route path="/" element={<LandingPage />} />
      )}
      {!loggingIn && <Route path="/*" element={<Navigate to="/" />} />}
    </Routes>
  );
};
