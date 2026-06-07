@echo off
echo === Creating mcphub database ===
echo.
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -c "CREATE DATABASE mcphub;" 2>nul || "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE DATABASE mcphub;" 2>nul || "C:\Program Files\PostgreSQL\15\bin\psql.exe" -U postgres -c "CREATE DATABASE mcphub;" 2>nul
echo.
echo If you saw "CREATE DATABASE" above, the database was created successfully.
echo If you saw "already exists", that is fine too.
echo.
pause
