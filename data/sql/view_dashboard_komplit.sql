CREATE OR REPLACE VIEW dashboard_komplit AS
SELECT
    u.id_karyawan,
    (
        SELECT nama_user
        FROM user_kasbon uk
        WHERE uk.id_karyawan = u.id_karyawan
        LIMIT 1
    ) AS nama_user,
    r.id_request, -- Include id_request
    (
        SELECT req.id_petugas
        FROM request req
        WHERE req.id_request = r.id_request
        LIMIT 1
    ) AS id_petugas, -- Include id_petugas from request
    (
        SELECT a.nama_admin
        FROM admin_kasbon a
        WHERE a.id_petugas = (
            SELECT req.id_petugas
            FROM request req
            WHERE req.id_request = r.id_request
            LIMIT 1
        )
        LIMIT 1
    ) AS nama_admin, -- Include nama_admin from admin_kasbon
    (
        SELECT req.status_request
        FROM request req
        WHERE req.id_request = r.id_request
        LIMIT 1
    ) AS status_request, -- Include status_request from request
    COALESCE(
        MAX(r.tanggaljam),
        '1970-01-01'::timestamp
    ) AS tanggaljam,
    COALESCE(SUM(r.jumlah), 0) AS jumlah,
    COALESCE(MAX(r.metode), 'Tidak Ada Data') AS metode,
    COALESCE(MAX(r.keterangan), 'Tidak Ada Data') AS keterangan,
    COALESCE(MAX(r.status_b), 'Tidak Ada Data') AS status_b -- Use status_b from request
FROM user_kasbon u
LEFT JOIN request r ON u.id_karyawan = r.id_karyawan
GROUP BY u.id_karyawan, r.id_request; -- Include id_request in GROUP BY
