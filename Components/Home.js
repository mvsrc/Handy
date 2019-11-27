import React, { Component } from 'react';
import {
    SafeAreaView, View, Text, TouchableNativeFeedback, TouchableOpacity,
    Image, ScrollView, Dimensions, StyleSheet, Modal
} from 'react-native';
import { COLORS } from '../Constants';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Carousel from 'react-native-banner-carousel';
import TabBar from './TabBar';
import { loadingChange } from '../Actions';
import Axios from 'axios';
const BannerWidth = Dimensions.get('window').width;
const images = [
    "http://kdoom.fundexpoinvestmentsolution.com/images/sliderimg/normal/26111915747737431.jpg",
    "http://kdoom.fundexpoinvestmentsolution.com/images/sliderimg/normal/26111915747738231.jpg"
];
class Home extends Component {
    constructor(props) {
        super(props);
        let { navigation } = this.props;
        let showWelcomeMsg = navigation.getParam('showWelcomeMsg') ? navigation.getParam('showWelcomeMsg') : false;
        this.state = {
            showWelcomeMsg
        }
    }
    async componentDidMount(){
        
    }
    render() {
        let { userData } = this.props.reducer;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView>
                    <Carousel
                        autoplay
                        autoplayTimeout={5000}
                        loop
                        index={0}
                        pageSize={BannerWidth}
                        showsPageIndicator={false}
                    >
                        {images.map((image, index) => (
                            <View key={index}>
                                <Image style={{ width: BannerWidth, height: 200 }} source={{ uri: image }} />
                            </View>
                        ))}
                    </Carousel>
                    <View style={{ paddingHorizontal: 15, marginVertical: 15 }}>
                        <Text style={{ color: COLORS.Primary, fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>Services</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 15 }}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()}>
                                <View style={[styles.servicesBtn, { width: '100%', borderTopStartRadius: 10, borderBottomWidth: 1, borderTopEndRadius: 10, flexDirection: 'row' }]}>
                                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image source={require('../assets/wastage-icon.png')} style={{ width: 78, height: 97 }} />
                                    </View>
                                    <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Home wastage</Text>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableNativeFeedback background={TouchableNativeFeedback.SelectableBackground()}>
                                    <View style={[styles.servicesBtn, { width: '50%', borderBottomStartRadius: 10, borderRightWidth: 1 }]}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../assets/gas-icon.png')} style={{ width: 47, height: 97 }} />
                                        </View>
                                        <View style={styles.textWrapper}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Gas Services</Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback useForeground={TouchableNativeFeedback.canUseNativeForeground()}>
                                    <View style={[styles.servicesBtn, { width: '50%', borderBottomEndRadius: 10 }]}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../assets/water-icon.png')} style={{ width: 60, height: 97 }} />
                                        </View>
                                        <View style={styles.textWrapper}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Water Services</Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                        </View>
                    </View>

                </ScrollView>
                {
                    userData != null && 
                    <Modal
                        visible={this.state.showWelcomeMsg}
                        transparent={true}
                    >
                        <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ backgroundColor: '#FFFFFF', padding: 15, width: '70%',borderRadius:10 }}>
                                <TouchableOpacity onPress={() => { this.setState({ showWelcomeMsg: false }) }} style={{ position: 'absolute', right: 5, top: 5 }}>
                                    <Icon name="times-circle" size={25} color={COLORS.Primary} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16 }}>{userData.WelcomeMsg}</Text>
                            </View>
                        </View>
                    </Modal>
                }
                <TabBar navigation={this.props.navigation} />
            </SafeAreaView>
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
    }
})
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps,mapDispatchToProps)(Home);