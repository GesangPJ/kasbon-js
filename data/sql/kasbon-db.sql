PGDMP     %            	    	    {            kasbon    15.4    15.4 4    :           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ;           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            <           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            =           1262    16397    kasbon    DATABASE     }   CREATE DATABASE kasbon WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kasbon;
                postgres    false            >           0    0    DATABASE kasbon    COMMENT     9   COMMENT ON DATABASE kasbon IS 'DB untuk website kasbon';
                   postgres    false    3389            �            1259    16428    admin_kasbon    TABLE     \  CREATE TABLE public.admin_kasbon (
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
       public         heap    postgres    false            �            1259    16505    akun_id_akun_seq    SEQUENCE     �   CREATE SEQUENCE public.akun_id_akun_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.akun_id_akun_seq;
       public          postgres    false    223            @           0    0    akun_id_akun_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.akun_id_akun_seq OWNED BY public.akun.id_akun;
          public          postgres    false    222            �            1259    16467    bayar    TABLE       CREATE TABLE public.bayar (
    id_bayar integer NOT NULL,
    id_request integer NOT NULL,
    status_bayar character varying(255),
    tanggaljam timestamp with time zone,
    id_petugas character varying(255) NOT NULL,
    id_karyawan character varying(255) NOT NULL
);
    DROP TABLE public.bayar;
       public         heap    postgres    false            A           0    0    TABLE bayar    ACL     0   GRANT UPDATE ON TABLE public.bayar TO gesangpg;
          public          postgres    false    221            �            1259    16466    bayar_id_bayar_seq    SEQUENCE     �   CREATE SEQUENCE public.bayar_id_bayar_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.bayar_id_bayar_seq;
       public          postgres    false    221            B           0    0    bayar_id_bayar_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.bayar_id_bayar_seq OWNED BY public.bayar.id_bayar;
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
       public         heap    postgres    false            C           0    0    TABLE request    ACL     2   GRANT UPDATE ON TABLE public.request TO gesangpg;
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
       public          postgres    false    219            D           0    0    request_id_request_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.request_id_request_seq OWNED BY public.request.id_request;
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
       public          postgres    false    217            E           0    0    user_id_user_seq    SEQUENCE OWNED BY     L   ALTER SEQUENCE public.user_id_user_seq OWNED BY public.user_kasbon.id_user;
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
       public          postgres    false    216    217    217            .          0    16428    admin_kasbon 
   TABLE DATA           {   COPY public.admin_kasbon (id_admin, nama_admin, email_admin, password_admin, tanggal, roles_admin, id_petugas) FROM stdin;
    public          postgres    false    215   E       6          0    16506    akun 
   TABLE DATA           N   COPY public.akun (id_akun, nama, email, password, roles, tanggal) FROM stdin;
    public          postgres    false    223   �E       4          0    16467    bayar 
   TABLE DATA           h   COPY public.bayar (id_bayar, id_request, status_bayar, tanggaljam, id_petugas, id_karyawan) FROM stdin;
    public          postgres    false    221   BF       2          0    16460    request 
   TABLE DATA           �   COPY public.request (id_request, jumlah, metode, tanggaljam, id_karyawan, id_petugas, status_request, keterangan, status_b) FROM stdin;
    public          postgres    false    219   _F       7          0    16542    sessions 
   TABLE DATA           5   COPY public.sessions (sid, sess, expire) FROM stdin;
    public          postgres    false    224   LI       0          0    16435    user_kasbon 
   TABLE DATA           v   COPY public.user_kasbon (id_user, nama_user, email_user, password_user, tanggal, roles_user, id_karyawan) FROM stdin;
    public          postgres    false    217   Mk       F           0    0    admin_id_admin_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_id_admin_seq', 9, true);
          public          postgres    false    214            G           0    0    akun_id_akun_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.akun_id_akun_seq', 3, true);
          public          postgres    false    222            H           0    0    bayar_id_bayar_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.bayar_id_bayar_seq', 1, false);
          public          postgres    false    220            I           0    0    request_id_request_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.request_id_request_seq', 33, true);
          public          postgres    false    218            J           0    0    user_id_user_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.user_id_user_seq', 10, true);
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
       public          postgres    false    215    221    3213            �           2606    16493    bayar fk_bayar_request    FK CONSTRAINT     �   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT fk_bayar_request FOREIGN KEY (id_request) REFERENCES public.request(id_request);
 @   ALTER TABLE ONLY public.bayar DROP CONSTRAINT fk_bayar_request;
       public          postgres    false    3219    221    219            �           2606    16723    bayar fk_bayar_user    FK CONSTRAINT     �   ALTER TABLE ONLY public.bayar
    ADD CONSTRAINT fk_bayar_user FOREIGN KEY (id_karyawan) REFERENCES public.user_kasbon(id_karyawan) NOT VALID;
 =   ALTER TABLE ONLY public.bayar DROP CONSTRAINT fk_bayar_user;
       public          postgres    false    217    221    3217            .   �   x��ϱ
�0�����p�DsɤS�S��+V�Z�-����K[8����a_��o�cx^cHa�<�R4S]�d5t@J�,�
�N	S�bo�'+���B�vm%"	�X���?,���G��1紱�`(�4/�a����Iֹ������i���a��E��.A��h$/�A��H!��$Vl      6   [   x�3�tO-N�K�L�+H,M)JtH�M���K���L�dr&��f�q��qC�+�U+x%V&B:���&g`�id`d�kh�k`����� E�%>      4      x������ � �      2   �  x����n�0E��W��3|s�hA7m��J��%� _�Aņ蔠���;3�H�y�F�"{ �@u�
f�Ω́<R�����2�.��n�����ٳ�gג�غ�A�#5P�{䏲Yx��HQ��� ���Ww���C��ͨ�Q�ǒ�NA��z|��� Y�ʀZd��\HM��@0���ٝn�\����"*Q�ɨ��,S�f$NH��tU�����,~�S7�8Z�s����%8C� (>�� �mz6�Ҫ��q��ɺ����9�X���X�kd��ݚ4����{��_W�2bL,-�u%9���@ƅT:�X�p˴�47�k3�ዞ��q��_��Iq�R91��R&��Ǿ�e�_�.��PH��Is��R��w}U���XIXjU�hQY�9�D�P��e{*F~��,9]fvй6�ٽ��4�Uѽ��ZV1U�D295�ܻ�Ƿ� s' �rfQ�����Y�-���}�~����;H�܄�3��b�Y���1@��p�jA�� G}��Y���lͅ�[��B,_��Ze,�Wgw�C֔�{	�
�錾�K���~���CٷelHȺ��rϻ���,=j���@�������n$Ew2zcqj���):�է�i�>u,����h3GC�AnB}WK�=G��D��h++�&&��v;^u>���J��f��������D���#�Rx�j�4�Y9����)�      7      x�ݝY��X����_Q�甊y�S3	����@LB:��_�򸳪\u��<d��/�^�ϋ͚���<�v�K����JCJ��K�%=Bh��?߂��$ѷ���%qR���?�x�B�(8���[���[T��ad��o��C�w["(x��˷��^iE�}�~�5�/�*�~$�������O�/ ������T�]��:�ūF)�|b�T���s�����t2
ϣ���,����zx]�}���B���w�6��5�/��0O��I��;�˷��n��7�fv~�EEx�����������Qp^e>����^��˷���?�}�$��K3������w��c?��J��:�~�H,b9����^)�w�;G��0X�}�-�IwW���O4�P��9]B09��b���b>��Y�	�r�^�m���`s�*��0d"� �N/q"�#��{��	��Xįj�����7y.����Md�` 2��3PMp���q0�қ+��#:Yo���pO^��h���P5�ѡ�Fݵf�T<����K���6�A L#��Sy�/+��;�~�|~n��F��lĒ���l$�'��Y�Y����k�� �o��b�t3�=����D��mC��3��d�<����.��G��[���z{�a�'z�sY߷���>*kf�����3��i��A�<RI���/���j�S��A�&���^�H�
V�1��⿀�Z"1��� �\�׫��Awy�6p��`���s�xR�a/+N�6Z��㒵�<U�T���[��B�2>B���ˆ�qIS�6�!����rm�$\�lXf��g��������%�O�/G1(�6��ĲuS �䩭�Ơ�N�n=����.��]���S��ز�$ǧjC8~[cm�j07����z�&FI��6rK�ȈVI��Jrzƻ-r�tn�0���<�k�b0@W����s�_�6��'��Zg��`^A�K���0���\���%�|�z�th�87t�C�U,ܿ@sȒ�&Ɨ�
���\�����Ϻ�����N�ֹ� &~���d[�6�A�Z�KV����+���|��=R r>�E�#��Íb`AXN��s{�$x�e �Ў�m�4_�ßX�?���֜��.���]��cw͠��3����B�@s�o@�S%�ڽ���P��:�6�R��WһEC�����O�1|"1�TX���z��j����ܶ�b�)'[��6
��Zq/͡�[�q���Nk%����g���X�ѽ/������ � W0j�>�.y�A�Y��1�E��؟��K�lp�ḳ|A��Za����h����m�������wY���<uC��]6�D�ʵ5��6D�^5��?B!����T�]{��J��!��|�1:2�+��(߭Af��%�ס�s٨aQ/p�3�p���Cgw�l!#�rA��3�բ�H�/������>���ɬ�Ks�$��U>�,�!H���?a�H{ɯ_�9|����J ��^�OSV<�x[�>wP���:�K�rog�a�X����9�(� ��^9٬��U�ߓ;� t�ٹLl0��D'��Q� �ꗗ`�j~��<���o/0u2(.��^7Y��YQ���"%�<<�<^�=��P+���Q�!&�����,atbed���r��X����[����țF�B��ܹ�F��6S�Qd�:�}��U������(������n.�ŗ��|k# ����b�W�A|�}�sv]̡u����i�}L�%�O�S��ܯ�9<�餼U�S�p�=[�$���z8��� S���Kt1ؚ��Z����󢙆Q!%�����U��l�`}'��7ې5ĉ�y�>���FU�=N�ή��C6���bC�%LN�/6V1��g^��P�N7�����$S�R�&+�/aC���N��(�ـ�<P��E%p�@7z{ܳ�T)�_�9h�����o6��z�݉�:I���ץ[����u��؆�����l8���'�Qx�tW��W|Z CS�-)Z:�YF�)6��%�L�Z�K����JС�{�J�e����RN��q>^kR|�b� @Ί�����v���w�!��e[��N�P/1����Փ���-���B�X�bo���k�>�K���ޅ�親���xw�؝L�q���M�>��~<2ހA>��E�*�����i]����M}O_lY��ϣ�ek��Y9�>�$o���r^��f��%O\o�	Tb�=~��}�l��)��M���7Y�����D"o/��ȿqZt���7�]���'���S~�N~VG�����sM0��%�3���s��!0�K��Ya��9��<���g�#�贱7�%£�񩊏4��t���-`x���s?�0�b�F�D�9�A��}�'hhw�j��ת��[
J�֥�����.���l
Br�+�s��L���jf9�h��֋m��,M�	&O�|Β�りɛٖY�v�6G�0�K�hb��f�YOnfp�}r�Y:3<�*_\S��6���fC�5�Ďb(��$lW7�~UT�<W�V뼨�O����ym�=��D���m����2�r3bv�:�(l��ϐ�è����l$�ϕ�5�Dnw��n�Vp���m�OPW�=dռ��[s��8'���l����&���HsBn�-/�&��̤�l��{�PS�QR���l�hEC��diӞx^���往�\��T�b��Z���*��9/Vb���-�\�:{��%l�gi���R�Q+�bi���b/��n�����~T_����7��&��O1�(��Ay��ܬ�D���Mn�o�٨%45��`p�}�o��������`���#��j#�gC�8m���B��jOh6�����5�-�������e��&���zd�!V<=G1(����/�r��ۻ���\6t,��Ӛ	�KΤ�SWL�	G���V6D�Pl�����?�Hd�{�b㟝�!0zb=���}t����'�a,n��E����6r�b�1��F���T�Vķ��i#��i�h���_RS���P+�N�(찅T\T�L'�m_`����dذ�zC��7l|� &<})��3��+���}��v+���ꗰᓣ�$mz6	H�,-?�]œ�rn�3��ݼa��h�>V�	�`�2�T�X����haU+;P�6��k�~�����ζ�L��w�h�j����^F;<�Y�Hfg���6d��1�V�%��ò��hg��͂+�E�i�y#oo6dm? �m����\M.�_�(˒�7Qy1\��������u���P lh�G�]�JZ��]DО\^��aݎ����x|	NΩ���w�BY,����rw�9'�6�1��<�V�ge���a$��]#���qE$��z����V��ݹ"f{'�;<�N��
<��B�}�75�\ ����_0�I�l=�):���6��<�� ���#�͕]%��XE,\o>k�n��r�����s�S-9�)X��G�l�z4���*8�]&��ve��lcKg�NS���� �]����~�;b�����%�Ŗu;on��swS���	�b{\#�ep��y�Zh�}m��^�7X1���zC���t���S���f�6�
�m�qC6#�Ws= <��\BS=�(��:dO4���XE)�E_�B�1DZ���S��.1�m� ��1�� �@����S�(E?���\���0���2x�g㑝o	�}.��{2a<�7��*������~�d,~ǣÁp������pzu���h�<iO	�ͺ��6Q�5!ML�F��mny�4�B_g�'D.s��w`R�LY�ۉz�A�Ĥ��V\���~}"�a�b##�͹%�&���9?/���"��ק�h��"Q8���]�����_ä�6lj���);���=$��YK�;�&��]�l��-��M�5}�AP�������P��#����>VY���o��`|�O�]{�����l���k�&�B+�Z�c_��c�|�*|�����{f����Pl    �j]l"�\T��Pj�<�~����o͑���g!��xVxRA�U=>`�T�6s�T���wb�6�a ����$�4tT��U�D�!�r��4o���6$T84��	Ձ1�FdG�(y�*+��n�}*��g�y'Z��f)p�G:�l5�� �A��Gۖ��n�(��oLe��X5����I�p^B�T���# ����s�&�p�&#���&�)E\|����mb����o�E�<��¬@'�{ـ��	>j�gg��`�x���K���3ē�9F_���VoIF��u����>ئZ�#�T����M6����l��iv���FNm����5�%��)%��A��O��������y��o6l��6@�G�M[��a�\	.��e��7��p���ךl�1
XlK�.<��d�����ۅa_Z9��jۘN~Gƶ�� �/1
8���|�2��+�<
W�sVL\���Y����E}���X����s���ʰ���<ה�'�;��#
=/�~����)A���f��P&%����s\��޾�ծ�7v�b�t��2K�f�d�t�[8z��w�m/���﫠v�`^7����T{���m��zlX��@�*�W4qs6�B2���y��7���t6�.[:'�G��ࣃ�Xi�h%�I�Jx^o`{o�ԕ�^�x3��0�𧶧���l������I�E���6�Ɩ�g��?�Qc����q��"O�����>*����l�m��#���z�7�4�ңV�0�ՙ-�y[�D\̶�Ԙ#��)���f���t�ϩ}��x�dE�`h�ɼ�9d���%<��:��b@rh%hjY[A0a���F�hx�i��7u������p������ֆ.���v��}0�r��kJ����?ԃL�����LJ#�u�"����O��ߴ�">�d�3����@^���'Z�Q�\Il�j���BJ�F U��'[��2�y3r��nC��T�b8p������TY��r*:Ol��;�`�j�|����#.��zΰq��*�x�"�z�j��d����tgސ�z�Ig��`;����b��Y?�Q������2�7�>�6�73LɁF6r��\-�P�C��	��C)���s>�v��i��&۟qY��#jW�b��BvE�3�nW	���{�_�lR��[�U��Dr����c�$\L��8���y��2n|�Ά@��AZ��M�ʶ�V����
~���y�
��PlINڇ�fCq�%��i��x�(!�{(���z���#���y��}V��c.�A=I�+jGٙą4��<k��u|��`����[=41&}�e�ˍ�R|u+,��!٦C��s��mn�ǳ�I'�l��pE�hW~ύo�������nn[k�ydx��s�Qbb�?�a �8R�V"
�)������=�E�>���㛍�̌���[=)Ȟ�����r$�H��d�n�]vd�yԗz0h��&.�Q��es�4�a����m\��
��M�$6>tM�l>���C�6	L����ę�-��0���\�_?�V��l�gm�?�z���+Q�@�M�j�G�J~�W,��7��R
-	j���`�<&��j�TՄ�w�F�5N�$F>����ed,�c���3�F1H:[t9D9Ԍ���R�ʢSD�����������ꭞ�A�l��W��N���x��_�����Q����6t�Ie���]�!ˤ���Sg%:�c^n�y�v���@��e����/�Zc�Ͻ�Ր�m�O�R~�s�0�ļ�R�x���:� F����:�Zלڬ5^����P�9Ȃ��Aכ����G\�/����9����R���VRr� �m�̼��[=�����_� ��])LV��;��J,���Y���3o��6��?���f�p���b�x�&܊�˥��Q{��T��4�N�+�gA�nf�ow[X��Q�~���?]W�Ψ���B�� x	�|�
K��F�@wUL����+������-5�T3�d��11�+�S���]C+�y�6��l�]�0�����y+6�$&@;�a��V��B�������� �(
@$���/��&C�:�~��l�����|>V���K_fàq���UT����8�t��+ߟ
ˣ�i��17�z�hr4�fsvՖ�6��=-�}d��˔⡻)·�<���2ц�b��WգQ�/��ϕj {����Rqn��f#��y��-�w,��VO�rEs��9��Tj�޴ �΍�Ǜ�9��PlÀ��eЖ������Q�j��V�Id�7�Yl�7Wƹ�i_;@�8�T4onIJ;5��F{���JX��&��n�){�����g�ny����iB�<6Tt��Mz��s_	;N��6����C=�N��6T�ď���ٚչ}�����q���H0��b��%�;�`P�R�ɸ�x�*I�wW�]uQm���7m��FM3lᙷ{똊�:3����<VJA�h4����f:B �|����aߧ6������K�񻛣�_�6�L�le7�@'�[�����xZ�n�s��?o�v^/�ņ�K�w<SZ�����˪:��	��NVY��6�φz�&#�f�W���֥��֮O}m`�(�9�zl��=����ݻ�!�ac_~w���?F�3��� ]���S�&+�oB笄$��y��o�K���A~�� ��a�'�y�V��\ey��`��q������롉��3n�G&}[rd�����F;�qS4�1#�����{�t`�yպ-�I�o66ǒp��a���<q���8��0�p3o;��i=�����a�+v��[��DLW��CM�,7�T��F!S�ۋ�l��z�PYm��@���h�%P˖���쭷I����ߥ���v"4c�����]�	�Y%�El�Z�lBjvu2�B¸%v�|�t9�v�����/�I���ʆ +�gK��*L����o:}��=w����m���X�����IRf��zR�'�a��¼:��i���0��w��P����𼞙�I�fr}��yy��m�w�~eC��h#	���s?�]���5Ԝ�F�M=���%LN���lP4�bj6�vm�g'�I�ȍ��:��ވ���aK��d�З����&�/�}�5�����9������>ب���	Q=�2��&��Y��o�T�����)���K��g��V���u8[��F�^��kN��C���*�:!�S"0t�$��,�ÀE��%��s�Ꞻ��	Q����pN�j�ۧg��ٞ��.�B��c�6i�Q���>[Q��xYkS�w��[{��&����� pp�y�gڇe��{�ѳ�j��`uK�ۛ���1/�I_x��plΕb=׍V盢^�;�PEr���i��x}FD����K�h��h����F����a��N�*D���F��>����>&���.���KY�ki�ξ�>c4����<��V�'��+�P�^mN�un�s1�Bl�ϊt��>�y�wx1u�3��{{}�,��J��^��R�(�%r�~��y��q��;4<�i����#(�{��k������>s��jV+����$&��fC�Y�_8N����.����_B�֝7�=���&r2����ح���qV�e���A�2�6U�y;"�׉ �3����^b��+x������}9��j�
�\�WQ�`�'�R�������xw��͎�,bj%�*��o,���\6��6-��^b�r*n��%�;��]N�Ԝ�.��ۋ�����Ѥ��e�x�7����
�;�\w�"�9���;D'���;(�ԭQK�W�.��S g�-��������t�������nZ+�^F�$ok�iɃ���y���$B'n��DQ�9�\��ʷ�b+׫y��/�E<�����Ig�`�!��cʬ��D��t�z�];�/�y�Ǒ���ӒT�%FjS1MJ��*���ǀ�ˠ�Ӝ�܀��FL�G��&V�u�-oUW����K���B�M�����Nۋ!�ZoE�Ela�<v6 �  laXuĺ� ������I'A�`K�k�����O^N6�호$��Ş1���y�a��M�/6�,�]5���i��u��l�e�T��;o3��I���`{�Z ���B���Zt�..��@eށf�/U��{�L]o�����R']��&�ýȯ���J�>\ r����L�o/��xV�<�/�7
冄�ġ�8(�ܹ�6n~Y���i� ���o���/�3z�Y�QZ�5�����Ɩ��}�u��j�ړz���#�XZw���21��~�^O��N}k^��6���@�|�m�dV6jN<��@�E�o^yu`�^g|O^uИ�{�@��q�G��,��Y|pH��y���� lIM����qo�j	I���oĊ�pQ��
��̛'x�!����7�%+��(���rN���������?g�7��5����Q��r�f;C�R�-^X+�xR�3(̶$/6�������- ���4�      0   �   x���;�0E�z��l ֌�]���+N��P�P�+=�4p��X�R)9�0���L��q쁄T�4
Y֨+r��W���5�G���H���.!A�̊#У�8�s�.�`�S����b�"�Bs#�Rn�$#�c�mH���A�ǆ�,��R��co?�M;     