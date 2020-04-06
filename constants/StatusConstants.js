import { base_url, getDataAsync } from './Base'

export function statusConstants() {

        global.status;
        getDataAsync(base_url + '/child-statuses').then(data => { console.log(data); global.status = data })

        global.leavingReason;
        getDataAsync(base_url + '/child-leaving-reasons').then(data => { console.log(data); global.leavingReason = data })

        global.leftPlaces;
        getDataAsync(base_url + '/child-left-places').then(data => { console.log(data); global.leftPlaces = data })

        global.actionTaken;
        getDataAsync(base_url + '/action-taken-list').then(data => { console.log(data); global.actionTaken = data })

        global.staff;
        getDataAsync(base_url + '/home-staff-list').then(data => { console.log(data); global.staff = data })

}

