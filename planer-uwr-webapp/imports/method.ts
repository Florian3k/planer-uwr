import { Meteor } from 'meteor/meteor';
import * as z from 'zod';

type Options = {
  wait?: boolean;
  returnStubValue?: boolean;
  throwStubExceptions?: boolean;
};

type Callback<R> = (err?: Error | Meteor.Error, result?: R) => void;

export class ValidatedMethod<T, R> {
  name: string;
  schema: z.Schema<T>;
  run: (data: T) => R;
  options: Options;

  constructor({
    name,
    schema,
    run,
    options = {},
  }: {
    name: string;
    schema: z.Schema<T>;
    run: (this: Meteor.MethodThisType, data: T) => R;
    options?: Partial<Options>;
  }) {
    this.name = name;
    this.schema = schema;
    this.run = run;
    this.options = {
      returnStubValue: true,
      throwStubExceptions: true,
      ...options,
    };

    const self = this;
    Meteor.methods({
      [name](data) {
        self.run.call(this, self.schema.parse(data));
      },
    });
  }

  call(data: T, callback?: Callback<R>) {
    Meteor.apply(this.name, [data], this.options, callback);
  }
}