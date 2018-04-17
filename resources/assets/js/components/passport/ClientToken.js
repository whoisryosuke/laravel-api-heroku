import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class AuthorizedClients extends Component {

    constructor(props) {
        super(props);

        this.state = {
            token: props.token,
        };
    }

    /**
     * Revoke the given token.
     */
    revoke(token) {
        axios.delete('/oauth/tokens/' + token.id)
            .then(response => {
                this.getTokens();
            });
    }


    render() {
        const { token } = this.state;
        return (
                <tr>
                    <td style={{verticalAlign: 'middle'}}>
                        { token.client.name }
                    </td>

                    <td style={{verticalAlign: 'middle'}}>
                        <span>
                            { token.scopes.length > 0 ? token.scopes.join(', ') : '' }
                        </span>
                    </td>

                    <td style={{verticalAlign: 'middle'}}>
                        <a className="action-link text-danger" onClick={this.revoke}>
                            Revoke
                        </a>
                    </td>
                </tr>
        )
    }
}