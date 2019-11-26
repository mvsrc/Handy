import React from 'react'
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { COLORS, withLoggedIn } from '../Constants';
import { connect } from 'react-redux';
const TabBar = props => {
    const { navigation, items, activeItemKey, renderIcon,
        getLabelText,
        activeTintColor,
        inactiveTintColor,
        onTabPress,
        onTabLongPress,
        getAccessibilityLabel,
        reducer } = props;
    const { routes, index: activeRouteIndex } = navigation.state;
    return (
        <SafeAreaView
            style={{
                backgroundColor:COLORS.Primary,
                paddingVertical:7,
                paddingHorizontal:10,
                flexDirection:'row',
                justifyContent:'space-between'
            }}
            forceInset={{ top: 'always', horizontal: 'never' }}
        >
            {
                routes.map((route, routeIndex) => {
                    let navigateTo = route.routeName;
                    const isRouteActive = routeIndex === activeRouteIndex;
                    const tintColor = isRouteActive ? activeTintColor : inactiveTintColor;
                    if (withLoggedIn.includes(route.key)) {
                        navigateTo = 'Login';
                    }
                    return (
                        <TouchableOpacity key={'drawer-key' + routeIndex} style={{
                            borderRightColor: '#999999',
                            borderRightWidth: (routeIndex <routes.length-1 )?1:0,
                            width:'25%',
                            paddingVertical:7,
                            alignItems:'center'
                        }} onPress={() => {
                            navigation.navigate(navigateTo);
                        }}>
                            {renderIcon({ route, focused: isRouteActive, tintColor })}
                        </TouchableOpacity>
                    );
                })
            }
        </SafeAreaView>
    )
}
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
export default connect(mapStateToProps)(TabBar);