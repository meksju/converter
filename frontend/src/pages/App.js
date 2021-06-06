import React from 'react';
import {Button, Col, Container, FormControl, Form, Row, InputGroup} from 'react-bootstrap'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faRetweet, faCoins} from "@fortawesome/free-solid-svg-icons";
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import axios from "axios";
import { Typeahead } from 'react-bootstrap-typeahead';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currency_give: [],
            give_selected: '',
            given_amount: null,
            currency_get: [],
            get_selected: '',
            received_amount: null,
            currencies: [],
            page: 0,
            limit: 20
        };
        this.setCurrencyList = this.setCurrencyList.bind(this);
        this.setSelectedCurrency = this.setSelectedCurrency.bind(this);
        this.convert = this.convert.bind(this);
    }

    getCurrencies() {
        axios.get(`http://localhost:8001/`).then(response => {
            if (response.data.data.length > 0) {
                this.setState({currencies: response.data.data});
            } else {
                console.error(response.data.data);
            }
        })
    }

    setCurrencyList(curr, number) {
        if (curr.length > 1) {
            axios.get(`http://localhost:8001/currency?curr=${curr}`).then((res) => {
                switch (number) {
                    case 1:
                        this.setState({currency_give: res.data});
                        break;
                    case 2:
                        this.setState({currency_get: res.data});
                        break;
                    default:
                        break;
                }
            });
        }
    }

    setSelectedCurrency(curr, number) {
                switch (number) {
                    case 1:
                        this.setState({give_selected: curr});
                        break;
                    case 2:
                        this.setState({get_selected: curr});
                        break;
                    default:
                        break;
                }
    }

    changeValue(e) {
        let amount = e.target.value;
        if (amount > 0) {
            this.setState({
                given_amount: amount
            });
        }
    }

    convert(){
        if(this.state.give_selected.length > 0 && this.state.get_selected.length > 0 && this.state.given_amount){
            axios.get(`http://localhost:8001/convertation?&amount=${this.state.given_amount}&give_rate=${this.state.give_selected[0].rate}&get_rate=${this.state.get_selected[0].rate}`).then((res) => {
                this.setState({received_amount: res.data});
            });
        }
    }

    componentDidMount() {
        this.getCurrencies();
    }

    render() {
        let data = this.state.currencies;
        const columns = [
            {dataField: 'code', text: 'Code', sort: true},
            {dataField: 'name', text: 'Currency', sort: true},
            {dataField: 'rate', text: 'Rate', sort: true}
        ];
        const defaultSorted = [{
            dataField: 'name',
            order: 'desc'
        }];
        const pagination = paginationFactory({
            page: 1,
            sizePerPage: 10,
            lastPageText: '>>',
            firstPageText: '<<',
            nextPageText: '>',
            prePageText: '<',
            showTotal: true,
            alwaysShowAllBtns: true
        });
        return (
            <Container>
                <header>
                    <p>Currency Converter<span><FontAwesomeIcon icon={faCoins}/></span></p>
                    <hr/>
                </header>
                <Form>
                    <Row className={'justify-content-md-center'}>
                        <Col xs sm md lg="3">
                            <Form.Group >
                                <Typeahead
                                    id="basic-typeahead-single"
                                    labelKey={option => `${option.name} ${option.code}`}
                                    onInputChange={curr => this.setCurrencyList(curr, 1)}
                                    onChange={curr => this.setSelectedCurrency(curr, 1)}
                                    options={this.state.currency_give || []}
                                    placeholder="Input currency name or code..."
                                    selected={this.state.give_selected}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs sm md lg="2">
                            <InputGroup className="mb-2">
                                <FormControl aria-label="Amount (to the nearest dollar)"
                                             type="number"
                                             onChange={e => this.changeValue(e)}
                                             value={this.state.given_amount}
                                             placeholder="Specify amount"/>
                            </InputGroup>
                        </Col>
                        <Col xs sm md lg="1">
                            <Button variant="outline-primary" className="swap" onClick={this.convert}><FontAwesomeIcon
                                icon={faRetweet}/></Button>
                        </Col>
                        <Col xs sm md lg="3">
                            <Form.Group>
                                <Typeahead
                                    id="basic-typeahead-single"
                                    labelKey={option => `${option.name} ${option.code}`}
                                    onInputChange={curr => this.setCurrencyList(curr, 2)}
                                    onChange={curr => this.setSelectedCurrency(curr, 2)}
                                    options={this.state.currency_get || []}
                                    placeholder="Input currency name or code..."
                                    selected={this.state.get_selected}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs sm md lg='2'>
                            <InputGroup className="mb-2">
                                <FormControl disabled
                                             aria-label="Amount (to the nearest dollar)"
                                             type="number"
                                             value={this.state.received_amount}/>
                            </InputGroup>
                        </Col>
                    </Row>
                </Form>
                <BootstrapTable striped bordered keyField='id' data={data} columns={columns}
                                defaultSorted={defaultSorted}
                                pagination={pagination}/>
            </Container>
        )
    }
}
export default App;