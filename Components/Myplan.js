import React, { Component } from 'react';
import {
    View, Text,
    ScrollView, KeyboardAvoidingView, TouchableOpacity,
    StyleSheet
} from 'react-native';
import { COLORS, API_URL } from '../Constants';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import TabBar from './TabBar';
import { loadingChange } from '../Actions';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
class Myplan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            SubscriptionCount: 0,
            SubscriptionPlan: 0,
            RemainingDays: 0
        }
    }
    componentDidMount() {
        let { userData } = this.props.reducer;
        this.props.LoadingStatusChange(true);
        axios.get(`${API_URL}myplan.php?action=myplan&UserId=${userData.UserId}`)
            .then(res => {
                let { success, message, result } = res.data;
                if (success == 1) {
                    this.setState({
                        SubscriptionCount: result[0].SubscriptionCount,
                        SubscriptionPlan: result[0].SubscriptionPlan,
                        RemainingDays: result[0].RemainingDays
                    });
                }
                else {
                    Toast.show(message, Toast.SHORT);
                }
                this.props.LoadingStatusChange(false);
            })
            .catch(err => {
                console.log('My Plan Error ', err);
            })
    }
    render() {
        return (
            <View style={styles.main}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.subcontainer} onPress={() => { this.props.navigation.navigate('Planhistory') }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingVertical: 13 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 15 }}>Plan:{this.state.SubscriptionPlan}</Text>
                                <Text style={{ color: '#FFFFFF', fontSize: 15 }}>{this.state.RemainingDays} Days left</Text>
                            </View>
                            <Text style={{ textAlign: "center", marginVertical: 45, fontSize: 24, color: '#FFFFFF' }}>Subscription No: {this.state.SubscriptionCount}</Text>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: '#FFFFFF', paddingRight: 20 }}>more Detail {<Icon name='right' size={15} color='#FFFFFF' />}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { alert('vikas') }} style={[styles.subcontainer, { backgroundColor: '#4fd43d', alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={{ fontSize: 24, color: '#FFFFFF' }}>Gas &amp; Water Services</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: 5, alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.button,{backgroundColor: (this.state.RemainingDays > 5)?'#999999':COLORS.Primary,}]}
                            onPress={()=>{
                                if((this.state.RemainingDays <= 5)){

                                }
                            }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' }}>Renew</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <TabBar />
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
        marginBottom: 20
    },
    container: {
        paddingVertical: 5,
        paddingHorizontal: 5
    },
    button: {
        elevation:4,
        width: 135,
        paddingVertical: 13,
        borderRadius: 50,

    }

});
const mapStatetoProps = (state) => {
    const { reducer } = state;
    return { reducer };
}
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStatetoProps, mapDispatchToProps)(Myplan);