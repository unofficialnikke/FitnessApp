import * as React from 'react';
import { View, FlatList, Text } from "react-native";
import { styles } from '../styles/ShowTrainingsStyle';
import NewTraining from './NewTraining';

export default function ShowTrainings({ route, navigation }) {
    const trainings = route.params

    const renderItem = ({ item }) => (
        <View>
            <Text style={{ fontSize: 24, textAlign: "center", marginBottom: 5, marginTop: 5 }}>{item.name}</Text>
            <FlatList
                data={item.trainings}
                ItemSeparatorComponent={listSeparator2}
                renderItem={({ item }) => (
                    <View>
                        <Text style={{ fontSize: 20, textAlign: "center" }}>
                            {item.trainingName}</Text>
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

    const listSeparator1 = () => {
        return (
            <View style={{ height: 2, backgroundColor: "orange", marginTop: 10 }} />
        );
    }
    const listSeparator2 = () => {
        return (
            <View style={{ height: 2, backgroundColor: "black" }} />
        );
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={trainings}
                ItemSeparatorComponent={listSeparator1}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};