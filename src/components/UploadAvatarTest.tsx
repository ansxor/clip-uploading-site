import React, { FormEvent } from "react";

export interface UploadAvatarTestProps {
    submitEvent?: Function
}

export interface UploadAvatarTestState {}

class UploadAvatarTest extends React.Component<
  UploadAvatarTestProps,
  UploadAvatarTestState
> {
  avatarFileInput: React.RefObject<HTMLInputElement>;

  constructor(props: UploadAvatarTestProps) {
    super(props);
    this.avatarFileInput = React.createRef<HTMLInputElement>();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  private handleSubmit(event: FormEvent) {
    event.preventDefault();
    let a = this.avatarFileInput;
    if (a.current !== undefined && a.current?.files !== undefined) {
      const form = event.target as HTMLFormElement;
      fetch(form.action, {
          method: form.method,
          body: new URLSearchParams([...(new FormData(form) as any)])
      })
        .then(res => console.log(res))
        .catch(err => console.error(err))
    }
  }

  render() {
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
            <input type="text" name="userid" />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default UploadAvatarTest;
