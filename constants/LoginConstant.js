import { EventRegister } from 'react-native-event-listeners';

global.OrgId = 0;

export function getOrgId() {
    return global.OrgId;
}

export function setOrgId(id) {
    console.log(id);
    global.OrgId = id;
}

export function logOut() {
    EventRegister.emit('logoutEvent', ' Logging out ');
}

export function callList() {
    EventRegister.emit('addSuccess', ' getting list ');
}
