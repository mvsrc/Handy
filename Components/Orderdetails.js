import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import { COLORS, API_URL, IOSShadow } from '../Constants';
import { connect } from 'react-redux';
import TabBar from './TabBar';
import Axios from 'axios';
import { loadingChange } from "../Actions";
import Toast from 'react-native-simple-toast';
class Orderdetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: []
        }
    }
    componentDidMount() {
        this.fetchOrderDetails();
    }
    fetchOrderDetails = async () => {
        this.props.LoadingStatusChange(true);
        let { userData } = this.props.reducer;
        await Axios.get(`${API_URL}orderlistgw.php?action=gaswater&UserId=${userData.UserId}`)
            .then(res => {
                this.props.LoadingStatusChange(false);
                if (res.data.success == 1) {
                    this.setState({ order: res.data.Order });
                    console.log(res.data);
                }
                setTimeout(() => { Toast.show(res.data.message, Toast.SHORT) }, 300);
            })
            .catch(err => {
                console.log('Order Details Error', err);
                this.props.LoadingStatusChange(false);
            })
    }
    render() {
        let { navigation } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    contentContainerStyle={{ padding: 15 }}
                    data={this.state.order}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ borderWidth: 1, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10 }}>
                                    <Text style={{ fontSize: 17 }}>Order Id: #{item.OrderId}</Text>
                                    <Text style={{ fontSize: 16 }}>Date: {item.OrderDate.split(' ')[0]}{'\n'}Time: {item.OrderDate.split(' ')[1]} {item.OrderDate.split(' ')[2]}</Text>
                                </View>
                                <Text style={{ fontSize: 16, paddingLeft: 15 }}>Status: {item.OrderStatus}</Text>
                                <Text style={{ fontSize: 17, fontWeight: 'bold', paddingVertical: 10, paddingLeft: 15 }}>Delivered To</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 10 }}>
                    <Text style={{ fontSize: 17 }}>{item.UserHome} {'\n'}{item.UserDistrictName}</Text>
                        <Text style={{ fontSize: 16, paddingRight: 30 }}>{item.UserFName} {item.UserLName} {'\n'}{item.UserPhone}</Text>
                                </View>

                                <View style={{ marginVertical: 5, alignItems: 'flex-end' }}>
                                    <TouchableOpacity style={styles.button} onPress={() => { this.props.navigation.navigate('Productdetaile',{products:item.product,ordetTotal:item.OrderTotal}) }}>
                                        <Text style={styles.buttonText}>View Products</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={(item, index) => 'key-' + index}
                />
                <TabBar navigation={navigation} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    button: {
        ...IOSShadow,
        backgroundColor: COLORS.Primary,
        width: 175,
        paddingVertical: 10,
        borderRadius: 20
    },
    buttonText: {
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