import React, {useRef} from 'react';
import styles from './Modal.module.css';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { isLoaded:false, symptoms: this.props.symptoms, drugName:"", items: []};
    }

    componentDidMount(){
        this.setState({isLoaded:true, symptoms: this.props.symptoms})
        setTimeout(() => console.log(this.state.symptoms), 1000);
    }

    handleSubmit () {
        this.props.addNewDrug(this.state.drugName);
    }

    updateDrugName = (event) => {
        console.log(event.target.value);
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
                        <div className={styles.newDrugPrompt}>
                            <h4>Enter the name of the drug you took for these symptoms:</h4>
                            {isLoaded && 
                                <ul>
                                {symptoms.map((value, index) => {
                                    return <li key={index}>{value}</li>
                                })}
                                </ul>
                            }
                            <TextField id="" type="" onChange={this.updateDrugName} />
                            <ButtonGroup className={styles.newDrugButtons} variant="contained" color="primary" aria-label="contained primary button group" size="small">
                            <Button onClick={() => this.handleSubmit()}>Submit</Button>
                            <Button onClick={() => this.closeModal()}>Cancel</Button>
                            </ButtonGroup>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
}

export default Modal