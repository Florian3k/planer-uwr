import { Button, Classes, FormGroup } from '@blueprintjs/core';
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
      <FormGroup label="Login">
        <input
          className={Classes.INPUT}
          type="text"
          name="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup label="Password">
        <input
          className={Classes.INPUT}
          type="password"
          name="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </FormGroup>
      <Button type="submit" intent="primary" disabled={loggingIn}>
        Login
      </Button>
    </form>
  );
};
