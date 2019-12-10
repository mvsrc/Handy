import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity,
    Image, ScrollView, StyleSheet, Modal
} from 'react-native';
import { COLORS, API_URL } from '../Constants';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import TabBar from './TabBar';
import RNPickerSelect from 'react-native-picker-select';
import { loadingChange, showWelcomeMessageAction } from '../Actions';
import Axios from 'axios';
class ProHome extends Component {
    curProps = this.props;
    constructor(props) {
        super(props);
        this.state = {
            districtList: [],
            UserDistrictName: '0',
            gasCount: 0,
            waterCount: 0,
            wastageCount: 0
        }
    }
    componentDidMount() {
        this.curProps.navigation.addListener('willFocus', () => {
            this.curProps.LoadingStatusChange(true);
            let { userData } = this.curProps.reducer;
            let UserDistrictIdsString = userData.UserDistrictId.split(',');
            let UserDistrictIds = UserDistrictIdsString.filter(function (el) {
                return el != "" && el != null && el != undefined;
            });
            let UserDistrictNamesString = userData.UserDistrictName.split(',');
            let UserDistrictNames = UserDistrictNamesString.filter(function (el) {
                return el != "" && el != null && el != undefined;
            });
            let districtList = [];
            for (let i in UserDistrictIds) {
                districtList.push({ label: UserDistrictNames[i], value: UserDistrictIds[i] });
            }
            this.setState({ districtList, UserDistrictName: districtList[0].value }, () => {
                this.runProHomeApi();
            })

        });
    }
    runProHomeApi = () => {
        Axios.get(`${API_URL}/prohome.php?action=home&UserDistrict=${this.state.UserDistrictName}&lang=ar`)
            .then(res => {
                this.setState({ gasCount: res.data.gas[0], waterCount: res.data.water[0], wastageCount: res.data.wastage[0] }, () => {
                    this.curProps.LoadingStatusChange(false);
                });
            })
            .catch(err => {
                console.log('err', err);
                this.curProps.LoadingStatusChange(false);
            })
    }
    render() {
        let { userData, authorized, showWelcomeMessage } = this.props.reducer;
        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    <View style={[styles.textinput, { borderBottomWidth: 0 }]}>
                        <RNPickerSelect
                            items={this.state.districtList}
                            value={this.state.UserDistrictName}
                            style={{
                                inputIOS: {
                                    fontSize: 17,
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    borderWidth: 1,
                                    borderColor: '#F1F1F1',
                                    color: '#000000',
                                    paddingRight: 30, // to ensure the text is never behind the icon
                                },
                            }}
                            onValueChange={value => {
                                this.setState({ UserDistrictName: value });
                            }}
                            onDonePress={() => {
                                this.curProps.LoadingStatusChange(true);
                                this.runProHomeApi()
                            }}
                            onClose={() => {
                                this.curProps.LoadingStatusChange(true);
                                this.runProHomeApi()
                            }}
                            disabled={false}
                        />
                    </View>
                    <View style={{ paddingHorizontal: 15, marginVertical: 15 }}>
                        <Text style={{ color: COLORS.Primary, fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>Services</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                            <TouchableOpacity onPress={() => {
                                this.curProps.navigation.navigate('HomeWastage',{districtId:this.state.UserDistrictName});
                            }} style={[styles.servicesBtn, { width: '100%', maxWidth: 500, borderTopStartRadius: 10, borderBottomWidth: 1, borderTopEndRadius: 10, flexDirection: 'row' }]}>
                                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={require('../assets/wastage-icon.png')} style={{ width: 78, height: 97 }} />
                                </View>
                                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={styles.countWrapper}>
                                        <Text style={styles.countText}>{this.state.wastageCount}</Text>
                                    </View>
                                    <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Home wastage</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', maxWidth: 500 }}>
                                <TouchableOpacity style={[styles.servicesBtn, { width: '50%', borderBottomStartRadius: 10, borderRightWidth: 1 }]} onPress={() => {
                                    this.curProps.navigation.navigate('ProGasWaterList',{districtId:this.state.UserDistrictName});
                                }}>
                                    <View style={styles.countWrapper}>
                                        <Text style={styles.countText}>{this.state.gasCount}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../assets/gas-icon.png')} style={{ width: 47, height: 97 }} />
                                    </View>
                                    <View style={styles.textWrapper}>

                                        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Gas Services</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.servicesBtn, { width: '50%', borderBottomEndRadius: 10 }]} onPress={() => {
                                    this.curProps.navigation.navigate('ProGasWaterList',{districtId:this.state.UserDistrictName});
                                }}>
                                    <View style={styles.countWrapper}>
                                        <Text style={styles.countText}>{this.state.waterCount}</Text>
                                    </View>
                                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../assets/water-icon.png')} style={{ width: 60, height: 97 }} />
                                    </View>
                                    <View style={styles.textWrapper}>

                                        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Water Services</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                </ScrollView>
                {
                    authorized == true &&
                    <Modal
                        animationType="none"
                        visible={showWelcomeMessage}
                        transparent={true}
                    >
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ backgroundColor: '#FFFFFF', padding: 15, paddingTop: 40, width: '80%', borderRadius: 10 }}>
                                <TouchableOpacity onPress={() => { this.props.ShowWelcomeMessageAction(false); }} style={{ position: 'absolute', right: 5, top: 5 }}>
                                    <Icon name="times-circle" size={25} color={COLORS.Primary} />
                                </TouchableOpacity>
                                <Text style={{ color: COLORS.Primary, fontSize: 16, marginBottom: 5 }}>Notification</Text>
                                <Text style={{ color: '#232323', fontSize: 15, fontWeight: 'bold', marginBottom: 5 }}>Welcome {userData.UserFName} {userData.UserLName}</Text>
                                <Text style={{ color: '#CCCCCC', fontSize: 14 }}>{userData.WelcomeMsg}</Text>
                            </View>
                        </View>
                    </Modal>
                }
                <TabBar navigation={this.props.navigation} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    servicesBtn: {
        backgroundColor: COLORS.Primary,
        borderColor: '#FFFFFF',
        paddingVertical: 15
    },
    textWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
    },
    textinput: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: 'auto',
        marginBottom: 8
    },
    countWrapper: {
        position: 'absolute',
        top: '5%',
        right: '7%',
        width: 35,
        height: 35,
        backgroundColor: '#8dd14b',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    countText: { color: '#FFFFFF', textAlign: 'center' }
})
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
    ShowWelcomeMessageAction: (showWelcomeMessage) => dispatch(showWelcomeMessageAction(showWelcomeMessage))
});
export default connect(mapStateToProps, mapDispatchToProps)(ProHome);