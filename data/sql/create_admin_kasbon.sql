-- Table: public.admin_kasbon

-- DROP TABLE IF EXISTS public.admin_kasbon;

CREATE TABLE IF NOT EXISTS public.admin_kasbon
(
    id_admin integer NOT NULL DEFAULT nextval('admin_id_admin_seq'::regclass),
    nama_admin character varying(32) COLLATE pg_catalog."default" NOT NULL,
    email_admin character varying(32) COLLATE pg_catalog."default" NOT NULL,
    password_admin character varying(64) COLLATE pg_catalog."default" NOT NULL,
    tanggal timestamp with time zone NOT NULL,
    roles_admin character varying(12) COLLATE pg_catalog."default",
    id_petugas character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT admin_pkey PRIMARY KEY (id_petugas),
    CONSTRAINT id_petugas_unique UNIQUE (id_petugas)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.admin_kasbon
    OWNER to postgres;