global.OrgId = 0;

export function getOrgId() {
    return global.OrgId;
}

export function setOrgId(id) {
    console.log(id);
    global.OrgId = id;
}