export interface PasswordValidationRules {
  minLength: boolean;
  containsMixed: boolean;
  matchesConfirm: boolean;
}

export const validatePassword = (
  current: string,
  newPass: string,
  confirm: string
): PasswordValidationRules => {
  return {
    minLength: newPass.length >= 8,
    containsMixed: /[A-Za-z]/.test(newPass) && /[0-9]/.test(newPass),
    matchesConfirm: newPass.length > 0 && newPass === confirm
  };
};
