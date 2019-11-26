import React,{Component} from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, 
    Image, ScrollView, Dimensions,KeyboardAvoidingView,
    TextInput,TouchableOpacity,Picker,FlatList,
    BackHandler,StyleSheet,StatusBar,CheckBox,Keyboard } from 'react-native';
import { COLORS } from '../Constants';
import {Loader} from './Loader'
import Icon from 'react-native-vector-icons/AntDesign';
export default class Orderdetails extends Component{

    constructor(props){
        super(props)
              this.state={
                  order:[{'orderid':'#33','Status':'N','date':'13-11-2019','Time':'2:41:PM'},
                  {'orderid':'#34','Status':'','date':'13-11-2019','Time':'2:46:PM'},
                  {'orderid':'#37','Status':'y','date':'13-11-2019','Time':'9:52:PM'},
                 ]
            
                }
     }
     static navigationOptions = {
  
        title: 'Plan Details',
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
    render(){
        
        return(
            <View style={styles.main}>
                 <KeyboardAvoidingView enabled>
                       <ScrollView keyboardShouldPersistTaps="handled">
                         <View style={styles.container}> 
                            
                              
                               
                               
               
                              <View style={{marginVertical:23}}>
                               <FlatList
                                    data={this.state.order}
                                    
                                    renderItem={({ item }) => {
                                        return(
                                        <View style={{borderWidth:1,paddingVertical:10,paddingHorizontal:10,marginBottom:20}}>
                                          <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,marginVertical:10}}> 
                                            <Text style={{fontSize:17}}>Order Id:{item.orderid}-</Text>
                                        <Text style={{fontSize:16}}>Date-{item.date}{'\n'}Time-{item.Time}</Text>
                                            </View>
                                        <Text style={{fontSize:16,paddingLeft:15}}>Status:{item.Status}</Text>
                                        <Text style={{fontSize:17,fontWeight:'bold',paddingVertical:10,paddingLeft:15}}>Delivered To</Text>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20,marginTop:10}}> 
                                        <Text style={{fontSize:17}}>hn65{'\n'}Khargone</Text>
                                        <Text style={{fontSize:16,paddingRight:30}}>AlphaName{'\n'}123456789</Text>
                                            </View>

                                            <View style={{marginVertical:5,alignItems:'flex-end'}}>
                                     <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Productdetaile')}}>
                                        <Text style={styles.button}>VIEW PRODUCS</Text>
                                      </TouchableOpacity>
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
            </View>
        )
    }
}
const styles=StyleSheet.create({
    main:{
        flex:1,
        marginHorizontal:10,
        marginVertical:10
    },
    subcontainer:{
        backgroundColor:COLORS.Primary,
        width:'100%',
    height:200,
    borderRadius:15,
    marginBottom:35
    } ,
    container:{
        marginVertical:5,
        marginHorizontal:5
    },
    button:{
        textAlign:'center',backgroundColor:COLORS.Primary,
        width:175,
        paddingVertical:10,
        borderRadius:20,
        fontSize:16,
        color:'#FFFFFF',
        fontWeight:'bold'
    }

})