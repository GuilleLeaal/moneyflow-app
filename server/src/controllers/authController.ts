import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto123'; // ⚠️ Usar variable de entorno real en producción

// REGISTRO DE USUARIO
export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validaciones explícitas
  if (!username || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({ error: 'El nombre de usuario debe tener al menos 3 caracteres' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }

  try {
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ error: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Se puede devolver token si querés mantener al usuario logueado tras registrarse:
    const token = jwt.sign({ id: newUser._id, username: newUser.username }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(201).json({ token, username: newUser.username });
  } catch (err) {
    console.error('Error en registro:', err);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};

// LOGIN DE USUARIO
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validación básica
  if (!username || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({ token, username: user.username });
  } catch (err) {
    console.error('Error en login:', err);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
};
