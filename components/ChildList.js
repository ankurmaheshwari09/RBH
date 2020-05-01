import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ToolbarAndroid, Button, FlatList, Image, Dimensions } from 'react-native'
import { Card, CardImage, CardContent } from 'react-native-cards'
import Modal from 'react-native-modal';
import { SearchBar } from 'react-native-elements';
import moment from 'moment';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';
import { getOrgId } from '../constants/LoginConstant';
import { Ionicons } from '@expo/vector-icons';

export default class ChildList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            isVisible: false,
            count: 0,
            page: null,
            selectedChild: null,
            loading: false,
            data: [],
            error: null,
            search: null,
            errorDisplay: false,
            modalItems: [
                { key: 'Status', page: 'ChildStatus' },
                { key: 'Health', page: 'Health' },
                { key: 'Education', page: 'Education' },
                { key: 'Childresult', page: 'childresult' },
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
        
      //  this.setStyles = this.setStyles.bind(this);
        // this.show =this.show.bind(this);
    }
    componentDidMount() {
        this.getData();
    }


    componentWillUnmount() {
        this.setState({
            loading: false,
            search: null,
            errorDisplay: false
        });
    }
    getData() {

        this.setState({ search: null, loading: true });
        let orgId = getOrgId();
        const path = 'https://rest-service.azurewebsites.net/api/v1/children/' + orgId;
        console.log(path, 'lllll');
        fetch(path , {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

            .then(res => {
                
                if (res.ok) {
                  //  console.log(res);
                    res.json().then((data) => {
                        this.setState({
                            data: data,
                            loading: false,
                        });
                     
                        this.arrayholder = data;
                    });
                } else {
                    console.log(res.status);
                    throw Error(res.status);
                }
            })
            .catch(error => {
                this.setState({ loading: false, errorDisplay: true });
            });
    }

   /* static getDerivedStateFromProps(props, state) {

    }*/
    
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
        }
    }
    renderHeader = () => {
        return (
            <SearchBar
                placeholder="Type Here..."
                lightTheme
                round
                onChangeText={text => this.searchFilterFunction(text)}
                value={this.state.search}

            />
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
                console.log(item.csmid, 'id');
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

        console.log(Difference_In_Days);

        return Difference_In_Days;
    }
    getModalItems(item) {
        console.log('modal items');
        let updatedList = this.state.modalItems;
        if (item.childStatus.childStatus !== 'Closed') {
            updatedList = this.state.modalItems.filter(item => item.key !== 'Follow Up');
        }
        return updatedList;
    }

    getImageUri(picture,gender) {
       
        console.log(picture);
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
    render() {

        return (
            <View style={styles.MainContainer}>
                <LoadingDisplay loading={this.state.loading} />
                {this.state.errorDisplay ?
                    <ErrorDisplay errorDisplay={this.state.errorDisplay} />
                    :
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <View style={{
                                flex: 1 / 2, flexDirection: 'column', justifyContent: 'space-evenly'
                            }}>
                                <TouchableOpacity style={styles.container} onPress={(event) => { this.onPress(item) }}>
                                    {/*react-native-elements Card*/}
                                    <Card style={ this.getStyles(item.childStatus.childStatus, item.childMaps, item.childNo)} >
                                    
                                        <View>
                                            <Image
                                                source={this.getImageUri(item.picture, item.gender)}
                                                style={this.getImageStyle(item.style)}
                                            />
                                        </View>
                                        
                                        <View style={styles.paragraph}>
                                            <View style={{ flexDirection: 'row' }}>
                                                <Text style={styles.heading}>Name:</Text >
                                                <Text style={styles.cardContent}>{`${item.firstName} ${item.lastName}`}  </Text>
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
                    <View style={styles.MainContainer}>
                        <FlatList data={this.state.modalItemsForCurrentItem} renderItem={({ item }) => (

                            < TouchableOpacity style={styles.styleContents} onPress={(event) => this.onPressForList(item.page)}>
                                <Text style={styles.item}>{item.key}</Text>
                            </TouchableOpacity>

                        )}
                        />
                    </View>
                </Modal>
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
    image: {
        height: 150,
        width: 195,
        resizeMode: 'cover'
    },
    imageWithBorder: {
        height: 150,
        width: 190,
        resizeMode: 'cover'
    },
    paragraph: {
        padding: 15,
        textAlign: 'left',
        /*borderWidth: 1,
        borderColor: 'red'*/
    },
    container: {
        //  width : 400,
        height: 280,

        /*  marginLeft : 10,
          marginTop: 10,
          marginRight: 10,*/
        //  borderRadius : 30,
        // backgroundColor : '#FFFFFF',
    },
    modalContainer: {
        backgroundColor: '#696969',
        width: Dimensions.get('window').width / 2,
        maxHeight: Dimensions.get('window').height / 2,
        margin: 90,

    },
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: 'white'

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
    cardContent: {
        color: 'black',
        paddingLeft: 3,
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
