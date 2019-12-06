import React, { Component } from 'react';
import {
    View, Text,
    Image, Picker, FlatList,
    StyleSheet, ScrollView
} from 'react-native';
import { COLORS } from '../Constants';
export default class Planhistory extends Component {
    currentProps = this.props;
    constructor(props) {
        super(props)
        this.state = {
            plan: '1 Month',
            days: '-10 Days Left',
            month: 'Noverber',
            number: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '16', '17', '18',
                '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
        }
    }
    render() {
        return (
            <ScrollView contentContainerStyle={{ padding: 10 }}>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 13, marginVertical: 5 }}>
                        <Text style={{ fontSize: 16 }}>Plan:{this.state.plan}</Text>
                        <Text style={{ fontSize: 16 }}>Plan:{this.state.days}</Text>
                    </View>
                    <Text style={{ textAlign: "center", marginVertical: 25, fontSize: 25, fontWeight: 'bold' }}>Subscription: 1</Text>
                    <View style={{ marginVertical: 5 }}>
                        <Picker
                            mode="dropdown"
                            selectedValue={this.state.month}
                            style={{ height: 50, width: '100%' }}
                            onValueChange={(itemValue, itemIndex) =>
                                this.setState({ month: itemValue })
                            }>
                            <Picker.Item label="Novermber" value="November" />
                        </Picker>
                    </View>
                    <Text style={{ fontSize: 16, paddingTop: 20, paddingLeft: 10 }}>Home Wastage</Text>
                    <View style={{ marginVertical: 23, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                        {
                            this.state.number.map((item, index) => (
                                <View key={'key-' + index} style={{ borderRadius: 5, borderWidth: 1, borderColor: COLORS.Primary, marginHorizontal: 3, marginVertical: 3, width: 45, height: 45, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center' }}>{item} -</Text>
                                </View>
                            ))
                        }
                    </View>
                    <Text style={{ fontSize: 16, paddingTop: 15, paddingLeft: 10 }}>Gas &amp; Water</Text>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", marginHorizontal: 35, marginVertical: 5 }}>
                        <View>
                            <Image source={require('../assets/gas-blue.png')} style={{ width: 47, height: 97, }} />
                            <Text style={{ fontSize: 18, color: COLORS.Primary, paddingTop: 10 }}>2 Times</Text></View>
                        <View>
                            <Image source={require('../assets/water-blue.png')} style={{ width: 60, height: 97, }} />
                            <Text style={{ fontSize: 18, color: COLORS.Primary, paddingTop: 10 }}>0 Times</Text></View>
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
        marginHorizontal: 5
    },
    button: {
        textAlign: 'center', backgroundColor: COLORS.Primary,
        width: 135,
        paddingVertical: 13,
        borderRadius: 20,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }

});