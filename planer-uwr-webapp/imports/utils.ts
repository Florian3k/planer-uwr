import { Meteor } from 'meteor/meteor';

export function isMeteorError(
  error: Error | Meteor.Error | Meteor.TypedError | undefined,
): error is Meteor.Error & Meteor.TypedError & { reason: string } {
  return !!(
    error &&
    //@ts-ignore
    typeof error.reason === 'string' &&
    //@ts-ignore
    error.errorType === 'Meteor.Error'
  );
}

type Color = [number, number, number];

interface CourseType {
  name: string;
  fullName: string;
  color: Color;
}

export const courseTypeById: Record<number, CourseType | undefined> = {
  '5': { name: 'I1', color: [0, 100, 240], fullName: 'Informatyczny 1' },
  '6': { name: 'I2', color: [0, 100, 240], fullName: 'Informatyczny 2' },
  '7': { name: 'I.inż', color: [90, 40, 255], fullName: 'Informatyczny Inynierski' },
  '8': { name: 'O1', color: [200, 0, 0], fullName: 'Obowiązkowy 1' },
  '9': { name: 'O2', color: [200, 0, 0], fullName: 'Obowiązkowy 2' },
  '10': { name: 'O3', color: [200, 0, 0], fullName: 'Obowiązkowy 3' },
  '13': { name: 'P', color: [0, 170, 90], fullName: 'Projekt' },
  '14': { name: 'S', color: [0, 130, 130], fullName: 'Seminarium' },
  '15': { name: 'N', color: [120, 150, 20], fullName: 'Nieinformatyczny' },
  '17': { name: 'L', color: [120, 150, 20], fullName: 'Laboratorium' },
  '35': { name: 'Inny', color: [125, 125, 125], fullName: 'Inny' },
  '36': { name: 'K1', color: [130, 30, 200], fullName: 'Kurs Podstawowy' },
  '37': { name: 'K2', color: [130, 30, 200], fullName: 'Kurs Zaawansowany' },
  '38': { name: 'I2.T', color: [0, 100, 240], fullName: 'Informatyczny 2 - Teoria' },
  '39': { name: 'I2.Z', color: [0, 100, 240], fullName: 'Informatyczny 2 - Zastosowania' },
  '40': { name: 'K.inż', color: [180, 30, 200], fullName: 'Kurs Inżynierski' },
  '41': { name: 'PS', color: [0, 130, 130], fullName: 'Proseminarium' },
  '42': { name: 'HS', color: [150, 120, 40], fullName: 'Humanistyczno-społeczny' },
  '43': { name: 'M', color: [255, 135, 0], fullName: 'Matematyczny' }
};

export const getTextColor = (bg: Color) => {
  var yiq = ((bg[0]*299)+(bg[1]*587)+(bg[2]*114)) / 1000;
  return (yiq >= 128) ? 'black' : 'white';  
}