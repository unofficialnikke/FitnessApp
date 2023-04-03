import * as React from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { Input, Button, Tooltip } from '@rneui/themed';
import { useState } from 'react';
import { styles } from '../styles/NewTraining';

type Training = [string, string, string, string]

export type TrainingList = {
    name: string;
    training: Training[]
}

export default function NewTraining({ navigation }) {
    const [trainingList, setTrainingList] = useState<Training[]>([])
    const [trainingLists, setTrainingLists] = useState<TrainingList[]>([])
    const [trainingListName, setTrainingListName] = useState("")
    const [trainingName, setTrainingName] = useState("")
    const [weight, setWeight] = useState("")
    const [repetitions, setRepetitions] = useState("")
    const [amount, setAmount] = useState("")

    const addTraining = () => {
        const newTraining: Training = [trainingName, weight, repetitions, amount];
        setTrainingList([...trainingList, newTraining]);
        setTrainingName("");
        setWeight("");
        setRepetitions("");
        setAmount("");
    };

    const addTrainingList = () => {
        const newTrainingList: TrainingList = {
            name: trainingListName,
            training: trainingList
        };
        setTrainingLists([...trainingLists, newTrainingList])
        setTrainingListName("")
        setTrainingList([])
    }


    return (
        <View style={styles.container}>
            <Button
                style={{ padding: 10 }}
                type="solid"
                color="#414141"
                title="Katso lisätyt harjoituksesi"
                onPress={() =>
                    navigation.navigate('ShowTrainings', { trainingLists: trainingLists })}
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
                style={{ padding: 10 }}
                type="solid"
                color="orange"
                onPress={addTraining}
                title="Lisää liike"
            />

            <View style={{ marginTop: 30 }}>
                <Button
                    size="lg"
                    type="solid"
                    color="orange"
                    onPress={addTrainingList}
                    title="Lisää valmis harjoitus"
                />
            </View>

        </View>
    )
}