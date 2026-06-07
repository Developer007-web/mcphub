@echo off
echo === MCPHub Backend Setup ===
echo.
cd /d "C:\Users\HP\Desktop\MCP PROJECTS\mcphub\backend"

echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Setting up database tables...
call npm run setup-db

echo.
echo Step 3: Starting dev server...
call npm run dev
