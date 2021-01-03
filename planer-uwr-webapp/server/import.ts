import fs from 'fs';
import { join } from 'path';
import util from 'util';
import * as z from 'zod';

import { Courses, courseSchema } from '/imports/api/courses';

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
  const coursesFile = await openFile('courses.json');
  const offersFile = await openFile('offer.json');
  if (!coursesFile) {
    return console.warn('WARNING: courses.json not found!');
  }
  if (!offersFile) {
    return console.warn('WARNING: offer.json not found!');
  }
  const courses = z.array(courseSchema).parse(
    JSON.parse(coursesFile).map((course: any) => ({
      source: 'courses',
      ...course,
    })),
  );

  const offers = z.array(courseSchema).parse(
    JSON.parse(offersFile).map((offer: any) => ({
      source: 'offer',
      ...offer,
    })),
  );

  courses.forEach((course) => Courses.insert(course));
  offers.forEach((course) => Courses.insert(course));
};
