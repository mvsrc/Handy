import React,{Component} from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, 
    Image, ScrollView, Dimensions,KeyboardAvoidingView,TextInput,TouchableOpacity,
    BackHandler,StyleSheet,StatusBar,CheckBox,Keyboard } from 'react-native';
import { COLORS } from '../Constants';

export default class Forgatepassword extends Component{

    constructor(props){
        super(props)
              this.state={
                  email:'',
                  password:''
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
             <Image source={require('../assets/handy-logo.png')} style={{ width:'40%', height:160,borderRadius:20 }} />
            </View>
            <Text style={{color:COLORS.Primary,marginLeft:10,fontSize:22,fontWeight:'bold'}}>Forgot Password</Text>
              <View style={styles.textcontainer}>
                     

                     <View style={styles.textinput}>
                              <TextInput
                                    placeholder='Email Id'
                                    onChangeText={(txt) => this.setState({ email: txt })}
                                    placeholderTextColor='gray'
                                    returnKeyType={"go"}
                                    onBlur={() => { Keyboard.dismiss() }}
                                    keyboardType="email-address"
                                    ref={(input) => { this.email = input; }}
                                    blurOnSubmit={false}
                                    underlineColorAndroid="transparent"
                                    value={this.state.email}
                                    style={styles.textField}
                                />
                     </View> 
                    
                     <View style={{marginVertical:30,alignItems:'center'}}>
                         <TouchableOpacity>
                             <Text style={styles.button}>SUBMIT</Text>
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
        borderBottomWidth:1.5,
        width:'auto',marginHorizontal:10
    },
    textField:{
        fontSize:20
    },
    button:{
        textAlign:'center',backgroundColor:COLORS.Primary,
        width:135,
        paddingVertical:12,
        borderRadius:20,
        fontSize:15,
        color:'#FFFFFF',
        fontWeight:'bold'
    }

})