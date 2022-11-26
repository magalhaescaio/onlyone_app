import { useContext, useEffect, useState } from "react"
import { Image, StatusBar, StyleSheet, Text, TouchableHighlight, View } from "react-native"
import { MaterialIcons } from '@expo/vector-icons'
import { DrawerActions, useNavigation } from "@react-navigation/native"

import LogoOnlyOneWhite from "./../../assets/images/onlyone_white.png"
import { palette } from "../../constants/colors"
import AuthContext from "../../context/Auth"
import { getData } from "../../functions/store"
import { TouchableOpacity } from "react-native-gesture-handler"

export default function TopHeader(props) {
    const [userData, setUserData] = useState()

    const navigation = useNavigation()

    const openMenu = () => {
        navigation.dispatch(DrawerActions.openDrawer())
    }

    useEffect(() => {
        async function fetchData() {
            setUserData(JSON.parse(await getData('onlyne-application-data')))
        }

        fetchData()
    }, [])

    return (
        <View style={styles.menuContent}>

            {/* <StatusBar
                barStyle={'light-content'}
            /> */}

            <View style={styles.menuRow}>

                <View style={styles.menuIcon}>
                    <MaterialIcons
                        onPress={() => openMenu()}
                        name={'menu'}
                        size={38}
                        color={palette.white}
                    />
                </View>


                <View style={styles.logoContainer}>
                    <Image source={LogoOnlyOneWhite} style={styles.logo} />
                </View>

                <View style={{ width: '20%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                        <TouchableHighlight
                            onPress={() => navigation.navigate('NotificationsStackNavigator')}
                            style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <MaterialIcons
                                name={'notifications-none'}
                                size={25}
                                color={palette.white}
                            />
                        </TouchableHighlight>


                        <View style={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

                            <TouchableOpacity
                                onPress={() => navigation.navigate('BottomProfile')}
                                style={{ backgroundColor: palette.gray, borderRadius: 50, height: 30, width: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {userData ? userData.name[0] + userData.name[1] : ''}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    menuIcon: {
        width: '20%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    menuRow: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%',
        borderBottomWidth: 1,
        borderColor: palette.gray,
    },

    menuContent: {
        // borderBottomWidth: 1,
        // borderColor: 'white',
        height: 50,
        width: '100%',
        // position: 'fixed',
        top: 0
    },

    logo: {
        resizeMode: 'contain',
        width: '52%',
    },

    logoContainer: {

        width: '60%',
        height: 50,
        display: 'flex',
        display: 'flex',
        justifyContent: "center",
        alignContent: 'center',
        alignItems: 'center'
    }
})