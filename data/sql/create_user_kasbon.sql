-- Table: public.user_kasbon

-- DROP TABLE IF EXISTS public.user_kasbon;

CREATE TABLE IF NOT EXISTS public.user_kasbon
(
    id_user integer NOT NULL DEFAULT nextval('user_id_user_seq'::regclass),
    nama_user character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email_user character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password_user character varying(255) COLLATE pg_catalog."default" NOT NULL,
    tanggal timestamp without time zone NOT NULL,
    roles_user character varying(12) COLLATE pg_catalog."default",
    id_karyawan character varying(255) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY (id_karyawan),
    CONSTRAINT id_karyawan_unique UNIQUE (id_karyawan)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_kasbon
    OWNER to postgres;