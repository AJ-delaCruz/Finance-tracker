import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../config';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


import { AuthContext } from '../../contextApi/AuthContext';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();


  const { currentUser, login } = useContext(AuthContext); //access the shared state
  // console.log('login current user: ' + currentUser);
  const handleLogin = async (e) => {
    e.preventDefault();


    try {
      const response = await axios.post(`${backendUrl}/user/login`, {
        username,
        password,
      });
      // console.log(response.data);


      const { token } = response.data;
      const decoded = jwt_decode(token);
      console.log(decoded.username);


      await login(token); //set token in local storage and context state
      // Save in local storage
      // localStorage.setItem("token", token);
      // localStorage.setItem("user_id", decoded._id);
      // localStorage.setItem("username", decoded.username);


      // Navigate to home page
      // navigate('/');
    } catch (error) {
      console.error(error);
      //set the error message
      setErrorMessage(error.response.data.message);
    }
  };


  //navigate to the homepage ('/') when the currentUser state is updated
  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);


  return (
    <div className='register-box'>
      <div className='form'>
        <div className='register-header'>
          <h3>Login here</h3>
        </div>
        <form onSubmit={handleLogin} className='register-form'>
          <TextField
            id='outlined-basic'
            label='Username'
            // placeholder='username'
            variant='outlined'
            autoComplete='username'
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


          <Button type='submit' variant='contained'>
            Login
          </Button>
        </form>
        {errorMessage && <p>{errorMessage}</p>}


        <div className='button-container'>
          <span>Don't have an account?</span>
          <Link to="/register">
            <Button type='submit' variant='contained' color="secondary">Register</Button>
          </Link>
        </div>
      </div>


    </div>
  );
};


export default Login;


