@echo off
setlocal

@REM ! Set game directory
set "game_directory=C:\Program Files (x86)\Steam\steamapps\common\War of Rights"

@REM ! Set API endpoint
set "api_url=http://localhost:8444/api/error"

@REM ? Optional user input for email and description
set /p "email=Enter your email (optional): "
set /p "description=Enter a description (optional): "

@REM ? Retrieve the latest Game.log, Diagnostics folder and Client.dmp file
set "game_log=%game_directory%\game.log"
set "diagnostics_directory=%game_directory%\Diagnostics"
for /f "delims=" %%a in ('dir /ad-h /o-d /b "%diagnostics_directory%"') do (
    set "latest_folder=%%a"
    goto :found_latest_folder
)
:found_latest_folder

@REM ? Set latest Client.dmp file path
set "client_dmp=%diagnostics_directory%\%latest_folder%\Client.dmp"

@REM ! Check if game.log and Client.dmp exist
if not exist "%game_log%" (
    echo game.log not found!
    goto :eof
)

if not exist "%client_dmp%" (
    echo Client.dmp not found!
    goto :eof
)

@REM ! Upload files to API endpoint using cURL
curl -X POST -H "Content-Type: multipart/form-data" -F "game_log=@%game_log%" -F "client_dmp=@%client_dmp%" -F "email=%email%" -F "description=%description%" "%api_url%"

echo Files uploaded successfully!
pause

:end
endlocal
