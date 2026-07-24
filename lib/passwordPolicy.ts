const PASSWORD_PATTERN = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,128}$)/;

export function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && PASSWORD_PATTERN.test(password);
}

export const passwordPolicyMessage =
  "Password must be 8-128 characters and contain at least one number and one symbol (!@#$%^&*).";
