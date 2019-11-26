import React, { Component } from 'react';
import {
    SafeAreaView, View, Text, TouchableNativeFeedback,
    Image, ScrollView, Dimensions, KeyboardAvoidingView,
    TextInput, TouchableOpacity, Picker, FlatList,
    BackHandler, StyleSheet, StatusBar, CheckBox, Keyboard
} from 'react-native';
import { COLORS } from '../Constants';
import { Loader } from './Loader'
import Icon from 'react-native-vector-icons/AntDesign';
export default class Productdetaile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            order: [{ 'image': 'https://source.unsplash.com/1024x768/?nature', 'srno': '32.0', 'qty': '1' },
            { 'image': 'https://source.unsplash.com/1024x768/?water', 'srno': '5.0', 'qty': '1' },
            { 'image': 'https://source.unsplash.com/1024x768/?tree', 'srno': '3.0', 'qty': '1' },
            { 'image': 'https://source.unsplash.com/1024x768/?tree', 'srno': '3.0', 'qty': '1' },
            { 'image': 'https://source.unsplash.com/1024x768/?tree', 'srno': '3.0', 'qty': '1' },
            ],
        }
    }
    static navigationOptions = {

        title: 'Product Details',
        headerStyle: {
            backgroundColor: COLORS.Primary,

        },
        headerTintColor: COLORS.headertext,
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 50,

        },
    };


    render() {
        let sum = 0;
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.container}>





                            <View style={{ marginVertical: 23 }}>
                                <FlatList
                                    data={this.state.order}

                                    renderItem={({ item }) => {


                                        return (
                                            <View style={{ borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20 }}>
                                                <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                                                    <Image source={{ uri: item.image }} style={{ width: 100, height: 90 }} />
                                                    <Text style={{ fontSize: 16, color: COLORS.Primary, paddingLeft: 20 }}>SR:{item.srno}{}{'\n'}<Text style={{ color: 'black' }}>Qty{item.qty}</Text>{'\n'}Total SR {item.srno}</Text>
                                                </View>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={item => item.id}
                                />
                            </View>


                        </View>


                    </ScrollView>
                </KeyboardAvoidingView>
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 ,backgroundColor:COLORS.Primary}}>
                    <View style={{flexDirection:'row',justifyContent:"space-between",paddingHorizontal:20,borderTopWidth:1,paddingVertical:15}}>
                        <Text style={{fontSize:17,color:'#FFFFFF'}}>Total</Text>
                        <Text style={{fontSize:17,color:'#FFFFFF'}}>SR:37.0</Text>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginHorizontal: 1,
        marginVertical: 2
    },
    subcontainer: {
        backgroundColor: COLORS.Primary,
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 35
    },
    container: {
        marginVertical: 5,
        marginHorizontal: 5
    },
    button: {
        textAlign: 'center', backgroundColor: COLORS.Primary,
        width: 175,
        paddingVertical: 10,
        borderRadius: 20,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }

})