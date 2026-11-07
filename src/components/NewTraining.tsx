import * as React from 'react'
import { View, Text, Alert } from 'react-native'
import { Input, Chip } from '@rneui/themed'
import { useState } from 'react'
import { styles } from '../styles/NewTrainingStyle'
import { collection, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore'
import { db, auth } from '../config/firebaseConfig'
import { AppNavigation, TrainingExercise } from '../types'
import { isValidTrainingName } from '../utils/validation'

type NewTrainingProps = {
	navigation: AppNavigation
}

export default function NewTraining({ navigation }: NewTrainingProps) {
	const [trainingListName, setTrainingListName] = useState<string>('')
	const [trainingName, setTrainingName] = useState<string>('')
	const [weight, setWeight] = useState<string>('')
	const [repetitions, setRepetitions] = useState<string>('')
	const [amount, setAmount] = useState<string>('')
	const [trainingListId, setTrainingListId] = useState<string>('')
	const [visible, setVisible] = useState<boolean>(false)

	const addTraining = async () => {
		if (!isValidTrainingName(trainingName)) {
			Alert.alert('Virhe', 'Liikkeen nimi ei voi olla tyhjä')
			return
		}
		if (trainingListId === '') {
			Alert.alert('Virhe', 'Lisää ensin harjoitukselle nimi')
			return
		}

		try {
			const newTraining: TrainingExercise = {
				trainingName,
				weight,
				repetitions,
				amount,
			}
			await updateDoc(doc(db, 'trainingList', trainingListId), {
				trainings: arrayUnion(newTraining),
			})
		} catch (error) {
			console.error('Error adding training: ', error)
		}
		setTrainingName('')
		setWeight('')
		setRepetitions('')
		setAmount('')
	}

	const addTrainingList = async () => {
		if (!isValidTrainingName(trainingListName)) {
			Alert.alert('Virhe', 'Harjoituksen nimi ei voi olla tyhjä')
			return
		}
		try {
			const ref = await addDoc(collection(db, 'trainingList'), {
				name: trainingListName,
				userId: auth.currentUser?.uid,
				trainings: [],
			})
			setTrainingListId(ref.id)
			Alert.alert(
				'Onnistui!',
				'Harjoituslista lisätty onnistuneesti. Lisää seuraavaksi liikkeet harjoitukselle. Lopuksi paina Valmis',
			)
		} catch (error) {
			console.error('Error adding training list: ', error)
		}
		setTrainingListName('')
		setVisible(true)
	}

	const finishAdding = () => {
		setVisible(false)
		setTrainingListId('')
	}

	return (
		<View style={styles.container}>
			<Chip
				size='lg'
				type='solid'
				color='#414141'
				title='Harjoituksesi'
				icon={{
					name: 'list-outline',
					color: 'white',
					type: 'ionicon',
				}}
				onPress={() => {
					navigation.navigate('ShowTrainings')
				}}
			/>
			<Text style={styles.newTrainingText}>Anna harjoitukselle nimi:</Text>
			<View style={{ width: '75%' }}>
				<Input
					style={styles.input}
					placeholder='Harjoituksen nimi'
					value={trainingListName}
					onChangeText={(value) => {
						setTrainingListName(value)
					}}
				/>
			</View>
			<Chip
				title='Lisää harjoitus'
				size='lg'
				type='solid'
				color='orange'
				icon={{
					name: 'add',
					color: 'white',
				}}
				onPress={() => {
					addTrainingList()
				}}
			/>
			{visible && (
				<View style={styles.innerContainer}>
					<Text style={styles.moves}>Lisää liikkeet:</Text>
					<View style={{ width: '75%' }}>
						<Input
							style={styles.input}
							placeholder='liikkeen nimi..'
							value={trainingName}
							onChangeText={(value) => {
								setTrainingName(value)
							}}
						/>
						<Input
							style={styles.input}
							placeholder='painot (kg)..'
							value={weight}
							keyboardType='numeric'
							onChangeText={(value) => {
								setWeight(value)
							}}
						/>
						<Input
							style={styles.input}
							placeholder='sarjan pituus..'
							value={repetitions}
							keyboardType='numeric'
							onChangeText={(value) => {
								setRepetitions(value)
							}}
						/>
						<Input
							style={styles.input}
							placeholder='sarjojen määrä..'
							value={amount}
							keyboardType='numeric'
							onChangeText={(value) => {
								setAmount(value)
							}}
						/>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<Chip
							title='Lisää liike'
							size='lg'
							type='solid'
							color='orange'
							icon={{
								name: 'add',
								color: 'white',
							}}
							onPress={() => {
								addTraining()
							}}
						/>
						<View style={styles.spacer} />
						<Chip
							title='Valmis'
							size='lg'
							type='solid'
							color='orange'
							icon={{
								name: 'done',
								color: 'white',
							}}
							onPress={() => {
								Alert.alert(
									'Varoitus',
									'Oletko lisännyt kaikki liikkeet harjoitukselle?',
									[
										{ text: 'En', style: 'cancel' },
										{
											text: 'Kyllä',
											onPress: () => finishAdding(),
											style: 'destructive',
										},
									],
									{ cancelable: true },
								)
							}}
						/>
					</View>
				</View>
			)}
		</View>
	)
}
