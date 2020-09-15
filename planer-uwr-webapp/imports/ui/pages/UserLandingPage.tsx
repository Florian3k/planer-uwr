import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React from 'react';
import { Link } from 'react-router-dom';

export const UserLandingPage = () => {
  const user = useTracker(() => Meteor.user());

  return (
    <>
      <nav>
        <Link to="/">Index</Link>
        {user && (
          <>
            <Link to="/hello">Hello</Link>
            <Link to="/info">Info</Link>
          </>
        )}
      </nav>
      <button onClick={() => Meteor.logout()}>Logout</button>
    </>
  );
};
