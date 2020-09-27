import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as z from 'zod';

export const semesterSchema = z.union([
  z.object({
    semesterNumber: z.number(),
    isGap: z.literal(false),
    courses: z.array(z.number()),
  }),
  z.object({
    isGap: z.literal(true),
  }),
]);

export const planSchema = z.object({
  name: z.string(),
  ownerId: z.string(),
  rulesetId: z.string(),
  semesters: z.array(semesterSchema),
});

export interface Plan extends z.infer<typeof planSchema> {
  _id?: string;
}

export const Plans = new Mongo.Collection<Plan>('plans');

Plans.rawCollection().createIndex({ name: 1 }, { unique: true });

if (Meteor.isServer) {
  Meteor.publish('plans', function () {
    return Plans.find({ ownerId: this.userId });
  });
}
