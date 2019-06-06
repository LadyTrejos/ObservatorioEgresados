import React from "react";
import "antd/dist/antd.css";
import { Input, Tooltip } from "antd";


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
    const {onBlur } = this.props;
    
    if (onBlur) {
      onBlur();
    }
  };

  render() {
    const { value } = this.props;
    const title = value ? ('') : (
      "Ingresar número"
    );
    return (
      <Tooltip
        trigger={["focus"]}
        title={title}
        placement="topLeft"
        overlayClassName="numeric-input"
      >
        <Input
          {...this.props}
          onChange={this.onChange}
          onBlur={this.onBlur}
          placeholder="Ej: 123456789"
          maxLength={25}
        />
      </Tooltip>
    );
  }
}


export default NumericInput;
