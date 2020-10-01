import React from 'react';

import { Course } from '/imports/api/courses';
import { Offer } from '/imports/api/offers';

interface ListingProps {
  courses: Course[];
  offers: Offer[];
}
export const Listing = ({ courses, offers }: ListingProps) => {
  return (
    <div style={{ minWidth: 200, maxWidth: 300, flexGrow: 2 }}>
      {courses.map(course => (
        <div key={course._id}>
          {course.name} - {course.semester}
        </div>
      ))}
      {offers.map(offer => (
        <div key={offer._id}>
          {offer.name} - {offer.status}
        </div>
      ))}
    </div>
  );
};
