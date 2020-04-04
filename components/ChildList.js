import React, { Component } from 'react'
import {View, Text, TouchableOpacity, TextInput, StyleSheet, ToolbarAndroid, Button,FlatList,Image,Dimensions} from 'react-native'
import {Card,CardImage,CardContent} from 'react-native-cards'
import Modal from 'react-native-modal';
import { SearchBar } from 'react-native-elements';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { LoadingDisplay } from '../utils/LoadingDisplay';
import { ErrorDisplay } from '../utils/ErrorDispaly';

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
                { key: 'Family', page: 'Family' },
                { key: 'Communication', page: 'Communication' },
                { key: 'General Info', page: 'GeneralInfo' },
                { key: 'View Profile', page: 'Profile' },
                { key: 'Committee', page: 'Committee' },
                { key: 'Follow Up', page: 'FollowUpBy' },
            ],
            modalItemsForCurrentItem:null
        };
        this.arrayholder = [];
        this.onPress =this.onPress.bind(this);
       this.navigateToOtherScreen =this.navigateToOtherScreen.bind(this);
        this.closeModal =this.closeModal.bind(this);
        this.onPressForList = this.onPressForList.bind(this);
        this.searchFilterFunction = this.searchFilterFunction.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.getStyles = this.getStyles.bind(this);
        this.getData = this.getData.bind(this);
        this.getModalItems = this.getModalItems.bind(this);
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
        }, () => { this.getData() });
    }
    getData() {
        console.log('inside get');
        this.setState({ search: null, loading: true });
        fetch('https://rest-service.azurewebsites.net/api/v1/children/45', {
            method: 'GET',
        })
            
            .then(res => {
                if (res.ok) {
                    
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
    closeModal(){
        this.setState({
            isVisible: false,
        });
    }
    onPressForList(screen){
       
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

    getStyles(status) {
        
        if (status == 'Observation') {
            return styles.blue;
        } else if (status == 'Present') {
            return styles.green;
        } else if (status == 'Closed' ) {
            return styles.red;
        } else if (status == 'Absent') {
            return styles.yellow;
        }
    }

    getModalItems(item) {
        console.log('modal items');
        let updatedList = this.state.modalItems;
        if (item.childStatus.childStatus !== 'Closed') {
            updatedList = this.state.modalItems.filter(item => item.key !== 'Follow Up');
        }
        return updatedList;
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
                                flex: 1 / 2, flexDirection: 'column', margin: 1, justifyContent: 'space-evenly'
                            }}>
                                <TouchableOpacity style={styles.container} onPress={(event) => { this.onPress(item) }}>
                                    {/*react-native-elements Card*/}
                                    <Card style={this.getStyles(item.childStatus.childStatus)}>
                                        <CardImage resizeMode="cover" resizeMethod="resize" source={{ uri: "https://picsum.photos/id/1/300/300" }} />
                                        <CardContent style={styles.paragraph}>
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
                                                <Text style={styles.cardContent}>{item.childStatus.childStatus}</Text>
                                            </View>
                                        </CardContent>
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
                <Modal  style={styles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
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
        justifyContent: 'space-between',
        flex: 1,
        paddingTop: 10,

    },
    imageThumbnail: {
        margin: 20
    },
    paragraph:{
        padding: 20,
        textAlign: 'left',
        /*borderWidth: 1,
        borderColor: 'red'*/
    },
    container : {
      //  width : 400,
        height: 250,
        
      /*  marginLeft : 10,
        marginTop: 10,
        marginRight: 10,*/
      //  borderRadius : 30,
        // backgroundColor : '#FFFFFF',
    },
    modalContainer: {
        backgroundColor : '#696969',
        width: Dimensions.get('window').width / 2,
        maxHeight:Dimensions.get('window').height / 2,
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
    red: {
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
    }
});
