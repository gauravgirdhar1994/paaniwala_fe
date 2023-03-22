import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import axios from 'axios';
import Iconify from '../../../components/iconify';


// ----------------------------------------------------------------------

export default function RegisterForm() {
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({});
  const [otpResponse, setOtpResponse] = useState({});
  const [errMsg, setErrMsg] = useState('');

  const verifyOtp = () => {
    const data = JSON.stringify({
      "method": "sms",
      "sms": {
        "code": formData.verificationOtp
      }
    });
    
    const config = {
      method: 'put',
      url: otpResponse?._links && otpResponse?._links[1].href,
      headers: { 
        'Authorization': 'Basic N2VjMjg1N2UtYzhiNy00NTEwLWIzNjUtMzEyNzI3MmQ2ZDBlOnU1QlZUYkZoazBDSEkwK1JOc3JRSEE9PQ==', 
        'Content-Type': 'application/json'
      },
      data
    };
    
    axios(config)
    .then((response) => {
      if(response.data.status === 'SUCCESSFUL'){
        const data = JSON.stringify({
          "phone": formData.phoneNumber,
          "firstname": formData.firstname,
          "lastname": formData.lastname,
          "role": "admin"
        });
        
        const config = {
          method: 'post',
          url: 'https://paaniwala-be.onrender.com/api/auth/signup',
          headers: { 
            'Content-Type': 'application/json'
          },
          data
        };
        
        axios(config)
        .then((response) => {
          window.sessionStorage.setItem('userData', JSON.stringify(response.data.data));
          navigate('/dashboard', { replace: true });
        })
        .catch((error) => {
          console.log(error);
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  const handleClick = async() => {
    const config = {
      method: 'post',
      url: 'https://paaniwala-be.onrender.com/api/auth/send-otp',
      headers: {
        'Content-Type': 'application/json',
      },
      data: formData,
    };

    await axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        setOtpResponse(response.data);
        setShowOtp(true);
      })
      .catch((error) => {
        console.log(error);
        setErrMsg(error.message);
      });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="firstname" label="First Name" onChange={(e) => setFormData(formData => ({...formData, firstname: e.target.value}))} />

        <TextField name="lastname" label="Last Name" onChange={(e) => setFormData(formData => ({...formData, lastname: e.target.value}))} />
       
        <TextField
          name="phoneNumber"
          label="Phone Number"
          onChange={(e) => setFormData((formData) => ({ ...formData, phoneNumber: e.target.value }))}
        />

        {showOtp && <TextField name="verificationOtp" label="Enter OTP" onChange={(e) => setFormData((formData) => ({ ...formData, verificationOtp: e.target.value}))}/>}

      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={(formData.verificationOtp === undefined || formData?.verificationOtp?.length < 3) ? handleClick : verifyOtp}>
        Sign Up
      </LoadingButton>
    </>
  );
}
