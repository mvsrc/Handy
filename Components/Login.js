import React,{Component} from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, 
    Image, ScrollView, Dimensions,KeyboardAvoidingView,TextInput,TouchableOpacity,
    BackHandler,StyleSheet,StatusBar,CheckBox,Keyboard } from 'react-native';
import { COLORS } from '../Constants';
import {Loader} from './Loader'

export default class Registation extends Component{

    constructor(props){
        super(props)
              this.state={
                  email:'',
                  password:'',
                
                  
               }
     }
     static navigationOptions = {
        header:null,
        title: 'Login',
        headerStyle: {
            backgroundColor: COLORS.Primary,

        },
        headerTintColor: COLORS.headertxtcolor,
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
            <View style={styles.logoimage}>
             <Image source={require('../assets/handy-logo.png')} style={{ width:'35%', height:140,borderRadius:20 }} />
            </View>
            <Text style={{color:COLORS.Primary,marginLeft:20,fontSize:20,fontWeight:'bold'}}>Welcome</Text>
              <View style={styles.textcontainer}>
                    <View style={styles.textinput}>
                    <TextInput

                            placeholder='Email id'
                            placeholderTextColor='gray'
                            onChangeText={(txt) => this.setState({ email: txt })}
                            onSubmitEditing={() => { this.password.focus(); }}
                            underlineColorAndroid="transparent"
                            keyboardType="email-address"
                            autoCapitalize='none'
                            blurOnSubmit={false}
                            returnKeyType={"next"}
                            value={this.state.email}
                            style={styles.textField}
                            />
                     </View> 

                     <View style={styles.textinput}>
                              <TextInput
                                    placeholder='Password'
                                    onChangeText={(txt) => this.setState({ password: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    secureTextEntry={true}
                                    ref={(input) => { this.password = input; }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid="transparent"
                                    value={this.state.password}
                                    style={styles.textField}
                                />
                     </View> 
                     <View style={{marginLeft:10,flexDirection:'row',width:'100%',marginTop:20}}>
                       <CheckBox value={false} style={{width:'10%'}}/>
                       <Text style={{fontWeight:'bold',width:'42%'}}>Remember password</Text>
                       <Text style={{fontWeight:'bold',textAlign:'right',width:'45%',marginRight:10}} onPress={()=>{this.props.navigation.navigate('Forgatepassword')}}>Forgot password?</Text> 
                     </View>
                     <View style={{marginVertical:30,alignItems:'center'}}>
                         <TouchableOpacity>
                             <Text style={styles.button}>Login</Text>
                         </TouchableOpacity>
                         </View>
                         <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',marginTop:10}}>
                             <Text style={{fontSize:17,textAlign:'center'}}>Do not have account?</Text>
                             <Text style={{fontSize:17,color:COLORS.Primary}}>Registe Here</Text>
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
        marginHorizontal:10
    },
    logoimage:{
              alignItems:'center',
             marginVertical:40
    },
    textcontainer:{
        marginTop:30,
    },
    textinput:{
        borderBottomColor:'gray',
        paddingVertical:4,
        borderBottomWidth:1,
        width:'auto',marginHorizontal:10
    },
    textField:{
        fontSize:20
    },
    button:{
        textAlign:'center',backgroundColor:COLORS.Primary,
        width:125,
        paddingVertical:12,
        borderRadius:20,
        fontSize:15,
        color:'#FFFFFF',
        fontWeight:'bold'
    }

})