import express from "express";
import { User } from "../../models/index.js";
import bcrypt from "bcrypt";

const router = express.Router();

// GET /api/account/me — current logged-in admin profile
router.get("/me", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "firstName", "lastName", "email", "phoneNumber", "createdAt"],
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/account/me — update profile info
router.patch("/me", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { firstName, lastName, phoneNumber } = req.body;
    await user.update({
      firstName: firstName ?? user.firstName,
      lastName:  lastName  ?? user.lastName,
      phoneNumber: phoneNumber ?? user.phoneNumber,
    });

    res.json({
      id: user.id, firstName: user.firstName, lastName: user.lastName,
      email: user.email, phoneNumber: user.phoneNumber,
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/account/password — change password
router.patch("/password", async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ error: "currentPassword and newPassword are required" });
    if (newPassword.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const user = await User.findByPk(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ error: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
});

export { router };
