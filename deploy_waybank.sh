#!/bin/bash
# WayBank.info Final Deployment Script
set -e

SERVER="waybank.info_gv3r7tj446u@185.68.111.228"
PORT="50050"
PASS="nRMOkvqht1d@i76$"
LOCAL_DIR="/Users/lorenzoballantimoran/Documents/waybank.info"
REMOTE_APP_DIR="~/WayBank.info"
REMOTE_PUBLIC_DIR="~/httpdocs"

echo "🚀 Starting deployment to $SERVER..."

# 1. Build locally
echo "📦 Building project..."
npm run build

# 2. Create tarballs
echo "📂 Creating tarballs..."
# Frontend tarball
tar -czf waybank_frontend.tar.gz -C dist/public .
# Backend tarball (excluding frontend dist)
tar -czf waybank_backend.tar.gz \
    dist/index.js \
    package.json \
    package-lock.json \
    server/migrations

# 3. Upload and extract
echo "📤 Uploading to server..."
sshpass -p "$PASS" scp -P $PORT waybank_frontend.tar.gz waybank_backend.tar.gz .env.production "$SERVER:~/"

echo "🔧 Setting up server directories..."
sshpass -p "$PASS" ssh -p $PORT $SERVER "
    export PATH=/opt/plesk/node/22/bin:\$PATH
    
    # 1. Setup Backend
    mkdir -p $REMOTE_APP_DIR
    mv ~/waybank_backend.tar.gz $REMOTE_APP_DIR/
    mv ~/.env.production $REMOTE_APP_DIR/.env
    cd $REMOTE_APP_DIR
    tar -xzf waybank_backend.tar.gz
    rm waybank_backend.tar.gz
    
    # 2. Setup Frontend (Public)
    # backup existing httpdocs if first time
    if [ ! -d ~/httpdocs_backup ]; then
        cp -r $REMOTE_PUBLIC_DIR ~/httpdocs_backup
    fi
    # Clear httpdocs and extract new frontend
    # rm -rf $REMOTE_PUBLIC_DIR/* # Be careful here, maybe just overwrite
    tar -xzf ~/waybank_frontend.tar.gz -C $REMOTE_PUBLIC_DIR
    rm ~/waybank_frontend.tar.gz
    
    echo 'Installing backend dependencies...'
    cd $REMOTE_APP_DIR
    npm install --production
"

# 4. Starting with PM2
echo "🔄 Starting application with PM2..."
sshpass -p "$PASS" ssh -p $PORT $SERVER "
    export PATH=/opt/plesk/node/22/bin:\$PATH
    cd $REMOTE_APP_DIR
    
    # Try to find PM2 or install locally
    PM2_BIN=\$(which pm2 2>/dev/null || echo './node_modules/.bin/pm2')
    
    if [ \"\$PM2_BIN\" == \"./node_modules/.bin/pm2\" ] && [ ! -f ./node_modules/.bin/pm2 ]; then
        echo 'PM2 not found, installing locally...'
        npm install pm2
    fi
    
    # Start app
    \$PM2_BIN stop waybank || true
    \$PM2_BIN start dist/index.js --name waybank --node-args=\"-r dotenv/config\" --env production --env-file .env
    \$PM2_BIN save
    
    echo 'Server status:'
    \$PM2_BIN list
"

echo "✅ Deployment finished successfully!"
rm waybank_frontend.tar.gz waybank_backend.tar.gz
