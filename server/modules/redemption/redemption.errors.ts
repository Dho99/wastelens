import type { RedemptionErrorCode } from "./redemption.types";

export class RedemptionError extends Error {
  public readonly errorCode: RedemptionErrorCode;
  public readonly statusCode: number;

  constructor(
    message: string,
    errorCode: RedemptionErrorCode,
    statusCode: number = 400,
  ) {
    super(message);
    this.name = "RedemptionError";
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}
