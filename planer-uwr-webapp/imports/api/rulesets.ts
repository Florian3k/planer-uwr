import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as z from 'zod';

export const rulesetSchema = z.object({
  name: z.string(),
  semesterCount: z.number().int(),
  rules: z.array(z.any()),
});

export interface Ruleset extends z.infer<typeof rulesetSchema> {
  _id?: string;
}

export const Rulesets = new Mongo.Collection<Ruleset>('rulesets');

Rulesets.rawCollection().createIndex({ name: 1 }, { unique: true });

if (Meteor.isServer) {
  Meteor.publish('rulesets', function () {
    return Rulesets.find();
  });
}
