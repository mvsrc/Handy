import React, { Component } from 'react';
import {
    View, Text,
    Image, ScrollView, KeyboardAvoidingView,
    TextInput, TouchableOpacity,
    StyleSheet, Keyboard
} from 'react-native';
import { connect } from 'react-redux';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import Axios from 'axios';
import Toast from 'react-native-simple-toast';
import { loadingChange } from '../Actions';
import { LangValue } from '../lang';
class Paycheckout extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: [],
            subTotal: 0,
            total: 0,
            discount: 0,
            couponCode: '',
            CouponId: '',
            discountData: {}
        }
    }
    static navigationOptions = ({navigation,screenProps})=>{
        let {lang} = screenProps;
        return{
            title: LangValue[lang].CHECKOUT,
        }
    };
    componentDidMount() {
        this.runApi();
    }
    runApi = () => {
        this.props.LoadingStatusChange(true);
        let { userData } = this.props.reducer;
        Axios.get(`${API_URL}cart.php?action=list&UserId=${userData.UserId}`)
            .then(res => {
                if (res.data.success == 1) {
                    let subTotal = 0;
                    let order = res.data.list;
                    order.map((item, index) => {
                        subTotal += parseFloat(item.ProductTotalPrice);
                    });
                    this.setState({
                        order,
                        subTotal,
                        total: subTotal
                    }, () => {
                        this.props.LoadingStatusChange(false);
                    });
                }
                else {
                    this.props.LoadingStatusChange(false);
                }
                setTimeout(() => {
                    Toast.show(res.data.message, Toast.SHORT);
                }, 200)
            })
            .catch(err => {
                console.log('Cart List', err);
                this.props.LoadingStatusChange(false);
            });
    }
    checkCoupon = () => {
        if (this.state.couponCode == '') {
            Toast.show('Please add coupon code', Toast.SHORT);
            return false;
        }
        Keyboard.dismiss();
        this.props.LoadingStatusChange(true);
        Axios.get(`${API_URL}coupon.php?action=coupon&CouponCode=${this.state.couponCode}&TotalPrice=${this.state.total}`)
            .then(res => {
                this.props.LoadingStatusChange(false);
                if (res.data.success == 1) {
                    this.setState({ discount: parseFloat(res.data.CouponDiscount), total: parseFloat(this.state.total) - parseFloat(res.data.CouponDiscount), discountData: res.data })
                }
                setTimeout(() => {
                    Toast.show(res.data.message, Toast.SHORT);
                }, 400);
            })
            .catch(err => {
                console.log('Coupon Error', err);
                this.props.LoadingStatusChange(false);
            })
    }
    makeOrder = () => {
        this.props.LoadingStatusChange(true);
        let { userData } = this.props.reducer;
        Axios.post(`${API_URL}orders.php?action=orders`, {
            UserId: userData.UserId,
            OrderSubTotal: this.state.subTotal,
            OrderTotal: this.state.total,
            delivery: this.props.navigation.getParam('dTimeId').DeliveryTimeId,
            deliverydate: this.props.navigation.getParam('dTimeId').DeliveryTimeName,
            CouponId: this.state.CouponId,
            CouponAmount: this.state.discount,
            orderdata: this.state.order,
        })
            .then(res => {
                this.props.LoadingStatusChange(false);
                if (res.data.success == 1) {
                    this.props.navigation.navigate('Home');
                }
                setTimeout(() => { Toast.show(res.data.message, Toast.SHORT) }, 300)
            })
            .catch(err => {
                console.log('Err', err);
                this.props.LoadingStatusChange(false);
            })
    }
    removeFromCart = (ProductId) => {

        this.props.LoadingStatusChange(true);
        let { userData } = this.props.reducer;
        let removeToCartUrl = `${API_URL}cart.php?action=cart&type=remove&ProductId=${ProductId}&UserId=${userData.UserId}`;
        Axios.get(removeToCartUrl)
            .then(res => {
                this.props.LoadingStatusChange(false);
                this.runApi();
                setTimeout(() => {
                    Toast.show(res.data.message, Toast.SHORT);
                }, 200);
            })
            .catch(err => {
                console.log('Remove from Cart Error', err);
            })
    }
    render() {
        let {lang} = this.props.reducer;
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled behavior="padding" style={{ flex: 1 }}>
                    <ScrollView contentContainerStyle={{ marginVertical: 2 }} keyboardShouldPersistTaps="handled">
                        <View style={styles.container} >
                            {
                                this.state.order.map((item, index) => (
                                    <View style={{ borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20,borderBottomColor:'#CCCCCC' }} key={'key' + index}>
                                        <View style={{ flexDirection: 'row', marginHorizontal: 10, justifyContent: "space-between", alignItems: 'center' }}>
                                            <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                                                <Image source={{ uri: item.ProductImage }} style={{ width: 80, height: 80 }} />
                                                <Text style={{ fontSize: 16, color: COLORS.Primary, paddingLeft: 20 }}>SR: {item.ProductPrice}{}{'\n'}<Text style={{ color: 'black' }}>Qty {item.ProductQuantity}</Text>{'\n'}{LangValue[lang].TOTAL} SR {item.ProductTotalPrice}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => {
                                                this.removeFromCart(item.ProductId);
                                            }}>
                                                <Icon name='delete' size={28} color='black' />
                                            </TouchableOpacity>
                                        </View>
                                    </View>)
                                )
                            }
                            <View style={{ marginBottom: 30,paddingHorizontal:20 }}>
                                <Text style={{ color: COLORS.Primary, fontSize: 16, fontWeight: 'bold', paddingLeft: 10, paddingBottom: 20,textAlign:'left' }}>{LangValue[lang].APPLY_PROMOTION_CODE}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: 20 }}>
                                    <TextInput
                                        placeholder='Enter Here'
                                        placeholderTextColor='gray'
                                        autoFocus={false}
                                        style={{ borderBottomColor: 'black', borderBottomWidth: 1, width: '60%', fontSize: 20 }}
                                        onChangeText={(txt) => { this.setState({ couponCode: txt }) }}
                                        value={this.state.couponCode}
                                    />
                                    <TouchableOpacity style={[styles.button, { width: 140, borderRadius: 5 }]} onPress={() => {
                                        this.checkCoupon();
                                    }}>
                                        <Text style={styles.btnText}>{LangValue[lang].APPLY}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 }}>
                                    <Text style={{ fontSize: 17, color: 'gray', textAlign: 'justify' }}>{LangValue[lang].SUBTOTAL}</Text>
                                    <Text style={{ fontSize: 17, color: 'gray', textAlign: 'justify' }}>SR: {this.state.subTotal}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 }}>
                                    <Text style={{ fontSize: 17, color: 'gray', textAlign: 'justify' }}>{LangValue[lang].DISCOUNT}</Text>
                                    <Text style={{ fontSize: 17, color: 'gray', textAlign: 'justify' }}>SR:{this.state.discount}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 15 }}>
                                    <Text style={{ fontSize: 17, color: COLORS.Primary }}>{LangValue[lang].TOTAL}</Text>
                                    <Text style={{ fontSize: 17, color: COLORS.Primary }}>SR:{this.state.total}</Text>
                                </View>
                                <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                    <TouchableOpacity style={styles.button} onPress={() => { this.makeOrder() }}>
                                        <Text style={styles.btnText}>{LangValue[lang].PAY}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    container: {
        marginVertical: 5,
    },
    button: {
        backgroundColor: COLORS.Primary,
        width: '30%',
        paddingVertical: 10,
        borderRadius: 20,
        ...IOSShadow
    },
    btnText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#FFFFFF',
    }

});
const mapStatetoProps = (state) => {
    const { reducer } = state;
    return { reducer };
}
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStatetoProps, mapDispatchToProps)(Paycheckout);