import { Button } from '@rneui/themed';
import * as React from 'react';
import { View, Text } from 'react-native';

export default function ({ navigation }) {

    return (
        <View>
            <Button
                title="New Training"
                onPress={() => {
                    navigation.navigate('NewTraining');
                }}
            />
        </View>
    )
}