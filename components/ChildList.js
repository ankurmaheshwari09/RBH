import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ToolbarAndroid, Button, FlatList, Image, Dimensions, PixelRatio, BackHandler } from 'react-native'
import { Card, CardImage, CardContent } from 'react-native-cards'
import Modal from 'react-native-modal';
import { SearchBar, Overlay } from 'react-native-elements';
import moment from 'moment';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { getOrgId } from '../constants/LoginConstant';
import { Ionicons } from '@expo/vector-icons';
import { base_url, getDataAsync } from '../constants/Base';
import { StackActions } from '@react-navigation/native';
import { Router, Scene, Actions } from 'react-native-router-flux';
import { NavigationEvents } from 'react-navigation';
import { ActivityIndicator } from 'react-native';
import { globalStyles } from '../styles/global';

export default class ChildList extends Component {
    constructor(props) {
        super(props);
        console.log(PixelRatio.get(), 'ffffffffff');
        console.log(Dimensions.get('window').width / 5, 'lllllp');
        this.state = {
            dataSource: {},
            isVisible: false,
            count: 0,
            page: null,
            selectedChild: null,
            loading: false,
            data: [],
            checkProfileAlert: false,
            error: null,
            search: null,
            errorDisplay: false,
            refresh: true,
            currentTime: null,
            modalItems: [
                { key: 'Status', page: 'ChildStatus' },
                { key: 'Health', page: 'Health' },
                { key: 'Education', page: 'Education' },
                { key: 'Family', page: 'Family' },
                { key: 'Communication', page: 'Communication' },
                { key: 'General Info', page: 'GeneralInfo' },
                { key: 'Update Profile Description', page: 'Profile' },
                { key: 'Committee', page: 'Committee' },
                { key: 'Follow Up', page: 'FollowUpBy' },
            ],
            modalItemsForCurrentItem: null
        };
        this.arrayholder = [];
        this.onPress = this.onPress.bind(this);
        this.navigateToOtherScreen = this.navigateToOtherScreen.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onPressForList = this.onPressForList.bind(this);
        this.searchFilterFunction = this.searchFilterFunction.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.getStyles = this.getStyles.bind(this);
        this.getData = this.getData.bind(this);
        this.getModalItems = this.getModalItems.bind(this);
        this.checkStatusDateExpired = this.checkStatusDateExpired.bind(this);
        //this.getAddedData = this.getAddedData.bind(this);
        this.reset = this.reset.bind(this);
        //  this.setStyles = this.setStyles.bind(this);
        // this.show =this.show.bind(this);
    }
    /*async componentDidMount() {
      
        await this.getData();
        
    }*/


    componentWillUnmount() {
        this.setState({
            loading: false,
            search: null,
            errorDisplay: false
        });

    }

    async getData() {
        console.log('inside get');
        let orgId = getOrgId();
        this.setState({
            currentTime: new Date()
        });
        const path = 'https://rest-service.azurewebsites.net/api/v1/childrenWithProfileStatus/' + orgId;
        console.log(path, 'lllll');
        this.setState({ search: null, loading: true });
        try {
            let const1 = await fetch(path, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (const1.ok) {
                //console.log('inside ok')
                let response = await const1.json();
                //   console.log(response,'response-----');
                let sortedResponse = response.sort((a, b) => a.firstName.localeCompare(b.firstName));
                sortedResponse = this.setCounterForItemsInList(sortedResponse);
                // console.log(response, 'ddddddddddd');

                //await this.getAddedData(response);
                //console.log(this.state.data,'final');


                this.arrayholder = sortedResponse;
                this.setState({ data: sortedResponse, loading: false });

                alert('Please "Update Profile Description" for children with Profile Update Status: Yes');


            } else {

                // this.setState({ loading: false, errorDisplay: true });
                throw Error(const1.status);
            }
        }
        catch (error) {
            console.log(error, 'error in getting data');
            this.setState({ loading: false, errorDisplay: true });
        }
        this.setState({ refresh: false });
        //  console.log(this.state.currentTime.getSeconds());
        console.log("no of seconds taken");
        console.log(new Date().getSeconds() - this.state.currentTime.getSeconds());
        this.loadStats()
    }

    loadStats(){
        getDataAsync(base_url + '/dashboard/' + getOrgId())
            .then(data => {
                let stats = [] 
                for(let i = 0; i < data.length; i++){
                    stats.push([data[i].statusValue, data[i].total])
                }
                this.props.screenProps.state.params.updateStats(stats)
             })
    }

    setCounterForItemsInList(items) {
        let count = 0;
        items.map((item) => {
            item.counter = count;
            count = count + 1;
        });
        return items;
    }

    onPress(item) {
        let list = this.getModalItems(item);
        this.setState({
            isVisible: true,
            selectedChild: item,
            modalItemsForCurrentItem: list
        });

    }


    navigateToOtherScreen(screen) {
        // console.log(this.state.navItems);
        // this.setState({ refresh: true });
        this.props.navigation.navigate(screen, { child: this.state.selectedChild, refreshChildList: this.getData.bind(this) });
    }
    closeModal() {
        this.setState({
            isVisible: false,
        });
    }
    onPressForList(screen) {

        this.closeModal();
        // this.setState({page: page});
        this.navigateToOtherScreen(screen);
    }
    searchFilterFunction = text => {

        this.setState({ search: text });
        if ('' == text) {
            this.setState({
                data: this.arrayholder
            });
            return;
        } else {
            this.state.data = this.arrayholder.filter(function (item) {
                let dateOfBirth = moment(item.dateOfBirth).format('DD/MM/YYYY');
                let admissionDate = moment(item.admissionDate).format('DD/MM/YYYY');
                let exitStatus = (item.childStatus === 'Closed') ? 'Exit' : '';
                let fullName = item.firstName + ' ' + item.lastName;

                return (item.firstName.toLowerCase().includes(text.toLowerCase())
                    || item.lastName.toLowerCase().includes(text.toLowerCase())
                    || dateOfBirth.includes(text)
                    || admissionDate.includes(text)
                    || item.childStatus.toLowerCase().includes(text.toLowerCase())
                    || exitStatus.toLowerCase().includes(text.toLowerCase())
                    || fullName.toLowerCase().includes(text.toLowerCase()));
            });
            if (this.state.data.length === 0) {
                alert("Please refresh if new child is added");
            }
        }
    }
    renderHeader = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <SearchBar
                    placeholder="Search by Name,DOB,Status,Admdate"
                    lightTheme
                    round
                    onChangeText={text => this.searchFilterFunction(text)}
                    value={this.state.search}
                    inputContainerStyle={{ width: Number((Dimensions.get('window').width - 50).toFixed(0)) }}
                />
                <TouchableOpacity style={styles.container} onPress={(event) => { this.refresh() }}>
                    <Ionicons name="md-refresh" size={35} color="black" />
                </TouchableOpacity>
            </View>
        );
    };

    getStyles(status, childStatusDate, childNo) {

        let index = this.state.data.findIndex((item) => item.childNo == childNo);

        if (status == 'Observation') {
            if (this.checkStatusDateExpired(childStatusDate, status)) {
                this.state.data[index].style = styles.red;
                return styles.red;
            } else {
                this.state.data[index].style = styles.blue;
                return styles.blue;
            }
        } else if (status == 'Present') {
            return styles.green;
        } else if (status == 'Closed') {
            return styles.pink;
        } else if (status == 'Absent') {
            if (this.checkStatusDateExpired(childStatusDate, status)) {
                this.state.data[index].style = styles.red;
                return styles.red;
            } else {
                this.state.data[index].style = styles.yellow;
                return styles.yellow;
            }
        }



    }

    checkStatusDateExpired(childStatusDate, status) {

        const date = moment(childStatusDate).format('YYYY-MM-DD');

        let diff = this.getDiffBetweenDates(new Date(date), new Date());
        //   console.log(diff.toFixed(0));
        return diff >= 30 ? true : false;
    }
    getDiffBetweenDates(date1, date2) {

        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime();

        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

        //  console.log(Difference_In_Days);

        return Difference_In_Days;
    }
    getModalItems(item) {

        let updatedList = this.state.modalItems;
        if (item.childStatus !== 'Closed') {
            updatedList = this.state.modalItems.filter(item => item.key !== 'Follow Up');
        }
        return updatedList;
    }

    getImageUri(picture, gender) {
        if (picture === null || picture === "") {
            if (gender === 2) {
                return require('../assets/girl.jpg');
            } else {
                return require('../assets/boy.jpg');
            }
        } else {
            // return { uri: "http://app.rainbowhome.in/ChildImage/" + picture };
            return { uri: "http://test.rainbowhome.in/Images/" + picture}
        }
    }
    getImageStyle(style) {
        // console.log(style.backgroundColor,'......................');
        if (style === styles.red) {
            return styles.imageWithBorder;
        } else {
            return styles.image;
        }
    }

    getContainerStyles(item) {
        if (item.counter % 2 === 0) {
            return styles.childOnLeft;
        } else {
            return styles.childOnRight;
        }
    }

    async refresh() {
        await this.getData();
    }



    calculateCharLength(firstName, lastName) {
        let firstNameLen = firstName.length;
        let lastNameLen = lastName.length;
        const total = firstNameLen + lastNameLen;
        console.log(firstNameLen + lastNameLen, 'llllll');
        if (total > 15) {
            return false;
        } else {
            return true;
        }
    }

    async reset() {
        if (this.state.refresh) {
            await this.getData();
        }

    }
    render() {

        return (
            <View style={styles.MainContainer} pointerEvents={this.state.loading ? 'none' : 'auto'} >
                {this.state.loading ?

                    <View style={{ position: 'absolute', top: "45%", right: 0, left: 0, zIndex: 10 }}>
                        <View>
                            <ActivityIndicator animating={this.state.loading} size="large" color="black" />
                        </View>
                        <View>
                            <Text style={styles.loading}>Loading..... </Text>
                        </View>
                    </View>
                    : null}

                {this.state.errorDisplay ?
                    <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                    :
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <View style={{
                                flex: 1 / 2, flexDirection: 'column', justifyContent: 'space-evenly'
                            }}>
                                <TouchableOpacity style={this.getContainerStyles(item)} onPress={(event) => { this.onPress(item) }}>
                                    {/*react-native-elements Card*/}
                                    <Card style={this.getStyles(item.childStatus, item.childStatusDate, item.childNo)} >

                                        <View>
                                            <Image
                                                source={this.getImageUri(item.picture, item.gender)}
                                                style={this.getImageStyle(item.style)}
                                            />
                                        </View>

                                        <View style={styles.paragraph}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.heading}>Name:</Text >
                                                <Text style={styles.cardContent}>{`${item.firstName} ${item.lastName}`}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.heading}>Adm Date:</Text >
                                                <Text style={styles.cardContent}>{moment(item.admissionDate).format('DD/MM/YYYY')}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.heading}>DOB:</Text >
                                                <Text style={styles.cardContent}>{moment(item.dateOfBirth).format('DD/MM/YYYY')}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.heading}>Status:</Text >
                                                {item.childStatus == 'Closed' ? <Text style={styles.cardContent}>Exit</Text> :
                                                    <Text style={styles.cardContent}>{item.childStatus}</Text>}
                                                {item.style == styles.red ? < Ionicons name="md-warning" size={20} color="red" /> : null}
                                            </View>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.heading}>Profile Update: </Text >
                                                {item.profileStatusFlag === 'Y' ? <Text style={styles.cardContent}>Yes</Text> :
                                                    <Text style={styles.cardContent}>No</Text>}
                                            </View>
                                        </View>

                                    </Card>
                                </TouchableOpacity>
                            </View>
                        )}

                        //Setting the number of column
                        numColumns={2}
                        keyExtractor={item => item.childNo}
                        ListHeaderComponent={this.renderHeader}
                    />
                }

                <Modal style={styles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={styles.optionsContainer}>
                        <FlatList data={this.state.modalItemsForCurrentItem} renderItem={({ item }) => (
                            <View style={{
                                flex: 1, flexDirection: 'column', justifyContent: 'space-evenly'
                            }}>

                                <TouchableOpacity style={styles.styleContents} onPress={(event) => this.onPressForList(item.page)}>
                                    <Text style={styles.item}> {item.key}</Text>
                                </TouchableOpacity>
                            </View>

                        )}
                        />
                    </View>
                </Modal>
                <NavigationEvents onDidFocus={() => this.reset()} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'space-evenly',
        flex: 1,
        paddingTop: 10,

    },
    optionsContainer: {
        justifyContent: 'space-evenly',
        flex: 1,

    },
    image: {
        height: 150,
        width: Number((Dimensions.get('window').width / 2).toFixed(1)) - 15,
        resizeMode: 'cover'
    },
    imageWithBorder: {
        height: 150,
        width: Number((Dimensions.get('window').width / 2).toFixed(1)) - 21,
        resizeMode: 'cover'
    },
    paragraph: {
        padding: 15,
        textAlign: 'left',

    },
    container: {
        width: 50,
        // height: 300,
        /*  marginLeft : 10,
          marginTop: 10,
          marginRight: 10,*/
        //  borderRadius : 30,
        backgroundColor: 'rgb(225, 232, 238)',
        paddingTop: 10
    },
    childOnRight: {
        height: 300,
        paddingRight: 5
    },
    childOnLeft: {
        height: 300,
        paddingLeft: 5
    },
    modalContainer: {
        backgroundColor: '#696969',
        width: Dimensions.get('window').width / 2 + 50,
        maxHeight: Dimensions.get('window').height / 2,
        marginTop: Dimensions.get('window').height / 5,
        marginLeft: Dimensions.get('window').width / 5
    },
    item: {
        padding: 5,
        fontSize: 18,
        //  height: 44,
        color: 'white',
        flexWrap: 'wrap'

    },
    styleContents: {
        marginTop: 3,
        padding: 10

    },
    heading: {
        color: 'black',
        fontSize: 15,
        fontFamily: 'sans-serif-medium',

    },
    loading: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: '70%',
        left: Dimensions.get('window').width / 3 + 15

    },
    cardContent: {
        color: 'black',
        paddingLeft: 3,
        fontFamily: 'sans-serif',
        /*flexWrap: 'wrap',
        flex: 1,
        width: 50*/
    },
    extraContent: {
        color: 'black',
        fontFamily: 'sans-serif',
    },
    pink: {
        backgroundColor: '#ff80b3',
        //  borderWidth: 5
    },
    blue: {
        backgroundColor: '#AED6F1',
        //  borderWidth: 5
    },
    green: {
        backgroundColor: '#ABEBC6',
        //  borderWidth: 5,
    },
    yellow: {
        backgroundColor: '#ffff99',
        //  borderWidth: 5
    },
    red: {
        backgroundColor: '#ffcccc',
        borderColor: '#ff0000',
        borderWidth: 3
    }
});
