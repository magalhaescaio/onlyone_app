import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, View, } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useState } from "react"
import axios from "axios"

import TopHeader from './../../components/TopHeader'
import { palette } from "../../constants/colors"
import { getData } from "../../functions/store"
import { endPoint } from "../../constants/default"

export default function (props) {
    const insets = useSafeAreaInsets()

    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState(false)
    const [checkUser, setCheckUser] = useState(false)
    const [devices, setDevices] = useState([])

    useEffect(() => {
        async function fetchData() {
            setUserData(JSON.parse(await getData('onlyne-application-data')))

            setCheckUser(true)
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (checkUser === true) {
            getDevices()
        }
    }, [checkUser])

    const getDevices = async () => {

        setLoading(true)

        const config = {
            headers: { Authorization: `Bearer ${userData.token}` }
        }

        try {
            const response = await axios.get(endPoint + '/api/v1/devices', config)

            setDevices(response.data)
        } catch (error) {

        }

        setLoading(false)

    }

    const format_PTBR = (date) => {
        var d = String(date)
        var splitDate = d.split('T')

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
                    <MaterialIcons name={'devices'} size={30} color={palette.lightGreen} />

                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 3, marginLeft: 5 }}>
                        Dispositivos
                    </Text>
                </View>

                <View style={{ padding: 10 }}>
                    <View style={{ backgroundColor: palette.darkBlue, height: 40, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <MaterialCommunityIcons name={'plus-circle'} size={20} color={palette.white} style={{marginRight: 5}} />

                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 2 }}>
                            Cadastrar novo dispositivo
                        </Text>
                    </View>
                </View>

                <View style={{ marginTop: 10, margin: 10, padding: 10 }}>

                    {loading
                        ? <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={'white'} />

                            <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 5 }}>
                                Carregando...
                            </Text>
                        </View>
                        : <View>
                            {devices.map((row, index) => {
                                var icon = 'info'
                                switch (row.device_type_name) {
                                    case 'Controlador de Nível':
                                        icon = 'water-pump'
                                        break;

                                    case 'Automação 6x2 circuitos':
                                        icon = 'cogs'
                                        break;

                                    case 'Interruptor':
                                        icon = 'lightbulb-on-outline'
                                        break;

                                    default:
                                        icon = 'lightbulb-on-outline'
                                        break;
                                }

                                return (
                                    <View key={index} style={{ marginTop: 10, backgroundColor: palette.gray, padding: 10, borderRadius: 8 }}>
                                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                                            <View style={{
                                                display: 'flex', width: '10%', justifyContent: 'center', alignItems: 'center'
                                            }}>
                                                <View style={{ height: 35, width: 35, borderRadius: '50%', backgroundColor: palette.darkGray, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                    <MaterialCommunityIcons name={icon} size={20} color={palette.lightGreen} />
                                                </View>
                                            </View>

                                            <View style={{ display: 'flex', width: '60%' }}>
                                                <View style={{ marginLeft: 20 }}>
                                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12, marginTop: 3 }}>
                                                        {row.name}
                                                    </Text>

                                                    <Text style={{ color: 'white', fontSize: 11 }}>
                                                        {row.model_name}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={{ display: 'flex', width: '30%', flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <View style={{
                                                    backgroundColor: palette.darkGray,
                                                    padding: 5,
                                                    width: 35,
                                                    borderRadius: 5,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <MaterialCommunityIcons name={'pen'} size={22} color={palette.lightGreen} />
                                                </View>

                                                <View style={{
                                                    backgroundColor: palette.darkGray,
                                                    padding: 5,
                                                    width: 35,
                                                    borderRadius: 5,
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginLeft: 5
                                                }}>
                                                    <MaterialCommunityIcons name={'close'} size={22} color={palette.orange} />
                                                </View>
                                            </View>
                                        </View>


                                        <View style={{ marginLeft: 57, marginTop: 10 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>
                                                Mac Address: &nbsp;
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                    {row.mac_address}
                                                </Text>
                                            </Text>
                                        </View>

                                        <View style={{ marginLeft: 57, marginTop: 10 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>
                                                Status: &nbsp;
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                    {row.status}
                                                </Text>
                                            </Text>
                                        </View>

                                        <View style={{ marginLeft: 57, marginTop: 10 }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 12, color: 'white' }}>
                                                Cadastro: &nbsp;
                                                <Text style={{ fontWeight: 'normal', fontSize: 12 }}>
                                                    {format_PTBR(row.created_at)}
                                                </Text>
                                            </Text>
                                        </View>

                                        {/* 
                                        mac_address
                                        created_at
                                        status */}
                                    </View>
                                )
                            })}
                        </View>
                    }
                </View>


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