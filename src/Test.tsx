import React from "react";

interface TestProps {
  example: string;
}

class Test extends React.Component<TestProps> {
  render() {
    return (
      <div>
        <h2>{this.props.example}</h2>
        <p>Hello, World!</p>
      </div>
    );
  }
}

export { Test as default };
