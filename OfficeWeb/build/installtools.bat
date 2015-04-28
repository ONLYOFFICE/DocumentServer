@echo off
cd /D %~dp0

SET GRUNT_OLD=grunt@0.3.17
SET GRUNT_CLI=grunt-cli

echo Check is there old grunt installed.
call npm list -g %GRUNT_OLD% && call npm uninstall -g grunt

echo Installation grunt-cli
call npm list -g %GRUNT_CLI% || call npm install -g %GRUNT_CLI%

call npm install
