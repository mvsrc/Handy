import React, { Component } from 'react';
import {
    SafeAreaView, View, Text, TouchableNativeFeedback,
    Image, ScrollView, Dimensions, KeyboardAvoidingView,
    TextInput, Linking,Platform,TouchableOpacity, Picker, FlatList,
    BackHandler, StyleSheet, StatusBar, CheckBox, Keyboard
} from 'react-native';
import { COLORS,API_URL } from '../Constants';
import { Loader } from './Loader'
import Icon from 'react-native-vector-icons/FontAwesome';

import  Axios from 'axios' 
export default class Homewastageorderdetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            userdata:''
        }
    }
    static navigationOptions = {

        title: 'Order Detail',
        headerStyle: {
            backgroundColor: COLORS.Primary,

        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 50,

        },
    };


    
    dialCall = (number) => {
        let phoneNumber = '';
        if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
        else {phoneNumber = `telprompt:${number}`; }
        Linking.openURL(phoneNumber);
     };
    
    
     


    render() {
        let user=this.props.navigation.getParam('itemdata')
        return (
            <View style={styles.main}>
                
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.container}>
                              
                            <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                                <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>Name</Text>
                                  <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>{user.UserFName} {user.UserLName}</Text>
                            </View>
                             
                            <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                                <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>Phone Number</Text>
                                  <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>{user.UserPhone}</Text>
                            </View>

                            <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                                <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>E-mail</Text>
                                  <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>{user.UserEmail}</Text>
                            </View>

                            <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                            <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>Home Location</Text>
                             <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>{user.UserHome}</Text>
                            </View>

                            <View style={{flexDirection:'row',width:'100%',marginTop:20}}>
                            <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>City</Text>
                             <Text style={{width:'47%',fontSize:16,fontWeight:'900'}}>{user.UserDistrictName}</Text>
                            </View>

                            <View style={{flexDirection:'row',justifyContent:"space-between",marginTop:30}}>
                                <Text style={styles.button}  onPress={()=>{this.dialCall(user.UserPhone)}}>Call</Text>
                                  <Icon name='map-marker' size='23' color='#FFFFFF' style={styles.button}/>
                            </View>

                        </View>


                    </ScrollView>
              
              
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
        marginVertical: 10,
        marginHorizontal: 15,
       
    },
    button: {
        width:'25%',fontSize:16,
        fontWeight:'900',
        color:'#FFFFFF',
        backgroundColor:COLORS.Primary,
        paddingVertical:4 ,
        textAlign:'center',
        fontSize:17
      }
    

})