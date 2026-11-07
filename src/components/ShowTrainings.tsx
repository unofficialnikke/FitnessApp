import * as React from 'react'
import { useEffect, useState } from 'react'
import { Alert, ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { ListItem, Icon } from '@rneui/themed'
import { db, auth } from '../config/firebaseConfig'
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { styles } from '../styles/ShowTrainingsStyle'
import { AppNavigation, TrainingList, TrainingExercise } from '../types'

type ShowTrainingsProps = {
	navigation: AppNavigation
}

export default function ShowTrainings({ navigation }: ShowTrainingsProps) {
	const [expandedId, setExpandedId] = useState<string | null>(null)
	const [trainingList, setTrainingList] = useState<TrainingList[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [selectedTrainingListId, setSelectedTrainingListId] = useState<string | null>(null)

	const deleteTrainingList = async (trainingListId: string) => {
		try {
			if (!trainingListId) {
				console.log('Error deleting training list: no ID provided')
				return
			}
			const docRef = doc(db, 'trainingList', trainingListId)
			await deleteDoc(docRef)
		} catch (error) {
			console.log('Error deleting training list: ', error)
		}
	}

	const editTrainingList = async (trainingListId: string) => {
		setSelectedTrainingListId(trainingListId)
		navigation.navigate('EditTrainingList', trainingListId)
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
			setLoading(false)
		})
		return () => {
			unsubscribe()
		}
	}, [])

	const renderTrainingList = () => {
		if (loading) {
			return (
				<View style={styles.placement}>
					<ActivityIndicator size='large' color='orange' />
				</View>
			)
		}
		if (trainingList.length === 0) {
			return (
				<View style={styles.placement}>
					<Text style={{ fontSize: 24 }}>Ei lisättyjä harjoituksia</Text>
				</View>
			)
		}

		return (
			<ScrollView>
				{trainingList.map((item) => (
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
											`Haluatko varmasti poistaa harjoituksen ${item.name}?`,
											[
												{ text: 'Peruuta', style: 'cancel' },
												{
													text: 'Ok',
													onPress: () => deleteTrainingList(item.id),
													style: 'destructive',
												},
											],
											{ cancelable: true },
										)
									}}
								/>
								<Icon
									type='ionicon'
									name='create'
									color='green'
									size={40}
									onPress={() => {
										editTrainingList(item.id)
									}}
								/>
								<ListItem.Content>
									<ListItem.Title style={{ fontSize: 24 }}>{item.name}</ListItem.Title>
								</ListItem.Content>
							</>
						}
						isExpanded={expandedId === item.id}
						onPress={() => {
							setExpandedId(expandedId === item.id ? null : item.id)
						}}
					>
						{item.trainings.map((training: TrainingExercise, key: number) => (
							<ListItem key={key}>
								<ListItem.Content>
									<ListItem.Title style={{ fontSize: 20 }}>{training.trainingName}</ListItem.Title>
									<ListItem.Subtitle style={{ fontSize: 18 }}>
										Painot: {training.weight}, Toistot: {training.repetitions}, Määrä:{' '}
										{training.amount}
									</ListItem.Subtitle>
								</ListItem.Content>
							</ListItem>
						))}
					</ListItem.Accordion>
				))}
			</ScrollView>
		)
	}

	return <>{renderTrainingList()}</>
}
