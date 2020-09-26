import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import * as z from 'zod';

export const offerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  courseType: z.number().int(),
  recommendedForFirstYear: z.boolean(),
  owner: z.number().int(),
  effects: z.array(z.number().int()),
  tags: z.array(z.number().int()),
  status: z.enum(['IN_OFFER', 'IN_VOTE', 'WITHDRAWN']),
  semester: z.enum(['l', 'z', 'u']),
  url: z.string(),
  ects: z.transformer(z.string(), z.number().int(), str => parseInt(str)),
  hours: z.array(z.string()),
  exam: z.transformer(z.enum(['Yes', 'No']), z.boolean(), str => str === 'Yes'),
});

export interface Offer extends z.infer<typeof offerSchema> {
  _id?: string;
}

export const Offers = new Mongo.Collection('offer');

Offers.rawCollection().createIndex({ id: 1 }, { unique: true });

if (Meteor.isServer) {
  Meteor.publish('offers', function () {
    return Offers.find();
  });
}
