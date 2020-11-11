import React, { FormEvent } from "react";

export interface UploadAvatarTestProps {
    submitEvent?: Function
}

export interface UploadAvatarTestState {
  userID: string
}

class UploadAvatarTest extends React.Component<
  UploadAvatarTestProps,
  UploadAvatarTestState
> {
  private avatarFileInput: React.RefObject<HTMLInputElement>;
  state = { userID: "" };

  constructor(props: UploadAvatarTestProps) {
    super(props);
    this.avatarFileInput = React.createRef<HTMLInputElement>();
    this.onChangeUserID = this.onChangeUserID.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private onChangeUserID(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      userID: event.target.value
    })
  }

  private handleSubmit(event: FormEvent) {
    event.preventDefault();
    let a = this.avatarFileInput;
    if (a.current !== undefined && a.current?.files !== undefined) {
      const form = event.target as HTMLFormElement;
      console.log(form)
      const formData = new FormData()
      formData.append('image', this.avatarFileInput.current!.files![0])
      formData.append('id', this.state.userID) 
      fetch('api/uploadavatar', {
          method: 'POST',
          body: formData
      })
        .then(res => console.log(res))
        .catch(err => console.error(err))
      if (this.props.submitEvent !== undefined) {
        this.props.submitEvent()
      } 
      this.avatarFileInput.current!.value = '';
      this.setState({userID: ''})
    }
  }

  render () {
    console.log(this.state.userID)
    return (
      <form onSubmit={this.handleSubmit} action="/api/uploadavatar" method="POST" style={{margin: "2em"}}>
        <label>
          Avatar Upload
          <br/>
          <input type="file" name="image" ref={this.avatarFileInput} />
        </label>
        <br/>
        <label>
            User ID:
            <br/>
            <input type="text" name="userid" value={this.state.userID} onChange={this.onChangeUserID} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default UploadAvatarTest;
