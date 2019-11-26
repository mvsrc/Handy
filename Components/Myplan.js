import React,{Component} from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, 
    Image, ScrollView, Dimensions,KeyboardAvoidingView,TextInput,TouchableOpacity,
    BackHandler,StyleSheet,StatusBar,CheckBox,Keyboard } from 'react-native';
import { COLORS } from '../Constants';
import {Loader} from './Loader'
import Icon from 'react-native-vector-icons/AntDesign';
export default class Myplan extends Component{

    constructor(props){
        super(props)
              this.state={
                plan:'1 Month',
                days:'-10 Days Left' 
                
                }
     }
     static navigationOptions = {
  
        title: 'My plan',
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
                            <View style={styles.subcontainer}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:15,paddingVertical:13}}>
                                    <Text style={{color:'#FFFFFF',fontSize:15}}>Plan:{this.state.plan}</Text>
                                    <Text style={{color:'#FFFFFF',fontSize:15}}>Plan:{this.state.days}</Text>
                               </View>
                               <Text style={{textAlign:"center",marginVertical:45,fontSize:24,color:'#FFFFFF'}}>Subscription No: 1</Text>
        <Text style={{textAlign:'right',fontSize:15,color:'#FFFFFF',paddingRight:20}} onPress={()=>{this.props.navigation.navigate('Planhistory')}}>more Detail {<Icon name='right' size={15} color='#FFFFFF'/>}</Text>
                            </View>
                           <TouchableOpacity onPress={()=>{alert('vikas')}}> 
                           <View style={[styles.subcontainer,{backgroundColor:'#4fd43d',alignItems:'center',justifyContent:'center'}]}>
                               <Text style={{fontSize:24,color:'#FFFFFF'}}>Gas & Water Services</Text>
                            </View></TouchableOpacity>
                            <View style={{marginVertical:10,alignItems:'center'}}>
                         <TouchableOpacity>
                             <Text style={styles.button}>Renew</Text>
                         </TouchableOpacity>
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
        marginVertical:20
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
        width:135,
        paddingVertical:13,
        borderRadius:20,
        fontSize:16,
        color:'#FFFFFF',
        fontWeight:'bold'
    }

})