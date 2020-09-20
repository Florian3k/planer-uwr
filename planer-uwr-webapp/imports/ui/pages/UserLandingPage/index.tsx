import { Button } from '@blueprintjs/core';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';

export const UserLandingPage = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <>
      <p>Hello {user?.username}</p>
      <Button intent="primary" onClick={() => Meteor.logout()}>
        Logout
      </Button>
    </>
  );
};
