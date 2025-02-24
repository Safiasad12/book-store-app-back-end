import jwt from "jsonwebtoken";

const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS as string;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH as string;
const JWT_SECRET_RESET = process.env.JWT_SECRET_REFRESH as string;

if (!JWT_SECRET_ACCESS || !JWT_SECRET_REFRESH || !JWT_SECRET_RESET) {
    throw new Error("Missing JWT secret keys in environment variables.");
}

export function accessSign(payload: { id: string, role: string }) {
    return jwt.sign(payload, JWT_SECRET_ACCESS, { expiresIn: '1d' });
}

export function accessVerify(token: string) { 
    return jwt.verify(token, JWT_SECRET_ACCESS);
}

export function refreshSign(payload: { id: string, role: string }) {
    return jwt.sign(payload, JWT_SECRET_REFRESH, { expiresIn: '7d' });
}

export function refreshVerify(token: string) {
    return jwt.verify(token, JWT_SECRET_REFRESH);
}

export function resetSign(payload: {id: string, role: string}) {
    const token = jwt.sign(payload, JWT_SECRET_RESET,{expiresIn: '1h'});
    return token;
}

export function resetVerify(token: string) {
    const payload = jwt.verify(token, JWT_SECRET_RESET);
    return payload;
}
