import React from "react";
import "antd/dist/antd.css";
import { Input } from "antd";



class NumericInput extends React.Component {
  onChange = e => {
    const { value } = e.target;
    const reg = /^[0-9]*$/;
    if (
      (!Number.isNaN(value) && reg.test(value))) {
      this.props.onChange(value);
    }
  };

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    if (value.charAt(value.length - 1) === "." || value === "-") {
      onChange(value.slice(0, -1));
    }
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value } = this.props;
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
