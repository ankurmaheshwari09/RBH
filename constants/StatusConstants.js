import { base_url, getDataAsync } from './Base';
import { getOrgId } from '../constants/LoginConstant';

export function statusConstants() {

        let orgId = getOrgId();

        global.status;
        getDataAsync(base_url + '/child-statuses').then(data => {  global.status = data })

        global.leavingReason;
        getDataAsync(base_url + '/child-leaving-reasons').then(data => {  global.leavingReason = data })

        global.leftPlaces;
        getDataAsync(base_url + '/child-left-places').then(data => { global.leftPlaces = data })

        global.actionTaken;
        getDataAsync(base_url + '/action-taken-list').then(data => {  global.actionTaken = data })

        global.staff;
        getDataAsync(base_url + '/home-staff-list/'+ orgId).then(data => { global.staff = data })

}

