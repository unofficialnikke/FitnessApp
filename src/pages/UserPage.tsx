import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { styles } from '../styles/UserPageStyle'
import {
	signOut,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from 'firebase/auth'
import { Chip, Input, Text } from '@rneui/themed'
import { db, auth } from '../config/firebaseConfig'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { ActivityItem, AppNavigation, TrainingList } from '../types'

type UserPageProps = {
	navigation: AppNavigation
}

export default function UserPage({ navigation }: UserPageProps) {
	const [trainingList, setTrainingList] = useState<TrainingList[]>([])
	const [activityList, setActivityList] = useState<ActivityItem[]>([])
	const [password, setPassword] = useState<string>('')
	const [newPassword, setNewPassword] = useState<string>('')
	const [passwordConfirm, setPasswordConfirm] = useState<string>('')

	const reauthenticate = (currentPassword: string) => {
		const user = auth.currentUser
		if (user?.email) {
			const credential = EmailAuthProvider.credential(user.email, currentPassword)
			return reauthenticateWithCredential(user, credential)
		}
		return undefined
	}

	const signOutUser = async () => {
		await signOut(auth)
		navigation.navigate('LoginPage')
		Alert.alert('Kirjautunut ulos', 'Olet kirjautunut ulos')
	}

	const changePassword = async () => {
		if (newPassword !== passwordConfirm) {
			Alert.alert('Virhe', 'Salasanat eivät täsmää')
			return
		}
		if (newPassword.length < 7) {
			Alert.alert('Virhe', 'Salasana on liian lyhyt')
			return
		}
		try {
			if (auth.currentUser) {
				await reauthenticate(password)
				await updatePassword(auth.currentUser, newPassword)
				console.log('Password updated succesfully')
				setPassword('')
				setNewPassword('')
				setPasswordConfirm('')
				Alert.alert('Onnistui', 'Salasanasi on päivitetty!')
			}
		} catch (error) {
			console.error('Error changing password ', error)
		}
	}

	useEffect(() => {
		const q = query(collection(db, 'trainingList'), where('userId', '==', auth.currentUser?.uid))
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const trainingListData = snapshot.docs.map((currentDoc) => {
				const data = currentDoc.data() as Partial<TrainingList>
				return {
					id: currentDoc.id,
					name: data.name ?? '',
					userId: data.userId,
					trainings: data.trainings ?? [],
				} satisfies TrainingList
			})
			setTrainingList(trainingListData)
		})
		return () => {
			unsubscribe()
		}
	}, [])

	useEffect(() => {
		const q = query(collection(db, 'activityList'), where('userId', '==', auth.currentUser?.uid))
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const activityListData = snapshot.docs.map((currentDoc) => {
				const data = currentDoc.data() as Partial<ActivityItem>
				return {
					id: currentDoc.id,
					date: data.date ?? '',
					title: data.title ?? '',
					userId: data.userId,
					training: data.training ?? [],
				} satisfies ActivityItem
			})
			setActivityList(activityListData)
		})
		return () => {
			unsubscribe()
		}
	}, [])

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<View>
				<Text style={styles.bottomText}>Lisättyjä harjoituksia: {trainingList.length}</Text>
				<Text style={styles.bottomText}>Kalenterissa: {activityList.length}</Text>
			</View>
			<View style={styles.innerContainer}>
				<Text style={styles.passwordText}>Vaihda salasanasi:</Text>
				<Text style={styles.passwordInfo}>
					Salasanan on oltava vähintään seitsemän merkkiä pitkä
				</Text>
				<Input
					placeholder='nykyinen salasana..'
					value={password}
					autoCapitalize='none'
					style={{ textAlign: 'center' }}
					onChangeText={(value) => {
						setPassword(value)
					}}
					secureTextEntry={true}
				/>

				<Input
					placeholder='salasana..'
					value={newPassword}
					autoCapitalize='none'
					style={{ textAlign: 'center' }}
					onChangeText={(value) => {
						setNewPassword(value)
					}}
					secureTextEntry={true}
				/>
				<Input
					placeholder='salasana uudelleen..'
					value={passwordConfirm}
					autoCapitalize='none'
					style={{ textAlign: 'center' }}
					onChangeText={(value) => {
						setPasswordConfirm(value)
					}}
					secureTextEntry={true}
				/>
				<View style={{ height: 10 }} />
				<Chip
					title='Vaihda salasana'
					size='lg'
					type='solid'
					color='orange'
					onPress={() => {
						changePassword()
					}}
				/>
				<View style={{ marginTop: 50 }} />
				<Chip
					title='Kirjaudu ulos'
					size='lg'
					type='solid'
					color='#414141'
					onPress={() => {
						Alert.alert('Varoitus', 'Haluatko kirjautua ulos?', [
							{ text: 'Ei', style: 'cancel' },
							{
								text: 'Kyllä',
								onPress: () => signOutUser(),
								style: 'destructive',
							},
						])
					}}
					icon={{
						name: 'exit-outline',
						color: 'white',
						type: 'ionicon',
					}}
				/>
			</View>
		</KeyboardAvoidingView>
	)
}
