import * as React from 'react';
import { View, FlatList, Text } from "react-native";
import { styles } from '../styles/FrontpageStyle';

export default function ShowTrainings({ route }) {
    const { trainingLists } = route.params

    return (
        <View style={styles.container}>
            {trainingLists.length === 0 ?
                <Text style={{ fontSize: 22 }}>No trainings added yet</Text>
                :
                <FlatList
                    data={trainingLists}
                    keyExtractor={(item) => item.name}
                    renderItem={({ item }) => (
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 20 }}>{item.name}</Text>
                            {item.training.map((training: any[], index: React.Key | null | undefined) => (
                                <View key={index}>
                                    <Text style={{ fontSize: 16 }}>
                                        {`${training[0]} - `}
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