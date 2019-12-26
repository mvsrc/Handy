import React, { Component } from 'react';
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import Carousel from 'react-native-banner-carousel';
import SIcons from 'react-native-vector-icons/SimpleLineIcons';
import FIcons from 'react-native-vector-icons/FontAwesome';
import { loadingChange } from '../Actions';
import Axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import Toast from "react-native-simple-toast";
import * as _ from 'underscore';
import { LangValue } from '../lang';
const BannerWidth = Dimensions.get('window').width;
class Plangaswaterservice extends Component {
    currentProps = this.props;
    constructor(props) {
        super(props)
        this.state = {
            count: 1,
            gasIndex: 0,
            waterIndex: 0,
            waterList: [],
            gasList: [],
            watercompanyList: [],
            deliveryItems: [],
            dTimeId: 0,
            currentTabs: 'gas',
            selectedItem: '',
            company: '',
            filteredWaterList: [],
            fWC: false,
            isAddedtoCart: false,
            addedCartProductId: 0,
            addedCartList: [],
            cIndex: 0
        }
        this.runGasApi = this._runGasApi.bind(this);
        this.runWaterApi = this._runWaterApi.bind(this);
    }
    _runGasApi = async (countSet) => {
        this.currentProps.LoadingStatusChange(true);
        let { userData, lang } = this.currentProps.reducer;
        await Axios.get(`${API_URL}gas.php?action=gas&UserId=${userData.UserId}&lang=${lang}`)
            .then(res => {
                let { deliverytime } = res.data;
                this.reOrderTime(deliverytime);
                let count = typeof (countSet) == 'undefined' ? parseInt(res.data.gas[0].GasMin) : parseInt(countSet);
                this.setState({
                    gasList: res.data.gas,
                    count,
                    addedCartList: res.data.list,
                    cIndex: 0
                }, () => {
                    this.currentProps.LoadingStatusChange(false);
                })
            })
            .catch(err => {
                console.log('Gas Error', err);
                this.currentProps.LoadingStatusChange(false);
            })
    }
    _runWaterApi = async (countSet) => {
        this.currentProps.LoadingStatusChange(true);
        let { userData, lang } = this.currentProps.reducer;
        await Axios.get(`${API_URL}water.php?action=water&UserId=${userData.UserId}&lang=${lang}`)
            .then(res => {
                let watercompanyList = [];
                res.data.watercompany.map((item, index) => {
                    watercompanyList.push({ label: item.CompanyName, value: item.CompanyId });
                });
                let count = typeof (countSet) == 'undefined' ? parseInt(res.data.water[0].WaterMin) : parseInt(countSet);
                let { deliverytime } = res.data;
                this.reOrderTime(deliverytime);
                this.setState({
                    waterList: res.data.water,
                    count,
                    addedCartList: res.data.list,
                    watercompanyList,
                    cIndex: 0
                }, () => {
                    this.currentProps.LoadingStatusChange(false);
                })
            })
            .catch(err => {
                console.log('Gas Error', err);
                this.currentProps.LoadingStatusChange(false);
            })
    }
    componentDidMount() {
        this.listner = this.currentProps.navigation.addListener('willFocus', () => {
            this.runGasApi();
        });
    }
    addToCart = (type) => {
        let addToCartUrl = '';
        let { userData, lang } = this.currentProps.reducer;
        if (type == 'water') {
            let WaterData = this.state.waterList[this.state.waterIndex];
            let totalProductPrice = WaterData.WaterPrice * this.state.count;
            addToCartUrl = `${API_URL}cart.php?action=cart&type=add&ProductId=${WaterData.WaterId}&UserId=${userData.UserId}&ProductQuantity=${this.state.count}&ProductPrice=${WaterData.WaterPrice}&ProductTotalPrice=${totalProductPrice}&ProductType=water&lang=${lang}`;
        }
        else {
            let GasData = this.state.gasList[this.state.gasIndex];
            let totalProductPrice = GasData.GasPrice * this.state.count;
            addToCartUrl = `${API_URL}cart.php?action=cart&type=add&ProductId=${GasData.GasId}&UserId=${userData.UserId}&ProductQuantity=${this.state.count}&ProductPrice=${GasData.GasPrice}&ProductTotalPrice=${totalProductPrice}&ProductType=gas&lang=${lang}`;
        }
        this.currentProps.LoadingStatusChange(true);
        Axios.get(addToCartUrl)
            .then(res => {
                this.currentProps.LoadingStatusChange(false);
                if (type == 'water') {
                    this.runWaterApi(this.state.count);
                }
                else if (type == 'gas') {
                    this.runGasApi(this.state.count);
                }
                setTimeout(() => {
                    Toast.show(res.data.message, Toast.SHORT);
                }, 200);
            })
            .catch(err => {
                console.log('Add to Cart Error', err);
            })
    }
    removeFromCart = (type, ProductId) => {
        let { userData, lang } = this.currentProps.reducer;
        let removeToCartUrl = `${API_URL}cart.php?action=cart&type=remove&ProductId=${ProductId}&UserId=${userData.UserId}&lang=${lang}`;
        Axios.get(removeToCartUrl)
            .then(res => {
                this.currentProps.LoadingStatusChange(false);
                if (type == 'water') {
                    this.runWaterApi();
                }
                else if (type == 'gas') {
                    this.runGasApi();
                }
                setTimeout(() => {
                    Toast.show(res.data.message, Toast.SHORT);
                }, 200);
            })
            .catch(err => {
                console.log('Remove from Cart Error', err);
            })
    }
    checkisAddedtoCart = (type, productId) => {
        if (this.state.addedCartList.length > 0) {
            let results = _.where(this.state.addedCartList, { ProductId: productId, ProductType: type });
            return results;
        }
        return false;
    }
    UpdateCart = (type) => {
        let addToCartUrl = '';
        let { userData, lang } = this.currentProps.reducer;
        if (type == 'water') {
            let WaterData = this.state.waterList[this.state.waterIndex];
            let totalProductPrice = WaterData.WaterPrice * this.state.count;
            addToCartUrl = `${API_URL}cart.php?action=cart&type=update&ProductId=${WaterData.WaterId}&UserId=${userData.UserId}&ProductQuantity=${this.state.count}&ProductPrice=${WaterData.WaterPrice}&ProductTotalPrice=${totalProductPrice}&lang=${lang}`;
        }
        else {
            let GasData = this.state.gasList[this.state.gasIndex];
            let totalProductPrice = GasData.GasPrice * this.state.count;
            addToCartUrl = `${API_URL}cart.php?action=cart&type=update&ProductId=${GasData.GasId}&UserId=${userData.UserId}&ProductQuantity=${this.state.count}&ProductPrice=${GasData.GasPrice}&ProductTotalPrice=${totalProductPrice}&lang=${lang}`;
        }
        this.currentProps.LoadingStatusChange(true);
        Axios.get(addToCartUrl)
            .then(res => {
                this.currentProps.LoadingStatusChange(false);
                if (type == 'water') {
                    this.runWaterApi(this.state.count);
                }
                else if (type == 'gas') {
                    this.runGasApi(this.state.count);
                }
                setTimeout(() => {
                    Toast.show(res.data.message, Toast.SHORT);
                }, 200);
            })
            .catch(err => {
                console.log('Add to Cart Error', err);
            })
    }
    reOrderTime = (dT) => {
        let { lang } = this.props.reducer;
        let dTimesOrder = [];
        //let dTime = dT.reverse();
        dT.map((item, index) => {
            let DeliveryTimeName = item.DeliveryTimeName.split('-');
            let fromTime = this.convertTime12to24(DeliveryTimeName[0]);
            let TodaysDateTime = new Date();
            let DTDateTime = new Date(`${TodaysDateTime.getFullYear()}-${TodaysDateTime.getMonth() + 1}-${TodaysDateTime.getDate()} ${fromTime}`);
            let nextText = '';
            let isToday = false;
            if (TodaysDateTime.getTime() > DTDateTime.getTime()) {
                nextText = LangValue[lang].TOMORROW;
                let TomorrowDate = new Date(DTDateTime.getTime());
                TomorrowDate.setDate(TomorrowDate.getDate() + 1);
                dTimesOrder.push({ DeliveryTimeName: `${item.DeliveryTimeName} (${LangValue[lang].TOMORROW})`, DeliveryTimeId: item.DeliveryTimeId, dateTime: TomorrowDate.getTime(), isToday: false });
            }
            else {
                isToday = true;
                nextText = LangValue[lang].TODAY;
                let TomorrowDate = new Date(DTDateTime.getTime());
                TomorrowDate.setDate(TomorrowDate.getDate() + 1);
                dTimesOrder.push({ DeliveryTimeName: `${item.DeliveryTimeName} (${nextText})`, DeliveryTimeId: item.DeliveryTimeId, dateTime: DTDateTime.getTime(), isToday });
                dTimesOrder.push({ DeliveryTimeName: `${item.DeliveryTimeName} (${LangValue[lang].TOMORROW})`, DeliveryTimeId: item.DeliveryTimeId, dateTime: TomorrowDate.getTime(), isToday: false });
            }

        });
        let lengthOfToday = _.where(dTimesOrder, { isToday: true });

        dTimesOrder.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.

            return new Date(a.dateTime) - new Date(b.dateTime);
        });
        if (lengthOfToday.length > 1) {
            // dTimesOrder.map((item, index) => {
            //     if (item.isToday == false) {
            //         dTimesOrder.splice(index, 1);
            //     }
            // });
            dTimesOrder = _.reject(dTimesOrder, (item) => {
                return item.isToday == false;

            })
        }

        this.setState({ deliveryItems: dTimesOrder });
    }
    convertTime12to24(time12h) {
        let [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }
        return `${hours}:${minutes}:00`;
    }
    render() {
        //'#29a4b3'
        let { lang } = this.props.reducer;
        return (
            <View style={styles.main}>
                <ScrollView contentContainerStyle={{ marginHorizontal: 10, marginBottom: 30 }}>
                    <View style={styles.logoimage}>
                        <TouchableOpacity onPress={() => { this.setState({ currentTabs: 'gas' }, () => { this.runGasApi() }) }} activeOpacity={2}>
                            {this.state.currentTabs == 'gas' ? <Image source={require('../assets/gas-blue.png')} style={{ width: 50, height: 105 }} /> : <Image source={require('../assets/gas-gray.png')} style={{ width: 50, height: 105 }} />}
                            <Text style={{ fontSize: 16, color: (this.state.currentTabs == 'gas') ? '#29a4b3' : 'gray', textAlign: 'center' }} >{LangValue[lang].GAS}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={2} onPress={() => {
                            this.setState({ currentTabs: 'water', }, () => {
                                this.runWaterApi();
                            })
                        }}>
                            {this.state.currentTabs == 'water' ? <Image source={require('../assets/water-blue.png')} style={{ width: 60, height: 100 }} /> : <Image source={require('../assets/water-gray.png')} style={{ width: 60, height: 100 }} />}
                            <Text style={{ fontSize: 16, color: (this.state.currentTabs == 'water') ? '#29a4b3' : 'gray', textAlign: 'center' }}>{LangValue[lang].WATER}</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        this.state.currentTabs == 'water' &&
                        <View style={{ flexDirection: 'row', marginBottom: 20, marginHorizontal: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16 }}>{LangValue[lang].COMPANY}</Text>
                            {
                                this.state.watercompanyList.length > 0 &&
                                <RNPickerSelect
                                    placeholder={{
                                        label: 'All Company',
                                        value: null,
                                        color: COLORS.Primary,
                                    }}
                                    items={this.state.watercompanyList}
                                    value={this.state.company}
                                    style={{
                                        inputIOS: {
                                            marginLeft: 10,
                                            fontSize: 15,
                                            paddingVertical: 5,
                                            borderWidth: 1,
                                            borderColor: 'gray',
                                            color: '#000000',
                                            paddingLeft: 10, // to ensure the text is never behind the icon
                                            paddingRight: 30,
                                            borderRadius: 10
                                        },
                                    }}
                                    onValueChange={value => {
                                        if (value != null) {
                                            let filteredWaterList = []
                                            this.state.waterList.map((item, index) => {
                                                if (item.WaterCompany == value) {
                                                    filteredWaterList.push(item)
                                                }
                                            })
                                            this.setState({ company: value, fWC: true, filteredWaterList });
                                        }
                                        else {
                                            this.setState({ filteredWaterList: [], fWC: false, company: value });
                                        }
                                    }}
                                    disabled={false}
                                />
                            }
                        </View>
                    }
                    {
                        this.state.currentTabs == 'gas' && this.state.gasList.length > 0 &&
                        <Carousel
                            loop={false}
                            autoplay={false}
                            index={this.state.cIndex}
                            pageSize={BannerWidth}
                            showsPageIndicator={true}
                            onPageChanged={(index) => {
                                if (this.state.currentTabs == 'gas') {
                                    let SetCount = parseInt(this.state.gasList[index].GasMin);
                                    let checkisAddedtoCart = this.checkisAddedtoCart('gas', this.state.gasList[index].GasId)[0];
                                    if (checkisAddedtoCart) {
                                        SetCount = checkisAddedtoCart.ProductQuantity;
                                    }
                                    this.setState({ gasIndex: index, count: SetCount, cIndex: index });
                                }
                                if (this.state.currentTabs == 'water') {
                                    let SetCount = parseInt(this.state.waterList[index].WaterMin);
                                    let checkisAddedtoCart = this.checkisAddedtoCart('water', this.state.waterList[index].WaterId)[0];
                                    if (checkisAddedtoCart) {
                                        SetCount = checkisAddedtoCart.ProductQuantity;
                                    }
                                    this.setState({ waterIndex: index, count: SetCount, cIndex: index });
                                }
                            }}
                        >
                            {
                                this.state.gasList.map((item, index) => (
                                    <View key={'carousal-' + index}>
                                        <Image style={{ width: BannerWidth - 20, height: 180 }} source={{ uri: item.GasImg }} />
                                    </View>
                                ))
                            }
                        </Carousel>
                    }
                    {
                        this.state.currentTabs == 'water' && this.state.waterList.length > 0 && this.state.fWC == false &&
                        <Carousel
                            loop={false}
                            autoplay={false}
                            index={this.state.cIndex}
                            pageSize={BannerWidth}
                            showsPageIndicator={true}
                            onPageChanged={(index) => {
                                if (this.state.currentTabs == 'gas') {
                                    let SetCount = parseInt(this.state.gasList[index].GasMin);
                                    let checkisAddedtoCart = this.checkisAddedtoCart('gas', this.state.gasList[index].GasId)[0];
                                    if (checkisAddedtoCart) {
                                        SetCount = checkisAddedtoCart.ProductQuantity;
                                    }
                                    this.setState({ gasIndex: index, count: SetCount, cIndex: index });
                                }
                                if (this.state.currentTabs == 'water') {
                                    let SetCount = parseInt(this.state.waterList[index].WaterMin);
                                    let checkisAddedtoCart = this.checkisAddedtoCart('water', this.state.waterList[index].WaterId)[0];
                                    if (checkisAddedtoCart) {
                                        SetCount = checkisAddedtoCart.ProductQuantity;
                                    }
                                    this.setState({ waterIndex: index, count: SetCount, cIndex: index });
                                }
                            }}
                        >
                            {
                                this.state.waterList.map((item, index) => (
                                    <View key={'carousal-' + index}>
                                        <Image style={{ width: BannerWidth - 20, height: 180 }} source={{ uri: item.WaterImg }} />
                                    </View>
                                ))
                            }
                        </Carousel>
                    }
                    {
                        this.state.currentTabs == 'water' && this.state.filteredWaterList.length > 0 && this.state.fWC == true &&
                        <Carousel
                            loop={false}
                            autoplay={false}
                            index={this.state.cIndex}
                            pageSize={BannerWidth}
                            showsPageIndicator={true}
                            onPageChanged={(index) => {
                                if (this.state.currentTabs == 'gas') {
                                    let SetCount = parseInt(this.state.gasList[index].GasMin);
                                    let checkisAddedtoCart = this.checkisAddedtoCart('gas', this.state.gasList[index].GasId)[0];
                                    if (checkisAddedtoCart) {
                                        SetCount = checkisAddedtoCart.ProductQuantity;
                                    }
                                    this.setState({ gasIndex: index, count: SetCount, cIndex: index });
                                }
                                if (this.state.currentTabs == 'water') {
                                    let SetCount = parseInt(this.state.waterList[index].WaterMin);
                                    let checkisAddedtoCart = this.checkisAddedtoCart('water', this.state.waterList[index].WaterId)[0];
                                    if (checkisAddedtoCart) {
                                        SetCount = checkisAddedtoCart.ProductQuantity;
                                    }
                                    this.setState({ waterIndex: index, count: SetCount, cIndex: index });
                                }
                            }}
                        >
                            {
                                this.state.filteredWaterList.map((item, index) => (
                                    <View key={'carousal-' + index}>
                                        <Image style={{ width: BannerWidth-20, height: 180 }} source={{ uri: item.WaterImg }} />
                                    </View>
                                ))
                            }
                        </Carousel>
                    }
                    {
                        this.state.currentTabs == 'gas' && this.state.gasList.length > 0 &&
                        <View>
                            <View style={{ flexDirection: 'row', width: '100%', marginRight: 10, marginTop: 30 }}>
                                <View style={{ flexDirection: 'row', width: '50%', justifyContent: "space-evenly", paddingRight: 30, alignItems: 'center' }}>
                                    <SIcons name='minus' size={28} color={COLORS.Primary} onPress={() => {
                                        if (this.state.count > this.state.gasList[this.state.gasIndex].GasMin) {
                                            this.setState({ count: parseInt(this.state.count) - 1 })
                                        }
                                    }} />
                                    <View style={styles.counttextWrapper}>
                                        <Text style={styles.countText}>{this.state.count}</Text>
                                    </View>
                                    <SIcons name='plus' size={28} color={COLORS.Primary} onPress={() => {

                                        if (this.state.count < this.state.gasList[this.state.gasIndex].GasMax) {
                                            this.setState({ count: parseInt(this.state.count) + 1 });
                                        }
                                    }} />
                                </View>
                                <View style={{ flexDirection: 'row', width: '50%', justifyContent: "space-between", paddingHorizontal: 20, alignItems: 'center' }}>
                                    <Text style={{ fontSize: 15, color: COLORS.Primary }}>Price : SR {this.state.gasList[this.state.gasIndex].GasPrice}</Text>
                                    <Image source={require('../assets/gas-blue.png')} style={{ width: 27, height: 58 }} />
                                </View>
                            </View>
                            <View style={{ marginVertical: 20, paddingLeft: 10 }}>
                                {
                                    this.checkisAddedtoCart('gas', this.state.gasList[this.state.gasIndex].GasId) == false &&
                                    <TouchableOpacity style={styles.button} onPress={() => {
                                        this.addToCart('gas');
                                    }}>
                                        <Text style={styles.btnText}>{LangValue[lang].ADD_TO_CART}</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    this.checkisAddedtoCart('gas', this.state.gasList[this.state.gasIndex].GasId) != false &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            this.UpdateCart('gas');
                                        }}>
                                            <Text style={styles.btnText}>{LangValue[lang].ADDED_TO_CART}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                                            this.removeFromCart('gas', this.state.gasList[this.state.gasIndex].GasId)
                                        }}>
                                            <FIcons name="trash" size={30} color={COLORS.Primary} />
                                        </TouchableOpacity>
                                    </View>
                                }

                            </View>
                        </View>
                    }
                    {
                        this.state.currentTabs == 'water' && this.state.waterList.length > 0 &&
                        <View>
                            <View style={{ flexDirection: 'row', width: '100%', marginRight: 10, marginTop: 30 }}>
                                <View style={{ flexDirection: 'row', width: '50%', justifyContent: "space-evenly", paddingRight: 30, alignItems: 'center' }}>
                                    <SIcons name='minus' size={28} color={COLORS.Primary} onPress={() => {
                                        if (this.state.count > this.state.waterList[this.state.waterIndex].WaterMin) {
                                            this.setState({ count: parseInt(this.state.count) - 1 })
                                        }
                                    }} />
                                    <View style={styles.counttextWrapper}>
                                        <Text style={styles.countText}>{this.state.count}</Text>
                                    </View>
                                    <SIcons name='plus' size={28} color={COLORS.Primary} onPress={() => {
                                        if (this.state.count < this.state.waterList[this.state.gasIndex].WaterMax) {
                                            this.setState({ count: parseInt(this.state.count) + 1 });
                                        }
                                    }} />
                                </View>
                                <View style={{ flexDirection: 'row', width: '50%', justifyContent: "space-between", paddingHorizontal: 20, alignItems: 'center' }}>
                                    <View>
                                        <Text style={{ fontSize: 15, color: COLORS.Primary, textAlign: 'center' }}>{this.state.waterList[this.state.waterIndex].WaterSize}</Text>
                                        <Text style={{ fontSize: 15, color: COLORS.Primary }}>Price : SR {this.state.waterList[this.state.waterIndex].WaterPrice}</Text>
                                    </View>
                                    <Image source={require('../assets/water-blue.png')} style={{ width: 35, height: 58 }} />
                                </View>
                            </View>
                            <View style={{ marginVertical: 20, paddingLeft: 10 }}>
                                {
                                    this.checkisAddedtoCart('water', this.state.waterList[this.state.waterIndex].WaterId) == false &&
                                    <TouchableOpacity style={styles.button} onPress={() => {
                                        this.addToCart('water');
                                    }}>
                                        <Text style={styles.btnText}>{LangValue[lang].ADD_TO_CART}</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    this.checkisAddedtoCart('water', this.state.waterList[this.state.waterIndex].WaterId) != false &&
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <TouchableOpacity style={styles.button} onPress={() => {
                                            this.UpdateCart('water');
                                        }}>
                                            <Text style={styles.btnText}>{LangValue[lang].ADDED_TO_CART}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                                            this.removeFromCart('water', this.state.waterList[this.state.waterIndex].WaterId)
                                        }}>
                                            <FIcons name="trash" size={30} color={COLORS.Primary} />
                                        </TouchableOpacity>
                                    </View>
                                }

                            </View>
                        </View>
                    }
                    <TouchableOpacity style={{ width: 115, borderBottomWidth: 1, borderBottomColor: '#666666', marginLeft: 10 }}>
                        <Text style={{ fontSize: 15, color: '#666666', }}>{LangValue[lang].ADD_MORE_ITEMS}.</Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 16, color: COLORS.Primary, marginLeft: 10, paddingVertical: 15, textAlign: 'left' }}>{LangValue[lang].SELECT_DELIVERY_TIME}</Text>
                    {
                        this.state.deliveryItems.length > 0 &&
                        this.state.deliveryItems.map((item, index) => {
                            console.log();
                            return (
                                <TouchableOpacity onPress={() => { this.setState({ dTimeId: index }) }} activeOpacity={0.6} style={styles.radioButton} key={'dTimes-key-' + index}>
                                    <View style={[styles.radioButtonHolder, { height: 20, width: 20, borderColor: COLORS.Primary }]}>
                                        {
                                            this.state.dTimeId == index &&
                                            <View style={[styles.radioIcon, { height: 10, width: 10, backgroundColor: COLORS.Primary }]}></View>
                                        }
                                    </View>
                                    <Text style={[styles.label, { color: '#232323' }]}>{item.DeliveryTimeName}</Text>
                                </TouchableOpacity>
                            );
                        })
                    }
                    <View style={{ marginVertical: 30, alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('Paycheckout', { dTimeId: this.state.dTimeId }) }} style={styles.button}>
                            <Text style={styles.btnText}>{LangValue[lang].PAY_NOW}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    main: {
        flex: 1,

    },
    subtext: {
        fontSize: 17,
        paddingVertical: 5,
        textAlign: 'center'
    },
    logoimage: {
        alignItems: 'center',
        marginVertical: 25,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    textcontainer: {
        marginTop: 30,
        alignItems: 'center'
    },

    button: {
        ...IOSShadow,
        backgroundColor: COLORS.Primary,
        width: 140,
        paddingVertical: 12,
        borderRadius: 20,

    },
    btnText: {
        textAlign: 'center',
        fontSize: 15,
        color: '#FFFFFF'
    },
    counttextWrapper: {
        borderWidth: 2,
        borderColor: COLORS.Primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 40,

    },
    countText: {
        fontSize: 15,
        color: COLORS.Primary,
        textAlign: 'center',
        fontWeight: 'bold'
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


});
const mapStatetoProps = (state) => {
    const { reducer } = state;
    return { reducer };
}
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStatetoProps, mapDispatchToProps)(Plangaswaterservice);