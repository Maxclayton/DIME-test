import React, {Component} from 'react';

class Cart extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      close: true,
  };
  }

  classToggle = () => {
    this.setState({
        close: !this.state.close,
    });
};

  
  render() {
    const {close} = this.state;

    return (
     
        <div className='discount-container' id={close ? "show" : "hide"}  onClick={() => this.classToggle()}>
            <div className='discount-top' >
              
              <h2>  Add <span>$100 </span> to save <span>10%</span></h2>
            </div>
            <div className='discount-mid'>
                <div className='left-side'>
                    <h3>Bundle Price</h3>
                    <h4>$ {this.props.checkout.totalPrice < 100 ? this.props.checkout.totalPrice :  this.props.checkout.totalPrice - this.props.checkout.totalPrice / 10 }</h4>
                </div>
                <div className='right-side'>
                    <h3>Your Savings</h3>
                    <h4>$ {this.props.checkout.totalPrice < 100 ? 0 : this.props.checkout.totalPrice / 10}</h4>
                </div>
               
            </div>
            <div className='bottom'>
                    <div className='discount-bar'></div>
                    <div className='percent-container'>
                      <span><div className='line'></div>10%</span> <span><div className='line'></div>15%</span> <span><div className='line'></div>20%</span> <span><div className='line'></div>25%</span>
                    </div>


                </div>
        </div>
 
    )
  }
}

export default Cart;
