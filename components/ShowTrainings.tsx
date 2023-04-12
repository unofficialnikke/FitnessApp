import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, LogBox, Alert } from "react-native";
import { ListItem, Icon } from '@rneui/themed';
import { styles } from '../styles/ShowTrainingsStyle';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state',]);

export default function ShowTrainings({ route, navigation }) {
    const { trainingList, deleteTrainingList } = route.params
    const [expanded, setExpanded] = useState(false)
    const [expandedId, setExpandedId] = useState(null)
    const [updatedTrainingList, setUpdatedTrainingList] = useState(trainingList)

    const handleDelete = (id: any) => {
        const newTrainingList = updatedTrainingList.filter((item) => item.id !== id);
        setUpdatedTrainingList(newTrainingList);
        deleteTrainingList(id);
    };

    return (
        <View>
            {updatedTrainingList.map((item: any) => (
                <ListItem.Accordion
                    key={item.id}
                    content={
                        <>
                            <Icon
                                name="delete"
                                color="orange"
                                size={40}
                                onPress={() => {
                                    Alert.alert(
                                        "Varoitus",
                                        `Haluatko varmasti poistaa harjoituksen ${item.name}?`,
                                        [
                                            { text: "Peruuta", style: "cancel" }, {
                                                text: "Ok",
                                                onPress: () =>
                                                    handleDelete(item.id),
                                                style: "destructive",
                                            },
                                        ],
                                        { cancelable: true }
                                    )
                                }} />
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: 24 }}>
                                    {item.name}
                                </ListItem.Title>
                            </ListItem.Content>
                        </>
                    }
                    isExpanded={expandedId === item.id}
                    onPress={() => {
                        if (expandedId === item.id) {
                            setExpandedId(null);
                        } else {
                            setExpandedId(item.id);
                        }
                    }}>
                    {item.trainings.map((training: any, key: any) => (
                        <ListItem key={key}>
                            <ListItem.Content>
                                <ListItem.Title style={{ fontSize: 20 }}>{training.trainingName}</ListItem.Title>
                                <ListItem.Subtitle style={{ fontSize: 18 }}>
                                    Painot: {training.weight}, Toistot: {training.repetitions}, Määrä: {training.amount}
                                </ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </ListItem.Accordion>
            ))}
        </View>
    );
};