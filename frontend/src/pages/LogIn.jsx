import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

const Verify_Credentials = async (navigate) => {
  const email = document.getElementById("email_input").value;
  const password = document.getElementById("password_input").value;

  const loginData = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch('http://localhost:5555/users/signin', { // Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Login Failed: ', data);
      alert('Login Failed: ' + (data.message || 'Unknown error'));
    } else {
      console.log('Login Successful: ', data);
      localStorage.setItem('jwt', data.token); // Save JWT for future authenticated requests
      alert('Login Successful');
      navigate('/home'); // Navigate to the home page
    }
  } catch (error) {
    console.error('Fetch Error: ', error);
    alert('An unexpected error occurred');
  }
};

const LogIn = ({ setOpen }) => {
  const navigate = useNavigate();

  return (
    <div className="login-Container">
      <div className="login-Wrapper">
        <div className="login-Close" onClick={() => setOpen(false)}>X</div>
        <h1 className="login-Title">LogIn</h1>
        <div className="login-Details">
          <div className="login-InputContainer">
            <input className="login-Input" type="text" placeholder="Enter your email ID" id="email_input" />
          </div>
          <div className="login-InputContainer">
            <input className="login-Input" type="password" placeholder="Enter your password" id="password_input" />
          </div>
        </div>
        <button onClick={() => Verify_Credentials(navigate)}>Submit</button>
      </div>
    </div>
  );
};

export default LogIn;
