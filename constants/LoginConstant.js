import { EventRegister } from 'react-native-event-listeners';

global.OrgId = 0;

global.HomeCode = 0;

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