import { View, Text } from "react-native";
import { styles } from "../styles/CalendarStyle";
import React, { useState } from 'react';
import { CalendarList } from 'react-native-calendars';
import LocaleConfig from "../config/localeConfig"

export default function TrainingCalendar() {
    const [selected, setSelected] = useState("")

    LocaleConfig.defaultLocale = 'fi';

    return (
        <View style={styles.container}>
            <CalendarList
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: 'black',
                    selectedDayBackgroundColor: 'orange',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#ffffff',
                    dayTextColor: 'black',
                    todayBackgroundColor: "#414141",
                    textDisabledColor: '#bdbdbd',
                    dotColor: "orange",
                    monthTextColor: "orange",
                    textMonthFontSize: 22,
                }}
                onDayPress={day => {
                    setSelected(day.dateString)
                }}
                markedDates={{
                    [selected]: { selected: true, disableTouchEvent: true, selectedColor: "orange" }
                }}

            />
        </View>
    )
}