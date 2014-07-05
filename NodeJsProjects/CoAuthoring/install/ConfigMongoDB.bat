ECHO OFF
SET DB_CONFIG_FILE=config_db.tmp
SET DB_NAME=coAuthoring

ECHO.
ECHO ----------------------------------------
ECHO Configure %DB_NAME% database
ECHO ----------------------------------------

ECHO db.createCollection("messages") > %DB_CONFIG_FILE%
ECHO db.messages.ensureIndex({"docid":1}) >> %DB_CONFIG_FILE%
ECHO db.createCollection("changes") >> %DB_CONFIG_FILE%
ECHO db.changes.ensureIndex({"docid":1}) >> %DB_CONFIG_FILE%
ECHO exit >> %DB_CONFIG_FILE%

call %~dp0..\mongodb\bin\mongo.exe %DB_NAME% < %DB_CONFIG_FILE% || exit /b 1

DEL /Q %DB_CONFIG_FILE%

exit /b 0