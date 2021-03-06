import React, { Component } from 'react';
import {
    View, Text,
    ScrollView,
    Linking,
    StyleSheet, TouchableOpacity, Image
} from 'react-native';
import { COLORS, IOSShadow } from '../Constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import { LangValue } from '../lang';
import SimpleToast from 'react-native-simple-toast';
class Homewastageorderdetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userdata: '',
            productList: this.props.navigation.getParam('productList')
        }
    }
    makeCall = (userPhone) => {
        let phoneNumber = '';
        phoneNumber = `telprompt:+966${userPhone}`;
        try {
            Linking.openURL(phoneNumber).then(res => {
            }).catch(err => {
                SimpleToast.show(err.message, SimpleToast.SHORT);
            });
        }
        catch (err) {
            SimpleToast.show(err, SimpleToast.SHORT);
        }
    };
    render() {
        let user = this.props.navigation.getParam('itemdata');
        let { lang } = this.props.reducer;
        return (
            <View style={styles.main}>

                <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{LangValue[lang].NAME}</Text>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{user.UserFName} {user.UserLName}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{LangValue[lang].PHONE_NUMBER}</Text>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{user.UserPhone}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{LangValue[lang].REGISTER_EMAIL}</Text>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{user.UserEmail}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{LangValue[lang].HOME_LOCATION}</Text>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{user.UserHome}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{LangValue[lang].CITY}</Text>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{user.UserDistrictName}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{LangValue[lang].DELIVERY_TIMING}</Text>
                            <Text style={{ width: '47%', fontSize: 14, textAlign: 'left' }}>{user.delivery}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: "space-around", alignItems: 'center', marginTop: 30 }}>
                            <TouchableOpacity style={styles.button} onPress={() => { this.makeCall(user.UserPhone) }}>
                                <Text style={styles.btnText}>{LangValue[lang].CALL}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                this.props.navigation.navigate('OrderLocation', { orderLocation: user.UserLocation, itemdata: user, type: this.props.navigation.getParam('type') });
                            }}>
                                <Icon name='paper-plane-o' size={25} color='#FFFFFF' style={styles.btnText} />
                            </TouchableOpacity>
                        </View>

                    </View>

                    {
                        typeof (this.state.productList) != 'undefined' && this.state.productList != '' &&
                        this.state.productList.map((item, index) => (
                            <View style={{ borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20 }} key={'key' + index}>
                                <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                                    <Image source={{ uri: item.ProductImage }} style={{ width: 70, height: 60 }} />
                                    <Text style={{ fontSize: 16, color: COLORS.Primary, paddingLeft: 20 }}>SR: {item.ProductPrice}{'\n'}<Text style={{ color: 'black' }}>Qty {item.ProductQuantity}</Text>{'\n'}Total SR {item.ProductPriceTotal}</Text>
                                </View>
                            </View>
                        ))

                    }
                </ScrollView>


            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
        marginHorizontal: 1,
        marginVertical: 2
    },
    subcontainer: {
        backgroundColor: COLORS.Primary,
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 35
    },
    container: {
        marginVertical: 10,
        marginHorizontal: 15,

    },
    button: {
        paddingHorizontal: 30,
        ...IOSShadow,
        backgroundColor: COLORS.Primary,
        paddingVertical: 5,

    },
    btnText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 17
    }

});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Homewastageorderdetail);