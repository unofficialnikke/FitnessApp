import * as React from 'react';
import { View, FlatList, Text } from "react-native";
import { TrainingList } from "./NewTraining";
import { styles } from '../styles/ShowTrainingsStyle';

interface Props {
    route: {
        params: {
            trainingLists: TrainingList[];
        };
    };
}

export default function ShowTrainings({ route }: Props) {
    const { trainingLists } = route.params

    const listSeparator = () => {
        return (
            <View style={{ height: 1, backgroundColor: "grey" }} />
        );
    }

    return (
        <View style={styles.container}>
            {trainingLists.length === 0 ?
                <Text style={{ fontSize: 22 }}>Ei vielä lisättyjä harjoituksia</Text>
                :
                <FlatList
                    data={trainingLists}
                    ItemSeparatorComponent={listSeparator}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 24, textAlign: "center" }}>{item.name}</Text>
                            {item.training.map((training, index) => (
                                <View key={index}>
                                    <Text style={styles.map}>
                                        {`${training[0]}`}
                                    </Text>
                                    <Text style={{ fontSize: 18 }}>
                                        {`Painot: ${training[1]} kg, `}
                                        {`Sarja: ${training[2]}, `}
                                        {`Toistot: ${training[3]}x`}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                />
            }
        </View>
    );
};