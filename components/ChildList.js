import React, { Component } from 'react'
import {View, Text, TouchableOpacity, TextInput, StyleSheet, ToolbarAndroid, Button,FlatList,Image,Dimensions} from 'react-native'
import {Card,CardImage,CardContent} from 'react-native-cards'
import Modal from 'react-native-modal';


export default class ChildList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            isVisible: false,
            count: 0,
            page: null,
            selectedChild: null
        };
        this.onPress =this.onPress.bind(this);
       this.navigateToOtherScreen =this.navigateToOtherScreen.bind(this);
        this.closeModal =this.closeModal.bind(this);
        this.onPressForList =this.onPressForList.bind(this);
        // this.show =this.show.bind(this);
    }
    componentDidMount() {
        var that = this;
        let items = Array.apply(null, Array(30)).map((v, i) => {
            return { id: i, src: 'https://picsum.photos/id/'+(i+1)+'/200/300' };
        });
        that.setState({
            dataSource: items,
        });
    }
    onPress(item) {
        console.log(item);
        this.setState({
            isVisible: true,
            selectedChild: item
        });
        console.log(this.state.isVisible);
        console.log(this.state.selectedChild);
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

    render() {
        const items=[
            { key: 'Status', page: 'ChildStatus'},
            {key: 'Health', page: 'Health'},
            {key: 'Education', page: 'Education'},
            { key: 'Family', page: 'Family' },
            { key: 'Communication', page: 'Communication' },
            {key: 'General Info' ,page: 'GeneralInfo'},
            {key: 'View Profile', page: 'Profile'},
            {key: 'Committee', page: 'Committee'},
            { key: 'View Profile', page: 'Profile' },
            { key: 'Follow Up', page: 'FollowUpBy' },
        ];
        return (
            <View style={styles.MainContainer}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                            <TouchableOpacity style={styles.container} onPress={(event) => { this.onPress(item) }}>
                                {/*react-native-elements Card*/}
                                <Card>
                                    <CardImage resizeMode="cover" resizeMethod="resize" source={{ uri: item.src }} />
                                    <CardContent style={styles.paragraph}>
                                        <Text>Name: Child {item.id+1}</Text>
                                        <Text>Age: {item.id+1}</Text>
                                        <Text>DOB: 22/02/1998</Text>
                                    </CardContent>
                                </Card>
                            </TouchableOpacity>
                        </View>
                    )}
                    //Setting the number of column
                    numColumns={2}
                    // keyExtractor={(item, index) => index.toString()}
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

    }
});
