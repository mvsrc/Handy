import React,{Component} from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, 
    Image, ScrollView, Dimensions,KeyboardAvoidingView,TextInput,TouchableOpacity,
    BackHandler,StyleSheet,StatusBar,CheckBox,Keyboard,FlatList,Picker} from 'react-native';
import { COLORS,API_URL} from '../Constants';
import {Loader} from './Loader'
import Carousel from 'react-native-banner-carousel';
import Icon from 'react-native-vector-icons/AntDesign'
import { thisExpression } from '@babel/types';
const BannerWidth = Dimensions.get('window').width;



const images = [
    "http://kdoom.fundexpoinvestmentsolution.com/images/sliderimg/thumb/06111915730288971.jpg",
    "http://kdoom.fundexpoinvestmentsolution.com/images/sliderimg/thumb/17111915740014671.JPG",
    "http://kdoom.fundexpoinvestmentsolution.com/images/sliderimg/thumb/19111915741521231.jpg"
];
export default class Plangaswaterservice extends Component{

    constructor(props){
        super(props)
              this.state={
                contactdata:[],
                 gas:'#29a4b3',
                 water:'gray',
                 count:1,
                 radioItems: 
                    [
                        {
                            label: '07:00 AM-11:00 AM (Tommorrow)',
                            size: 20,
                            color: 'black',
                            selected: true
                        }, {
                            label: '04:00 AM-07:00 PM (Tommorrow)',
                            color: 'black',
                            size: 20,
                            selected: false,
                        },
             
                       
                    ], selectedItem: '' ,company:''
                  
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

    changeActiveRadioButton(index)
    {
       this.state.radioItems.map(( item ) =>
        {
            item.selected = false;
        });
         this.state.radioItems[index].selected = true;
        this.setState({ radioItems: this.state.radioItems}, () =>
           {
              this.setState({ selectedItem:this.state.radioItems[index].label });
            });
    }

    render(){
       
   
        return(
            <View style={styles.main}>
                  
                <KeyboardAvoidingView enabled>
              
                    <ScrollView keyboardShouldPersistTaps="handled">
            <View style={styles.logoimage}>
                
            <TouchableOpacity onPress={()=>{this.setState({gas:'#29a4b3',water:'gray'})}} activeOpacity={2}>
                 {this.state.gas=='#29a4b3'?<Image source={require('../assets/gas-blue.png')} style={{ width:50, height:105 }} />:<Image source={require('../assets/gas-gray.png')} style={{ width:50, height:105 }} />}  
                 <Text style={{fontSize:16,color:this.state.gas,textAlign:'center'}} >Gas</Text>
                 </TouchableOpacity>
                <TouchableOpacity activeOpacity={2} onPress={()=>{this.setState({water:'#29a4b3',gas:'gray'})}}>
                    {this.state.water=='#29a4b3'?<Image source={require('../assets/wastage-blue.png')} style={{ width:60, height:100 }} />:<Image source={require('../assets/water-gray.png')} style={{ width:60, height:100 }} />}
                    <Text style={{fontSize:16,color:this.state.water,textAlign:'center'}}>water</Text>
                    </TouchableOpacity>
            </View>
               {this.state.water=='#29a4b3'&&<View style={{flexDirection:'row',marginBottom:20,marginHorizontal:10,justifyContent:'space-between'}}>
                   <Text style={{fontSize:16,fontWeight:'900'}}>Company</Text>
                   <Picker
                   style={{width:'60%',height:35,marginRight:30}}
                   selectedValue={this.state.company}
                   onValueChange={(itemvalue,itemindex)=>{
                        this.setState({company:itemvalue})
                   }}
                   >
                       <Picker.item  label='All Company' value='All Company'/>
                       <Picker.item  label='Bisleri' value='Bisleri'/>
                   </Picker></View>
                   }
            <Carousel
                   loop={false}
                         autoplay={false}
                        index={0}
                        pageSize={BannerWidth}
                        showsPageIndicator={true}
                    >
                        {images.map((image, index) => (
                            <View key={index}>
                                <Image style={{ width: BannerWidth, height: 180 }} source={{ uri: image }} />
                            </View>
                        ))}
                    </Carousel>
             {this.state.gas=='#29a4b3' && <View>
            
                    <View style={{flexDirection:'row',width:'100%',marginHorizontal:10,marginTop:30}}>
                       <View style={{flexDirection:'row',width:'50%',justifyContent:"space-evenly",paddingRight:30}}>
                        <Icon name='minussquareo' size={30} color={COLORS.Primary} onPress={()=>{this.state.count==1?this.setState({count:1}):this.setState({count:this.state.count-1})}}/>
                        <Text style={styles.counttext}>{this.state.count}</Text> 
                        <Icon name='plussquareo' size={30} color={COLORS.Primary}  onPress={()=>{this.setState({count:this.state.count+1})}}/>
                         </View>
                         <View style={{flexDirection:'row',width:'50%',justifyContent:"space-between",paddingHorizontal:20}}>
                             <Text style={{fontSize:17,color:COLORS.Primary,fontWeight:'bold'}}>Price:SR 100</Text>
                             <Image source={require('../assets/gas-blue.png')} style={{ width:27, height:53 }} />
                             </View></View>
                             <View style={{marginVertical:20,paddingLeft:10}}>
                         <TouchableOpacity>
                             <Text style={styles.button}>ADD TO CART</Text>
                         </TouchableOpacity>
                         </View>
                    </View>}
                    <Text style={{fontSize:16,color:'gray',borderBottomWidth:1.5,borderBottomColor:'gray',width:120,marginLeft:10,fontWeight:'bold'}}>Add more item</Text>
                    <Text style={{fontSize:16,color:COLORS.Primary,marginLeft:10,fontWeight:'bold',paddingVertical:15}}>Select Delivery Time</Text>

                       <FlatList
                                 data={this.state.radioItems}
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
                                 
                                 <View style={{marginVertical:30,alignItems:'center'}}>
                         <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Paycheckout')}}>
                             <Text style={styles.button}>PAY NOW</Text>
                         </TouchableOpacity>
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
        marginBottom:30
    },
   subtext:{
          fontSize:17,
          paddingVertical:5,
          textAlign:'center'
    },
    logoimage:{
              alignItems:'center',
             marginVertical:25,
             flexDirection:'row',
             justifyContent:'space-around'
    },
    textcontainer:{
        marginTop:30,
        alignItems:'center'
    },
    
    button:{
        textAlign:'center',backgroundColor:COLORS.Primary,
        width:140,
        paddingVertical:12,
        borderRadius:20,
        fontSize:15,
        color:'#FFFFFF',
        fontWeight:'bold'
    },
    counttext:{borderWidth:2,
        borderColor:COLORS.Primary,
        fontSize:15,
        color:COLORS.Primary,width:30,
        height:30,borderRadius:40,textAlign:'center',fontWeight:'bold'
    },
    radioButton:
    {
        flexDirection: 'row',
        margin: 10,
     
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
 

})