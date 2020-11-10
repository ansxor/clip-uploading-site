import React from "react";
import { UserRegister, User } from "../schemas";

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
    if (this.usernameInput.current!.value !== "") {
      let newUser: UserRegister = {
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
        .then(res => res.json())
        .then((registeredUser: User) => {
          console.log(registeredUser) 
          if (this.avatarFileInput.current!.files !== null) {
            let formData = new FormData()
            formData.append('image', this.avatarFileInput.current!.files![0])
            fetch('/uploadavatar', {
              method: 'POST',
              body: formData 
            })
            .then(res => res.json())
            .then((data: any) => {
              console.log(data.name)
              registeredUser.avatarURL = data.name
              fetch('/updateuser', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(registeredUser)
              })
                .then(res => console.log(res))
                .catch(err => {console.log(':(');console.error(err)}) 
            })
            .catch(err => console.error(err)) 
          }
          else
            console.log('no avatar available')
        })
        .catch((err) => console.error(err))
    }
    else {
      console.log("there's no username????")
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
      </>
    );
  }
}

export default CreateUserTest;
