import Note, { INote } from './note.model';
import { Request, Response } from 'express';
import { IUser } from '../users/user.model';
import HTTPStatus from 'http-status';
import { PAGINATION } from '../modules.constants';

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

export async function listNotes(req: Request, res: Response) {
    try {
        const user: IUser = req.user as IUser;
        const limit = parseInt(req.query.limit) || PAGINATION.limit;
        const skip = parseInt(req.query.skip) || PAGINATION.skip;
        const sort_by = parseInt(req.query.sort_by) || PAGINATION.sort_by;
        const sort_ascending = req.query.sort_ascending || PAGINATION.sort_ascending ? 1 : -1;
        const notes = await Note.find({ owner_id: user._id })
            .sort({ [sort_by]: sort_ascending })
            .skip(skip)
            .limit(limit);
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

export async function updateNoteById(req: Request, res: Response) {
    try {
        const user: IUser = req.user as IUser;
        const note: any = await Note.findById(req.params.id);
        if (!note) {
            return res.sendStatus(HTTPStatus.BAD_REQUEST);
        }
        if (!note.owner_id.equals(user._id)) {
            return res.sendStatus(HTTPStatus.UNAUTHORIZED);
        }

        // TODO: this could be further optimized
        Object.keys(req.body).forEach((key: string) => {
            note[key] = req.body[key];
        });

        return res.status(HTTPStatus.OK).json(await note.save());
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export async function deleteNoteById(req: Request, res: Response) {
    try {
        const user: IUser = req.user as IUser;
        const note: any = await Note.findById(req.params.id);
        if (!note) {
            return res.sendStatus(HTTPStatus.BAD_REQUEST);
        }

        if (!note.owner_id.equals(user._id)) {
            return res.sendStatus(HTTPStatus.UNAUTHORIZED);
        }

        await note.remove();
        return res.sendStatus(HTTPStatus.OK);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}