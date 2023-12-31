# Django-React-social
This is an web application based on Django rest Framework and React.js .

<img width="1440" alt="Screenshot 2023-07-23 at 4 13 10 PM" src="https://github.com/3westrick/Django-React-social/assets/109426803/840e1c8f-c4bd-4434-b5d9-1b5a598b63d7">


## Installation | backend
first open the terminal and go to backend folder.<br>
now we need a Virtual environment to install python packages.

```bash
python -m venv env
```
now to activate the environment (on mac)
```bash
source env/bin/activate
```
You should see "(env)" in your terminal, at the beginning of the line.<br>
Next use the package manager [pip](https://pip.pypa.io/en/stable/) to install requirements for backend.
```bash
pip install -r requirements.txt
```
And finally enter the main folder and run the server
```bash
cd mytest
python manage.py runserver
```
it should run on 127.0.0.1:8000<br>
<strong>DO NOT CLOSE THE TERMINAL</strong>

## Installation | frontend
redirect your location to frontend and then first-app folder, and open another terminal.
you should already have [npm](https://nodejs.org/en/download) installed.
now use npm to install required packages
```bash
npm install
```

now run the server for React project by using this command:
```bash
npm start
```
it should run the server on 127.0.0.1:3000
