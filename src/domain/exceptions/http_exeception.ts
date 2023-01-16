export class HttpException extends Error {
  /**
   *@description Base HTTP exception
   */
  constructor(public readonly message: string, public readonly code: number) {
    super(message);
  }
}
