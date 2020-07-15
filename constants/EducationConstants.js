import { base_url, getDataAsync } from './Base'
import { getOrgId } from './LoginConstant'

export function educationConstants() {
    let orgid = getOrgId();
    console.log(orgid)

    global.studyingclass;
    getDataAsync(base_url + '/studying-class').then(data => { global.studyingclass = data })

    global.medium;
    getDataAsync(base_url + '/mother-tongues').then(data => { global.medium = data })

    global.schooltype;
    getDataAsync(base_url + '/school-type').then(data => { global.schooltype = data })

    global.childstaytype;
    getDataAsync(base_url + '/childstay-type').then(data => { global.childstaytype = data })

    global.scholorshiptype;
    getDataAsync(base_url + '/scholarship-type').then(data => { global.scholorshiptype = data })

    global.literacyStatus;
    getDataAsync(base_url + '/literacyStatus').then(data => { global.literacyStatus = data })

    global.schoolname;
    getDataAsync(base_url + '/unique-schoolName/' + orgid).then(data => { global.schoolname = data })
}

