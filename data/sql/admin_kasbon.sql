PGDMP     %    !        	    	    {            kasbon    15.4    15.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            !           1262    16397    kasbon    DATABASE     }   CREATE DATABASE kasbon WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kasbon;
                gesangpg    false            "           0    0    DATABASE kasbon    COMMENT     9   COMMENT ON DATABASE kasbon IS 'DB untuk website kasbon';
                   gesangpg    false    3361            �            1259    16428    admin_kasbon    TABLE     \  CREATE TABLE public.admin_kasbon (
    id_admin integer NOT NULL,
    nama_admin character varying(32) NOT NULL,
    email_admin character varying(32) NOT NULL,
    password_admin character varying(64) NOT NULL,
    tanggal timestamp with time zone NOT NULL,
    roles_admin character varying(12),
    id_petugas character varying(255) NOT NULL
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
       public          postgres    false    215            #           0    0    admin_id_admin_seq    SEQUENCE OWNED BY     P   ALTER SEQUENCE public.admin_id_admin_seq OWNED BY public.admin_kasbon.id_admin;
          public          postgres    false    214            �           2604    16431    admin_kasbon id_admin    DEFAULT     w   ALTER TABLE ONLY public.admin_kasbon ALTER COLUMN id_admin SET DEFAULT nextval('public.admin_id_admin_seq'::regclass);
 D   ALTER TABLE public.admin_kasbon ALTER COLUMN id_admin DROP DEFAULT;
       public          postgres    false    215    214    215                      0    16428    admin_kasbon 
   TABLE DATA           {   COPY public.admin_kasbon (id_admin, nama_admin, email_admin, password_admin, tanggal, roles_admin, id_petugas) FROM stdin;
    public          postgres    false    215   �       $           0    0    admin_id_admin_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_id_admin_seq', 9, true);
          public          postgres    false    214            �           2606    16688    admin_kasbon admin_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.admin_kasbon
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id_petugas);
 A   ALTER TABLE ONLY public.admin_kasbon DROP CONSTRAINT admin_pkey;
       public            postgres    false    215            �           2606    16626    admin_kasbon id_petugas_unique 
   CONSTRAINT     _   ALTER TABLE ONLY public.admin_kasbon
    ADD CONSTRAINT id_petugas_unique UNIQUE (id_petugas);
 H   ALTER TABLE ONLY public.admin_kasbon DROP CONSTRAINT id_petugas_unique;
       public            postgres    false    215               �   x��ϱ
�0�����p�DsɤS�S��+V�Z�-����K[8����a_��o�cx^cHa�<�R4S]�d5t@J�,�
�N	S�bo�'+���B�vm%"	�X���?,���G��1紱�`(�4/�a����Iֹ������i���a��E��.A��h$/�A��H!��$Vl     