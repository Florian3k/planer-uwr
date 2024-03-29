import '@blueprintjs/core/lib/css/blueprint.css';
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import 'normalize.css/normalize.css';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { App } from '/imports/ui/App';

Meteor.startup(() => {
  document.body.classList.add('bp3-dark');
  render(<App />, document.getElementById('react-target'));
});
