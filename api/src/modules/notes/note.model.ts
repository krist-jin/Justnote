import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../users/user.model';

export interface INote extends Document {
    owner_id: IUser['_id'];
    title: string;
    content: string;
}

const NoteSchema: Schema = new Schema({
    owner_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'owner_id is required!']
    },
    title: {
        type: String,
        trim: true,
        required: [true, 'Title is required!']
    },
    content: {
        type: String
    }
}, {
    timestamps: {
        createdAt: 'created_at',  // record the create time automatically
        updatedAt: 'updated_at'  // record the update time automatically
    }
});

export default mongoose.model<INote>('Note', NoteSchema);
