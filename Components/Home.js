import React, { Component } from 'react';
import { SafeAreaView, View, Text, TouchableNativeFeedback, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../Constants';
import { connect } from 'react-redux';
import { checkAuthentication } from '../Actions';
import Carousel from 'react-native-banner-carousel';
const BannerWidth = Dimensions.get('window').width;
const images = [
    "http://kdoom.fundexpoinvestmentsolution.com/images/sliderimg/thumb/06111915730288971.jpg",
    "http://kdoom.fundexpoinvestmentsolution.com/images/sliderimg/thumb/17111915740014671.JPG",
    "http://kdoom.fundexpoinvestmentsolution.com/images/sliderimg/thumb/19111915741521231.jpg"
];
class Home extends Component {
    render() {
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
                        <Text style={{ color: COLORS.Primary, fontSize: 15, textAlign: 'center' }}>Services</Text>
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                                    <View style={[styles.servicesBtn, { width: '50%', borderBottomStartRadius: 10, borderRightWidth: 1}]}>
                                        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                            <Image source={require('../assets/gas-icon.png')} style={{ width: 47, height: 97 }} />
                                        </View>
                                        <View style={styles.textWrapper}>
                                            <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Gas Services</Text>
                                        </View>
                                    </View>
                                </TouchableNativeFeedback>
                                <TouchableNativeFeedback  useForeground={TouchableNativeFeedback.canUseNativeForeground()}>
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
    textWrapper:{
        alignItems: 'center', 
        justifyContent: 'center',
        marginTop:10
    }
})
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
export default connect(mapStateToProps)(Home);