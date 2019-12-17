import React, { Component } from 'react';
import {
    View, Text,
    Image, Picker,
    StyleSheet, ScrollView
} from 'react-native';
import { COLORS, IOSShadow } from '../Constants';
import { connect } from 'react-redux';
import { LangValue } from '../lang';
import RNPickerSelect from 'react-native-picker-select';
import * as _ from 'underscore';
class Planhistory extends Component {
    currentProps = this.props;
    constructor(props) {
        super(props);
        let date = new Date();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let daysInMonth = this.daysInMonth(month, year);
        let number = [];
        for (let i = 1; i <= daysInMonth; i++) {
            let n = i;
            if(i< 10){n = '0'+n; }
            number.push('' + n);
        }
        this.state = {
            resultData: this.props.navigation.getParam('SubsData'),
            monthsList: [
                { label: 'January', value: '01' },
                { label: 'Febraury', value: '02' },
                { label: 'March', value: '03' },
                { label: 'April', value: '04' },
                { label: 'May', value: '05' },
                { label: 'June', value: '06' },
                { label: 'July', value: '07' },
                { label: 'August', value: '08' },
                { label: 'September', value: '09' },
                { label: 'October', value: '10' },
                { label: 'November', value: '11' },
                { label: 'December', value: '12' }
            ],
            month: '' + month,
            number
        }
    }
    daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
    render() {
        let { lang } = this.props.reducer;
        return (
            <ScrollView contentContainerStyle={{ padding: 10, flex: 1 }}>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 13, marginVertical: 5 }}>
                        <Text style={{ fontSize: 16 }}>{LangValue[lang].PLAN} : {this.state.resultData.SubscriptionPlan}</Text>
                        <Text style={{ fontSize: 16 }}>{this.state.resultData.RemainingDays} {LangValue[lang].DAYS_LEFT}</Text>
                    </View>
                    <Text style={{ textAlign: "center", marginVertical: 25, fontSize: 25, fontWeight: 'bold' }}>{LangValue[lang].SUBSCRIPTION_NO} : {this.state.resultData.SubscriptionId}</Text>
                    <View style={{ marginVertical: 5 }}>
                        <RNPickerSelect
                            items={this.state.monthsList}
                            value={this.state.month}
                            style={{
                                inputIOS: {
                                    fontSize: 15,
                                    paddingVertical: 10,
                                    borderRadius: 5,
                                    ...IOSShadow,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 1,
                                    borderColor: '#666666',
                                    color: '#000000',
                                    textAlign: (lang == 'ar' ? 'right' : 'left'),
                                    paddingHorizontal: 10,
                                },
                            }}
                            onValueChange={value => {
                                if (value) {
                                    this.setState({ month: value });
                                }
                            }}
                            disabled={false}
                        />
                    </View>
                    <Text style={{ fontSize: 16, paddingTop: 20, paddingLeft: 10,textAlign:'left' }}>{LangValue[lang].HOME_WASTAGE}</Text>
                    <View style={{ marginVertical: 23, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                        {
                            this.state.number.map((item, index) => {
                                let isGiven = _.findWhere(this.state.resultData.wastage, {HomeWastageDay:item,HomeWastageMonth:this.state.month});
                                return (
                                    <View key={'key-' + index} style={{ borderRadius: 5, borderWidth: 1, borderColor: COLORS.Primary, marginHorizontal: 2, marginVertical: 2, width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ position: 'absolute', top: 2, left: 2, fontSize: 7 }}>{item}</Text>
                                        {
                                            typeof(isGiven) === 'undefined' &&
                                            <Text style={{ textAlign: 'center',fontSize:12 }}>-</Text>
                                        }
                                        {
                                            typeof(isGiven) !== 'undefined' &&
                                            <Text style={{ textAlign: 'center',fontSize:12 }}>Y</Text>
                                        }
                                    </View>
                                );
                            })
                        }
                    </View>
                    <Text style={{ fontSize: 16, paddingTop: 15, paddingLeft: 10,textAlign:'left' }}>{LangValue[lang].GAS_WATER}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: 35, marginVertical: 15 }}>
                        <View>
                            <Image source={require('../assets/gas-blue.png')} style={{ width: 47, height: 97, }} />
                            <Text style={{ fontSize: 18, color: COLORS.Primary, paddingTop: 10 }}>{this.state.resultData.gas} {LangValue[lang].TIMES}</Text></View>
                        <View>
                            <Image source={require('../assets/water-blue.png')} style={{ width: 60, height: 97, }} />
                            <Text style={{ fontSize: 18, color: COLORS.Primary, paddingTop: 10 }}>{this.state.resultData.water} {LangValue[lang].TIMES}</Text></View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
    subcontainer: {
        backgroundColor: COLORS.Primary,
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 35
    },
    container: {
        marginVertical: 5,
    },
    button: {

        backgroundColor: COLORS.Primary,
        width: 135,
        paddingVertical: 13,
        borderRadius: 20,
    },
    btnText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }
});
const mapStatetoProps = (state) => {
    const { reducer } = state;
    return { reducer };
}
export default connect(mapStatetoProps)(Planhistory);