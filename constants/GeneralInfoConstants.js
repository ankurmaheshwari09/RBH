import {base_url, getDataAsync} from './Base'

export function generalInfoConstants(){

    global.identification;
    getDataAsync(base_url + '/identifications').then(data => {global.identification = data})

    global.markTypes;
    getDataAsync(base_url + '/mark-types').then(data => {console.log(data);global.markTypes = data})

    global.specialNeed;
    getDataAsync(base_url + '/differently-abled-groups').then(data => {global.specialNeed = data})

    global.occupation;
    getDataAsync(base_url + '/street-occupations').then(data => {global.occupation = data})

    global.cwcStayReason;
    getDataAsync(base_url + '/stay-reasons').then(data => {global.cwcStayReason = data})

    global.generalHealth;
    getDataAsync(base_url + '/general-health').then(data => {global.generalHealth = data})

    global.medium;
    getDataAsync(base_url + '/mother-tongues').then(data => {global.medium = data})

    global.schoolType;
    getDataAsync(base_url + '/school-type').then(data => {global.schoolType = data})

    global.class;
    getDataAsync(base_url + '/studying-class').then(data => { console.log(data); global.class = data })

}