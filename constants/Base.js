export let base_url = 'https://rest-service.azurewebsites.net/api/v1'

export async function getDataAsync(url){
    try{
        let response = await fetch(url);
        if(response.status == 200){
            let body = await response.json();
            return body;
        
        }
        else{
            let error = new Error(response.statusText);
            error.response = response;
            throw error;
        }
    }
    catch(errr) {
        console.log(errr)
        return [{"religion": "service unavailable", "religionID": "123"}]
    }
}
