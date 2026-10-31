@echo off
title Campus Pulse - AI Buildathon
echo ======================================================================
echo    CAMPUS PULSE - Smart Campus Notice & Event Hub
echo    3-Hour AI Buildathon Project
echo ======================================================================
echo.
echo Launching local development server on http://localhost:8000 ...
echo Press Ctrl+C in this window when you wish to stop the server.
echo.

:: Launch default browser
start http://localhost:8000

:: Run standard lightweight Python HTTP server
python -m http.server 8000
