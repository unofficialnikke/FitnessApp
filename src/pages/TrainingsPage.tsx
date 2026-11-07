import { View, Text, ScrollView, Image, Alert } from 'react-native'
import { styles } from '../styles/TrainingsStyle'
import { useState } from 'react'
import { Chip, ListItem } from '@rneui/themed'
import { Picker } from '@react-native-picker/picker'
import config from '../config/apiConfig'
import { ExerciseApiItem } from '../types'

export default function Trainings() {
	const [muscle, setMuscle] = useState<string>('')
	const [results, setResults] = useState<ExerciseApiItem[]>([])
	const [expandedId, setExpandedId] = useState<number | null>(null)

	const requestOptions: RequestInit = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': config.API_KEY,
			'X-RapidAPI-Host': config.API,
		},
	}

	const getTrainings = async () => {
		if (muscle) {
			try {
				const response = await fetch(`${config.API_URL}${muscle}`, requestOptions)
				const data = (await response.json()) as ExerciseApiItem[]
				setResults(data)
			} catch (err) {
				console.log('Error getting trainings ', err)
			}
		} else {
			Alert.alert('Virhe', 'Valitse ensin kehon osa valikosta')
		}
	}

	return (
		<ScrollView style={{ width: '100%' }}>
			<Text style={styles.chooseTrainingText}>Valitse kehon osa, jota haluat treenata:</Text>
			<Picker
				selectedValue={muscle}
				onValueChange={(value) => setMuscle(String(value))}
				prompt='Kehon osat'
			>
				<Picker.Item label='Valitse kehon osa' color='grey' value='' />
				<Picker.Item label='Aerobinen' value='cardio' />
				<Picker.Item label='Alaraajat' value='lower legs' />
				<Picker.Item label='Käsien alavarret' value='lower arms' />
				<Picker.Item label='Niska' value='neck' />
				<Picker.Item label='Olkapäät' value='shoulders' />
				<Picker.Item label='Olkavarret' value='upper arms' />
				<Picker.Item label='Rinta' value='chest' />
				<Picker.Item label='Selkä' value='back' />
				<Picker.Item label='Vyötärö' value='waist' />
				<Picker.Item label='Yläjalat' value='upper legs' />
			</Picker>
			<View>
				<Chip
					size='lg'
					type='solid'
					color='#414141'
					title='Hae harjoitukset'
					onPress={() => {
						getTrainings()
					}}
				/>
			</View>
			<View>
				{results.slice(0, 50).map((item, key) => (
					<ListItem.Accordion
						key={key}
						bottomDivider
						content={
							<>
								<ListItem.Content>
									<ListItem.Title style={styles.itemName}>{item.name} </ListItem.Title>
									<ListItem.Subtitle style={styles.subtitle}>
										Bodypart: {item.bodyPart}
									</ListItem.Subtitle>
									<ListItem.Subtitle style={styles.subtitle}>
										Equipment: {item.equipment}
									</ListItem.Subtitle>
								</ListItem.Content>
							</>
						}
						isExpanded={expandedId === key}
						onPress={() => {
							setExpandedId(expandedId === key ? null : key)
						}}
					>
						<ListItem>
							<ListItem.Content>
								<ListItem.Subtitle style={styles.subtitle2}>
									<View>
										<Image source={{ uri: item.gifUrl }} style={styles.gif} />
									</View>
								</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					</ListItem.Accordion>
				))}
			</View>
		</ScrollView>
	)
}
