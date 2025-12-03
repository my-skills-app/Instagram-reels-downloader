# Heroku Deployment Guide

## Prerequisites
- Heroku CLI installed
- Heroku account
- Git initialized

## Environment Variables
Set these environment variables in your Heroku app:

```bash
heroku config:set USE_UPSTASH=false
heroku config:set UPSTASH_REDIS_REST_URL=your-upstash-url
heroku config:set UPSTASH_REDIS_REST_TOKEN=your-upstash-token
```

## Deployment Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set USE_UPSTASH=false
   # Set Upstash variables if using rate limiting
   heroku config:set UPSTASH_REDIS_REST_URL=your-url
   heroku config:set UPSTASH_REDIS_REST_TOKEN=your-token
   ```

4. **Deploy**
   ```bash
   git add .
   git commit -m "Ready for Heroku deployment"
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   ```

## Important Notes
- The app uses Next.js with API routes
- Node.js version 18+ is required
- Build process runs automatically on deployment
- Make sure to set proper environment variables for rate limiting if needed
