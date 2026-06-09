import express from "express";
const router = express.Router();
import { CreateUser, LoginUser } from "../../services/auth/AuthService.js";

router.post("/register", async (req, res, next) => {
  try {
    const user = await CreateUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login",async (req,res,next)=>{
  try {
    const user = await LoginUser(req.body);
    res.status(200).json({
      success:true,
      data:user
    })
  } catch (error) {
    next(error);
  }
})

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError("refreshToken is required", 400);

    const { default: jwtService } = await import("../../services/jwt/jwtService.js");
    const payload = jwtService.verifyRefreshToken(refreshToken);

    const { User } = await import("../../models/index.js");
    const user = await User.findByPk(payload.userId);
    if (!user) throw new AppError("User not found", 404);

    const newToken = jwtService.signToken(
      { userId: user.id, role: user.role, clientId: user.clientId },
      process.env.ACCESS_TOKEN_EXPIRES_IN || "1h",
    );

    res.json({ success: true, token: newToken });
  } catch (err) {
    next(err);
  }
});

export { router };
