import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import { hashSync, compareSync } from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import uniqueValidator from 'mongoose-unique-validator';

export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    avatar_url: string;
    authenticateUser: (password: string) => boolean;
    createToken: () => any;
    toAuthJSON: () => any;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: [true, 'username is required!'],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        trim: true,
        minlength: [6, 'Password need to be longer!']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required!'],
        trim: true,
        validate: [
            (email: any) => validator.isEmail(email),
            'Uh oh, {VALUE} is not a valid email.'
        ]
    },
    avatar_url: {
        type: String
    },
}, {
    timestamps: {
        createdAt: 'created_at',  // record the create time automatically
        updatedAt: 'updated_at'  // record the update time automatically
    }
});

UserSchema.plugin(uniqueValidator, {
    message: '{VALUE} already exists!'
})

UserSchema.pre<IUser>('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = hashSync(user.password);  // hash the password before saving
    }
    return next();
});

UserSchema.methods = {
    // compare the hashed password
    authenticateUser(password: string) {
        return compareSync(password, this.password);
    },

    // create JWT token
    createToken() {
        return jwt.sign(
            { _id: this._id },
            process.env.JWT_SECRET as string
        )
    },

    toAuthJSON() {
        return {
            _id: this._id,
            username: this.username,
            token: `JWT ${this.createToken()}`
        };
    }
}

export default mongoose.model<IUser>('User', UserSchema);