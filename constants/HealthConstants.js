import { base_url, getDataAsync } from './Base'
import { getOrgId } from './LoginConstant'

export function HealthConstants() {
    let orgid = getOrgId();
    console.log(orgid)

    global.campName;
    getDataAsync(base_url + '/health-campName/' + orgid).then(data => { global.campName = data })

    global.hospitalName;
    getDataAsync(base_url + '/health-camp-hospitalName/' + orgid).then(data => { global.hospitalName = data })


}