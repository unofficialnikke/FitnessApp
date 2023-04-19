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
            <View style={{ marginBottom: 30 }}>
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
            <View style={{ flex: 0.5 }}>
                <Chip
                    title="Uusi harjoitus"
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
            </View>
            <View style={{ marginTop: 40, flexDirection: "row", flex: 0.4 }}>
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
                <View style={{ marginLeft: 15, marginRight: 15 }}></View>
                <Chip
                    size="lg"
                    type="solid"
                    color="#414141"
                    title="Aktiviteettisi"
                    icon={{
                        name: "list-outline",
                        color: "white",
                        type: "ionicon"
                    }}
                    onPress={() => {
                        navigation.navigate("ShowActivities")
                    }}
                />
            </View>
        </View>
    )
}