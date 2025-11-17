# Backend Deployment Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB instance (local or cloud)
- Git

## Local Development Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kooko-queue
JWT_SECRET=your_very_secure_random_string_change_this
NODE_ENV=development
```

### 3. Start MongoDB
If using local MongoDB:
```bash
# Mac (with Homebrew)
brew services start mongodb-community

# Linux (with systemd)
sudo systemctl start mongod

# Or run directly
mongod --dbpath /path/to/data/directory
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Production Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create a new Heroku app**
```bash
cd backend
heroku create kooko-queue-backend
```

4. **Add MongoDB (using MongoDB Atlas or mLab)**
```bash
heroku addons:create mongolab:sandbox
# Or set your own MongoDB URI
heroku config:set MONGODB_URI=your_mongodb_atlas_uri
```

5. **Set environment variables**
```bash
heroku config:set JWT_SECRET=your_secure_secret_key
heroku config:set NODE_ENV=production
```

6. **Deploy**
```bash
git push heroku main
```

7. **Open the app**
```bash
heroku open
```

### Option 2: Deploy to DigitalOcean

1. **Create a Droplet**
   - Choose Ubuntu 20.04 LTS
   - Select appropriate size (1GB RAM minimum)

2. **SSH into your server**
```bash
ssh root@your_server_ip
```

3. **Install Node.js**
```bash
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. **Install MongoDB**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

5. **Clone your repository**
```bash
git clone https://github.com/yourusername/kooko-queue-system.git
cd kooko-queue-system/backend
```

6. **Install dependencies**
```bash
npm install --production
```

7. **Set up environment variables**
```bash
nano .env
# Add your production environment variables
```

8. **Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
```

9. **Start the application**
```bash
pm2 start src/server.js --name kooko-backend
pm2 save
pm2 startup
```

10. **Set up Nginx as reverse proxy**
```bash
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/kooko
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

11. **Enable the site**
```bash
sudo ln -s /etc/nginx/sites-available/kooko /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Deploy to AWS EC2

1. **Launch EC2 instance**
   - Choose Amazon Linux 2 or Ubuntu
   - t2.micro for testing, t2.small+ for production

2. **Connect to instance**
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

3. **Install Node.js**
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 16
```

4. **Install MongoDB** (or use MongoDB Atlas)
Follow MongoDB installation for your Linux distribution

5. **Clone and setup** (same as DigitalOcean steps 5-9)

6. **Configure Security Group**
   - Allow inbound traffic on port 80 (HTTP)
   - Allow inbound traffic on port 443 (HTTPS)
   - Allow inbound traffic on port 5000 (for testing)

### MongoDB Atlas (Recommended for Production)

1. **Create account** at https://www.mongodb.com/cloud/atlas

2. **Create a cluster**
   - Choose free tier for testing
   - Select region closest to your users

3. **Get connection string**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

4. **Update environment variables**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kooko-queue?retryWrites=true&w=majority
```

## Environment Variables for Production

```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=very_secure_random_string_min_32_characters
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-domain.com
```

## Security Checklist

- [ ] Use strong JWT_SECRET (min 32 random characters)
- [ ] Enable HTTPS (use Let's Encrypt for free SSL)
- [ ] Configure CORS to allow only your frontend domain
- [ ] Use MongoDB authentication
- [ ] Add rate limiting (e.g., express-rate-limit)
- [ ] Keep dependencies updated
- [ ] Use helmet.js for security headers
- [ ] Implement input validation
- [ ] Set up monitoring (e.g., PM2 monitoring, Datadog)
- [ ] Configure proper logging
- [ ] Set up automated backups for MongoDB

## Monitoring & Logs

### PM2 Monitoring
```bash
pm2 monit
pm2 logs kooko-backend
```

### Check application status
```bash
pm2 status
pm2 restart kooko-backend
```

## Backup & Recovery

### MongoDB Backup
```bash
mongodump --uri="mongodb://localhost:27017/kooko-queue" --out=/path/to/backup
```

### MongoDB Restore
```bash
mongorestore --uri="mongodb://localhost:27017/kooko-queue" /path/to/backup
```

## Performance Optimization

1. **Enable compression**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Add caching** (Redis)
3. **Database indexing** (add indexes to frequently queried fields)
4. **Load balancing** (use PM2 cluster mode)
```bash
pm2 start src/server.js -i max --name kooko-backend
```

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use: `lsof -i :5000`
- Check environment variables
- Check MongoDB connection

### Can't connect to MongoDB
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check MONGODB_URI in .env
- Check network access in MongoDB Atlas

### High memory usage
- Check for memory leaks
- Monitor with `pm2 monit`
- Consider upgrading server resources

## Support

For issues or questions:
- Check logs: `pm2 logs kooko-backend`
- Review backend API documentation
- Check GitHub issues
