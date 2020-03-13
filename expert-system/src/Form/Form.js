import React, {useRef} from 'react';
import Dropdown from '../SymptomDropdown/SymptomDropdown'
import Modal from '../Modal/Modal'
import PieChart from '../PieChart/PieChart'
import styles from './Form.module.css'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

 const Api = require('../Api');

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = { api: new Api(), isLoaded: false, promptNewDrug: false, showModal: false, selectedValues: [], symptoms: [], results:[]};
    }

    handleSubmit() {
        this.state.api.infer(this.state.selectedValues)
        .then(response => {
            this.setState({results: response})
            this.setState({promptNewDrug: true})
        })
        .catch(error => console.log(error.message));
    }

    updateSelectedValues = (values) => {
        this.setState({selectedValues: values});
    }

    hidePrompt(){
        this.setState({promptNewDrug: false})
    }

    displayModal(){
        //Do something here
        this.setState({showModal: true})
        console.log("display modal");
    }

    closeModal = () => {
        this.setState({showModal: false})
    }

    addNewDrug = (drugName) => {
        //api call
        
        this.state.api.learn(drugName, this.state.selectedValues)
        .then(response => {
            //toasty here
            
            //console.log("Symptoms: ", symptoms, "drug name", drugName);
            // this.setState({results: response})
            // this.setState({promptNewDrug: true})
        })
        .catch(error => console.log(error.message));

        this.setState({showModal: false})
    }

    componentDidMount() {
        this.state.api.getSymptoms()
        .then(response => {
            if(response.length > 0){
                this.setState({isLoaded: true,
                    symptoms: response.map((item,index) => ({ key: index, text: item.replace(/_/g,' '), value: item}))})
            }
        })
        .catch(error => {console.log(error.message)});
    }

    render () {
        const { isLoaded, symptoms, results } = this.state
        if(!isLoaded)
            return <div>Loading...</div>
        else {
            return (
                <div className={styles.root}>
                    {this.state.showModal && <Modal symptoms={this.state.selectedValues} addNewDrug={this.addNewDrug} closeModal={this.closeModal}/>}
                    <Card className={styles.mainCard}>
                        <CardContent>
                            <h2>Select your symptoms:</h2>
                            <div className={styles.inputs}>
                                <Dropdown className={styles.dropdown} symptoms={symptoms} values={this.state.values} handleUpdate={this.updateSelectedValues}/>
                                <Button variant="contained" onClick={() => this.handleSubmit()}>Infer</Button>
                            </div>
                            {this.state.promptNewDrug &&
                            <div className={styles.newDrugPrompt}>
                                <h4>Did you take another drug for these exact symptoms?</h4>
                                <ButtonGroup className={styles.newDrugButtons} variant="contained" color="primary" aria-label="contained primary button group" size="small">
                                <Button onClick={() => this.displayModal()}>Yes</Button>
                                <Button onClick={() => this.hidePrompt()}>No</Button>
                                </ButtonGroup>
                            </div>
                            }
                        </CardContent>
                    </Card>
                    {this.state.results.length > 0 &&
                        <PieChart drugs={this.state.results}/>
                    }
                </div>   
            )
        }
    }
}

export default Form