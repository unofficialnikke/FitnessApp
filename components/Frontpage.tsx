import { Chip } from '@rneui/themed';
import * as React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles/FrontpageStyle';

export default function Frontpage({ navigation }) {
    const months = ["tammikuu", "helmikuu", "maaliskuu", "huhtikuu", "toukokuu", "kesäkuu",
        "heinäkuu", "elokuu", "syyskuu", "lokakuu", "marraskuu", "joulukuu"
    ];
    let d = new Date()

    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Text style={styles.homeText}>{`Tänään: ${d.getDate()}. ${months[d.getMonth()]}ta ${d.getFullYear()}`}</Text>
            </View>
            <View style={{ marginBottom: 40 }}>
                <Chip
                    title="Lisää kalenteriin"
                    type="solid"
                    size="lg"
                    color="orange"
                    icon={{
                        name: "calendar",
                        color: "white",
                        type: "ionicon"
                    }}
                    onPress={() => {
                        navigation.navigate("NewActivity")
                    }}
                />
            </View>
            <View style={{ marginBottom: 250 }}>
                <Chip
                    title="Lisää uusi harjoitus"
                    type="solid"
                    size="lg"
                    color="orange"
                    icon={{
                        name: "add",
                        color: "white",
                    }}
                    onPress={() => {
                        navigation.navigate("NewTraining")
                    }}
                />
                <View style={{ marginTop: 40 }}>
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
                </View>
            </View>
        </View>
    )
}