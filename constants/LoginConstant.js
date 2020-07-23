import { EventRegister } from 'react-native-event-listeners';

global.OrgId = 0;

global.HomeCode = 0;

global.username = '';

global.password = '';

export function getOrgId() {
    return global.OrgId;
}

export function setOrgId(id) {
    console.log(id);
    global.OrgId = id;
}

export function setHomeCode(code) {
    console.log(code);
    global.HomeCode = code;
}

export function getHomeCode() {
    return global.HomeCode;
}

export function logOut() {
	EventRegister.emit('logoutEvent',' Logging out ');
}

export function setUserName(username) {
    console.log(username);
    global.username = username;
}

export function getUserName() {
    return global.username; 
}

export function setPassword(password) {

    global.password = password;
}

export function getPassword() {
    return global.password;
}