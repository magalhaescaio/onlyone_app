import { useEffect, useState } from "react"
import axios from "axios"
import { ActivityIndicator, Animated, Dimensions, LogBox, ScrollView, StatusBar, StyleSheet, Text, View, } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import CircularProgress from 'react-native-circular-progress-indicator'
import { useNavigation } from "@react-navigation/native"

import TopHeader from './../../components/TopHeader'
import { palette } from "../../constants/colors"
import { getData, storeData } from "../../functions/store"
import { endPoint } from "./../../constants/default"
import Blink from "./../../functions/blink"
import { TouchableOpacity } from "react-native-gesture-handler"

LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`'])

export default function (props) {
    const navigation = useNavigation()
    const insets = useSafeAreaInsets()

    const [userData, setUserData] = useState()
    const [checkUser, setCheckUser] = useState(false)
    const [ambients, setAmbients] = useState([])
    const [loading, setLoading] = useState(false)
    const [animation, setAnimation] = useState(new Animated.Value(0));
    const [stateAnimation, setStateAnimation] = useState(false)
    const [loadingCommand, setLoadingCommand] = useState(false)

    const rotateInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    })

    const animatedStyles = {
        transform: [
            { rotate: rotateInterpolate }
        ]
    }

    const startAnimation = () => {
        if (!stateAnimation) {
            setStateAnimation(true)
            Animated.loop(Animated.timing(animation, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true
            })).start()
        }
    }

    useEffect(() => {
        async function fetchData() {
            setUserData(JSON.parse(await getData('onlyne-application-data')))
            // setAmbients(JSON.parse(await getData('onlyne-application-ambients')))
            setCheckUser(true)
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (checkUser === true) {
            if (!ambients) {
                getDevices(true)
            } else {
                setInterval(() => {
                    getDevices(false)
                }, 8000)
            }
        }
    }, [checkUser])

    const parseUTCDate = dateString => {
        const dateParams = dateString.replace(/ UTC/, '').split(/[\s-:]/)
        dateParams[1] = (parseInt(dateParams[1], 10) - 1).toString()

        return new Date(Date.UTC(...dateParams))
    }

    const formatToPTBR = (date) => {
        if (date) {
            var nDate = date.split(" ")

            var newDate = nDate[0]
            newDate = newDate.split('-')

            var newTime = nDate[1]

            return newDate[2] + '/' + newDate[1] + '/' + newDate[0] + ' ' + newTime
        }
    }

    const getDevices = async (loading) => {
        const config = {
            headers: { Authorization: `Bearer ${userData.token}` }
        }

        if (loading) {
            setLoading(true)
        }

        try {
            const response = await axios.get(endPoint + '/api/v1/ambients', config)

            var array_ambients = []
            var myambients = response.data.ambient

            myambients.map((row) => {
                var array_devices = []
                var array_painel = []

                row.ambient_devices.map((r) => {

                    if (r.deleted_at) {

                    } else {
                        r.devices.map((d) => {
                            if (d.module.spool.length > 2) {
                                var device_connection = true
                            } else {
                                var device_connection = false
                            }

                            var l_update = d.module.last_update

                            if (d.type.id === 22 || d.type.id === 20 || d.type.id === 23 || d.type.id === 24) {
                                l_update = d.module.feedback[0].last_update
                            }

                            var last_device_update = new Date(parseUTCDate(l_update))

                            // last_device_update = addHours(3, last_device_update)
                            // alert(last_device_update)
                            var actual_date = new Date()

                            const diffTime = Math.abs(actual_date - last_device_update);
                            var seconds = Math.floor((diffTime / 1000))

                            if (seconds < 20) {
                                device_connection = false
                            } else {
                                device_connection = true
                            }

                            var actual_alias = 0
                            var feedback_status = []

                            if (d.module.feedback) {
                                d.module.feedback.map((row, index) => {
                                    var alias = parseInt(row.button_alias)
                                    var status = parseInt(row.status)

                                    if (status === -1) {
                                        if (alias > actual_alias) {
                                            actual_alias = alias
                                        }
                                    }

                                    if (row.type === 'alert' || row.type === 'trigger') {
                                        if (row.status === -1) {
                                            var f_status = {
                                                type: row.type,
                                                status: row.status,
                                                alias: row.button_alias,
                                                critical_alert: row.critical_alert,
                                                last_update: row.last_update,
                                                color: row.color,
                                                icon: row.icon,
                                                description: row.description,
                                                has_command: row.has_command,
                                                command: row.command,
                                            }

                                            feedback_status.push(f_status)
                                        }
                                    }
                                })
                            }

                            array_devices.push({
                                "id": d.id,
                                "mac_address": d.mac_address,
                                "name": d.name,
                                "status": d.module.status,
                                "type": d.type.name,
                                "id_type": d.type.id,
                                "icon": d.type.icon_media_id,
                                "module_id": d.module_id,
                                "notifications": true,
                                "last_update": d.module.last_update,
                                "offline": device_connection,
                                "feedback": d.module.feedback ? d.module.feedback : null,
                                "actual_alias": actual_alias,
                                "feedback_status": feedback_status,
                                "color": feedback_status[0] ? feedback_status[0].color : null,
                                "array_painel": array_painel
                            })
                        })
                    }
                })

                var my_ambient = {
                    "id": row.id,
                    "name": row.name,
                    "status": row.status,
                    "devices": array_devices,
                }

                array_ambients.push(my_ambient)
            })

            setAmbients(array_ambients)
            storeData('onlyne-application-ambients', JSON.stringify(array_ambients))

        } catch (error) {

        }

        if (loading) {
            setLoading(false)
        }

    }

    const renderLevelController = (feedback, alias, name, feedback_status, mac_address, ambient, device, color, offline) => {
        var t = false
        var temp = 0

        var critico = feedback.find(item => item.description === 'nivel_critico')
        var min = feedback.find(item => item.description === '25')

        var sensor_temperatura = feedback.find(item => item.description === 'sensor_temperatura')
        if (sensor_temperatura) {
            temp = sensor_temperatura.status
        }

        var sinal = feedback.find(item => item.description === 'sinal')
        var transbordo = feedback.find(item => item.description === 'transbordo')
        var nivel_critico = feedback.find(item => item.description === 'nivel_critico')

        if (critico.status === 0 && min.status === 0) {
            t = true
            alias = 15
        }

        if (critico.status === -1) {
            alias = 15
        }

        var temp_color = ''

        if (temp > -20 && temp < 0) {
            temp_color = palette.darkBlue
        } else if (temp > 0 && temp < 10) {
            temp_color = palette.blue
        } else if (temp > 10 && temp < 20) {
            temp_color = palette.green
        } else if (temp > 20 && temp < 40) {
            temp_color = palette.yellow
        } else {
            temp_color = palette.orange
        }

        return (
            <View>
                {sinal.status.toString() === '-1'
                    ? <>
                        <View style={styles.alertRedOpt}>
                            <Blink>
                                <MaterialCommunityIcons
                                    name={'signal-off'}
                                    size={20}
                                    color={palette.orange}
                                />
                            </Blink>

                            <Text style={{ color: palette.orange, fontWeight: 'bold', marginTop: 3 }}> {sinal.button_alias} </Text>
                        </View>
                    </>
                    : <></>
                }

                {nivel_critico.status.toString() === '-1'
                    ? <>
                        <View style={styles.alertRedOpt}>
                            <Blink>
                                <MaterialCommunityIcons
                                    name={'waves-arrow-up'}
                                    size={20}
                                    color={palette.orange}
                                />
                            </Blink>

                            <Text style={{ color: palette.orange, fontWeight: 'bold', marginTop: 3, marginLeft: 5 }}>
                                {nivel_critico.button_alias}
                            </Text>
                        </View>
                    </>
                    : <></>
                }

                {transbordo.status.toString() === '-1'
                    ? <>
                        <View style={styles.alertBlueOpt}>
                            <Blink>
                                <MaterialCommunityIcons
                                    name={'water-percent-alert'}
                                    size={20}
                                    color={palette.blue}
                                />
                            </Blink>

                            <Text style={{ color: palette.blue, fontWeight: 'bold', marginTop: 3, marginLeft: 5 }}>
                                {transbordo.button_alias}
                            </Text>
                        </View>
                    </>
                    : <></>
                }

                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20, flexDirection: 'row' }}>
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '40%' }}>
                        <Text style={{ marginBottom: 5, color: 'white', fontWeight: 'bold' }}>
                            Nível
                        </Text>

                        <CircularProgress
                            value={alias}
                            valueSuffix={'%'}
                            activeStrokeWidth={12}
                            progressValueColor={palette.white}
                            activeStrokeColor={palette.green}
                            activeStrokeSecondaryColor={palette.lightGreen}
                            inActiveStrokeOpacity={0.7}
                        />
                    </View>

                    {temp
                        ?
                        <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', width: '40%', height: '100%' }}>
                            <Text style={{ marginBottom: 5, color: 'white', fontWeight: 'bold' }}>
                                Temperatura
                            </Text>

                            <CircularProgress
                                value={temp}
                                valueSuffix={'°C'}
                                activeStrokeWidth={12}
                                progressValueColor={palette.white}
                                activeStrokeColor={
                                    temp_color
                                }
                                activeStrokeSecondaryColor={palette.red}
                                maxValue={40}
                                inActiveStrokeOpacity={0.7}
                            />
                        </View>
                        : <></>
                    }
                </View>

                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white', marginTop: 5 }}>
                    Ult. atualização
                </Text>

                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white' }}>
                    {formatToPTBR(feedback[1].last_update)}
                </Text>

            </View>
        )
    }

    const renderPanel = (feedback, alias, name, feedback_status, mac_address, ambient, device, color, offline) => {
        startAnimation()

        var falha_bomba_1 = '0';
        var falha_bomba_2 = '0';

        var bomba_1_ok = feedback.find(item => item.description === 'bomba_1_ok')
        var bomba_1 = feedback.find(item => item.description === 'bomba_1')

        var bomba_2_ok = feedback.find(item => item.description === 'bomba_2_ok')
        var bomba_2 = feedback.find(item => item.description === 'bomba_2')

        var nivel_critico_superior = feedback.find(item => item.description === 'nivel_critico_superior')
        var manual = feedback.find(item => item.description === 'manual')
        var automatico = feedback.find(item => item.description === 'automatico')
        var sistema_ligado = feedback.find(item => item.description === 'sistema_ligado')
        var abastecimento_ok = feedback.find(item => item.description === 'abastecimento_ok')
        var extravasao = feedback.find(item => item.description === 'extravasao')
        var nivel_critico_cisterna = feedback.find(item => item.description === 'nivel_critico_cisterna')
        var falha_de_motor = feedback.find(item => item.description === 'falha_de_motor')

        if (falha_de_motor.status.toString() === '1') {
            if (bomba_1_ok.status.toString() === '0') {
                falha_bomba_1 = '1'
            } else {
                falha_bomba_1 = '0'
            }

            if (bomba_2_ok.status.toString() === '0') {
                falha_bomba_2 = '1'
            } else {
                falha_bomba_2 = '0'
            }
        }

        return (
            <View>
                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {falha_de_motor
                        ? <>
                            <View style={falha_de_motor.status.toString() === '0' ? styles.defaultOpt : styles.redOpt}>
                                {falha_de_motor.status.toString() === '0'
                                    ? <MaterialCommunityIcons
                                        name={'engine-outline'}
                                        size={30}
                                        color={palette.iconWhite}
                                    />
                                    : <Blink>
                                        <MaterialCommunityIcons
                                            name={'engine-off-outline'}
                                            size={30}
                                            color={palette.orange}
                                        />
                                    </Blink>
                                }

                                {falha_de_motor.status.toString() === '0'
                                    ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {falha_de_motor.button_alias}
                                    </Text>
                                    : <Text style={{ color: palette.orange, fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {falha_de_motor.button_alias}
                                    </Text>
                                }
                            </View>
                        </>
                        : <></>
                    }

                    {manual
                        ? <>
                            <View style={manual.status.toString() === '0' ? styles.defaultOpt : styles.greenOpt}>
                                {manual.status.toString() === '0'
                                    ? <MaterialCommunityIcons
                                        name={'alpha-m-box-outline'}
                                        size={30}
                                        color={palette.iconWhite}
                                    />
                                    : <Blink>
                                        <MaterialCommunityIcons
                                            name={'alpha-m-box-outline'}
                                            size={30}
                                            color={palette.lightGreen}
                                        />
                                    </Blink>
                                }

                                {manual.status.toString() === '0'
                                    ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {manual.button_alias}
                                    </Text>
                                    : <Text style={{ color: palette.lightGreen, fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {manual.button_alias}
                                    </Text>
                                }
                            </View>
                        </>
                        : <></>
                    }

                    {automatico
                        ? <>
                            <View style={automatico.status.toString() === '0' ? styles.defaultOpt : styles.greenOpt}>
                                {automatico.status.toString() === '0'
                                    ? <MaterialCommunityIcons
                                        name={'alpha-a-box-outline'}
                                        size={30}
                                        color={palette.iconWhite}
                                    />
                                    : <Blink>
                                        <MaterialCommunityIcons
                                            name={'alpha-a-box-outline'}
                                            size={30}
                                            color={palette.lightGreen}
                                        />
                                    </Blink>
                                }

                                {automatico.status.toString() === '0'
                                    ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {automatico.button_alias}
                                    </Text>
                                    : <Text style={{ color: palette.lightGreen, fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {automatico.button_alias}
                                    </Text>
                                }
                            </View>
                        </>
                        : <></>
                    }

                    {sistema_ligado
                        ? <>
                            <View style={sistema_ligado.status.toString() === '0' ? styles.defaultOpt : styles.greenOpt}>
                                {sistema_ligado.status.toString() === '0'
                                    ? <MaterialCommunityIcons
                                        name={'power-settings'}
                                        size={30}
                                        color={palette.iconWhite}
                                    />
                                    : <Blink>
                                        <MaterialCommunityIcons
                                            name={'power-settings'}
                                            size={30}
                                            color={palette.lightGreen}
                                        />
                                    </Blink>
                                }

                                {sistema_ligado.status.toString() === '0'
                                    ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {sistema_ligado.button_alias}
                                    </Text>
                                    : <Text style={{ color: palette.lightGreen, fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {sistema_ligado.button_alias}
                                    </Text>
                                }
                            </View>
                        </>
                        : <></>
                    }
                </View>

                <View style={{ display: 'flex', flexDirection: 'row' }}>
                    {nivel_critico_superior
                        ? <>
                            <View style={nivel_critico_superior.status.toString() === '0' ? styles.defaultOpt : styles.redOpt}>
                                {nivel_critico_superior.status.toString() === '0'
                                    ? <MaterialCommunityIcons
                                        name={'waves-arrow-up'}
                                        size={30}
                                        color={palette.iconWhite}
                                    />
                                    : <Blink>
                                        <MaterialCommunityIcons
                                            name={'waves-arrow-up'}
                                            size={30}
                                            color={palette.ornage}
                                        />
                                    </Blink>
                                }

                                {nivel_critico_superior.status.toString() === '0'
                                    ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {nivel_critico_superior.button_alias}
                                    </Text>
                                    : <Text style={{ color: palette.orange, fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {nivel_critico_superior.button_alias}
                                    </Text>
                                }
                            </View>
                        </>
                        : <></>
                    }

                    {nivel_critico_cisterna
                        ? <>
                            <View style={nivel_critico_cisterna.status.toString() === '0' ? styles.defaultOpt : styles.greenOpt}>
                                {nivel_critico_cisterna.status.toString() === '0'
                                    ? <MaterialCommunityIcons
                                        name={'water-boiler'}
                                        size={30}
                                        color={palette.iconWhite}
                                    />
                                    : <Blink>
                                        <MaterialCommunityIcons
                                            name={'water-boiler'}
                                            size={30}
                                            color={palette.lightGreen}
                                        />
                                    </Blink>
                                }

                                {nivel_critico_cisterna.status.toString() === '0'
                                    ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {nivel_critico_cisterna.button_alias}
                                    </Text>
                                    : <Text style={{ color: palette.lightGreen, fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {nivel_critico_cisterna.button_alias}
                                    </Text>
                                }
                            </View>
                        </>
                        : <></>
                    }


                    {abastecimento_ok
                        ? <>
                            <View style={abastecimento_ok.status.toString() === '0' ? styles.defaultOpt : styles.greenOpt}>
                                {abastecimento_ok.status.toString() === '0'
                                    ? <MaterialCommunityIcons
                                        name={'diving-scuba-tank'}
                                        size={30}
                                        color={palette.iconWhite}
                                    />
                                    : <Blink>
                                        <MaterialCommunityIcons
                                            name={'diving-scuba-tank'}
                                            size={30}
                                            color={palette.lightGreen}
                                        />
                                    </Blink>
                                }

                                {abastecimento_ok.status.toString() === '0'
                                    ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {abastecimento_ok.button_alias}
                                    </Text>
                                    : <Text style={{ color: palette.lightGreen, fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {abastecimento_ok.button_alias}
                                    </Text>
                                }
                            </View>
                        </>
                        : <></>
                    }

                    {extravasao
                        ? <>
                            <View style={extravasao.status.toString() === '0' ? styles.defaultOpt : styles.greenOpt}>
                                {extravasao.status.toString() === '0'
                                    ? <MaterialCommunityIcons
                                        name={'waterfall'}
                                        size={30}
                                        color={palette.iconWhite}
                                    />
                                    : <Blink>
                                        <MaterialCommunityIcons
                                            name={'waterfall'}
                                            size={30}
                                            color={palette.lightGreen}
                                        />
                                    </Blink>
                                }

                                {extravasao.status.toString() === '0'
                                    ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {extravasao.button_alias}
                                    </Text>
                                    : <Text style={{ color: palette.lightGreen, fontWeight: 'bold', fontSize: 11, textAlign: 'center' }}>
                                        {extravasao.button_alias}
                                    </Text>
                                }
                            </View>
                        </>
                        : <></>
                    }
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', marginTop: 20, marginBottom: 20, minHeight: 20 }}>

                    <View style={{ width: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: palette.borderGray, borderRadius: 8 }}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                                Bomba 1
                            </Text>
                        </View>

                        <View>
                            <Animated.View style={bomba_1.status.toString() === '1' ? animatedStyles : false} >
                                <MaterialCommunityIcons
                                    name={'cog'}
                                    size={40}
                                    color={palette.lightGreen}
                                    style={{ marginTop: 10, marginBottom: 10 }}
                                />
                            </Animated.View>
                        </View>

                        {falha_bomba_1 === '1'
                            ? <>
                                <View style={{ position: 'absolute', zIndex: 2, top: 18 }}>
                                    <Blink>
                                        <MaterialCommunityIcons
                                            name={'close-thick'}
                                            size={50}
                                            color={palette.orange}
                                            style={{ marginTop: 10, marginBottom: 10 }}
                                        />
                                    </Blink>
                                </View>
                            </>
                            : <></>
                        }

                        <View style={{ marginBottom: 10 }}>
                            {bomba_1_ok.status.toString() === '1'
                                ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                                    Operando
                                </Text>
                                : <Text style={{ color: 'white', fontWeight: 'bold', color: palette.yellow, fontSize: 12 }}>
                                    Inoperante
                                </Text>
                            }
                        </View>
                    </View>

                    <View style={{ width: '48%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: palette.borderGray, borderRadius: 8, marginLeft: '2%' }}>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                                Bomba 2
                            </Text>
                        </View>

                        <View>
                            <Animated.View style={bomba_2.status.toString() === '1' ? animatedStyles : false} >
                                <MaterialCommunityIcons
                                    name={'cog'}
                                    size={40}
                                    color={palette.lightGreen}
                                    style={{ marginTop: 10, marginBottom: 10 }}
                                />
                            </Animated.View>
                        </View>

                        {falha_bomba_2 === '1'
                            ? <>
                                <View style={{ position: 'absolute', zIndex: 2, top: 18 }}>
                                    <Blink>
                                        <MaterialCommunityIcons
                                            name={'close-thick'}
                                            size={50}
                                            color={palette.orange}
                                            style={{ marginTop: 10, marginBottom: 10 }}
                                        />
                                    </Blink>
                                </View>
                            </>
                            : <></>
                        }

                        <View style={{ marginBottom: 10 }}>
                            {bomba_2_ok.status.toString() === '1'
                                ? <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>
                                    Operando
                                </Text>
                                : <Text style={{ color: 'white', fontWeight: 'bold', color: palette.yellow, fontSize: 12 }}>
                                    Inoperante
                                </Text>
                            }
                        </View>
                    </View>

                </View>

                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white', marginTop: 5 }}>
                    Ult. atualização
                </Text>

                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white' }}>
                    {formatToPTBR(feedback[1].last_update)}
                </Text>
            </View >
        )
    }

    const sendCommand = (status) => {


        setLoadingCommand(true)

        var command = 'GP1'

        if (status === '-1') {
            command = 'GP2'
        } else {
            command = 'GP1'
        }

        var url = "http://api.onlyonesistemas.com.br/test/command?mac_address=5C:CF:7F:3D:7B:E2&user_id=44826&command=" + command + "& HTTP/1.1"

        try {
            const response = axios.get(url)
            getDevices(false)
        } catch (err) {

        }

        setLoadingCommand(false)

    }

    return (
        <SafeAreaView style={styles.safeArea} forceInset={{ top: 'always' }}>
            <TopHeader />

            <StatusBar
                barStyle={'light-content'}
            />

            <ScrollView style={{ marginBottom: insets.top }}>

                <View style={styles.nameContainer}>
                    <View style={{ display: 'flex', width: '15%', justifyContent: 'center', alignItems: 'center', marginLeft: 20 }}>
                        <TouchableOpacity style={{ backgroundColor: palette.gray, borderRadius: '50%', height: 50, width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('BottomProfile')}>
                            <Text style={{ color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {userData ? userData.name[0] + userData.name[1] : ''}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ display: 'flex', width: '63%', height: '100%', justifyContent: 'center', marginLeft: 15 }}>
                        <Text style={styles.welcome}>
                            Olá
                        </Text>
                        <Text style={{ color: palette.lightGreen }} onPress={() => navigation.navigate('BottomProfile')}>@{userData ? userData.name : false}</Text>
                    </View>

                    <View style={{ display: 'flex', width: '13%', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name={'chevron-right'} size={25} color={palette.lightGreen} onPress={() => navigation.navigate('BottomProfile')} />
                    </View>
                </View>

                {/* SHORTCUTS */}
                <View style={{ height: 90, margin: 5, display: 'flex', flexDirection: 'row' }}>
                    <View style={{ width: '20%', height: '100%', padding: 5 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('BottomDevices')} style={{ borderRadius: 8, backgroundColor: palette.gray, height: '100%' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                <MaterialIcons name={'devices'} size={38} color={palette.lightGreen} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white', fontWeight: 'bold', marginTop: 3 }}>
                                    Dispositivos
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '20%', height: '100%', padding: 5 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('ReportsStackNavigator')} style={{ borderRadius: 8, backgroundColor: palette.gray, height: '100%' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                <MaterialIcons name={'bar-chart'} size={38} color={palette.lightGreen} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white', fontWeight: 'bold', marginTop: 3 }}>
                                    Relatórios
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '20%', height: '100%', padding: 5 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('BottomContacts')} style={{ borderRadius: 8, backgroundColor: palette.gray, height: '100%' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                <MaterialIcons name={'group'} size={38} color={palette.lightGreen} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white', fontWeight: 'bold', marginTop: 3 }}>
                                    Contatos
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: '20%', height: '100%', padding: 5 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('FaqStackNavigator')} style={{ borderRadius: 8, backgroundColor: palette.gray, height: '100%' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                <MaterialIcons name={'help'} size={38} color={palette.lightGreen} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white', fontWeight: 'bold', marginTop: 3 }}>
                                    FAQ
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '20%', height: '100%', padding: 5 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('SettingsStackNavigator')} style={{ borderRadius: 8, backgroundColor: palette.gray, height: '100%' }}>
                            <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                                <MaterialIcons name={'settings'} size={38} color={palette.lightGreen} />
                            </View>
                            <View>
                                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white', fontWeight: 'bold', marginTop: 3 }}>
                                    Config.
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                {/* SHORTCUTS */}

                {/* DASHBOARD */}

                {loading
                    ? <View style={{ marginTop: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator color={'white'} />

                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 5 }}>
                            Carregando...
                        </Text>
                    </View>
                    : <>
                  
                        {ambients ? ambients.map((row, index) => {
                            return (
                                <View
                                    key={index}
                                    style={{ minHeight: 200, backgroundColor: palette.gray, margin: 10, borderRadius: 10 }}
                                >
                                    <View style={{ display: 'flex', flexDirection: 'row', padding: 10 }}>
                                        <MaterialIcons name={'home-work'} size={20} color={palette.lightGreen} />
                                        <Text style={{ color: 'white', fontWeight: 'bold', marginTop: 3, marginLeft: 5 }}>
                                            {row.name}
                                        </Text>
                                    </View>

                                    <View style={{ marginLeft: 10, marginRight: 10 }}>
                                        {row.devices.map((r, i) => {
                                            return (
                                                <View key={i} style={{ borderWidth: 1, borderColor: palette.borderGray, borderRadius: 5, padding: 10, marginTop: 10, marginBottom: 10 }}>
                                                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                                                        {r.type === 'Controlador de Nível'
                                                            ? <><MaterialCommunityIcons name={'water-pump'} size={20} color={palette.lightGreen} /></>
                                                            : <></>
                                                        }
                                                        {r.type === 'Automação 6x2 circuitos'
                                                            ? <><MaterialCommunityIcons name={'cogs'} size={20} color={palette.lightGreen} /></>
                                                            : <></>
                                                        }
                                                        {r.type === 'Interruptor'
                                                            ? <><MaterialCommunityIcons name={'lightbulb-on-outline'} size={20} color={palette.lightGreen} /></>
                                                            : <></>
                                                        }


                                                        <Text style={{ fontWeight: "bold", color: "white", marginTop: 5, marginLeft: 5 }}>
                                                            {r.name}
                                                        </Text>
                                                    </View>

                                                    {r.type === 'Controlador de Nível'
                                                        ? <>
                                                            {renderLevelController(r.feedback, r.actual_alias, r.name, r.feedback_status, r.mac_address, index, i, r.color, r.offline)}
                                                        </>
                                                        : <></>
                                                    }

                                                    {r.type === 'Automação 6x2 circuitos'
                                                        ? <>
                                                            {renderPanel(r.feedback, r.actual_alias, r.name, r.feedback_status, r.mac_address, index, i, r.color, r.offline)}
                                                        </>
                                                        : <></>
                                                    }

                                                    {r.type === 'Interruptor'
                                                        ? <>

                                                            {loadingCommand
                                                                ? <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2, top: 42.3}}>
                                                                    <View style={{ width: 85, height: 85,  borderRadius: '50%', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: 0.7 }}>
                                                                        <ActivityIndicator color={'white'} />

                                                                    </View>
                                                                </View>
                                                                : <></>
                                                            }

                                                            <TouchableOpacity onPress={() => [setLoadingCommand(true), sendCommand(r.status)]}>
                                                                <View style={{
                                                                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                                                                }}>
                                                                    <View style={{ height: 85, width: 85, borderRadius: '50%', backgroundColor: r.status === 1 ? palette.darkGray : palette.lightGreen, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: r.status === 1 ? 0.5 : 1 }}>
                                                                        <View style={{ height: 80, width: 80, borderRadius: '50%', backgroundColor: palette.darkGray, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                            <MaterialCommunityIcons
                                                                                name={r.status === 1 ? 'lightbulb-off-outline' : 'lightbulb-on-outline'}
                                                                                size={40}
                                                                                color={palette.lightGreen}
                                                                            />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </TouchableOpacity>

                                                            <View style={{ marginTop: 10 }}>
                                                                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white', marginTop: 5 }}>
                                                                    Ult. atualização
                                                                </Text>

                                                                <Text style={{ fontSize: 11, textAlign: 'center', color: 'white' }}>
                                                                    {formatToPTBR(r.last_update)}
                                                                </Text>
                                                            </View>
                                                        </>
                                                        : <></>
                                                    }
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            )
                        }) : false }
                        {/* <View >

                        </View> */}
                    </>
                }
                {/* DASHBOARD */}


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

    nameContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: 90
    },

    welcome: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
    },

    shortcutContainer: {
        borderWidth: 1,
        borderColor: 'white',
        // height: 100
    },

    defaultOpt: {
        borderWidth: 1,
        width: '22%',
        height: 75,
        padding: 5,
        borderRadius: 8,
        marginTop: 10,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: palette.borderGray,
        margin: 5,
        borderColor: palette.gray
    },

    greenOpt: {
        borderWidth: 1,
        width: '22%',
        height: 75,
        padding: 5,
        borderRadius: 8,
        marginTop: 10,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: palette.borderGray,
        margin: 5,
        borderColor: palette.lightGreen
    },

    redOpt: {
        borderWidth: 1,
        width: '22%',
        height: 75,
        padding: 5,
        borderRadius: 8,
        marginTop: 10,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: palette.borderGray,
        margin: 5,
        borderColor: palette.orange
    },

    alertRedOpt: {
        borderWidth: 1,
        width: '98%',
        height: 45,
        padding: 5,
        borderRadius: 8,
        marginTop: 10,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: palette.borderGray,
        margin: 5,
        borderColor: palette.orange,
        flexDirection: 'row'
    },

    alertBlueOpt: {
        borderWidth: 1,
        width: '98%',
        height: 45,
        padding: 5,
        borderRadius: 8,
        marginTop: 10,
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: palette.borderGray,
        margin: 5,
        borderColor: palette.blue,
        flexDirection: 'row'
    }
})