/**
 * @fileOverview universal payload format.
 * @author PlatCorp
 * @version 1.0.0
 */

export class ResultPayload<T> {
    public data: T | Error;
    public status: number;
    constructor(data: T | Error, status: number) {
      this.data = data;
      this.status = status;
    }
    public isError() {
      return this.data instanceof Error;
    }
  
    public getError() {
      return this.isError() ? (this.data as Error) : undefined;
    }
  
    public getPayload() {
      return this.isError() ? undefined : (this.data as T);
    }
    public getResult(): {
      payload: T | undefined;
      message?: string;
    } {
      if (this.isError()) {
        const { message } = this.getError() as Error;
        return { payload: this.getPayload(), message };
      } else {
        return { payload: this.getPayload() };
      }
    }
  }