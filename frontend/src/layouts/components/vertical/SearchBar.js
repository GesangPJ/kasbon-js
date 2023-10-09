// SearchBar.js
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Magnify from 'mdi-material-ui/Magnify';
import { Link } from 'next/link';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState({ obatGenerik: [], obatHerbal: [] })

  useEffect(() => {
    const sendSearchRequest = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/search/${searchTerm}`)
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.error('Error fetching search results');
        }
      } catch (error) {
        console.error('Error sending search request:', error)
      }
    }
    if (searchTerm.trim() !== '') {
      sendSearchRequest();
    } else {
      setSearchResults({ obatGenerik: [], obatHerbal: [] })
    }
  }, [searchTerm])

  return (
    <div>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="small"
        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Magnify fontSize="small" />
            </InputAdornment>
          ),
        }}
      />
      <div>
        {searchResults.obatGenerik.map((result) => (
          <Link key={result.namaObat} href={`/detail-obat-generik?namaObat=${result.namaObat}`} passHref>
            <a>{result.namaObat}</a>
          </Link>
        ))}
        {searchResults.obatHerbal.map((result) => (
          <Link key={result.namaObat} href={`/detail-obat-herbal?namaObat=${result.namaObat}`} passHref>
            <a>{result.namaObat}</a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SearchBar
