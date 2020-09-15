import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import React, { useState } from 'react';

export const LandingPage = () => {
  const loggingIn = useTracker(() => Meteor.loggingIn());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        Meteor.loginWithPassword(username, password, err => {
          if (err) {
            console.log(err);
          } else {
            setPassword('');
            setUsername('');
          }
        });
      }}
    >
      <input
        type="text"
        name="username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <input type="submit" value="Login" disabled={loggingIn} />
    </form>
  );
};
