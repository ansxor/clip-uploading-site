import React, { ChangeEvent, FormEvent } from "react";
import { User } from "../schemas";

export interface CreateUserTestProps {
  submitEvent?: Function;
}

export interface CreateUserTestState {
  username: string;
  password: string;
}

class CreateUserTest extends React.Component<
  CreateUserTestProps,
  CreateUserTestState
> {
  state = { username: "", password: "" };
  constructor(props: CreateUserTestProps) {
    super(props);
    this.submitUserInfo = this.submitUserInfo.bind(this);
    this.handleUsernameInput = this.handleUsernameInput.bind(this);
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
  }

  handleUsernameInput(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value });
  }

  handlePasswordInput(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }


  private submitUserInfo(event: FormEvent<HTMLFormElement>) {
    let { username, password } = this.state;
    if (username !== "" && password !== "") {
      const formData = new URLSearchParams()
      formData.append("username", username)
      formData.append("password", password)
      fetch(`/api/register?${formData.toString()}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((registeredUser: User) => {
          console.log(registeredUser);
        })
        .catch((err) => console.error(err));
    } else {
      console.log("there's no username????");
    }
    if (this.props.submitEvent) {
      this.props.submitEvent();
    }
    this.setState({username: "", password: ""})

    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submitUserInfo}>
          <label>
            Username:
            <input type="text" value={this.state.username} onChange={this.handleUsernameInput} />
          </label>
          <label>
            Password:
            <input type="text" value={this.state.password} onChange={this.handlePasswordInput} />
          </label>
         <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default CreateUserTest;
