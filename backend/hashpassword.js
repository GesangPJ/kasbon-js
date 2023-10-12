const bcrypt = require('bcrypt')

// Passwordnya
const password = 'your_password_here'

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