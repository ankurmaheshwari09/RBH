import base64 from 'react-native-base64';
import {getPassword, getUserName} from './LoginConstant';
class UpdateApi {
    static updateData(jsonBody, update) {
        const path = `https://rest-service.azurewebsites.net/api/v1/${update}`;
        console.log(path, 'Calling PUT');
        console.log(jsonBody, 'llllll');
        return fetch(path, {
            method: 'PUT',
            body: jsonBody,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            }
        }).then(response => {
            console.log(response.status, 'kkkkkk');
            return response;
        });
    }
    static addData(jsonBody, update) {
        console.log('Calling POST')
        const path = `https://rest-service.azurewebsites.net/api/v1/${update}`;
        console.log(path, 'calling POST');
        console.log(jsonBody, 'llllll');
        return fetch(path, {
            method: 'POST',
            body: jsonBody,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(`${getUserName()}:${getPassword()}`)
            }
        }).then(response => {
            console.log(response.status, 'kkkkkk');
            return response;
        });
    }
}

export default UpdateApi;