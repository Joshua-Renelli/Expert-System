import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import styles from './SymptomDropdown.module.css'

class SymptomDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = { symptoms: props.symptoms};
    }

    componentDidMount(){
        this.setState({symptoms: this.props.symptoms})
    }

    handleChange = (event, data) => {
        this.props.handleUpdate(data.value);
    }

    render () {
        return (
            <Dropdown
                id={styles.dropdown}
                placeholder='Symptoms'
                fluid
                multiple
                search
                selection
                options={this.state.symptoms}
                onChange={this.handleChange}
            />
        )
    }
}

export default SymptomDropdown
