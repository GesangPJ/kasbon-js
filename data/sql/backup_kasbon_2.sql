PGDMP                     	    {            kasbon    15.4    15.4 4    :           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            ;           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            <           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            =           1262    16397    kasbon    DATABASE     }   CREATE DATABASE kasbon WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_Indonesia.1252';
    DROP DATABASE kasbon;
                gesangpg    false            >           0    0    DATABASE kasbon    COMMENT     9   COMMENT ON DATABASE kasbon IS 'DB untuk website kasbon';
                   gesangpg    false    3389            �            1259    16428    admin_kasbon    TABLE     \  CREATE TABLE public.admin_kasbon (
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
    public          postgres    false    223   �F       4          0    16467    bayar 
   TABLE DATA           h   COPY public.bayar (id_bayar, id_request, status_bayar, tanggaljam, id_petugas, id_karyawan) FROM stdin;
    public          postgres    false    221   �F       2          0    16460    request 
   TABLE DATA           �   COPY public.request (id_request, jumlah, metode, tanggaljam, id_karyawan, id_petugas, status_request, keterangan, status_b) FROM stdin;
    public          postgres    false    219   G       7          0    16542    sessions 
   TABLE DATA           5   COPY public.sessions (sid, sess, expire) FROM stdin;
    public          postgres    false    224   	J       0          0    16435    user_kasbon 
   TABLE DATA           v   COPY public.user_kasbon (id_user, nama_user, email_user, password_user, tanggal, roles_user, id_karyawan) FROM stdin;
    public          postgres    false    217   �f       F           0    0    admin_id_admin_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.admin_id_admin_seq', 9, true);
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
       public          postgres    false    217    221    3217            .   q  x�e�Mo�@���+\���0��J���T�J�5w3�� ����׸�59�{��ys��V��\�7�=�A��:�I'��e�$c4i�fų?H������_���b�P38�rW'��/�-Y��g6/ A��`t����,� ���b@l�ll���@�Ⱦl@w�k�~^k�tmp��#�/�-���)\�-�߫�$��޻Z�3����	�0������>Q8��n8q����4G������#��8J��߼�@E�����J�+��E�o��_��	95L�^�T1�bY.w���{�M��E��z��I@Bi��� Wl��ޯ�e2j�6^�S)�˭n��s��E��4�1?�EM�E��М      6   [   x�3�tO-N�K�L�+H,M)JtH�M���K���L�dr&��f�q��qC�+�U+x%V&B:���&g`�id`d�kh�k`����� E�%>      4      x������ � �      2   �  x����n�0E��W���7�k����6�uC%�Dے
Y
����Aņ蔠�<�s������o�Q��>P�u�;*s��<R
���7tg"��a<e��}6�*Ծ%Ey��D���_�w�ͨv�׹�f$���\�ӥ�S�}(�W��ɝ��$��&W��7��(mtݏ��aD�H���9�X���X�kd0��f�88�9c�ʽg��/|16���)�R��#V0.��&�x�z���Q�[ŭ���E�Z�uQ�?�� `eR�uTMLi�R	��/Bمע��2��͇4E����/��C�Wuh��U��d��9�g��Nb�#*��e����1�BX2]v�)��Xtv��4E�*��x�e�R�M$�S+�d{����6�dS15��1�3�f[#���Q6K��Q�~����;H�śs��滬�v�8� Ss8S$u�raA0s��І,�u�+M�pqK:`�j�*�k���~l|�]�)YS�/�?�
��>���{�i��Z��o��\S���Ԟw5�v��v)�K�Q{���x#	�Y�KP{ՌMѱ�>MS��cc��㤧V#f��2��b}WC�7��Q��F[Y8��ڣ�g������G�II+�hV/�_p�g��!��]�%�fW�L��h{b�@d	������Z���9��<���d��A*�4�۰�~|ZY��1��	�gT����ݕ$,g{�6�+��D�nARX�I���_,�����      7      x�՝Y��Ȓ��G�b����%����E�$��d� ;b���!��zN��M�}�[Y�z*����#h0��é�N��U,N�PO3�����N�ő���~deD��HVG�'$���?���<*����� �A�A�a�A��_~�u�+i��x�����Gn��h�_?����7���Ч�8���Q�l�KG�Sq{*�Vfv���7�{��+l@�劸)˸R�H@�)nm5�0�hI8��a�௰��W2����G2?�{yu�C*��{N:sٰw#��t4#M��تgE�%S���EѠ��7��O�6��x��7C&��f�B�lA;k<t&�+��uVđv�9'�ҽ��e����S�D��]`Q����
R��३�������oaCA�+l��Ê�l�и=L(J>^u�z8#O��a��>�'[$]Ҷn1�06��}t��z��Æ~�-$�8�%����gߥTcuΔ�8Dw�W3�Ph���|#��=�ȅ��e��il��L��rC-W4�I����	B=��	�c�;���ƍ|�A2��:��3V�c�g��ג�B���qw)������?��E՟Vz��1;��_d��w8+^a�q,i&��������F3\ܫ-#������#Ṝ���m��d��{O��ވi{/�4�c����o�rMt)�äG�1�R�hv�\6��0j����f�"J���4�Q�7�@��\"�-G7#⽱�ˆ���OZ���[��F+H���=��fds6�h���ņ? ��r�_@��.@5�٥�5���S!I�v��+���s��#cBR������J/�L8��N[17���`��i����ew���M���}#���roQ�������򣩼2�n��`��J��T��-�����w��d�a�??�������n���,y��~�/?��~����F�Ŋ��� �?��_X�ǧ�A�=���[�J�A�������,�õ	
�mp]P��G1 �Q�C}
$a��n�{�8�h���$e_<�l�˛.�!���jr��V����7���@�͓�a�-7��
{t	�	��k����~���&06�}���2OV\�v簀�����%��UV��7�/i�� �� ���d;��L�,�E�ż\��7馩1���s�1�]a@`7��-[����cY�:f��݄#㱗n�Κ=�<��{c�=9�`斀Uș��gk��nB������HLzO�eWJ%�Z�1{��m�y⛴������M���v[v���a����^�;g������lq�s���������J`1i���T`�Ʊ������$�?ͨ�Th���@=?��z��v�-?[�\
S��eR~ðI���c1dQ2���K��R�)�;T���`6�>cE�ȩ��hF,��\�JA�ա~`��ʽ	BP諣���|6�Љ��ÌXP'�-oVT���Q]Vn�A*�T�b|�F��1�E'�!��[�6�� �R�=O�����X���´���tH�7
����f�B&�ڇl��pzM����@9,�M��M���{�s1$Y�Z�r�y[�#m����E�F�����q{�q�Njל���\:�R�[������8O7��oL�o��<�`�����]gQgܺ����q�8��7�%����~�7����w1Ҷ! �m@� ,��ܳ)�u���������<�.��:�ht�� ��z��u�1ͷ<#���~�E$���m��{��u��NmpV��{��I1���Nq̹C�b��ḫS
u��V�L���g���c\1iܞ16�-��2�M�Y�6����{+6��Ώ��Gj����.z�;�å4Q���k'vuX^C���c̃L�c��g`�xFl�>��j���E�u�v����h�>?�2�F=⊕q)�߂J6�����@x�!���j}�g{���C�$O�1����N!_�]?l��MlsP/�K������Q����u��0E��j�s�}�8MӑO3x�nw,jq�X�W۾��V���\7EK4�,�	="�wc�I�z�A)���bj!��e���5�g�K���K�[t����?Qv'l���� �"�Cd�$G݁{{������G�A�De7���b��1pd��{�Kk_O0�����O�ɕ�'[�Y}`���ݨ�UZ^�P;����ې����{��7t*��^�	@�d�R<����
I��>�Q��x�/tq��5;���^n7�a@�_09تmj9�-�D����h]@�tOK[S��+KVHr@H<X��U(/�cS��O��"�z��iE$-vQ��]Z�S4;yz.xr��syYܣ��h��-�9�[f��!�:(�-���3�o���"	�<|
�G%�; E�$ �>�g��{���l�ЃW���K=�.�i	m�N]���L�ZH�����cO��x��{�|��0���C/U��PS�C~[����Gt�������
�Aa �@
@��GM�#t\�=������a���LoMZ�H���Nq-��#�\*����닉�w�����4��_2%��	��P%+��щ�8Z����������!�a��w���3g��_�2�2�L�c��gBHܙM�;}�t3ֿÂ���<'�7�(m���� ܧ�=_!�V���.⌋�t��W���FL�h/�dpNj�o�%$�.Z�M��& A��,G�+۸��%����:2�S�r�Ҳ�~7��sAP��љW�~�A��j������}�O��6+;ԇ@N\s�U�l�����8n/6w��b4������Z�t#v���.�|�qcæ�y_l�b�T��'�#���'n'�nM�E&�8�=lSEƋ�߄A�֕��$�0�d��ғ�cg����O6b�p|���o��BR;>嫁2�stg%'��[�|��[��l�Y���ķ��.�#{�*D����楠~�!_X��Y��v��:A-,�Ķǥ�E������+�����^Qس0GWZ�^�c&^�J[��Mk�`KT�9n���bN�g����%m�u�-�ݼr��gJ|i�6�� ָ�x�����m�s�J���˾i��S�<�l�!m����QS}#���O%�p�׳R�?��K�&���繵CI�(O�om��ys��tv�2*�7��҅��Z�f%�ɝ�e��sg��|>k�"��\<���hj���2�������|�j�-Oxb�Yg���f��%�M-7�f�"�5��yڑq�a�6�0m��ވ������S<O6�H�4js��	効 g��Ė��o!|��S�&O66;YY�{TI<��/s�
A���xx��6�1��d3��l�[B��v��k*�28ނ��
��rӋ����la�����3U����@I�H-\���tP�%���f��3�*�o��lp;����T-I�2��v�~��'���~z�������έxY�(��&��PO�s��Ǘo�W��B>�Q'�ӌv��N��� �'6�����N��Ft�1��%���Zn6˪��g�x`,�g����Q�D�0u}rV�&l"&H�aAX�>nuR���=za��_���O�>�y:'�l�*�;.,�eC�дR?�4�q��]i��t� ݹ��wz�����贑7jZ�%�4C��$�he�����E�I;^�4T�m!|7�>k-��'n��@�����ǜ�M}�`�leW�|� {r��5��%S�M/6h��}شq��(q݇�*��H?��jv���|���4C�����1��l����xʏ���=����6oE��FE�O�0�G	�)ux����pz��Ctǎ����哹�͗�G�e?<��Q��
���K�e!���L `[9˹��e�z���f��y%[����_
]Fw8UV��l^9�'5���b�,�E+쒖ޖj-������^�L��UN��w}D��4M>���� �A;^JG�͛xsN�I�u����+�=6�q�Pr�3��f�®��!�ű! �  4�U��TVY�!*�.�EA�Ӳ�
:r����teC��^���R8D(z�ϋF>4<�쩠��n�l/&����l�W�Œ��lMd�A����'�o/%��8��z�O��+���=�Z��oR����l����;P��~S�/)h#����W��MlSп؂
:��±� �U�o�� ���9��x������3��;��d�X���nh�eȝ������ԋ�le���AB-��y�+�a�}�:������?|֗�pv}�e���-7�,�O�a#*�:$K�6r�:}���T>�.5�}O��)1�p�HX�R�*���Y�g���>2����F@�%��@!H�߆\�<G��������^�+���P��+��DJ��c&�����vV���3��PlbK�ÌXP����k��w(y.�5eG�$�f]~�۴��ۭC�	�ƌ�Č�JM���s/�p�����'l�fs�@	�(@]�PЇ��A�w|�&(�m��s����a�wduGP��^=.oF,7BeJ�z�r��@Λ?�g�AӚ�_l��]oEK�CBD��f�9[��*>��,m�۴��z�m�tL6d��K� ��]�[�3/9��A���M;�?ͨ�1^$�8���R�x5yK����	���SϽ0��O���xfar������W���6I�Uw�Ze�]MiJ�=U�i�N~V�s5�`P»6��ȸ���^h�V[�7t����"B|2n���O�<��C�Jԩ�i��[V�Aӳk�'������ӎ��d;�u��T���A0��kRG�L(;o��l��Y�d������꣆�M�v	0<�:\�ܼ��^lȨ����F`��}���# �-��kI��hS%�y���i�����ſۊxeݱ����������P=F?⚶��(@T�.&�=lZ�热�}5�UH�N��d���U��D�j��]�;�?:$�����i�I�I���61O��iZ��C'� �U�g�卧u�}䍩fE��mǗ��HV�n���㸶حr�ws�G\ސiU�i�/ �L��S1�Uv[�a�\ˑj	Ņ�}ZU�����ƆO�<�L�mv��d��>��	y&B%�ш��ٗM��&?�'����,���oNg�`9��xF*ɱm�ه��o�ppj��#E���C���%Ok�:���(�6Ě���u�dC�7h�%=��0NZN8���\�E�h�v��Dw�N�}H��%o����h�.�VAp�? �A'���d�ׂp0���_l��]���q8h�uB{�"�ETt�㽳fw7=پ4�F���#�1���C�i�Ć�'%5��zVg����i��'/B�
�M����8h6��PC�,��1�b9�q�6M�<k�8���ŝ�$���Bn��l����b��6�A��6͟�O3x���Q����{�󻀨�L>7���jy2gG������Z�a/Ę�Y<3郧��uT%�����QU���7u�~�˚����-K�յӗ���J�.�F�j��/�Ph�3}���0�N����Ә�:,�j�1�����ͷ1�$y?���!O3b�p������R+�|[�CSU�7	}v��8�u���h�_��S�`�E`L�����BX߫�I�Y���X{]n��X���o�h~�;wP�@
��K$�����(a�6�?�����\�J.�"�X�j괠�p����5Ci[%���:?�2��[�K3
sk-�t���Jq)H0Q���&_�i)��1m�[#y�)$�}_�d���]W}�Ӻ
?�v�] ;v� ��;�w�\y�-6k/�B��K�5_����/�-�ބ�<��D�""٣2�,�Aj��\��=l����M�۳I��ػᨖ'_��
'--�n�y'�~c�Ҹ���� }�(�Hm�@��	�e�;H|C�Ãm�e��gz���bG���߶8O!��IVd��g��3�B�����ˍ�����keR�u�a7$<r��ʮ�Q�g_b�8$�O�o�ӌ\x�S��x���Js�{���_V��,��}	�S�ÓO7<u�]����{ѿ��7�:���KȦHJ�f�����S��S�q������3��bwa�Q��'R�o�MO-<u-<5٫'���JpH^vLԃ&��a��K��w��7-<]Ӎl�YgG�*��li�T�%Gĭ^h�/��UO��l�~��\��|h���jUA��qx�\ij�_����{����I̺�r��Qh��6\�B��#�z�����2uܞZ8���6�&o*�f��&�����|-�v�R^~���|����/���ׂy����'�I��Hg�ۯ>kj^��A�J�ќ���y�Ú�m���P��~3�_��6�����;����42E���8x�@��կ��r�ɋ�ئ��'�ڌb�M�&�Q���������7��8���Qx�3}���!FX�����vu:_�^뜄��̥ͬ�O_�~#���M��q�H��Q1:>
�C����$ᒔ!�כ��cƺ�Ip)0n��6�b�Ȧ�D���Y/c����iu��B.6~�0������jE\�W��k�WV����M�����U�\�>j C��Q]��!��;��-9O�����m��������3��������_���?�k�y>^��6��?���!�j�h��'�FY�{�5˘�8_#��S�fȂ���3�G`�(�H�)�����ܷ��k��M����m���hกB�����HT��"���=&�/A�7��j4�;*�Z	;K�,{�6����i�ؔ�ͻ��#ˎ~vA��~���: ���~���Ӷq��%3/��1X��<�e]���pS���l3WU��@<XDv�T�0�
�w����M;U���ޕ �A�g��{�$2�N���0���Y��-5O9��'gB��am�.Ҡw%W ��������l�S�V]��s�������/��7������'�eؕ%���86p���̼.�c�&�!��;��ù=�.s�N��	j��x*��>���'���M<��p]��SD�c�[�;��ua���;$�Q�4����~��P��d ���=���VK:�2�N�]��1z��K~�՞p5�!��)���ۢ���A�'ﴞ{��UJD>{/�����N
�Y����R��
ua B`"H�H���_��Òj�Sy�^�H\�$+R���&;��}nI��NFp�;��"�o�����/      0   \  x�e�OS�@����*:xm������B'�Y:2]Z�MSy�5�8S����3���j���t]Wj����NK\�4����`1מ��7��q(����p�$s�y����x�d��sh��}�j^�~E�C��L,5-���z�B b�v*W��\��b�n�oey��m{�Nv��o����j?�ƣE�o����`��l
H�$��\�mjH4ڪvUW-*ǥ�yY�,�e��$�贷����?w��aL��*�e�8uq+��q��'�P�-S0&Ͼi@qU,��Q��K^>t��}e�t�����qz�(��w)$�,���z�f�u�i�Z����8`cK2��3���	���     