import React, { Component } from 'react';
import {
    View, Text,
    ScrollView, KeyboardAvoidingView,
    TouchableOpacity,
    StyleSheet, CheckBox
} from 'react-native';
import { COLORS,API_URL } from '../Constants';
import Axios from 'axios';
import { loadingChange } from '../Actions';
import { connect } from 'react-redux';
import TabBar from './TabBar';
class PlanService extends Component {
    curProps = this.props;
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount(){
        this.curProps.LoadingStatusChange(true);
        this.curProps.navigation.addListener('didFocus',this.fetchSubscription);
    }
    fetchSubscription = async ()=>{
        await Axios.get(`${API_URL}subscription.php?action=subscription`)
        .then(res=>{
            this.curProps.LoadingStatusChange(false);
            console.log(res);
        })
        .catch(err=>{
            this.curProps.LoadingStatusChange(false);
            console.log('Service Plan Error',err);
        })
    }
    render() {

        return (
            <View style={{flex:1}}>
                <ScrollView contentContainerStyle={{padding:10}}>
                    <View style={styles.container}>
                        <Text style={{ textAlign: 'center', color: COLORS.Primary, fontSize: 20 }}>Service Description</Text>
                        <View style={{ marginVertical: 20, marginHorizontal: 5 }}>
                            <Text style={{ fontSize: 17, textAlign: "justify" }}>
                                The sources of this media are the keyboard, floppies, disks and tapes. Text files are usually stored and input character by character. Files may contain raw text or formatted text e.g HTML,
                                Rich Text Format (RTF) or a program language source (C, Pascal, etc..

                        Even though to data medium does not include any temporal constraints there may be an natural implied sequence e.g. HTML format sequence, Sequence of C program statements.

                        The basic storage of text is 1 byte per character (text or format character). For other forms of data e.g. Spreadsheet files some formats may store format as text (with formatting) others may use binary encoding.

                        Even the the storage requirements of this data is never high when data is stored on disk small files may take larger disk storage requirements due to block and sector sizes of disk partitions.


                                </Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <CheckBox value={true} />
                            <Text style={{ fontSize: 18 }}>1 Month  SR 100</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <CheckBox value={false} />
                            <Text style={{ fontSize: 18 }}>1 Month  SR 600</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 30 }}>
                            <CheckBox value={false} />
                            <Text style={{ fontSize: 18 }}>Gearbage Can (SR:75)</Text>
                        </View>
                        <View style={{ marginVertical: 20, alignItems: 'center' }}>
                            <TouchableOpacity>
                                <Text style={styles.button}>SUBSCRIBE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ScrollView>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    subcontainer: {
        backgroundColor: COLORS.Primary,
        width: '100%',
        height: 200,
        borderRadius: 15,
        marginBottom: 35
    },
    container: {
        marginVertical: 5,
        marginHorizontal: 5
    },
    button: {
        textAlign: 'center', backgroundColor: COLORS.Primary,
        width: 150,
        paddingVertical: 12,
        borderRadius: 20,
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: 'bold'
    }

});
const mapStateToProps = (state) => {
    const { reducer } = state
    return { reducer }
};
const mapDispatchToProps = dispatch => ({
    LoadingStatusChange: (loading) => dispatch(loadingChange(loading)),
});
export default connect(mapStateToProps, mapDispatchToProps)(PlanService);