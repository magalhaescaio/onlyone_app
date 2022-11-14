import React, { useEffect } from "react"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { MaterialIcons } from '@expo/vector-icons'

import { ContactsStackNavigator, DeviceStackNavigator, MainStackNavigator, ProfileStackNavigator } from "./StackNavigator"
import { View } from "react-native"
import { palette } from "../constants/colors"

const Tab = createBottomTabNavigator()

export default function BottomTabNavigator(props) {

    return (
        <Tab.Navigator
            initialRouteName={props.route.params.screen}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'BottomHome') {
                        iconName = 'home'
                    }else if (route.name === 'BottomProfile') {
                        iconName = 'person-pin'
                    }else if (route.name === 'BottomDevices') {
                        iconName = 'devices'
                    }else if (route.name === 'BottomContacts') {
                        iconName = 'group'
                    }

                    return <MaterialIcons name={iconName} size={size} color={color} />
                },

                tabBarInactiveTintColor: 'white',

                tabBarActiveTintColor: palette.lightGreen,
                tabBarInactiveTintColor: 'white',
                tabBarStyle: { position: 'absolute' },
                
                tabBarBackground: () => (
                    <View style={{
                        backgroundColor: palette.darkGray,
                        width: '100%',
                        height: '100%',
                        // borderTopWidth: 1,
                        // borderColor: palette.lightGreen,
                        // opacity: 0.1,
                        zIndex: 2
                    }}
                    />
                ),
            })}

        >
            <Tab.Screen
                name="BottomHome"
                component={MainStackNavigator}
                options={{
                    title: 'Início',
                    headerShown: false,
                }}
            />

            <Tab.Screen
                name="BottomDevices"
                component={DeviceStackNavigator}
                options={{
                    title: 'Dispositivos',
                    headerShown: false,
                }}
            />

            <Tab.Screen
                name="BottomContacts"
                component={ContactsStackNavigator}
                options={{
                    title: 'Contatos',
                    headerShown: false,
                }}
            />

            <Tab.Screen
                name="BottomProfile"
                component={ProfileStackNavigator}
                options={{
                    title: 'Perfil',
                    headerShown: false,
                }}
            />

        </Tab.Navigator>
    )
}