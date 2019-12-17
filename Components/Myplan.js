import React, { Component } from 'react';
import {
    View, Text,
    ScrollView, TouchableOpacity,
    StyleSheet
} from 'react-native';
import { COLORS, API_URL } from '../Constants';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';
import TabBar from './TabBar';
import { loadingChange } from '../Actions';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { LangValue } from '../lang';

class Myplan extends Component {
    currentProps = this.props;
    constructor(props) {
        super(props)
        this.state = {
            SubscriptionCount: 0,
            SubscriptionPlan: 0,
            RemainingDays: 0,
            resultData:{}
        }
    }
    componentDidMount() {
        this.listner = this.props.navigation.addListener('willFocus', () => {
            this.fetchPlan();
        });
    }
    fetchPlan = async () => {
        let { userData,lang } = this.currentProps.reducer;
        this.currentProps.LoadingStatusChange(true);
        await axios.get(`${API_URL}myplan.php?action=myplan&UserId=${userData.UserId}&lang=${lang}`)
            .then(res => {
                let { success, message, result } = res.data;
                if (success == 1) {
                    this.setState({
                        SubscriptionCount: result[0].SubscriptionId,
                        SubscriptionPlan: result[0].SubscriptionPlan,
                        RemainingDays: result[0].RemainingDays,
                        resultData:result[0]
                    });
                }
                else {
                    Toast.show(message, Toast.SHORT);
                }
                this.currentProps.LoadingStatusChange(false);
            })
            .catch(err => {
                console.log('My Plan Error ', err);
                this.currentProps.LoadingStatusChange(false);
            })
    }
    render() {
        let {lang} = this.props.reducer;
        return (
            <View style={styles.main}>
                <ScrollView contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 20 }}>
                    <View style={styles.container}>
                        <TouchableOpacity style={styles.subcontainer} onPress={() => { this.props.navigation.navigate('PlanHitory',{SubsData:this.state.resultData}) }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 15, paddingVertical: 13 }}>
                                <Text style={{ color: '#FFFFFF', fontSize: 15 }}>{LangValue[lang].PLAN} : {this.state.SubscriptionPlan}</Text>
                                <Text style={{ color: '#FFFFFF', fontSize: 15 }}>{this.state.RemainingDays} {LangValue[lang].DAYS_LEFT}</Text>
                            </View>
                            <Text style={{ textAlign: "center", marginVertical: 45, fontSize: 24, color: '#FFFFFF' }}>{LangValue[lang].SUBSCRIPTION_NO} : {this.state.SubscriptionCount}</Text>
                            <Text style={{ textAlign: 'right', fontSize: 15, color: '#FFFFFF', paddingRight: 20 }}>
                                {LangValue[lang].MORE_DETAIL}
                                <Icon name={lang=='en'?'right':'left'} size={15} color='#FFFFFF' />
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('Plangaswaterservice')}} style={[styles.subcontainer, { backgroundColor: '#4fd43d', alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={{ fontSize: 24, color: '#FFFFFF' }}>{LangValue[lang].GAS_WATER_SERVICES}</Text>
                        </TouchableOpacity>
                        <View style={{ marginTop: 5, alignItems: 'center' }}>
                            <TouchableOpacity style={[styles.button, { backgroundColor: (this.state.RemainingDays > 5) ? '#999999' : COLORS.Primary, }]}
                                onPress={() => {
                                    if ((this.state.RemainingDays <= 5)) {
                                        this.props.navigation.navigate('PlanService');
                                    }
                                }}>
                                <Text style={{ textAlign: 'center', fontSize: 16, color: '#FFFFFF', fontWeight: 'bold' }}>{LangValue[lang].RENEW}</Text>
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
        elevation: 4,
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