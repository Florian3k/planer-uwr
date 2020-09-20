import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Login } from './Login';
import { Register } from './Register';

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
      <Register loggingIn={loggingIn} />
      <Login loggingIn={loggingIn} />
    </div>
  );
};
