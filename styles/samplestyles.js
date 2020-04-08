import { StyleSheet, Dimensions } from 'react-native';

export const globalStyles = StyleSheet.create({
    container1: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f0f0f0'
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fafafa'
    },
    input: {
        borderWidth: 0,
        backgroundColor: '#DCDCDC',
        padding: 10,
        fontSize: 14,
        borderRadius: 4
    },
    dropDown: {
        backgroundColor: '#DCDCDC',
        borderWidth: 2,
        borderColor: '#000000',
        padding: 5,
        fontSize: 10,
        borderRadius: 4,
        marginBottom: 5
    },
    text: {
        padding: 10,
        color: '#000000',
        fontSize: 15,
        borderBottomColor: '#000000'
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
        alignSelf: 'flex-start'
    },
    button: {
        height: 32,
        width: 20,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    button1: {
        height: 30,
        width: 20,
        backgroundColor: '#f0f0f0',
        borderColor: '#f0f0f0',
        borderWidth: 0,
        borderRadius: 8,
        marginBottom: 10,
        alignSelf: 'stretch',
        justifyContent: 'center'
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
    },
    dobBtn: {
        marginLeft: 2,
        flex: 2,
        fontSize: 40,
    },
    FontStyle: {
        fontSize: 15
    },
    MainContainer: {
        justifyContent: 'space-between',
        flex: 1,
        //    paddingTop: 10,

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
        //  margin: 90,

    }
});