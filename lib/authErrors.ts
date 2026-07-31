import { CredentialsSignin } from "@auth/core/errors";

/**
 * Custom CredentialsSignin subclasses.
 *
 * NextAuth v5 beta.30 exposes the `code` property on the client via
 * `result.code` when using `signIn(..., { redirect: false })`.
 * Plain `throw new Error("...")` messages are NOT forwarded — only the
 * generic type string "CredentialsSignin" reaches the client.
 *
 * These subclasses carry distinguishable `code` values so the signin
 * page can branch on `result.code` instead of `result.error`.
 */

export class EmailNotVerifiedError extends CredentialsSignin {
  code = "EMAIL_NOT_VERIFIED";
}

export class TooManyAttemptsError extends CredentialsSignin {
  code = "TOO_MANY_ATTEMPTS";
}
