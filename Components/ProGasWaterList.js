import React, { Component } from 'react';
import {
    View, Text,
    Image, ScrollView, KeyboardAvoidingView,
    TouchableOpacity, FlatList, StyleSheet
} from 'react-native';
import { COLORS, API_URL } from '../Constants';
import Axios from 'axios';
import TabBar from './TabBar';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import SimpleToast from 'react-native-simple-toast';
class ProGastWaterList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            garbage: [],
            districtId: this.props.navigation.getParam('districtId')
        }
    }
    garbagedata = () => {
        this.props.LoadingStatusChange(true);
        Axios.get(`${API_URL}orderlistgw.php?action=gaswater&UserDistrict=${this.state.districtId}&lang=ar`)
            .then(res => {
                console.log(res.data);
                this.setState({ garbage: res.data.Order },()=>{
                    this.props.LoadingStatusChange(false);
                });
                setTimeout(()=>{SimpleToast.show(res.data.message,SimpleToast.SHORT)},100);
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('Wastage Order List Error', err);
            })
    }
    componentDidMount() {
        this.garbagedata();
    }
    render() {
        let sum = 0;
        return (
            <View style={styles.main}>
                <FlatList
                    data={this.state.garbage}
                    contentContainerStyle={{paddingHorizontal:5}}
                    renderItem={({ item, index }) => {
                        let ProductType = item.product[0].ProductType;
                        return (
                            <View style={{ borderBottomWidth: 0.8,borderColor:'#F1F1F1', paddingHorizontal: 5, marginBottom: 8, paddingLeft: 16 }}>
                                <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center', width: '100%' }}>
                                    <View style={{ width: '61%' }}>
                                        <Text style={{ fontSize: 15, color: '#555555', marginBottom: 8 }}>{index + 1}.{item.UserFName} {item.UserLName}</Text>

                                        <Text style={{ fontSize: 13, color: '#666666', }}>{item.UserHome},{item.UserDistrictName}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: "space-around", width: '33%', marginHorizontal: 30, alignItems: 'center' }}>
                                        <TouchableOpacity onPress={()=>{
                                            this.props.navigation.navigate('OrderLocation',{orderLocation:item.UserLocation,itemdata: item,type:'gaswater'});
                                        }}>

                                            <Image source={require('../assets/all-order-map-icon.png')} style={{ width: 20, height: 17 }} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('ProOrderDetails', { itemdata: item,productList:item.product,type:'gaswater' }) }}><Image source={require('../assets/all-order-view-icon.png')} style={{ width: 22, height: 22 }} /></TouchableOpacity>
                                        {
                                            ProductType == 'gas' && 
                                            <Image source={require('../assets/gas-gray.png')} style={{ width: 17, height: 34 }} />
                                        }
                                        {
                                            ProductType == 'water' && 
                                            <Image source={require('../assets/water-gray.png')} style={{ width: 20, height: 34 }} />
                                        }
                                    </View>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={(item,index) => `key-${index}`}
                />
                <TabBar navigation={this.props.navigation} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    subcontainer: {
        backgroundColor: COLORS.Primary,
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 35
    },
    container: {
        marginVertical: 5,
        marginHorizontal: 5
    },
    button: {
        textAlign: 'center', backgroundColor: COLORS.Primary,
        width: 175,
        paddingVertical: 10,
        borderRadius: 20,
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
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ProGastWaterList);