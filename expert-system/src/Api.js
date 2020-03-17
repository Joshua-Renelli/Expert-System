module.exports = class Api{
    constructor(){
        this.url = "http://localhost:3001/"
    }

    async getSymptoms() {
        return fetch(`${this.url}symptoms`)
        .then((response) => {return response.json()})
        .catch(error => { throw new Error("Cannot fetch symptoms")})
    }

    async infer(symptoms){
        return fetch(`${this.url}infer`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(symptoms)
        })
        .then(response => {return response.json()})
        .catch(error => {throw new Error(error.message)})
    }

    async learn(drugName, symptoms){
        let data = {drugName: drugName, symptoms: symptoms}
        return fetch(`${this.url}learn`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if(!response.ok){
                if(response.status === 500){
                    throw new Error(`New drug already exists: ${drugName}`)
                }
            }
        })
    }
}