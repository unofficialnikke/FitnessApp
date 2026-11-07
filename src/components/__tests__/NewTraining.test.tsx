import React from 'react'
import { Alert, Pressable, Text, TextInput } from 'react-native'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { addDoc, arrayUnion, collection, doc, updateDoc } from 'firebase/firestore'
import NewTraining from '../NewTraining'
import { AppNavigation } from '../../types'

jest.mock('@rneui/themed', () => {
	const ReactModule = require('react')
	const {
		Pressable: NativePressable,
		Text: NativeText,
		TextInput: NativeTextInput,
	} = require('react-native')
	return {
		Chip: ({ title, onPress }: { title: string; onPress: () => void }) =>
			ReactModule.createElement(
				NativePressable,
				{ onPress, accessibilityRole: 'button' },
				ReactModule.createElement(NativeText, null, title),
			),
		Input: (props: { value: string; onChangeText: (value: string) => void; placeholder: string }) =>
			ReactModule.createElement(NativeTextInput, props),
		Text: NativeText,
	}
})

jest.mock('../../config/firebaseConfig', () => ({
	db: {},
	auth: { currentUser: { uid: 'user-1' } },
}))
jest.mock('firebase/firestore', () => ({
	addDoc: jest.fn(),
	arrayUnion: jest.fn((value) => ({ arrayUnion: value })),
	collection: jest.fn(() => 'training-list-collection'),
	doc: jest.fn(() => 'training-list-document'),
	updateDoc: jest.fn(),
}))

const addDocMock = addDoc as jest.Mock
const arrayUnionMock = arrayUnion as jest.Mock
const collectionMock = collection as jest.Mock
const docMock = doc as jest.Mock
const updateDocMock = updateDoc as jest.Mock

describe('NewTraining', () => {
	const navigation: AppNavigation = {
		navigate: jest.fn(),
		goBack: jest.fn(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
		addDocMock.mockResolvedValue({ id: 'list-123' })
		updateDocMock.mockResolvedValue(undefined)
		jest.spyOn(Alert, 'alert').mockImplementation(() => undefined)
	})

	afterEach(() => {
		jest.restoreAllMocks()
	})

	it('creates a list and adds a typed exercise to it', async () => {
		const screen = render(<NewTraining navigation={navigation} />)
		fireEvent.changeText(screen.getByPlaceholderText('Harjoituksen nimi'), 'Jalkatreeni')
		fireEvent.press(screen.getByText('Lisää harjoitus'))

		await waitFor(() => {
			expect(addDocMock).toHaveBeenCalledWith('training-list-collection', {
				name: 'Jalkatreeni',
				userId: 'user-1',
				trainings: [],
			})
		})

		fireEvent.changeText(screen.getByPlaceholderText('liikkeen nimi..'), 'Kyykky')
		fireEvent.changeText(screen.getByPlaceholderText('painot (kg)..'), '60')
		fireEvent.changeText(screen.getByPlaceholderText('sarjan pituus..'), '8')
		fireEvent.changeText(screen.getByPlaceholderText('sarjojen määrä..'), '3')
		fireEvent.press(screen.getByText('Lisää liike'))

		await waitFor(() => {
			expect(docMock).toHaveBeenCalledWith({}, 'trainingList', 'list-123')
			expect(arrayUnionMock).toHaveBeenCalledWith({
				trainingName: 'Kyykky',
				weight: '60',
				repetitions: '8',
				amount: '3',
			})
			expect(updateDocMock).toHaveBeenCalledWith('training-list-document', {
				trainings: {
					arrayUnion: {
						trainingName: 'Kyykky',
						weight: '60',
						repetitions: '8',
						amount: '3',
					},
				},
			})
		})
	})

	it('does not create a list for a blank or placeholder name', () => {
		const screen = render(<NewTraining navigation={navigation} />)
		fireEvent.changeText(screen.getByPlaceholderText('Harjoituksen nimi'), ' TYHJÄ ')
		fireEvent.press(screen.getByText('Lisää harjoitus'))

		expect(Alert.alert).toHaveBeenCalledWith('Virhe', 'Harjoituksen nimi ei voi olla tyhjä')
		expect(collectionMock).not.toHaveBeenCalled()
	})
})
