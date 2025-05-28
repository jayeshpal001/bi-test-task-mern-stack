// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

export const inviteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 invites per windowMs
  message: 'Too many invitations sent from this IP, please try later'
});

// Apply to route
router.post('/:groupId/invite', auth, inviteLimiter, inviteMember);