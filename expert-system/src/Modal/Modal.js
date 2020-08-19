import React, {useRef} from 'react';
import styles from './Modal.module.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import SendIcon from '@material-ui/icons/Send'

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoaded:false, symptoms: this.props.symptoms, drugName:"", items: []};
    }

    componentDidMount(){
        this.setState({isLoaded:true, symptoms: this.props.symptoms})
        setTimeout(() => console.log(this.state.symptoms), 1000);   //Set the stae of the symptoms after they have been loaded in
    }

    handleSubmit () {
        this.props.addNewDrug(this.state.drugName);     //Call the handler function passed in as a prop
    }

    updateDrugName = (event) => {
        this.setState({drugName: event.target.value});
    }

    closeModal() {
        this.setState({drugName: ""});
        this.props.closeModal();
    }

    render () {
        const { symptoms, isLoaded } = this.state
        return (
            <div className={styles.modal} >
                <Card className={styles.modalContent}>
                    <CardContent >
                        <IconButton className={styles.cancelButton} color="primary" size="medium" aria-label="close modal" onClick={() => this.closeModal()} component="span">
                            <CancelIcon size="large" />
                        </IconButton>
                        <div className={styles.newDrugPrompt}>
                            <h4 className={styles.headerText}>Enter the name of the drug you took for the following symptoms:</h4>
                            {isLoaded && 
                                <ul className={styles.symptomsList}>
                                {symptoms.map((value, index) => {
                                    return <li key={index}>{value.replace(/_/g,' ')}</li>
                                })}
                                </ul>
                            }
                            <div className={styles.inputs}>
                                <TextField className={styles.textField} label="Drug name" onChange={this.updateDrugName} />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    endIcon={<SendIcon/>}
                                    onClick={() => this.handleSubmit()}>
                                    Submit
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Modal