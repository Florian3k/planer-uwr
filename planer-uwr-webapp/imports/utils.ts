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

export const shortNameByType: Record<number, string | undefined> = {
  '5': 'I1',
  '6': 'I2',
  '7': 'I.inż',
  '8': 'O1',
  '9': 'O2',
  '10': 'O3',
  '13': 'P',
  '14': 'S',
  '15': 'N',
  '17': 'L',
  '35': 'Inny',
  '36': 'K1',
  '37': 'K2',
  '38': 'I2.T',
  '39': 'I2.Z',
  '40': 'K.inż',
  '42': 'HS',
  '43': 'M',
};
