import React, {Component} from 'react';
import Button from "@material-ui/core/Button";
import {ProductAPI} from "./apis/ProductAPI";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCalculateClicked() {
    ProductAPI.getResult()
        .then((response) => {
          console.log(response);
        })
        .catch(error => {
          console.log(error.response);
        });

  }

  render() {
    return(
        <div>Hi
          <Button onClick={() => {this.handleCalculateClicked()}}>Calculate</Button>
        </div>

    );
  }
}

export default App;
