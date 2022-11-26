import { useContext, useEffect, useState } from "react"
import { Image, StyleSheet, Text, View } from "react-native"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import { useDrawerStatus, DrawerItem } from '@react-navigation/drawer'
import { StatusBar } from "expo-status-bar"
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

import AuthContext from "../context/Auth"
import { version } from "./../constants/default"
import LogoOnlyOneWhite from "./../assets/images/onlyone_white.png"
import { getData } from "../functions/store"
import { palette } from "../constants/colors"

export default function (props) {
    const { logoutUser } = useContext(AuthContext)

    const [userData, setUserData] = useState()

    const isDrawerOpen = useDrawerStatus() === 'open'
    const navigation = useNavigation()

    // useEffect(() => {

    // }, [isDrawerOpen])

    useEffect(() => {
        async function fetchData() {
            setUserData(JSON.parse(await getData('onlyne-application-data')))
        }

        fetchData()
    }, [])  

    const menu = ([
        {
            name: 'Home',
            label: 'Início',
            icon: 'home',
            active: false
        },
        {
            name: 'BottomDevices',
            label: 'Dispositivos',
            icon: 'devices',
            active: true
        },
        {
            name: 'BottomContacts',
            label: 'Contatos',
            icon: 'group',
            active: true
        },
        {
            name: 'NotificationsStackNavigator',
            label: 'Notificações',
            icon: 'notifications',
            active: true
        },

        {
            name: 'BottomProfile',
            label: 'Perfil',
            icon: 'person-pin',
            active: true
        },

        {
            name: 'AboutStackNavigator',
            label: 'Sobre',
            icon: 'info',
            active: true
        },

        {
            name: 'FaqStackNavigator',
            label: 'FAQ',
            icon: 'help',
            active: true
        },
    ])

    return (
        <View style={{ flex: 1, backgroundColor: palette.darkGray }}>
            {/* <StatusBar style={isDrawerOpen ? 'light' : 'dark'} /> */}
            <DrawerContentScrollView {...props}>

                {/* LOGO */}
                <View style={styles.logoContainer}>
                    <Image source={LogoOnlyOneWhite} style={styles.logo} />
                </View>
                {/* LOGO */}


                {/* PROFILE */}
                <View style={styles.userNameContainer}>
                    <View style={styles.userNameCircle}>
                        <Text style={styles.userNameLetter}>{userData ? userData.name[0] + userData.name[1] : ''}</Text>
                    </View>

                    <Text style={styles.userName}>
                        {userData ? userData.name : ''}
                    </Text>
                </View>
                {/* PROFILE */}


                {/* MENU */}
                <View style={styles.drawerSection}>
                    {menu.map((row, index) => {
                        return (
                            <DrawerItem
                                key={index}
                                style={styles.drawerItem}
                                labelStyle={styles.drawerLabel}
                                icon={() => (
                                    <MaterialIcons name={row.icon} size={20} color={palette.lightGreen} />
                                )}
                                label={row.label}
                                onPress={() => { navigation.navigate(row.name) }}
                            />
                        )
                    })}

                    <DrawerItem
                        name="Sair"
                        icon={() => (
                            <MaterialIcons name='logout' size={20} color={palette.lightGreen} />
                        )}
                        style={styles.drawerItem}
                        labelStyle={styles.drawerLabel}
                        label={'Sair'}
                        onPress={() => logoutUser()}
                    />

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerTitle}>OnlyOne Automação ©</Text>
                        <Text style={styles.footerSubtitle}>Todos os direitos reservados.</Text>
                        <Text style={styles.footerVersion}>version {version}</Text>
                    </View>
                </View>
                {/* MENU */}
            </DrawerContentScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    drawerSection: {

    },

    drawerItem: {
        borderWidth: 1,
        borderColor: palette.gray,
    },

    drawerLabel: {
        color: 'white',
        fontWeight: 'bold'
    },

    userNameLetter: {
        color: 'white',
        textTransform: 'uppercase',
        fontSize: 30,
        fontWeight: "bold"
    },

    userNameCircle: {
        width: 80,
        height: 80,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: palette.gray,
        borderRadius: 50
    },

    userNameContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20
    },

    userName: {
        color: 'white',
        marginTop: 10,
        fontWeight: 'bold'
    },

    footerTitle: {
        color: 'white',
        fontWeight: 'bold'
    },

    footerSubtitle: {
        color: 'white',
        fontSize: 10
    },

    footerContainer: {

        minHeight: 80,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },

    logoContainer: {
        height: 100,
        display: 'flex',
        justifyContent: "center",
        alignContent: 'center',
        alignItems: 'center'
    },

    logo: {
        resizeMode: 'contain',
        width: '80%',
    },

    footerVersion: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 10,
        marginTop: 5,
        color: palette.lightGreen
    }
})