import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class PersonalToken extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            token: props.token,
        }
    }

    /**
     * Revoke the given token.
     */
    revoke(token) {
        axios.delete('/oauth/personal-access-tokens/' + token.id)
            .then(response => {
                // Ideally we'd use Redux to refresh token state
                // this.getTokens();
            });
    }

    render() {
        const { token } = this.state;
        return (
            <tr>
                {/* Client Name */}
                <td style={{ verticalAlign: 'middle' }}>
                    {token.name}
                </td>

                {/* Delete Button */}
                <td style={{verticalAlign: 'middle'}}>
                    <a className="action-link text-danger" onClick={this.revoke(token)}>
                        Delete
                    </a>
                </td>
            </tr>
        );
    }
}