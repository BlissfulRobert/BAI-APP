@echo off
REM =====================================================================
REM  BAI-APP-1 Backend — Quick Start
REM =====================================================================
REM
REM  PREREQUISITES
REM    1. Python 3.10+ must be installed and available on PATH.
REM       Download: https://www.python.org/downloads/
REM       During install, check "Add Python to PATH".
REM
REM  WHAT THIS SCRIPT DOES (in order)
REM    1. Creates a Python virtual environment in  backend\.venv\
REM    2. Activates the virtual environment
REM    3. Installs all packages listed in requirements.txt
REM    4. Runs database migrations (creates db.sqlite3)
REM    5. Starts the Django development server on http://127.0.0.1:8000
REM
REM  USAGE
REM    Double-click this file  OR  open a terminal and run:
REM        cd backend
REM        start.bat
REM
REM  NOTES
REM    - The virtual environment is created only once; subsequent runs
REM      reuse it.
REM    - To add new packages, put them in requirements.txt and re-run
REM      this script.
REM    - Admin panel: http://127.0.0.1:8000/admin/
REM      (create a superuser first:  python manage.py createsuperuser)
REM    - Press Ctrl+C to stop the server.
REM
REM =====================================================================

echo.
echo ===================================
echo   BAI-APP-1 Backend Setup
echo ===================================
echo.

REM --- Step 1: Create virtual environment if it doesn't exist -----------
if not exist ".venv" (
    echo [1/4] Creating virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment.
        echo Make sure Python 3.10+ is installed and on your PATH.
        pause
        exit /b 1
    )
) else (
    echo [1/4] Virtual environment already exists, skipping creation.
)

REM --- Step 2: Activate virtual environment -----------------------------
echo [2/4] Activating virtual environment...
call .venv\Scripts\activate.bat

REM --- Step 3: Install dependencies -------------------------------------
echo [3/4] Installing dependencies from requirements.txt...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies.
    pause
    exit /b 1
)

REM --- Step 4: Run migrations -------------------------------------------
echo [4/4] Applying database migrations...
python manage.py migrate
if errorlevel 1 (
    echo ERROR: Migration failed.
    pause
    exit /b 1
)

REM --- Start the dev server ---------------------------------------------
echo.
echo ===================================
echo   Server starting on:
echo   http://127.0.0.1:8000
echo ===================================
echo   Press Ctrl+C to stop.
echo.
python manage.py runserver
