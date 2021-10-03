import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Login } from './Login';

export const LandingPage = () => {
  const loggingIn = useTracker(() => Meteor.loggingIn());

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        height: '90vh',
      }}
    >
      <Login loggingIn={loggingIn} />
    </div>
  );
};
