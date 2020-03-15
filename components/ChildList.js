import React, { Component } from 'react'
import {View, Text, TouchableOpacity, TextInput, StyleSheet, ToolbarAndroid, Button,FlatList,Image,Dimensions} from 'react-native'
import {Card,CardImage,CardContent} from 'react-native-cards'
import Modal from 'react-native-modal';
import { SearchBar } from 'react-native-elements';
import moment from 'moment';

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
            search: null
        };
        this.arrayholder = [];
        this.onPress =this.onPress.bind(this);
       this.navigateToOtherScreen =this.navigateToOtherScreen.bind(this);
        this.closeModal =this.closeModal.bind(this);
        this.onPressForList = this.onPressForList.bind(this);
        this.searchFilterFunction = this.searchFilterFunction.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.getStyles = this.getStyles.bind(this);
        // this.show =this.show.bind(this);
    }
    componentDidMount() {
        this.setState({ search: null });
        var that = this;
        let items = Array.apply(null, Array(30)).map((v, i) => {
            return { id: i, src: 'https://picsum.photos/id/'+(i+1)+'/200/300' };
        });
        that.setState({
            dataSource: items,
        });
        fetch('https://randomuser.me/api/?&results=20', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    data: res.results,
                    error: res.error || null,
                    loading: false,
                });

                this.arrayholder = res.results;
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });  
    }
    onPress(item) {
        console.log(item);
        this.setState({
            isVisible: true,
            selectedChild: item
        });
        console.log(this.state.isVisible);
      //  console.log(this.state.selectedChild);
    }
    navigateToOtherScreen(screen){
        // console.log(this.state.navItems);
        this.props.navigation.navigate(screen, { child: this.state.selectedChild });
    }
    closeModal(){
        this.setState({
            isVisible: false,
        });
    }
    onPressForList(screen){
        console.log("event:"+screen);
        this.closeModal();
       // this.setState({page: page});
       this.navigateToOtherScreen(screen);
    }
    searchFilterFunction = text => {

        console.log(text);
        this.setState({ search: text });
        if ('' == text) {
            this.setState({
                data: this.arrayholder
            });
            return;
        } else {
           
            this.state.data = this.arrayholder.filter(function (item) {
                 let date = moment(item.dob.date).format('DD/MM/YYYY');
                return item.name.first.toLowerCase().includes(text.toLowerCase()) || item.name.last.toLowerCase().includes(text.toLowerCase()) || (item.dob.age == text) || date.includes(text);
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

    getStyles(item) {
        
        if (item.dob.age > 20 && item.dob.age <= 40) {
            return styles.red;
        } else if (item.dob.age > 40 && item.dob.age < 60) {
            return styles.blue;
        } else if (item.dob.age >= 60 ) {
            return styles.green;
        }
    }

    render() {
        const items=[
            { key: 'Status', page: 'ChildStatus'},
            {key: 'Health', page: 'Health'},
            {key: 'Education', page: 'Education'},
            {key: 'General Info' ,page: 'GeneralInfo'},
            { key: 'View Profile', page: 'Profile' },
            { key: 'Follow Up', page: 'FollowUpBy' },
        ];
        return (
            <View style={styles.MainContainer}>
               
                <FlatList
                    data={this.state.data}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1/2, flexDirection: 'column', margin: 1 }}>
                            <TouchableOpacity style={styles.container} onPress={(event) => { this.onPress(item) }}>
                                {/*react-native-elements Card*/}
                                <Card style={this.getStyles(item)}>
                                    <CardImage resizeMode="cover" resizeMethod="resize" source={{ uri: item.picture.large }} />
                                    <CardContent style={styles.paragraph}>
                                        <Text>Name: {`${item.name.first} ${item.name.last}`}  </Text>
                                        <Text>Age: {item.dob.age}</Text>
                                        <Text>DOB: {moment(item.dob.date).format('DD/MM/YYYY')}</Text>
                                    </CardContent>
                                </Card>
                            </TouchableOpacity>
                        </View>
                    )}
                    //Setting the number of column
                    numColumns={2}
                    keyExtractor={item => item.email} 
                    ListHeaderComponent={this.renderHeader}
                />
                <Modal  style={styles.modalContainer} isVisible={this.state.isVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
                    <View style={styles.MainContainer}>
                        <FlatList data={items} renderItem={({item})=>(
                            <TouchableOpacity style={styles.styleContents} onPress={(event) =>this.onPressForList(item.page)}>
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
        padding:20
    },
    container : {
        // width : 150,
        height : 200,
        marginLeft : 10,
        marginTop: 10,
        marginRight: 10,
        // borderRadius : 15,
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
    red: {
        backgroundColor: '#ff80b3',
    },
    blue: {
        backgroundColor: '#AED6F1'
    },
    green: {
        backgroundColor: '#ABEBC6'
    },
    yellow: {
        backgroundColor: '#ffff80'
    }
});