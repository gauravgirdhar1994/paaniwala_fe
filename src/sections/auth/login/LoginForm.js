import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox } from '@mui/material';
import Alert from '@mui/material/Alert';
import { LoadingButton } from '@mui/lab';
// components
import axios from 'axios';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false);
  const [formData, setFormData] = useState({});
  const [otpResponse, setOtpResponse] = useState({});
  const [errMsg, setErrMsg] = useState('');

  formData.userRole = 'admin';

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
          "phoneNumber": formData.phoneNumber,
          "userRole": "admin"
        });
        
        const config = {
          method: 'post',
          url: 'https://paaniwala-be.onrender.com/api/auth/signin',
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
        {errMsg && (
          <Alert variant="filled" severity="error" sx={{ width: '100%' }}>
            {errMsg}
          </Alert>
        )}
        <TextField
          name="phoneNumber"
          label="Phone Number"
          onChange={(e) => setFormData((formData) => ({ ...formData, phoneNumber: e.target.value }))}
        />

        {showOtp && <TextField name="verificationOtp" label="Enter OTP" onChange={(e) => setFormData((formData) => ({ ...formData, verificationOtp: e.target.value}))}/>}

      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={(formData.verificationOtp === undefined || formData?.verificationOtp?.length < 3) ? handleClick : verifyOtp}>
        {(formData.verificationOtp === undefined || formData?.verificationOtp?.length < 3) ? 'Send OTP' : 'Login'}
      </LoadingButton>
    </>
  );
}
