PGDMP     	                	    {            kasbon    15.4    15.4 8    F           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            G           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            H           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            I           1262    16397    kasbon    DATABASE     }   CREATE DATABASE kasbon WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kasbon;
                gesangpg    false            J           0    0    DATABASE kasbon    COMMENT     9   COMMENT ON DATABASE kasbon IS 'DB untuk website kasbon';
                   gesangpg    false    3401            `           1247    16499    peran    TYPE     Q   CREATE TYPE public.peran AS ENUM (
    'super-admin',
    'admin',
    'user'
);
    DROP TYPE public.peran;
       public          postgres    false            W           1247    16454    r_quest    TYPE     9   CREATE TYPE public.r_quest AS ENUM (
    'Y',
    'N'
);
    DROP TYPE public.r_quest;
       public          postgres    false            T           1247    16448    s_bayar    TYPE     G   CREATE TYPE public.s_bayar AS ENUM (
    'Lunas',
    'Belum Lunas'
);
    DROP TYPE public.s_bayar;
       public          postgres    false            Q           1247    16442    s_metode    TYPE     D   CREATE TYPE public.s_metode AS ENUM (
    'Cash',
    'Transfer'
);
    DROP TYPE public.s_metode;
       public          postgres    false            �            1259    16428    admin_kasbon    TABLE     \  CREATE TABLE public.admin_kasbon (
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
       public          postgres    false    215            K           0    0    admin_id_admin_seq    SEQUENCE OWNED BY     P   ALTER SEQUENCE public.admin_id_admin_seq OWNED BY public.admin_kasbon.id_admin;
          public          postgres    false    214            �            1259    16506    akun    TABLE     �   CREATE TABLE public.akun (
    id_akun integer NOT NULL,
    nama character varying(32) NOT NULL,
    email character varying(32) NOT NULL,
    password character varying(64) NOT NULL,
    roles public.peran NOT NULL,
    tanggal date
);
    DROP TABLE public.akun;
       public         heap    postgres    false    864            �            1259    16505    akun_id_akun_seq    SEQUENCE     �   CREATE SEQUENCE public.akun_id_akun_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.akun_id_akun_seq;
       public          postgres    false    223            L           0    0    akun_id_akun_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.akun_id_akun_seq OWNED BY public.akun.id_akun;
          public          postgres    false    222            �            1259    16467    bayar    TABLE       CREATE TABLE public.bayar (
    id_bayar integer NOT NULL,
    id_request integer NOT NULL,
    status_bayar character varying(255),
    tanggaljam timestamp with time zone,
    id_petugas character varying(255) NOT NULL,
    id_karyawan character varying(255) NOT NULL
);
    DROP TABLE public.bayar;
       public         heap    postgres    false            M           0    0    TABLE bayar    ACL     0   GRANT UPDATE ON TABLE public.bayar TO gesangpg;
          public          postgres    false    221            �            1259    16466    bayar_id_bayar_seq    SEQUENCE     �   CREATE SEQUENCE public.bayar_id_bayar_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.bayar_id_bayar_seq;
       public          postgres    false    221            N           0    0    bayar_id_bayar_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.bayar_id_bayar_seq OWNED BY public.bayar.id_bayar;
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
       public         heap    postgres    false            O           0    0    TABLE request    ACL     2   GRANT UPDATE ON TABLE public.request TO gesangpg;
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
       public         heap    postgres    false            �            1259    16771    dashboard_karyawan    VIEW     �  CREATE VIEW public.dashboard_karyawan AS
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
       public          gesangpg    false    217    221    221    221    219    219    219    219    219    219    219    217            �            1259    16817    dashboard_komplit    VIEW     T  CREATE VIEW public.dashboard_komplit AS
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
       public          gesangpg    false    217    219    219    219    219    219    219    219    219    219    217    215    215            �            1259    16459    request_id_request_seq    SEQUENCE     �   CREATE SEQUENCE public.request_id_request_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.request_id_request_seq;
       public          postgres    false    219            P           0    0    request_id_request_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.request_id_request_seq OWNED BY public.request.id_request;
          public          postgres    false    218            �            1259    16542    sessions    TABLE     �   CREATE TABLE public.sessions (
    sid character varying(32) NOT NULL,
    sess json NOT NULL,
    expire timestamp without time zone NOT NULL
);
    DROP TABLE public.sessions;
       public         heap    postgres    false            �            1259    16434    user_id_user_seq    SEQUENCE     �   CREATE SEQUENCE public.user_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.user_id_user_seq;
       public          postgres    false    217            Q           0    0    user_id_user_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.user_id_user_seq OWNED BY public.user_kasbon.id_user;
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
    public          postgres    false    215   �H       B          0    16506    akun 
   TABLE DATA           N   COPY public.akun (id_akun, nama, email, password, roles, tanggal) FROM stdin;
    public          postgres    false    223   J       @          0    16467    bayar 
   TABLE DATA           h   COPY public.bayar (id_bayar, id_request, status_bayar, tanggaljam, id_petugas, id_karyawan) FROM stdin;
    public          postgres    false    221   �J       >          0    16460    request 
   TABLE DATA           �   COPY public.request (id_request, jumlah, metode, tanggaljam, id_karyawan, id_petugas, status_request, keterangan, status_b) FROM stdin;
    public          postgres    false    219   �J       C          0    16542    sessions 
   TABLE DATA           5   COPY public.sessions (sid, sess, expire) FROM stdin;
    public          postgres    false    224   fN       <          0    16435    user_kasbon 
   TABLE DATA           v   COPY public.user_kasbon (id_user, nama_user, email_user, password_user, tanggal, roles_user, id_karyawan) FROM stdin;
    public          postgres    false    217   $y       R           0    0    admin_id_admin_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_id_admin_seq', 9, true);
          public          postgres    false    214            S           0    0    akun_id_akun_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.akun_id_akun_seq', 3, true);
          public          postgres    false    222            T           0    0    bayar_id_bayar_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.bayar_id_bayar_seq', 1, false);
          public          postgres    false    220            U           0    0    request_id_request_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.request_id_request_seq', 42, true);
          public          postgres    false    218            V           0    0    user_id_user_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.user_id_user_seq', 10, true);
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
       public          postgres    false    217    221    3229            :   q  x�e�Mo�@���+\���0��J���T�J�5w3�� ����׸�59�{��ys��V��\�7�=�A��:�I'��e�$c4i�fų?H������_���b�P38�rW'��/�-Y��g6/ A��`t����,� ���b@l�ll���@�Ⱦl@w�k�~^k�tmp��#�/�-���)\�-�߫�$��޻Z�3����	�0������>Q8��n8q����4G������#��8J��߼�@E�����J�+��E�o��_��	95L�^�T1�bY.w���{�M��E��z��I@Bi��� Wl��ޯ�e2j�6^�S)�˭n��s��E��4�1?�EM�E��М      B   [   x�3�tO-N�K�L�+H,M)JtH�M���K���L�dr&��f�q��qC�+�U+x%V&B:���&g`�id`d�kh�k`����� E�%>      @      x������ � �      >   �  x����r�6E��W�b�'w�Ty�qM��H�l #R/&���i>@K�aQ;�����nH`�8��'����?����s@��fO�K�#��.��R^��z[���0��~� ئ<��0��Þ 7�B`�U����@�����l}��C���:��+���2<�]�MX�ɭ�0"ŀA��Um]ҧ�0�"u#I���\K�/\P2��5U��G0Wy�Q���9M_��K_n�����&�=C(��Bp�b��_~�ˀq���MA��(��1 P*ml aDzd��r�;���%��>D��>�%�8h�8Wp=0���%���vS�M��iB�B�f�.Ms������cݴ��>7u(V3��b�(�)P�N��;����*w���]z�(n�)��:r6Vu"��4o�2S��H.�N:%b�N��uxg�KŔ����sA�b�r�K�|.O�)>O����{0L�A�B:zsDcFY��CO�J��HQ� �KR�;���:���u
>�]�"A�"%t��׶��nOo Yw&��]�Z|�W���i�Ҹ	�#R�SS����א;��*�p=,O@�{�=�(�PǨsOq�55�j�<���(h�L#'�����	�0m�FKcĕ�	s��`{"Q 3A����mԢE��Ͷ��GZ���/+�ZB7H��@�\r�~z�Y f��v�M�NQc�+I:1d��<qt� %��AJ"����fF��i|J5�*���UϘ0�����u����W�u��S�<m�5�J��1��7��j��=���(���i	�7�v_<�o)����O?zz";U��%���S1��oe۽�f2%���ʜ�4p�{f�/����P�a*}�{�8.!����.$�E��7"8���j8���I!�b� ��t��ʾ��[��Ϗ�� �%�8\N�^D�i-�CZ�����EW('��Ew;]tgޗ|�Z�=��      C      x�՝Y��ֶ���_q��]��O� 	� �3 � 1t�o�*��T�*L���8��s��b��^�VU���O>���+�f��2��ϻ�.�������������#//�������	E`��׿�����?����!���E������?��G\�w�v�Y���_ܝ:$�������׿��&^bp�q[��;GC�be�����:P�X�w��h�@�d6,LH�u�=\mo�Ůa�U���voPs�`�O��&�)l�K������x#:0��
XC�����cH���^@�O�����g��������Q��Ɇ/��)�.�� s.������Gu������<}}�����Kż���.��$���� �{�ܢ�I?>����{$���#�~ȫ��ȓ`�	�r� 'p��):�Aw)��ż��1]�?���-���6F9qu�k�Sv��t�GA���)�/���$0d�+3����>���1GV�����b�����b��￁�\�(>��
�p��9W$o�TW�@1ד�&��t.�'B/��F��B@ ���f�*��u�ie�Z�3�%$5I}��(��l�k~#���M(ݷ���جܞ\�R���5@N]S�O.�e��;*򏌹�,��C�^�xi%��0d�!��C���n�Cx��ѭ����x�n��O$������&��Q���O��?[�#P��Ct�|47v�9��t�ɆP���'��(F~��z���w�F,Fi��B.	��!��6�H�@�)yZ����Sw�K
t�2#�r��φ��&�� F-�c6zW���X?����3��<��6�m�(6��{��b3�m�lN�Šw�.�̿���/���z�A��`���	F��1�7ǒ����2����L'�ټn�ͦ�qf��;C��:��6�a���5��k�؜�E&�8�5X~r�/���6~ɰ&���l��=��CX�_.%���-f;�ʹ���,;�mV�Ȃ�&�o/�E���^B�����UT��e��qPAS6b��vȰ��M�C�5UI1yY�i�Ŋ;і2�K��ʓ>�N�oa������f	P�'���<��\w�Ԭ�L��z��w���>������
��_rdR�%7���~��_?e����v2��y��#jp$^2���ru�U�Ƈ�ܳ~x�����L<�1�cn#�>r��ZHXuz�I��!_�����x4,Hz�0����KC���iwy!(4hCbqn�;��=�?!|�!�~��υA� v��Wl��|pFl���{aP��rw��{�1��Np�ߺ�C�?��v��s=���1z������� �qֿ��1l�M8��l�68��j�sKI~l�ܙ�p���Yk��g�!�ȟ=�_ߧ=��p%�q����)�D����_))����{�&�2_���J_O%K�[�VR��*	����'�6<���dÀ�ϲ3]�J�e����������L{�/�fÆ0�!�~.��1�\�#qNN�Y��C��jY+�0�?�|n�'_~=4�'F���?����~6��̸�&��N��]�J������}{��>"h0���|�b'H��в�'?��~їZ��_�ha?�����]	Iǃ� i21�wA
C]
���?��� گ��pa�������<�H��^w��~���Ƅ�/�:��y�!�y�</���:��ʪ�U��Zk��
A��a�"�����<t��
:�SF(Me��'���yC��as��{	M4t1@w����=����F�P_ð�۫��4�5� ��mC��s��Ė�q�k��P�ݶ-�����w��,a��(�T��v�cY���x��I�tpj穡���؆����0�֩,g���Î =������r�y~+v�\qxw����s{��
�7�i}f-{�����`jw�x�r�|������Nt�G1�|�#����|�76Va3�q�Dζ���}�(� ���Q���躄fp��O�5RF �\c!_��5�9�0^���\��!a�ͥ};��K��t�R,/�~�w��[���lFXseo��̓�t�˝\�̅z��*WJW�{��F�@&?�0�|����Kk��8���J����UJ�=l��/l=���%�2��B�f�y�y���:{�QXh���E���\y���u�r������<��"7O���4����W6j�s{�9��8R�Q�C�N{�.ջUe�3Uo6b�:�!�H�ۺ�7����$oBJ׶+�s��I��`^� �x������@/1H*Y!�bA��y�����`��1��Y��W��5��d# �r��Ƿ�vM<V]�fA�<�4�]v��v/5�irb��(F ��]����f��g�b�M_�)2�U���\��F,�	������V�#�I�]]nH��N��^���䃱Cv��� FE�ܠv�r�E�k�̯	]�>?�q5kM�69<8��t����e�^۝�B�3#(H߃���p{�o���%��tb�v#�fm!�F��Y��,�ߕ��%0�}���D#<&��	6��)�c{'��V�����WdV�>k��}��aаO���H�剮_�P�U:��i�H��c5�g�>��P�� �FE�������i�N��p9�X�Z��Ό�����\@��ez<�eT6���\�N
WzB�.uw�Ǎ׮s��1࿠��6��U�f�(����H捏F�V"�:�{��y�їM��6��� �0�ئ-��ڱAʖ��2�m) h��υ��_��� =ƑX�K�ZXڻ
�Vk9��e�9��g�Ƞ��yj2o#����:晭z�!���Z�ʩTGĳ��?�-���#�|\�s��Ku~�����/q�����o���crLp���8d !A� 0�áb.B�.� �:�⎇���q�_���e!,K1\띓�ȓ����r�Z�b�	f�7>�h�C���� �vq�Y�)�+b=�<��v.�u�&3|����^0�����l��S�����ǻ�B)��EI������t��'������-#��q)Q+��F��k��p�o3�a���g�Ԣ�Q���=��H{�񒐏�S������l��6�V��n��m�^�g����k�a�r��ܽ��/����o18m��SI�J��a�t��i�.�]�j��7��#&��v����vHr�%����p�t�c^6���K�وNM-��G?ݿ�4������ͪ�r!.z]�N�����P�U{?-��yp�Bb2�M�ف�����Nvr�����6�N-��P��=18b�kp�C���"r���|���vC�8�?�1dO-��P �O�\���Q�xYa'guKE�RE#*�d�s{��_�P���|a[��-���i��Ƈ4K�D��� ̳�?�0xj��Ŧ4�����^�I-�Hkw��:~�V��8;��f�P��5��r+ܧ|�ئ;T�08ޮ�R���_�pxz�v`��)o>n���:��{Զu�U$��
/�3�P>�`dAL(4�`�Q����Ij��/��j�#IJ��K=�)3����'�&��=A�M�*r������Q<O�es�7t,@Ǳ��ʣ0냌���y�3���J�� q���4c�~a#���0߄tp�����@Q
�<
�Aq=ߡ����}�_���^��S�4Yzz��رNL#X��n{M�-kDM�o~a�脫<[O� �*L����*�n'|w��n��+�>A_��Xj������
{�ߪ����F���c���c;�	
y���Ը�߰ދ���0q�v�j���~�5ظЉډss��^��O��F1
8�~π�Uo��`��`\d+<�L�Ϊ�*�φ`d�]�bCp���.,�n��&ј��k���7"���l(<�ا��o{c�~!�ɳ@�iyb�?ߗe?�+C�dd�˽~�a�O��a�ԅ(��`$P�qA7 \����E?D=�{]�k2?\#�!�je�|���hC�`L:��%�KXs�!���'ƥG1(��i�    ѩ���x�{֨�gt���h.��E��ɩ��c_ �\��f��蛒Y>|cn�ZJ㣭n��~c�߂�\L��n���P���W� ɱ��*�#R�'��ӥl��t�?l�(�B$���� F�H�
"(�S��!L�G|��d~�FW���]�-ek�X	��&�n봙�G�\�AoO����`@<#����I݊��-�v��N��(\��B�r.�~��.�[�V�W�cϗ:?^�	c��4C_}�58��&�A}�58(T����0tP�D���Ppy>�{Zp�ج�O�)��_�\��NB��}�^�k�z�ki�ˎ{ε����W�ڤ4�a ���җ�-M�n!ֹ�=�����J=�Zӷ���ڤ�j���r�uL��+wîJ[����[�ψ)}��>9�?�
a��4���H-����4�l�����m����4�ņ� �:6�Jx�):� 4��hу�,Ψ	�`����\��+�LW�D�s��-��0uj�r�N��q�l���F�|�����>��\��OC��DGp��i�����-�L�5�o{�җĻRK��C��aN��Y��zn�.<q�b�=6�a��2� k���<7{��F94�Y����o�	3��O�M�a �-��-@���ш� ��S3��m�s�n���qBM����q ��h��L<dgc&~Gq�'14�^�c�/�	u�� Ш��>����U_����.v�J�SP3�a��Vǎ��Z�E�
�W2��\�\��ML/�T�+W�<s���>�ח�|��?��
Gi�!�H�d�@	CE�A���ֿ&󃅁�-w>^�B��]����J�^�2�/��T~�������@�S��9y�[�+vI�
�T��Z4�'�3c����61(P���xu<
t�meW`Z�RӜ�A�M��G�Hp/�3�/lȄ�+_��(SW}8����:�j0#���6���mB��6��v+n公­{,��K�>��㒵O�s(��&4�}a[�T��Aw��ci��rd׻%1�[a�$��)�^�&셏)�^���z��\L;v�8'OD��N���eμ��6���s��)<wp�� ��Ḁ(��a
�0r*�B�^�����(��N��נF^Ew�o�3X5��Ӕ4����0�M(��d#���_���E��a��0{�)����e���g�t�Ј-�	���J�=ʽ�*A�9���A>R67[9��JI�EL�w�x>�5���NL䊒�~�`
�Jr�Ŭ�����H�Z� �E�\��<�әRj�3׌��uSy���y*���	N���]u��mN9�����B�],QWx���x���V!Ni^eqK{��^�6�=䕴�H�k�{
8�iɳ�"��<��F�	nKmO�=�?�T��+����"�ɍ��"	%r�uL��(�"�=I-}�4v\����O3��?�����^�@qH�	�q�{]�p�R�^��-'����yjo6b�oӃ�0	<���z��uƆ��6�j�%��+H��C^x��k���|#>w}�[kF.+[��_!�=�����W����L����#��_�$̟��!�{��,�'�4�hq��Cs�ȆNo�6�oi���9>	2;%ԚODr���W���6�(���D���-�樍�d�����]ֺ���W�IɒO�,CE�IOڍo��>�	������ٌ�_���M��9�5���}�#�����}�۝�M��7۔}��FF}�[�H��qn\�q��(�rlH40W��}C&L���Y�����3z���\�3�2�M^�d��֚���DQ�po���9�N�Q=\5єg4.~�!�����=*.����R1�^^�X�d��������vބ�7������N����D!�)�F���/�0Zn�3���m�N=!�����@~��qˇV�#��P��?I�FwPRq�b�#�,;�ٰ1[�8���'cWB���)=����ox�4�����Ķ�k������*�[����<���ߎt�|�:�@��s�Ai��C�s<�(�q�#��#�Q�k2?\�����q�o|R�R�>+OnU�J����ʐ���&����[��ʌ�-�jR��r�%����s��n����Ȅt��V��*�31����'��E�l���g��>�l�SO|L骪EW�Q�i2��	�2��
~�4^�+)�����xro6tР%���t��ϳ�Ι�ކ�ǳE��J���ˋ���l���R�ekλl[2��#^��R/��{e�W��K����4�y�G޷M�D��O#���w�2�<�ػ��>��Fe�����"��_T�Qϼ��@��;���T}"�W��*��� /Q�DA,�B�	\�Cǃ}�{��k2?XXY�J�>ի�N/g�cA �n�g�9��!�eY�	㾰]����:�e}�z�w�2�a�I��T����W��MU��)�8Y-�e�ܛ,�W���ְ���q������dÆ�c� Ǫ��m�����<cq����)��y�j�s^���6�����h���^�OBKn�gfq,T:�[���<_�g\��f�3z�C��Ӊ�r���c=v����Z���_��M�R]P?K�|�6�a���d̞�*0���8d/;�����y^��8���G;��[S�(�eI��|��:L)�3�o6bAM�N��F�w�j�=��뭲��eR'K�{B���Ӽj�7�����t� !��B�[ؤ�fw�p�ZR	������0���I
G6d�:�-K�z�)Iy��5R��~��hG'n3/�f#��76
p��Dh���e||h���S�w'�a�1�<��6a��6��[���mǉ�q<�g�{��ڂ�
>
M���fCa �0�7�䌄�QV
4N�M����p7�t�~{���lL��*�/+�䘣�-��s�-w�*��O���k�o5��/1N�]���`*q���ږ�6�%�����ͼ�7>�#?٧��$=��`����{�MJ6vP��O�ǵk�&�5"�(�����eo/>C��J���t}b�����rҴ�ol���[Q6��2�t���q�?��yλ��6�+j�USl��Bz�D�`�P1�)�� �Hg�
i^��?��	�/~a#,ɏ(��S���c��-]�Mp���}^������y�������\*J�!��T}��<� �zG�yg�'ۤ��O�#[�ֵ��Xt�� ?ڦ�AÜoQyb���,�k/�Sה�Bm�P�_3�w��lwF��w�%]VO)�u����.Rb��bCp`����v@���z���Z6w�g���5}���
}>ټ͊��f���ߘ��s2��=�/x��Y��;�٨���
~�F{��վi=3���\��5�ցT&�)_�~���c�u��m6{O;B��\//ʱ�\��(Yo^2�:�}�0�]�u\m�՛[A+'�$�kI`Q;w/��k;�IG�l8@��z��Wz�6JmՄ�wy���E0~^��mR�����\:n_c���x���gث�*h��0/.�f�z%�76v?<�S��~__�6�(�)#��ֵy�ɛm�O<�F1�.�{���
��%�X�l��2o��Ba^{�Ĵ���.�k����ڬ��)��Y�찷�,�O�`#'u���{�����@��^������K�F��y���
��X�V@0�D�bA��<�!��nܺ!���~�؎,��M�y��l�T���Uj���d�AI�ѥ��4r�����KG�؆}�O+
y�a�Sag}S�%�3����ά� v�D��<_����0������FQ�t�8���~�k�3.��Qs�^;~&���qB	�c�n�����}[4��c�c<1ѹ���b}��S�l0	�#xu�)�`9�j�{�l�G]��w,���[��i���eߋ�,�XAi��e��~~����#}b�KS���) ��װ������Tovnj�T�Z�������f^���mJ��6���W��"y�Ku�z�Nc+J���H�7`�X��N�	
"^ �
  b�0B���~z%���(�Ԓ���,yGМq��6�g��"�#17 ��@�u=�B��6��Br ����.�&��5��F�a����Ur�d��&� L}d��*���F��4�������P�M�U��k�M�W���ěѹ����'���0�z� �{�:9���g��hU��#l7����6����w�i$�
�ݲ��T+���Xo��Z�+E%��,}�ɆM������|���#���������0�:�7>���7>�)�D��	S�ԗ��9�D��iir�O��6������k�����s��V!�An���2�����Dl*�(:���.��ӨoN�Ⱥ�f'	�5̕Y�F6�5�`ҍ#�x�	����Cn/��TӤ�&	�l�17c�e���M#5�AĄ|���u/h�cӫ��њM6�,5"�[��0Qb����o��n��>�oR>��\�]޽3h\�Cy�0Ef$�Q��6k�	4��1ƅ�	���F��0@6�b�3�a\��M��A:{H���u��|�'��ۺ�av�RHHb4�:�7X�:p�R�9������K2?X#�_{ ;s�6{�����k�w���r���!㭌ЄI�o6d��1���2=:��r�{)����Sa���6�l�X�6�z��(�T���9�1�pMt��R,8�X^�^��C��R|��&�y�%Fun��e-��0zo���6K=es�̚p?> �u�д���(�A@_[.�|	�6��ܵ���
�N��e1���`Æ��ge��0� ÃU��԰��ِ��C���:��d~�F0�85͗�-�(yec�)������a�]fLC�\�A'Lȃ|�a�}:�x]?�H�M��evsH�'�H�r�5�l8� &4�}��8��mj��b�^r
�Q�X�ˇ��Gv#�;�_
{l��p+ԛmL�:P�r���*����X�xgD��Y��?�~j�����˶c��_�����o7}��j���U�!���" 2l��C�_�p�i�AP�!����k2?\���<�
����W.讐�p��>�Y�m��
����kz���leE5h�4�
�%$��r�*�ߜQr�E���!d��f�P@��������jN�8�E��]uaFd�>���dSI���>	BB�퀝V|ԈI�Cav�=�l82�;}�^=��.Zц��z��Z�DUv�i���[��i3�>ؖ�(�/�esj��F��Z8] E�KW빂f��6ې��zҨ'�%�ip�"(��pn7��F�G�T����uF���_@�fԿ� ��)]������vW+P�[lIEt�f�ƽ�M���f
 ֽ��K�|uS��|�/�ǩ ���u2���O��ީ���~C�N��6�t_�����������x5���D.Pr����xrL�(�M#���(H�����B>��h���/��p}�ιީ}��rH�|D MwAC���	��>��0响 �5G�Ѐ�6���غ�Uu���ƥ�#�m��%d����@z��L��Q�����F�Fb��T���l��j�O60.J�6�P�b�0�cG���Pef��a�|ʑm��M�{��6���#�.��'�	qd�k�{�"�U�����f#G�������gQ��z�,��Rmȼ-�q+T�	�->��ol�k7�κ7�
��{	;�g�O���w���X����O���P���F[�D�\ms^�<f�-��EX4��X���l�+J3m�-�C�ڑ�X[��9\����PGcw�k�n���0z�L��XUb���6�"��Zes�Q�cG��HE�~ߨQ�������޶8�$WK�KK"�EY�Q������^��%�s��F;�Z�gSX
��۶�F���)������m��}�脱���	���W9��������ޜ+[�����l8���n!.B:���Hy.H�(�>�y����6ϯ��p�DD�]ue��ۯ�*v׏2Cj�;?�̋@�׈��1��F|!�6e�>:��}2���x�+.l��5o�oХS�1
 re�
�h�(�}C�n��l��2��dٳ���0��FԤl��+{�*��Tb��3���Tg�/�Y� ����5�f�_wOӥ�K��+����zn<{�W�Lv-���tk�eC^�Q'��y�!�H�{�HLzU��C�k�x!\e�ݸn�]���_l0�@&t}��8�d,�ٱ�o�.7oV��i\�'B�B����Q�lĂ�P���F�uu�KUy�ڡ�Knal��K������۫�A���&�%F�<�}W������,�%��7nÀ�	�Q��6f�����bllu��Q;���tJ�S7��Fp��1|f3:>�F�nZf��6�<��o����SD/JX+ע|v�T3�G~e�'��7[�[������ ��՟V��ѣcRI�y��u����?�Q6��¤9���|>���Pf\eE�ϨV�d�_x���f�>o	�
b`hdg;�2����h=��&�gt���M]��sv��^�"_꜊2B"�<��y9�������=�����s�T�Hm;E���ʛ���8Y���W��o�I��[��_dEY�F[Jk�3L{��D7<��\�۴��*b�۹'�˘��g\�L��op��r�~CF�KM� ���K&��==JY{41���i�j)9{��}O��NtR���*�g ����      <   \  x�e�OS�@����*:xm������B'�Y:2]Z�MSy�5�8S����3���j���t]Wj����NK\�4����`1מ��7��q(����p�$s�y����x�d��sh��}�j^�~E�C��L,5-���z�B b�v*W��\��b�n�oey��m{�Nv��o����j?�ƣE�o����`��l
H�$��\�mjH4ڪvUW-*ǥ�yY�,�e��$�贷����?w��aL��*�e�8uq+��q��'�P�-S0&Ͼi@qU,��Q��K^>t��}e�t�����qz�(��w)$�,���z�f�u�i�Z����8`cK2��3���	���     