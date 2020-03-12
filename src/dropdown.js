import React, { Component } from 'react';
import { Dropdown } from 'semantic-ui-react'
/** @jsx React.DOM */

// 'use strict';

// const e = React.createElement;

class Countries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      countries: [],
      colours: {}
    };
  }

  componentDidMount() {
    this.setState({
      countries: [
        {id: 'AFG', name: 'Afghanistan'},
        {id: 'ALA', name: 'Åland Islands'},
        {id: 'ALB', name: 'Albania'}
      ]
    });
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render () {
    const { countries } = this.state;

    let countriesList = countries.length > 0
    	&& countries.map((item, i) => {
      return (
        //   'option',
        //   {key: i},
        //   {value: item.id},
        //   `${item.name}`
        <option key={i} value={item.id}>{item.name}</option>
      )
    }, this);

    return (
        // 'select',
        // {class: 'ui fluid search dropdown'},
        // {multiple: ''},
        // `${countriesList}`
        <form onSubmit={this.handleSubmit}>
            <label>
            Select your symptoms:
                <select class="ui fluid search dropdown" multiple="">
                {countriesList}
                </select>
            </label>
            <input type="submit" value="Submit" />
        </form>
    );
  }
}

// export default Countries;

// const domContainer = document.querySelector('#dropdown_component');
// ReactDOM.render(e(Countries), domContainer);

ReactDOM.render(
    <Countries />,
    document.getElementById('dropdown_component')
);