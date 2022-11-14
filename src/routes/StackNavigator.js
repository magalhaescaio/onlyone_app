import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HomeScreen from './../screens/Home'
import DevicesScreen from './../screens/Devices'
import AboutScreen from './../screens/About'
import ContactsScreen from './../screens/Contacts'
import NotificationsScreen from './../screens/Notifications'
import ProfileScreen from './../screens/Profile'
import FaqScreen from './../screens/Faq'
import ReportsScreen from './../screens/Reports'

const Stack = createNativeStackNavigator()

const MainStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Início',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const DeviceStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Devices"
                component={DevicesScreen}
                options={{
                    title: 'Devices',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const AboutStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="About"
                component={AboutScreen}
                options={{
                    title: 'About',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const ContactsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Contacts"
                component={ContactsScreen}
                options={{
                    title: 'Contacts',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const NotificationsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    title: 'Notifications',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'Profile',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const FaqStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Faq"
                component={FaqScreen}
                options={{
                    title: 'Faq',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}

const ReportsStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Reports"
                component={ReportsScreen}
                options={{
                    title: 'Faq',
                    headerShown: false
                }}
            />
        </Stack.Navigator>
    )
}



export {
    MainStackNavigator,
    DeviceStackNavigator,
    AboutStackNavigator,
    ContactsStackNavigator,
    NotificationsStackNavigator,
    ProfileStackNavigator,
    FaqStackNavigator,
    ReportsStackNavigator
}