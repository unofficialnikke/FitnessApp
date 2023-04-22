import { View, Text, ScrollView, ActivityIndicator, Alert } from "react-native";
import { styles } from "../styles/CalendarStyle";
import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { collection, onSnapshot, query, deleteDoc, doc, where } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';
import LocaleConfig from "../config/localeConfig"
import { Icon, ListItem } from "@rneui/themed";

export default function TrainingCalendar() {
    const [selected, setSelected] = useState("")
    const [activityList, setActivityList] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState(null)

    LocaleConfig.defaultLocale = "fi";

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
                                        color="#de2a2a"
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
                                        <ListItem.Title style={{ fontSize: 24, color: "#414141" }}>
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
        <View style={styles.container}>
            <Calendar
                style={{
                    borderBottomWidth: 2,
                    borderBottomColor: "#b0adac"
                }}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: 'black',
                    selectedDayBackgroundColor: 'orange',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#ffffff',
                    dayTextColor: 'black',
                    todayBackgroundColor: "#414141",
                    textDisabledColor: '#bdbdbd',
                    dotColor: "orange",
                    monthTextColor: "#414141",
                    textMonthFontSize: 22,
                    arrowColor: "orange",
                }}
                onDayPress={day => {
                    setSelected(day.dateString)
                }}
                markedDates={{
                    [selected]: { selected: true, disableTouchEvent: true, selectedColor: "orange" },
                }}
            />
            {renderActivityList()}
        </View>
    )
}