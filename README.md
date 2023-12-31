# KASBON WEBSITE







https://github.com/GesangPJ/kasbon-js/assets/26625652/8bb10cce-d277-4b27-99b2-d8cdadfbe962







Website berbasis NodeJS bertujuan untuk mengelola Kasbon, menggunakan NextJS untuk frontend (client-side), dan ExpressJS untuk backend (server-side),data kasbon dan akun dimasukkan dan dikelola dengan database PostgreSQL v16. 

**Ingin menggunakan aplikasi ini pada usaha anda ? dan/ source code aplikasi untuk tujuan komersial? Buka issue baru-> feature request-> masukkan detail permintaan**

**Want to use this application and or the source code for commercial purposes? open new issue->feature request-> input your request details**

## Daftar halaman pada aplikasi
#### A. Halaman Karyawan
1. Halaman Dashboard Karyawan
2. Halaman Input Kasbon oleh Karyawan

#### B. Halaman Admin:
1. Halaman Dashboard Admin
2. Halaman Request (Persetujuan Kasbon)
3. Halaman Bayar (Konfirmasi Bayar/Lunas)
4. Halaman Download Bukti Kasbon (Download ke Docx)
5. Halaman Laporan Kasbon (Bisa langsung print)
6. Halaman tambah akun admin
7. Halaman tambah akun karyawan
8. Halaman daftar admin (beserta fitur ganti password)
9. Halaman daftar karyawan

## Web Features
1. Backend session using express-session
2. Password Hashing using bcrypt
3. API Key
4. Cookies
5. CORS
6. Docx download
7. Print report

## Changelog

- _Build means it's tested and safe to build the project_
- _Preview means this version has not been built yet_

### v1.7.5-BUILD

- Add print function for Laporan Kasbon Karyawan
- Add print function for Laporan Kasbon Seluruh Karyawan
- Move Jumlah total, total kasbon, sisa kasbon outside table
- Cleanup backend
- Re-test API Key
- Re-test backend from process hang [No hang, all request complete]

### v1.7.0-BUILD

- Add API Authorization function
- Rebuild Docker image
- Rebuild Docker compose
- Cleanup backend code
- Rebuild frontend ENV
- Rebuild backend ENV

### v1.5.0-BUILD

- Add Laporan Page for Each Karyawan
- Add Row Jumlah Total, Total Kasbon, Sisa Kasbon for Table Laporan Kasbon Karyawan
- Add Laporan Page for All Karyawan
- Add Excel export function for both

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

### POSTGRES SETUP

1. Access to your postgres using postgres account
2. Create new database named `kasbondev` for using development test data
3. Create new database named `kasbon_production` for production empty kasbon data
4. Click right to database namem click restore
5. Navigate to project dir/data/sql/kasbondev.sql to get development and test data, in option enable Do Not Save Owner
6. For kasbon_production same as kasbondev
7. If error occured, refresh database, and check if the table admin_kasbon, user_kasbon is exist, if it's exist, it's safe 

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
