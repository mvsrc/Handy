import React, { Component } from 'react';
import {
    View, Text,
    TouchableOpacity, FlatList,
    StyleSheet
} from 'react-native';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/AntDesign'
import { LangValue } from '../lang';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import Toast from 'react-native-simple-toast';
import TabBar from './TabBar';
class AddDistrict extends Component {
    constructor(props) {
        super(props)
        let {userData} = this.props.reducer;
        let UserDistrictIds = [];
        UserDistrictIds = (userData.UserDistrictId.replace(/,+$/,'')).split(',');
        this.state = {
            district: [],
            selectedIds:UserDistrictIds
        }
    }
    districtdata = () => {
        this.props.LoadingStatusChange(true);
        Axios.get(API_URL + 'district.php?action=district')
            .then(res => {
                this.setState({ district: res.data.district }, () => {
                    this.props.LoadingStatusChange(false);
                });
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('District Error', err);
            });
    }
    componentDidMount() {
        this.districtdata();
    }
    SaveDistrict = ()=>{
        let {userData} = this.props.reducer;
        let mergeDIds = this.state.selectedIds.join(',');
        this.props.LoadingStatusChange(true);
        Axios.get(`${API_URL}adddistrict.php?action=add&UserId=${userData.UserId}&UserDistrict=${mergeDIds}`)
        .then(res=>{
            setTimeout(()=>{Toast.show(res.data.message,Toast.SHORT)},100);
            this.props.LoadingStatusChange(false);
        })
        .catch(err=>{
            console.log(err);
            this.props.LoadingStatusChange(false);
        })
    }
    render() {
        let { lang } = this.props.reducer;
        return (
            <View style={styles.main}>
                <Text style={{ fontSize: 24, paddingTop: 10, paddingLeft: 10, color: COLORS.Primary,textAlign:'left' }}>{LangValue[lang].SELECT_DISTRICT}</Text>
                <FlatList
                    data={this.state.district}
                    contentContainerStyle={{ paddingHorizontal: 15, paddingVertical: 20 }}
                    ItemSeparatorComponent={()=>(<View style={{marginVertical:5,borderBottomColor:'#CCCCCC',borderBottomWidth:1}}></View>)}
                    renderItem={({ item, index }) => {
                        let inArray = this.state.selectedIds.indexOf(item.DistrictId);
                        return (
                            <View style={{ flexDirection: 'row', paddingHorizontal: 15,paddingVertical:10,width:'100%'}}>
                                <TouchableOpacity onPress={() => {
                                    let selectedIds;
                                    selectedIds = this.state.selectedIds
                                    if(inArray !== -1){
                                        selectedIds.splice(inArray,1); 
                                    }
                                    else{
                                        selectedIds.push(item.DistrictId);
                                    }
                                    this.setState({selectedIds});
                                }} style={{flexDirection:'row',justifyContent:'flex-start',alignItems:'center',width:'100%'}}>
                                    <View style={[{ borderWidth: 2, borderColor: COLORS.Primary, width: 20, height: 20,  },(inArray !==-1)?{backgroundColor: COLORS.Primary}:{}]}>
                                        {
                                            inArray !== -1 && 
                                            <Icon name='check' size={15} color='#FFFFFF' />
                                        }
                                    </View>
                                    <Text style={{ paddingLeft: 10, fontSize: 16, }}>{item.DistrictName}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => 'key' + index}
                />
                <View style={{ marginVertical: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={styles.button} onPress={()=>{
                        this.SaveDistrict();
                    }}>
                        <Text style={styles.btnText}>{LangValue[lang].SAVE}</Text>
                    </TouchableOpacity>
                </View>
                <TabBar navigation={this.props.navigation} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    container: {
        marginTop: 30,
        marginHorizontal: 5
    },
    button: {
        backgroundColor: COLORS.Primary,
        width: 135,
        paddingVertical: 13,
        borderRadius: 20,
        ...IOSShadow
    },
    btnText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'

    }
});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading))
});
export default connect(mapStateToProps, mapDispatchToProps)(AddDistrict);