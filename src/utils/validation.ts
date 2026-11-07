import emailValidator from 'email-validator'

export type RegistrationValidationError =
	| 'password-mismatch'
	| 'password-too-short'
	| 'invalid-email'

export function getRegistrationValidationError(
	email: string,
	password: string,
	passwordConfirmation: string,
): RegistrationValidationError | null {
	if (password !== passwordConfirmation) {
		return 'password-mismatch'
	}
	if (password.length < 7) {
		return 'password-too-short'
	}
	if (!emailValidator.validate(email)) {
		return 'invalid-email'
	}
	return null
}

export function isValidTrainingName(name: string): boolean {
	const normalizedName = name.trim().toLocaleLowerCase()
	return normalizedName.length > 0 && normalizedName !== 'tyhjä'
}