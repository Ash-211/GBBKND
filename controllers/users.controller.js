const userService = require('../services/users.service');

/**
 * Registers a new user.
 * Expects request body with user data (name, email, password, etc.)
 * Returns created user data and sends a verification email.
 */
exports.registerUser = async (req, res) => {
  try {
    // Create a new user and generate a verification token
    const newUser = await userService.createUser(req.body);
    
    // Send a verification email to the user with the token
    await userService.sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(201).json({
      message: 'User registered successfully. Please check your email to verify your account.',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Logs in a user.
 * Expects request body containing email and password.
 * Returns user data if credentials are valid.
 */
exports.loginUser = async (req, res) => {
  try {
    const user = await userService.authenticateUser(req.body);
    res.status(200).json({
      message: 'Login successful',
      user: user
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

/**
 * Verifies a user's email using a token provided as a query parameter.
 * Example: GET /api/users/verify-email?token=xyz
 */
exports.verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }
    // Verify the token and update the user's verification status
    await userService.verifyUserEmail(token);
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Resends the verification email if the user's email is not verified.
 * Expects request body containing the user's email.
 */
exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    // Resend the verification email
    const user = await userService.resendVerificationEmail(email);
    res.status(200).json({ message: 'Verification email resent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
