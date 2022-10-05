import React, {Component} from 'react';

class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedOptions: {}
    };

    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.findImage = this.findImage.bind(this);
  }

  componentWillMount() {
    this.props.product.options.forEach((selector) => {
      this.setState((prevState) => ({
        selectedOptions:{
          ...prevState.selectedOptions,
          [selector.name]: selector.values[0]
        }
      }));
    });
  }

  findImage(images, variantId) {
    const primary = images[0];

    const image = images.filter(function (image) {
      return image.variant_ids.includes(variantId);
    })[0];

    return (image || primary).src;
  }

  handleOptionChange(event) {
    const target = event.target
    let selectedOptions = this.state.selectedOptions;
    selectedOptions[target.name] = target.value;

    const selectedVariant = this.props.product.variants.edges.find((variant) => {
      return variant.node.selectedOptions.every((selectedOption) => {
        return selectedOptions[selectedOption.name] === selectedOption.value;
      });
    }).node;

    this.setState({
      selectedVariant: selectedVariant,
      selectedVariantImage: selectedVariant.image.src
    });
  }

  handleQuantityChange(event) {
    this.setState({
      selectedVariantQuantity: event.target.value
    });
  }

  myFunction() {
    this.props.classToggle()
  }
  render() {
    let variantImage = this.state.selectedVariantImage || this.props.product.images.edges[0].node.src
    let variant = this.state.selectedVariant || this.props.product.variants.edges[0].node
    let variantQuantity = this.state.selectedVariantQuantity || 1
   
    return (
      <div className="Product">
        <div className='Product-top-half'>
          {this.props.product.images.edges.length ? <img className='prod-img' src={variantImage} alt={`${this.props.product.title} product shot`}/> : null}
        </div>
        <div className='Product-bottom-half'>
          <h5 className="Product__title">{this.props.product.title}</h5>
          <span className="Product__price">${variant.price}</span>
          <button className="Product__buy button" onClick={() => { this.props.addVariantToCart(variant.id, variantQuantity); }  }>Add to Bundle</button>


        </div>
      </div>
    );
  }
}

export default Product;
