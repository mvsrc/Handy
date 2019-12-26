import React, { Component } from 'react';
import {
    View, Text,
    ScrollView, KeyboardAvoidingView,
    TextInput, TouchableOpacity, Keyboard,
    StyleSheet
} from 'react-native';

import { COLORS, API_URL, IOSShadow } from '../Constants';
import Toast from 'react-native-simple-toast';
import Axios from 'axios';
import { connect } from 'react-redux';
import { LangValue } from '../lang';
import { loadingChange } from '../Actions';
class Feedback extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedItem: 'Feedback',
            comtxt: ''
        }
    }
    feedbackdata = async () => {
        this.props.LoadingStatusChange(true);
        Keyboard.dismiss();
        let { userData } = this.props.reducer;
        Axios.post(`${API_URL}feedcom.php?action=feedcom&FeecomText=${this.state.comtxt}&UserId=${userData.UserId}&FeecomType=${this.state.selectedItem}&lang=${this.props.reducer.lang}`)
            .then(res => {
                let {success,message} = res.data;
                setTimeout(()=>{Toast.showWithGravity(message,Toast.SHORT,Toast.CENTER)},100);
                if(success == 1){
                    this.setState({comtxt:''});
                }
                this.props.LoadingStatusChange(false);
            })
            .catch(err => {
                this.props.LoadingStatusChange(false);
                console.log('District Error', err);
            })

    }
    changeActiveRadioButton(index) {
        this.setState({ selectedItem: index });
    }
    render() {
        let { lang } = this.props.reducer;
        return (
            <View style={styles.main}>
                <KeyboardAvoidingView enabled>
                    <ScrollView keyboardShouldPersistTaps="always">
                        <View style={styles.container}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { { this.changeActiveRadioButton('Feedback') } }} activeOpacity={0.8} style={styles.radioButton}>
                                    <View style={[styles.radioButtonHolder, { height: 20, width: 20, borderColor: '#000000' }]}>
                                        {
                                            this.state.selectedItem == 'Feedback' &&
                                            <View style={[styles.radioIcon, { height: 10, width: 10, backgroundColor: '#000000' }]}></View>
                                        }
                                    </View>
                                    <Text style={[styles.label, { color: '#000000' }]}>{LangValue[lang].FEEDBACK}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { { this.changeActiveRadioButton('Suggestion') } }} activeOpacity={0.8} style={styles.radioButton}>
                                    <View style={[styles.radioButtonHolder, { height: 20, width: 20, borderColor: '#000000' }]}>
                                        {
                                            this.state.selectedItem == 'Suggestion' &&
                                            <View style={[styles.radioIcon, { height: 10, width: 10, backgroundColor: '#000000' }]}></View>
                                        }
                                    </View>
                                    <Text style={[styles.label, { color: '#000000' }]}>{LangValue[lang].SUGGESTION}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => { { this.changeActiveRadioButton('Complaint') } }} activeOpacity={0.8} style={styles.radioButton}>
                                    <View style={[styles.radioButtonHolder, { height: 20, width: 20, borderColor: '#000000' }]}>
                                        {
                                            this.state.selectedItem == 'Complaint' &&
                                            <View style={[styles.radioIcon, { height: 10, width: 10, backgroundColor: '#000000' }]}></View>
                                        }
                                    </View>
                                    <Text style={[styles.label, { color: '#000000' }]}>{LangValue[lang].COMPLAINT}</Text>
                                </TouchableOpacity>
                            </View>
                            <TextInput
                                placeholder={LangValue[lang].WRITE_HERE}
                                numberOfLines={5}
                                multiline={true}
                                onChangeText={(txt) => { this.setState({ comtxt: txt }) }}
                                underlineColorAndroid={COLORS.Primary}
                                value={this.state.comtxt}
                                style={{ borderWidth: 1, borderColor: '#666666', marginTop: 20, marginHorizontal: 13, fontSize: 17, paddingHorizontal: 10, height: 70, textAlign: (lang == 'ar' ? 'right' : 'left'), }}
                            />
                            <View style={{ marginVertical: 30, alignItems: 'center' }}>
                                <TouchableOpacity style={styles.button} onPress={() => { this.feedbackdata() }}>
                                    <Text style={styles.btnText}>{LangValue[lang].SUBMIT}</Text>
                                </TouchableOpacity>
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
        flex: 1
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
    radioButton:
    {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
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

    selectedText:
    {
        fontSize: 18,
        color: 'white'
    },
    button: {
        ...IOSShadow,
        backgroundColor: COLORS.Primary,
        width: 125,
        paddingVertical: 12,
        borderRadius: 20,
        borderRadius:25
    },
    btnText:{
        fontSize: 15,
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center', 
    }

});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Feedback);