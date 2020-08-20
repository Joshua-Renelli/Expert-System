var Api = class Api{
    constructor(){
        if(process.env.NODE_ENV === 'local'){
            this.url = "http://localhost:3001/"
        }
        else if(process.env.NODE_ENV === 'production'){
            this.url = "https://expert-system-server.herokuapp.com/"
        }
    }

    //Returns array of all symptoms
    async getSymptoms() {
        return fetch(`${this.url}symptoms`)
        .then((response) => {return response.json()})
        .catch(error => { throw new Error("Cannot fetch symptoms")})
    }

    //Infers data
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

    //Adds new drugs to db
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

export default Api;