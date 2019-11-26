import React,{Component} from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, 
    Image, ScrollView, Dimensions,KeyboardAvoidingView,
    TextInput,TouchableOpacity,Picker,FlatList,
    BackHandler,StyleSheet,StatusBar,CheckBox,Keyboard } from 'react-native';
import { COLORS } from '../Constants';
import {Loader} from './Loader'
import Icon from 'react-native-vector-icons/AntDesign';
export default class Planhistory extends Component{

    constructor(props){
        super(props)
              this.state={
                plan:'1 Month',
                days:'-10 Days Left', 
                month:'Noverber',
                number:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','16','17','18',
            '19','20','21','22','23','24','25','26','27','28','29','30']
            
                }
     }
     static navigationOptions = {
  
        title: 'Plan History',
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
                            
                                <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:13,marginVertical:5}}>
                                    <Text style={{fontSize:16}}>Plan:{this.state.plan}</Text>
                                    <Text style={{fontSize:16}}>Plan:{this.state.days}</Text>
                               </View>
                               <Text style={{textAlign:"center",marginVertical:25,fontSize:25,fontWeight:'bold'}}>Subscription: 1</Text>
                               <View style={{marginVertical:5}}>
                                   <Picker
                                      selectedValue={this.state.month}
                                      style={{height: 50, width: '100%'}}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.setState({month: itemValue})
                                      }>
                                      <Picker.Item label="Novermber" value="November" />
                                      
                                   </Picker>
                               </View> 
                               <Text style={{fontSize:16,paddingTop:20,paddingLeft:10}}>Home Wastage</Text> 
                              <View style={{marginVertical:23}}>
                               <FlatList
                                    data={this.state.number}
                                    numColumns={9}
                                    renderItem={({ item }) => {
                                        return(
                                        <View style={{borderWidth:1,borderColor:COLORS.Primary}}>
                                           <Text style={{paddingRight:18,paddingBottom:20}}>{item}-</Text>
                                      </View>
                                        )
                                    }}
                                    keyExtractor={item => item.id}
                                   />
                                  </View>
                                  <Text style={{fontSize:16,paddingTop:15,paddingLeft:10}}>Gas & Water</Text> 
                                       
                                  <View style={{flexDirection:'row',justifyContent:"space-between",marginHorizontal:35,marginVertical:5}}>
                                      <View>
                                      <Image source={require('../assets/gas-blue.png')} style={{width:55,height:110,}}/>
                                         <Text style={{fontSize:18,color:COLORS.Primary,paddingTop:10}}>2 Times</Text></View>  
                                         <View>
                                      <Image source={require('../assets/wastage-blue.png')} style={{width:60,height:100,}}/>
                                         <Text style={{fontSize:18,color:COLORS.Primary,paddingTop:10}}>0 Times</Text></View>  
                                   
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
        width:135,
        paddingVertical:13,
        borderRadius:20,
        fontSize:16,
        color:'#FFFFFF',
        fontWeight:'bold'
    }

})