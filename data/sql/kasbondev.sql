PGDMP     +    '            	    {            kasbon    15.4    15.4 :    F           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            G           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            H           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            I           1262    16397    kasbon    DATABASE     }   CREATE DATABASE kasbon WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kasbon;
                gesangpg    false            J           0    0    DATABASE kasbon    COMMENT     9   COMMENT ON DATABASE kasbon IS 'DB untuk website kasbon';
                   gesangpg    false    3401                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                pg_database_owner    false            K           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                   pg_database_owner    false    4            `           1247    16499    peran    TYPE     Q   CREATE TYPE public.peran AS ENUM (
    'super-admin',
    'admin',
    'user'
);
    DROP TYPE public.peran;
       public          postgres    false    4            W           1247    16454    r_quest    TYPE     9   CREATE TYPE public.r_quest AS ENUM (
    'Y',
    'N'
);
    DROP TYPE public.r_quest;
       public          postgres    false    4            T           1247    16448    s_bayar    TYPE     G   CREATE TYPE public.s_bayar AS ENUM (
    'Lunas',
    'Belum Lunas'
);
    DROP TYPE public.s_bayar;
       public          postgres    false    4            Q           1247    16442    s_metode    TYPE     D   CREATE TYPE public.s_metode AS ENUM (
    'Cash',
    'Transfer'
);
    DROP TYPE public.s_metode;
       public          postgres    false    4            �            1259    16428    admin_kasbon    TABLE     \  CREATE TABLE public.admin_kasbon (
    id_admin integer NOT NULL,
    nama_admin character varying(32) NOT NULL,
    email_admin character varying(32) NOT NULL,
    password_admin character varying(64) NOT NULL,
    tanggal timestamp with time zone NOT NULL,
    roles_admin character varying(12),
    id_petugas character varying(255) NOT NULL
);
     DROP TABLE public.admin_kasbon;
       public         heap    postgres    false    4            �            1259    16427    admin_id_admin_seq    SEQUENCE     �   CREATE SEQUENCE public.admin_id_admin_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.admin_id_admin_seq;
       public          postgres    false    4    215            L           0    0    admin_id_admin_seq    SEQUENCE OWNED BY     P   ALTER SEQUENCE public.admin_id_admin_seq OWNED BY public.admin_kasbon.id_admin;
          public          postgres    false    214            �            1259    16506    akun    TABLE     �   CREATE TABLE public.akun (
    id_akun integer NOT NULL,
    nama character varying(32) NOT NULL,
    email character varying(32) NOT NULL,
    password character varying(64) NOT NULL,
    roles public.peran NOT NULL,
    tanggal date
);
    DROP TABLE public.akun;
       public         heap    postgres    false    864    4            �            1259    16505    akun_id_akun_seq    SEQUENCE     �   CREATE SEQUENCE public.akun_id_akun_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.akun_id_akun_seq;
       public          postgres    false    223    4            M           0    0    akun_id_akun_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.akun_id_akun_seq OWNED BY public.akun.id_akun;
          public          postgres    false    222            �            1259    16467    bayar    TABLE       CREATE TABLE public.bayar (
    id_bayar integer NOT NULL,
    id_request integer NOT NULL,
    status_bayar character varying(255),
    tanggaljam timestamp with time zone,
    id_petugas character varying(255) NOT NULL,
    id_karyawan character varying(255) NOT NULL
);
    DROP TABLE public.bayar;
       public         heap    postgres    false    4            N           0    0    TABLE bayar    ACL     0   GRANT UPDATE ON TABLE public.bayar TO gesangpg;
          public          postgres    false    221            �            1259    16466    bayar_id_bayar_seq    SEQUENCE     �   CREATE SEQUENCE public.bayar_id_bayar_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.bayar_id_bayar_seq;
       public          postgres    false    4    221            O           0    0    bayar_id_bayar_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.bayar_id_bayar_seq OWNED BY public.bayar.id_bayar;
          public          postgres    false    220            �            1259    16460    request    TABLE     �  CREATE TABLE public.request (
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
       public         heap    postgres    false    4            P           0    0    TABLE request    ACL     2   GRANT UPDATE ON TABLE public.request TO gesangpg;
          public          postgres    false    219            �            1259    16435    user_kasbon    TABLE     ]  CREATE TABLE public.user_kasbon (
    id_user integer NOT NULL,
    nama_user character varying(255) NOT NULL,
    email_user character varying(255) NOT NULL,
    password_user character varying(255) NOT NULL,
    tanggal timestamp without time zone NOT NULL,
    roles_user character varying(12),
    id_karyawan character varying(255) NOT NULL
);
    DROP TABLE public.user_kasbon;
       public         heap    postgres    false    4            �            1259    16771    dashboard_karyawan    VIEW     �  CREATE VIEW public.dashboard_karyawan AS
 SELECT u.id_karyawan,
    ( SELECT uk.nama_user
           FROM public.user_kasbon uk
          WHERE ((uk.id_karyawan)::text = (u.id_karyawan)::text)
         LIMIT 1) AS nama_user,
    r.id_request,
    COALESCE(GREATEST((max(r.tanggaljam))::timestamp with time zone, max(b.tanggaljam)), ('1970-01-01 00:00:00'::timestamp without time zone)::timestamp with time zone) AS tanggaljam,
    COALESCE(sum(r.jumlah), (0)::bigint) AS jumlah,
    COALESCE(max((r.metode)::text), 'Tidak Ada Data'::text) AS metode,
    COALESCE(max((r.keterangan)::text), 'Tidak Ada Data'::text) AS keterangan,
    COALESCE(max((r.status_request)::text), 'Tidak Ada Data'::text) AS status_request,
    COALESCE(max((b.status_bayar)::text), 'Tidak Ada Data'::text) AS status_bayar
   FROM ((public.user_kasbon u
     LEFT JOIN public.request r ON (((u.id_karyawan)::text = (r.id_karyawan)::text)))
     LEFT JOIN public.bayar b ON ((r.id_request = b.id_request)))
  GROUP BY u.id_karyawan, r.id_request;
 %   DROP VIEW public.dashboard_karyawan;
       public          gesangpg    false    217    221    221    221    219    219    219    219    219    219    219    217    4            �            1259    16817    dashboard_komplit    VIEW     T  CREATE VIEW public.dashboard_komplit AS
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
       public          gesangpg    false    217    219    219    219    219    219    219    219    219    219    217    215    215    4            �            1259    16459    request_id_request_seq    SEQUENCE     �   CREATE SEQUENCE public.request_id_request_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.request_id_request_seq;
       public          postgres    false    4    219            Q           0    0    request_id_request_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.request_id_request_seq OWNED BY public.request.id_request;
          public          postgres    false    218            �            1259    16542    sessions    TABLE     �   CREATE TABLE public.sessions (
    sid character varying(32) NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);
    DROP TABLE public.sessions;
       public         heap    postgres    false    4            �            1259    16434    user_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.user_id_user_seq;
       public          postgres    false    4    217            R           0    0    user_id_user_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.user_id_user_seq OWNED BY public.user_kasbon.id_user;
          public          postgres    false    216            �           2604    16431    admin_kasbon id_admin    DEFAULT     w   ALTER TABLE ONLY public.admin_kasbon ALTER COLUMN id_admin SET DEFAULT nextval('public.admin_id_admin_seq'::regclass);
 D   ALTER TABLE public.admin_kasbon ALTER COLUMN id_admin DROP DEFAULT;
       public          postgres    false    215    214    215            �           2604    16509    akun id_akun    DEFAULT     l   ALTER TABLE ONLY public.akun ALTER COLUMN id_akun SET DEFAULT nextval('public.akun_id_akun_seq'::regclass);
 ;   ALTER TABLE public.akun ALTER COLUMN id_akun DROP DEFAULT;
       public          postgres    false    223    222    223            �           2604    16470    bayar id_bayar    DEFAULT     p   ALTER TABLE ONLY public.bayar ALTER COLUMN id_bayar SET DEFAULT nextval('public.bayar_id_bayar_seq'::regclass);
 =   ALTER TABLE public.bayar ALTER COLUMN id_bayar DROP DEFAULT;
       public          postgres    false    220    221    221            �           2604    16463    request id_request    DEFAULT     x   ALTER TABLE ONLY public.request ALTER COLUMN id_request SET DEFAULT nextval('public.request_id_request_seq'::regclass);
 A   ALTER TABLE public.request ALTER COLUMN id_request DROP DEFAULT;
       public          postgres    false    218    219    219            �           2604    16438    user_kasbon id_user    DEFAULT     s   ALTER TABLE ONLY public.user_kasbon ALTER COLUMN id_user SET DEFAULT nextval('public.user_id_user_seq'::regclass);
 B   ALTER TABLE public.user_kasbon ALTER COLUMN id_user DROP DEFAULT;
       public          postgres    false    216    217    217            :          0    16428    admin_kasbon 
   TABLE DATA           {   COPY public.admin_kasbon (id_admin, nama_admin, email_admin, password_admin, tanggal, roles_admin, id_petugas) FROM stdin;
    public          postgres    false    215   iJ       B          0    16506    akun 
   TABLE DATA           N   COPY public.akun (id_akun, nama, email, password, roles, tanggal) FROM stdin;
    public          postgres    false    223   �K       @          0    16467    bayar 
   TABLE DATA           h   COPY public.bayar (id_bayar, id_request, status_bayar, tanggaljam, id_petugas, id_karyawan) FROM stdin;
    public          postgres    false    221   UL       >          0    16460    request 
   TABLE DATA           �   COPY public.request (id_request, jumlah, metode, tanggaljam, id_karyawan, id_petugas, status_request, keterangan, status_b) FROM stdin;
    public          postgres    false    219   rL       C          0    16542    sessions 
   TABLE DATA           5   COPY public.sessions (sid, sess, expire) FROM stdin;
    public          postgres    false    224   �P       <          0    16435    user_kasbon 
   TABLE DATA           v   COPY public.user_kasbon (id_user, nama_user, email_user, password_user, tanggal, roles_user, id_karyawan) FROM stdin;
    public          postgres    false    217   �~       S           0    0    admin_id_admin_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_id_admin_seq', 9, true);
          public          postgres    false    214            T           0    0    akun_id_akun_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.akun_id_akun_seq', 3, true);
          public          postgres    false    222            U           0    0    bayar_id_bayar_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.bayar_id_bayar_seq', 1, false);
          public          postgres    false    220            V           0    0    request_id_request_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.request_id_request_seq', 46, true);
          public          postgres    false    218            W           0    0    user_id_user_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.user_id_user_seq', 10, true);
          public          postgres    false    216            �           2606    16690    user_kasbon User_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.user_kasbon
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id_karyawan);
 A   ALTER TABLE ONLY public.user_kasbon DROP CONSTRAINT "User_pkey";
       public            postgres    false    217            �           2606    16688    admin_kasbon admin_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.admin_kasbon
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id_petugas);
 A   ALTER TABLE ONLY public.admin_kasbon DROP CONSTRAINT admin_pkey;
       public            postgres    false    215            �           2606    16511    akun akun_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY public.akun
    ADD CONSTRAINT akun_pkey PRIMARY KEY (id_akun);
 8   ALTER TABLE ONLY public.akun DROP CONSTRAINT akun_pkey;
       public            postgres    false    223            �           2606    16472    bayar bayar_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT bayar_pkey PRIMARY KEY (id_bayar);
 :   ALTER TABLE ONLY public.bayar DROP CONSTRAINT bayar_pkey;
       public            postgres    false    221            �           2606    16624    user_kasbon id_karyawan_unique 
   CONSTRAINT     `   ALTER TABLE ONLY public.user_kasbon
    ADD CONSTRAINT id_karyawan_unique UNIQUE (id_karyawan);
 H   ALTER TABLE ONLY public.user_kasbon DROP CONSTRAINT id_karyawan_unique;
       public            postgres    false    217            �           2606    16626    admin_kasbon id_petugas_unique 
   CONSTRAINT     _   ALTER TABLE ONLY public.admin_kasbon
    ADD CONSTRAINT id_petugas_unique UNIQUE (id_petugas);
 H   ALTER TABLE ONLY public.admin_kasbon DROP CONSTRAINT id_petugas_unique;
       public            postgres    false    215            �           2606    16465    request request_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.request
    ADD CONSTRAINT request_pkey PRIMARY KEY (id_request);
 >   ALTER TABLE ONLY public.request DROP CONSTRAINT request_pkey;
       public            postgres    false    219            �           2606    16548    sessions sessions_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public            postgres    false    224            �           2606    16718    bayar fk_bayar_admin    FK CONSTRAINT     �   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT fk_bayar_admin FOREIGN KEY (id_petugas) REFERENCES public.admin_kasbon(id_petugas) NOT VALID;
 >   ALTER TABLE ONLY public.bayar DROP CONSTRAINT fk_bayar_admin;
       public          postgres    false    215    221    3225            �           2606    16493    bayar fk_bayar_request    FK CONSTRAINT     �   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT fk_bayar_request FOREIGN KEY (id_request) REFERENCES public.request(id_request);
 @   ALTER TABLE ONLY public.bayar DROP CONSTRAINT fk_bayar_request;
       public          postgres    false    3231    221    219            �           2606    16723    bayar fk_bayar_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT fk_bayar_user FOREIGN KEY (id_karyawan) REFERENCES public.user_kasbon(id_karyawan) NOT VALID;
 =   ALTER TABLE ONLY public.bayar DROP CONSTRAINT fk_bayar_user;
       public          postgres    false    217    221    3229            :   q  x�e�Mo�@���+\���0��J���T�J�5w3�� ����׸�59�{��ys��V��\�7�=�A��:�I'��e�$c4i�fų?H������_���b�P38�rW'��/�-Y��g6/ A��`t����,� ���b@l�ll���@�Ⱦl@w�k�~^k�tmp��#�/�-���)\�-�߫�$��޻Z�3����	�0������>Q8��n8q����4G������#��8J��߼�@E�����J�+��E�o��_��	95L�^�T1�bY.w���{�M��E��z��I@Bi��� Wl��ޯ�e2j�6^�S)�˭n��s��E��4�1?�EM�E��М      B   [   x�3�tO-N�K�L�+H,M)JtH�M���K���L�dr&��f�q��qC�+�U+x%V&B:���&g`�id`d�kh�k`����� E�%>      @      x������ � �      >      x����r�FEף��D�~�;;Urb��H����e���@v��O��@�0�Q w<u�N���F� ԯ�S����ѯ�� ��Y[k�-�V� X=�ۧ�I}����]?�\�Z��~�Y�4�焹�j �G����GQwG�Vz����y�!3�{� ��9Ce�%a�S�����3�s�mfU8�P!�kU�V9qfPz"���fWl���뷫u�\�����Uq��ģ�W� ����9���G$H���7U[��ֱP����F9 r�$��U*Zx?*Ҕ�Ϭ�<K�Q��j�>�!Rf��)� ذ�4}�V��r�|�,�}§���CGA0K�uQFL��%쎢�f=c�Abm���i���9{��,X������fq�c��
�r�q!;0M��L8_���.���������M�������]ݴ��>4u,�*�d�����)�r�r���rSH��Q��g�a�w����R�vh�ͺyi/7Nc���2:Z�����w�T��ؠ�`NV�!G�A���܏�x7���?�a�R�0ț1;�xѫG��hRsx���f:�D��ׇzUw�����v]�DE�l��綪��Q�H�
/$���Nt;?V�_��~�JlE��S)!���5f�=��"��OD���XҦ�l��C/��ij���]y��o(h����#n����R���c�st�j���'ڞ�(�+�Y�8�`Ў��gMz�6�C���g���+���ΐ���%r���ۻ��4�^]�g4�6!���S��$�����'A���AF���A���A�S�!��'v's<ab"����VOŶ�V����6��X+�-;�{-y��o��+�ڮle$iğ�,`B�Y>�ݷ��s�s:A�������7Cˎ�Q�q<G
f���G�v�c/��vXkXg�����3Q~������>��I�/� ����E��fJV��a���X�kS=nwqW��]��&;�0��7��"cyً�4�Ƿ6��sP�'
���
ƅy�}ͮ�����l      C      x�ݝI��ؒ��ͯ��닚y�U#BB�{f2fI������AʈU�v#Ib��j�U�L}���q�ヂ(+�i���E��Av�Xc�>\=D{����I���}���ߒ�\�V$�"�?����7�y\3/���!(C L��E�����ӷ~��C�G���EVz�����K/������_b�����$���惥�\6cY�/W�R[P��b��Ά@3�G�!0`bBxʩ��Js����0��/*Mlv:5���CP� f4A�a#�b4��D��;тზ�����u��,]�
6z៰�������W�����V�^v���K�1Y�&q/���5�?���WPx�e�<+K�緿~�?�]s��_�tu�VXއAh���u+z��O�ρ����Ff8��!'�|=	��O���8��8�[ F{$H�ҸM!��(���2]6$JV�eW�^*�V�f6��eJ�O~Ťӗ��{2���_g����R��+u����dd~��U��_�F�`�F)��:v����"�X�@z�#��OA�T6�;B��F}G!�[����pZ,�<�,la��:���+:3�%g$5J}��(�X5�-��=^е/>6�������\NR�?�z5@�]S�;WA�T�,�2f����O>],�:<7��l2Ð�k����F�0S�Jiu����;��{-�BQ�'���w�����}:�Q��4���N�b	T÷��fe}_�c�O��;L�Px�b$���*W��Td�^�ҽ��^���k���t6��F��Hw9I�T�-|�ʖ?�Q��l�{yrΧ���B��l(���p�3�P6�Z_V���E���;���Z��������`�[̏J�o��SAW3��Ⱜ
�:Nb��#����(��F=�P@.a�aT$T��|������~qg��ٙ���?����a�L�'[�K�ܖ-;gH2[g�<7b|h�=Uqڙ�dC�N�:^l4��/W�[˕{؉��Ə6ēG��+e)���^��3��Ʊ�b0�KǬaVw�k�y�0喃i#j.�f���2�QdFC���i�(��������h��B���%��2-�E3�F���a�m$GNR8zac�h2���c@%a�G�K�`d�mٳ�B	
��[�	Y	��=72�$��]9_�6J�����]pUbV
��47c�Ч�s�R��3I������۳3c*�(�G.s�E�c��w�c��/��!�{����f�ҋ���kA��fΩ�@�j^,�`��\
O;Gf�o$=�̂�6W٣!����ͬ:m-�m�E��6��Ia�A��ÙEB��)�C{I�����r��8�o��A����_�ֿo���\s�����{G��U������Z��������t����05�z7�����>�И���B� �`�/D�y{4��.�g?��d~�F�:�t��%���F!D.�}v�`��5Ύ}���!��N�@����%�U{<�!)�Χ��'��j<��in/[�WGf������a��4��t�Gf=J�>m��q˻*
˄wUgu�d����x����O��mEj�̓B���b��:�.�Un���D�l�5C�S����5}�I��9ZA�*���6��'�a�Ip|�����}c�-0��ǒV\p�m��)ϼ��AI��|�}�H��FԲ�o�@%+�эU�y���'-�R�͗��cϠ[s;-{��ؐ��H��q��2�E�BL|�o=�yL�`�m��^��?[�g�
������a�GŅ�����"�t
�9.�*�7���M@j\����o��㶈�Z:5��^�0{"0�=9�9�R[L��(Fz���{��u/��!`�KB�c%b�ݫj��(�!���s;�QbR��	6�G�q�l��U�o�lA��Bs1T����
#m�#���=6bM��0����D���R�^^�%��^�R���8O�C�ذ��P����[/�k~ N�6��SJ��B!���
I�^�Ͻ@��o� ���	�9?�<N�g1��W�ŉ��m���K�H����eS���0�[�:ˋ>��듟�������(��a-B��<��lX#>i9��>M� �6Ha�B��S4�z�����d~�0e"$`du�2����i6Y�ԭw�����K���
��ഴ��:�]�B��,H����a`� vӃ�"�����^8�z.�t"E�����.�������RŦ��!�v�S�-�t��eG�Ū�euU+�Nyd�1�B�d�#�� � �u�%Ć��R�$s��W�M����􌳿������6�� �̓-]΋�Y)KR8*��}umU*j�_�ֿo㜥�;,=��A�w�M��;�"�8=zAr·��?<\H@����p!���C������^爱Z�]����q�6�dM�ʝ��H�p1!A�}B,��h�(�����d~�0p��S��9�a��=�tݜ�i�XoC�co<^l7�>G��Gh!.����ّ�j�YM��^l���<�S�ue�C��!^��`[�Լ-0b�O4Û�}z8�[�̡��+�<�9�8�::�d���������u\��}�H��x�냜�̕*]T�r��'(�w��!#nt߭c0]����M��P?e�eyr�?�Dp�5�|ۈ��[2�n�5�����s�8ܺt�;�l�`L����>��XH�յ
!��R�F�¹���l����d��~�D��߅<�vL�+3��'D^_l�w���XO�#gc�lRk��z���)M��:k	W�>�ބ�I�6ܵ�N���C�H�BaeZ#}J��ye����X��g7l�ϨF�;�Wל�%Q�mŞ_W)��6~t�T�����3���:�@da�]���q!C���3ɺKW��yQM�X��F̠�������=#�A�m�����.��;iZ��w�z+��a㒆ɧ�~�F��� ���*��0t��.��5}9K0=#������;u{����AF����;��7�˝�n��x�OGf�bP/M�R��3R�3��S��L;6&�%�L�ނ�lA��a`�r�
$��Z�R�w<���0���x��0�ߧ�%�ŵBy�[T�����4~ i�.T�ٖ/6�7n��!�y؉uq��;!آc�ׇyX�Eq��
�fH�_��q���&�I����*�1{�����M���*'�&f���~�&G�A��-Ć�c����[&t�s!̻�U����f�ٝ�޲����a#Fؽ/��C���j��q�l�R�[��YT��Sͮ{�K�(蓳�O�`=�$����~;i ����gf��q��-}�@"iЦPt1��)"�^�����$��e�j��6�R�Nt�.�����Z����H�%��-��J�yc��s����\)|���ݧ��b��Y�l����A�7�T�\lݤpBm^��va��7����I��`��C�E�^$�C�zaB��`�ӫ��6Y~� �,2�R�.��fҟ�3��T׋�@R;��p�F�j��0/w���c&(�
��/a�?s��f�D�x��� �.��Cx�pG-
�q�Aq��:��d~�F�K�ν��J$�"��d+l����x�.�_k��%��x(�Wt��J����U�R��l]��CmE'�(��z�b|Q2��I��@=���:
E�b�EAo\njB|�=�)
�K:y��ؐ��[���Í��jK���Cm��w��m0E��b0����vs�2�א,V���i{���3�7\��ai�f�Z\���[Z�J����XM���R�Pz�=Q/F]�'���9��='O���4�dS�i&��
���dwC/�$��Z��b~vNĢ-���� A�OfÇ�A|ܽ$�����j�@]�h���6���:����o�/`���qdR]/֟��J)��k�g9v��{��Me�i.��`��}Q����h�ީܡٜ>0MU�]H5�`�9�K�ۗ�a#B��亳5a�IY�aBqi��J��Ü/�    	���[��Ԯ�}���}�	ǆ��fi���N(�������=�M�8���G�4�z8Ԧ�Q>�V�ϫ	5�ol��C�(\yc�Q�|���ش�+�l��%�r�js-<S����G���ؖ���kA�u��R��~o�)���d�S�t(�ı��y�0˽�?������]��Z��r�>;Nا�����ofc��ݛ�(��Ў��� �؎kQa��_��I�k�{O�%r��Jb�(��]X�ڹsߩ�/Y#j�����!�;g-t�X�1��)�%]�!t?����w�?�����e�Qõ�v/�z��m�Mf:R�^w�!�.`��Z���������go��*}l_-"�R�-	��0Gi�1G�f��+z��mhlh���d�$�'䲲oJ\p1$��x���d���6�x�ņ�.z']�!�M��s��� �tPlkG��^��#Ö�X�K�D�R]R���F;���W*��{.O�v��F��+>���1j����?�^]�:����y;�(��	l�?)P�1�@!�")��8�H�!��iҁ�����@M�S��Hҷy�t[��y뛖Z�ZC�2�\-�\�w^h
�,��I��&"��*���cz`��>�Vq�t0pdF��j}:8
tgp]����	��ٙ� XI���nZ����lO6�ck�m���\C4��՗�:+��r8+�O^���`�nc�x�y?[���<����yH�]���(٬�d~`�?��͌*�P��б-�h�i�AA%p��܇�.I�kt�������i�L�d�|�!~P�_F�����5t߯ol0 5��Fi��Q٬�e�e��<�$�Py��A����˱w�9u/:���ܱ���Z$�œ0o��tG�fи{ç��ÀL�;�������R�+g�ө���M��|gS���&�"�ѝO��y����*[���e��F<�E{�yl~/�>l�.�ohja���2��k�b���~Қ��x��!��*�g�a^g�!��ޱ��d �9��H/x��zcC�>:P>C EG-�ΫuK���ɮt,�3�~ŷS�>��tx��8@��v���d�Eth�E���W���մ$�'�(wv?�0И6ǉbk=.r��K��Up�v|l����3�7�7�� ����p�B"^�JWY4�ܠpK��4⃳M c����l/�*�6�|��b2�2�|�#q'�l�lZ'����gָ�,O;� �<V��Jo���٠��n�544n�9�ol�[lp�4�7r���}굑�$�:��M�Yvjr��
��̍G�P"�䂚[m�?c0��\��I���]$M�<ن�t���d�Ϭ�����B��7�J��Hoז����U�/��	O����C�+Ǒ'���n����S;1_��F�w/�|���O�2�j��#���hEe��,�l�(����� �wg4>���[G�[�t�q��b~�o<7�Sz�aM�Y�j�#m֬�}�i$�[�����P8�@���}�����H�'�6S��T�F����K����7dD����ֿo8�<��:�7�P������^�i��|F�c/��+�Jw���u�.�\I�/m�.�����zZ'���j���htl>0�/+ ��Cy}�;4���#����ޙ�ܞ_�y�ĿC��҈Ex.H�0�;�Z0�����z�/�v�&���t�yN��ۇ�j�͍6,<;ƪ�6�!���3�y�0�!����<���M�Q,V�}����F�(�9rOCgȎ���c�c��j�K��%�n_%Q7��Z��%�e �F�ڎGr��|6Z��1���I���+1����6(��AX��� ����ӥ�R�!�{�e�.��n<��헟m�z%�	��p#BA孍�뼼��2��m�}	ۧ���f�D��Pua�h�H�i����I%a�����5���i����y};�M�[yę5�g��H��d����R�l��V%����n֖h�Z�P�a�y�.}��3l\��`�(`�ߛSK5�0�v����oHR�b}rF9>:�qs�S��>0��5�p�炠 �ZїuA���~Z���}�p� �ذMx�_�!@����	�(�
�c�_�~M���B���F�M+"�+��e2,u�^ߥ/Y��~ߓm��GE�P�)��&sQ�1������Na����&�n6p�ŜK. w<Qr;ƒ�U��sGY9�nZ��{bوx��;T�iZծ�	�>���j�Ep��Mי\�������pJur��Xu�;��xq}�[�5ɂ����Rr��k�L�js�w�VƑ�a�C�����cB���τ<9��兎Al��(6�m]�/��H��8���;>�G4yg#�t.C"f=����zA���,oX1RHT&$߼�3x����F�����q]�R]�)jrM�>��uȳ����N֫j����d�,?+-�<2�ؙ�P��V����c�\�չ� v�s�'��}��Jʔ9��Ѳ��3��6t|��m^hY\3�իA�ǐZr�
�l($�%C���H ��f�����{�Z��ڭ�K}k�e����6�^�#ۨ{�w6�|Y���$4k��c�?��V]������l#\�ld��\�g)Zu���_%�ŭ9a��	���6f���Q�^wf(�����%���B>�$��׼oȈ΅�b�7R\C[��eLo�L��]�bzh���{��l�o�)ꪐB����G�e޶�`�B�7ueHz���B㭟���#H�s}�3Yg;��1���m����fZ���y����h`+���p���v�B%
��6Y�z���S�	��S�F�x��H����p���e��*w��w���
svBnË{M�c�l�/4��yŜs�E��w;��6:̇�9�o̓�>�-����a�u�����c�?>�� ��^&4C�?y�������c94�Q0
Z>b��E���-F��r�k2?]�D�{�pխ]R�#�8����#�4+�2��~=h��F�=��Y��L�fP�#����B��e��d+lpe{�>��Ƈ�5��)}BF?�	ںd-�@�΂bڻ	�ol6�Fd��!8�(&���]���`�
,$&e���腟V��dC�4����kЌ���k;:���d.&>o�cY5��,���t1yc��>�K��k��\,
ֹn2zp���Y.��_�yZ�2t�ҿo�����s�K����
�O.��!�oչ8���sO��r?���mPFȸL����B(����A'Q�0�<a�r`�z�����5��,�&Ϋ�Uiyp��'�eA ������OH���,c�o}`�n|s��L�Y����m����:<R��Ɇ��C�J�۳C3N��f��w�B�I�x���Ih�b_���ٰ����!��?G���a���v񬂜[�<�l5�2�❭7@?�n��7�Ҳ�Qh����Mve��Ζ�2I�������ѣ�t���i�[�(Vۅ��T��2��9�fZ�	�_�aE�<���������"7�����u������i�h�6r��6��X��uq��
��A�8�4��}f�7_lÈ����Q�87� ��f����2�p�;䁑�=Nh$��FΠ��l x��
�6��[��TH���
�$?5�"�W5�KӋ�C �4%�s+QLZ4+ �����-������w6r��� ��FV�	�T�sv9�j-�}��q푬骜j�`�H��}�Lt��es>_Bmm9Zǘ�4�6)��Ʋ�����Ƭ/6p
�]�O�$9E/!�����?t<��ߞl�o<����b�DW�+�d,sٹ�1�p����i���z�F��
ֳ�O1���A���vI�ɘMr��ߝ֗/`�{w���1y��A0�Y�O[�#?L��=

�(vpߥ�2���d~�Fx��;�4ϛ���
\����tq\�_���3rDq�;Dh���:�DZ^g�p�q��/Ve]M� ����+jD^�[����� F,�r�2��� B  h�R&�۴ ���Txc#L�(�uC�����	�=��۫��1��ʓ}�d�����
�R&�Y�r%�!z/�@���a����l#:!}`;,2ۼ5�rYY�h�M]s�fN� ;2���-�s/�cה�Ba�Q�[2���򘿴�e�k�s:�+1�s>�l��h��Ɔ��&n�����������<0��F�9'��ѱ����ΣN`|�iܝ�m��h��]ʱ�g�vz�Q3��1R?c����JW7��B������ �KO�BiBG��l���m/^�Ķ���Q����|Ȯ�&ӳ�3�2�CA���mÀf��|=���q�d	Z>b��2��{~�T�Gu�z��0 ��|��z��ra���Ia-�E0n�E�;ۨ�e�b��	]yuA9<������Nax�xaZ\�ņ�j�o�b� !\��'t���=�W����ޭ$�9�5u�o�b��#ϬA������.�`}��&&�}lw����0-���fĸ���s�q�h����9������]�ߝ�؛O{c#G��~`�vD&d�힁��#_��k��zK�i�]��!Y�@0�D�dA����A�>Z�EM,�͹�-���"ZL����F���^lA�g=#���#A/��gz"���i�O�~���B^l`��I[��J�ƘnH��^ �2TX�0�~c#Gt���f_�S�.P�=�b�eϕ{IT��da����v�[��x�#��̕}�@M��1����+���A���Qɩ/6�v�q
J�yӻL6����v��̄��l��X�ۼ�V|��(�R�}]׉����z�.<O��~�ѽ>�_x6Fn�
]?*�~N�(IyU(��d$�(��vM��6���~�8E����p�y��2_8�5Nc<%M(4�����U�5,"�b 3B�7nt#�8��U��u��cIt�1aX�6�3��7���되큖Oz f�H�C�!A9>YE���د��t���;�?xzm1TJ��G.�l'%��X#|������ N'�p(eh�0C�]Eky�,�.t&4%yc���F_l�D��#A���{���bL��<*� �N)~�aCC���n0́0E���s��ti��r]����e��I���l�����@%�D�5��2va�P�`�������!���46��!�OVD
g��q�.[�םS&��7{���I>�;�{��sH�^��z ��[���x��kӠ�>7��Yˆ?;�k0/�hԄ]}<�me��`��D�����F<͌�z>��� e��-rs-���ʩC��[��7�m�}��F=���=���<�M��ky�$h�ת$�+.1y?5Pb�>;=���
Co��)�R6g��	�o�>;R�,1���E}�T3����:�8��b �h�u� ܁0.��:��!m����ֶ�Iu�?ذ�v���
ǧ��h�h��l�`=̧<
�P��Kq���d�p ]�D��Z���ݕ�#w^R�����&5�&fC��l�01;�6��<:X��iRw�:1v����c���:$��:��l(
Tל��[+;D���:_�,H�ol��մ��h��]�(=O=�(�H�le��E��;�������$c�Lj�4< �9tp\�w|� �����kT�j�R�P!�ڝ�i�^lX>~���7�	0�[5����K���I��|t-��H�`��K��/��d�`��X%J��=�)�?c�1pJH�ė�~_'4�}_�^'��ygÀ�q��EQʁ��B��}��yO���M�	|cñ1���ǁfw�����<2V�8
�f^��<,�ⴳ����BJj,�p�
h�G��%+AP#�*_0�.$�"N� ꓺ濳}j�����O��my����෋>>�Z����e�a�F�I�C���C8��4j!�E���.�$��U�2�x7A��x�r�b��k��ʙ�)�ǪP3z\��`#�PT���>�q6$�X��H�����,�76�!�<��+�[Pn��qd�&ۂծVqU\�7M�Y����:}��R@�5���ЀPr�cG��U�nQx1�'��GFz�/�ޫǴ�UM?�J�[A��A_9Z��}	9�5��_	�k{]�C��X��WH�ͬx�0��hlT.�)��wo+P�t�Ԭ��9���wkT�ۄ�;>�-勍 ����f�V[.�h{3=y����a�N��ذ0r�>
���8.�-�ʺp[��;�1%��bq)�I3��>���'k���Z۟6޽��>=����d�i�������"g(9{��?xrL��0m����i�7�<CPȅp�������O�Gl�ۃ���7���2 i��j"�����mP��@]���hm�q�-3ZQ���lD��d+tH��!�u�T��fZ��5���֫M�*To��=!;�����F �U�F�k~}��%�v�A<�k*���Oj:��1�}̋m�[KZ�wm����ȜSO��A�+*3�њ4�c`#�73�a@����:��pC5�'qg)���TY0��'�⿳��ݸ9�/6
�d��v"v�N�������o�*��)٭�l��9n����6������:��+V0OsY�%^Də�F=�4��I�O1��-�<s��[����^C�oU��I��^l��"|�^���=ݥ�w/�E��i�X� ��ɉ��5�7x\K�<�G��fJ����8A�2�[*���:����nc# �`'�<y2�� Ӛ�i�[px�����V���s�R�1b��hK��1�� ���O�hT޽�ec���	�[�En{�Z����':�o�Bl��,�Q��:6H�(�.�9�������d~�F+D�l�7����V~��e>����E _kD��1��F\�Bϔ]���A��b	�����ڸl^�Kǲ�b@$��oh�����z��A�a���<O=�����Q�n��U�CUi�E"C��N��c��x�X4�0�Zܫ	U3/6�9w}�.%�b$`���4�ƱC��#���6#N�fR���:��#Z��ؐ�S�(C��s�-e��%���y�=��z�F�4���c3d�(�'�a����EI֗61�f�h�%펄��pO���؈="���D�fs�<wR�9�gW�S}�
�0ےl�M��~�=��gĸ��S�NAv*�6�[�½�Qs(4���#6i^�m�������
_��J�k�Ͱ2�Q֎�p��3\l*���n��ԓ��y8������c+�� d`5[����UL/��>�#>R����j�8��t0W5ҭ6Zej��"$娛v�@?g��#G�b��n&&f��������j��g1�Cq�u�F��`�z_x���b�.i��+OW��l9�$9-/�"O� �P����6vM��M�
��d�Z$T"��/
O��l\M��}�H��ϭ}xF�/���ڭ�fR'%��d���̍���7�غ$1�4N�\ӛL\r�n��<�����<L��������+̷[��1S�\�f�Pl �箠�'�7dнԸ@�5�  C�RKK�����������|.Z�s=y&�s�:*��}���� �oA��      <   \  x�e�OS�@����*:xm������B'�Y:2]Z�MSy�5�8S����3���j���t]Wj����NK\�4����`1מ��7��q(����p�$s�y����x�d��sh��}�j^�~E�C��L,5-���z�B b�v*W��\��b�n�oey��m{�Nv��o����j?�ƣE�o����`��l
H�$��\�mjH4ڪvUW-*ǥ�yY�,�e��$�贷����?w��aL��*�e�8uq+��q��'�P�-S0&Ͼi@qU,��Q��K^>t��}e�t�����qz�(��w)$�,���z�f�u�i�Z����8`cK2��3���	���     