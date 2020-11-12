import React, { ChangeEvent, FormEvent } from "react";

export interface TestUserLoginProps {}

export interface TestUserLoginState {
  token: string;
  uid: string;
  username: string;
  avatarURL: string;
}

class TestUserLogin extends React.Component<
  TestUserLoginProps,
  TestUserLoginState
> {
  state = { token: "", uid: "", avatarURL: "", username: "" };

  constructor(props: TestUserLoginProps) {
    super(props);
    this.loginUser = this.loginUser.bind(this);
    this.onUidChange = this.onUidChange.bind(this);
  }

  private onUidChange(event: ChangeEvent<HTMLInputElement>) {
    this.setState({ uid: event.target.value });
  }

  private loginUser(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let { uid } = this.state;
    if (uid !== "") {
      const formData = new URLSearchParams();
      formData.append("id", uid);
      fetch(`/api/login?${formData.toString()}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ token: data.token });
          fetch("/api/self", {
            headers: new Headers({
              Authorization: `Bearer ${this.state.token}`,
            }),
          })
            .then((res) => res.json())
            .then((doc) => {
              this.setState({
                username: doc.username,
                avatarURL: doc.avatarURL,
              });
            })
            .catch(err => console.error(err));
        })
        .catch((err) => console.error(err));
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.loginUser}>
          <label>
            ID:
            <input
              type="text"
              value={this.state.uid}
              onChange={this.onUidChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <div>{this.state.token}</div>
        <div>
          My User:
          <br />
          <img src={this.state.avatarURL} alt="" style={{width: "32px", height: "auto"}}/>
          {this.state.username}
        </div>
      </div>
    );
  }
}

export default TestUserLogin;
