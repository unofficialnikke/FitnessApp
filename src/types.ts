export type TrainingExercise = {
	trainingName: string
	weight: string
	repetitions: string
	amount: string
	userId?: string
}

export type TrainingList = {
	id: string
	name: string
	userId?: string
	trainings: TrainingExercise[]
}

export type ActivityTrainingGroup = {
	id?: string
	name?: string
	trainings: TrainingExercise[]
}

export type ActivityItem = {
	id: string
	date: string
	title: string
	userId?: string
	training: ActivityTrainingGroup[]
}

export type ExerciseApiItem = {
	name: string
	bodyPart: string
	equipment: string
	gifUrl: string
}

export type RootStackParamList = {
	LoginPage: undefined
	RegistrationPage: undefined
	ResetPassword: undefined
	TabNavi: undefined
	Frontpage: undefined
	UserPage: undefined
	NewTraining: undefined
	ShowTrainings: undefined
	NewActivity: undefined
	ShowActivities: undefined
	EditTrainingList: string | undefined
}

export type AppNavigation = {
	navigate: {
		(screen: string): void
		(screen: string, params: unknown): void
		(options: { screen: string; params?: unknown }): void
	}
	goBack: () => void
}

export type RouteParams = {
	params?: string
}
