const xss = require("xss");

const sanitizeValue = (value) => {
  if (typeof value === "string") return xss(value);
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (value && typeof value === "object") {
    // Strip MongoDB operators from user input to prevent NoSQL injection
    const clean = {};
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("$")) continue; // drop $where, $gt, etc.
      clean[k] = sanitizeValue(v);
    }
    return clean;
  }
  return value;
};

const sanitizeRequest = (req, res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};

module.exports = sanitizeRequest;
