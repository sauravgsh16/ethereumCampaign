import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import campaign from '../ethereum/campaign';

class ContributeForm extends Component {
    state = {
        contribution: '',
        errorOccurred: false,
        errorMessage: '',
        loading: false
    }

    onSubmit = async (event) => {
        event.preventDefault();

        this.setState({
            loading: true,
            errorOccurred: false,
            errorMessage: ''
        });

        const instance = campaign(this.props.address);
        try {
        
        const accounts = await web3.eth.getAccounts();
        await instance.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei(this.state.contribution)
            });
        } catch (err) {
            this.setState({
                errorOccurred: true,
                errorMessage: err.message
            });
        }
        this.setState({ loading: false });
    }

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={this.state.errorOccurred}>
                <Form.Field>
                    <label>Amount to Contribute</label>
                    <Input
                        label='ether'
                        labelPosition='right'
                        value={this.state.contribution}
                        onChange={event => 
                            this.setState({ contribution: event.target.value })}
                    />
                </Form.Field>
                <Message error header='Oops!!' content={this.state.errorMessage} />
                <Button type="Submit" loading={this.state.loading} primary>
                    Contribute
                </Button>
            </Form>
        );
    }
}


export default ContributeForm;