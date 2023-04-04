import React from "react";
import ErrorFallback from "./ErrorFallback";


export default class ErrorBoundary extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log(`error, errorInfo: ${error}, ${errorInfo}`);
  }

  componentDidUpdate(prevState){
    const { error } = this.state;
    if(prevState.error !== null || error === null) {
      return;
    }

    this.setState({
      hasError: false,
      error: null
    })
  }

  reset() {
    this.setState({
      hasError: false,
      error: null
    });
    window.history.back();
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback
          error={this.state.error}
          resetKeys={this.state.error}
          reset={this.reset.bind(this)}/>
    }

    return this.props.children;
  }
}