CREATE OR REPLACE VIEW dashboard_karyawan AS
SELECT
    u.id_karyawan,
    (
        SELECT nama_user
        FROM user_kasbon uk
        WHERE uk.id_karyawan = u.id_karyawan
        LIMIT 1
    ) AS nama_user,
    r.id_request, -- Include id_request
    COALESCE(
        GREATEST(
            MAX(r.tanggaljam),
            MAX(b.tanggaljam)
        ),
        '1970-01-01'::timestamp
    ) AS tanggaljam,
    COALESCE(SUM(r.jumlah), 0) AS jumlah,
    COALESCE(MAX(r.metode), 'Tidak Ada Data') AS metode,
    COALESCE(MAX(r.keterangan), 'Tidak Ada Data') AS keterangan,
    COALESCE(MAX(r.status_request), 'Tidak Ada Data') AS status_request,
    COALESCE(MAX(b.status_bayar), 'Tidak Ada Data') AS status_bayar
FROM user_kasbon u
LEFT JOIN request r ON u.id_karyawan = r.id_karyawan
LEFT JOIN bayar b ON r.id_request = b.id_request
GROUP BY u.id_karyawan, r.id_request; -- Include id_request in GROUP BY
