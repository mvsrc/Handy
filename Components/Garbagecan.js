import React, { Component } from 'react';
import {
    SafeAreaView, View, Text, 
    Image, ScrollView, Dimensions, KeyboardAvoidingView,
     TouchableOpacity,  FlatList,
    StyleSheet, 
} from 'react-native';
import { COLORS ,API_URL} from '../Constants';
import { Loader } from './Loader'
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo'
import Axios from 'axios'; 
export default class Garbagecan extends Component {

    constructor(props) {
        super(props)
        this.state = {
            garbage:[]
        }
    }
    static navigationOptions = {

        title: 'Garbage can',
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
                
                this.setState({garbage:res.data.result });
             
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
       
        return (
            <View style={styles.main}>
              
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <View style={styles.container}>
                    <View style={{ marginVertical: 23 }}>
                                <FlatList
                                    data={this.state.garbage}

                                    renderItem={({ item,index }) => {


                                        return (
                                            <View style={{ borderBottomWidth:0.7,paddingVertical: 5, paddingHorizontal: 15, marginBottom: 20 }}>
                                                <View style={{ flexDirection:'row',alignItems:'center',width:'100%',paddingBottom:5 }}>
                                               <View style={{width:'60%'}}>
                                        <Text style={{ fontSize: 17, color: 'gray',paddingBottom:3  }}>{index+1}.{item.UserFName} {item.UserLName}</Text>
                                                  <Text style={{ fontSize: 17, color: 'gray',paddingBottom:3 }}>{item.UserPhone}</Text>
                                        <Text style={{ fontSize: 17, color: 'gray', }}>{item.UserHome},{item.UserDistrictName}</Text>
                                               </View>
                                               <View style={{flexDirection:'row',width:'35%',marginHorizontal:35}}>
                                               <Icon name='check-circle' size={47} color='#1cc749'/>
                                                    <Icon1 name='circle-with-cross' size={47} color='#e83134' style={{paddingLeft:30}}/>
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