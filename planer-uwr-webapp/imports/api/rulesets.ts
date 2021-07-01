import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as z from 'zod';

const baseRuleSchema = z.object({
  name: z.string(),
  description: z.string(),
  condition: z.union([z.literal(true), z.number().int()]),
  selector: z.array(
    z.object({
      field: z.union([z.literal('courseType'), z.literal('effects')]),
      value: z.array(z.number().int()),
    }),
  ),
});

export type BaseRule = z.infer<typeof baseRuleSchema>;

export const ruleSchema = baseRuleSchema.extend({
  subRules: z.array(baseRuleSchema).nullable(),
});

export type Rule = z.infer<typeof ruleSchema>;

export const rulesetSchema = z.object({
  name: z.string(),
  semesterCount: z.number().int(),
  rules: z.array(ruleSchema),
});

export interface Ruleset extends z.infer<typeof rulesetSchema> {
  _id?: string;
}

export const Rulesets = new Mongo.Collection<Ruleset>('rulesets');

if (Meteor.isServer) {
  Rulesets.rawCollection().createIndex({ name: 1 }, { unique: true });

  Meteor.publish('rulesets', function () {
    return Rulesets.find();
  });
}
