import React from "react";
import { connect } from "react-redux";
import { getProducts } from "../store/action";

class ProductList extends React.Component {
  componentDidMount() {
      this.props.dispatch(getProducts())
  }

  render() {
    const { error, loading, products } = this.props;

    if (error) {
      return <div>Error! {error.message}</div>;
    }

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <ul>
        {products.map(product =>
          <li key={product.id}>{product.name}</li>
        )}
      </ul>
    );
  }
}

const mapStateToProps = state => ({
  products: state.products.items,
  loading: state.products.loading,
  error: state.products.error
});

export default connect(mapStateToProps)(ProductList);
