import React, { Component } from 'react';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import web3 from '../../../ethereum/web3';
import campaign from '../../../ethereum/campaign';
import { Router, Link } from '../../../routes';

class RequestNew extends Component {

    state = {
        description: '',
        value: '',
        recipient: '',
        loading: false,
        errorMessage: '',
        errorOccurred: false
    }

    static async getInitialProps(props) {
        return { address: props.query.address }
    }

    onSubmit = async (event) => {
        event.preventDefault();

        const instance = campaign(this.props.address);
        const { description, value, recipient } = this.state;

        this.setState({ loading: true });

        try {
            const accounts = await web3.eth.getAccounts();
            await instance.methods
                .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
                .send({ from: accounts[0] });

            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({
                errorOccurred: true,
                errorMessage: err.message
            })
        }

        this.setState({ 
            loading: false,
            errorMessage: '',
            errorOccurred: false
        });
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>Back</a>
                </Link>
                <Form onSubmit={this.onSubmit} error={this.state.errorOccurred}>
                    <Form.Field>
                        <label>Description</label>
                        <Input 
                            value={this.state.description}
                            onChange={(event) => 
                                this.setState({ description: event.target.value })}
                        />
                    </Form.Field>
                    < Form.Field >
                        <label>Value in Ether</label>
                        <Input
                            value = {this.state.value}
                            onChange = {(event) =>
                                this.setState({value: event.target.value})}
                        />
                    </Form.Field>
                    <Form.Field >
                        <label>Recipient Address</label>
                        <Input
                            value = {this.state.recipient}
                            onChange = {(event) =>
                                this.setState({ recipient: event.target.value })}
                        /> 
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage}/>
                    <Button primary loading={this.state.loading}>Submit</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;