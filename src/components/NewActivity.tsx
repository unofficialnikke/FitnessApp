import * as React from 'react'
import { View, Text, Platform, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { Chip } from '@rneui/themed'
import { styles } from '../styles/NewActivityStyle'
import { db, auth } from '../config/firebaseConfig'
import { addDoc, collection, onSnapshot, query, where } from 'firebase/firestore'
import { Picker } from '@react-native-picker/picker'
import DatePicker from '@react-native-community/datetimepicker'
import { AppNavigation, TrainingList } from '../types'

type NewActivityProps = {
	navigation: AppNavigation
}

export default function NewActivity({ navigation }: NewActivityProps) {
	const [trainingList, setTrainingList] = useState<TrainingList[]>([])
	const [date, setDate] = useState<Date>(new Date())
	const [today] = useState<Date>(new Date())
	const [mode, setMode] = useState<'date' | 'time'>('date')
	const [show, setShow] = useState<boolean>(false)
	const [selectedTraining, setSelectedTraining] = useState<TrainingList | null>(null)

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

	const showDatepicker = () => {
		setShow(true)
	}

	const changeDate = (_event: unknown, currentDate?: Date) => {
		setShow(false)
		setMode('date')
		if (currentDate) {
			setDate(currentDate)
		}
	}

	const addActivity = async () => {
		if (selectedTraining === null) {
			Alert.alert('Virhe', 'Valitse ensin harjoitus')
			return
		}
		try {
			await addDoc(collection(db, 'activityList'), {
				date: date.toLocaleDateString(),
				title: selectedTraining.name,
				userId: auth.currentUser?.uid,
				training: [selectedTraining],
			})
			Alert.alert('Onnistui', 'Harjoitus lisätty kalenteriin!')
		} catch (error) {
			console.error('Error adding new activity', error)
		}
		setSelectedTraining(null)
		setDate(new Date())
	}

	return (
		<View style={styles.container}>
			<View style={{ marginBottom: 30 }}>
				<Chip
					size='lg'
					type='solid'
					color='#414141'
					title='Kalenteriin lisätyt harjoitukset'
					icon={{
						name: 'list-outline',
						color: 'white',
						type: 'ionicon',
					}}
					onPress={() => {
						navigation.navigate('ShowActivities')
					}}
				/>
			</View>
			<Text style={styles.activity}>Lisää uusi aktiviteetti:</Text>
			<View style={styles.dateText}>
				<Text style={styles.date}>Valittu päivämäärä: {date.toLocaleDateString()}</Text>
			</View>
			<View style={styles.innerContainer}>
				<Chip
					onPress={showDatepicker}
					title='Päivämäärä'
					icon={{
						name: 'calendar',
						color: 'white',
						type: 'ionicon',
					}}
					color='orange'
				/>
			</View>
			{show && (
				<DatePicker
					testID='dateTimePicker'
					minimumDate={today}
					value={date}
					mode='date'
					is24Hour={true}
					onChange={changeDate}
					accentColor='#414141'
				/>
			)}
			<View style={styles.innerContainer}>
				<Picker
					selectedValue={selectedTraining?.name ?? ''}
					onValueChange={(value: string) => {
						const selected = trainingList.find((item) => item.name === value)
						if (selected) {
							setSelectedTraining(selected)
						}
					}}
					prompt='Harjoitukset'
				>
					<Picker.Item label='Valitse harjoitus' color='grey' value='' />
					{trainingList.map((item, key) => (
						<Picker.Item label={item.name} value={item.name} key={key} />
					))}
				</Picker>
			</View>
			<View>
				<Chip
					title='Lisää harjoitus kalenteriin'
					size='lg'
					type='solid'
					color='orange'
					icon={{
						name: 'add',
						color: 'white',
					}}
					onPress={() => {
						addActivity()
					}}
				/>
			</View>
		</View>
	)
}
