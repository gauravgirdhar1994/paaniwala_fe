import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useState, useEffect, useRef } from 'react';
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
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import Iconify from '../components/iconify/Iconify';

export default function AddProductPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState('');
  const [formData, setFormData] = useState(new FormData());

  const uploadInputRef = useRef(null);

  const handleClick = () => {

    const config = {
      method: 'post',
      url: 'https://paaniwala-be.onrender.com/api/product/create',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    };

    axios(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        navigate('/dashboard/products', { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const uploadFile = () => {
    const formData = new FormData();
    formData.append('file', file); // appending file
  };

  return (
    <>
      <Helmet>
        <title> Add New Product </title>
      </Helmet>

      <Container>
        <Card style={{ padding: 30 }}>
          <Stack direction="column" spacing={5}>
            <TextField
              name="productTitle"
              label="Product Title"
              onChange={(e) => setFormData((formData) => ({ ...formData, productTitle: e.target.value }))}
            />

            <TextField
              name="productDescription"
              multiline
              rows={3}
              label="Product Description"
              onChange={(e) => setFormData((formData) => ({ ...formData, productDescription: e.target.value }))}
            />

            {/* <TextField
              name="color"
              label="Color"
              onChange={(e) => setFormData((formData) => ({ ...formData, color: e.target.value }))}
            /> */}

            <TextField
              name="size"
              label="Size"
              onChange={(e) => setFormData((formData) => ({ ...formData, size: e.target.value }))}
            />

            <TextField
              name="quantity"
              label="Quantity"
              onChange={(e) => setFormData((formData) => ({ ...formData, quantity: e.target.value }))}
            />

            <Button
              variant="contained"
              onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
              component="label"
            >
              Upload Product Image
              <input
                type="file"
                hidden
                ref={uploadInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => setFormData((formData) => ({ ...formData, file: e.target.files[0] }))}
              />
            </Button>
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
