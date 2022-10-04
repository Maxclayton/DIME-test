import React, { Component } from 'react';
import Product from './components/Product';
import Cart from './components/Cart';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import {flowRight as compose} from 'lodash';
import gql from 'graphql-tag';
import {
  createCheckout,
  checkoutLineItemsAdd,
  checkoutLineItemsUpdate,
  checkoutLineItemsRemove,
  addVariantToCart,
  associateCustomerCheckout
} from './checkout';

import Discount from './components/Discount';

class App extends Component {
  constructor() {
    super();

    this.state = {
      isCartOpen: false,
      products: [],
      checkout: { lineItems: { edges: [] } }
    };

    this.addVariantToCart = addVariantToCart.bind(this);
    this.showAccountVerificationMessage = this.showAccountVerificationMessage.bind(this);
    this.associateCustomerCheckout = associateCustomerCheckout.bind(this);
  }

  componentWillMount() {
    this.props.createCheckout({
      variables: {
        input: {}
      }}).then((res) => {
      this.setState({
        checkout: res.data.checkoutCreate.checkout
      });
    });
  }

  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.object,
      shop: PropTypes.object,
    }).isRequired,
    createCheckout: PropTypes.func.isRequired,
    checkoutLineItemsAdd: PropTypes.func.isRequired,
    checkoutLineItemsUpdate: PropTypes.func.isRequired
  }

 


  showAccountVerificationMessage(){
    this.setState({ accountVerificationMessage: true });
    setTimeout(() => {
     this.setState({
       accountVerificationMessage: false
     })
   }, 5000);
  }



  render() {
    if (this.props.data.loading) {
      return <p>Loading ...</p>;
    }
    if (this.props.data.error) {
      return <p>{this.props.data.error.message}</p>;
    }

    return (
      <div className="App">
        <div className="Flash__message-wrapper">
          <p className={`Flash__message ${this.state.accountVerificationMessage ? 'Flash__message--open' : ''}`}>We have sent you an email, please click the link included to verify your email address</p>
        </div>
        <Discount />
        <div className="Product-wrapper">
          { this.props.data.shop.products.edges.map(product =>
            <Product className="My-product" addVariantToCart={this.addVariantToCart} checkout={this.state.checkout} key={product.node.id.toString()} product={product.node} />
          )}
        </div>
        
        <Cart
          removeLineItemInCart={this.removeLineItemInCart}
          updateLineItemInCart={this.updateLineItemInCart}
          checkout={this.state.checkout}
          isCartOpen={this.state.isCartOpen}
          handleCartClose={this.handleCartClose}
        />
    
      </div>
    );
  }
}

const query = gql`
  query query {
    shop {
      name
      description
      products(first:20) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            title
            options {
              id
              name
              values
            }
            variants(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                  title
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    src
                  }
                  price
                }
              }
            }
            images(first: 250) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  }
`;

const AppWithDataAndMutation = compose(
  graphql(query),
  graphql(createCheckout, {name: "createCheckout"}),
  graphql(checkoutLineItemsAdd, {name: "checkoutLineItemsAdd"}),
  graphql(checkoutLineItemsUpdate, {name: "checkoutLineItemsUpdate"}),
  graphql(checkoutLineItemsRemove, {name: "checkoutLineItemsRemove"}),
)(App);

export default AppWithDataAndMutation;
