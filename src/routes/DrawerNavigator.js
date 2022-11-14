import React from "react"

import { StyleSheet } from "react-native"
import { createDrawerNavigator } from "@react-navigation/drawer"

import BottomTabNavigator from "./BottomTabNavigator"
import {
    DeviceStackNavigator,
    ContactsStackNavigator,
    NotificationsStackNavigator,
    AboutStackNavigator,
    ProfileStackNavigator,
    FaqStackNavigator,
    ReportsStackNavigator
} from "./StackNavigator"
import DrawerContent from './DrawerContent'

const Drawer = createDrawerNavigator()

export default DrawerNavigator = (props) => {

    return (
        <Drawer.Navigator
            drawerContent={props => <DrawerContent {...props} />}
            useLegacyImplementation={true}
        >
            <Drawer.Screen
                name="HomeStackNavigator"
                component={BottomTabNavigator}
                initialParams={{ screen: 'BottomHome' }}
                options={{
                    headerShown: false
                }}
            />

            <Drawer.Screen
                name="DeviceStackNavigator"
                component={DeviceStackNavigator}
                options={{
                    headerShown: false
                }}
            />


            <Drawer.Screen
                name="ContactsStackNavigator"
                component={ContactsStackNavigator}
                options={{
                    title: '',
                    headerShown: false
                }}
            />

            <Drawer.Screen
                name="NotificationsStackNavigator"
                component={NotificationsStackNavigator}
                options={{
                    title: '',
                    headerShown: false
                }}
            />

            <Drawer.Screen
                name="ProfileStackNavigator"
                component={ProfileStackNavigator}
                options={{
                    title: '',
                    headerShown: false
                }}
            />

            <Drawer.Screen
                name="AboutStackNavigator"
                component={AboutStackNavigator}
                options={{
                    title: '',
                    headerShown: false
                }}
            />

            <Drawer.Screen
                name="FaqStackNavigator"
                component={FaqStackNavigator}
                options={{
                    title: '',
                    headerShown: false
                }}
            />

            <Drawer.Screen
                name="ReportsStackNavigator"
                component={ReportsStackNavigator}
                options={{
                    title: '',
                    headerShown: false
                }}
            />
        </Drawer.Navigator>
    )
}




const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%'
    },

    menuCol: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '10%',
        height: '100%',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        zIndex: 2
    },

    logoCol: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center'
    },

})