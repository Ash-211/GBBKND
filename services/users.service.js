const userDb = require('../db/userDb');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

// Configure nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // Use true for port 465
  auth: {
    user: process.env.SMTP_USER || 'your_email@example.com',
    pass: process.env.SMTP_PASS || 'your_email_password'
  }
});

/**
 * Creates a new user.
 * Hashes the password, generates a verification token,
 * and sets the initial verification status to false.
 *
 * @param {Object} userData - Contains name, email, password, etc.
 * @returns {Object} The newly created user with verification token.
 */
exports.createUser = async (userData) => {
  // Basic validation
  if (!userData.email || !userData.password) {
    throw new Error('Email and password are required');
  }
  
  // Hash the password using bcrypt
  const salt = await bcrypt.genSalt(10);
  userData.password = await bcrypt.hash(userData.password, salt);

  // Generate a random verification token for email verification
  userData.verificationToken = crypto.randomBytes(20).toString('hex');
  // Initially, set the user as not verified
  userData.isVerified = false;
  
  // Save the new user in the database
  const newUser = await userDb.insertUser(userData);
  
  return newUser;
};

/**
 * Authenticates a user during login.
 * Compares the provided password with the stored hash and checks verification status.
 *
 * @param {Object} loginData - Contains email and password.
 * @returns {Object} User object if credentials are valid.
 */
exports.authenticateUser = async (loginData) => {
  // Look up the user by email
  const user = await userDb.findUserByEmail(loginData.email);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(loginData.password, user.password);
  if (!isMatch) {
    throw new Error('Invalid password');
  }
  
  // Check if the user's email is verified
  if (!user.isVerified) {
    throw new Error('Email is not verified');
  }
  
  // Return the user object (you can also generate and return a JWT token here)
  return user;
};

/**
 * Sends a verification email to the user's email address.
 *
 * @param {string} email - The user's email.
 * @param {string} token - The verification token.
 */
exports.sendVerificationEmail = async (email, token) => {
  // Construct the verification URL (adjust domain/port as necessary)
  const verificationUrl = `http://localhost:${process.env.PORT || 5000}/api/users/verify-email?token=${token}`;
  
  // Email options including subject and HTML content
  const mailOptions = {
    from: process.env.SMTP_USER || 'your_email@example.com',
    to: email,
    subject: 'Verify Your Email',
    text: `Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking the following link:</p><a href="${verificationUrl}">Verify Email</a>`
  };
  
  // Send the email using nodemailer
  await transporter.sendMail(mailOptions);
};

/**
 * Verifies a user's email using the provided token.
 *
 * @param {string} token - The email verification token.
 */
exports.verifyUserEmail = async (token) => {
  // Look up the user by the verification token
  const user = await userDb.findUserByVerificationToken(token);
  if (!user) {
    throw new Error('Invalid or expired verification token');
  }
  
  // Update the user's verification status and clear the token
  await userDb.updateUser(user._id, { isVerified: true, verificationToken: null });
};

/**
 * Resends the verification email if the user's email is not yet verified.
 *
 * @param {string} email - The user's email address.
 * @returns {Object} The user object.
 */
exports.resendVerificationEmail = async (email) => {
  const user = await userDb.findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.isVerified) {
    throw new Error('Email is already verified');
  }
  
  // Generate a new verification token
  const newToken = crypto.randomBytes(20).toString('hex');
  await userDb.updateUser(user._id, { verificationToken: newToken });
  
  // Send a new verification email with the updated token
  await exports.sendVerificationEmail(email, newToken);
  
  return user;
};
