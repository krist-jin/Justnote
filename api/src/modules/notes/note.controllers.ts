import Note from './note.model';
import { Request, Response } from 'express';
import { IUser } from '../users/user.model';
import HTTPStatus from 'http-status';

// before calling the functions here, the request must be authenticated first and the user object is set

export async function createNote(req: Request, res: Response) {
    try {
        console.log('got a createNote request')
        const user: IUser = req.user as IUser;
        const note = await Note.create({
            ...req.body,
            owner_id: user._id
        });
        return res.status(HTTPStatus.CREATED).json(note);
    } catch (e) {
        console.log(e);
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

// TODO: pagination
export async function getAllNotes(req: Request, res: Response) {
    try {
        const user: IUser = req.user as IUser;
        const notes = await Note.find({
            owner_id: user._id  // only find in notes of the current user
        });
        return res.status(HTTPStatus.OK).json(notes);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function getNoteById(req: Request, res: Response) {
    try {
        const user: IUser = req.user as IUser;
        const note = await Note.findOne({
            _id: req.params.id,
            owner_id: user._id  // only find in notes of the current user
        });
        return res.status(HTTPStatus.OK).json(note);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}