import React from 'react'
import { Dropdown } from 'semantic-ui-react'
const Api = require('./Api');



class SymptomDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "", symptoms: [], options:[], values: [] };
        this.api = new Api();
    }

    componentDidMount() {
        // this.api.callAPI("getSymptoms")
        // .then(response => {this.setState({symptoms: response}); console.log(response)})
        // .catch(error => {console.log(error.message)});
        // setTimeout(() => {
        //     if(this.state.symptoms.length > 0){
        //         this.setState({options: this.state.symptoms.map((item,index) => ({ key: index, text: item, value: item}))
        //     })}
        //     console.log(this.state.symptoms)
        // }, 10000);

        this.api.getSymptoms()
        .then(response => {this.setState({symptoms: response })})
        .catch(error => {console.log(error.message)});

        setTimeout(() => {
            if(this.state.symptoms.length > 0){
                this.setState({options: this.state.symptoms.map((item,index) => ({ key: index, text: item, value: item}))
            })}
            console.log(this.state.symptoms)
        }, 1000);
    }

    handleChange = (event, data) => {
        this.setState({values: data.value});
    }

    render () {
        return (
            <Dropdown
                placeholder='Symptoms'
                fluid
                multiple
                search
                selection
                options={this.state.options}
                onChange={this.handleChange}
            />
        )
    }
}

export default SymptomDropdown
