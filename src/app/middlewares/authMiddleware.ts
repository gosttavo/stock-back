import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import UsuarioRepository from '../repositories/UsuarioRepository';
import AuthRepository from '../repositories/AuthRepository';

interface TokenPayload {
    id: string;
    iat: number;
    exp: number;
}

export default function authMiddleware () {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Token not provided' });
        }

        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            return res.status(401).json({ error: 'Token error' });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({ error: 'Token malformed' });
        }

        if (AuthRepository.isTokenInvalid(token)) {
            return res.status(401).json({ error: 'Token invalid' });
        }

        try {
            const decoded = verify(token, 'SECRET_KEY');
            const { id } = decoded as TokenPayload;

            req.user = id
            
            const userRole = await UsuarioRepository.getUserRole(parseInt(req.user));
            const url = req.originalUrl.split('/');

            if (
                url[1] === ('usuario' || 'empresa') 
                && userRole !== 'ADMIN'
            ) {
                return res.status(401).json({ error: 'User access unauthorized!' });
            }

            return next();
        } catch {
            return res.status(401).json({ error: 'Token invalid' });
        }
    };
}