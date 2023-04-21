import { View, ScrollView, ActivityIndicator } from "react-native";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Chip, Input, Text } from "@rneui/themed";
import { styles } from '../styles/ShowTrainingsStyle';

export default function EditTrainingList({ route, navigation }) {
    const [trainings, setTrainings] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const trainingListId = route.params

    useEffect(() => {
        const getTrainings = async () => {
            try {
                const docRef = doc(db, "trainingList", trainingListId)
                const docSnap = await getDoc(docRef)
                setTrainings(docSnap.data())
                setLoading(false)
            } catch (error) {
                console.error("Error retrieving trainingList", error)
            }
        };
        getTrainings()
    }, [])

    const updateTrainingList = async () => {
        try {
            const docRef = doc(db, 'trainingList', trainingListId);
            const updatedTrainings = trainings.trainings.map(training => {
                const { userId, ...rest } = training;
                return rest;
            });
            await updateDoc(docRef, { trainings: updatedTrainings });
            console.log('Document updated successfully!');
            navigation.goBack()
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };

    const handleInputChange = (key: any, property: any, value: any) => {
        const updatedTrainings = [...trainings.trainings];
        updatedTrainings[key][property] = value;
        setTrainings({ ...trainings, trainings: updatedTrainings });
    };

    return (
        <ScrollView>
            {loading ?
                <View style={styles.placement}>
                    <ActivityIndicator size="large" color="orange" />
                </View> :
                <View>
                    <Text style={{ textAlign: "center", fontSize: 22, marginTop: 20 }}>
                        Muokkaa harjoitusta
                    </Text>
                    <Text style={{ textAlign: "center", fontSize: 22, marginBottom: 20 }}>
                        {trainings.name}:
                    </Text>
                    <View style={{ alignItems: "center" }}>
                        {trainings.trainings.map((training: any, key: any) => {
                            return (
                                <View key={key} style={styles.innerContainer}>
                                    <Text style={{ textAlign: "center", fontSize: 22, marginBottom: 15, fontWeight: "bold" }}>
                                        Liike {key + 1}
                                    </Text>
                                    <Text style={{ textAlign: "center", fontSize: 20, marginBottom: 15 }}>
                                        Liikkeen nimi:
                                    </Text>
                                    <Input
                                        value={training.trainingName}
                                        style={{ textAlign: "center" }}
                                        onChangeText={(value) => handleInputChange(key, "trainingName", value)}
                                    />
                                    <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
                                        Painot:
                                    </Text>
                                    <Input
                                        value={training.weight}
                                        style={{ textAlign: "center" }}
                                        onChangeText={(value) => handleInputChange(key, "weight", value)}
                                    />
                                    <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
                                        Toistot:
                                    </Text>
                                    <Input
                                        value={training.amount}
                                        style={{ textAlign: "center" }}
                                        onChangeText={(value) => handleInputChange(key, "amount", value)}
                                    />
                                    <Text style={{ textAlign: "center", fontSize: 18, marginBottom: 10 }}>
                                        Toistojen määrä:
                                    </Text>
                                    <Input
                                        value={training.repetitions}
                                        style={{ textAlign: "center" }}
                                        onChangeText={(value) => handleInputChange(key, "repetitions", value)}
                                    />
                                </View>
                            )
                        })}
                    </View>
                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginBottom: 30 }}>
                        <Chip
                            title="Tallenna"
                            size="lg"
                            type="solid"
                            color="orange"
                            icon={{
                                name: "save-outline",
                                color: "white",
                                type: "ionicon"
                            }}
                            onPress={() => {
                                updateTrainingList();
                            }}
                        />
                    </View>
                </View>

            }
        </ScrollView >
    )
}