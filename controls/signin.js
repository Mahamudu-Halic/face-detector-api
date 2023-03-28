export const handleSignin = (db, bcrypt) => (req, res) => {
    const {email, password } = req.body
    db.select('hash', 'email').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if(isValid){
            db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user)
            })
            .catch(err => res.status(400).json('unable to get user'))
        }
        else{
            res.status(400).json('wrong credentials')
        }
    })
    .catch(err => res.status(400).json('wrong credentials '))
}