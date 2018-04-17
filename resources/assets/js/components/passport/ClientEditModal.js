import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class ClientEditModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            errors: props.errors,
            id: props.id,
            name: props.name,
            redirect: props.redirect,
            modalRef: '#modal-edit-client' + props.id,
        };

        this.handleInput = this.handleInput.bind(this);
        this.update = this.update.bind(this);
    }

    /**
     * Update the client being edited.
     */
    update() {
        console.log('updating client data');
        let { name, redirect, id, modalRef } = this.state;

        const formUpdate = {
            name: name,
            redirect: redirect,
        };

        this.persistClient(
            'put', '/oauth/clients/' + id,
            formUpdate, modalRef
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
                // Ideally we'd use Redux and refresh the state
                //this.getClients();

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

    /**
     * Syncs input change with component state
     * Allows form submission from state.
     */
    handleInput(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    componentDidUpdate() {
        $(this.state.modalRef).modal('show');        
    }

    componentDidMount() {
        $(this.state.modalRef).modal('show');        
    }

    render() {
        let { errors } = this.state;
        let modalName = 'modal-edit-client' + this.state.id;
        return(
            <div className="modal fade" id={ modalName } tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>

                            <h4 className="modal-title">
                                Edit Client
                            </h4>
                        </div>

                        <div className="modal-body">
                            {/*  Form Errors */}
                            {errors ? (
                                <div className="alert alert-danger" v-if="createForm.errors.length > 0">
                                    <p><strong>Whoops!</strong> Something went wrong!</p>
                                    <br />
                                    <ul>
                                        <li v-for="error in createForm.errors">
                                            {errors}
                                        </li>
                                    </ul>
                                </div>) : ''}

                            {/*  Edit Client Form */}
                            <form className="form-horizontal" role="form" onSubmit={this.store}>
                                {/*  Name */}
                                <div className="form-group">
                                    <label className="col-md-3 control-label">Name</label>

                                    <div className="col-md-7">
                                        <input 
                                            id="edit-client-name" name="name" 
                                            type="text" 
                                            className="form-control" 
                                            onChange={this.handleInput}
                                            value={this.state.name} 
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
                                            type="text" 
                                            className="form-control" 
                                            name="redirect" 
                                            onChange={this.handleInput} 
                                            value={this.state.redirect} 
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

                            <button type="button" className="btn btn-primary" onClick={this.update}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}