export class DataException extends Error {
  constructor(public readonly message: string, public readonly code: number) {
    super(message);
  }
}
