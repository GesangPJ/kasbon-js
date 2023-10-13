-- Table: public.request

-- DROP TABLE IF EXISTS public.request;

CREATE TABLE IF NOT EXISTS public.request
(
    id_request integer NOT NULL DEFAULT nextval('request_id_request_seq'::regclass),
    jumlah integer NOT NULL,
    metode character varying(255) COLLATE pg_catalog."default",
    tanggaljam timestamp without time zone NOT NULL,
    id_karyawan character varying(255) COLLATE pg_catalog."default" NOT NULL,
    id_petugas character varying(255) COLLATE pg_catalog."default",
    status_request character varying(255) COLLATE pg_catalog."default",
    keterangan character varying(255) COLLATE pg_catalog."default" NOT NULL,
    status_b character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT request_pkey PRIMARY KEY (id_request)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.request
    OWNER to postgres;

REVOKE ALL ON TABLE public.request FROM gesangpg;

GRANT UPDATE ON TABLE public.request TO gesangpg;

GRANT ALL ON TABLE public.request TO postgres;