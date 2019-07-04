import React from "react";
import "antd/dist/antd.css";
import { Input } from "antd";



class NumericInput extends React.Component {
  onChange = e => {
    const { value } = e.target;
    const reg = /^[0-9]{0,10}$/
    if (
      (!Number.isNaN(value) && reg.test(value))) {
      this.props.onChange(value);
    }
  };

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    return (
        <Input
          {...this.props}
          onChange={this.onChange}
          onBlur={this.onBlur}
          maxLength={25}
        />
    );
  }
}


export default NumericInput;
