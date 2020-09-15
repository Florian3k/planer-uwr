import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';

export const UserLandingPage = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <>
      <p>Hello {user?.username}</p>
      <button onClick={() => Meteor.logout()}>Logout</button>
    </>
  );
};
