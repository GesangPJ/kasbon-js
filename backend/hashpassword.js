const bcrypt = require('bcrypt')

// Passwordnya
const password = '12345678'

// Hash the password
bcrypt.genSalt(10, (err, salt) => {
    if (err) {
        console.error(err)
        return
    }

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
            console.error(err)
            return
        }
        console.log('Hashed Password:', hash)
    })
})