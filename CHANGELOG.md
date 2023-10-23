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
