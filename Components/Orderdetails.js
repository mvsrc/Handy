import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { COLORS, API_URL } from '../Constants';
import { connect } from 'react-redux';
import TabBar from './TabBar';
import Axios from 'axios';
class Orderdetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: [{ 'orderid': '#33', 'Status': 'N', 'date': '13-11-2019', 'Time': '2:41:PM' },
            { 'orderid': '#34', 'Status': '', 'date': '13-11-2019', 'Time': '2:46:PM' },
            { 'orderid': '#37', 'Status': 'y', 'date': '13-11-2019', 'Time': '9:52:PM' },
            ]

        }
    }
    componentDidMount() {
        //this.props.LoadingStatusChange(true);
        this.fetchOrderDetails();
    }
    fetchOrderDetails = async ()=>{
        await Axios.get(`${API_URL}`)
        .then(res=>{

        })
        .catch(err=>{
            console.log('Order Details Error',err);
        })
    }
    render() {
        let {navigation} = this.props;
        return (
            <View style={{flex: 1}}>
                <FlatList
                    contentContainerStyle={{padding:15}}
                    data={this.state.order}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ borderWidth: 1, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10 }}>
                                    <Text style={{ fontSize: 17 }}>Order Id:{item.orderid}-</Text>
                                    <Text style={{ fontSize: 16 }}>Date-{item.date}{'\n'}Time-{item.Time}</Text>
                                </View>
                                <Text style={{ fontSize: 16, paddingLeft: 15 }}>Status:{item.Status}</Text>
                                <Text style={{ fontSize: 17, fontWeight: 'bold', paddingVertical: 10, paddingLeft: 15 }}>Delivered To</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 10 }}>
                                    <Text style={{ fontSize: 17 }}>hn65{'\n'}Khargone</Text>
                                    <Text style={{ fontSize: 16, paddingRight: 30 }}>AlphaName{'\n'}123456789</Text>
                                </View>

                                <View style={{ marginVertical: 5, alignItems: 'flex-end' }}>
                                    <TouchableOpacity style={{backgroundColor: COLORS.Primary,width: 175,paddingVertical: 10,borderRadius: 20}} onPress={() => { this.props.navigation.navigate('Productdetaile') }}>
                                        <Text style={styles.button}>View Products</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={(item,index) => 'key-'+index}
                />
                <TabBar navigation={navigation} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    button: {
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
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Orderdetails);