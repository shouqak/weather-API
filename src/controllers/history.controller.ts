import { Request, Response } from 'express';
import History from '../models/history.model';

export const listHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.userId;
    const history = await History.find({ user: userId }).populate('weather');

    res.json(history);
  } catch (err: any) {
    res.status(500).json({
      error: 'Failed to fetch history',
      details: err.message,
    });
  }
};