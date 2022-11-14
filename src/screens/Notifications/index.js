import { useEffect, useState } from "react"
import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View, } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

import TopHeader from './../../components/TopHeader'
import { palette } from "../../constants/colors"
import { getData } from "../../functions/store"
import axios from "axios"
import { endPoint } from "../../constants/default"

export default function (props) {
    const insets = useSafeAreaInsets()


    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState()
    const [checkUser, setCheckUser] = useState(false)
    const [notifications, setNotifications] = useState([])


    useEffect(() => {
        async function fetchData() {
            setUserData(JSON.parse(await getData('onlyne-application-data')))
            setCheckUser(true)
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (checkUser === true) {
            getNotifications()
        }
    }, [checkUser])

    const getNotifications = async () => {
        setLoading(true)

        const config = {
            headers: { Authorization: `Bearer ${userData.token}` }
        }

        try {
            const response = await axios.get(endPoint + '/api/v1/notifications', config)
            setNotifications(response.data.data)
        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    const format_PTBR = (date) => {
        var d = String(date)
        var splitDate = d.split(' ')

        var longDate = splitDate[0]
        var timeDate = splitDate[1]

        var time = timeDate[0] + timeDate[1] + ':' + timeDate[3] + timeDate[4] + ':' + timeDate[6] + timeDate[7]
        var nDate = longDate[8] + longDate[9] + '/' + longDate[5] + longDate[6] + '/' + longDate[0] + longDate[1] + longDate[2] + longDate[3]


        return nDate + ' ' + time
    }

    return (
        <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
            <TopHeader />

            <ScrollView style={{ marginBottom: insets.top }}>

                <View style={{
                    display: 'flex', flexDirection: 'row', padding: 5, marginLeft: 10, marginRight: 10, marginTop: 10
                }}>
                    <MaterialIcons name={'notifications'} size={30} color={palette.lightGreen} />

                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 3, marginLeft: 5 }}>
                        Notificações
                    </Text>
                </View>

                {loading
                    ? <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator color={'white'} />

                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 5 }}>
                            Carregando...
                        </Text>
                    </View>
                    : <View style={{ marginTop: 10 }}>
                        {notifications.map((row, index) => {
                            if (row.message) {
                                return (
                                    <View key={index} style={{ borderBottomWidth: 1, borderColor: 'white', minHeight: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                            <View style={{ width: '10%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ width: 30, height: 30, backgroundColor: palette.gray, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>ON</Text>
                                                </View>
                                            </View>

                                            <View style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
                                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 14 }}>OnlyOne</Text>
                                            </View>

                                            <View style={{ width: '30%', display: 'flex', justifyContent: 'center' }}>
                                                <Text style={{ color: 'white', fontSize: 11 }}>
                                                    {format_PTBR(row.notification_date)}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={{marginTop: 10, marginBottom: 10, marginRight: 20, marginLeft: 20}}>
                                            <Text style={{ color: 'white' }}>
                                                {row.message}
                                            </Text>
                                        </View>
                                    </View>
                                )
                            }
                        })}

                    </View>
                }

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: palette.darkGray,
        minHeight: Dimensions.get('window').height,
    },
})