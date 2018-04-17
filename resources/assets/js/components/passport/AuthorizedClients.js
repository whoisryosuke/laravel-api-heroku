import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ClientToken from './ClientToken';

export default class AuthorizedClients extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tokens: [],
        };
    }

    componentDidMount() {
        this.getTokens();
    }

    getTokens() {
        axios.get('/oauth/tokens')
            .then(response => {
                this.setState({ tokens: response.data });
            });
    }

    render() {
        const { tokens } = this.state;
        const tokenLoop = tokens.map((token) => <ClientToken key={token.id} token={token} />);
        
        return (
            <div>
                <div className="panel panel-default">
                    <div className="panel-heading">Authorized Applications</div>

                    <div className="panel-body">
                        <table className="table table-borderless m-b-none">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Scopes</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                { tokenLoop ? tokenLoop : 'No authorized apps yet' }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

if (document.getElementById('AuthorizedClients')) {
    ReactDOM.render(<AuthorizedClients />, document.getElementById('AuthorizedClients'));
}
