import { base_url, getDataAsync } from './Base'

export function educationConstants() {

    global.studyingclass;
    getDataAsync(base_url + '/studying-class').then(data => { console.log(data); global.studyingclass = data })

    global.medium;
    getDataAsync(base_url + '/mother-tongues').then(data => { console.log(data); global.medium = data })

    global.schooltype;
    getDataAsync(base_url + '/school-type').then(data => { console.log(data); global.schooltype = data })


}

