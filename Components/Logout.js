import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Text, View } from 'react-native';
import { COLORS } from '../Constants';
import { connect } from 'react-redux';
import { loadingChange,LogoutAction } from '../Actions';
class Logout extends Component {
    static navigationOptions = {
        header:null
    };
    async componentDidMount() {
        const { navigation } = this.props;
        this.props.LoadingStatusChange(true);
        await AsyncStorage.multiSet([['isUserLoggedIn', ""],['userData', ""],["lang",""]]).then(async () => {
                this.props.LoadingStatusChange(false);
                this.props.LogoutUser();
                navigation.navigate('Splash');
        });
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: COLORS.Primary, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, color: '#FFFFFF' }}>Logging Out.....</Text>
            </View>
        )
    }
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
    LogoutUser: () => dispatch(LogoutAction()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Logout);