import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PersonalToken from './PersonalToken';
import FormErrors from './FormErrors';

export default class PersonalAccessTokens extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tokens: [],
            scopes: [],
            selectedScopes: [],
            newTokenName: '',
            accessToken: null,
            errors: null,
        };

        this.store = this.store.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.toggleScope = this.toggleScope.bind(this);
    }

    componentDidMount() {
        this.getTokens();
        this.getScopes();
    }


    /**
     * Syncs input change with component state
     * Allows form submission from state.
     */
    handleInput(event) {
        let filterScope = this.state.scopes;
        filterScope.filter((scope) => scope.id === event.target.id)
                    .map((scope) => scope.checked = true );

        this.setState(prevState => ({
            scopes: {
                ...prevState.scopes,
                filterScope
            }
        }));

        this.setState({ [event.target.name]: event.target.value });
        this.setState({ [event.target.name]: event.target.value });
    }


    /**
     * Syncs input change with component state
     * Allows form submission from state.
     */
    toggleScope(event) {
        if(event.target.checked) {
            let removeScope = this.state.selectedScopes.indexOf(event.target.id);
            removeScope ? removeScope.splice : null;
            this.setState({ selectedScopes: removeScope });
            console.log('checked');
        } else {
            if(!this.state.selectedScopes.includes(event.target.id)) {
                // this.setState({ selectedScopes: this.state.selectedScopes.concat({ id: event.target.id, description: event.target.id }) })
                this.setState({ selectedScopes: this.state.selectedScopes.concat(event.target.id) })
            }
        }
    }
    
    /**
     * Get all of the personal access tokens for the user.
     */
    getTokens() {
        axios.get('/oauth/personal-access-tokens')
                .then(response => {
                    this.setState({ tokens: response.data });
                });
    }

    /**
     * Get all of the available scopes.
     */
    getScopes() {
        axios.get('/oauth/scopes')
            .then(response => {
                this.setState({ scopes: response.data });
            });
    }

    /**
     * Show the form for creating new tokens.
     */
    showCreateTokenForm() {
        $('#modal-create-token').modal('show');
    }

    /**
     * Create a new personal access token.
     */
    store() {
        /**
         * Reset token and errors
         */
        this.setState({ accessToken: null });
        this.setState({ errors: [] });


        /**
         * Generate FORM data from state
         */
        // let newTokenForm = new FormData();
        // newTokenForm.set('name', this.state.newTokenName);
        // newTokenForm.set('scopes', this.state.selectedScopes);

        let newTokenForm = {
            name: this.state.newTokenName,
            scopes: this.state.selectedScopes
        };

        axios.post('/oauth/personal-access-tokens', newTokenForm)
                .then(response => {
                    this.setState({ 
                        newTokenName: '',
                        selectedScopes: [],
                        errors: [],
                        tokens: this.state.tokens.concat(response.data.token),
                    });

                    this.showAccessToken(response.data.accessToken);
                })
                .catch(error => {
                    console.log(error);
                    if ("response" in error) {
                        this.setState({ errors: error.response.data });
                        console.log(error.response.data);
                    } else {
                        this.setState({ errors: ['Something went wrong. Please try again.'] });
                    }
                });
    }

    /**
     * Show the given access token to the user.
     */
    showAccessToken(accessToken) {
        $('#modal-create-token').modal('hide');

        this.setState({ accessToken: accessToken });

        $('#modal-access-token').modal('show');
    }

    render() {
        const { tokens, scopes, selectedScopes, accessToken, errors } = this.state;
        const scopeLoop = scopes.map((scope, index) => <div key={scope.id} className="checkbox">
                                            <label>
                                                <input type="checkbox"
                                                    id={scope.id}
                                                    checked={ scope.checked ? true : false }
                                                    onChange={this.toggleScope} />
                                                    { scope.description }
                                            </label>
                                        </div>);
        let tokenLoop;
        if(tokens.length > 0) {
            tokenLoop = tokens.map((token) => <PersonalToken key={token.id} token={token} />);
        }
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>
                                Personal Access Tokens
                            </span>

                            <a className="action-link" onClick={this.showCreateTokenForm}>
                                Create New Token
                            </a>
                        </div>
                    </div>

                    <div className="panel-body">
                        {/* No Tokens Notice */}
                        {tokens.length === 0 ? (
                        <p className="m-b-none">
                            You have not created any personal access tokens.
                        </p>
                        ) : ''}

                        {/* Personal Access Tokens */}
                        <table className="table table-borderless m-b-none">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {tokenLoop ? tokenLoop : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

            <div className="modal fade" id="modal-create-token" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>

                            <h4 className="modal-title">
                                Create Token
                            </h4>
                        </div>

                        <div className="modal-body">
                            {/* Form Errors */}
                            { errors ? <FormErrors errors={errors} /> : '' }

                            {/* Create Token Form */}
                            <form className="form-horizontal" role="form">
                                {/* Name */}
                                <div className="form-group">
                                    <label className="col-md-4 control-label">Name</label>

                                    <div className="col-md-6">
                                        <input 
                                            id="create-token-name" 
                                            type="text" 
                                            className="form-control" 
                                            name="newTokenName"
                                            value={this.state.newTokenName}
                                            onChange={this.handleInput} 
                                        />
                                    </div>
                                </div>

                                {/* Scopes */}
                                <div className="form-group">
                                    <label className="col-md-4 control-label">Scopes</label>

                                    <div className="col-md-6">
                                            {scopeLoop ? scopeLoop : '' }
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Modal Actions */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>

                            <button type="button" className="btn btn-primary" onClick={this.store}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Access Token Modal */}
            <div className="modal fade" id="modal-access-token" tabIndex="-1" role="dialog">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>

                            <h4 className="modal-title">
                                Personal Access Token
                            </h4>
                        </div>

                        <div className="modal-body">
                            <p>
                                Here is your new personal access token. This is the only time it will be shown so don't lose it!
                                You may now use this token to make API requests.
                            </p>

                            <pre><code>{ accessToken }</code></pre>
                        </div>

                        {/* Modal Actions */}
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

if (document.getElementById('PersonalAccessTokens')) {
    ReactDOM.render(<PersonalAccessTokens />, document.getElementById('PersonalAccessTokens'));
}
