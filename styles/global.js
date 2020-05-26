import { StyleSheet, Dimensions } from 'react-native';

export const globalStyles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f0f0f0'
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white',
    },
    formcontainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#000000',
        padding: 20,
        fontSize: 18,
        borderRadius: 6
    },
    touchableBox: {
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        backgroundColor: '#fafafa',
        marginBottom: 1
    },
    inputform: {
        borderWidth: 3,
        borderColor: '#ddd',
        padding: 20,
        fontSize: 18,
        borderRadius: 6,
        marginLeft: 10,
        marginRight: 15,
    },
    inputText: {
        borderWidth: 1,
        // borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        borderColor: 'black',
    },
    // dropDown: {
    //     backgroundColor: '#fafafa',
    //     borderWidth: 1,
    //     borderColor: '#000000',
    //     padding: 10,
    //     fontSize: 18,
    //     borderRadius: 6,
    //     marginBottom: 1,
    //     flexWrap: 'wrap'
    // },
    dropDown: {
        borderColor: 'black',
        borderWidth: 1,
    },
    text: {
        padding: 10,
        color: '#000000',
        fontSize: 17,
        fontWeight: 'bold',
        borderColor: '#000000'
    },
    dateView: {
        flex: 1,
        flexDirection: 'row',
    },
    dateValue: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        flex: 3,
    },
    dateBtn: {
        marginLeft: 4,
        flex: 2,
        fontSize: 35,
        marginTop: 4
    },
    textform: {
        padding: 10,
        color: '#000000',
        fontSize: 16,
        borderBottomColor: '#000000',
        marginBottom: 5,
        marginTop: 5,
        marginRight: 15,
        fontWeight: 'bold',
    },
    button: {
        color: 'blue',
        padding: 10,
        borderRadius: 6,
        fontSize: 18,
        position: 'relative',
        paddingTop: 10,
        marginBottom: 5,
    },
    errormsg: {
        padding: 1,
        color: 'crimson',
        fontWeight: 'bold',
        fontSize: 10,
    },
    keyboardavoid: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    formheading: {
        fontSize: 24,
        alignSelf: 'center',
        marginBottom: 20
    },
    buttonText: {
        fontSize: 18,
        color: 'white',
        alignSelf: 'center'
    },
    button: {
        height: 36,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    homeView: {
        flex: 1,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    addChildBtn: {
        padding: 30,
        backgroundColor: 'black',
        color: 'black',
    },
    vuChildBtn: {
        padding: 30,
        backgroundColor: 'black',
        color: 'black',
    },
    homeScreenText: {
        top: '30%',
        padding: 30,
        fontSize: 15,
    },
    errormsgform: {
        padding: 1,
        color: 'crimson',
        fontWeight: 'bold',
        fontSize: 10,
        marginLeft: 10,
        marginRight: 15
    },
    scrollContainer: {
        flex: 1,
        padding: 5
    },
    segScrollView: {
        height: 0
    },
    segView: {
        height: 50
    },
    spinnerTextStyle: {
        color: '#FF0000'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: 'white',
        width: Dimensions.get('window').width / 2 + 50,
        maxHeight: Dimensions.get('window').height / 4,
        top: 150,
        borderRadius: 30
    },
    MainContainer: {
        justifyContent: 'space-between',
        flex: 1,
    },
    label: {
        fontSize: 14,
        paddingTop: 5,
        fontWeight: 'bold',
    },
    backgroundlogoimage: {
        position: 'absolute', top:"20%",right: 0, left: 0, zIndex: -2,
    },
    uploadpicbutton: {
        width: '50%',
        marginBottom: 5,
    },
    topView: {
        paddingTop: 5,
    },
    uploadImage: {
        marginTop: 10,
        marginBottom: 10,
        marginLeft: '25%',
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: "black"
    },
    dobView: {
        flex: 1,
        flexDirection: 'row',
    },
    dobValue: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        fontSize: 18,
        borderRadius: 6,
        flex: 3,
        borderColor: 'black',
    },
    dobBtn: {
        marginLeft: 2,
        flex: 2,
        fontSize: 40,
    },
    prevnext: {
        flex: 1,
        flexDirection: 'row',
    },
    prevnextsubview: {
        width: '50%',
    },
    prevnextbuttons: {
        marginTop: '10%',
        fontSize: 16,
        marginLeft: '40%',
        color: 'green',
    },
    prevnextbuttonsgrey: {
        marginTop: '10%',
        fontSize: 16,
        marginLeft: '40%',
        color: 'grey',
    },
    modalButton: {
        color: 'blue',
        padding: 10,
        borderRadius: 6,
        marginBottom: 5,
        fontSize: 14,
    },
    Header: {
        padding: 5,
        textAlign: "center",
        color: '#000000',
        fontSize: 25,
        borderBottomColor: '#000000'
    },
    healthformheading: {
        fontSize: 18,
        alignSelf: 'center',
        marginBottom: 15,
        marginTop: 0,
        backgroundColor:'#48BBEC',
        color: 'white',
        borderWidth: 1,
        borderRadius: 8
    }

});