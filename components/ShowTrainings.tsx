import * as React from 'react';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { ListItem, Icon } from '@rneui/themed';
import { db } from '../config/firebaseConfig';
import { collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { styles } from '../styles/ShowTrainingsStyle';

export default function ShowTrainings({ navigation }) {
    const [expandedId, setExpandedId] = useState(null)
    const [trainingList, setTrainingList] = useState<any>([])
    const [loading, setLoading] = useState(true)

    const deleteTrainingList = async (trainingListId: any) => {
        try {
            if (!trainingListId) {
                console.log("Error deleting training list: no ID provided")
                return
            }
            const docRef = doc(db, "trainingList", trainingListId)
            await deleteDoc(docRef)
            console.log("Training list deleted successfully!")
        } catch (error) {
            console.log("Error deleting training list: ", error)
        }
    }
    useEffect(() => {
        const q = query(collection(db, "trainingList"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const trainingListData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTrainingList(trainingListData);
            setLoading(false)
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const renderTrainingList = () => {
        if (loading) {
            return (
                <View style={styles.placement}>
                    <ActivityIndicator size="large" color="orange" />
                </View>)
        } else if (trainingList.length === 0) {
            return (
                <View style={styles.placement}>
                    <Text style={{ fontSize: 24 }}>Ei lisättyjä harjoituksia</Text>
                </View>
            )
        } else {
            return (
                <ScrollView>
                    {trainingList.map((item: any) => (
                        <ListItem.Accordion
                            key={item.id}
                            bottomDivider
                            content={
                                <>
                                    <Icon
                                        name="delete"
                                        color="orange"
                                        size={40}
                                        onPress={() => {
                                            Alert.alert(
                                                "Varoitus",
                                                `Haluatko varmasti poistaa harjoituksen ${item.name}?`,
                                                [
                                                    { text: "Peruuta", style: "cancel" }, {
                                                        text: "Ok",
                                                        onPress: () =>
                                                            deleteTrainingList(item.id),
                                                        style: "destructive",
                                                    },
                                                ],
                                                { cancelable: true }
                                            )
                                        }} />
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 24 }}>
                                            {item.name}
                                        </ListItem.Title>
                                    </ListItem.Content>
                                </>
                            }
                            isExpanded={expandedId === item.id}
                            onPress={() => {
                                if (expandedId === item.id) {
                                    setExpandedId(null);
                                } else {
                                    setExpandedId(item.id);
                                }
                            }}>
                            {item.trainings.map((training: any, key: any) => (
                                <ListItem key={key}>
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 20 }}>{training.trainingName}</ListItem.Title>
                                        <ListItem.Subtitle style={{ fontSize: 18 }}>
                                            Painot: {training.weight}, Toistot: {training.repetitions}, Määrä: {training.amount}
                                        </ListItem.Subtitle>
                                    </ListItem.Content>
                                </ListItem>
                            ))}
                        </ListItem.Accordion>
                    ))}
                </ScrollView>
            )
        }
    }

    return (
        <>
            {renderTrainingList()}
        </>
    );
};