import createToken from '../utils/createToken.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const createUser = async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber } = req.body;
  console.log(req.body);
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email : email });

    if (!firstName ||!lastName ||!email ||!password || !phoneNumber) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const newUser = await User.create({ 
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      tax: 40,
      discount: 0,
    });
    
    // Create JWT token using util function
    const token = createToken({
      id: newUser._id, 
      firstName: newUser.firstName, 
      lastName: newUser.lastName, 
      email: newUser.email, 
      role: newUser.role,
      phoneNumber: newUser.phoneNumber,
      tax: newUser.tax,
      discount: newUser.discount,
    });

    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });

    return res.status(200).json({message: "User created successfully" , token: token});
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'internal error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ deletedAt: null }); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'internal error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = createToken(user);
    res.cookie('token', token, { httpOnly: true, sameSite: 'none', secure: true });

    return res.status(200).json({message: "User logged in successfully", token: token});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'internal error' });
  }
};


