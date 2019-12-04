import React, { Component } from 'react';
import {
    View, Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import { COLORS, API_URL, IOSShadow } from '../Constants';
import Axios from 'axios';
import { loadingChange } from '../Actions';
import { connect } from 'react-redux';
import TabBar from './TabBar';
import CheckBox from 'react-native-check-box';
class PlanService extends Component {
    curProps = this.props;
    constructor(props) {
        super(props)
        this.state = {
            subscriptionList: [],
            subsText: '',
            selectedSubscription: 0,
            hasGarbage: false,
            garbageCan: {}
        }
    }
    componentDidMount() {
        this.curProps.LoadingStatusChange(true);
        this.fetchSubscription();
        //this.curProps.navigation.addListener('didFocus', );
    }
    fetchSubscription = async () => {
        await Axios.get(`${API_URL}subscription.php?action=subscription`)
            .then(res => {
                console.log(res.data);
                this.setState({ subscriptionList: res.data.subscription, garbageCan: res.data.garbage[0] }, () => {
                    this.curProps.LoadingStatusChange(false);
                });
            })
            .catch(err => {
                this.curProps.LoadingStatusChange(false);
                console.log('Service Plan Error', err);
            })
    }
    render() {
        const {authroized} = this.props.reducer;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 10 }}>
                    <View style={styles.container}>
                        <Text style={{ textAlign: 'center', color: COLORS.Primary, fontSize: 20 }}>Service Description</Text>
                        <View style={{ marginVertical: 20, marginHorizontal: 5 }}>
                            <Text style={{ fontSize: 17, textAlign: "justify" }}>
                                {typeof (this.state.subscriptionList[this.state.selectedSubscription]) != "undefined" && this.state.subscriptionList[this.state.selectedSubscription].SubDesc}
                            </Text>
                        </View>
                        {
                            this.state.subscriptionList &&
                            this.state.subscriptionList.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={() => { this.setState({ selectedSubscription: index }) }} activeOpacity={0.8} style={styles.radioButton} key={'radio-key' + index}>
                                        <View style={[styles.radioButtonHolder]}>
                                            {
                                                index == this.state.selectedSubscription &&
                                                <View style={[styles.radioIcon]}></View>
                                            }
                                        </View>
                                        <Text style={[styles.label]}>{item.SubDuration}  SR {item.SubPrice}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }

                        <View style={styles.radioButton} >
                            <CheckBox
                                style={{ }}
                                onClick={() => {
                                    this.setState({
                                        hasGarbage: !this.state.hasGarbage
                                    })
                                }}
                                isChecked={this.state.hasGarbage}
                                checkBoxColor={COLORS.Primary}
                                checkedCheckBoxColor={COLORS.Primary}
                            />
                            <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.setState({
                                        hasGarbage: !this.state.hasGarbage
                                    })}}>
                                <Text style={styles.label}>{this.state.garbageCan.GarbageName} ( SR : {this.state.garbageCan.GarbagePrice} )</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginVertical: 20, alignItems: 'center' }}>
                            <TouchableOpacity style={styles.button} onPress={()=>{
                                if(authroized == true){
                                    this.props.navigation.navigate('');
                                }
                                else{
                                    this.props.navigation.navigate('Registration',{subscription:this.state.subscriptionList[this.state.selectedSubscription],hasGarbage:(this.state.hasGarbage == true)?this.state.garbageCan:false});
                                }
                            }}>
                                <Text style={styles.btnText}>SUBSCRIBE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
                <TabBar navigation={this.props.navigation} />
            </View>
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
        ...IOSShadow,
        backgroundColor: COLORS.Primary,
        width: 150,
        paddingVertical: 12,
        borderRadius: 20,

    },
    btnText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    radioButton:
    {
        flexDirection: 'row',
        margin: 10,
        marginLeft:0

    },
    radioButtonHolder:
    {
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        height: 20,
        width: 20,
        borderColor: COLORS.Primary
    },

    radioIcon:
    {
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        height: 10,
        width: 10,
        backgroundColor: COLORS.Primary
    },
    label:
    {
        marginLeft: 10,
        fontSize: 16
    },

});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PlanService);