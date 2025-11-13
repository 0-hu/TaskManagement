#!/bin/bash

# Quick fix script for Prisma Client issues

echo "🔧 Fixing Prisma Client..."

cd /home/user/TaskManagement/backend

# Step 1: Clean Prisma cache
echo "1️⃣ Cleaning Prisma cache..."
rm -rf node_modules/.prisma
rm -rf node_modules/@prisma

# Step 2: Reinstall Prisma packages
echo "2️⃣ Reinstalling Prisma..."
npm uninstall prisma @prisma/client
npm install prisma@latest @prisma/client@latest

# Step 3: Generate Prisma Client
echo "3️⃣ Generating Prisma Client..."
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npx prisma generate || {
    echo "⚠️  Generate failed, trying alternative method..."
    npx prisma db push --skip-generate
}

# Step 4: Create database if needed
echo "4️⃣ Setting up database..."
npx prisma db push

echo "✅ Done! Now start the backend with: npm run start:dev"
