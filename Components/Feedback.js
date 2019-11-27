import React,{Component} from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, 
    Image, ScrollView, Dimensions,KeyboardAvoidingView,
    TextInput,TouchableOpacity,Picker,FlatList,
    BackHandler,StyleSheet,StatusBar,CheckBox,Keyboard } from 'react-native';

import { COLORS, API_URL } from '../Constants';
import {Loader} from './Loader'
import Icon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';


 
export default class Feedback extends Component{

    constructor(props){
        super(props)
              this.state={
                 radioItems: 
                    [
                        {
                            label: 'Feedback',
                            size: 20,
                            color: 'black',
                            selected: true
                        }, {
                            label: 'Suggestion',
                            color: 'black',
                            size: 20,
                            selected: false,
                        }, {
                            label: 'complaint',
                            size: 20,
                            color: 'black',
                            selected: false
                        },
             
                       
                    ], selectedItem: '' 
                }
                }

    componentDidMount()
                {
                    this.state.radioItems.map(( item ) =>
                    {
                        if( item.selected == true )
                        {
                            this.setState({ selectedItem: item.label });
                        }
                    });
                }       
                
     
     static navigationOptions = {
  
        title: 'Feedback',
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

    changeActiveRadioButton(index)
    {
       
        this.state.radioItems.map(( item ) =>
        {
            item.selected = false;
        });
 
        this.state.radioItems[index].selected = true;
 
        this.setState({ radioItems: this.state.radioItems }, () =>
        {
            this.setState({ selectedItem: this.state.radioItems[index].label });
        });
    }

  
      

    render(){
       
        return(
            <View style={styles.main}>
                 <KeyboardAvoidingView enabled>
                       <ScrollView keyboardShouldPersistTaps="handled">
                         <View style={styles.container}> 
                        
                        {/* {
                            this.state.radioItems.map(( item, key ) =>
                            <TouchableOpacity onPress = {()=>{{ this.changeActiveRadioButton(  key ) }} } activeOpacity = { 0.8 } style = { styles.radioButton }>
                            <View style = {[ styles.radioButtonHolder, { height: item.size, width: item.size, borderColor: item.color }]}>
                            {
                                (item.selected==true)? (<View style = {[ styles.radioIcon, { height: item.size/2, width: item.size/2, backgroundColor: item.color }]}></View>)
                                :
                                 <Text></Text>
                            }
                            </View>
                            <Text style = {[ styles.label, { color:item.color }]}>{ item.label }</Text>
                        </TouchableOpacity>)
                 } */}

<FlatList
                                    data={this.state.radioItems}
                                 numColumns={3}
                                    renderItem={({item,index}) => {
                                            

                                        return (
                                            <TouchableOpacity onPress = {()=>{{ this.changeActiveRadioButton(index) }} } activeOpacity = { 0.8 } style = { styles.radioButton }>
                                            <View style = {[ styles.radioButtonHolder, { height: item.size, width: item.size, borderColor: item.color }]}>
                                            {
                                                (item.selected==true)? (<View style = {[ styles.radioIcon, { height: item.size/2, width: item.size/2, backgroundColor: item.color }]}></View>)
                                                :
                                                 <Text></Text>
                                            }
                                            </View>
                                            <Text style = {[ styles.label, { color:item.color }]}>{ item.label }</Text>
                                        </TouchableOpacity>
                                        )
                                    }}
                                    keyExtractor={item => item.id}
                                />     



                {/* <View style = { styles.selectedTextHolder }>
                    <Text style = { styles.selectedText }>Selected Item: { this.state.selectedItem }</Text>
                
                    </View> */}
                     
                            <TextInput
                             placeholder='Write Here'
                              numberOfLines={5}
                             multiline={true}
                             autoFocus={true}
                             underlineColorAndroid={COLORS.Primary}
                             style={{borderWidth:0.6,marginTop:20,marginHorizontal:13,fontSize:17}}
                            />
                           
                       <View style={{marginVertical:30,alignItems:'center'}}>
                              <TouchableOpacity>
                                  <Text style={styles.button}>Submit</Text>
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
    radioButton:
    {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
 
    radioButtonHolder:
    {
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
 
    radioIcon:
    {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
 
    label:
    {
        marginLeft: 10,
        fontSize: 16
    },
 
    selectedTextHolder:
    {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
 
    selectedText:
    {
        fontSize: 18,
        color: 'white'
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