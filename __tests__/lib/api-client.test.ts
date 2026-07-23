import { describe, it, expect } from "vitest";
import { ApiError } from "@/lib/api-client";

describe("ApiError", () => {
  it("is an instance of Error", () => {
    const err = new ApiError("Something went wrong", 500);
    expect(err).toBeInstanceOf(Error);
  });

  it("has name 'ApiError'", () => {
    const err = new ApiError("test", 400);
    expect(err.name).toBe("ApiError");
  });

  it("preserves the message", () => {
    const err = new ApiError("Not found", 404);
    expect(err.message).toBe("Not found");
  });

  it("stores the HTTP status code", () => {
    const err = new ApiError("Unauthorized", 401);
    expect(err.status).toBe(401);
  });

  it("stores an optional error code", () => {
    const err = new ApiError("Bad request", 400, "VALIDATION");
    expect(err.code).toBe("VALIDATION");
  });

  it("code is undefined when not provided", () => {
    const err = new ApiError("Server error", 500);
    expect(err.code).toBeUndefined();
  });

  it("handles status code 0 (network failure)", () => {
    const err = new ApiError("Network down", 0, "NETWORK_ERROR");
    expect(err.status).toBe(0);
    expect(err.code).toBe("NETWORK_ERROR");
  });

  it("handles status code 408 (timeout)", () => {
    const err = new ApiError("Timeout", 408, "REQUEST_TIMEOUT");
    expect(err.status).toBe(408);
    expect(err.code).toBe("REQUEST_TIMEOUT");
  });

  it("is catchable as an Error in try/catch", () => {
    let caught = false;
    try {
      throw new ApiError("fail", 500);
    } catch (e) {
      if (e instanceof Error) {
        caught = true;
        expect(e.message).toBe("fail");
      }
    }
    expect(caught).toBe(true);
  });

  it("is distinguishable from a plain Error via instanceof", () => {
    const apiErr = new ApiError("api", 400);
    const plainErr = new Error("plain");
    expect(apiErr).toBeInstanceOf(ApiError);
    expect(plainErr).not.toBeInstanceOf(ApiError);
  });
});
