import React,{Component} from 'react';
import { SafeAreaView, View, Text, 
    Image, ScrollView,
    TextInput,TouchableOpacity,Picker,FlatList,
    BackHandler,StyleSheet } from 'react-native';
import { COLORS,API_URL } from '../Constants';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign'


export default class AddDistrict extends Component{

    constructor(props){
        super(props)
              this.state={
                    
                district:[],
                checkbox:[],
                data:[]
               
                }
     }
     static navigationOptions = {
  
        title: 'Add District',
        headerStyle: {
            backgroundColor: COLORS.Primary,

        },
        headerTintColor:'#FFFFFF',
        headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
            marginLeft: 50,

        },
    };

    districtdata = () => {
        Axios.get(API_URL + 'district.php?action=district')
            .then(res => {
                 this.setState({ district: res.data.district });
             
                
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('District Error', err);
            })

    }
    componentDidMount() {
         this.districtdata();
    }
     
    render(){
        
        return(
            <View style={styles.main}>
              <View style={{position:"absolute",height:50}}><Text style={{fontSize:24,paddingTop:10,paddingLeft:10,color:COLORS.Primary}}>select District</Text></View> 
             
                       <View style={styles.container}> 
                              <View style={{marginVertical:23}}>
                               <FlatList
                                    data={this.state.district}
                                    
                                    renderItem={({ item,index}) => {
                                        let t=this.state.checkbox;
                                         if(typeof(t[index])=='undefined')
                                          {
                                               t[index]=false
                                               this.setState({checkbox:t})
                                          }
                                        return(
                                        <View style={{flexDirection:'row',marginHorizontal:10}}>
                                           {this.state.checkbox[index]==false?(<TouchableOpacity onPress={()=>{let t1=this.state.checkbox; t1[index]=true; this.setState({checkbox:t1})}}> 
                                               <View style={{borderWidth:1,borderColor:'gray',width:20,height:20}}></View>
                                               </TouchableOpacity>):(<TouchableOpacity onPress={()=>{let t2=this.state.checkbox; t2[index]=false; this.setState({checkbox:t2}); let y=this.state.data; if(typeof(y[index])==undefined){y[index]=item.DistrictName;this.setState({data:y})}else{y[index]=item.DistrictName;this.setState({data:y})}}}> 
                                               <View style={{borderWidth:1,borderColor:'gray',width:20,height:20,backgroundColor:'black'}}><Icon name='check' size={15} color='#FFFFFF'/></View>
                                               </TouchableOpacity>)}
                                           <Text style={{paddingRight:18,paddingBottom:20,paddingLeft:10,fontSize:16,fontWeight:'900'}}>{item.DistrictName}-</Text>
                                      </View>
                                        )
                                    }}
                                       keyExtractor={item => item.id}
                                     />
                                  </View>
                                <Text>{JSON.stringify(this.state.data)}</Text>
                                </View>
                        
                     
           <View style={{position:"absolute",right:0,left:0,bottom:30,alignItems:'center'}}>
               <Text style={styles.button}>Save</Text>
           </View>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    main:{
        flex:1,
       marginVertical:10
    },
    container:{
        marginTop:30,
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