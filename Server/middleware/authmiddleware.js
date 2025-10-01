import jwt from 'jsonwebtoken';

const verifyAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).send({ message: "No token provided", success: false });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).send({ message: "Invalid token format", success: false });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized: Invalid token", success: false });
  }
};

export default verifyAuth;
