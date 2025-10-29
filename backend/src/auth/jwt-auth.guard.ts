import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Simplified Auth Guard for Phase 2
 * For Phase 2, we'll use email from Bearer token
 * In production, implement proper JWT validation with passport-jwt
 */
@Injectable()
export class JwtAuthGuard {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Try to extract user email from authorization header
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // For Phase 2, token is the user email from NextAuth session
      // In production, this should be a proper JWT token
      if (token && token.includes('@')) {
        // Assume it's an email
        request.user = {
          email: token,
          id: token,
          sub: token,
          userId: token,
        };
        return true;
      }
    }

    // For Phase 2, if no valid token, still allow but user lookup will fail
    // This provides better error messages
    request.user = {};
    return true;
  }
}
