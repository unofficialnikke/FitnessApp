import { View, ActivityIndicator, Text, ScrollView, FlatList, Alert } from "react-native";
import { useEffect, useState } from "react"
import { Icon, ListItem } from '@rneui/themed';
import { db, auth } from '../config/firebaseConfig';
import { collection, onSnapshot, query, deleteDoc, doc, where } from 'firebase/firestore';
import { styles } from "../styles/NewActivityStyle";

export default function ShowActivities({ navigation }) {
    const [activityList, setActivityList] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        const q = query(collection(db, "activityList"), where("userId", "==", auth.currentUser?.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activityListData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setActivityList(activityListData)
            setLoading(false)
        })
        return () => {
            unsubscribe()
        }
    }, [])
    const deleteActivity = async (activityListId: any) => {
        try {
            if (!activityListId) {
                console.log("Error deleting activity: no ID provided")
                return
            }
            const docRef = doc(db, "activityList", activityListId)
            await deleteDoc(docRef)
            console.log("Activity deleted succesfully!")
        } catch (error) {
            console.log("Error deleting activity: ", error)
        }
    }

    const renderActivityList = () => {
        if (loading) {
            return (
                <View style={styles.placement}>
                    <ActivityIndicator size="large" color="orange" />
                </View>)
        } else if (activityList.length === 0) {
            return (
                <View style={styles.placement}>
                    <Text style={{ fontSize: 24 }}>Ei lisättyjä aktiviteettejä</Text>
                </View>
            )
        } else {
            return (
                <ScrollView>
                    {activityList.map((item: any) => (
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
                                                `Haluatko varmasti poistaa harjoituksen ${item.title} päivältä ${item.date}?`,
                                                [
                                                    { text: "Peruuta", style: "cancel" }, {
                                                        text: "Ok",
                                                        onPress: () =>
                                                            deleteActivity(item.id),
                                                        style: "destructive",
                                                    },
                                                ],
                                                { cancelable: true }
                                            )
                                        }}
                                    />
                                    <ListItem.Content>
                                        <ListItem.Title style={{ fontSize: 26, color: "#414141" }}>
                                            {item.title}
                                        </ListItem.Title>
                                        <ListItem.Title style={{ fontSize: 20, }}>
                                            {item.date}
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
                            {item.training.map((trainingList: any, key: any) => (
                                <ListItem key={key}>
                                    <ListItem.Content>
                                        {trainingList.trainings.map((training: any, key: any) => (
                                            <ListItem key={key}>
                                                <View style={{ width: "100%" }}>
                                                    <ListItem.Title style={{ fontSize: 20 }}>
                                                        {training.trainingName}:
                                                    </ListItem.Title>
                                                    <ListItem.Subtitle style={{ fontSize: 18 }}>
                                                        Painot: {training.weight}, Toistot: {training.repetitions}, Määrä: {training.amount}
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
    }

    return (
        <>
            {renderActivityList()}
        </>
    )
}