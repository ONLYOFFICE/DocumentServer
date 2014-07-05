ECHO OFF

SET RUN_FOLDER=%CD%

CD /D %~dp0..\ || exit /b 1

ECHO.
ECHO ----------------------------------------
ECHO Install node.js modules 
ECHO ----------------------------------------

call npm install express@3.4.8 --production || exit /b 1
call npm install underscore@1.5.2 --production || exit /b 1
call npm install sockjs@0.3.8 --production|| exit /b 1
call npm install mongodb@1.1.4 --production || exit /b 1

cd /D ..\Common || exit /b 1
call npm install log4js@0.6.2 --production || exit /b 1

CD /D %RUN_FOLDER% || exit /b 1

exit /b 0
