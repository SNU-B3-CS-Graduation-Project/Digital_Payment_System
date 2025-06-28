import jwt from 'jsonwebtoken';
const signInToken = (user) => {
    return jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        image: user.image,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
  };
  export default {
    signInToken
  }