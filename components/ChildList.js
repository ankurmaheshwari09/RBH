import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert,  ToolbarAndroid, Button, FlatList, Image, Dimensions, PixelRatio, BackHandler  } from 'react-native'
import { Card, CardImage, CardContent } from 'react-native-cards'
import Modal from 'react-native-modal';
import { SearchBar, Overlay } from 'react-native-elements';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { getOrgId } from '../constants/LoginConstant';
import { Ionicons } from '@expo/vector-icons';
import { base_url, getDataAsync } from '../constants/Base';
import ScalableText from 'react-native-text';
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
            modalItems: [
                { key: 'Status', page: 'ChildStatus' },
                { key: 'Health', page: 'Health' },
                { key: 'Education', page: 'Education' },
                { key: 'Result', page: 'ChildResult' },
                { key: 'Family', page: 'Family' },
                { key: 'Communication', page: 'Communication' },
                { key: 'General Info', page: 'GeneralInfo' },
                { key: 'View Profile', page: 'Profile' },
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
        this.resertStack = this.resertStack.bind(this);
        this.getAddedData = this.getAddedData.bind(this);
        this.back_Button_Press = this.back_Button_Press.bind(this);
        this.reset = this.reset.bind(this);
        //  this.setStyles = this.setStyles.bind(this);
        // this.show =this.show.bind(this);
    }
    /*async componentDidMount() {
       // BackHandler.addEventListener('hardwareBackPress', this.back_Button_Press);
        await this.getData();
        
    }*/


    componentWillUnmount() {
        this.setState({
            loading: false,
            search: null,
            errorDisplay: false
        });
      //  BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
    }

    back_Button_Press() {

      /*  console.log(this.props);
        const popAction = StackActions.pop(1);*/


       // console.log(this.props.screenProps, 'oooo');

        
       /* if (this.props.navigation.state.routeName !== 'ViewChild') {
            console.log(this.props.navigation.state.routeName, 'oooo');
            this.props.screenProps.goBack();
            return false;
        } else {
            console.log(this.props.navigation.state.routeName, 'lll');
            return false;
        }
*/

        return false;
       

        

       /* if (Actions.currentScene !== '') {
            Actions.pop();
            return true;
        }*/
       // this.props.screenProps.navigation.replace('Home');

       
        /*Alert.alert(
            ' Exit From App ',
            ' Do you want to exit From App ?',
            [
                {
                    text: 'Yes', onPress: () => {
                        console.log(this.props);
                        const popAction = StackActions.pop(1);

                       this.props.navigation.dispatch(popAction);

                        console.log(this.props.screenProps, 'oooo');
                        this.props.screenProps.navigation.replace('Home');

                    }
                },
                { text: 'No', onPress: () => { console.log('NO Pressed'); } }
            ],
            { cancelable: false },
        );*/
        
    }

    resertStack() {

        console.log("insdie backdrop");
        const popAction = StackActions.pop(1);

        navigation.dispatch(popAction);

        console.log(this.props.screenProps, 'oooo');
        this.props.screenProps.navigation.replace('Home');
    }
    // This function adds a new property to object
    async getAddedData(data) {

        let result = data.map(async childData => {
            let res = await fetch(base_url + "/child-profile-all-description/" + childData.childNo, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                }
            })
            let responseJson = await res.json();
            if (res.ok) {

                if (responseJson == null) {
                    childData.changeProfile = true;
                    this.setState({ checkProfileAlert: true });
                }
                else {
                    let date_modified = responseJson[0].modified_ON;
                    let dm = moment(date_modified).format("YYYY-MM-DD");
                    let dm1 = moment(new Date()).format("YYYY-MM-DD");
                    let a = new Date(dm);
                    let b = new Date(dm1);
                    let diffInDate = b - a;
                    let daysTillToday = Math.floor(diffInDate / (1000 * 60 * 60 * 24));
                    //  console.log(daysTillToday, childData.childNo, 'daysTillToday');
                    if (daysTillToday >= 365) {
                        childData.changeProfile = true;
                        this.setState({ checkProfileAlert: true });
                    } else {
                        this.setState({ checkProfileAlert: false });
                        childData.changeProfile = false;
                    }
                }
            }
            else {
                console.log(res.status);
                throw Error(res.status);
            }
            return childData;
        });

        let final_result = await Promise.all(result)
        //console.log(final_result,'finished adding data');
        this.setState({ data: final_result, loading: false });

    };
    async getData() {
        console.log('inside get');
        let orgId = getOrgId();
        const path = 'https://rest-service.azurewebsites.net/api/v1/children/' + orgId;
        console.log(path, 'lllll');
        this.setState({ search: null, loading: true, data: null });
        try {
            let const1 = await fetch(path, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            let response = await const1.json();
            response = this.setCounterForItemsInList(response);
            // console.log(response, 'ddddddddddd');
            if (const1.ok) {
                await this.getAddedData(response);
                //console.log(this.state.data,'final');

                if (this.state.checkProfileAlert) {
                    console.log('alert');
                    alert('Please "Update Profile Description" for children with Profile Update Status: Yes');
                }
                this.arrayholder = response;
            } else {
                console.log(response.status);
                throw Error(response.status);
            }
        }
        catch (error) {
            console.log(error, 'error in getting data');
            //  this.setState({ loading: false, errorDisplay: true });
        }
        this.setState({ refresh: false });
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

        // console.log(text);
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
                return (item.firstName.toLowerCase().includes(text.toLowerCase())
                    || item.lastName.toLowerCase().includes(text.toLowerCase())
                    || dateOfBirth.includes(text)
                    || admissionDate.includes(text)
                    || item.childStatus.childStatus.includes(text));
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
                    placeholder="Type Here..."
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

    getStyles(status, childMap, childNo) {

        let index = this.state.data.findIndex((item) => item.childNo == childNo);

        if (status == 'Observation') {
            if (this.checkStatusDateExpired(childMap, status)) {
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
            if (this.checkStatusDateExpired(childMap, status)) {
                this.state.data[index].style = styles.red;
                return styles.red;
            } else {
                this.state.data[index].style = styles.yellow;
                return styles.yellow;
            }
        }



    }

    checkStatusDateExpired(childMap, status) {

        let date = childMap.map((item) => {
            if (item.childStatusID.childStatus == status) {

                return moment(item.childStatusDate).format('YYYY-MM-DD');
            } else {
                return '';
            }
        });
        date.sort();
        date.reverse();

        let diff = this.getDiffBetweenDates(new Date(date[0]), new Date());
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
        if (item.childStatus.childStatus !== 'Closed') {
            updatedList = this.state.modalItems.filter(item => item.key !== 'Follow Up');
        }
        return updatedList;
    }

    getImageUri(picture, gender) {

        if (picture === null || picture === "") {
            if (gender === 1) {
                return require('../assets/girl.jpg');
            } else {
                return require('../assets/boy.jpg');
            }
        } else {
            return { uri: "http://app.rainbowhome.in/ChildImage/" + picture };
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
            <View style={styles.MainContainer}>
                {this.state.loading ?
                   
                    <View style={{ position: 'absolute', top: "45%", right: 0, left: 0, zIndex: 10 }}>
                        <ActivityIndicator animating={this.state.loading} size="large" color="black" />
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
                                            <Card style={this.getStyles(item.childStatus.childStatus, item.childMaps, item.childNo)} >

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
                                                        {item.childStatus.childStatus == 'Closed' ? <Text style={styles.cardContent}>Exit</Text> :
                                                            <Text style={styles.cardContent}>{item.childStatus.childStatus}</Text>}
                                                        {item.style == styles.red ? < Ionicons name="md-warning" size={20} color="red" /> : null}
                                                    </View>
                                                    <View style={{ flexDirection: 'row' }}>
                                                        <Text style={styles.heading}>Profile Update: </Text >
                                                        {item.changeProfile ? <Text style={styles.cardContent}>Yes</Text> :
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
        // fontWeight: 'bold',
    },
    loading: {
        color: 'black',
        fontSize: 30,
        fontFamily: 'sans-serif-medium',
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: Dimensions.get('window').height / 2,
        marginLeft: Dimensions.get('window').width / 2
        // fontWeight: 'bold',
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
