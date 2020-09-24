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
  const [error, setError] = useState('');

  return (
    <Card elevation={Elevation.TWO}>
      <h2 style={{ textAlign: 'center', marginTop: 0 }}>
        <a href="#">Zarejestruj się</a>
      </h2>
      {error &&
        <div
          style={{ textAlign: 'center', margin: '0 auto 12px auto', color: 'red', maxWidth: '14em' }}
          className="bp3-form-helper-text">{error}
        </div>
      }
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!username || !email || !password || !passwordRepeat) {
            setError('Proszę wypełnić wszystkie pola');
            return;
          }
          if (password != passwordRepeat) {
            setError('Podane hasła nie zgadzają się');
            return;
          }
          Accounts.createUser({ username, email, password }, err => {
            if (isMeteorError(err)) {
              if (err.reason === 'Username already exists.') setError('Podana nazwa użytkownika jest już zajęta');
              else if (err.reason === 'Email already exists.') setError('Podany email jest już zajęty');
            }
            else {
              setUsername('');
              setEmail('');
              setPassword('');
              setPasswordRepeat('');
              setError('');
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
