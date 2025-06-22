import  bcrypt  from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { UsersCollection } from '../models/user.model';
import { jwtConfig } from '../config/jwt'; 
import { OK } from '../utils/http-status';

const generateToken = (id: string, role: string): string => {
  return jwt.sign(
    { type: 'access', user: { id, role } },
    jwtConfig.secret, 
    { expiresIn: '1h' }
  );
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role = 'user' } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: 'fail', message: 'Email and password are required' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ status: 'fail', message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: UsersCollection = await User.create({ 
      email,
      password: hashedPassword, 
      role 
    });

    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      user: {
        id: newUser.id, 
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to sign up',
      details: err.message
    });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        status: 'fail',
        message: 'Email and password are required'
      });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ 
        status: 'fail', 
        message: 'Email is Invalid' 
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ 
        status: 'fail', 
        message: 'Invalid credentials' 
      });
      return;
    }

    const token = generateToken(user.id, user.role); 
    res.status(200).json({
      status: 'success',
      message: 'Sign in successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err: any) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Signin failed', 
      details: err.message 
    });
  }
};

export const signout = async (req: Request, res: Response) => {
  res.cookie('accessToken', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  res.status(OK).json({
    status: 'success',
    message: 'Signed out successfully',
  });
};