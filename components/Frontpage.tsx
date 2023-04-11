import { Button } from '@rneui/themed';
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
            <Text style={styles.homeText}>{`Tänään: ${d.getDate()}. ${months[d.getMonth()]}ta ${d.getFullYear()}`}</Text>
            <Button
                title="Lisää uusi harjoitus"
                type="solid"
                color="orange"
                buttonStyle={styles.button}
                onPress={() => {
                    navigation.navigate('NewTraining');
                }}
            />
        </View>
    )
}