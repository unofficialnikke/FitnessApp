import { Chip, Dialog } from '@rneui/themed'
import * as React from 'react'
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native'
import { styles } from '../styles/FrontpageStyle'
import { db, auth } from '../config/firebaseConfig'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Divider } from 'react-native-paper'
import { ActivityItem, AppNavigation, TrainingExercise } from '../types'

type FrontpageProps = {
	navigation: AppNavigation
}

export default function Frontpage({ navigation }: FrontpageProps) {
	const [activityList, setActivityList] = useState<ActivityItem[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [isOpen, setIsOpen] = useState<number>(-1)

	const months = [
		'tammikuu',
		'helmikuu',
		'maaliskuu',
		'huhtikuu',
		'toukokuu',
		'kesäkuu',
		'heinäkuu',
		'elokuu',
		'syyskuu',
		'lokakuu',
		'marraskuu',
		'joulukuu',
	]
	const d = new Date()

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
			setLoading(false)
		})
		return () => {
			unsubscribe()
		}
	}, [])

	const toggleDialog = (index: number) => {
		setIsOpen((currentIndex) => (currentIndex === index ? -1 : index))
	}

	const renderActivity = () => {
		const todayActivities = activityList
			.filter((item) => item.date === new Date().toLocaleDateString())
			.slice(0, 7)

		if (loading) {
			return (
				<View style={styles.placement}>
					<ActivityIndicator size='large' color='orange' />
				</View>
			)
		}

		if (todayActivities.length > 0) {
			let firstItem = true
			return todayActivities.map((item, index) => (
				<View key={item.id ?? index}>
					{firstItem && <Text style={styles.trainingText}>Päivän harjoitus/harjoitukset:</Text>}
					<TouchableOpacity onPress={() => toggleDialog(index)}>
						<Text style={styles.trainingItem}>{item.title}</Text>
					</TouchableOpacity>
					{isOpen !== index ? null : (
						<View>
							<Dialog isVisible={true} onBackdropPress={() => setIsOpen(-1)}>
								<Dialog.Title title={item.title} />
								<Text style={{ fontSize: 18, marginBottom: 10 }}>{item.date}</Text>
								{item.training.map((itemGroup) =>
									itemGroup.trainings.map((training: TrainingExercise, key: number) => (
										<View key={`${item.id}-${training.trainingName}-${key}`}>
											<Text style={styles.dialogText}>{training.trainingName}</Text>
											<View style={{ flexDirection: 'row' }}>
												<Text style={styles.dialogText2}>
													Painot: {training.weight}, Toistot: {training.repetitions}, Määrä:{' '}
													{training.amount}
												</Text>
											</View>
											<Divider style={{ marginTop: 7, marginBottom: 7 }} />
										</View>
									)),
								)}
							</Dialog>
						</View>
					)}
					{(firstItem = false)}
				</View>
			))
		}

		return (
			<View>
				<Text style={styles.trainingText}>Ei harjotuksia tänään</Text>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<View style={styles.dateContainer}>
				<Text
					style={styles.homeText}
				>{`Tänään: ${d.getDate()}. ${months[d.getMonth()]}ta ${d.getFullYear()}`}</Text>
				<View style={styles.todaysActivity}>{renderActivity()}</View>
			</View>
			<View>
				<Text style={styles.bottomText}>Liikkeet ja harjoitukset:</Text>
			</View>
			<View style={styles.chipView}>
				<Chip
					title='Lisää kalenteriin'
					type='solid'
					size='lg'
					color='orange'
					icon={{
						name: 'calendar',
						color: 'white',
						type: 'ionicon',
					}}
					onPress={() => {
						navigation.navigate('NewActivity')
					}}
				/>
				<View style={{ height: 30 }} />
				<Chip
					title='Uusi harjoitus'
					type='solid'
					size='lg'
					color='orange'
					icon={{
						name: 'add',
						color: 'white',
					}}
					onPress={() => {
						navigation.navigate('NewTraining')
					}}
				/>
				<View style={{ height: 30 }} />
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
			</View>
		</View>
	)
}
