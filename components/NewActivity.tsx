import * as React from 'react';
import { View, Text, Platform, Alert } from "react-native";
import { useEffect, useState } from "react"
import { Input, Chip, ListItem, Icon } from '@rneui/themed';
import { styles } from "../styles/NewActivityStyle";
import { db, auth } from '../config/firebaseConfig';
import { addDoc, collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from '@react-native-community/datetimepicker';

export default function NewActivity({ navigation }) {
    const [trainingList, setTrainingList] = useState<any>([])
    const [date, setDate] = useState(new Date())
    const [today, setToday] = useState(new Date())
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false)
    const [selectedTraining, setSelectedTraining] = useState<any>(null)

    useEffect(() => {
        const q = query(collection(db, "trainingList"), where("userId", "==", auth.currentUser?.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const trainingListData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTrainingList(trainingListData);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const showDatepicker = () => {
        setShow(true);
    };

    const changeDate = (currentMode: any, currentDate: any) => {
        if (Platform.OS === 'android') {
            setShow(false);
        } else {
            setShow(false);
        }
        setMode(currentMode);
        setDate(currentDate);
    };

    const addActivity = async () => {
        if (selectedTraining === null) {
            Alert.alert("Virhe", "Valitse ensin harjoitus")
            return
        }
        try {
            const ref = await addDoc(collection(db, "activityList"), {
                date: date.toLocaleDateString(),
                title: selectedTraining.name,
                userId: auth.currentUser?.uid,
                training: [selectedTraining]
            })
            console.log("Activity added succesfully with ID: ", ref.id)
            Alert.alert("Onnistui", "Uusi aktiviteetti lisätty!")
        } catch (error) {
            console.error("Error adding new activity", error)
        }
        setSelectedTraining(null)
        setDate(new Date())
    }

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 30 }}>
                <Chip
                    size="lg"
                    type="solid"
                    color="#414141"
                    title="Aktiviteettisi"
                    icon={{
                        name: "list-outline",
                        color: "white",
                        type: "ionicon"
                    }}
                    onPress={() => {
                        navigation.navigate("ShowActivities")
                    }}
                />
            </View>
            <Text style={styles.activity}>Lisää uusi aktiviteetti:</Text>
            <View style={styles.dateText}>
                <Text style={styles.date}>Valittu päivämäärä: {date.toLocaleDateString()}</Text>
            </View>
            <View style={styles.innerContainer}>
                <Chip
                    onPress={showDatepicker}
                    title="Päivämäärä"
                    icon={{
                        name: "calendar",
                        color: "white",
                        type: "ionicon"
                    }}
                    color="orange"
                />
            </View>
            {show && (
                <DatePicker
                    testID="dateTimePicker"
                    minimumDate={today}
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={changeDate}
                    accentColor="#414141"
                />
            )}
            <View style={styles.innerContainer}>
                <RNPickerSelect
                    onValueChange={(value) => {
                        const selected = trainingList.find((item: any) => item.name === value);
                        if (selected) {
                            setSelectedTraining(selected);
                        }
                    }}
                    placeholder={{ label: "Valitse aktiviteetti", color: "grey" }}
                    items=
                    {trainingList.map((item: any, key: any) => (
                        { label: item.name, value: item.name, key: key }
                    ))}
                    value={selectedTraining?.name}
                />
            </View>
            <View>
                <Chip
                    title="Lisää aktiviteetti"
                    size="lg"
                    type="solid"
                    color="orange"
                    icon={{
                        name: "add",
                        color: "white",
                    }}
                    onPress={() => {
                        addActivity()
                    }}
                />
            </View>

        </View>
    )
}