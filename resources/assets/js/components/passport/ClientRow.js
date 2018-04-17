import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ClientEditModal from './ClientEditModal';

export default class ClientRow extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            id: '',
            name: '',
            redirect: '',
            modal: false,
        }
    }

    /**
     * Edit the given client.
     */
    edit(client) {
        this.setState({ 
            id: client.id,
            name: client.name,
            redirect: client.redirect,
            modal: true,
        });
    }

    /**
     * Destroy the given client.
     */
    delete(client) {
        axios.delete('/oauth/clients/' + client.id)
            .then(response => {
                // this.getClients();
                console.log(response);  
                console.log('deleted');  
            });
    }

    render() {
        const client = this.props.client;
        return (
                <tr>
                    <td style={{verticalAlign: 'middle'}}>
                        { client.id }
                    </td>

                    <td style={{verticalAlign: 'middle'}}>
                        { client.name }
                    </td>

                    <td style={{verticalAlign: 'middle'}}>
                        <code>{ client.secret }</code>
                    </td>

                    <td style={{verticalAlign: 'middle'}}>
                        <a className="action-link" onClick={() => { this.edit(client)}}>
                            Edit
                        </a>
                    </td>

                    <td style={{verticalAlign: 'middle'}}>
                        <a className="action-link text-danger" onClick={() => { this.delete(client)}}>
                            Delete
                        </a>
                        {this.state.id != '' ? (
                            <ClientEditModal
                                id={this.state.id}
                                name={this.state.name} 
                                redirect={this.state.redirect}
                                show={this.state.modal} 
                            />
                        ) : ''}
                    </td>
                </tr>
        );
    }
}