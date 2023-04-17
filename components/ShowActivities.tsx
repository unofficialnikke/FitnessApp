import { View, ActivityIndicator, Text, ScrollView, FlatList } from "react-native";
import { useEffect, useState } from "react"
import { ListItem } from '@rneui/themed';
import { db } from '../config/firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { styles } from "../styles/NewActivityStyle";

export default function ShowActivities({ navigation }) {
    const [activityList, setActivityList] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        const q = query(collection(db, "activityList"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activityListData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            setActivityList(activityListData)
            setLoading(false)
        })
        return () => {
            unsubscribe()
        }
    }, [])
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
                        <ListItem key={item.id} bottomDivider>
                            <ListItem.Content>
                                {item.training.map((trainingList: any, key: any) => (
                                    <View key={key} style={{ width: "100%" }}>
                                        <ListItem.Title style={{ fontSize: 26, color: "orange" }}>
                                            {trainingList.name}
                                        </ListItem.Title>
                                        <ListItem.Title style={{ fontSize: 20, }}>
                                            {item.date}
                                        </ListItem.Title>
                                        {trainingList.trainings.map((training: any, key: any) => (
                                            <ListItem key={key}>
                                                <ListItem.Content>
                                                    <ListItem.Title style={{ fontSize: 20 }}>
                                                        {training.trainingName}
                                                    </ListItem.Title>
                                                    <ListItem.Subtitle style={{ fontSize: 18 }}>
                                                        Painot: {training.weight}, Toistot: {training.repetitions}, Määrä: {training.amount}
                                                    </ListItem.Subtitle>
                                                </ListItem.Content>
                                            </ListItem>
                                        ))}
                                    </View>
                                ))}
                            </ListItem.Content>
                        </ListItem>
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