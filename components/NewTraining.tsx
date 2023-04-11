import * as React from 'react';
import { View, Text, Alert, FlatList, SectionList } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { styles } from '../styles/NewTrainingStyle';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, arrayUnion, doc, query } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyANpiYh4Wlo0FwfuygNMqxRbC2KgjnOBEs",
    authDomain: "fitnessapp-42977.firebaseapp.com",
    databaseURL: "fitnessapp-42977-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "fitnessapp-42977",
    storageBucket: "fitnessapp-42977.appspot.com",
    messagingSenderId: "1063700009118",
    appId: "1:1063700009118:web:cbf8f859e07df1b0b62b8f"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function NewTraining({ navigation }) {
    const [trainingListName, setTrainingListName] = useState("")
    const [trainingName, setTrainingName] = useState("")
    const [weight, setWeight] = useState("")
    const [repetitions, setRepetitions] = useState("")
    const [amount, setAmount] = useState("")
    const [trainingList, setTrainingList] = useState<any>([])
    const [trainingListId, setTrainingListId] = useState<number>(1)
    const [visible, setVisible] = useState(false)

    const addTraining = async () => {
        try {
            const newTraining = {
                trainingName: trainingName,
                weight: weight,
                repetitions: repetitions,
                amount: amount
            };
            await updateDoc(doc(db, "trainingList", trainingListId.toString()), {
                trainings: arrayUnion(newTraining)
            });
            console.log('Training added: ', newTraining);
        } catch (error) {
            console.error('Error adding training: ', error);
        }
        setTrainingName("")
        setWeight("")
        setRepetitions("")
        setAmount("")
    };

    const addTrainingList = async () => {
        try {
            const ref = await addDoc(collection(db, "trainingList"), {
                name: trainingListName,
                trainings: [],
            });
            {/* @ts-ignore */ }
            setTrainingListId(ref.id);
            console.log("Training list added with ID: ", ref.id);
        } catch (error) {
            console.error("Error adding training list: ", error);
        }
        setTrainingListName("")
    };

    useEffect(() => {
        const q = query(collection(db, 'trainingList'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const trainingListData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTrainingList(trainingListData);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const renderItem = ({ item }) => (
        <View>
            <Text style={{ fontSize: 22, textAlign: "center", marginBottom: 5, marginTop: 5 }}>{item.name}</Text>
            <FlatList
                data={item.trainings}
                renderItem={({ item }) => (
                    <View>
                        <Text style={{ fontSize: 20, textAlign: "center" }}>
                            Liike: {item.trainingName}</Text>
                        <Text style={{ fontSize: 18, textAlign: "center" }}>
                            Painot: {item.weight},
                            Toistot: {item.repetitions},
                            Määrä: {item.amount}
                        </Text>
                    </View>
                )}
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <Button
                style={{ padding: 10 }}
                type="solid"
                color="#414141"
                title="Katso lisätyt harjoituksesi"
                onPress={() => {
                    navigation.navigate('ShowTrainings', trainingList)
                }}
            />
            <Text style={{ fontSize: 20, marginBottom: 12, marginTop: 30 }}>Anna harjoitukselle nimi:</Text>
            <Input
                style={styles.input}
                placeholder="Harjoituksen nimi"
                value={trainingListName}
                onChangeText={t => {
                    setTrainingListName(t)
                }}
            />
            <Text style={{ fontSize: 20, marginBottom: 12 }}>Lisää liikkeet:</Text>
            <Input
                style={styles.input}
                placeholder="liikkeen nimi.."
                value={trainingName}
                onChangeText={(t) => {
                    setTrainingName(t)
                }}
            /><Input
                style={styles.input}
                placeholder="painot (kg).."
                value={weight}
                keyboardType="numeric"
                onChangeText={(t) => {
                    setWeight(t)
                }}
            /><Input
                style={styles.input}
                placeholder="sarjan pituus.."
                value={repetitions}
                keyboardType="numeric"
                onChangeText={(t) => {
                    setRepetitions(t)
                }}
            /><Input
                style={styles.input}
                placeholder="sarjojen määrä.."
                value={amount}
                keyboardType="numeric"
                onChangeText={t => {
                    setAmount(t)
                }}
            />
            <Button
                title="Lisää liike"
                style={{ padding: 10 }}
                type="solid"
                color="orange"
                onPress={() => {
                    addTraining()
                }}
            />
            <Button
                title="Lisää harjoitus"
                style={{ padding: 10 }}
                type="solid"
                color="orange"
                onPress={() => {
                    addTrainingList()
                }}
            />
            <FlatList
                data={trainingList}
                renderItem={renderItem}
                keyExtractor={(item) => item.id} />
        </View >
    )
}