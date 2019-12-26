import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { COLORS, API_URL } from '../Constants';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome';
import { connect } from 'react-redux';
import { loadingChange } from '../Actions';
import Axios from 'axios';
import TabBar from './TabBar';
import { LangValue } from '../lang';
class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messagedata: [],
            isRefreshing: false,
            curTab: 0,
            feedbackList: [],
            suggesstionList: [],
            complaintList: [],
            showReply: false,
            currentReply: {}
        }
    }
    curProps = this.props
    componentDidMount() {
        this.curProps.navigation.addListener('didFocus', () => {
            this.curProps.LoadingStatusChange(true);
            this.fetchMessages();
        });
    }
    fetchMessages = async () => {
        let { userData } = this.curProps.reducer;
        await Axios.get(`${API_URL}feedback.php?action=feedback&UserId=${userData.UserId}`)
            .then((res1) => {
                let { success, message, results } = res1.data;
                if (success == 1) {

                    let feedbackList = [], suggesstionList = [], complaintList = [];
                    results.map((item, index) => {
                        if (item.FeedcomType.toLowerCase() == 'feedback') {
                            feedbackList.push(item);
                        }
                        if (item.FeedcomType.toLowerCase() == "suggestion") {
                            suggesstionList.push(item);
                        }
                        if (item.FeedcomType.toLowerCase() == "complaint") {
                            complaintList.push(item);
                        }
                    });
                    this.setState({ feedbackList, suggesstionList, complaintList });
                }
                else {
                    Toast.show(message, Toast.LONG)
                }
                this.setState({ isRefreshing: false }, () => {
                    this.curProps.LoadingStatusChange(false);
                });
            })
            .catch((error) => {
                console.log('Message Error: ', error);
                this.setState({ isRefreshing: false });
                this.curProps.LoadingStatusChange(false);
            });
    }
    render() {
        let { navigation,reducer:{lang} } = this.props;
        let curTabs = this.state.curTab;
        let ShowList = this.state.feedbackList;
        if (curTabs == 1) {
            ShowList = this.state.suggesstionList;
        }
        else if (curTabs == 2) {
            ShowList = this.state.complaintList;
        }
        return (
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#888888' }}>
                    <TouchableOpacity style={styles.tabsBtn} onPress={() => { this.setState({ curTab: 0 }) }}>
                        <Text style={[styles.tabsBtnText, (this.state.curTab == 0) ? { fontWeight: 'bold' } : {}]}>{LangValue[lang].FEEDBACK}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.tabsBtn, { borderRightWidth: 1, borderLeftWidth: 1, borderColor: '#888888' }]} onPress={() => { this.setState({ curTab: 1 }) }}>
                        <Text style={[styles.tabsBtnText, (this.state.curTab == 1) ? { fontWeight: 'bold' } : {}]}>{LangValue[lang].SUGGESTION}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.tabsBtn} onPress={() => { this.setState({ curTab: 2 }) }}>
                        <Text style={[styles.tabsBtnText, (this.state.curTab == 2) ? { fontWeight: 'bold' } : {}]}>{LangValue[lang].COMPLAINT}</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.curTab == 0
                }
                <FlatList
                    contentContainerStyle={{ paddingVertical: 10 }}
                    data={ShowList}
                    ItemSeparatorComponent={() => (
                        <View style={{ borderBottomColor: '#CCCCCC', borderBottomWidth: 1, marginBottom: 10 }}></View>
                    )}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity style={{ paddingBottom: 10, paddingHorizontal: 15 }} onPress={() => {
                                this.setState({ currentReply: item, showReply: true });
                            }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 2, marginVertical: 10 }}>
                                    <Text style={{ fontSize: 14, color: COLORS.Primary, fontWeight: 'bold' }}>{item.FeedcomType}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{item.FeedcomDate}</Text>
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', paddingVertical: 5, color: '#333333' }}>{item.FeedcomTitle}</Text>
                                {/* <Text style={{ fontSize: 13, color: '#777777' }}>{item.FeedcomBody}</Text> */}

                            </TouchableOpacity>
                        )
                    }}
                    keyExtractor={(item, index) => 'message-' + index}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => { this.setState({ isRefreshing: true }), this.fetchMessages() }}
                            title="Pull to refresh"
                            tintColor={COLORS.Primary}
                            titleColor={COLORS.Primary}
                        />
                    }
                />
                <TabBar navigation={navigation} />
                <Modal
                    visible={this.state.showReply}
                    animationType="slide"
                    transparent={true}
                    presentationStyle="formSheet"

                >
                    <View style={{ paddingHorizontal: 10, paddingVertical: 15, backgroundColor: '#FFFFFF',borderBottomLeftRadius: 15,borderBottomRightRadius:15, }}>

                        <TouchableOpacity style={{ position: 'absolute', right: 15, top: 15 }}
                            onPress={() => {
                                this.setState({ showReply: false });
                            }}>
                            <Icon name="times" size={25} color={COLORS.Primary} />
                        </TouchableOpacity>
                        <View style={{ marginTop: 40 }}>
                            <View style={{ marginTop: 10, paddingHorizontal: 15 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 2, marginVertical: 10 }}>
                                    <Text style={{ fontSize: 14, color: COLORS.Primary, fontWeight: 'bold' }}>{this.state.currentReply.FeedcomType}</Text>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{this.state.currentReply.FeedcomDate}</Text>
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: 'bold', paddingVertical: 5, color: '#333333' }}>{this.state.currentReply.FeedcomTitle}</Text>
                                <Text style={{ fontSize: 14, color: COLORS.Primary, fontWeight: 'bold',marginVertical:15 }}>{LangValue[lang].ADMIN_REPLY}</Text>
                                <Text style={{ fontSize: 14}}>{this.state.currentReply.FeedcomBody}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    tabsBtn: {
        width: '33.33333%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 15
    },
    tabsBtnText: {
        color: COLORS.Primary,
        fontSize: 13
    }
});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Message);