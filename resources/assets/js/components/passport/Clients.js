import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import ClientList from './ClientList';
import FormErrors from './FormErrors';


export default class Clients extends Component {

    constructor(props) {
        super(props);
        this.state = {
            clients: [],
            errors: [],
            clientName: '',
            clientRedirect: '',
        }

        this.store = this.store.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        this.getClients();
    }


    /**
     * Syncs input change with component state
     * Allows form submission from state.
     */
    handleInput(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    /**
     * Get all of the OAuth clients for the user.
     */
    getClients() {
        axios.get('/oauth/clients')
            .then(response => {
                this.setState({ clients: response.data });
            });
    }

    /**
     * Show the form for creating new clients.
     */
    showCreateClientForm() {
         $('#modal-create-client').modal('show');
    }

    /**
     * Create a new OAuth client for the user.
     */
    store(event) {
        console.log('creating new client');
        let form = new FormData();
        form.set('name', this.state.clientName);
        form.set('redirect', this.state.clientRedirect);

        this.persistClient(
            'post', '/oauth/clients',
            form, '#modal-create-client'
        );
        event.preventDefault();
    }

    /**
     * Persist the client to storage using the given form.
     */
    persistClient(method, uri, form, modal) {
        form.errors = [];

        axios[method](uri, form)
            .then(response => {
                this.getClients();

                form.name = '';
                form.redirect = '';
                form.errors = [];

                $(modal).modal('hide');
            })
            .catch(error => {
                if (typeof error.response.data === 'object') {
                    //form.errors = _.flatten(_.toArray(error.response.data));
                    form.errors = error.response.data;
                    console.log(error.response.data);
                } else {
                    form.errors = ['Something went wrong. Please try again.'];
                }
            });
    }

    render() {
        let { clients, errors } = this.state;
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                            <span>
                                OAuth Clients
                            </span>

                            <a className="action-link" onClick={this.showCreateClientForm}>
                                Create New Client
                            </a>
                        </div>
                    </div>

                    <div className="panel-body">
                        {/* Current Clients 
                            Count clients, if zero, show this*/}
                        {clients.length <= 0 ? (
                        <p className="m-b-none">
                            You have not created any OAuth clients.
                        </p>) : ''}


                        {/* Count clients, if NOT zero, show this */}
                        
                        {clients.length > 0 ? (                            
                            <ClientList clients={clients} />
                        ) : ''}
                    </div>
                </div>

                {/*  Create Client Modal */}
                <div className="modal fade" id="modal-create-client" tabIndex="-1" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>

                                <h4 className="modal-title">
                                    Create Client
                                </h4>
                            </div>

                            <div className="modal-body">
                                {/*  Form Errors */}
                                { errors ? <FormErrors errors={errors} /> : ''}


                                {/*  Create Client Form */}
                                <form className="form-horizontal" role="form" onSubmit={this.store}>
                                    {/*  Name */}
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Name</label>

                                        <div className="col-md-7">
                                            <input 
                                                id="create-client-name" 
                                                name="clientName" 
                                                type="text" 
                                                className="form-control" 
                                                value={this.state.clientName} 
                                                onChange={this.handleInput} 
                                            />

                                            <span className="help-block">
                                                Something your users will recognize and trust.
                                            </span>
                                        </div>
                                    </div>

                                    {/*  Redirect URL */}
                                    <div className="form-group">
                                        <label className="col-md-3 control-label">Redirect URL</label>

                                        <div className="col-md-7">

                                            <input
                                                name="clientRedirect"
                                                type="text"
                                                className="form-control"
                                                value={this.state.clientRedirect}
                                                onChange={this.handleInput}
                                            />

                                            <span className="help-block">
                                                Your application's authorization callback URL.
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {/*  Modal Actions */}
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>

                                <button type="button" className="btn btn-primary" onClick={this.store}>
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

if (document.getElementById('clients')) {
    ReactDOM.render(<Clients />, document.getElementById('clients'));
}
