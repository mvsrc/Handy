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
export default class Paycheckout extends Component {

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

        title: 'Cheackout',
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
               
                    <ScrollView keyboardShouldPersistTaps='never'>
                        <View style={styles.container}>

                 <View style={{ marginVertical: 23 }}>
                                <FlatList
                                    data={this.state.order}

                                    renderItem={({ item,index }) => {


                                        return (
                                            <View style={{ borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20 }}>
                                                <View style={{ flexDirection: 'row', marginHorizontal: 10, justifyContent:"space-between",alignItems: 'center' }}>
                                                    <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                                                    <Image source={{ uri: item.image }} style={{ width: 100, height: 90 }} />
                                                    <Text style={{ fontSize: 16, color: COLORS.Primary, paddingLeft: 20 }}>SR:{item.srno}{}{'\n'}<Text style={{ color: 'black' }}>Qty{item.qty}</Text>{'\n'}Total SR {item.srno}</Text>
                                                    </View>
                                                    <Icon name='delete' size={28} color='black' onPress={()=>{
                                                        let t=this.state.order
                                                           t[index]='',
                                                            this.setState({order:t})
                                                    }}/>
                                                </View>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={item => item.id}
                                />
                            </View>
                            <View style={{marginBottom:30}}>
                                <Text style={{color:COLORS.Primary,fontSize:16,fontWeight:'bold',paddingLeft:10,paddingBottom:20}}>Apply Promotion Code</Text>
                           <View style={{flexDirection:'row',justifyContent:"space-between",marginHorizontal:20}}> 
                           <TextInput
                             placeholder='Enter Here'
                             placeholderTextColor='gray'
                             autoFocus={true}
                             style={{borderBottomColor:'black',borderBottomWidth:1,width:'76%',fontSize:20}}
                             onChangeText={(txt)=>{this.setState({promocode:txt})}}
                            />
                              <TouchableOpacity>
                                   <Text style={{backgroundColor:COLORS.Primary,width:80,paddingVertical:7,color:'#FFFFFF',borderRadius:7,textAlign:'center'}}>Apply</Text>
                                  </TouchableOpacity>
                            </View>
                   
                    <View style={{flexDirection:'row',justifyContent:"space-between",paddingHorizontal:20,paddingVertical:15}}>
                         <Text style={{fontSize:17,color:'gray',textAlign:'justify'}}>subtotal</Text>
                         <Text style={{fontSize:17,color:'gray',textAlign:'justify'}}>SR:200.0</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",paddingHorizontal:20,paddingVertical:15}}>
                         <Text style={{fontSize:17,color:'gray',textAlign:'justify'}}>Discount</Text>
                         <Text style={{fontSize:17,color:'gray',textAlign:'justify'}}>SR:0.0</Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:"space-between",paddingHorizontal:20,paddingVertical:15}}>
                         <Text style={{fontSize:17,color:COLORS.Primary}}>total</Text>
                         <Text style={{fontSize:17,color:COLORS.Primary}}>SR:200.0</Text>
                    </View>

                                    
                       <View style={{marginVertical:30,alignItems:'center'}}>
                              <TouchableOpacity>
                                  <Text style={styles.button}>Pay</Text>
                               </TouchableOpacity>
                         </View>  
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
        width: 125,
        paddingVertical: 10,
        borderRadius: 20,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }

})