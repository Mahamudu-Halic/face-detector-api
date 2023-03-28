export const handleRegister = (db, bcrypt) => (req, res) => {
    const { name, email, password } = req.body
    const hash = bcrypt.hashSync(password)
    if(name && password && email){
        db.transaction(trx => {
            trx.insert({
                email: email,
                hash: hash
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                trx('users')
                .returning('*')
                .insert({
                    email: email,
                    name: name,
                    joined: new Date()
                })
                .then(response => {
                    res.json(response[0])
                })
            })

            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            res.status(400).json("email already exist")
        })
    }
    else{
        res.status(400).json("fill all the blanks")
    }
}