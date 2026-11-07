import { getRegistrationValidationError, isValidTrainingName } from '../validation'

describe('getRegistrationValidationError', () => {
	it('reports mismatched passwords before checking other fields', () => {
		expect(getRegistrationValidationError('bad-email', 'password1', 'password2')).toBe(
			'password-mismatch',
		)
	})

	it('rejects passwords shorter than seven characters', () => {
		expect(getRegistrationValidationError('person@example.com', 'short', 'short')).toBe(
			'password-too-short',
		)
	})

	it('rejects malformed email addresses', () => {
		expect(getRegistrationValidationError('not-an-email', 'password1', 'password1')).toBe(
			'invalid-email',
		)
	})

	it('accepts a valid email and matching password of sufficient length', () => {
		expect(
			getRegistrationValidationError('person@example.com', 'password1', 'password1'),
		).toBeNull()
	})
})

describe('isValidTrainingName', () => {
	it.each(['', '   ', 'tyhjä', ' TYHJÄ '])('rejects the empty/placeholder name %j', (name) => {
		expect(isValidTrainingName(name)).toBe(false)
	})

	it('accepts a meaningful name, allowing surrounding whitespace', () => {
		expect(isValidTrainingName('  Jalkatreeni  ')).toBe(true)
	})
})