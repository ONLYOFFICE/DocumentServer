rem @echo off
cd /D %~dp0
for /f "tokens=*" %%a in ('dir /b .\*.*') do regsvr32 /s .\%%a