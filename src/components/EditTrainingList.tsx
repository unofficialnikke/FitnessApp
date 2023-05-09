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
            const docRef = doc(db, "trainingList", trainingListId);
            const updatedTrainings = trainings.trainings.map(training => {
                const { userId, ...rest } = training;
                return rest;
            });
            await updateDoc(docRef, { trainings: updatedTrainings });
            navigation.goBack()
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    };

    const trainingChange = (key: any, property: any, value: any) => {
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
                    <Text style={styles.editTraining}>
                        Muokkaa harjoitusta
                    </Text>
                    <Text style={styles.trainingName}>
                        {trainings.name}:
                    </Text>
                    <View style={{ alignItems: "center" }}>
                        {trainings.trainings.map((training: any, key: any) => {
                            return (
                                <View key={key} style={styles.innerContainer}>
                                    <Text style={styles.moveText}>
                                        Liike {key + 1}
                                    </Text>
                                    <Text style={styles.moveText2}>
                                        Liikkeen nimi:
                                    </Text>
                                    <Input
                                        value={training.trainingName}
                                        placeholder="harjoituksen nimi.."
                                        style={{ textAlign: "center" }}
                                        onChangeText={(value) => trainingChange(key, "trainingName", value)}
                                    />
                                    <Text style={styles.moveText2}>
                                        Painot (kg):
                                    </Text>
                                    <Input
                                        value={training.weight}
                                        placeholder="painot.."
                                        keyboardType="numeric"
                                        style={{ textAlign: "center" }}
                                        onChangeText={(value) => trainingChange(key, "weight", value)}
                                    />
                                    <Text style={styles.moveText2}>
                                        Toistot:
                                    </Text>
                                    <Input
                                        value={training.amount}
                                        placeholder="toistot.."
                                        keyboardType="numeric"
                                        style={{ textAlign: "center" }}
                                        onChangeText={(value) => trainingChange(key, "amount", value)}
                                    />
                                    <Text style={styles.moveText2}>
                                        Toistojen määrä:
                                    </Text>
                                    <Input
                                        value={training.repetitions}
                                        placeholder="toistojen määrä.."
                                        keyboardType="numeric"
                                        style={{ textAlign: "center" }}
                                        onChangeText={(value) => trainingChange(key, "repetitions", value)}
                                    />
                                </View>
                            )
                        })}
                    </View>
                    <View style={styles.saveChip}>
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