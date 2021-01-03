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
