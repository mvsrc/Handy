import React from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Image, Text, TouchableOpacity } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import { COLORS, withLoggedIn, checkingUserStatus } from '../Constants';
import { connect } from 'react-redux';
import { LangValue } from '../lang';
import { loadingChange, checkUserStatusAction } from '../Actions';
import SimpleToast from 'react-native-simple-toast';
const CustomDrawerContentComponent = props => {
    const { navigation, items, activeItemKey, reducer, descriptors } = props;
    return (
        <SafeAreaView
            style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }}
        >
            <View style={{ backgroundColor: COLORS.Primary, width: '100%', height: 170, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/handy-logo.png')} style={{ width: 80, height: 80 }} />
                <Text style={{ fontSize: 20, marginTop: 10, color: '#FFFFFF', fontWeight: 'bold' }}>{LangValue[reducer.lang].HANDY}</Text>
                {
                    reducer.userData != 'null' && reducer.userData != null &&
                    <Text style={{ fontSize: 20, marginTop: 10, color: '#FFFFFF', fontWeight: 'bold' }}>{reducer.userData.UserFName} {reducer.userData.UserLName}</Text>
                }
            </View>
            <ScrollView >
                {
                    items.map((item, index) => {
                        let dL = descriptors[item.key].options.drawerLabel;
                        let navigateTo = item.routeName;
                        if (reducer.authorized == false) {
                            if (withLoggedIn.includes(item.key)) {
                                navigateTo = 'Login';
                            }
                        }
                        let key = item.key;
                        if (key == 'UpdateProfile') {
                            key = 'Update Profile';
                        }
                        return (
                            <TouchableOpacity key={'drawer-key' + index} style={{
                                borderBottomColor: '#CCCCCC',
                                borderBottomWidth: 1,
                                paddingHorizontal: 10,
                                paddingVertical: 7,
                                backgroundColor: (activeItemKey == item.key) ? COLORS.Secondary : '#FFFFFF'
                            }} onPress={() => {
                                if (navigateTo == 'My Plan') {
                                    props.LoadingStatusChange(true);
                                    checkingUserStatus(reducer.userData, reducer.userToken, reducer.lang, props.CheckUserStatusAction).then(res => {
                                        if (res == true) {
                                            navigation.dispatch(DrawerActions.closeDrawer());
                                            navigation.navigate(navigateTo);
                                        }
                                        else {
                                            setTimeout(() => { SimpleToast.show(LangValue[reducer.lang].VERIFY_ACCOUNT, SimpleToast.SHORT); }, 100);
                                            navigation.dispatch(DrawerActions.closeDrawer());
                                        }
                                    });
                                }
                                else {
                                    navigation.dispatch(DrawerActions.closeDrawer());
                                    navigation.navigate(navigateTo);
                                }
                            }}>
                                <Text style={{ fontSize: 14, color: (activeItemKey == item.key) ? '#FFFFFF' : '#333333', textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }}>{LangValue[reducer.lang][dL]}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
                {
                    reducer.authorized == false &&
                    <TouchableOpacity style={{
                        borderBottomColor: '#CCCCCC',
                        borderBottomWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        backgroundColor: '#FFFFFF'
                    }} onPress={() => {
                        navigation.dispatch(DrawerActions.closeDrawer());
                        navigation.navigate('Login');
                    }}>
                        <Text style={{ fontSize: 14, color: '#333333', textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }}>{LangValue[reducer.lang].LOGIN}</Text>
                    </TouchableOpacity>
                }
                {
                    reducer.authorized == true &&
                    <TouchableOpacity style={{
                        borderBottomColor: '#CCCCCC',
                        borderBottomWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        backgroundColor: '#FFFFFF'
                    }} onPress={() => {
                        navigation.dispatch(DrawerActions.closeDrawer());
                        navigation.navigate('Logout');
                    }}>
                        <Text style={{ fontSize: 14, color: '#333333', textAlign: (reducer.lang == 'ar' ? 'right' : 'left') }}>{LangValue[reducer.lang].LOGOUT}</Text>
                    </TouchableOpacity>
                }
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
    CheckUserStatusAction: (userData) => dispatch(checkUserStatusAction(userData))
});
export default connect(mapStateToProps, mapDispatchToProps)(CustomDrawerContentComponent);