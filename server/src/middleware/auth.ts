import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET = 'tajny_klucz'; // tajny klucz używany do weryfikacji tokenów

// middleware do ochrony endpointów wymagających autoryzacji
export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers['authorization']; // nagłówek: Authorization: Bearer <token>
    const token = authHeader?.split(' ')[1]; // wyciągnięcie tokena

    if (!token) {
        res.sendStatus(401); // brak tokena – nieautoryzowany
        return;
    }

    // weryfikacja tokena JWT
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403); // nieprawidłowy token – brak dostępu
            return;
        }

        (req as any).user = user; // zapisanie użytkownika do req.user
        next(); // przejście do właściwego handlera
    });
}
