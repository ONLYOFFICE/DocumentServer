ECHO OFF

SET RUN_FOLDER=%CD%

CD /D %~dp0..\ || exit /b 1

ECHO.
ECHO ----------------------------------------
ECHO Build node.js module spellCheck (nodehun) 
ECHO ----------------------------------------

call npm list -g node-gyp || call npm install -g node-gyp || exit /b 1

XCOPY /S nodehun node_modules\nodehun\ /Y 

cd /D node_modules\nodehun\src || exit /b 1
call node-gyp configure || exit /b 1
call node-gyp build	|| exit /b 1

CD /D %RUN_FOLDER% || exit /b 1

exit /b 0
