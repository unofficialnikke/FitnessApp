import { Chip, Dialog } from '@rneui/themed';
import * as React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { styles } from '../styles/FrontpageStyle';
import { db, auth } from '../config/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Divider } from 'react-native-paper';


export default function Frontpage({ navigation }) {
    const [activityList, setActivityList] = useState<any>([])
    const [loading, setLoading] = useState(true)
    const [isOpen, setIsOpen] = useState(-1)

    const months = ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu",
        "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"
    ];
    let d = new Date()

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

    const toggleDialog = (index: number) => {
        if (isOpen === index) {
            setIsOpen(-1)
        } else {
            setIsOpen(index)
        }
    }

    const renderActivity = () => {
        const todayActivities = activityList.filter((item: { date: string; }) =>
            item.date === new Date().toLocaleDateString()).slice(0, 7)
        if (loading) {
            return (
                <View style={styles.placement}>
                    <ActivityIndicator size="large" color="orange" />
                </View>)
        }
        else if (todayActivities.length > 0) {
            let firstItem = true
            return todayActivities.map((item: any, index: any) => (
                <View key={index}>
                    {firstItem && (
                        <Text style={styles.trainingText}>Päivän harjoitus/harjoitukset:</Text>
                    )}
                    <TouchableOpacity onPress={() => toggleDialog(index)}>
                        <Text style={styles.trainingItem}>{item.title}</Text>
                    </TouchableOpacity>
                    {isOpen !== index ? null : (
                        <View>
                            <Dialog isVisible={true} onBackdropPress={() => setIsOpen(-1)}>
                                <Dialog.Title title={item.title} />
                                <Text style={{ fontSize: 18, marginBottom: 10 }}>{item.date}</Text>
                                {item.training.map((item2: any, index: number) =>
                                    item2.trainings.map((training: any, key: any) => (
                                        <View key={key}>
                                            <Text style={styles.dialogText}>{training.trainingName}</Text>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={styles.dialogText2}>
                                                    Painot: {training.weight}, Toistot: {training.repetitions}, Määrä: {training.amount}
                                                </Text>
                                            </View>
                                            <Divider style={{ marginTop: 7, marginBottom: 7 }} />
                                        </View>
                                    ))
                                )}
                            </Dialog>
                        </View>
                    )}
                    {(firstItem = false)}
                </View>

            ));
        } else {
            return (
                <View>
                    <Text style={styles.trainingText}>Ei harjotuksia tänään</Text>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Text style={styles.homeText}>{`Tänään: ${d.getDate()}. ${months[d.getMonth()]}ta ${d.getFullYear()}`}</Text>
                <View style={styles.todaysActivity}>
                    {renderActivity()}
                </View>
            </View>
            <View>
                <Text style={styles.bottomText}>Liikkeet ja harjoitukset:</Text>
            </View>
            <View style={styles.chipView}>
                <Chip
                    title="Lisää kalenteriin"
                    type="solid"
                    size="lg"
                    color="orange"
                    icon={{
                        name: "calendar",
                        color: "white",
                        type: "ionicon"
                    }}
                    onPress={() => {
                        navigation.navigate("NewActivity")
                    }}
                />
                <View style={{ height: 30 }}></View>
                <Chip
                    title="Uusi harjoitus"
                    type="solid"
                    size="lg"
                    color="orange"
                    icon={{
                        name: "add",
                        color: "white",
                    }}
                    onPress={() => {
                        navigation.navigate("NewTraining")
                    }}
                />
                <View style={{ height: 30 }}></View>
                <Chip
                    size="lg"
                    type="solid"
                    color="#414141"
                    title="Harjoituksesi"
                    icon={{
                        name: "list-outline",
                        color: "white",
                        type: "ionicon"
                    }}
                    onPress={() => {
                        navigation.navigate("ShowTrainings")
                    }}
                />
            </View>
        </View>
    )
}