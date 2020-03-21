import React, { Component } from 'react'
import {View, Text, TouchableOpacity, TextInput, StyleSheet, ToolbarAndroid, Button,FlatList,Image,Dimensions} from 'react-native'
import {Card,CardImage,CardContent} from 'react-native-cards'
import Modal from 'react-native-modal';

export default class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: {},
            isVisible: false,
            count: 0
        };
        this.onPress =this.onPress.bind(this);
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
        console.log(this.state.dataSource);
        console.log(this.state.isVisible);
    }
    onPress() {
        this.setState({
            isVisible: true
        });
        console.log(this.state.isVisible);
    }

    render() {
        const items=[
            {key: 'Status'},
            {key: 'Health'},
            {key: 'Education'},
            { key: 'Family' },
            { key: 'Communication' },
            {key: 'General Info'},
            {key: 'View'}
        ];
        return (
            <View style={styles.MainContainer}>
                <FlatList
                    data={this.state.dataSource}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, flexDirection: 'column', margin: 1 }}>
                            <TouchableOpacity style={styles.container} onPress={this.onPress}>
                                {/*react-native-elements Card*/}
                                <Card>
                                    <CardImage resizeMode="cover" resizeMethod="resize" source={{ uri: item.src }} />
                                    <CardContent style={styles.paragraph}>
                                        <Text>Name: Sahithi</Text>
                                        <Text>Age: 20</Text>
                                        <Text>DOB: 22/02/1998</Text>
                                    </CardContent>
                                </Card>
                                {/*<View style={styles.container}>*/}
                                {/*<Image source={{uri: item.src}} resizeMode="cover" style={styles.imageThumbnail}/>*/}
                                {/*<Text>Name: Sahithi</Text>*/}
                                {/*    <Text>Age: 20</Text>*/}
                                {/*  <Text>DOB: 22/02/1998</Text>*/}
                                {/*</View>*/}
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
                            <TouchableOpacity style={styles.styleContents}>
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
        paddingTop: 30,

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
        margin: 90
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
