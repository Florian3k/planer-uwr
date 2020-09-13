import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import * as z from 'zod';

Meteor.users.deny({
  update() {
    return true;
  },
});

// at least 4 chars, starting with letter
export const usernameSchema = z.string().regex(/^[A-Za-z][A-Za-z0-9]{3,}$/);

const userSchema = z.object({
  _id: z.string(),
  username: usernameSchema,
  emails: z
    .array(
      z.object({
        address: z.string().email(),
        verified: z.literal(false),
      }),
    )
    .min(1),
  services: z.any(),
  createdAt: z.date(),
});

Accounts.validateNewUser((user: unknown) => {
  return userSchema.check(user);
});
