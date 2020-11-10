import { User } from '../schemas'
import React from 'react'

export interface TestUserDisplayUserProps {
    user: User,
    deleteEvent?: Function
}
 
export interface TestUserDisplayUserState {
    
}
 
class TestUserDisplayUser extends React.Component<TestUserDisplayUserProps, TestUserDisplayUserState> {
    constructor(props: TestUserDisplayUserProps) {
        super(props)
        this.deleteUser = this.deleteUser.bind(this)
    }

    private deleteUser(event: React.MouseEvent<HTMLButtonElement>) {
        fetch('/api/user', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.props.user)
        })
            .then(res => console.log(res))
            .catch(err => console.error(err))
        if (this.props.deleteEvent !== undefined) {
            this.props.deleteEvent()
        }
    }

    render() { 
        const { id, avatarURL, username } = this.props.user;
        return ( 
            <li key={id}> 
                <img src={avatarURL} alt="Avatar" style={{width: 32, height: 'auto'}}/> 
                {username} - {id}
                <button onClick={this.deleteUser}>Delete User</button>
            </li>
         );
    }
}
 
export default TestUserDisplayUser;