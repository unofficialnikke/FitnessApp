import { Chip } from '@rneui/themed';
import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { styles } from '../styles/FrontpageStyle';
import { db, auth } from '../config/firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';


export default function Frontpage({ navigation }) {
    const [activityList, setActivityList] = useState<any>([])
    const [loading, setLoading] = useState(true)

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
            return todayActivities.map((item: any, key: any) => (
                <View key={key} style={{}}>
                    {firstItem && (
                        <Text style={{ fontSize: 20, textAlign: "center", marginBottom: 5 }}>Päivän harjoitus/harjoitukset:</Text>
                    )}
                    <Text style={{ fontSize: 20, textAlign: "center", fontWeight: "300" }}>{item.title}</Text>
                    {(firstItem = false)}
                </View>
            ));
        } else {
            return (
                <View>
                    <Text style={{ fontSize: 20, textAlign: "center", fontWeight: "300" }}>Ei harjotuksia tänään</Text>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Text style={styles.homeText}>{`Tänään: ${d.getDate()}. ${months[d.getMonth()]}ta ${d.getFullYear()}`}</Text>
                <View style={{ marginBottom: 205, alignItems: "center" }}>
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