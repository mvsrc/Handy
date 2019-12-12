import React, { Component } from 'react';
import {
    View, Text, Image, FlatList, StyleSheet
} from 'react-native';
import { COLORS } from '../Constants';
import { LangValue } from '../lang';
import { connect } from 'react-redux';
class Productdetaile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            order: this.props.navigation.getParam('products'),
            total: this.props.navigation.getParam('ordetTotal')
        }
    }
    render() {
        let { lang } = this.props.reducer;
        return (
            <View style={styles.main}>
                <FlatList
                    data={this.state.order}
                    renderItem={({ item }) => {
                        return (
                            <View style={{ borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                                    <Image source={{ uri: item.ProductImage }} style={{ width: 100, height: 90 }} />
                                    <Text style={{ fontSize: 16, color: COLORS.Primary, paddingLeft: 20 }}>SR: {item.ProductPrice}{'\n'}<Text style={{ color: 'black' }}>Qty {item.ProductQuantity}</Text>{'\n'}{LangValue[lang].TOTAL} SR {item.ProductPriceTotal}</Text>
                                </View>
                            </View>
                        )
                    }}
                    keyExtractor={item => item.id}
                />
                <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, borderTopWidth: 1, paddingVertical: 15 }}>
                    <Text style={{ fontSize: 17, color: COLORS.Primary,fontWeight:'bold' }}>{LangValue[lang].TOTAL}</Text>
                    <Text style={{ fontSize: 17, color: COLORS.Primary,fontWeight:'bold' }}>SR: {this.state.total}</Text>
                </View>
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
export default connect(mapStateToProps)(Productdetaile);