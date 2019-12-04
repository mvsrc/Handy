import React, { Component } from 'react';
import {
    SafeAreaView, View, Text, TouchableNativeFeedback,
    Image, ScrollView, Dimensions, KeyboardAvoidingView,
    TextInput, TouchableOpacity, Picker, FlatList,
    BackHandler, StyleSheet, StatusBar, CheckBox, Keyboard
} from 'react-native';
import { COLORS,API_URL } from '../Constants';
import { Loader } from './Loader'
import Icon from 'react-native-vector-icons/FontAwesome5';
import icon1 from 'react-native-vector-icons/Entypo'
import  Axios from 'axios' 
export default class Homewastage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            garbage:[]
        }
    }
    static navigationOptions = {

        title: 'HOME WASTAGE',
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


    garbagedata = () => {
        Axios.get(API_URL+'garbagecan.php?action=getList&DistrictId=1&ProviderId=6')
            .then(res => {
                
                 this.setState({ garbage:res.data.result});
             
                
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('District Error', err);
            })

    }
    componentDidMount() {
         this.garbagedata();
    }
     


    render() {
        let sum = 0;
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.container}>
                    <View style={{ marginVertical: 23 }}>
                                <FlatList
                                    data={this.state.garbage}

                                    renderItem={({ item ,index}) => {


                                        return (
                                            <View style={{ borderBottomWidth:0.8, paddingHorizontal: 10, marginBottom: 8,paddingLeft:16 }}>
                                                <View style={{ flexDirection:'row',marginVertical:10,alignItems:'center',width:'100%' }}>
                                               <View style={{width:'61%'}}>
                                               <Text style={{ fontSize: 18, color: 'gray',paddingBottom:3  }}>{index+1}.{item.UserFName} {item.UserLName}</Text>
              
                                             <Text style={{ fontSize: 17, color: 'gray', }}>{item.UserHome},{item.UserDistrictName}</Text>
                                               </View>
                                                    <View style={{flexDirection:'row',justifyContent:"space-around",width:'33%',marginHorizontal:30,alignItems:'center'}}>
                                                    <Image source={require('../assets/all-order-map-icon.png')} style={{width:20,height:22}}/>
                                                    <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Homewastageorderdetail',{itemdata:item})}}><Image source={require('../assets/all-order-view-icon.png')} style={{width:22,height:22}}/></TouchableOpacity>
                                                    <Image source={require('../assets/wastage-gray.png')} style={{width:28,height:34}}/>
                                                  </View>
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