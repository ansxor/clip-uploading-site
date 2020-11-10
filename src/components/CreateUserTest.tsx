import React, { ChangeEvent, FormEvent } from "react";
import { UserRegister, User } from "../schemas";

export interface CreateUserTestProps {
  submitEvent?: Function;
}

export interface CreateUserTestState {
  username: string;
}

class CreateUserTest extends React.Component<
  CreateUserTestProps,
  CreateUserTestState
> {
  state = { username: "" };
  constructor(props: CreateUserTestProps) {
    super(props);
    this.submitUserInfo = this.submitUserInfo.bind(this);
    this.handleUsernameInput = this.handleUsernameInput.bind(this);
  }

  handleUsernameInput(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value });
  }

  private submitUserInfo(event: FormEvent<HTMLFormElement>) {
    let { username } = this.state;
    if (username !== "") {
      let newUser: UserRegister = {
        username: username,
        avatarURL: "avatar/default.png",
      };
      fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
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
    this.setState({username: ""})

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
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default CreateUserTest;
