PGDMP         "        	    	    {            kasbon    15.4    15.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16397    kasbon    DATABASE     }   CREATE DATABASE kasbon WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kasbon;
                gesangpg    false                        0    0    DATABASE kasbon    COMMENT     9   COMMENT ON DATABASE kasbon IS 'DB untuk website kasbon';
                   gesangpg    false    3359            �            1259    16460    request    TABLE     �  CREATE TABLE public.request (
    id_request integer NOT NULL,
    jumlah integer NOT NULL,
    metode character varying(255),
    tanggaljam timestamp without time zone NOT NULL,
    id_karyawan character varying(255) NOT NULL,
    id_petugas character varying(255),
    status_request character varying(255),
    keterangan character varying(255) NOT NULL,
    status_b character varying(255)
);
    DROP TABLE public.request;
       public         heap    postgres    false            �            1259    16459    request_id_request_seq    SEQUENCE     �   CREATE SEQUENCE public.request_id_request_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.request_id_request_seq;
       public          postgres    false    219            !           0    0    request_id_request_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.request_id_request_seq OWNED BY public.request.id_request;
          public          postgres    false    218            �           2604    16463    request id_request    DEFAULT     x   ALTER TABLE ONLY public.request ALTER COLUMN id_request SET DEFAULT nextval('public.request_id_request_seq'::regclass);
 A   ALTER TABLE public.request ALTER COLUMN id_request DROP DEFAULT;
       public          postgres    false    218    219    219                      0    16460    request 
   TABLE DATA           �   COPY public.request (id_request, jumlah, metode, tanggaljam, id_karyawan, id_petugas, status_request, keterangan, status_b) FROM stdin;
    public          postgres    false    219   �       "           0    0    request_id_request_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.request_id_request_seq', 33, true);
          public          postgres    false    218            �           2606    16465    request request_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (id_request);
 >   ALTER TABLE ONLY public.request DROP CONSTRAINT request_pkey;
       public            postgres    false    219               �  x����n�0E��W��3|s�hA7m��J��%� _�Aņ蔠���;3�H�y�F�"{ �@u�
f�Ω́<R�����2�.��n�����ٳ�gג�غ�A�#5P�{䏲Yx��HQ��� ���Ww���C��ͨ�Q�ǒ�NA��z|��� Y�ʀZd��\HM��@0���ٝn�\����"*Q�ɨ��,S�f$NH��tU�����,~�S7�8Z�s����%8C� (>�� �mz6�Ҫ��q��ɺ����9�X���X�kd��ݚ4����{��_W�2bL,-�u%9���@ƅT:�X�p˴�47�k3�ዞ��q��_��Iq�R91��R&��Ǿ�e�_�.��PH��Is��R��w}U���XIXjU�hQY�9�D�P��e{*F~��,9]fvй6�ٽ��4�Uѽ��ZV1U�D295�ܻ�Ƿ� s' �rfQ�����Y�-���}�~����;H�܄�3��b�Y���1@��p�jA�� G}��Y���lͅ�[��B,_��Ze,�Wgw�C֔�{	�
�錾�K���~���CٷelHȺ��rϻ���,=j���@�������n$Ew2zcqj���):�է�i�>u,����h3GC�AnB}WK�=G��D��h++�&&��v;^u>���J��f��������D���#�Rx�j�4�Y9����)�     