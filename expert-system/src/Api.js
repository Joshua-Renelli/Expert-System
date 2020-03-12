module.exports = class Api{
    constructor(){
        this.url = "http://localhost:3001/"
    }

    // async callAPI(endpoint) {
    //     switch(endpoint){
    //         case "getSymptoms": 
    //             fetch(`${this.url}symptoms`)
    //             .then((response) => {return response})
    //             .catch(error => { throw new Error("Cannot fetch symptoms")})
    //     }
    // }

    async getSymptoms() {
        return fetch(`${this.url}symptoms`)
        .then((response) => {return response.json()})
        .catch(error => { throw new Error("Cannot fetch symptoms")})
    }
}