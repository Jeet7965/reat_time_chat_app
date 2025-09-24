import jwt from "jsonwebtoken";

const verifyAuth = (req, resp, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return resp.status(401).send({
                message: "No token provided or invalid format",
                success: false
            });
        }

        const token = authHeader.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

        req.userId = decodedToken.userId;
        // console.log("Decoded token:", decodedToken);
        next();

    } catch (error) {
        resp.status(401).send({
            message: error.message,
            success: false
        });
    }
};

export default verifyAuth;



// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGQzOTRmMmI4NDI5YWJkYWVhNDFmYzEiLCJpYXQiOjE3NTg2OTg1MDksImV4cCI6MTc1ODg3MTMwOX0.E17k31U58nBZM6PF3A1yWBNOm8BqYDprhsir4Jve0qk