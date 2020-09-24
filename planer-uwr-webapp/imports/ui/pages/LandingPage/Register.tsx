import { Button, Card, Classes, Elevation, FormGroup } from '@blueprintjs/core';
import { Accounts } from 'meteor/accounts-base';
import React, { useState } from 'react';
import { isMeteorError } from '../../../utils';

interface RegisterProps {
  loggingIn: boolean;
}

export const Register = ({ loggingIn }: RegisterProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');

  return (
    <Card elevation={Elevation.TWO}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>
        <a href="#">Zarejestruj się</a>
      </h2>

      <form
        onSubmit={e => {
          e.preventDefault();
          if (password != passwordRepeat) {
            return;
          }
          Accounts.createUser({ username, email, password }, (err) => {
            if (isMeteorError(err)) {
              console.log(err);
            } else {
              setUsername('');
              setEmail('');
              setPassword('');
              setPasswordRepeat('');
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
        <FormGroup label="Email">
          <input
            className={Classes.INPUT}
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Hasło">
          <input
            className={Classes.INPUT}
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </FormGroup>
        <FormGroup label="Powtórz hasło">
          <input
            className={Classes.INPUT}
            type="password"
            name="passwordRepeat"
            value={passwordRepeat}
            onChange={e => setPasswordRepeat(e.target.value)}
          />
        </FormGroup>
        <Button type="submit" intent="primary" disabled={loggingIn}>
          Zarejestruj się
        </Button>
      </form>
    </Card>
  );
};
