import React,{Component} from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, 
    Image, ScrollView, Dimensions,KeyboardAvoidingView,
    TextInput,TouchableOpacity,Picker,FlatList,
    BackHandler,StyleSheet,StatusBar,CheckBox,Keyboard } from 'react-native';
import { COLORS } from '../Constants';
import {Loader} from './Loader'
import Icon from 'react-native-vector-icons/AntDesign';
export default class Planservice extends Component{

    constructor(props){
        super(props)
              this.state={
              
            
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
                             <Text style={{textAlign:'center',color:COLORS.Primary,fontSize:20}}>Service Description</Text>
                               <View style={{marginVertical:20,marginHorizontal:5}}>
                                   <Text style={{fontSize:17,textAlign:"justify"}}>
                                   The sources of this media are the keyboard, floppies, disks and tapes. Text files are usually stored and input character by character. Files may contain raw text or formatted text e.g HTML, 
                                   Rich Text Format (RTF) or a program language source (C, Pascal, etc..

                        Even though to data medium does not include any temporal constraints there may be an natural implied sequence e.g. HTML format sequence, Sequence of C program statements.

                        The basic storage of text is 1 byte per character (text or format character). For other forms of data e.g. Spreadsheet files some formats may store format as text (with formatting) others may use binary encoding.

                        Even the the storage requirements of this data is never high when data is stored on disk small files may take larger disk storage requirements due to block and sector sizes of disk partitions.

 
                                   </Text>
                                </View> 

                                <View style={{flexDirection:'row',marginTop:10}}>
                                 <CheckBox value={true}/> 
                                 <Text style={{fontSize:18}}>1 Month  SR 100</Text>  
                                 </View> 
                                 <View style={{flexDirection:'row'}}>
                                 <CheckBox value={false}/> 
                                 <Text style={{fontSize:18}}>1 Month  SR 600</Text>  
                                 </View> 
                                 <View style={{flexDirection:'row',marginTop:30}}>
                                 <CheckBox value={false}/> 
                                 <Text style={{fontSize:18}}>Gearbage Can (SR:75)</Text>  
                                 </View> 
                                 <View style={{marginVertical:20,alignItems:'center'}}>
                         <TouchableOpacity>
                             <Text style={styles.button}>SUBSCRIBE</Text>
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
        width:150,
        paddingVertical:12,
        borderRadius:20,
        fontSize:16,
        color:'#FFFFFF',
        fontWeight:'bold'
    }

})