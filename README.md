# KASBON WEBSITE [v1.0.5-Build]

<img src="https://github.com/GesangPJ/kasbon-js/blob/main/frontend/public/images/ss/desktop-dashboard-admin.png" width = "600" height = "300" >

Website untuk manajemen Kasbon

#### Features

- Account auth using express-session
- Session storage
- Add Kasbon
- Edit Kasbon
- Set Request
- Set Bayar
- Additional 2 VIEW tables

### Changelog

- -Build means it's safe to build the project

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

## C. Modules

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
