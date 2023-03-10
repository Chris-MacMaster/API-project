// backend/routes/api/users.js



const express = require('express')


const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];


const router = express.Router();


// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { firstName, lastName, email, password, username } = req.body;
        const user = await User.signup({ firstName, lastName, email, username, password });

        await setTokenCookie(res, user);

        return res.json({
            user: user
        });
    }
);

//LWA30rl6-TYF1ANCMKbhGpwx8yXrdO90-_no

// fetch('/api/users', {
//     method: 'POST',
//     headers: {
//         "Content-Type": "application/json",
//         "XSRF-TOKEN": `LWA30rl6-TYF1ANCMKbhGpwx8yXrdO90-_no`
//     },
//     body: JSON.stringify({
//         email: 'haaag@email.com',
//         username: '',
//         password: 'aaa'
//     })
// }).then(res => res.json()).then(data => console.log(data));


module.exports = router;
