import { User } from '../schemas'
import React from 'react'

export interface TestUserDisplayUserProps {
    user: User
}
 
export interface TestUserDisplayUserState {
    
}
 
class TestUserDisplayUser extends React.Component<TestUserDisplayUserProps, TestUserDisplayUserState> {
    render() { 
        const { _id, avatarURL, username } = this.props.user;
        return ( 
            <li key={_id}> 
                <img src={avatarURL} alt="Avatar" style={{width: 32, height: 'auto'}}/> 
                {username}
            </li>
         );
    }
}
 
export default TestUserDisplayUser;