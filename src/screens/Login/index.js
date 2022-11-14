import { ScrollView, StyleSheet, Text, TextInput, View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Dimensions } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { MaterialIcons } from '@expo/vector-icons'
import { useContext, useState } from "react"
import Checkbox from 'expo-checkbox'
import axios from "axios"

import { endPoint, version } from './../../constants/default'
import { storeData } from "../../functions/store"
import AuthContext from "../../context/Auth"
import LogoOnlyOneWhite from "./../../assets/images/onlyone_white.png"
import { palette } from "../../constants/colors"


export default function LoginScreen() {
    const { loginUser } = useContext(AuthContext)

    const [email, setEmail] = useState('developer.caio@gmail.com')
    const [password, setPassword] = useState('123456')
    const [passwordVisible, setPasswordVisible] = useState()
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)

    const submitLogin = async () => {
        var errors = 0

        if (!email) {
            errors++
        }

        if (!password) {
            errors++
        }

        if (errors > 0) {
            Alert.alert(
                "Não foi possível efetuar login",
                "Verifique os campos de e-mail e senha e tente novamente",
                [
                    {
                        text: "Fechar",
                        style: "cancel"
                    }
                ]
            )
            return
        }

        setLoading(true)

        try {
            const response = await axios.post(endPoint + '/api/v1/auth/login_only', {
                'email': email,
                'password': password
            })
            
            await storeData('onlyne-application-data', JSON.stringify(response.data.user))
            await storeData('onlyne-application-token', response.data.access_token)

            setTimeout(() => {
                loginUser(response.data.access_token, JSON.stringify(response.data.user))
            }, 1000)

        } catch (error) {
            setLoading(false)
        }
    }

    return (
        <KeyboardAwareScrollView
        >
            <SafeAreaView style={styles.safeArea}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView>
                        <View style={styles.container}>
                            {/* FORM */}
                            <View style={styles.formContainer}>
                                {/* HEADER */}
                                {/* LOGO */}
                                <View style={styles.logoContainer}>
                                    <Image source={LogoOnlyOneWhite} style={styles.logo} />
                                </View>
                                {/* LOGO */}
                                {/* HEADER */}

                                {/* INPUT EMAIL */}
                                <View style={{ marginTop: 30 }}>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row'
                                    }}>
                                        <MaterialIcons name="email" size={18} color="white" />

                                        <Text style={styles.label}>
                                            E-mail
                                        </Text>
                                    </View>


                                    <TextInput
                                        style={styles.input}
                                        placeholder="Informe seu endereço de e-mail"
                                        placeholderTextColor="#fff"
                                        value={email}
                                        onChangeText={value => setEmail(value)}
                                    />
                                </View>
                                {/* INPUT EMAIL */}

                                {/* INPUT PASSWORD */}
                                <View>
                                    <View style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        marginTop: 30
                                    }}>
                                        <MaterialIcons name="vpn-key" size={18} color="white" />

                                        <Text style={styles.label}>
                                            Senha
                                        </Text>
                                    </View>

                                    <View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Informe sua senha"
                                            placeholderTextColor="#fff"
                                            secureTextEntry={!passwordVisible ? true : false}
                                            onChangeText={value => setPassword(value)}
                                            value={password}
                                        />

                                        <MaterialIcons
                                            name={!passwordVisible ? 'visibility' : 'visibility-off'}
                                            size={18}
                                            style={styles.eyeIcon}
                                            onPress={() => setPasswordVisible(!passwordVisible)}
                                            color="white"
                                        />
                                    </View>
                                </View>
                                {/* INPUT PASSWORD */}

                                {/* OPTIONS */}
                                <View style={{
                                    marginTop: 20,
                                    display: 'flex',
                                    flexDirection: 'row'
                                }}>
                                    <View style={{
                                        width: '50%',
                                        display: 'flex',
                                        flexDirection: 'row'
                                    }}>

                                        <Checkbox
                                            disabled={false}
                                            value={rememberMe}
                                            onValueChange={(newValue) => setRememberMe(newValue)}
                                            color={rememberMe ? palette.lightGreen : undefined}
                                        />
                                        <Text style={styles.rememberLabel} onPress={() => setRememberMe(!rememberMe)}>Lembrar-me</Text>
                                    </View>

                                    <View style={{
                                        width: '50%',
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end'
                                    }}>
                                        <Text style={styles.link}>Esqueceu a senha?</Text>
                                    </View>
                                </View>
                                {/* OPTIONS */}


                                <View style={styles.loginButtonContainer}>
                                    <TouchableOpacity
                                        onPress={() => submitLogin()}
                                        disabled={loading}
                                        style={[
                                            styles.loginButton,
                                            loading ? styles.disableButton : false
                                        ]}>
                                        {loading
                                            ? <ActivityIndicator color={'black'} />
                                            : <>
                                                <Text style={styles.loginText}>
                                                    Entrar
                                                </Text>
                                                <MaterialIcons name="login" size={18} color="black" style={{ marginLeft: 5 }} />
                                            </>
                                        }
                                    </TouchableOpacity>
                                </View>

                                {/* FOOTER */}
                                <View style={styles.footerContainer}>
                                    <Text style={styles.footerTitle}>OnlyOne Automação ©</Text>
                                    <Text style={styles.footerSubtitle}>Todos os direitos reservados.</Text>
                                    <Text style={styles.footerVersion}>version {version}</Text>
                                </View>
                                {/* FOOTER */}
                            </View>
                            {/* FORM */}

                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </KeyboardAwareScrollView >

    )
}

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: palette.darkGray,
        minHeight: Dimensions.get('window').height,
    },

    container: {
        backgroundColor: palette.darkGray,
        display: 'flex',
        justifyContent: 'center'
    },

    formContainer: {
        minHeight: Dimensions.get('window').height - 80,
        padding: 20,
        display: 'flex',
        justifyContent: 'center'
    },

    input: {
        backgroundColor: palette.gray,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#fff',
        height: 45,
        paddingLeft: 10,
        paddingRight: 10,
        color: 'white',
        placeholderTextColor: '#000',
        borderRadius: 6,
    },

    label: {
        color: 'white',
        fontSize: 17,
        paddingBottom: 10,
        fontWeight: 'bold',
        marginLeft: 10
    },

    eyeIcon: {
        position: 'absolute',
        right: 10,
        top: 13
    },

    loginButton: {
        backgroundColor: palette.lightGreen,
        height: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row'
    },

    loginButtonContainer: {
        marginTop: 20
    },

    loginText: {
        color: 'black',
        textTransform: "uppercase",
        fontWeight: 'bold',
        fontSize: 15
    },

    disableButton: {
        opacity: 0.6
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

    rememberLabel: {
        fontWeight: 'bold',
        color: 'white',
        marginLeft: 10,
        marginTop: 2
    },

    link: {
        color: palette.lightGreen,
        fontWeight: 'bold'
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
    },
})