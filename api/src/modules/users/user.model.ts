import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
// import { passwordReg } from './user.validations';

const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required!'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minlength: [6, 'Password need to be longer!'],
        // validate: {
        //     validator(password) {
        //         return passwordReg.test(password);
        //     },
        //     message: '{VALUE} is not a valid password!',
        // },
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!'],
        trim: true,
        validate: [
            (email: any) => validator.isEmail(email),
            'Uh oh, {VALUE} does not equal "something".'
        ]
    },
    avatar_url: {
        type: String
    },
});
export default mongoose.model('User', UserSchema);