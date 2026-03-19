const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  // Use CF/proxy-safe IP detection
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  },
  message: {
    status: 429,
    message: "Too many requests from this IP. Please try again after an hour.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers["x-forwarded-for"]?.split(",")[0].trim() || "unknown";
  },
  message: {
    status: 429,
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
});

module.exports = { apiLimiter, authLimiter };
