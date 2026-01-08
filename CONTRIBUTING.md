# Contributing to Kooko Queue System

Thank you for your interest in contributing to Kooko Queue System! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git
- Expo CLI (for mobile development)

### Setting Up Development Environment

1. **Fork the repository**
```bash
# Click the "Fork" button on GitHub
```

2. **Clone your fork**
```bash
git clone https://github.com/your-username/kooko-queue-system.git
cd kooko-queue-system
```

3. **Add upstream remote**
```bash
git remote add upstream https://github.com/McAnnison/kooko-queue-system.git
```

4. **Set up backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

5. **Set up mobile app**
```bash
cd ../mobile
npm install
```

6. **Start MongoDB**
```bash
mongod
```

7. **Run the backend**
```bash
cd backend
npm run dev
```

8. **Run the mobile app**
```bash
cd mobile
npm start
```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Urgent fixes for production
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### Making Changes

1. Make your changes in your feature branch
2. Write or update tests as needed
3. Ensure all tests pass
4. Follow the coding standards
5. Commit your changes with clear messages

### Syncing with Upstream

```bash
git fetch upstream
git rebase upstream/main
```

## Coding Standards

### JavaScript/React Native

- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Backend (Node.js/Express)

```javascript
// Good
const getUserOrders = async (userId) => {
  try {
    const orders = await Order.find({ customer: userId });
    return orders;
  } catch (error) {
    throw new Error('Failed to fetch orders');
  }
};

// Bad
const get = async (id) => {
  const o = await Order.find({ customer: id });
  return o;
};
```

### Frontend (React Native)

```javascript
// Good
const OrderCard = ({ order, onPress }) => {
  const formatPrice = (price) => `₦${price}`;
  
  return (
    <Card onPress={onPress}>
      <Text>{order.porridgeType}</Text>
      <Text>{formatPrice(order.totalPrice)}</Text>
    </Card>
  );
};

// Bad
const OC = (props) => {
  return (
    <Card onPress={props.onPress}>
      <Text>{props.order.porridgeType}</Text>
      <Text>₦{props.order.totalPrice}</Text>
    </Card>
  );
};
```

### File Organization

```
backend/
  src/
    models/       # Database models
    controllers/  # Business logic
    routes/       # API routes
    middleware/   # Custom middleware
    config/       # Configuration files
    utils/        # Helper functions

mobile/
  screens/      # App screens/pages
  components/   # Reusable components
  navigation/   # Navigation setup
  services/     # API and external services
  utils/        # Helper functions
  assets/       # Images, fonts, etc.
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Mobile Tests

```bash
cd mobile
npm test
```

### Writing Tests

Example backend test:
```javascript
describe('Order Controller', () => {
  it('should create a new order', async () => {
    const orderData = {
      porridgeType: 'plain',
      size: 'medium',
      quantity: 1
    };
    
    const order = await orderController.createOrder(orderData);
    expect(order).toBeDefined();
    expect(order.porridgeType).toBe('plain');
  });
});
```

## Submitting Changes

### Commit Messages

Follow the Conventional Commits specification:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```bash
git commit -m "feat(orders): add order cancellation feature"
git commit -m "fix(auth): resolve token expiration issue"
git commit -m "docs(readme): update installation instructions"
```

### Pull Request Process

1. **Ensure all tests pass**
```bash
npm test
```

2. **Update documentation** if needed

3. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

4. **Create Pull Request**
   - Go to GitHub and create a PR from your fork to the main repository
   - Fill out the PR template
   - Link any related issues

5. **PR Template**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No new warnings generated
```

6. **Code Review**
   - Address review comments
   - Push updates to the same branch
   - Request re-review when ready

7. **Merge**
   - Once approved, a maintainer will merge your PR
   - Delete your feature branch after merge

## Areas for Contribution

### High Priority
- Unit and integration tests
- Performance optimization
- Security enhancements
- Accessibility improvements

### Feature Ideas
- Payment integration (Paystack, Flutterwave)
- Push notifications
- Rating and review system
- Analytics dashboard
- Order scheduling
- Multi-language support

### Documentation
- API documentation
- User guides
- Video tutorials
- Code examples

### Bug Fixes
- Check the issues tab for bugs
- Reproduce the bug
- Create a fix with tests
- Submit PR

## Communication

- **GitHub Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Discussions**: For questions and general discussions

## Recognition

Contributors will be recognized in:
- README.md Contributors section
- Release notes
- Project documentation

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Create a new issue with the question label

Thank you for contributing to Kooko Queue System! 🎉
