import React from 'react';
import './UserSignIn.css'
import SignIn from '../../Components/Forms/SignIn'


function UserSignIn({setSignedIn}) {
  return (
    <div className='userSignIn'><SignIn setSignedIn={setSignedIn} /></div>
  )
}

export default UserSignIn