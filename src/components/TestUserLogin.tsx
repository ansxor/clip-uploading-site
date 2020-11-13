import React, { ChangeEvent, FormEvent } from "react";

export interface TestUserLoginProps {}

export interface TestUserLoginState {
  displayName: string;
  token: string;
  username: string;
  avatarURL: string;
  password: string;
}

class TestUserLogin extends React.Component<
  TestUserLoginProps,
  TestUserLoginState
> {
  state = { token: "", displayName: "", avatarURL: "", username: "", password: "" };

  constructor(props: TestUserLoginProps) {
    super(props);
    this.loginUser = this.loginUser.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  private onUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value });
  }

  private onPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value });
  }

  private loginUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let { username, password } = this.state;
    if (username !== "" && password !== "") {
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);
      fetch(`/api/login?${formData.toString()}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ token: data.token });
          localStorage.setItem("token", data.token);
          fetch("/api/self", {
            headers: new Headers({
              Authorization: `Bearer ${this.state.token}`,
            }),
          })
            .then((res) => res.json())
            .then((doc) => {
              this.setState({
                displayName: doc.username,
                avatarURL: doc.avatarURL,
              });
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  }

  componentDidMount = () => {
    const token = localStorage.getItem("token");
    if (token !== undefined) {
      this.setState({ token: token! });
      fetch("/api/self", {
        headers: new Headers({
          Authorization: `Bearer ${token!}`,
        }),
      })
        .then((res) => res.json())
        .then((doc) => {
          this.setState({
            username: doc.username,
            avatarURL: doc.avatarURL,
          });
        })
        .catch((err) => console.error(err));
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.loginUser}>
          <label>
            Username:
            <input
              name="username"
              type="text"
              value={this.state.username}
              onChange={this.onUsernameChange}
            />
          </label>
          <label>
            Password:
            <input
              name="password"
              type="password"
              value={this.state.password}
              onChange={this.onPasswordChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div>
          My User:
          <br />
          <img
            src={this.state.avatarURL}
            alt=""
            style={{ width: "32px", height: "auto" }}
          />
          {this.state.displayName}
        </div>
      </div>
    );
  }
}

export default TestUserLogin;
