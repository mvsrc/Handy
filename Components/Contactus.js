import React, { Component } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { COLORS, API_URL } from '../Constants';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import Axios from 'axios';
import Toast from 'react-native-simple-toast';
class Contactus extends Component {
    constructor(props) {
        super(props)
        this.state = {
            contactdata: [],
        }
    }
    componentDidMount() {
        this.props.LoadingStatusChange(true);
        this.contactdata()
    }
    contactdata = () => {
        Axios.get(API_URL + 'contactus.php?lang=ar')
            .then((res1) => {
                let {succcess,message} = res1.data;
                this.setState({ contactdata: res1.data });
                Toast.show(message, Toast.LONG)
                this.props.LoadingStatusChange(false);
            })
            .catch((error) => {
                console.log('Contact Error: ', error);
                this.props.LoadingStatusChange(false);
            });
    }
    render() {
        return (
            <View style={styles.main}>
                <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 15 }}>
                    <View style={styles.logoimage}>
                        <Text style={{ textAlign: 'center', fontSize: 30, paddingBottom: 10, fontWeight: 'bold', color: COLORS.Primary }}>Handy</Text>
                        <Image source={require('../assets/handy-logo.png')} style={{ width: '33%', height: 150 }} />
                    </View>
                    <View style={styles.textcontainer}>
                        <View style={styles.textinput}>
                            <Text style={styles.text}>Company Address</Text>
                            <Text style={styles.subtext}>{this.state.contactdata.address}</Text>
                        </View>

                        <View style={styles.textinput}>
                            <Text style={styles.text}>E-mail</Text>
                            <Text style={styles.subtext}>{this.state.contactdata.email1}</Text>
                            <Text style={styles.subtext}>{this.state.contactdata.email2}</Text>
                        </View>
                        <View style={styles.textinput}>
                            <Text style={styles.text}>Contact No.</Text>
                            <View style={{ flexDirection: 'row', justifyContent: "space-between", marginTop: 10 }}>
                                <Text style={{ fontSize: 17, paddingRight: 50 }}>{this.state.contactdata.contact1}</Text>
                                <Text style={{ fontSize: 17, paddingLeft: 30 }}>{this.state.contactdata.contact2}</Text>
                            </View>
                        </View>
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
    text: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 15
    }, 
    subtext: {
        fontSize: 17,
        paddingVertical: 5,
        textAlign: 'center'
    },
    logoimage: {
        alignItems: 'center',
        marginVertical: 10
    },
    textcontainer: {
        alignItems: 'center'
    },
    textinput: {

        paddingVertical: 4,

        width: 'auto', marginHorizontal: 10
    },
    textField: {
        fontSize: 20
    },
    button: {
        textAlign: 'center', backgroundColor: COLORS.Primary,
        width: 125,
        paddingVertical: 12,
        borderRadius: 20,
        fontSize: 15,
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
export default connect(mapStateToProps, mapDispatchToProps)(Contactus);