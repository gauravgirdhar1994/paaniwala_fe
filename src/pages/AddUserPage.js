import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect } from 'react';
// @mui
import {
  Card,
  Stack,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import Iconify from '../components/iconify/Iconify';

export default function AddUserPage() {
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
        navigate('/dashboard/user', { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Helmet>
        <title> Add New User </title>
      </Helmet>

      <Container>
        <Card style={{ padding: 30 }}>
          <Stack direction="column" spacing={5}>
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="admin"
                name="radio-buttons-group"
                row
                onChange={(e) => setFormData((formData) => ({ ...formData, role: e.target.value }))}
              >
                <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                <FormControlLabel value="DM" control={<Radio />} label="Delivery Manager" />
              </RadioGroup>
            </FormControl>

            <TextField
              name="firstname"
              label="First Name"
              onChange={(e) => setFormData((formData) => ({ ...formData, firstname: e.target.value }))}
            />

            <TextField
              name="lastname"
              label="Last Name"
              onChange={(e) => setFormData((formData) => ({ ...formData, lastname: e.target.value }))}
            />

            <TextField
              name="email"
              label="Email address"
              onChange={(e) => setFormData((formData) => ({ ...formData, email: e.target.value }))}
            />

            {formData.role === 'customer' || formData.role === 'DM' ? (
              <TextField
                name="phone"
                label="Phone Number"
                onChange={(e) => setFormData((formData) => ({ ...formData, phone: e.target.value }))}
              />
            ) : (
              ''
            )}

            {formData.role === 'customer' ? (
              <TextField
                name="address"
                multiline
                rows="4"
                label="Address"
                onChange={(e) => setFormData((formData) => ({ ...formData, address: e.target.value }))}
              />
            ) : (
              ''
            )}

            <TextField
              name="password"
              label="Password"
              onChange={(e) => setFormData((formData) => ({ ...formData, password: e.target.value }))}
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
            Submit
          </LoadingButton>
        </Card>
      </Container>
    </>
  );
}
