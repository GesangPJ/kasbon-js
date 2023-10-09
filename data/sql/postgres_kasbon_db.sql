PGDMP     8                	    {            kasbon    15.4    15.4 4    :           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ;           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            <           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            =           1262    16397    kasbon    DATABASE     }   CREATE DATABASE kasbon WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kasbon;
                postgres    false            >           0    0    DATABASE kasbon    COMMENT     9   COMMENT ON DATABASE kasbon IS 'DB untuk website kasbon';
                   postgres    false    3389            ^           1247    16499    peran    TYPE     Q   CREATE TYPE public.peran AS ENUM (
    'super-admin',
    'admin',
    'user'
);
    DROP TYPE public.peran;
       public          postgres    false            U           1247    16454    r_quest    TYPE     9   CREATE TYPE public.r_quest AS ENUM (
    'Y',
    'N'
);
    DROP TYPE public.r_quest;
       public          postgres    false            R           1247    16448    s_bayar    TYPE     G   CREATE TYPE public.s_bayar AS ENUM (
    'Lunas',
    'Belum Lunas'
);
    DROP TYPE public.s_bayar;
       public          postgres    false            O           1247    16442    s_metode    TYPE     D   CREATE TYPE public.s_metode AS ENUM (
    'Cash',
    'Transfer'
);
    DROP TYPE public.s_metode;
       public          postgres    false            �            1259    16428    admin_kasbon    TABLE     	  CREATE TABLE public.admin_kasbon (
    id_admin integer NOT NULL,
    nama_admin character varying(32) NOT NULL,
    email_admin character varying(32) NOT NULL,
    password_admin character varying(64) NOT NULL,
    tanggal date,
    roles character varying(12)
);
     DROP TABLE public.admin_kasbon;
       public         heap    postgres    false            �            1259    16427    admin_id_admin_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.admin_id_admin_seq;
       public          postgres    false    215            ?           0    0    admin_id_admin_seq    SEQUENCE OWNED BY     P   ALTER SEQUENCE public.admin_id_admin_seq OWNED BY public.admin_kasbon.id_admin;
          public          postgres    false    214            �            1259    16506    akun    TABLE     �   CREATE TABLE public.akun (
    id_akun integer NOT NULL,
    nama character varying(32) NOT NULL,
    email character varying(32) NOT NULL,
    password character varying(64) NOT NULL,
    roles public.peran NOT NULL,
    tanggal date
);
    DROP TABLE public.akun;
       public         heap    postgres    false    862            �            1259    16505    akun_id_akun_seq    SEQUENCE     �   CREATE SEQUENCE public.akun_id_akun_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.akun_id_akun_seq;
       public          postgres    false    223            @           0    0    akun_id_akun_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.akun_id_akun_seq OWNED BY public.akun.id_akun;
          public          postgres    false    222            �            1259    16467    bayar    TABLE     �   CREATE TABLE public.bayar (
    id_bayar integer NOT NULL,
    id_request integer NOT NULL,
    status_bayar public.s_bayar,
    tanggal date,
    id_admin integer NOT NULL,
    id_user integer NOT NULL
);
    DROP TABLE public.bayar;
       public         heap    postgres    false    850            �            1259    16466    bayar_id_bayar_seq    SEQUENCE     �   CREATE SEQUENCE public.bayar_id_bayar_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.bayar_id_bayar_seq;
       public          postgres    false    221            A           0    0    bayar_id_bayar_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.bayar_id_bayar_seq OWNED BY public.bayar.id_bayar;
          public          postgres    false    220            �            1259    16460    request    TABLE     �   CREATE TABLE public.request (
    id_request integer NOT NULL,
    jumlah integer NOT NULL,
    metode public.s_metode,
    tanggal date,
    id_user integer NOT NULL,
    id_admin integer NOT NULL
);
    DROP TABLE public.request;
       public         heap    postgres    false    847            �            1259    16459    request_id_request_seq    SEQUENCE     �   CREATE SEQUENCE public.request_id_request_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.request_id_request_seq;
       public          postgres    false    219            B           0    0    request_id_request_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.request_id_request_seq OWNED BY public.request.id_request;
          public          postgres    false    218            �            1259    16542    sessions    TABLE     �   CREATE TABLE public.sessions (
    sid character varying(32) NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);
    DROP TABLE public.sessions;
       public         heap    postgres    false            �            1259    16435    user_kasbon    TABLE       CREATE TABLE public.user_kasbon (
    id_user integer NOT NULL,
    nama_user character varying(255) NOT NULL,
    email_user character varying(255) NOT NULL,
    password_user character varying(255) NOT NULL,
    tanggal date,
    roles character varying(12)
);
    DROP TABLE public.user_kasbon;
       public         heap    postgres    false            �            1259    16434    user_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.user_id_user_seq;
       public          postgres    false    217            C           0    0    user_id_user_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.user_id_user_seq OWNED BY public.user_kasbon.id_user;
          public          postgres    false    216            �           2604    16431    admin_kasbon id_admin    DEFAULT     w   ALTER TABLE ONLY public.admin_kasbon ALTER COLUMN id_admin SET DEFAULT nextval('public.admin_id_admin_seq'::regclass);
 D   ALTER TABLE public.admin_kasbon ALTER COLUMN id_admin DROP DEFAULT;
       public          postgres    false    214    215    215            �           2604    16509    akun id_akun    DEFAULT     l   ALTER TABLE ONLY public.akun ALTER COLUMN id_akun SET DEFAULT nextval('public.akun_id_akun_seq'::regclass);
 ;   ALTER TABLE public.akun ALTER COLUMN id_akun DROP DEFAULT;
       public          postgres    false    222    223    223            �           2604    16470    bayar id_bayar    DEFAULT     p   ALTER TABLE ONLY public.bayar ALTER COLUMN id_bayar SET DEFAULT nextval('public.bayar_id_bayar_seq'::regclass);
 =   ALTER TABLE public.bayar ALTER COLUMN id_bayar DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    16463    request id_request    DEFAULT     x   ALTER TABLE ONLY public.request ALTER COLUMN id_request SET DEFAULT nextval('public.request_id_request_seq'::regclass);
 A   ALTER TABLE public.request ALTER COLUMN id_request DROP DEFAULT;
       public          postgres    false    219    218    219            �           2604    16438    user_kasbon id_user    DEFAULT     s   ALTER TABLE ONLY public.user_kasbon ALTER COLUMN id_user SET DEFAULT nextval('public.user_id_user_seq'::regclass);
 B   ALTER TABLE public.user_kasbon ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    217    216    217            .          0    16428    admin_kasbon 
   TABLE DATA           i   COPY public.admin_kasbon (id_admin, nama_admin, email_admin, password_admin, tanggal, roles) FROM stdin;
    public          postgres    false    215   �9       6          0    16506    akun 
   TABLE DATA           N   COPY public.akun (id_akun, nama, email, password, roles, tanggal) FROM stdin;
    public          postgres    false    223   5:       4          0    16467    bayar 
   TABLE DATA           _   COPY public.bayar (id_bayar, id_request, status_bayar, tanggal, id_admin, id_user) FROM stdin;
    public          postgres    false    221   �:       2          0    16460    request 
   TABLE DATA           Y   COPY public.request (id_request, jumlah, metode, tanggal, id_user, id_admin) FROM stdin;
    public          postgres    false    219   �:       7          0    16542    sessions 
   TABLE DATA           5   COPY public.sessions (sid, sess, expire) FROM stdin;
    public          postgres    false    224   �:       0          0    16435    user_kasbon 
   TABLE DATA           d   COPY public.user_kasbon (id_user, nama_user, email_user, password_user, tanggal, roles) FROM stdin;
    public          postgres    false    217   �:       D           0    0    admin_id_admin_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_id_admin_seq', 2, true);
          public          postgres    false    214            E           0    0    akun_id_akun_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.akun_id_akun_seq', 3, true);
          public          postgres    false    222            F           0    0    bayar_id_bayar_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.bayar_id_bayar_seq', 1, false);
          public          postgres    false    220            G           0    0    request_id_request_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.request_id_request_seq', 1, false);
          public          postgres    false    218            H           0    0    user_id_user_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.user_id_user_seq', 4, true);
          public          postgres    false    216            �           2606    16433    admin_kasbon admin_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY public.admin_kasbon
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id_admin);
 A   ALTER TABLE ONLY public.admin_kasbon DROP CONSTRAINT admin_pkey;
       public            postgres    false    215            �           2606    16511    akun akun_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.akun
    ADD CONSTRAINT akun_pkey PRIMARY KEY (id_akun);
 8   ALTER TABLE ONLY public.akun DROP CONSTRAINT akun_pkey;
       public            postgres    false    223            �           2606    16472    bayar bayar_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT bayar_pkey PRIMARY KEY (id_bayar);
 :   ALTER TABLE ONLY public.bayar DROP CONSTRAINT bayar_pkey;
       public            postgres    false    221            �           2606    16465    request request_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (id_request);
 >   ALTER TABLE ONLY public.request DROP CONSTRAINT request_pkey;
       public            postgres    false    219            �           2606    16548    sessions sessions_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public            postgres    false    224            �           2606    16440    user_kasbon user_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.user_kasbon
    ADD CONSTRAINT user_pkey PRIMARY KEY (id_user);
 ?   ALTER TABLE ONLY public.user_kasbon DROP CONSTRAINT user_pkey;
       public            postgres    false    217            �           2606    16522    bayar fk_bayar_admin    FK CONSTRAINT     �   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT fk_bayar_admin FOREIGN KEY (id_admin) REFERENCES public.admin_kasbon(id_admin);
 >   ALTER TABLE ONLY public.bayar DROP CONSTRAINT fk_bayar_admin;
       public          postgres    false    221    3215    215            �           2606    16493    bayar fk_bayar_request    FK CONSTRAINT     �   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT fk_bayar_request FOREIGN KEY (id_request) REFERENCES public.request(id_request);
 @   ALTER TABLE ONLY public.bayar DROP CONSTRAINT fk_bayar_request;
       public          postgres    false    221    3219    219            �           2606    16527    bayar fk_bayar_user    FK CONSTRAINT     }   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT fk_bayar_user FOREIGN KEY (id_user) REFERENCES public.user_kasbon(id_user);
 =   ALTER TABLE ONLY public.bayar DROP CONSTRAINT fk_bayar_user;
       public          postgres    false    3217    217    221            �           2606    16532    request fk_request_admin    FK CONSTRAINT     �   ALTER TABLE ONLY public.request
    ADD CONSTRAINT fk_request_admin FOREIGN KEY (id_admin) REFERENCES public.admin_kasbon(id_admin);
 B   ALTER TABLE ONLY public.request DROP CONSTRAINT fk_request_admin;
       public          postgres    false    3215    215    219            �           2606    16537    request fk_request_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.request
    ADD CONSTRAINT fk_request_user FOREIGN KEY (id_user) REFERENCES public.user_kasbon(id_user);
 A   ALTER TABLE ONLY public.request DROP CONSTRAINT fk_request_user;
       public          postgres    false    219    217    3217            .   F   x�3�tO-N�KWH,M)JT�J�L�L9���&g�%��B
�9���ut�9Sr3�b���� DpT      6   [   x�3�tO-N�K�L�+H,M)JtH�M���K���L�dr&��f�q��qC�+�U+x%V&B:���&g`�id`d�kh�k`����� E�%>      4      x������ � �      2      x������ � �      7      x������ � �      0   Y   x�3�,-N-2��%��z�����F�&�f��FFƺ���`%\�B��Lŧ�'�s�$��%"i�Hdbh����� �-�     