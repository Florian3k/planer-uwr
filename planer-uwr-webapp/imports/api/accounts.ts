import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import * as z from 'zod';

Meteor.users.deny({
  update() {
    return true;
  },
});

const userSchema = z.object({
  _id: z.string(),
  createdAt: z.date(),
  services: z.object({
    github: z.object({
      id: z.number(),
      accessToken: z.string(),
      email: z.literal(''),
      username: z.string(),
      emails: z.array(z.never()),
    }),
    resume: z.unknown(),
  }),
  profile: z.unknown(),
});

Accounts.validateNewUser((user: unknown) => {
  return userSchema.check(user);
});

Accounts.onCreateUser(function (options, user) {
  const customizedUser = { ...user, username: user.services.github.username };

  if (options.profile) {
    customizedUser.profile = options.profile;
  }
  return customizedUser;
});
