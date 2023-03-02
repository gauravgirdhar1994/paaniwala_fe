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

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});

  const handleClick = () => {

    const config = {
      method: 'post',
      url: 'https://paaniwala-be.onrender.com/api/auth/signup',
      headers: {
        'Content-Type': 'application/json',
      },
      data: formData,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        navigate('/dashboard', { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Stack spacing={3}>
        <TextField name="firstname" label="First Name" onChange={(e) => setFormData(formData => ({...formData, firstname: e.target.value}))} />

        <TextField name="lastname" label="Last Name" onChange={(e) => setFormData(formData => ({...formData, lastname: e.target.value}))} />
       
        <TextField name="email" label="Email address" onChange={(e) => setFormData(formData => ({...formData, email: e.target.value}))} />

        <TextField
          name="password"
          label="Password"
          onChange={(e) => setFormData(formData => ({...formData, password: e.target.value}))}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick}>
        Login
      </LoadingButton>
    </>
  );
}
