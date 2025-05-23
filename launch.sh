#!/bin/bash
# This script is used to launch the application in AWS EC@2 instance.
# It sets up the environment and starts the application.

# nginx, git, nodejs, npm, pm2
# Install nginx
sudo yum install -y nginx
# Istall git
sudo yum install -y git
# Install nodejs
sudo yum install -y nodejs
# Install npm
sudo yum install -y npm
# Install pm2
sudo npm install -g pm2
# start nginx and enable it to start on boot
sudo systemctl start nginx
sudo systemctl enable nginx
# Enable pm2 to start on boot
pm2 startup


#codeDeploy agent install
sudo yum update -y
sudo yum install -y ruby wget
cd /home/ec2-user
wget https://aws-codedeploy-ap-south-1.s3.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo service codedeploy-agent start


cd /home/ec2-user
# Clone the repository
git clone https://thaamaraikannans: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@github.com/thaamaraikannans/notes-app.git

cd notes-app
# Install the dependencies
npm install

# Configure nginx
sudo rm -rf /etc/nginx/nginx.conf
sudo rm -rf /etc/nginx/conf.d
sudo cp /home/ec2-user/notes-app/nginx.conf /etc/nginx/nginx.conf
sudo cp -r /home/ec2-user/notes-app/conf.d /etc/nginx/

# start the application and restart nginx
pm2 start index.js
sudo systemctl restart nginx

