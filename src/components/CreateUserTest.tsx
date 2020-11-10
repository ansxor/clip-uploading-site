import React from "react";
import TestUserDisplay from "./TestUserDisplay";
import { User } from "../schemas";

export interface CreateUserTestProps {}

export interface CreateUserTestState {}

class CreateUserTest extends React.Component<
  CreateUserTestProps,
  CreateUserTestState
> {
  usernameInput: React.RefObject<HTMLInputElement>;
  avatarFileInput: React.RefObject<HTMLInputElement>;
  outputTextarea: React.RefObject<HTMLTextAreaElement>;

  constructor(props: CreateUserTestProps) {
    super(props);
    this.submitUserInfo = this.submitUserInfo.bind(this);
    this.usernameInput = React.createRef<HTMLInputElement>();
    this.avatarFileInput = React.createRef<HTMLInputElement>();
    this.outputTextarea = React.createRef<HTMLTextAreaElement>();
  }

  submitUserInfo() {
    if (this.usernameInput.current) {
      let newUser: User = {
        username: this.usernameInput.current!.value,
        avatarURL: "avatar/default.png",
      };
      fetch("/registeruser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })
        .then((res) => this.outputTextarea.current!.value += res)
        .catch((err) => this.outputTextarea.current!.value += err)
    }
  }

  render() {
    return (
      <>
        <form onSubmit={this.submitUserInfo}>
          <label>
            Username:
            <input type="text" ref={this.usernameInput} />
          </label>
          <br />
          <label>
            Avatar:
            <input type="file" ref={this.avatarFileInput} />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <textarea readOnly ref={this.outputTextarea}></textarea>
        <TestUserDisplay />
      </>
    );
  }
}

export default CreateUserTest;
