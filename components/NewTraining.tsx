import * as React from 'react';
import { View, Text, Alert } from 'react-native';
import { Input, Chip } from '@rneui/themed';
import { useState } from 'react';
import { styles } from '../styles/NewTrainingStyle';
import { collection, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebaseConfig';

export default function NewTraining({ navigation }) {
    const [trainingListName, setTrainingListName] = useState("")
    const [trainingName, setTrainingName] = useState("")
    const [weight, setWeight] = useState("")
    const [repetitions, setRepetitions] = useState("")
    const [amount, setAmount] = useState("")
    const [trainingListId, setTrainingListId] = useState<number>(1)
    const [visible, setVisible] = useState(false)

    const addTraining = async () => {
        if (trainingName === "" || trainingName.toLowerCase() === "tyhjä") {
            Alert.alert("Virhe", "Liikkeen nimi ei voi olla tyhjä")
            return
        } else if (trainingListId === 1) {
            Alert.alert("Virhe", "Lisää ensin harjoitukselle nimi")
        } else {
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
        }
        setTrainingName("")
        setWeight("")
        setRepetitions("")
        setAmount("")
    };

    const addTrainingList = async () => {
        if (trainingListName === "" || trainingListName.toLowerCase() === "tyhjä") {
            Alert.alert("Virhe", "Harjoituksen nimi ei voi olla tyhjä")
            return
        }
        try {
            const ref = await addDoc(collection(db, "trainingList"), {
                name: trainingListName,
                userId: auth.currentUser?.uid,
                trainings: [],
            });
            {/* @ts-ignore */ }
            setTrainingListId(ref.id);
            console.log("Training list added with ID: ", ref.id);
            Alert.alert("Onnistui!", "Harjoituslista lisätty onnistuneesti. Lisää seuraavaksi liikkeet harjoitukselle. Lopuksi paina Valmis");
        } catch (error) {
            console.error("Error adding training list: ", error);
        }
        setTrainingListName("")
        setVisible(true)
    };

    const finishAdding = () => {
        setVisible(false)
        setTrainingListId(1)
    }

    return (
        <View style={styles.container}>
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
            <Text style={styles.newTrainingText}>Anna harjoitukselle nimi:</Text>
            <View style={{ width: "75%" }}>
                <Input
                    style={styles.input}
                    placeholder="Harjoituksen nimi"
                    value={trainingListName}
                    onChangeText={t => {
                        setTrainingListName(t)
                    }}
                />
            </View>
            <Chip
                title="Lisää harjoitus"
                size="lg"
                type="solid"
                color="orange"
                icon={{
                    name: "add",
                    color: "white",
                }}
                onPress={() => {
                    addTrainingList();
                }}
            />
            {visible && (
                <View style={styles.innerContainer}>
                    <Text style={styles.moves}>Lisää liikkeet:</Text>
                    <View style={{ width: "75%" }}>
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
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Chip
                            title="Lisää liike"
                            size="lg"
                            type="solid"
                            color="orange"
                            icon={{
                                name: "add",
                                color: "white",
                            }}
                            onPress={() => {
                                addTraining()
                            }}
                        />
                        <View style={styles.spacer}></View>
                        <Chip
                            title="Valmis"
                            size="lg"
                            type="solid"
                            color="orange"
                            icon={{
                                name: "done",
                                color: "white",
                            }}
                            onPress={() => {
                                Alert.alert(
                                    "Varoitus",
                                    "Oletko lisännyt kaikki liikkeet harjoitukselle?",
                                    [
                                        { text: "En", style: "cancel" }, {
                                            text: "Kyllä",
                                            onPress: () =>
                                                finishAdding(),
                                            style: "destructive",
                                        },
                                    ],
                                    { cancelable: true }
                                )
                            }}
                        />
                    </View>
                </View>
            )}
        </View >
    )
}