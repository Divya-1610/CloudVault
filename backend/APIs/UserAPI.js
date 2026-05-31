import exp from 'express'
import bcrypt from 'bcrypt'
import { UserModel } from '../models/UserModel.js'
import { loginAuthentication, logoutUserSession } from '../services/authentication.js'

export const userApp = exp.Router()


// get all users
userApp.get('/users', async (req, res) => {
    try {
        let users = await UserModel.find()
        if (users && users.length > 0)
            return res.status(200).json({ message: "users list :", payload: users })
        else
            return res.status(404).json({ message: "No users found" })
    }
    catch (err) {
        return res.status(500).json({ message: "Error occurred", error: err.message })
    }
})

// add user
userApp.post('/user', async (req, res) => {
    try {
        let newuser = req.body
        let user = new UserModel(newuser)
        
        // Hash password before saving
        user.password = await bcrypt.hash(user.password, 6)
        await user.save()

        const usersaved = user.toObject()
        delete usersaved.password
        delete usersaved._id
        delete usersaved.isActive

        return res.status(201).json({ message: "user created!!", payload: usersaved })
    }
    catch (err) {
        console.log(err);
        if (err.name === "ValidationError") {
            const schemaErrors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: schemaErrors });
        }
        if (err.code === 11000) {
            const duplicateField = Object.keys(err.keyValue)[0];
            return res.status(400).json({ message: [`That ${duplicateField} is already registered!`] });
        }
        return res.status(500).json({ message: [err.message] });
    }
})

// update

userApp.put('/update/:id', async (req, res) => {
    try {
        let updateData = { ...req.body }

        if (updateData.password && updateData.password.trim() !== '') {
            updateData.password = await bcrypt.hash(updateData.password, 6)
        } else {
            delete updateData.password 
        }

        let modifieduser = await UserModel.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData },
            { new: true, runValidators: true } 
        )

        if (modifieduser) {
            const userResponse = modifieduser.toObject()
            delete userResponse.password

            return res.status(200).json({ message: "user updated", payload: userResponse })
        } else {
            return res.status(404).json({ message: "user not found" })
        }
    }
    catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: Object.values(err.errors).map(e => e.message) });
        }
        return res.status(400).json({ message: err.message })
    }
})

// hard delete
userApp.delete('/:id', async (req, res) => {
    try {
        let deletedUser = await UserModel.findByIdAndDelete(req.params.id)
        if (deletedUser) {
           return res.status(200).json({ message: "user deleted", payload: deletedUser }) 
        } else {
            return res.status(404).json({ message: "user not found" })
        }
    }
    catch (err) {
        return res.status(400).json({ message: "error occurred", error: err.message })
    }
})

// soft delete
userApp.patch('/userdelres/:id', async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.id)
        
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        const activestatus = !user.isActive
        const mes = activestatus ? "user restored!!!" : "user deleted!!!"

        await UserModel.findByIdAndUpdate(
            req.params.id, 
            { isActive: activestatus },
            { new: true, runValidators: true }
        )

        return res.status(200).json({ message: mes })
    }
    catch (err) {
        return res.status(400).json({ message: "error occurred", error: err.message })
    }
})

//login
userApp.post('/login', loginAuthentication)

//logout 
userApp.post('/logout', logoutUserSession)
