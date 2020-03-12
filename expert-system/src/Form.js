import React, {useRef} from 'react';
import Dropdown from './SymptomDropdown'
// const Api = require('./Api');


const symptomsRef = useRef();

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "", values: [] };
        // this.api = new Api();
    }

    handleSubmit(event) {
        // alert('Your favorite flavor is: ' + this.state.value);
        // event.preventDefault();
        console.log(symptomsRef.current.value);
    }

    // componentDidMount() {
    //     this.api.getSymptoms()
    //     .then(response => {this.setState({symptoms: response })})
    //     .catch(error => {console.log(error.message)});
        
    //     setTimeout(() => {
    //         if(this.state.symptoms.length > 0){
    //             this.setState({options: this.state.symptoms.map((item,index) => ({ key: index, text: item, value: item}))
    //         })}
    //         console.log(this.state.symptoms)
    //     }, 1000);
    // }

    render () {
        return (
            <>
                <form onSubmit={handleSubmit}>
                    <label>
                    Select your symptoms:
                        <Dropdown values={this.state.values}/>
                    </label>
                    <input ref={symptomsRef} type="submit" value="Submit" />
                </form>
            </>
        )
    }
}

export default Form