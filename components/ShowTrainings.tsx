import * as React from 'react';
import { View, FlatList, Text } from "react-native";
import { styles } from '../styles/ShowTrainingsStyle';

export default function ShowTrainings({ route, navigation }) {
    const trainings = route.params

    const deleteTraining = (key) => {

    }

    const renderItem = ({ item }) => (
        <View>
            <Text onPress={() => deleteTraining(item)} style={{ textAlign: "center", fontSize: 24, color: "blue" }}>delete</Text>
            <Text style={styles.listName}>{item.name}</Text>
            <FlatList
                data={item.trainings}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.name}>
                            {item.trainingName}</Text>
                        <Text style={styles.training}>
                            Painot: {item.weight},
                            Toistot: {item.repetitions},
                            Määrä: {item.amount}
                        </Text>
                    </View>
                )}
            />
        </View>
    )

    const listSeparator = () => {
        return (
            <View style={styles.separator} />
        );
    }
    return (
        <View style={styles.container}>
            <FlatList
                style={styles.allTrainings}
                data={trainings}
                ItemSeparatorComponent={listSeparator}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
};