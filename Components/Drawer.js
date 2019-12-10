import React from 'react'
import { SafeAreaView, StyleSheet, ScrollView, View, Image, Text, TouchableOpacity } from 'react-native';
import { DrawerActions } from 'react-navigation-drawer';
import { COLORS, withLoggedIn } from '../Constants';
import { connect } from 'react-redux';
const CustomDrawerContentComponent = props => {
    const { navigation, items, activeItemKey, reducer } = props;
    return (
        <SafeAreaView
            style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }}
        >
            <View style={{ backgroundColor: COLORS.Primary, width: '100%', height: 170, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../assets/handy-logo.png')} style={{ width: 80, height: 80 }} />
                <Text style={{ fontSize: 20, marginTop: 10, color: '#FFFFFF', fontWeight: 'bold' }}>HANDY</Text>
                {
                    reducer.userData != 'null' && reducer.userData != null && 
                    <Text style={{ fontSize: 20, marginTop: 10, color: '#FFFFFF', fontWeight: 'bold' }}>{reducer.userData.UserFName} {reducer.userData.UserLName}</Text>
                }
            </View>
            <ScrollView >
                {
                    items.map((item, index) => {
                        let navigateTo = item.routeName;
                        if(reducer.authorized == false){
                            if (withLoggedIn.includes(item.key)) {
                                navigateTo = 'Login';
                            }
                        }
                        let key = item.key;
                        if(key == 'UpdateProfile'){
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
                                navigation.dispatch(DrawerActions.closeDrawer());
                                navigation.navigate(navigateTo);
                            }}>
                                <Text style={{ fontSize: 14, color: (activeItemKey == item.key) ? '#FFFFFF' : '#333333' }}>{key}</Text>
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
                        <Text style={{ fontSize: 14, color: '#333333' }}>Login</Text>
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
                        <Text style={{ fontSize: 14, color: '#333333' }}>Logout</Text>
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
export default connect(mapStateToProps)(CustomDrawerContentComponent);