import { base_url, getDataAsync } from './Base'

export function educationConstants() {

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


}

