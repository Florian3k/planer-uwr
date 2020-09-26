import fs from 'fs';
import { join, resolve } from 'path';
import util from 'util';
import * as z from 'zod';

import { Courses, courseSchema } from '/imports/api/courses';
import { Offers, offerSchema } from '/imports/api/offers';

const readFile = util.promisify(fs.readFile);

const folder = join(process.env.PWD!, '../planer-uwr-scraping/output');

const openFile = async (filename: string) => {
  try {
    return readFile(join(folder, filename), 'utf-8');
  } catch {
    return null;
  }
};

export const importCourses = async () => {
  const file = await openFile('courses.json');
  if (!file) {
    console.warn('WARNING: courses.json not found!');
    return;
  }
  const courses = z.array(courseSchema).parse(JSON.parse(file));

  // Typings expect field _id to exist, but it's completely ok to pass document without it
  // https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertMany
  await Courses.rawCollection().insertMany(courses as any);
};

export const importOffers = async () => {
  const file = await openFile('offer.json');
  if (!file) {
    return console.warn('WARNING: offer.json not found!');
  }
  const offers = z.array(offerSchema).parse(JSON.parse(file));

  // Typings expect field _id to exist, but it's completely ok to pass document without it
  // https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#insertMany
  await Offers.rawCollection().insertMany(offers as any);
};
