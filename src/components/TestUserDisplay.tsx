import { User } from "../schemas";
import React from "react";
import TestUserDisplayUser from "./TestUserDisplayUser";
import CreateUserTest from "./CreateUserTest";
import UploadAvatarTest from "./UploadAvatarTest";

export interface TestUserDisplayProps {}

export interface TestUserDisplayState {
  users: User[];
}

class TestUserDisplay extends React.Component<
  TestUserDisplayProps,
  TestUserDisplayState
> {
  state = { users: [] };

  componentDidMount = () => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({
          users: data,
        });
      })
      .catch((err) => console.error(err));
  }

  render() {
    return (
      <div>
        <h2>Displays all the users on the database:</h2>
        <div style={{margin: '10px 10px'}}>
          {this.state.users.map((item: User) => (
            <TestUserDisplayUser user={item} deleteEvent={this.componentDidMount} />
          ))}
        </div>
        <CreateUserTest submitEvent={this.componentDidMount}/>
        <UploadAvatarTest />
      </div>
    );
  }
}

export default TestUserDisplay;
