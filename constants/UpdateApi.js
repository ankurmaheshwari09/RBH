class UpdateApi {
    static updateData(jsonBody, update) {
        const path = 'https://rest-service.azurewebsites.net/api/v1/${update}';
        return fetch(path, {
            method: 'PUT',
            body: jsonString,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            return response;
        });
    }
}

export default UpdateApi;