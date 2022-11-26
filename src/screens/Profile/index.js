import { Dimensions, ScrollView, StyleSheet, Text, View, } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useState } from "react"

import TopHeader from './../../components/TopHeader'
import { palette } from "../../constants/colors"
import { getData } from "../../functions/store"

export default function (props) {
    const insets = useSafeAreaInsets()

    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState()
    const [checkUser, setCheckUser] = useState(false)

    useEffect(() => {
        async function fetchData() {
            setUserData(JSON.parse(await getData('onlyne-application-data')))
        }

        fetchData()
    }, [])

    useEffect(() => {
        // console.log(userData)
    }, [userData])

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
                    <MaterialIcons name={'person-pin'} size={30} color={palette.lightGreen} />

                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20, marginTop: 3, marginLeft: 5 }}>
                        Perfil
                    </Text>
                </View>


                <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                    <View style={{
                        width: 100,
                        height: 100,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: palette.borderGray,
                        borderRadius: 50,
                        opacity: 1
                    }}>
                        <View style={{
                            width: 90,
                            height: 90,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: palette.gray,
                            borderRadius: 50
                        }}>
                            <Text style={{ color: palette.white, textTransform: 'uppercase', fontWeight: 'bold', fontSize: 30 }}>
                                {userData ? userData.name[0] + userData.name[1] : ''}
                            </Text>
                        </View>
                    </View>

                    <Text style={{ color: palette.white, fontWeight: 'bold', marginTop: 10, fontSize: 18 }}>
                        {userData ? userData.name : ''}
                    </Text>

                    <Text style={{ color: palette.lightGreen, fontWeight: 'bold', marginTop: 5, fontSize: 13 }}>
                        {userData ? userData.plan_name : ''}
                    </Text>
                </View>

                <View style={{ borderTopWidth: 1, borderColor: palette.borderGray, borderBottomWidth: 1 }}>
                    <Text style={{ marginTop: 15, marginBottom: 15, marginLeft: 15, marginRight: 15, color: 'white', fontWeight: 'bold' }}>
                        Email: &nbsp;
                        <Text style={{ fontWeight: 'normal' }}>
                            {userData ? userData.email : ''}
                        </Text>
                    </Text>
                </View>

                <View style={{ borderColor: palette.borderGray, borderBottomWidth: 1 }}>
                    <Text style={{ marginTop: 15, marginBottom: 15, marginLeft: 15, marginRight: 15, color: 'white', fontWeight: 'bold' }}>
                        Telefone: &nbsp;
                        <Text style={{ fontWeight: 'normal' }}>
                            {userData ? userData.phone : ''}
                        </Text>
                    </Text>
                </View>

                <View style={{ borderColor: palette.borderGray, borderBottomWidth: 1 }}>
                    <Text style={{ marginTop: 15, marginBottom: 15, marginLeft: 15, marginRight: 15, color: 'white', fontWeight: 'bold' }}>
                        Data do cadastro: &nbsp;
                        <Text style={{ fontWeight: 'normal' }}>
                            {userData ? format_PTBR(userData.created_at) : ''}
                        </Text>
                    </Text>
                </View>

                <View style={{ padding: 10, marginTop: 20 }}>
                    <View style={{ backgroundColor: palette.green, height: 40, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <MaterialCommunityIcons name={'lock'} size={20} color={palette.white} style={{ marginRight: 5 }} />

                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 2 }}>
                            Alterar senha
                        </Text>
                    </View>
                </View>

                <View style={{ padding: 10, marginTop: 10 }}>
                    <View style={{ backgroundColor: palette.red, height: 40, borderRadius: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                        <MaterialCommunityIcons name={'information-outline'} size={20} color={palette.white} style={{ marginRight: 5 }} />

                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 2 }}>
                            Excluir minha conta
                        </Text>
                    </View>
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