import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollViewBase, ScrollView, TouchableOpacity, SafeAreaView, Image
} from 'react-native'
import GeneralInfoForm from './GeneralInfoForm';
import HealtDuringAdd from './HealthDuringAddForm'
import PrevEduForm from './PrevEduForm';
import EditChild from './EditChildForm';
import { globalStyles } from '../styles/global';
import { base_url, getDataAsync } from '../constants/Base';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import StatusScreen from '../screens/StatusScreen';
import FollowUpScreen from '../screens/FollowUpScreen';

export default class StatusSegControl extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            formIndex: 0,
            loading: false,
            child: this.props.navigation.getParam('child'),
            /* childHealth: {
                 "bloodGroup": '',
                 "generalHealth": '',
                 "height": '',
                 "weight": '',
                 "comments": '',
                 "newChild": true
             },
             prevEducation: {
                 "dropoutReason": '',
                 "date_to": '',
                 "yearOfStudied": '',
                 "medium": '',
                 "schoolName": '',
                 "schooltype": '',
                 "studyingclass": '',
                 "address": '',
                 "newChild": true
             },
             childData: []*/
        }
    }

    componentDidMount() {
      
    }
    async getData() {

    }

    render() {
        const { formIndex } = this.state
        return (
            <View style={globalStyles.container}>
                <View style={globalStyles.backgroundlogoimageview}>
                    <Image source={require("../assets/RBHlogoicon.png")} style={globalStyles.backgroundlogoimage} />
                </View>
                <LoadingDisplay loading={this.state.loading} />
                <View style={globalStyles.segView}>
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style={globalStyles.scrollView}
                    >
                        <View style={{
                            flex: 1, flexDirection: 'row', justifyContent: 'space-evenly'
                        }}>
                                <View>
                                    <TouchableOpacity style={{ borderBottomWidth: this.state.formIndex == 0 ? 3 : 0, borderBottomColor: this.state.formIndex == 0 ? 'grey' : '#f0f0f0' }} onPress={() => this.setState({ formIndex: 0 })}>
                                        <Text style={{ paddingLeft: 20, paddingRight: 40, fontSize: 17, paddingBottom: 5 }}>Modify Status</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <TouchableOpacity style={{ borderBottomWidth: this.state.formIndex == 1 ? 3 : 0, borderBottomColor: this.state.formIndex == 1 ? 'grey' : '#f0f0f0' }} onPress={() => this.setState({ formIndex: 1 })}>
                                        <Text style={{ paddingLeft: 40, paddingRight: 20, fontSize: 17, paddingBottom: 5 }}>Add Followups</Text>
                                    </TouchableOpacity>
                                </View>
                        </View>
                       
                    </ScrollView>
                </View>
                <View style={globalStyles.scrollContainer}>
                    {formIndex === 0 && <StatusScreen navigation={this.props.navigation} child={this.state.childData} />}
                    {formIndex === 1 && <FollowUpScreen navigation={this.props.navigation} child={this.state.childData} />}
                 </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    scrollView: {
        height: 0,
    },
    segView: {
        height: 50
    },

});