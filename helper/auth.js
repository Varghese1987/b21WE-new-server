const bcryptjs = require("bcryptjs");
const JWT = require("jsonwebtoken");
const secret = "123456789";

const hashing = async (value) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    console.log("salt", salt);
    const hash = await bcryptjs.hash(value, salt);
    console.log("hash", hash);
    return hash;
  } catch (error) {
    return error;
  }
};

const hashCompare = async (password, hashvalue) => {
  try {
    return await bcryptjs.compare(password, hashvalue);
  } catch (error) {
    return error;
  }
};

const createJWT = async ({ email, _id, role }) => {
  try {
    return await JWT.sign({ email, _id, role }, secret, { expiresIn: "1h" });
  } catch (error) {
    return error;
  }
};

const authorize = async (req, res, next) => {
  try {
    // check if the token is present
    const bearerToken = await req.headers.authorization;
    if (bearerToken) {
      // check if the token is valid
      JWT.verify(bearerToken, secret, (err, decode) => {
        if (err) {
          return res.sendStatus(403);
        } else {
          console.log(decode);
          if (decode !== undefined) {
            const auth = decode;
            req.body.auth = auth;
          }
          // if valid token allow user
          console.log("Allow usser");
          next();
        }
      });
    } else {
      console.log("no token available");
      return res.sendStatus(403);
    }
  } catch (error) {
    return error;
  }
};

const roleAuth = (...roles) => {
  return function (req, res, next) {
    const role = req.body.auth.role;
    if (roles.includes(role)) {
      next();
    } else {
      res.status(403).json({ message: "Permission Denied" });
    }
  };
};

module.exports = { hashing, hashCompare, createJWT, authorize, roleAuth };
