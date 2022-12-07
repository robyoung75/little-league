import React from 'react';
import './UserSignIn.css'
import SignIn from '../../Components/Forms/SignIn'


function UserSignIn({setSignedIn, setAuthenticated}) {
  return (
    <div className='userSignIn'><SignIn setSignedIn={setSignedIn} setAuthenticated={setAuthenticated}/></div>
  )
}

export default UserSignIn