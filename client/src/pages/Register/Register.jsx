import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../../config';


import { useNavigate } from 'react-router-dom';
import './Register.scss';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/user/register`, {
        username,
        password,
      });
      console.log(response.data.message);


      // Navigate to login page after registration
      navigate('/login');
    } catch (error) {
      console.error(error);
      //set the error message
      setErrorMessage(error.response.data.message);
    }
  };


  return (
    <div className='register-box'>

      <div className='form'>
        <div className='register-header'>
          <h3>Sign up here</h3>
        </div>


        <form onSubmit={handleSignUp} className='register-form'>
          <TextField
            id='outlined-basic'
            label='Username'
            variant='outlined'
            autoFocus
            required
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            id='outlined-password-input'
            label='Password'
            type='password'
            required
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />


          <Button variant='contained'>Sign Up</Button>
          {errorMessage && <p>{errorMessage}</p>}
        </form>

        <div className='button-container'>
          <span>Already have an account?</span>
          <Link to='/login'>
            <Button type='submit' variant='contained' color="secondary">Login</Button>
          </Link>
        </div>

      </div>




    </div>

  );
};


export default Register;


