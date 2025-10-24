/**
 * @see https://bsky.app/profile/sebmarkbage.calyptus.eu/post/3lku7b7xjmk2w
 */
export class FulfilledPromise<T> extends Promise<T> {
  status = "fulfilled";
  value: T;

  constructor(value: T) {
    super((resolve) => resolve(value));
    this.value = value;
  }

  static from<T>(value: Promise<T> | T): Promise<T> {
    if (value instanceof Promise) {
      return value;
    } else {
      return new FulfilledPromise<T>(value);
    }
  }

  static override get [Symbol.species]() {
    return Promise;
  }

  [Symbol.hasInstance](instance: unknown) {
    return (
      instance instanceof Promise &&
      "status" in instance &&
      instance.status === "fulfilled"
    );
  }
}
