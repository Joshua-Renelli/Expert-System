import React, {useRef} from 'react';
import Dropdown from '../SymptomDropdown/SymptomDropdown'
import Modal from '../Modal/Modal'
import PieChart from '../PieChart/PieChart'
import styles from './Form.module.css'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Alert from '@material-ui/lab/Alert';

 const Api = require('../Api');

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = { api: new Api(), isLoaded: false, loadingDrugs: false, promptNewDrug: false,
             showModal: false, selectedValues: [], symptoms: [], results:[], createdNewDrug: false, drugAlertText: "", drugAlertSeverity: "success"};
    }

    handleSubmit() {
        this.setState({loadingDrugs: true})
        this.state.api.infer(this.state.selectedValues)
        .then(response => {
            this.setState({results: response, loadingDrugs: false, promptNewDrug: true})
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
        this.setState({showModal: true, createdNewDrug: false})
    }

    closeModal = () => {
        this.setState({showModal: false})
    }

    addNewDrug = (drugName) => {
        this.state.api.learn(drugName, this.state.selectedValues)
        .then(response => {
            this.setState({drugAlertText: `Successfully added new drug: ${drugName}`,
            drugAlertSeverity: "success", createdNewDrug: true})
        })
        .catch(error => {
            this.setState({drugAlertText: error.message,
            drugAlertSeverity: "error", createdNewDrug: true})
        })

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
                    {this.state.results.length > 0 && !this.state.loadingDrugs &&
                        <PieChart drugs={this.state.results}/>
                    }
                    {this.state.createdNewDrug && 
                    <Alert className={styles.alert} variant="filled" severity={this.state.drugAlertSeverity}>
                        {this.state.drugAlertText}
                    </Alert>
                    }
                    <h1 className={styles.logo}>pharm<b>ASSIST</b>™</h1>
                    <h3 className={styles.copywrite}>© 2020 Joshua Renelli & Paolo Scola</h3>
                </div>   
            )
        }
    }
}

export default Form