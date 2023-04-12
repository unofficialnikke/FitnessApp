import * as React from 'react';
import { View, Text, Alert } from 'react-native';
import { Input, Button } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { styles } from '../styles/NewTrainingStyle';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, updateDoc, arrayUnion, doc, query, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyA4WpVrSlTSM1bpy6faWilQHjKtQwsq51o",
    authDomain: "fitnessapp-7487c.firebaseapp.com",
    projectId: "fitnessapp-7487c",
    storageBucket: "fitnessapp-7487c.appspot.com",
    messagingSenderId: "755447253804",
    appId: "1:755447253804:web:ba29f01b5c8cafeaf2fa89"
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
        if (trainingName === "" || trainingName.toLowerCase() === "tyhjä") {
            Alert.alert("Virhe", "Liikkeen nimi ei voi olla tyhjä")
            return
        }
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
        if (trainingListName === "" || trainingListName.toLowerCase() == "tyhjä") {
            Alert.alert("Virhe", "Harjoituksen nimi ei voi olla tyhjä")
            return
        }
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
        setVisible(true)
    };

    const deleteTrainingList = async (trainingListId: any) => {
        try {
            if (!trainingListId) {
                console.log('Error deleting training list: no ID provided')
                return
            }
            const docRef = doc(db, 'trainingList', trainingListId)
            await deleteDoc(docRef)
            console.log('Training list deleted successfully!')

        } catch (error) {
            console.log('Error deleting training list: ', error)
        }
    }

    useEffect(() => {
        const q = query(collection(db, "trainingList"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const trainingListData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setTrainingList(trainingListData);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    const finishAdding = () => {
        setVisible(false)
        setTrainingListId(1)
    }

    return (
        <View style={styles.container}>
            <Button
                style={{ padding: 10 }}
                size="lg"
                type="solid"
                color="#414141"
                title="Katso lisätyt harjoituksesi"
                onPress={() => {
                    navigation.navigate('ShowTrainings', { trainingList, deleteTrainingList })
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
            <Button
                title="Lisää harjoitus"
                style={{ padding: 10 }}
                size="lg"
                type="solid"
                color="orange"
                onPress={() => {
                    addTrainingList()
                }}
            />
            {visible && (
                <View style={styles.innerContainer}>
                    <Text style={{ fontSize: 20, marginBottom: 12, marginTop: 15 }}>Lisää liikkeet:</Text>
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
                    <View style={{ flexDirection: "row" }}>
                        <Button
                            title="Lisää liike"
                            size="lg"
                            style={{ padding: 10 }}
                            type="solid"
                            color="orange"
                            onPress={() => {
                                addTraining()
                            }}
                        />
                        <View style={{ marginLeft: 30, marginRight: 30 }}></View>
                        <Button
                            title="Valmis"
                            style={{ padding: 10 }}
                            size="lg"
                            type="solid"
                            color="orange"
                            onPress={() => {
                                finishAdding()
                            }}
                        />
                    </View>
                </View>
            )}

        </View >
    )
}