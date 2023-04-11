import * as React from 'react';
import { View, FlatList, Text } from "react-native";
import { styles } from '../styles/ShowTrainingsStyle';
import NewTraining from './NewTraining';

export default function ShowTrainings({ route, navigation }) {
    const trainings = route.params

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
            <FlatList
                data={trainings}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};