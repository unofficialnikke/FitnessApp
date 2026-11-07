import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { styles } from '../styles/CalendarStyle'
import React, { useEffect, useState } from 'react'
import { Calendar } from 'react-native-calendars'
import { collection, onSnapshot, query, deleteDoc, doc, where } from 'firebase/firestore'
import { db, auth } from '../config/firebaseConfig'
import LocaleConfig from '../config/localeConfig'
import { Icon, ListItem } from '@rneui/themed'
import { ActivityItem, TrainingExercise } from '../types'

export default function TrainingCalendar() {
	const [selected, setSelected] = useState<string>('')
	const [activityList, setActivityList] = useState<ActivityItem[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [expandedId, setExpandedId] = useState<string | null>(null)

	LocaleConfig.defaultLocale = 'fi'

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

	const deleteActivity = async (activityListId: string) => {
		try {
			if (!activityListId) {
				console.log('Error deleting activity: no ID provided')
				return
			}
			const docRef = doc(db, 'activityList', activityListId)
			await deleteDoc(docRef)
		} catch (error) {
			console.log('Error deleting activity: ', error)
		}
	}

	const renderActivityList = () => {
		if (loading) {
			return (
				<View style={styles.placement}>
					<ActivityIndicator size='large' color='orange' />
				</View>
			)
		}
		if (activityList.length === 0) {
			return (
				<View style={styles.placement}>
					<Text style={{ fontSize: 24 }}>Ei lisättyjä aktiviteettejä</Text>
				</View>
			)
		}

		return (
			<ScrollView>
				{activityList.map((item) => (
					<ListItem.Accordion
						key={item.id}
						bottomDivider
						content={
							<>
								<Icon
									name='delete'
									color='#de2a2a'
									size={40}
									onPress={() => {
										Alert.alert(
											'Varoitus',
											`Haluatko varmasti poistaa harjoituksen ${item.title} päivältä ${item.date}?`,
											[
												{ text: 'Peruuta', style: 'cancel' },
												{
													text: 'Ok',
													onPress: () => deleteActivity(item.id),
													style: 'destructive',
												},
											],
											{ cancelable: true },
										)
									}}
								/>
								<ListItem.Content>
									<ListItem.Title style={styles.title}>{item.title}</ListItem.Title>
									<ListItem.Title style={{ fontSize: 20 }}>{item.date}</ListItem.Title>
								</ListItem.Content>
							</>
						}
						isExpanded={expandedId === item.id}
						onPress={() => {
							setExpandedId(expandedId === item.id ? null : item.id)
						}}
					>
						{item.training.map((trainingList, key) => (
							<ListItem key={key}>
								<ListItem.Content>
									{trainingList.trainings.map((training: TrainingExercise, trainingKey: number) => (
										<ListItem key={trainingKey}>
											<View style={{ width: '100%' }}>
												<ListItem.Title style={{ fontSize: 20 }}>
													{training.trainingName}:
												</ListItem.Title>
												<ListItem.Subtitle style={{ fontSize: 18 }}>
													Painot: {training.weight}, Toistot: {training.repetitions}, Määrä:{' '}
													{training.amount}
												</ListItem.Subtitle>
											</View>
										</ListItem>
									))}
								</ListItem.Content>
							</ListItem>
						))}
					</ListItem.Accordion>
				))}
			</ScrollView>
		)
	}

	return (
		<View style={styles.container}>
			<Calendar
				style={{
					borderBottomWidth: 2,
					borderBottomColor: '#b0adac',
				}}
				theme={{
					backgroundColor: '#ffffff',
					calendarBackground: '#ffffff',
					textSectionTitleColor: 'black',
					selectedDayBackgroundColor: 'orange',
					selectedDayTextColor: '#ffffff',
					todayTextColor: '#ffffff',
					dayTextColor: 'black',
					todayBackgroundColor: '#414141',
					textDisabledColor: '#bdbdbd',
					dotColor: 'orange',
					monthTextColor: '#414141',
					textMonthFontSize: 22,
					arrowColor: 'orange',
				}}
				onDayPress={(day) => {
					setSelected(day.dateString)
				}}
				markedDates={{
					[selected]: { selected: true, disableTouchEvent: true, selectedColor: 'orange' },
				}}
			/>
			{renderActivityList()}
		</View>
	)
}
