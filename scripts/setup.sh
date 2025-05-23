#!/bin/bash
echo "Running npm install and starting PM2..."

cd /home/ec2-user/notes-app


# Install dependencies
npm install

# Kill any running instance and restart app
pm2 delete all || true
pm2 start index.js --name notes-app

systemctl restart nginx
