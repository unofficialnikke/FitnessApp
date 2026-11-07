import React from 'react'
import { Alert, Pressable, Text, TextInput } from 'react-native'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import RegistrationPage from '../RegigstrationPage'
import { AppNavigation } from '../../types'

jest.mock('@rneui/themed', () => {
	const ReactModule = require('react')
	const { Pressable: NativePressable, Text: NativeText, TextInput: NativeTextInput } = require('react-native')
	return {
		Chip: ({ title, onPress }: { title: string; onPress: () => void }) =>
			ReactModule.createElement(
				NativePressable,
				{ onPress, accessibilityRole: 'button' },
				ReactModule.createElement(NativeText, null, title),
			),
		Input: (props: {
			value: string
			onChangeText: (value: string) => void
			placeholder: string
			secureTextEntry?: boolean
		}) => ReactModule.createElement(NativeTextInput, props),
		Text: NativeText,
	}
})

jest.mock('../../config/firebaseConfig', () => ({ auth: {} }))
jest.mock('firebase/auth', () => ({ createUserWithEmailAndPassword: jest.fn() }))

const createUserMock = createUserWithEmailAndPassword as jest.Mock

describe('RegistrationPage', () => {
	const navigation: AppNavigation = {
		navigate: jest.fn(),
		goBack: jest.fn(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
		createUserMock.mockResolvedValue({})
		jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('does not create an account when passwords do not match', async () => {
		const screen = render(<RegistrationPage navigation={navigation} />)
		fireEvent.changeText(screen.getByPlaceholderText('sähköposti..'), 'person@example.com')
		fireEvent.changeText(screen.getByPlaceholderText('salasana..'), 'password1')
		fireEvent.changeText(screen.getByPlaceholderText('salasana uudelleen..'), 'different1')
		fireEvent.press(screen.getByText('Luo käyttäjätunnus'))

		expect(Alert.alert).toHaveBeenCalledWith('Virhe', 'Salasanat eivät täsmää')
		expect(createUserMock).not.toHaveBeenCalled()
	})

	it('creates an account and navigates to login for valid registration details', async () => {
		const screen = render(<RegistrationPage navigation={navigation} />)
		fireEvent.changeText(screen.getByPlaceholderText('sähköposti..'), 'person@example.com')
		fireEvent.changeText(screen.getByPlaceholderText('salasana..'), 'password1')
		fireEvent.changeText(screen.getByPlaceholderText('salasana uudelleen..'), 'password1')
		fireEvent.press(screen.getByText('Luo käyttäjätunnus'))

		await waitFor(() => {
			expect(createUserMock).toHaveBeenCalledWith({}, 'person@example.com', 'password1')
		})
		expect(navigation.navigate).toHaveBeenCalledWith('LoginPage')
	})
})