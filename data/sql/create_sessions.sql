-- Table: public.sessions

-- DROP TABLE IF EXISTS public.sessions;

CREATE TABLE IF NOT EXISTS public.sessions
(
    sid character varying(32) COLLATE pg_catalog."default" NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (sid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.sessions
    OWNER to postgres;