SET DB_FILE_PATH=..\data\db
IF NOT EXIST %DB_FILE_PATH% MKDIR %DB_FILE_PATH%

call ..\mongodb\bin\mongod.exe --journal --dbpath "%DB_FILE_PATH%"
pause