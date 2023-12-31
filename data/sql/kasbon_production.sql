PGDMP  .    %            	    {            kasbon_production    16.0    16.0 &    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16501    kasbon_production    DATABASE     �   CREATE DATABASE kasbon_production WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
 !   DROP DATABASE kasbon_production;
                postgres    false            �            1259    16531    admin_kasbon    TABLE     \  CREATE TABLE public.admin_kasbon (
    id_admin integer NOT NULL,
    nama_admin character varying(32) NOT NULL,
    email_admin character varying(32) NOT NULL,
    password_admin character varying(64) NOT NULL,
    tanggal timestamp with time zone NOT NULL,
    roles_admin character varying(12),
    id_petugas character varying(255) NOT NULL
);
     DROP TABLE public.admin_kasbon;
       public         heap    postgres    false            �            1259    16534    admin_id_admin_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.admin_id_admin_seq;
       public          postgres    false    215            �           0    0    admin_id_admin_seq    SEQUENCE OWNED BY     P   ALTER SEQUENCE public.admin_id_admin_seq OWNED BY public.admin_kasbon.id_admin;
          public          postgres    false    216            �            1259    16535    akun    TABLE     �   CREATE TABLE public.akun (
    id_akun integer NOT NULL,
    nama character varying(32) NOT NULL,
    email character varying(32) NOT NULL,
    password character varying(64) NOT NULL,
    roles public.peran NOT NULL,
    tanggal date
);
    DROP TABLE public.akun;
       public         heap    postgres    false            �            1259    16538    akun_id_akun_seq    SEQUENCE     �   CREATE SEQUENCE public.akun_id_akun_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.akun_id_akun_seq;
       public          postgres    false    217            �           0    0    akun_id_akun_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.akun_id_akun_seq OWNED BY public.akun.id_akun;
          public          postgres    false    218            �            1259    16545    request    TABLE     �  CREATE TABLE public.request (
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
       public         heap    postgres    false            �            1259    16550    user_kasbon    TABLE     ]  CREATE TABLE public.user_kasbon (
    id_user integer NOT NULL,
    nama_user character varying(255) NOT NULL,
    email_user character varying(255) NOT NULL,
    password_user character varying(255) NOT NULL,
    tanggal timestamp without time zone NOT NULL,
    roles_user character varying(12),
    id_karyawan character varying(255) NOT NULL
);
    DROP TABLE public.user_kasbon;
       public         heap    postgres    false            �            1259    16560    dashboard_komplit    VIEW     T  CREATE VIEW public.dashboard_komplit AS
 SELECT u.id_karyawan,
    ( SELECT uk.nama_user
           FROM public.user_kasbon uk
          WHERE ((uk.id_karyawan)::text = (u.id_karyawan)::text)
         LIMIT 1) AS nama_user,
    r.id_request,
    ( SELECT req.id_petugas
           FROM public.request req
          WHERE (req.id_request = r.id_request)
         LIMIT 1) AS id_petugas,
    ( SELECT a.nama_admin
           FROM public.admin_kasbon a
          WHERE ((a.id_petugas)::text = (( SELECT req.id_petugas
                   FROM public.request req
                  WHERE (req.id_request = r.id_request)
                 LIMIT 1))::text)
         LIMIT 1) AS nama_admin,
    ( SELECT req.status_request
           FROM public.request req
          WHERE (req.id_request = r.id_request)
         LIMIT 1) AS status_request,
    COALESCE(max(r.tanggaljam), '1970-01-01 00:00:00'::timestamp without time zone) AS tanggaljam,
    COALESCE(sum(r.jumlah), (0)::bigint) AS jumlah,
    COALESCE(max((r.metode)::text), 'Tidak Ada Data'::text) AS metode,
    COALESCE(max((r.keterangan)::text), 'Tidak Ada Data'::text) AS keterangan,
    COALESCE(max((r.status_b)::text), 'Tidak Ada Data'::text) AS status_b
   FROM (public.user_kasbon u
     LEFT JOIN public.request r ON (((u.id_karyawan)::text = (r.id_karyawan)::text)))
  GROUP BY u.id_karyawan, r.id_request;
 $   DROP VIEW public.dashboard_komplit;
       public          postgres    false    219    220    215    215    219    219    219    219    219    220    219    219    219            �            1259    16565    request_id_request_seq    SEQUENCE     �   CREATE SEQUENCE public.request_id_request_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.request_id_request_seq;
       public          postgres    false    219            �           0    0    request_id_request_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.request_id_request_seq OWNED BY public.request.id_request;
          public          postgres    false    222            �            1259    16566    sessions    TABLE     �   CREATE TABLE public.sessions (
    sid character varying(32) NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);
    DROP TABLE public.sessions;
       public         heap    postgres    false            �            1259    16571    user_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.user_id_user_seq;
       public          postgres    false    220            �           0    0    user_id_user_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.user_id_user_seq OWNED BY public.user_kasbon.id_user;
          public          postgres    false    224            3           2604    16572    admin_kasbon id_admin    DEFAULT     w   ALTER TABLE ONLY public.admin_kasbon ALTER COLUMN id_admin SET DEFAULT nextval('public.admin_id_admin_seq'::regclass);
 D   ALTER TABLE public.admin_kasbon ALTER COLUMN id_admin DROP DEFAULT;
       public          postgres    false    216    215            4           2604    16573    akun id_akun    DEFAULT     l   ALTER TABLE ONLY public.akun ALTER COLUMN id_akun SET DEFAULT nextval('public.akun_id_akun_seq'::regclass);
 ;   ALTER TABLE public.akun ALTER COLUMN id_akun DROP DEFAULT;
       public          postgres    false    218    217            5           2604    16575    request id_request    DEFAULT     x   ALTER TABLE ONLY public.request ALTER COLUMN id_request SET DEFAULT nextval('public.request_id_request_seq'::regclass);
 A   ALTER TABLE public.request ALTER COLUMN id_request DROP DEFAULT;
       public          postgres    false    222    219            6           2604    16576    user_kasbon id_user    DEFAULT     s   ALTER TABLE ONLY public.user_kasbon ALTER COLUMN id_user SET DEFAULT nextval('public.user_id_user_seq'::regclass);
 B   ALTER TABLE public.user_kasbon ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    224    220            �          0    16531    admin_kasbon 
   TABLE DATA           {   COPY public.admin_kasbon (id_admin, nama_admin, email_admin, password_admin, tanggal, roles_admin, id_petugas) FROM stdin;
    public          postgres    false    215   e1       �          0    16535    akun 
   TABLE DATA           N   COPY public.akun (id_akun, nama, email, password, roles, tanggal) FROM stdin;
    public          postgres    false    217   �1       �          0    16545    request 
   TABLE DATA           �   COPY public.request (id_request, jumlah, metode, tanggaljam, id_karyawan, id_petugas, status_request, keterangan, status_b) FROM stdin;
    public          postgres    false    219   f2       �          0    16566    sessions 
   TABLE DATA           5   COPY public.sessions (sid, sess, expire) FROM stdin;
    public          postgres    false    223   �2       �          0    16550    user_kasbon 
   TABLE DATA           v   COPY public.user_kasbon (id_user, nama_user, email_user, password_user, tanggal, roles_user, id_karyawan) FROM stdin;
    public          postgres    false    220   ;       �           0    0    admin_id_admin_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_id_admin_seq', 1, true);
          public          postgres    false    216            �           0    0    akun_id_akun_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.akun_id_akun_seq', 1, false);
          public          postgres    false    218            �           0    0    request_id_request_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.request_id_request_seq', 1, false);
          public          postgres    false    222            �           0    0    user_id_user_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.user_id_user_seq', 1, true);
          public          postgres    false    224            @           2606    16578    user_kasbon User_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.user_kasbon
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id_karyawan);
 A   ALTER TABLE ONLY public.user_kasbon DROP CONSTRAINT "User_pkey";
       public            postgres    false    220            8           2606    16580    admin_kasbon admin_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.admin_kasbon
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id_petugas);
 A   ALTER TABLE ONLY public.admin_kasbon DROP CONSTRAINT admin_pkey;
       public            postgres    false    215            <           2606    16582    akun akun_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.akun
    ADD CONSTRAINT akun_pkey PRIMARY KEY (id_akun);
 8   ALTER TABLE ONLY public.akun DROP CONSTRAINT akun_pkey;
       public            postgres    false    217            B           2606    16586    user_kasbon id_karyawan_unique 
   CONSTRAINT     `   ALTER TABLE ONLY public.user_kasbon
    ADD CONSTRAINT id_karyawan_unique UNIQUE (id_karyawan);
 H   ALTER TABLE ONLY public.user_kasbon DROP CONSTRAINT id_karyawan_unique;
       public            postgres    false    220            :           2606    16588    admin_kasbon id_petugas_unique 
   CONSTRAINT     _   ALTER TABLE ONLY public.admin_kasbon
    ADD CONSTRAINT id_petugas_unique UNIQUE (id_petugas);
 H   ALTER TABLE ONLY public.admin_kasbon DROP CONSTRAINT id_petugas_unique;
       public            postgres    false    215            >           2606    16590    request request_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (id_request);
 >   ALTER TABLE ONLY public.request DROP CONSTRAINT request_pkey;
       public            postgres    false    219            D           2606    16592    sessions sessions_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public            postgres    false    223            �   �   x�3�tL���S�N,N���Lq����N�$Cߤ\��lc׈\ߢ$'�H���d�r��\���Ҋ�W��̜�Ds/߈�J'oN##c]C]CKCs+cK+=KC#sms�U���\1z\\\ dN&�      �   [   x�3�tO-N�K�L�+H,M)JtH�M���K���L�dr&��f�q��qC�+�U+x%V&B:���&g`�id`d�kh�k`����� E�%>      �      x������ � �      �   r  x�ݘY��H���_��uA�F.^��.��a����v��zbfNW�9�驫*��|�o�7�+�G[��a:���m4���
5�p>�_~/9��6�J��K�(�X�J�>ᔀ���=Na�]J�����ZV��1Y�>J�8>i�]R*����(��x�*~+���/���
�K&��V�����L�~��1�B��gMmZ�틲�2�
('[*c�=����9x^.^U{誃��ok꼃�)���l\Z�N���'��J�SiMkS��5��K�7��@As�$9mG��ՅR���3ˆ;5Z4�~�S=��������d������2�(]/^t���&�J�ѯ=�b�*��
w�����c%U}������G)�T>W��.tW��z�V�駱uk��gP��o�G��Q�PI�r.�o�^�
�}���Ȍ�\&��3�Z�&�gg�%���Ь�`�7���as�P�%�[ka�[g�nw��@���2,��]%my���7�ڭ��G�SA6��U� ���2��n��9�/��z7����<�s�������w����BX>�����L(Pe�PG���)ᾍ,�mJ�����45��k_��7.CB�����hlɭhh�2�
�jδIeD:�jfM뷄|����%�k�~}��FgP�-�E�8'[*#R���C�\vs���d�֭�i�WAc0�(/Uj^�TF%p�>>"��s���DɚԆ(p��J�Bl�@Vn��:��K��!;���J�h���Sk6�C�V�I�\<j�l�B�ɖ)%�4��������msdU�6�=,�B_l�+ �cy�!!�M����6�k<<����m-Ͷ?��b.�ņ�BX.��b�B�ߓ�X��`,&�HVc]�IQ��-�ر�b#\�<Wy�!i��؏��sw[Yc&��^g�7ܟqQ6��)�W��%�REs��l\Ӧ��Y�٘����r��x[����p�7�R���I��qQ�k��Zأ�Z�:Yl��yq6@xn6%p���aD:�N�dw�[�m��Jg4���]q6�)���!��K���z��<}ݰz��e뜧��C�ߏ�%�.Ȗ�x��B�:�di��+C�V�U�6>yIӨ�ڬaν���6��o���kf���Մe/|��^�����<X���Ee�x0��@�ˈ��LWe˶\�AH��أ�[�c�/�2j��a֦����:�-��0�fU�gѸ���)D��Q�L��[O�'���H���[��L*g��l�Q����ǖɈ���7�٤/�'d��&W��浲�ڍ�U���]�7�g湞�TUV�k��,� ��	 �A�����i��˩}�{꺯��vaV���aS{�媮����U4.8�``�r�ή��ݼ�MT���0��լ�=kw2�E��'��a����r���`&���d��d�z@��%g~L�e\N|���jq�%�j��T�,��a���2f��{�g2.u��ޜ�u���������
��=,8��d��������S�۲�`U&�q�s���>���ܿ�/~L�Eh�t�Ow�>��g�1�N��=�Z��^a��
�&r/6���D�Pcg۫UE\o��fG��{+�*��T� 5J�D󹵎fN�t���� 7��:�)9���&ir������.U�6Oٟ������i�*����=eï�y|d2(�O�7�E;��� �攇݆,�����zq6���[*Ò|����~/���������$oaK�ϰ�4�ނ�?�����@���\���բc�l�@�l\��4:_W}
�d��?����MF��6��l*��7���ޝ9�aټ�n��<��瘂���nE�w�IZ����/���uܖ}$��2�{=�:�yo@�=�qi��=l0�U���Zy���D�^�0�y��B_��}���{��Z�O6�t=Y��կ�*7��N�n8�=}�9Z�d��fS&�=�í��m�tf��n�St��'[�q�'[��W�J�� ���G���[��k��F�f����Moa˘��X�hp����=�[+9������?��u�[�ί��kYڹ>�01d��7��T�M躵^_�Ԭ�#>��wD��mz����lEU�J�T$I�w(��      �   �   x�3�-N-R�N,N���,���l��N�$C�*��D�g�������T�����@��$�� ���`�RߔTsG?���$�$�Dg#N##c]C]CKCs++Ss=Cs#�5�ކ\1z\\\ >�$     