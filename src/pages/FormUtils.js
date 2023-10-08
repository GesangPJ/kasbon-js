// FormUtils.js

// Berisi fungsi2 yang digunakan pada form

// Fungsi lihat password

export const handleClickShowPassword = () => {
  setShowPassword(!showPassword)
}

export const handleMouseDownPassword = (event) => {
  event.preventDefault()
}

// Vaidasi ID Petugas (Admin)
const handleidpetugasChange = (e) => {
  const inputValue = e.target.value

  // Use a regular expression to allow only numbers and letters
  if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
    setidpetugas(inputValue)
  } else {
    // Display an error message or prevent input, depending on your preference
    setErrorMessage('ID hanya boleh huruf dan angka!')
    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }
}

//Validasi Nama
const handlenamaChange = (e) => {
  const inputValue = e.target.value

  // Use a regular expression to allow only numbers and letters
  if (/^[a-zA-Z0-9]*$/.test(inputValue)) {
    setnama(inputValue)
  } else {
    // Display an error message or prevent input, depending on your preference
    setErrorMessage('Nama hanya boleh huruf dan angka!')
    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }
}

// Handle passowrd dan email
export const handlepasswordChange = (e) => setpassword(e.target.value)

export const handleemailChange = (e) => setemail(e.target.value)

// Validasi input Jumlah

export const handlejumlahChange = (e) => {
  const inputValue = e.target.value;

  // Use regular expression to allow only numbers
  if (/^\d*$/.test(inputValue)) {
    setjumlah(inputValue);
  } else {
    // Display an error message or prevent input, depending on your preference
    setErrorMessage('Hanya boleh angka pada input nilai!');
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  }
};
