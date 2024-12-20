PGDMP      $    	    
        |            ieacoldbrew    16.4    16.4 J               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            	           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            
           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16397    ieacoldbrew    DATABASE     �   CREATE DATABASE ieacoldbrew WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE ieacoldbrew;
                postgres    false            �            1259    16431 	   order_tab    TABLE     �   CREATE TABLE public.order_tab (
    order_tab_id integer NOT NULL,
    customer_id integer NOT NULL,
    employee_id integer,
    order_date date NOT NULL,
    status character varying(20) NOT NULL
);
    DROP TABLE public.order_tab;
       public         heap    postgres    false            �            1259    16430    ORDER_order_id_seq    SEQUENCE     �   CREATE SEQUENCE public."ORDER_order_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."ORDER_order_id_seq";
       public          postgres    false    220                       0    0    ORDER_order_id_seq    SEQUENCE OWNED BY     S   ALTER SEQUENCE public."ORDER_order_id_seq" OWNED BY public.order_tab.order_tab_id;
          public          postgres    false    219            �            1259    16557    account    TABLE     �  CREATE TABLE public.account (
    account_id integer NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(20) NOT NULL,
    CONSTRAINT check_category CHECK (((category)::text = ANY ((ARRAY['Asset'::character varying, 'Liability'::character varying, 'Capital'::character varying, 'Withdrawal'::character varying, 'Revenue'::character varying, 'Expense'::character varying])::text[])))
);
    DROP TABLE public.account;
       public         heap    postgres    false            �            1259    16556    account_account_id_seq    SEQUENCE     �   CREATE SEQUENCE public.account_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.account_account_id_seq;
       public          postgres    false    226                       0    0    account_account_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.account_account_id_seq OWNED BY public.account.account_id;
          public          postgres    false    225            �            1259    16420    customer    TABLE     �   CREATE TABLE public.customer (
    customer_id integer NOT NULL,
    alias character varying(100) NOT NULL,
    rating integer NOT NULL,
    comment text
);
    DROP TABLE public.customer;
       public         heap    postgres    false            �            1259    16419    customer_customer_id_seq    SEQUENCE     �   CREATE SEQUENCE public.customer_customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.customer_customer_id_seq;
       public          postgres    false    218                       0    0    customer_customer_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.customer_customer_id_seq OWNED BY public.customer.customer_id;
          public          postgres    false    217            �            1259    16602    employee    TABLE     m   CREATE TABLE public.employee (
    employee_id integer NOT NULL,
    name character varying(100) NOT NULL
);
    DROP TABLE public.employee;
       public         heap    postgres    false            �            1259    16601    employee_employee_id_seq    SEQUENCE     �   CREATE SEQUENCE public.employee_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.employee_employee_id_seq;
       public          postgres    false    232                       0    0    employee_employee_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.employee_employee_id_seq OWNED BY public.employee.employee_id;
          public          postgres    false    231            �            1259    16476 	   inventory    TABLE     �   CREATE TABLE public.inventory (
    inventory_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    last_updated date NOT NULL
);
    DROP TABLE public.inventory;
       public         heap    postgres    false            �            1259    16475    inventory_inventory_id_seq    SEQUENCE     �   CREATE SEQUENCE public.inventory_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.inventory_inventory_id_seq;
       public          postgres    false    224                       0    0    inventory_inventory_id_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.inventory_inventory_id_seq OWNED BY public.inventory.inventory_id;
          public          postgres    false    223            �            1259    16443    order_tab_item    TABLE     �   CREATE TABLE public.order_tab_item (
    order_tab_item_id integer NOT NULL,
    order_tab_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL
);
 "   DROP TABLE public.order_tab_item;
       public         heap    postgres    false            �            1259    16442    order_item_order_item_id_seq    SEQUENCE     �   CREATE SEQUENCE public.order_item_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 3   DROP SEQUENCE public.order_item_order_item_id_seq;
       public          postgres    false    222                       0    0    order_item_order_item_id_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.order_item_order_item_id_seq OWNED BY public.order_tab_item.order_tab_item_id;
          public          postgres    false    221            �            1259    16411    product    TABLE     �   CREATE TABLE public.product (
    product_id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL
);
    DROP TABLE public.product;
       public         heap    postgres    false            �            1259    16410    product_product_id_seq    SEQUENCE     �   CREATE SEQUENCE public.product_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.product_product_id_seq;
       public          postgres    false    216                       0    0    product_product_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.product_product_id_seq OWNED BY public.product.product_id;
          public          postgres    false    215            �            1259    16580    transaction_detail    TABLE     �   CREATE TABLE public.transaction_detail (
    transaction_detail_id integer NOT NULL,
    transaction_tab_id integer NOT NULL,
    account_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    is_debit boolean NOT NULL
);
 &   DROP TABLE public.transaction_detail;
       public         heap    postgres    false            �            1259    16579 ,   transaction_detail_transaction_detail_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transaction_detail_transaction_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 C   DROP SEQUENCE public.transaction_detail_transaction_detail_id_seq;
       public          postgres    false    230                       0    0 ,   transaction_detail_transaction_detail_id_seq    SEQUENCE OWNED BY     }   ALTER SEQUENCE public.transaction_detail_transaction_detail_id_seq OWNED BY public.transaction_detail.transaction_detail_id;
          public          postgres    false    229            �            1259    16571    transaction_tab    TABLE        CREATE TABLE public.transaction_tab (
    transaction_tab_id integer NOT NULL,
    date date NOT NULL,
    description text
);
 #   DROP TABLE public.transaction_tab;
       public         heap    postgres    false            �            1259    16570 "   transaction_tab_transaction_id_seq    SEQUENCE     �   CREATE SEQUENCE public.transaction_tab_transaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.transaction_tab_transaction_id_seq;
       public          postgres    false    228                       0    0 "   transaction_tab_transaction_id_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.transaction_tab_transaction_id_seq OWNED BY public.transaction_tab.transaction_tab_id;
          public          postgres    false    227            G           2604    16560    account account_id    DEFAULT     x   ALTER TABLE ONLY public.account ALTER COLUMN account_id SET DEFAULT nextval('public.account_account_id_seq'::regclass);
 A   ALTER TABLE public.account ALTER COLUMN account_id DROP DEFAULT;
       public          postgres    false    225    226    226            C           2604    16423    customer customer_id    DEFAULT     |   ALTER TABLE ONLY public.customer ALTER COLUMN customer_id SET DEFAULT nextval('public.customer_customer_id_seq'::regclass);
 C   ALTER TABLE public.customer ALTER COLUMN customer_id DROP DEFAULT;
       public          postgres    false    218    217    218            J           2604    16605    employee employee_id    DEFAULT     |   ALTER TABLE ONLY public.employee ALTER COLUMN employee_id SET DEFAULT nextval('public.employee_employee_id_seq'::regclass);
 C   ALTER TABLE public.employee ALTER COLUMN employee_id DROP DEFAULT;
       public          postgres    false    231    232    232            F           2604    16479    inventory inventory_id    DEFAULT     �   ALTER TABLE ONLY public.inventory ALTER COLUMN inventory_id SET DEFAULT nextval('public.inventory_inventory_id_seq'::regclass);
 E   ALTER TABLE public.inventory ALTER COLUMN inventory_id DROP DEFAULT;
       public          postgres    false    224    223    224            D           2604    16434    order_tab order_tab_id    DEFAULT     z   ALTER TABLE ONLY public.order_tab ALTER COLUMN order_tab_id SET DEFAULT nextval('public."ORDER_order_id_seq"'::regclass);
 E   ALTER TABLE public.order_tab ALTER COLUMN order_tab_id DROP DEFAULT;
       public          postgres    false    220    219    220            E           2604    16446     order_tab_item order_tab_item_id    DEFAULT     �   ALTER TABLE ONLY public.order_tab_item ALTER COLUMN order_tab_item_id SET DEFAULT nextval('public.order_item_order_item_id_seq'::regclass);
 O   ALTER TABLE public.order_tab_item ALTER COLUMN order_tab_item_id DROP DEFAULT;
       public          postgres    false    222    221    222            B           2604    16414    product product_id    DEFAULT     x   ALTER TABLE ONLY public.product ALTER COLUMN product_id SET DEFAULT nextval('public.product_product_id_seq'::regclass);
 A   ALTER TABLE public.product ALTER COLUMN product_id DROP DEFAULT;
       public          postgres    false    216    215    216            I           2604    16583 (   transaction_detail transaction_detail_id    DEFAULT     �   ALTER TABLE ONLY public.transaction_detail ALTER COLUMN transaction_detail_id SET DEFAULT nextval('public.transaction_detail_transaction_detail_id_seq'::regclass);
 W   ALTER TABLE public.transaction_detail ALTER COLUMN transaction_detail_id DROP DEFAULT;
       public          postgres    false    229    230    230            H           2604    16574 "   transaction_tab transaction_tab_id    DEFAULT     �   ALTER TABLE ONLY public.transaction_tab ALTER COLUMN transaction_tab_id SET DEFAULT nextval('public.transaction_tab_transaction_id_seq'::regclass);
 Q   ALTER TABLE public.transaction_tab ALTER COLUMN transaction_tab_id DROP DEFAULT;
       public          postgres    false    227    228    228            �          0    16557    account 
   TABLE DATA           =   COPY public.account (account_id, name, category) FROM stdin;
    public          postgres    false    226   Z       �          0    16420    customer 
   TABLE DATA           G   COPY public.customer (customer_id, alias, rating, comment) FROM stdin;
    public          postgres    false    218   H[                 0    16602    employee 
   TABLE DATA           5   COPY public.employee (employee_id, name) FROM stdin;
    public          postgres    false    232   �[       �          0    16476 	   inventory 
   TABLE DATA           U   COPY public.inventory (inventory_id, product_id, quantity, last_updated) FROM stdin;
    public          postgres    false    224   K\       �          0    16431 	   order_tab 
   TABLE DATA           _   COPY public.order_tab (order_tab_id, customer_id, employee_id, order_date, status) FROM stdin;
    public          postgres    false    220   �\       �          0    16443    order_tab_item 
   TABLE DATA           _   COPY public.order_tab_item (order_tab_item_id, order_tab_id, product_id, quantity) FROM stdin;
    public          postgres    false    222   �\       �          0    16411    product 
   TABLE DATA           G   COPY public.product (product_id, name, description, price) FROM stdin;
    public          postgres    false    216   �\                 0    16580    transaction_detail 
   TABLE DATA           u   COPY public.transaction_detail (transaction_detail_id, transaction_tab_id, account_id, amount, is_debit) FROM stdin;
    public          postgres    false    230   p]                 0    16571    transaction_tab 
   TABLE DATA           P   COPY public.transaction_tab (transaction_tab_id, date, description) FROM stdin;
    public          postgres    false    228   �]                  0    0    ORDER_order_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."ORDER_order_id_seq"', 9, true);
          public          postgres    false    219                       0    0    account_account_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.account_account_id_seq', 53, true);
          public          postgres    false    225                       0    0    customer_customer_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.customer_customer_id_seq', 2, true);
          public          postgres    false    217                       0    0    employee_employee_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.employee_employee_id_seq', 5, true);
          public          postgres    false    231                       0    0    inventory_inventory_id_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.inventory_inventory_id_seq', 2, true);
          public          postgres    false    223                       0    0    order_item_order_item_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public.order_item_order_item_id_seq', 5, true);
          public          postgres    false    221                       0    0    product_product_id_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.product_product_id_seq', 2, true);
          public          postgres    false    215                       0    0 ,   transaction_detail_transaction_detail_id_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('public.transaction_detail_transaction_detail_id_seq', 15, true);
          public          postgres    false    229                       0    0 "   transaction_tab_transaction_id_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.transaction_tab_transaction_id_seq', 7, true);
          public          postgres    false    227            Q           2606    16436    order_tab ORDER_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public.order_tab
    ADD CONSTRAINT "ORDER_pkey" PRIMARY KEY (order_tab_id);
 @   ALTER TABLE ONLY public.order_tab DROP CONSTRAINT "ORDER_pkey";
       public            postgres    false    220            W           2606    16564    account account_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (account_id);
 >   ALTER TABLE ONLY public.account DROP CONSTRAINT account_pkey;
       public            postgres    false    226            O           2606    16427    customer customer_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (customer_id);
 @   ALTER TABLE ONLY public.customer DROP CONSTRAINT customer_pkey;
       public            postgres    false    218            ]           2606    16607    employee employee_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (employee_id);
 @   ALTER TABLE ONLY public.employee DROP CONSTRAINT employee_pkey;
       public            postgres    false    232            U           2606    16481    inventory inventory_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (inventory_id);
 B   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_pkey;
       public            postgres    false    224            S           2606    16448    order_tab_item order_item_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.order_tab_item
    ADD CONSTRAINT order_item_pkey PRIMARY KEY (order_tab_item_id);
 H   ALTER TABLE ONLY public.order_tab_item DROP CONSTRAINT order_item_pkey;
       public            postgres    false    222            M           2606    16418    product product_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_pkey PRIMARY KEY (product_id);
 >   ALTER TABLE ONLY public.product DROP CONSTRAINT product_pkey;
       public            postgres    false    216            [           2606    16585 *   transaction_detail transaction_detail_pkey 
   CONSTRAINT     {   ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_pkey PRIMARY KEY (transaction_detail_id);
 T   ALTER TABLE ONLY public.transaction_detail DROP CONSTRAINT transaction_detail_pkey;
       public            postgres    false    230            Y           2606    16578 $   transaction_tab transaction_tab_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.transaction_tab
    ADD CONSTRAINT transaction_tab_pkey PRIMARY KEY (transaction_tab_id);
 N   ALTER TABLE ONLY public.transaction_tab DROP CONSTRAINT transaction_tab_pkey;
       public            postgres    false    228            ^           2606    16437     order_tab ORDER_customer_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_tab
    ADD CONSTRAINT "ORDER_customer_id_fkey" FOREIGN KEY (customer_id) REFERENCES public.customer(customer_id);
 L   ALTER TABLE ONLY public.order_tab DROP CONSTRAINT "ORDER_customer_id_fkey";
       public          postgres    false    220    218    4687            _           2606    16608    order_tab fk_employee    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_tab
    ADD CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES public.employee(employee_id);
 ?   ALTER TABLE ONLY public.order_tab DROP CONSTRAINT fk_employee;
       public          postgres    false    220    232    4701            b           2606    16482 #   inventory inventory_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);
 M   ALTER TABLE ONLY public.inventory DROP CONSTRAINT inventory_product_id_fkey;
       public          postgres    false    216    224    4685            `           2606    16449 '   order_tab_item order_item_order_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_tab_item
    ADD CONSTRAINT order_item_order_id_fkey FOREIGN KEY (order_tab_id) REFERENCES public.order_tab(order_tab_id);
 Q   ALTER TABLE ONLY public.order_tab_item DROP CONSTRAINT order_item_order_id_fkey;
       public          postgres    false    4689    220    222            a           2606    16454 )   order_tab_item order_item_product_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_tab_item
    ADD CONSTRAINT order_item_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id);
 S   ALTER TABLE ONLY public.order_tab_item DROP CONSTRAINT order_item_product_id_fkey;
       public          postgres    false    216    4685    222            c           2606    16591 5   transaction_detail transaction_detail_account_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.account(account_id);
 _   ALTER TABLE ONLY public.transaction_detail DROP CONSTRAINT transaction_detail_account_id_fkey;
       public          postgres    false    4695    226    230            d           2606    16586 9   transaction_detail transaction_detail_transaction_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.transaction_detail
    ADD CONSTRAINT transaction_detail_transaction_id_fkey FOREIGN KEY (transaction_tab_id) REFERENCES public.transaction_tab(transaction_tab_id);
 c   ALTER TABLE ONLY public.transaction_detail DROP CONSTRAINT transaction_detail_transaction_id_fkey;
       public          postgres    false    4697    228    230            �   #  x�m��n�0����U$K��E��Z.��H��8���o��@����������X��БL$�zOA��EM�r�ܗ=^�����l�x��K��`�G�d�-����r������*1êF�M��E]��ƪBw�v�古}���}2�޽�q8h�',�f���fh94�=��n�l� >މ��M�?tR���f�^�֭`��"�G��6Z[2�Γ��7��Ȅ�5���U,��Z��:*צ��a���7�����J���������T�*�4�R횞�χ�����      �   u   x�-�A
�0�����Z����q34�M�̈́����+����qT�Y�(d���Y���a;���g�A�8s] NZN��4mb����\�e3�������[��*	1�.!���)�         n   x���
�0 �s��as~@2P��q�uaVjRj{�_?�w���ɩғ7ˌWpÏ�%|�f[[p)�n�,����co0p��н���(Zh`oo�wo{=�W��!7!�      �   %   x�3�4�4�4202�5��50�2�4�4E����� x��      �   (   x���4�4�4202�5��50�H�L��a���qqq �	      �      x�3��4�4�2� �F\1z\\\ z�      �   }   x��1� @�N�$�T�:w�tq�$���!�z���O�]��nGu��ㄝ���C��%ËN�Ȩ�Zc�^�C�VR+z� ��U���%�)�ֱtp�4�N2A;6��!��6�v�cO�����*�         :   x���4�42�464�30�,��-a�4.CNS�ScK�CC� PT �+F��� ��g         w   x�E�;� �:��. a����%ؼ!��q��_S8���I+muY�y��=lڪ���)�Jȼ�8������?��j�ז~O	�1e�^�7x��8�3��M��B|  e)�     