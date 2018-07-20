import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import campaign from '../../../ethereum/campaign';
import Layout from '../../../components/Layout'
import { Link } from '../../../routes';
import RequestRow from '../../../components/RequestRow';

class RequestIndexPage extends Component {

    static async getInitialProps(props) {
        const address = props.query.address;
        const instance = campaign(address);
        const requestCount = await instance.methods.getRequestCount().call();
        const approversCount = await instance.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount))
                .fill()
                .map((element, index) => {
                    return instance.methods.requests(index).call();
                })
        );

        return { address, requests, approversCount, requestCount };
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return (
                <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount = {this.props.approversCount}
                />);
        });
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>
                            Add Requests
                        </Button>
                    </a>
                </Link>
                <Table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell>Amount</Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>ApprovalCount</Table.HeaderCell>
                            <Table.HeaderCell>Approve</Table.HeaderCell>
                            <Table.HeaderCell>Reject</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.renderRows()}
                    </Table.Body>
                </Table>
                <div>Found {this.props.requestCount} requests.</div>
            </Layout>
        );
    }
}

export default RequestIndexPage;