import React, { Component } from 'react';
import {
    View, Text, Image, FlatList, StyleSheet
} from 'react-native';
import { COLORS } from '../Constants';
export default class Productdetaile extends Component {

    constructor(props) {
        super(props)
        this.state = {
            order: this.props.navigation.getParam('products'),
            total: this.props.navigation.getParam('ordetTotal')
        }
    }
    componentDidMount() {

    }
    render() {
        return (
            <View style={styles.main}>
                <View style={styles.container}>
                    <View style={{ marginVertical: 23 }}>
                        <FlatList
                            data={this.state.order}
                            renderItem={({ item }) => {
                                return (
                                    <View style={{ borderBottomWidth: 1, paddingVertical: 10, paddingHorizontal: 10, marginBottom: 20 }}>
                                        <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
                                            <Image source={{ uri: item.ProductImage }} style={{ width: 100, height: 90 }} />
                                            <Text style={{ fontSize: 16, color: COLORS.Primary, paddingLeft: 20 }}>SR: {item.ProductPrice}{'\n'}<Text style={{ color: 'black' }}>Qty {item.ProductQuantity}</Text>{'\n'}Total SR {item.ProductPriceTotal}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.id}
                        />
                    </View>
                </View>
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: COLORS.Primary }}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 20, borderTopWidth: 1, paddingVertical: 15 }}>
                        <Text style={{ fontSize: 17, color: '#FFFFFF' }}>Total</Text>
                        <Text style={{ fontSize: 17, color: '#FFFFFF' }}>SR: {this.state.total}</Text>
                    </View>
                </View>
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

})