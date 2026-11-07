import { Chip, Input, Text } from '@rneui/themed'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native'
import { auth } from '../config/firebaseConfig'
import { styles } from '../styles/LoginStyle'
import { AppNavigation } from '../types'
import { getRegistrationValidationError } from '../utils/validation'

type RegistrationPageProps = {
	navigation: AppNavigation
}

export default function RegistrationPage({ navigation }: RegistrationPageProps) {
	const [email, setEmail] = useState<string>('')
	const [password, setPassword] = useState<string>('')
	const [passwordConfirm, setPasswordConfirm] = useState<string>('')

	const handleCreateUser = async () => {
		const validationError = getRegistrationValidationError(email, password, passwordConfirm)
		if (validationError) {
			const messages = {
				'password-mismatch': 'Salasanat eivät täsmää',
				'password-too-short': 'Salasana on liian lyhyt',
				'invalid-email': 'Sähköposti ei kelpaa',
			}
			Alert.alert('Virhe', messages[validationError])
			return
		}
		try {
			await createUserWithEmailAndPassword(auth, email, password)
			navigation.navigate('LoginPage')
			Alert.alert('Onnistui', 'Rekisteröinti onnistui! Voit nyt kirjautua sisään')
		} catch (error) {
			console.error('Registration failed', error)
		}
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<Text style={styles.loginText}>Rekisteröidy käyttäjäksi FitnessAppiin</Text>
			<View style={styles.innerContainer}>
				<Input
					style={styles.input}
					placeholder='sähköposti..'
					keyboardType='email-address'
					autoCapitalize='none'
					value={email}
					onChangeText={(value) => {
						setEmail(value)
					}}
				/>
				<Text style={styles.passwordText}>
					Salasanan on oltava vähintään seitsemän merkkiä pitkä
				</Text>
				<Input
					style={styles.input}
					placeholder='salasana..'
					autoCapitalize='none'
					value={password}
					onChangeText={(value) => {
						setPassword(value)
					}}
					secureTextEntry={true}
				/>
				<Input
					style={styles.input}
					placeholder='salasana uudelleen..'
					autoCapitalize='none'
					value={passwordConfirm}
					onChangeText={(value) => {
						setPasswordConfirm(value)
					}}
					secureTextEntry={true}
				/>
			</View>
			<Chip
				title='Luo käyttäjätunnus'
				onPress={() => {
					handleCreateUser()
				}}
				size='lg'
				type='solid'
				color='#414141'
				icon={{
					name: 'person-add',
					color: 'white',
					type: 'ionicon',
				}}
			/>
		</KeyboardAvoidingView>
	)
}
