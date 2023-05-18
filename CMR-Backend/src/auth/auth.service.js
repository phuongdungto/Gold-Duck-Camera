const connectDB = require('../core/database.js');
const db = require('../models/index');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { BadRequest, NotFound } = require('http-errors');
const saltRounds = 10;
const dotenv = require('dotenv');
const { sendMail } = require('../core/utils/send-email.utils');
dotenv.config();
const otpGenerator = require('otp-generator');
const { randomBytes } = require('crypto');
const crypto = require('crypto');
const { TokenType } = require('../core/constant');
const { Op } = require("sequelize");

async function signup(body) {
    const checkExist = await db.User.findOne({
        where: { email: body.email }
    });
    if (checkExist) throw new BadRequest('Email already existed');

    const salt = await bcrypt.genSalt(saltRounds)
    const hashPwd = await bcrypt.hash(body.password, salt);

    const user = await db.User.create({
        ...body,
        hashedPassword: hashPwd,
        role: 'customer',
        verify: '0'
    })
    delete hashPwd;
    delete user.dataValues.hashedPassword;
    const newOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const otpLink = `${process.env.WEB_OTP_URL}/${user.email}`;

    const verifyToken = {
        userId: user.id,
        token: crypto.createHash('sha256').update(newOTP).digest('hex'),
        expiredAt: new Date(Date.now() + +process.env.EXPIRED_VERIFY_ACCOUNT_TOKEN),
        type: TokenType.SIGNUP
    };
    await db.Token.create(verifyToken);

    sendMail({
        email: user.email,
        subject: "Goldduck Camera - Confirm Account",
        template: 'send-otp',
        context: { newOTP, otpLink }
    }).catch(error => console.log(error));
    return user;
}

async function comfirmAccount(req) {
    const user = await db.User.findOne({
        where: { email: req.email }
    })
    if (!user) throw new NotFound('User not found');
    const otpHash = crypto.createHash('sha256').update(req.otp.toString()).digest('hex');
    const confirmToken = await db.Token.findOne({
        where: {
            userId: user.id,
            token: otpHash,
            expiredAt: { [Op.gte]: (new Date()) },
            type: TokenType.SIGNUP
        }
    })
    if (!confirmToken) throw new BadRequest('Invalid link or expired');
    user.verify = 1;
    await user.save();
    await db.Token.destroy({
        where: {
            userId: user.id,
            type: TokenType.SIGNUP
        }
    });
}

async function signin(body) {
    const checkExist = await db.User.findOne({
        where: { email: body.email }
    });

    if (!checkExist) throw new Unauthorized('Email or password is incorrect');

    const iPwd = bcrypt.compare(body.password, checkExist.hashedPassword);

    if (!iPwd) throw new Unauthorized('Email or password is incorrect');

    const accessToken = jwt.sign(
        { id: checkExist.id, email: checkExist.email, role: checkExist.role },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE }
    )

    const { ...newUser } = checkExist;
    delete newUser.dataValues.hashedPassword
    return { information: newUser.dataValues, accessToken };
}

async function forgotPassword(body) {
    const user = await db.User.findOne({
        where: { email: body.email }
    })
    if (!user) throw new NotFound('User with given email does not exist');
    let token = await db.Token.findOne({
        where: {
            userId: user.id,
            expiredAt: { [Op.gte]: new Date() },
        }
    })
    if (!token) {
        token = await db.Token.create({
            userId: user.id,
            token: randomBytes(32).toString("hex"),
            expiredAt: new Date(Date.now() + +process.env.EXPIRED_RESET_PASSWORD_TOKEN),
            type: TokenType.FORGOT_PASSWORD
        })
    }
    const resetPasswordLink = `${process.env.WEB_FORGOT_PASSWORD_URL}/${user.id}/${token.token}`;
    sendMail({
        email: user.email,
        subject: "Goldduck Camera - Password reset",
        template: 'reset-password',
        context: { resetPasswordLink }
    }).catch(error => console.log(error));
}

async function resetPassword(body) {
    const user = await db.User.findOne({
        where: { id: body.id }
    });
    if (!user) {
        throw new NotFound('User not Found');
    }
    const token = await db.Token.findOne({
        userId: user.id,
        token: body.token,
        expiredAt: { [Op.gte]: new Date() },
        type: TokenType.FORGOT_PASSWORD
    })
    if (!token) throw new BadRequest('Invalid link or expired');
    const salt = await bcrypt.genSalt(saltRounds)
    const hashPwd = await bcrypt.hash(body.password, salt);
    user.hashedPassword = hashPwd;
    await user.save();
    await db.Token.destroy({
        userId: user.id,
        type: TokenType.FORGOT_PASSWORD
    });
}

async function loginWithGg(req) {
    const userGg = req._json;
    let userExist = await db.User.findOne({
        where: { email: userGg.email },
        attributes: ['address', 'birthday', 'createdAt', 'deletedAt', 'updatedAt', 'email', 'fullname', 'gender', 'id', 'numberPhone', 'role']
    })
    if (userExist) {
        userExist = userExist.dataValues;
    }
    if (!userExist) {
        userExist = {
            fullname: userGg.name,
            email: userGg.email,
            hashedPassword: '',
            role: 'customer',
            verify: 1
        }
        userExist = await db.User.create({
            ...userExist
        })
        userExist = userExist.dataValues;
    }
    const payload = { id: userExist.id, email: userExist.email, role: userExist.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRE });
    const { hashedPassword, ...information } = userExist;
    return { information, accessToken };
}

async function resendOTP(body) {
    const user = await db.User.findOne({
        where: { email: body.email }
    })
    if (!user) throw new NotFound('User not found');
    if (user.verify === 1) throw new BadRequest('User comfirmed');
    const newOTP = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
    const verifyToken = {
        userId: user.id,
        token: crypto.createHash('sha256').update(newOTP).digest('hex'),
        expiredAt: new Date(Date.now() + +process.env.EXPIRED_VERIFY_ACCOUNT_TOKEN),
        type: TokenType.SIGNUP
    };
    let currentToken = await db.Token.findOne({
        where: {
            userId: user.id,
            type: TokenType.SIGNUP
        }
    });
    if (!currentToken) {
        throw new BadRequest('Verified account');
    }
    await currentToken.destroy();
    await db.Token.create(verifyToken);
    sendMail({
        email: user.email,
        subject: "Goldduck Camera - Confirm Account",
        template: 'send-otp',
        context: { newOTP }
    }).catch(error => console.log(error));
}

module.exports = {
    signup,
    signin,
    forgotPassword,
    loginWithGg,
    comfirmAccount,
    resetPassword,
    resendOTP
}