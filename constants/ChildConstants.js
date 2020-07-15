import {base_url, getDataAsync} from './Base'

export function childConstants(){

    global.religions;
    getDataAsync(base_url + '/religions').then(data => {global.religions = data});
    
    global.communities;
    getDataAsync(base_url + '/communities').then(data => {global.communities = data});

    global.motherTongues;
    getDataAsync(base_url + '/mother-tongues').then(data => {global.motherTongues = data});

    global.parentalStatusList;
    getDataAsync(base_url + '/parental-statuses').then(data => {global.parentalStatusList = data});

    global.admissionReasons;
    getDataAsync(base_url + '/admission-reasons').then(data => {global.admissionReasons = data; console.log('******'); console.log(data)});

    global.educationStatusList;
    getDataAsync(base_url + '/education-statuses').then(data => {global.educationStatusList = data});

    global.homeStaffList;
    getDataAsync(base_url + '/home-staff-list').then(data => {global.homeStaffList = data});

    global.referralSourcesList
    getDataAsync(base_url + '/referral-sources').then(data => {global.referralSourcesList = data});

    global.childStatusList
    getDataAsync(base_url + '/child-statuses').then(data => {global.childStatusList = data});
}

export function buildTestImageName(childNo){
    return `childpic${childNo}.png`
}

export function buildProdImageName(childStrigId, firstName){
    date_string = moment(new Date()).format('DDMMYYYYHHmmss')
    return `${childStrigId}_${firstName}_${date_string}.png`
}