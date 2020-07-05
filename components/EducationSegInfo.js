import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ScrollViewBase, ScrollView, TouchableOpacity, SafeAreaView, Image
} from 'react-native'
import EducationForm from '../screens/EducationScreen';
import PrevEduForm from './PrevEduForm';
import ResultForm from '../screens/ChildResultScreen';
import { globalStyles } from '../styles/global';
import { base_url, getDataAsync } from '../constants/Base';
import { LoadingDisplay } from '../utils/LoadingDisplay';

export default class EducationSegInfo extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        formIndex: -1,
        loading: false,
        child: this.props.navigation.getParam('child'),
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
        childData: []
    }

    componentDidMount() {
        this.setState({ search: null, loading: true });
        getDataAsync(base_url + '/child/' + this.state.child.childNo).then(data => { this.setState({ childData: data, formIndex: 0 }); console.log(data) })

        getDataAsync(base_url + '/child-education/' + this.state.child.childNo).then(data => {
            if (data !== null && JSON.stringify(data) !== JSON.stringify([])) {
                let edu = data[0];
                let required_date = new Date(edu.modified_on)
                for (let i = 1; i < data.length; i++) {
                    if (data[i].modified_on == null)
                        continue;
                    let vardate = new Date(data[i].modified_on)
                    if (vardate < required_date) {
                        edu = data[i]
                        required_date = new Date(edu.modified_on)
                    }
                }
                this.setState({ prevEducation: data[0] })
            }
            this.setState({ loading: false })
        })
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
                        style={globalStyles.segScrollView}
                    >
                        <View>
                            <TouchableOpacity style={{ borderBottomWidth: this.state.formIndex == 0 ? 3 : 0, borderBottomColor: this.state.formIndex == 0 ? 'grey' : '#f0f0f0' }} onPress={() => this.setState({ formIndex: 0 })}>
                                <Text style={{ paddingLeft: 10, paddingRight: 20, paddingTop: 10 }}>Education</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ borderBottomWidth: this.state.formIndex == 1 ? 3 : 0, borderBottomColor: this.state.formIndex == 1 ? 'grey' : '#f0f0f0' }} onPress={() => this.setState({ formIndex: 1 })}>
                                <Text style={{ paddingLeft: 10, paddingRight: 20, paddingTop: 10 }}>Exam Result</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <TouchableOpacity style={{ borderBottomWidth: this.state.formIndex == 2 ? 3 : 0, borderBottomColor: this.state.formIndex == 2 ? 'grey' : '#f0f0f0' }} onPress={() => this.setState({ formIndex: 2 })}>
                                <Text style={{ paddingLeft: 10, paddingRight: 20, paddingTop: 10 }}>Previous Education</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                <View style={globalStyles.scrollContainer}>
                    {formIndex === 0 && <EducationForm navigation={this.props.navigation} childData={this.state.childData} />}
                    {formIndex === 1 && <ResultForm navigation={this.props.navigation} childData={this.state.childData} />}
                    {formIndex === 2 && <PrevEduForm navigation={this.props.navigation} prevEducation={this.state.prevEducation} />}

                </View>
            </View >
        )
    }
}