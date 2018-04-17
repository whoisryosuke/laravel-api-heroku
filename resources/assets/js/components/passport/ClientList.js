import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ClientRow from './ClientRow';

export default class ClientList extends Component {
    render() {
        const clients = this.props.clients;
        const clientList = clients.map((data) => <ClientRow key={data.id} client={data} />);
        return (
            <table className="table table-borderless m-b-none">
                <thead>
                    <tr>
                        <th>Client ID</th>
                        <th>Name</th>
                        <th>Secret</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    { clientList }
                </tbody>
            </table>
        );
    }
}