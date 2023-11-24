const express = require('express');
const mongoose = require('mongoose');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const UserModel = require('./models/userModel');
const checkAuth = require('./middleware/checkAuth');

const app = express();

app.use(express.json());

app.use(cors())


app.post('/auth/register', async (req, res) => {
    try {
        const {fullName, email, password} = req.body;
        console.log(req.body)

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel(
            {
                fullName,
                email,
                passwordHash: hash
            }
        );

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._doc._id
            },
            'secret123',
            {
                expiresIn: '1h'
            }
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            token,
            userData
        });

    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: 'Ошибка регистрации'
        });
    }
});

app.post('/auth/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await UserModel.findOne({email});

        if (!user) {
            return res.status(404).json({
                message: 'Не совпадает email'
            });
        }

        const validPassword = await bcrypt.compare(password, user._doc.passwordHash);

        if (!validPassword) {
            return res.status(404).json({
                messgae: 'Не совпадает пароль'
            });
        }

        const token = jwt.sign(
            {
                _id: user._doc._id
            },
            'secret123',
            {
                expiresIn: '1h'
            }
        );

        const {passwordHash, ...userData} = user._doc;

        res.json({
            token,
            userData
        });

    } catch (err) {
        console.log(err);
        res.status(401).json({
            message: 'Ошибка авторизации'
        });
    }
});

app.get('/auth/me', checkAuth, async (req, res) => {
    const user = await UserModel.findById(req.body.userId);

    if (!user) {
        return res.status(404).json({
            message: 'Такой пользователь не найден'
        });
    }

    res.json({
        user
    })
});

try{
    mongoose.connect('mongodb+srv://pg15182100:secret123@cluster0.hmkg0ym.mongodb.net/data?retryWrites=true&w=majority')
        .then(() => {
            app.listen(3002, () => {
                console.log('DB OK!, Server OK!');
            });
        })
} catch (err) {
    console.log(err);
}