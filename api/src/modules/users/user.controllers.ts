import User from './user.model';
import { Request, Response } from 'express';

export async function signup(req: Request, res: Response) {
    try {
        const user = await User.create(req.body);
        return res.status(201).json(user);
    } catch (e) {
        return res.status(500).json(e);
    }
}