@echo off
cd /D %~dp0
echo Installation grunt and grunt-contrib
call npm install -g grunt@0.3.17 
call npm install grunt-contrib-clean@0.3.2
call npm install grunt-contrib-copy@0.3.2
call npm install grunt-contrib-compress@0.3.2
