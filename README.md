# KASBON WEBSITE




https://github.com/GesangPJ/kasbon-js/assets/26625652/a2f6697b-7a4f-4486-a67a-8734ebf0ed18


Website berbasis NodeJS bertujuan untuk mengelola Kasbon, menggunakan NextJS untuk frontend(client-side), dan ExpressJS untuk backend(server-side),data kasbon dan akun dimasukkan dan dikelola dengan database PostgreSQL v15. Mulai dari versi 1.0.7-Preview tersedia
versi docker container untuk website ini, versi docker container 1.0.7 mungkin masih memiliki beberapa masalah seperti tidak terkoneksi
antara container frontend dan backend (API ERROR NOT FOUND/ API ERROR CONNECTION TIME OUT).

Mulai versi 1.0.8 tidak ada versi Docker Container dikarenakan koneksi antar frontend (NextJS) container dan backend (ExpressJS) tidak dapat terhubung sama sekali pada webpage NextJS, namun bisa jika melalui container console pada kedua container.

## Features

- Account auth using express-session
- Session storage
- Add Kasbon
- Edit Kasbon
- Set Request
- Set Bayar
- Additional 2 VIEW tables
- Download Data Page
- Unauthorized Access Protection
- Password change for admin
- Password hashing using bcrypt with iteration 10-16

## Changelog

- _Build means it's tested and safe to build the project_
- _Preview means this version has not been built yet_

### v1.4.7-BUILD

- Add data grid view of karyawan account
- Add data grid view of admin account
- Admin ability to change admin password with old password verification
- Cleanup backend code

### v1.4.4-PREVIEW

- Fix error when there are no data in request table (empty)
- Fix error when there are no data in view dashboard
- Prepare database for production

### v1.4.0-BUILD

- Upgrade and tested in NodeJS v21.0.0
- Upgrade and tested in PostgreSQL 16.0
- Working create services in Windows
- Working create services in Ubuntu
- Remove unnecessary files
- Cleanup some codes
- Version upgrade to 1.4.0 both backend and frontend

### v1.3.5-BUILD

- Replace Request page table with MUI X Data Grid
- Fix Bayar page sorting error
- Backend version 1.2.1
- Backend hang fix (by adding some client.release()) [i hope it's work and no more hang]
- Update admin sidebar

### v1.2.0-BUILD

- Backend version update v1.1.5
- Replace Admin Dashboard with MUI X Data Grid table
- Replace Karyawan Dashboard with MUI X Data Grid table
- Update template request DOCX
- Update template lunas DOCX
- Increase backend request handle so it won't hang easily

### v1.1.1-BUILD

- Add access protection for Admin Dashboard page, only admin can access
- Add access protection for Karyawan Dashboard page
- Add access protection for Input Kasbon page
- Add access protection for Request Page, only admin can access
- Add access protection for Bayar page, only admin can access
- Add access protection for Download page, only admin can access
- Fix Docx download bugs
- Fix docx template
- Remove unnecessary codes

### v1.0.8-BUILD

- Working Download Request Page, download data to Docx format.
- Working Download Bayar (Bukti Lunas), download data to Docx format.
- Remove unnecessary api.
- Working Docxtemplater module.

### v1.0.7-BUILD

- Working API URL from env
- All page is working seamless
- Next Build version is work like a charm

### v1.0.7-PREVIEW

- Change API URL in frontend (client-side)
- Change CORS options in backend
- Trying to make it work in Docker Container
- Docker Container available [BETA]
- Docker Compose available [BETA]
- Fix typos in some files
- Fix env files for frontend and backend

### v1.0.5-Build

- Single submit button for request page
- Single submit button for bayar page
- Fix sorting system for dashboard Admin
- Fix sorting system for dashboard User (Karyawan)

### v1.0.0-Build

- Working Login Page and directing to respective account role
- Working Dashboard, both for Admin and User
- Working Input Kasbon for User with validation for each input field
- Working Request Page for Admin
- Working Bayar Page for Admin with single button for sending change
- Fast Build and smaller size using SWC Minify
- Latest Build doesn't have any bugs

### Login Page

<img src="https://github.com/GesangPJ/kasbon-js/blob/main/frontend/public/images/ss/desktop-login-1.png" width = "300" height = "300" >

Login Page for Desktop

<img src="https://github.com/GesangPJ/kasbon-js/blob/main/frontend/public/images/ss/mobile-login.png" width = "250" height = "515" >

Login Page in mobile mode

## B. Install

1. Pull this repo to your directory
2. In project root, go to /frontend use `yarn install` or `npm install` to install all dependencies
3. Go to /backend
4. use `yarn install` or `npm install` to install all backend dependencies
5. Make sure you have PostgreSQL installed or access via cloud.
6. Define your PostgreSQL Connection in /backend/file_env
7. Start backend ExpressJS using `node server.js` or `nodemon server.js` (`nodemon` is recomended because it has hot-reload function)
8. Define your frontend (NextJS) env in file /frontend/frontend_env
9. Start Development Frontend NextJS using `yarn dev` or `npm dev`

If you want to build the project, you can us `yarn build` or `next build` or `npm build`
It use Minify SWC for compiler, you can change it in `next.config.js`
By using SWC, the build output perform more than good, also it reduce the production build from `~700MB` to `~80MB` in .next directory itself.

## C. Create Backend Service In Windows

1. In terminal at root directory (/kasbon-js) use command '.\nssm install <service name> or kasbon-backend
2. GUI will open, specify Path to /backend/server.js
3. Click Install button
4. Makesure popup complete appear
5. check service in windwos services-> makesure there's service called 'kasbon-backend' or the service name specified by yourself
6. Makesure that the service start as windows start by right clicking the service name-> properties and startup type to 'Automatic'

## D. Create Frontend Service In Windows

1. Install ``` npm install pm2 -g ```
2. In frontend directory ``` pm2 start npm --name "< Service name>" -- start ```
3. Use ``` pm2 startup ``` and follow instruction to make it start as windows start

## E. Create Services in Ubuntu

1. For backend : create file in /etc/sytemd/system 'kasbon-backend.service'
2. Put this inside :
```
[Unit]
Description=ExpressJS Kasbon Backend Service

[Service]
WorkingDirectory=<your project directory>
ExecStart=sudo /usr/bin/node <path to project directory>/kasbon-js/backend/server.js
Restart=always
User=<your username>

[Install]
WantedBy=multi-user.target
```
3. Save

4. For Frontend : same as before, but ExecStart is ``` ExecStart=/usr/bin/npm run start ```
5. Save
6. To start at startup ``` sudo systemctl enable kasbon-frontend ``` & ``` sudo systemctl enable kasbon-backend ```






## F. Modules

- React NextJS
- MUI Core
- MUI Icons
- MUI Maerial
- ExpressJS
- Express-session
- Cors
- pg
- connect-pg-simple
- cookie-parser
- nodemon
- Docxtemplater
