import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import FormLabel from '@material-ui/core/FormLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import deepOrange from '@material-ui/core/colors/deepOrange';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {ProductAPI} from "./apis/ProductAPI";

const defaultFontColor = '#fc5800';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            totalPrice: '',
            selectedProduct: {id: '', name: ''},
            buyAs: 'cartons',
            quantity: 0,
            priceList: [],
            view: 'priceCalculator'
        };
        this.handleChangeProductName = this.handleChangeProductName.bind(this);
        this.handleBuyAsChanged = this.handleBuyAsChanged.bind(this);
        this.handleViewChanged = this.handleViewChanged.bind(this);
        this.handleChangeQuantity = this.handleChangeQuantity.bind(this);
    }

    componentDidMount() {
        ProductAPI.getItems()
            .then((response) => {
                this.setState({products: response.data});
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    handleCalculateClicked() {
        let singleUnits = 0;
        let cartons = 0;

        let quantity = this.state.quantity;
        if (this.state.buyAs === 'cartons') {
            cartons = quantity;
        } else {
            singleUnits = quantity;
        }

        ProductAPI.getPrice(this.state.selectedProduct.id, singleUnits, cartons, false)
            .then((response) => {
                console.log(response);
                this.setState({totalPrice: response.data});
            })
            .catch(error => {
                console.log(error.response);
            });
    }

    handleChangeProductName(event) {
        let selectedProduct = this.state.products.find(el => el.name === event.target.value);
        this.setState({selectedProduct: selectedProduct, totalPrice: '', quantity: 0});
        console.log(selectedProduct);

        if (this.state.view === 'priceTable') {
            ProductAPI.getPrice(selectedProduct.id, 0, 0, true)
                .then((response) => {
                    console.log(response);
                    this.setState({priceList: response.data})
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
    }

    handleBuyAsChanged(event) {
        console.log(event.target.value);
        this.setState({buyAs: event.target.value});
    }

    handleViewChanged(event) {
        let newView = event.target.value;
        console.log(newView);
        this.setState({view: newView});

        if ((newView === 'priceTable') && this.state.selectedProduct.id !== '') {
            ProductAPI.getPrice(this.state.selectedProduct.id, 0, 0, true)
                .then((response) => {
                    console.log(response);
                    this.setState({priceList: response.data})
                })
                .catch(error => {
                    console.log(error.response);
                });
        }
    }

    handleChangeQuantity(event) {
        this.setState({quantity: event.target.value});
    }

    render() {
        const theme = createMuiTheme({
            palette: {
                type: 'dark',
                primary: deepOrange
            },
            typography: {
                fontFamily: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                ]
            },
        });

        return (
            <MuiThemeProvider theme={theme}>
                <Card style={{width: '98%', marginBottom: 15}}>
                    <CardContent>
                        <div>
                            <div style={{width: 500, display: 'inline-block', float: 'left'}}>
                                <br/>
                                <FormControl>
                                    <InputLabel>Product</InputLabel>
                                    <Select
                                        value={this.state.selectedProduct.name}
                                        onChange={this.handleChangeProductName}
                                        style={{minWidth: 350}}
                                        displayEmpty
                                        inputProps={{
                                            name: 'productName',
                                            id: 'productNameSelect',
                                        }}
                                    >
                                        {this.state.products.map(item => (
                                            <MenuItem key={item.id} value={item.name}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{display: 'inline-block', width: 650}}>
                                <br/>
                                <FormLabel component="legend">View</FormLabel>
                                <RadioGroup aria-label="view" name="view" value={this.state.view}
                                            onChange={this.handleViewChanged}>
                                    <FormControlLabel value="priceCalculator" control={<Radio/>}
                                                      label="Price Calculator"/>
                                    <FormControlLabel value="priceTable" control={<Radio/>}
                                                      label="Price Table"/>
                                </RadioGroup>
                                <br/><br/>
                            </div>
                        </div>
                        {(this.state.view === 'priceCalculator') ?
                            (<div>
                                <div style={{width: 500, display: 'inline-block', float: 'left'}}>
                                    <br/><br/><br/>
                                    <FormControl>
                                        <FormLabel component="legend">Buy as</FormLabel>
                                        <RadioGroup aria-label="buyAs" name="buyAs" value={this.state.buyAs}
                                                    onChange={this.handleBuyAsChanged}>
                                            <FormControlLabel value="cartons" control={<Radio/>} label="Cartons"/>
                                            <FormControlLabel value="singleUnits" control={<Radio/>}
                                                              label="Single Units"/>
                                        </RadioGroup>
                                        <br/><br/>
                                        <TextField
                                            id="quantity"
                                            label="Quantity" variant="outlined"
                                            value={this.state.quantity}
                                            onChange={this.handleChangeQuantity}
                                            style={{minWidth: 100, color: defaultFontColor}}
                                        />
                                        <br/><br/>
                                        <Button
                                            style={{
                                                color: '#ffffff', border: 0, borderRadius: 3,
                                                background: defaultFontColor, height: 35
                                            }}
                                            onClick={() => {
                                                this.handleCalculateClicked();
                                            }}>
                                            CALCULATE
                                        </Button>
                                        <br/>
                                    </FormControl>
                                    <br/><br/>

                                </div>
                                <div style={{display: 'inline-block', width: 650}}>
                                    <br/><br/><br/>
                                    <span style={{color: defaultFontColor, fontSize: 25}}>Product ID: </span>
                                    <span style={{fontSize: 25}}>{this.state.selectedProduct.id}</span><br/><br/><br/>

                                    <span style={{color: defaultFontColor, fontSize: 25}}>Carton Price: </span>
                                    <span
                                        style={{fontSize: 25}}>{this.state.selectedProduct.cartonPrice}</span><br/><br/><br/>

                                    <span style={{color: defaultFontColor, fontSize: 25}}>Units Per Carton: </span>
                                    <span
                                        style={{fontSize: 25}}>{this.state.selectedProduct.unitsPerCarton}</span><br/><br/><br/>

                                    <span style={{color: defaultFontColor, fontSize: 70}}>Total: </span>
                                    <span style={{fontSize: 60}}>{this.state.totalPrice}</span><br/><br/><br/>

                                    <br/>
                                </div>
                            </div>) :
                            (<Table aria-label="price table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Quantity</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Object.entries(this.state.priceList).map(([key, value]) =>
                                        <TableRow>
                                            <TableCell component="th" scope="row">
                                                {key}
                                            </TableCell>
                                            <TableCell>{value}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>)
                        }
                    </CardContent>
                </Card>
            </MuiThemeProvider>
        );
    }
}

export default App;
