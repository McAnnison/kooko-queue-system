# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in Kooko Queue System, please report it by creating a private security advisory on GitHub or by emailing the maintainers.

**Please do not report security vulnerabilities through public GitHub issues.**

### What to Include in Your Report

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)

### Response Timeline

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will provide a more detailed response within 7 days
- We will work on a fix and release a patched version as soon as possible

## Security Best Practices

### For Deployment

1. **Environment Variables**
   - Never commit `.env` files to version control
   - Use strong, random JWT secrets (minimum 32 characters)
   - Rotate secrets regularly in production

2. **Database Security**
   - Enable MongoDB authentication
   - Use connection strings with authentication
   - Regularly backup your database
   - Use MongoDB Atlas for production (recommended)

3. **API Security**
   - Always use HTTPS in production
   - Implement rate limiting
   - Keep dependencies updated
   - Use CORS appropriately
   - Validate all user inputs

4. **Password Security**
   - Passwords are hashed using bcryptjs
   - Minimum password length: 6 characters (consider increasing to 8+)
   - Encourage strong passwords

5. **JWT Tokens**
   - Tokens expire after 7 days
   - Store tokens securely in AsyncStorage (mobile)
   - Implement token refresh mechanism for production

### Known Security Considerations

1. **No Rate Limiting**: Current implementation doesn't include rate limiting. Add this for production.
   
   Recommended: Use `express-rate-limit`
   ```javascript
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

2. **Input Validation**: While basic validation exists, enhance it with express-validator for all endpoints.

3. **SQL/NoSQL Injection**: Mongoose provides some protection, but always sanitize user inputs.

4. **XSS Protection**: React Native has built-in XSS protection, but be careful with dynamic content.

5. **CSRF Protection**: Not currently implemented. For web versions, add CSRF tokens.

## Security Updates

### December 2024
- Updated mongoose from 7.6.3 to 7.8.7 to patch search injection vulnerabilities
- Updated axios from 1.5.1 to 1.12.0+ to patch DoS and SSRF vulnerabilities
- Removed deprecated react-navigation package

### Recommended Production Enhancements

1. **Add Helmet.js** for HTTP headers security:
   ```bash
   npm install helmet
   ```
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

2. **Add Rate Limiting**:
   ```bash
   npm install express-rate-limit
   ```

3. **Add Request Sanitization**:
   ```bash
   npm install express-mongo-sanitize
   ```

4. **Add HTTPS Enforcement**:
   ```javascript
   app.use((req, res, next) => {
     if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
       res.redirect(`https://${req.header('host')}${req.url}`);
     } else {
       next();
     }
   });
   ```

5. **Add Logging and Monitoring**:
   - Use Winston for logging
   - Monitor with tools like Datadog, New Relic, or PM2 monitoring

## Dependency Security

We regularly update dependencies to patch security vulnerabilities. Run these commands periodically:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities (non-breaking)
npm audit fix

# Update all dependencies
npm update

# Check for outdated packages
npm outdated
```

## Security Checklist for Production

- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Strong JWT secret (32+ random characters)
- [ ] MongoDB authentication enabled
- [ ] Environment variables properly set
- [ ] CORS configured for specific domains only
- [ ] Rate limiting implemented
- [ ] Helmet.js for security headers
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive information
- [ ] Logging configured (but don't log sensitive data)
- [ ] Regular dependency updates
- [ ] Database backups configured
- [ ] Monitoring and alerting set up
- [ ] Security audit performed

## Contact

For security concerns, please contact the maintainers through GitHub.

---

**Note**: This is a development project. For production use, conduct a thorough security audit and implement all recommended enhancements.
