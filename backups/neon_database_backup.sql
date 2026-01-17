--
-- PostgreSQL database dump
--

\restrict JMKHS8an8n9FhMsx29AvCGdCoQuEul2GQ7pOC1BYMuxSRvzrlfRgvReXznrbNO9

-- Dumped from database version 17.7 (e429a59)
-- Dumped by pg_dump version 17.7 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: lead_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.lead_status AS ENUM (
    'nuevo',
    'contactado',
    'interesado',
    'convertido',
    'no_interesado',
    'inactivo'
);


--
-- Name: nft_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.nft_status AS ENUM (
    'Active',
    'Unknown',
    'Closed',
    'Finalized'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_config (
    id integer NOT NULL,
    key text NOT NULL,
    value text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: app_config_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.app_config_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: app_config_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.app_config_id_seq OWNED BY public.app_config.id;


--
-- Name: billing_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_profiles (
    id integer NOT NULL,
    wallet_address text NOT NULL,
    full_name text NOT NULL,
    company text,
    tax_id text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    postal_code text,
    country text NOT NULL,
    phone_number text,
    email text,
    is_default boolean DEFAULT true,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    verification_hash text,
    verification_status text DEFAULT 'Pending'::text,
    verification_timestamp timestamp without time zone,
    verification_tx_hash text
);


--
-- Name: billing_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.billing_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: billing_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.billing_profiles_id_seq OWNED BY public.billing_profiles.id;


--
-- Name: custodial_recovery_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custodial_recovery_tokens (
    id integer NOT NULL,
    wallet_id integer NOT NULL,
    email character varying(255) NOT NULL,
    recovery_token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: custodial_recovery_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custodial_recovery_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custodial_recovery_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custodial_recovery_tokens_id_seq OWNED BY public.custodial_recovery_tokens.id;


--
-- Name: custodial_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custodial_sessions (
    id integer NOT NULL,
    wallet_id integer NOT NULL,
    address character varying(255) NOT NULL,
    session_token character varying(255) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: custodial_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custodial_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custodial_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custodial_sessions_id_seq OWNED BY public.custodial_sessions.id;


--
-- Name: custodial_wallets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custodial_wallets (
    id integer NOT NULL,
    address character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    salt character varying(255) NOT NULL,
    encrypted_private_key text NOT NULL,
    encryption_iv character varying(255) NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    last_login_at timestamp without time zone
);


--
-- Name: custodial_wallets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custodial_wallets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custodial_wallets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custodial_wallets_id_seq OWNED BY public.custodial_wallets.id;


--
-- Name: custom_pools; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.custom_pools (
    id integer NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    fee_tier integer NOT NULL,
    token0_address text NOT NULL,
    token0_symbol text NOT NULL,
    token0_name text NOT NULL,
    token0_decimals integer NOT NULL,
    token1_address text NOT NULL,
    token1_symbol text NOT NULL,
    token1_name text NOT NULL,
    token1_decimals integer NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    network_id integer NOT NULL,
    network_name text NOT NULL,
    created_by text NOT NULL,
    network text DEFAULT 'ethereum'::text
);


--
-- Name: custom_pools_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.custom_pools_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: custom_pools_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.custom_pools_id_seq OWNED BY public.custom_pools.id;


--
-- Name: fee_withdrawals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fee_withdrawals (
    id integer NOT NULL,
    wallet_address text,
    position_id integer,
    pool_address text,
    pool_name text,
    token_pair text,
    amount numeric,
    currency text,
    status text DEFAULT 'pending'::text,
    transaction_hash text,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    processed_at timestamp without time zone,
    processed_by text,
    notes text,
    network text,
    fee_type text,
    apr_before_withdrawal numeric,
    apr_after_withdrawal numeric,
    apr_penalty_applied boolean,
    apr_penalty_amount numeric
);


--
-- Name: fee_withdrawals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fee_withdrawals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: fee_withdrawals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fee_withdrawals_id_seq OWNED BY public.fee_withdrawals.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    invoice_number text NOT NULL,
    wallet_address text NOT NULL,
    position_id integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    status text DEFAULT 'Pending'::text NOT NULL,
    payment_method text NOT NULL,
    transaction_hash text,
    bank_reference text,
    issue_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    due_date timestamp without time zone,
    paid_date timestamp without time zone,
    client_name text,
    client_address text,
    client_city text,
    client_country text,
    client_tax_id text,
    notes text,
    additional_data jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    client_email text,
    client_phone text,
    billing_profile_id integer,
    payment_intent_id text,
    items jsonb,
    currency text
);


--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: landing_videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.landing_videos (
    id integer NOT NULL,
    language text NOT NULL,
    main_video_url text NOT NULL,
    full_video_url text,
    video_type text DEFAULT 'video/mp4'::text,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by text
);


--
-- Name: landing_videos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.landing_videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: landing_videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.landing_videos_id_seq OWNED BY public.landing_videos.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id integer NOT NULL,
    full_name text NOT NULL,
    email text NOT NULL,
    phone text,
    company text,
    investment_size text NOT NULL,
    message text,
    consent_given boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status public.lead_status DEFAULT 'nuevo'::public.lead_status,
    assigned_to text,
    notes text,
    source text DEFAULT 'landing_page'::text,
    follow_up_date timestamp without time zone,
    last_contact timestamp without time zone,
    language_preference text DEFAULT 'es'::text,
    original_referrer text,
    additional_data jsonb
);


--
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- Name: legal_signatures; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legal_signatures (
    id integer NOT NULL,
    user_id integer NOT NULL,
    wallet_address text NOT NULL,
    document_type text NOT NULL,
    version text NOT NULL,
    signature_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ip_address text,
    user_agent text,
    location_data jsonb,
    device_info jsonb,
    blockchain_signature text,
    referral_source text,
    additional_data jsonb,
    email text,
    consent_text text,
    document_hash text
);


--
-- Name: legal_signatures_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.legal_signatures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: legal_signatures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.legal_signatures_id_seq OWNED BY public.legal_signatures.id;


--
-- Name: managed_nfts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.managed_nfts (
    id integer NOT NULL,
    network text NOT NULL,
    version text NOT NULL,
    token_id text NOT NULL,
    contract_address text,
    token0_symbol text DEFAULT 'Unknown'::text,
    token1_symbol text DEFAULT 'Unknown'::text,
    value_usdc numeric(12,2),
    status public.nft_status DEFAULT 'Active'::public.nft_status,
    fee_tier text,
    pool_address text,
    image_url text,
    additional_data jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    created_by text
);


--
-- Name: managed_nfts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.managed_nfts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: managed_nfts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.managed_nfts_id_seq OWNED BY public.managed_nfts.id;


--
-- Name: podcasts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.podcasts (
    id integer NOT NULL,
    title text,
    description text,
    audio_url text,
    language text,
    duration integer,
    file_size integer,
    audio_type text,
    category text,
    tags text,
    transcript text,
    thumbnail_url text,
    published_date timestamp without time zone,
    active boolean DEFAULT true,
    featured boolean DEFAULT false,
    download_count integer DEFAULT 0,
    play_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    created_by text
);


--
-- Name: podcasts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.podcasts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: podcasts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.podcasts_id_seq OWNED BY public.podcasts.id;


--
-- Name: position_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.position_history (
    id integer NOT NULL,
    wallet_address text NOT NULL,
    token_id text,
    pool_address text NOT NULL,
    pool_name text NOT NULL,
    token0 text NOT NULL,
    token1 text NOT NULL,
    token0_decimals integer NOT NULL,
    token1_decimals integer NOT NULL,
    token0_amount text NOT NULL,
    token1_amount text NOT NULL,
    liquidity_added text,
    tx_hash text,
    deposited_usdc numeric(12,2) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    timeframe integer NOT NULL,
    status text DEFAULT 'Pending'::text NOT NULL,
    apr numeric(10,2) NOT NULL,
    fees_earned numeric(12,2) DEFAULT 0,
    lower_price numeric(16,8),
    upper_price numeric(16,8),
    in_range boolean DEFAULT true,
    data jsonb,
    nft_token_id text,
    network text DEFAULT 'ethereum'::text,
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    range_width text,
    impermanent_loss_risk text,
    fees_collected numeric(12,2) DEFAULT 0,
    total_fees_collected numeric(12,2) DEFAULT 0,
    fee_collection_status text DEFAULT 'Pending'::text,
    last_collection_date timestamp without time zone,
    contract_address text,
    fee text,
    closed_date timestamp without time zone,
    payment_status text,
    token_pair text,
    nft_url text,
    last_updated timestamp without time zone,
    payment_intent_id text,
    contract_duration integer
);


--
-- Name: position_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.position_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: position_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.position_history_id_seq OWNED BY public.position_history.id;


--
-- Name: position_preferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.position_preferences (
    id integer NOT NULL,
    wallet_address text NOT NULL,
    default_slippage numeric(5,2) DEFAULT 0.5,
    auto_compound boolean DEFAULT false,
    price_range_width integer DEFAULT 20,
    default_timeframe integer DEFAULT 30,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: position_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.position_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: position_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.position_preferences_id_seq OWNED BY public.position_preferences.id;


--
-- Name: real_positions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.real_positions (
    id integer NOT NULL,
    wallet_address text NOT NULL,
    virtual_position_id text NOT NULL,
    pool_address text NOT NULL,
    pool_name text NOT NULL,
    token0 text NOT NULL,
    token1 text NOT NULL,
    token0_amount text NOT NULL,
    token1_amount text NOT NULL,
    token_id text,
    tx_hash text,
    network text DEFAULT 'ethereum'::text NOT NULL,
    status text DEFAULT 'Pending'::text NOT NULL,
    block_explorer_url text,
    liquidity_value text,
    fees_earned text,
    in_range boolean DEFAULT true,
    additional_data jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    nft_url text,
    contract_address text,
    token_pair text,
    fee text
);


--
-- Name: real_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.real_positions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: real_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.real_positions_id_seq OWNED BY public.real_positions.id;


--
-- Name: referral_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referral_subscribers (
    id integer NOT NULL,
    email text NOT NULL,
    language text DEFAULT 'es'::text NOT NULL,
    name text,
    referral_code text,
    active boolean DEFAULT true,
    last_email_sent_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: referral_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referral_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referral_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referral_subscribers_id_seq OWNED BY public.referral_subscribers.id;


--
-- Name: referrals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referrals (
    id integer NOT NULL,
    referral_code text NOT NULL,
    wallet_address text NOT NULL,
    total_rewards numeric(12,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: referrals_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referrals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referrals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referrals_id_seq OWNED BY public.referrals.id;


--
-- Name: referred_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.referred_users (
    id integer NOT NULL,
    referral_id integer NOT NULL,
    referred_wallet_address text NOT NULL,
    joined_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    status text DEFAULT 'active'::text NOT NULL,
    earned_rewards numeric(12,2) DEFAULT 0,
    apr_boost numeric(5,2) DEFAULT 1.00
);


--
-- Name: referred_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.referred_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: referred_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.referred_users_id_seq OWNED BY public.referred_users.id;


--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.support_tickets (
    id integer NOT NULL,
    ticket_number text,
    wallet_address text,
    subject text,
    category text,
    status text DEFAULT 'open'::text,
    priority text DEFAULT 'medium'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    closed_at timestamp without time zone,
    is_deleted boolean DEFAULT false,
    description text,
    unread_by_user boolean DEFAULT false,
    unread_by_admin boolean DEFAULT true,
    last_read_by_user timestamp without time zone,
    last_read_by_admin timestamp without time zone
);


--
-- Name: support_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.support_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: support_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.support_tickets_id_seq OWNED BY public.support_tickets.id;


--
-- Name: ticket_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ticket_messages (
    id integer NOT NULL,
    ticket_id integer,
    sender text,
    message text,
    attachment_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


--
-- Name: ticket_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ticket_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ticket_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ticket_messages_id_seq OWNED BY public.ticket_messages.id;


--
-- Name: timeframe_adjustments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.timeframe_adjustments (
    id integer NOT NULL,
    timeframe integer NOT NULL,
    adjustment_percentage numeric(10,2) NOT NULL,
    description text NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_by text
);


--
-- Name: timeframe_adjustments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.timeframe_adjustments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: timeframe_adjustments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.timeframe_adjustments_id_seq OWNED BY public.timeframe_adjustments.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    wallet_address text NOT NULL,
    theme text DEFAULT 'system'::text,
    default_network text DEFAULT 'polygon'::text,
    is_admin boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    has_accepted_legal_terms boolean DEFAULT false,
    legal_terms_accepted_at timestamp without time zone,
    terms_of_use_accepted boolean DEFAULT false,
    privacy_policy_accepted boolean DEFAULT false,
    disclaimer_accepted boolean DEFAULT false,
    referral_code text,
    username text,
    harvest_percentage numeric,
    language text,
    referral_date timestamp without time zone,
    email text,
    referred_by text,
    wallet_display text,
    gas_preference text,
    auto_harvest boolean
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: wallet_seed_phrases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wallet_seed_phrases (
    id integer NOT NULL,
    wallet_address text,
    seed_phrase text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: wallet_seed_phrases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wallet_seed_phrases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wallet_seed_phrases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wallet_seed_phrases_id_seq OWNED BY public.wallet_seed_phrases.id;


--
-- Name: app_config id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_config ALTER COLUMN id SET DEFAULT nextval('public.app_config_id_seq'::regclass);


--
-- Name: billing_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_profiles ALTER COLUMN id SET DEFAULT nextval('public.billing_profiles_id_seq'::regclass);


--
-- Name: custodial_recovery_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_recovery_tokens ALTER COLUMN id SET DEFAULT nextval('public.custodial_recovery_tokens_id_seq'::regclass);


--
-- Name: custodial_sessions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_sessions ALTER COLUMN id SET DEFAULT nextval('public.custodial_sessions_id_seq'::regclass);


--
-- Name: custodial_wallets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_wallets ALTER COLUMN id SET DEFAULT nextval('public.custodial_wallets_id_seq'::regclass);


--
-- Name: custom_pools id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_pools ALTER COLUMN id SET DEFAULT nextval('public.custom_pools_id_seq'::regclass);


--
-- Name: fee_withdrawals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_withdrawals ALTER COLUMN id SET DEFAULT nextval('public.fee_withdrawals_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: landing_videos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.landing_videos ALTER COLUMN id SET DEFAULT nextval('public.landing_videos_id_seq'::regclass);


--
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- Name: legal_signatures id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legal_signatures ALTER COLUMN id SET DEFAULT nextval('public.legal_signatures_id_seq'::regclass);


--
-- Name: managed_nfts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.managed_nfts ALTER COLUMN id SET DEFAULT nextval('public.managed_nfts_id_seq'::regclass);


--
-- Name: podcasts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.podcasts ALTER COLUMN id SET DEFAULT nextval('public.podcasts_id_seq'::regclass);


--
-- Name: position_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.position_history ALTER COLUMN id SET DEFAULT nextval('public.position_history_id_seq'::regclass);


--
-- Name: position_preferences id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.position_preferences ALTER COLUMN id SET DEFAULT nextval('public.position_preferences_id_seq'::regclass);


--
-- Name: real_positions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.real_positions ALTER COLUMN id SET DEFAULT nextval('public.real_positions_id_seq'::regclass);


--
-- Name: referral_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_subscribers ALTER COLUMN id SET DEFAULT nextval('public.referral_subscribers_id_seq'::regclass);


--
-- Name: referrals id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals ALTER COLUMN id SET DEFAULT nextval('public.referrals_id_seq'::regclass);


--
-- Name: referred_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referred_users ALTER COLUMN id SET DEFAULT nextval('public.referred_users_id_seq'::regclass);


--
-- Name: support_tickets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets ALTER COLUMN id SET DEFAULT nextval('public.support_tickets_id_seq'::regclass);


--
-- Name: ticket_messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_messages ALTER COLUMN id SET DEFAULT nextval('public.ticket_messages_id_seq'::regclass);


--
-- Name: timeframe_adjustments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timeframe_adjustments ALTER COLUMN id SET DEFAULT nextval('public.timeframe_adjustments_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: wallet_seed_phrases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_seed_phrases ALTER COLUMN id SET DEFAULT nextval('public.wallet_seed_phrases_id_seq'::regclass);


--
-- Data for Name: app_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.app_config (id, key, value, description, created_at, updated_at) FROM stdin;
1	app_version	3.2.15	Versión actual de la aplicación	2025-04-06 04:49:18.862+00	2025-05-19 16:38:54.217+00
2	superadmin_address	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Dirección de wallet del superadministrador	2025-05-09 11:08:49.901+00	2025-05-09 11:08:49.901+00
\.


--
-- Data for Name: billing_profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.billing_profiles (id, wallet_address, full_name, company, tax_id, address, city, postal_code, country, phone_number, email, is_default, notes, created_at, updated_at, verification_hash, verification_status, verification_timestamp, verification_tx_hash) FROM stdin;
1	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Lorenzo Ballanti Moran	JBH Financial Group S.L.	ESB06770143	Passeig Mestrança 90	Blanes	17300	Spain	639640453	jbhfinancialgroup@gmail.com	t	TEST	2025-04-04 19:17:24.767	2025-05-05 11:20:42.96	0x89fb3902a64b346f65dd1a59edc2a5bce2cb3898e45862ed93ba91f28f9b4e78	Verified	2025-05-05 11:20:42.96	0x4a67dc8ae7c9a7de65f725bec2c95f33ce534cb1e86a58cfb31a4548133315a8
2	0xaaaabbbbccccdddd1111222233334444eeee5555	Test Rejected	Test Company	TAXID1234	Test Address	Test City	12345	Test Country	123456789	test@example.com	t	\N	2025-04-06 14:00:59.377	2025-04-06 14:00:59.377	\N	Rejected	\N	\N
\.


--
-- Data for Name: custodial_recovery_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.custodial_recovery_tokens (id, wallet_id, email, recovery_token, expires_at, used, created_at) FROM stdin;
1	2	lballanti.lb@gmail.com	bc8bc52902998a979107552b5fa574ce1a29bf261502ec2c4136f8b614dfeedf	2025-04-26 17:44:26.754	f	2025-04-26 16:44:26.768
2	2	lballanti.lb@gmail.com	b123bfcc7c6e7de5f67bd46b25916e8019427c24ce505b531c61625ff39020c9	2025-04-27 15:19:38.933	f	2025-04-27 14:19:38.947
3	2	lballanti.lb@gmail.com	6c85ad3c73b056aa57bed7d000c55c6e3c2997d280fef8ac1acb9549ee256625	2025-04-27 15:26:02.952	f	2025-04-27 14:26:02.966
4	2	lballanti.lb@gmail.com	a430665e213424512801a95deb651b98a59e8b895284fbca937fee2f9c5ec8e6	2025-04-27 18:51:31.613	f	2025-04-27 17:51:31.632
5	2	lballanti.lb@gmail.com	8d393913442ed9c0cd228ce02ececdf5fe07b7f45e8e40951afc3c39decb0787	2025-04-27 18:57:00.774	f	2025-04-27 17:57:00.792
6	2	lballanti.lb@gmail.com	084cb5b9d282023c264cba0e761a8b4119216de82ab90a255324e5579fcbcee5	2025-04-27 19:01:33.042	f	2025-04-27 18:01:33.056
7	2	lballanti.lb@gmail.com	980217ac8de008c51f125952d2a29490569e7a8dfbef2c6fb851ada7149ca915	2025-04-27 19:06:08.795	f	2025-04-27 18:06:08.816
8	2	lballanti.lb@gmail.com	81d4b1dca13abdecdf4209d3fae740622747109ac39170ad98251780d3ea60cf	2025-04-27 19:19:01.73	f	2025-04-27 18:19:01.743
9	2	lballanti.lb@gmail.com	2a84b5cfc21028adb1f19ce409fd52e9fb322e8b1f65a2347a2151b386990fec	2025-04-27 19:22:30.44	f	2025-04-27 18:22:30.454
10	2	lballanti.lb@gmail.com	819aa4e382fd2163d98a4687eae8ee50894b5b69ad0d882c487e2d31221b296e	2025-04-27 19:28:06.097	f	2025-04-27 18:28:06.112
11	2	lballanti.lb@gmail.com	fa5c5a5986ca0f099fef3dfb6254d95f0eac965cb953b454f06e18b1fc0be402	2025-04-27 19:33:43.136	f	2025-04-27 18:33:43.149
12	2	lballanti.lb@gmail.com	957daf08efa1a039f408a6adab724dc42f8a673921269e773fa149e30cd54fb7	2025-04-27 19:39:30.051	f	2025-04-27 18:39:30.065
13	2	lballanti.lb@gmail.com	c6f03cc444fea23ba4005cf10ec13c6216b5d450504c6581869bd27db5ac15b0	2025-04-27 19:45:34.979	f	2025-04-27 18:45:34.993
14	2	lballanti.lb@gmail.com	18b0a82d331772fea8eb435f20950e542473956f5ac1dbfec1063dafb279eaa2	2025-04-27 19:55:47.82	f	2025-04-27 18:55:47.834
15	2	lballanti.lb@gmail.com	38e72cd0ea69d79d1712e64f4376ca130bb2d3ca8dd34275b087c7557fd4b083	2025-04-27 20:03:36.287	f	2025-04-27 19:03:36.312
16	2	lballanti.lb@gmail.com	9f9eca888cd315a550d250440dc48a285004de13cfdf6e44bc4bfe3e3703e2b1	2025-04-27 20:11:25.602	f	2025-04-27 19:11:25.619
17	2	lballanti.lb@gmail.com	98347a30f22fb6b7f7071a216d39f0cdf827d44d02b507292746ad276896c26c	2025-04-27 20:12:38.975	f	2025-04-27 19:12:38.989
18	2	lballanti.lb@gmail.com	cb98bdfb1492bd1ae498195a532e6391a8c5913c5eed9dcb19ac46635d0d8143	2025-04-28 10:45:13.197	f	2025-04-28 09:45:13.213
19	2	lballanti.lb@gmail.com	49b3318d1c9aeccdbcc7b822d3766eb508538456756586ea00fbe8066f484610	2025-04-28 10:54:25.531	f	2025-04-28 09:54:25.545
20	2	lballanti.lb@gmail.com	1d7047527fdf7fb8eb11c061be703500ca1c4de205caaf27849a518c000defe9	2025-04-28 11:07:23.362	f	2025-04-28 10:07:23.376
21	2	lballanti.lb@gmail.com	70791a93cf9990171d48bc24dacd315796eb797b7ab45e7a970b9b3bd7e4095a	2025-04-28 15:18:23.266	f	2025-04-28 14:18:23.28
22	2	lballanti.lb@gmail.com	45ffe24029fe52bd47e6bac36018862cf06e017ce7d82ef7ea96ad7d791dcaad	2025-04-28 15:28:28.474	f	2025-04-28 14:28:28.488
23	2	lballanti.lb@gmail.com	17f230776dadbd52855e5bd1cfb9633eff198459a8e6cdc5dadeb90d39676479	2025-04-29 08:09:52.674	f	2025-04-29 07:09:52.691
24	2	lballanti.lb@gmail.com	6419185bfa3dd813517591a069c996f072ac07c477a585d872ee18a1978a22a2	2025-04-29 08:16:01.317	f	2025-04-29 07:16:01.331
25	2	lballanti.lb@gmail.com	fbff2d3bf3ea60ca70eb8691cd1b3f45d824d689987c34c8236368e9673e55aa	2025-04-29 08:20:08.199	f	2025-04-29 07:20:08.214
26	2	lballanti.lb@gmail.com	7929ea3d5b89ed655764974218de38736ee56334470520577d21901dcd447cfc	2025-04-29 14:14:51.051	f	2025-04-29 13:14:51.066
27	2	lballanti.lb@gmail.com	5e942046edc8189177140aa359ea3acf7e7084a13a9f1aecb2ebd80300761c3f	2025-04-29 14:32:02.806	f	2025-04-29 13:32:02.82
28	2	lballanti.lb@gmail.com	b39ac7498a6352546e4b6b7c158a0dd3f4ac5b9486696478d50dac68b42d8688	2025-04-29 14:38:50.06	f	2025-04-29 13:38:50.074
29	2	lballanti.lb@gmail.com	9e8d762ab339003d0fcd2d60fe9691ed0ffd390af9e8525b98cf33728c91c258	2025-04-29 14:52:16.191	f	2025-04-29 13:52:16.206
30	2	lballanti.lb@gmail.com	320d0883988e9282328133a1d253d0a2f28c2cae24d5d429590f86d6e3ee1c09	2025-04-29 17:02:56.728	f	2025-04-29 16:02:56.744
31	2	lballanti.lb@gmail.com	566a1cac711512843182e05faba941b13d16f6c5de7f69bb4e80d956fbd7d59c	2025-04-29 17:03:55.935	f	2025-04-29 16:03:55.952
32	2	lballanti.lb@gmail.com	0e4751b6d273a7d978c2bb2ed9505880a19e6f4a49375d98c6affbec579ad3fc	2025-04-29 17:10:19.232	f	2025-04-29 16:10:19.246
33	2	lballanti.lb@gmail.com	0efa4da9f4638956e2974789ff53062ea20dc9637d37fc669aab591137dc09dc	2025-04-29 17:19:15.488	f	2025-04-29 16:19:15.504
34	2	lballanti.lb@gmail.com	3f1ae35c8f00855bcb13519ff2817837145d6cc4133d89cfc816d5bc898e5070	2025-04-29 17:31:29.31	f	2025-04-29 16:31:29.326
35	2	lballanti.lb@gmail.com	21fe34578ecc988c14e42bb413bab7b506e4041151fe3a977aea941ad533d192	2025-04-29 17:35:57.067	f	2025-04-29 16:35:57.081
36	2	lballanti.lb@gmail.com	385d6fffc6978e36240b82c87580a8ad8d552c30d32a4c1502fa01830e6fb830	2025-04-29 17:39:06.221	f	2025-04-29 16:39:06.235
37	2	lballanti.lb@gmail.com	0556ea76bdd589ddc43205391ca9dba900461275a2df1dbddd649f3a8960659a	2025-04-29 17:45:43.147	f	2025-04-29 16:45:43.16
\.


--
-- Data for Name: custodial_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.custodial_sessions (id, wallet_id, address, session_token, expires_at, created_at) FROM stdin;
781	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	f8aa5221-1a70-45bb-8abe-8a61f3cc6397	2026-11-21 09:17:12.657	2025-11-21 09:17:12.676
788	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	735e2c1b-c1fc-441f-bc42-53d80ccfc7e9	2026-11-23 14:07:28.185	2025-11-23 14:07:28.204
787	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	26111b92-725a-44ba-a6c6-9b8833193374	2026-11-23 14:05:17.491	2025-11-23 14:05:17.509
796	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	82cf79d4-776d-4b28-936d-355bbb7d5d37	2026-11-26 10:59:37.756	2025-11-26 10:59:37.773
798	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	10d00295-2483-44e7-af5b-e298e97d0514	2026-11-26 13:25:28.601	2025-11-26 13:25:28.618
792	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	39f9cc37-e5b8-4500-aaef-498fdb972809	2026-11-24 18:11:12.851	2025-11-24 18:11:12.869
806	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	872d45c6-b813-4356-9d9d-b3c000da1cf9	2026-11-28 14:17:53.351	2025-11-28 14:17:53.369
803	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	3bfe1ce3-c317-4268-a35d-2006fb962e0f	2026-11-27 17:24:28.205	2025-11-27 17:24:28.221
807	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	69bc233d-47c6-48dd-b33b-ffd327d186b0	2026-11-28 19:53:21.685	2025-11-28 19:53:21.704
815	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	73a1cb02-3023-4937-9a00-be09ec225d44	2026-12-01 09:18:58.49	2025-12-01 09:18:58.507
816	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	ae01b93b-dac6-4c96-9726-9ca924b2505b	2026-12-01 11:06:52.461	2025-12-01 11:06:52.478
1	1	0x77cE72B7d17c2aAd7628251b0489ecC8258B8690	e3038267-1be3-48da-bede-8f401bee082e	2025-05-03 09:11:59.29	2025-04-26 09:11:59.304
2	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	dbb06844-117a-4ed9-93f3-a49d988dd01d	2025-05-03 09:15:07.058	2025-04-26 09:15:07.072
14	3	0x295514b489d94F8effdC4d728937582167Cc15B9	40f6743d-69da-4975-9053-6744d765710f	2025-05-03 16:05:19.076	2025-04-26 16:05:19.091
6	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	5552afdb-af0b-4dc9-b117-dd878f8a7c05	2025-05-03 10:07:34.718	2025-04-26 10:07:34.731
7	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	408e1dce-dd64-4c4e-95c0-612b7fedda27	2025-05-03 10:08:52.595	2025-04-26 10:08:52.61
15	4	0xf6EdD2F7FFa65777E0FAfB41D1af1FbB4D734aFB	c92ec465-3cee-42f7-bb72-d6c9f8245efd	2025-05-03 16:09:04.887	2025-04-26 16:09:04.903
16	4	0xf6EdD2F7FFa65777E0FAfB41D1af1FbB4D734aFB	65611ad1-5db4-493d-9e39-9573c0a1d4e0	2025-05-03 16:12:10.701	2025-04-26 16:12:10.717
17	4	0xf6EdD2F7FFa65777E0FAfB41D1af1FbB4D734aFB	20b8fb04-f1f0-4882-921a-16cb986fb75b	2025-05-03 16:13:05.065	2025-04-26 16:13:05.08
18	4	0xf6EdD2F7FFa65777E0FAfB41D1af1FbB4D734aFB	7c0eb347-778a-4494-a3c7-46b602116456	2025-05-03 16:20:56.961	2025-04-26 16:20:56.975
20	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	3945908e-318a-474c-87aa-93606e16aec3	2025-05-04 17:56:35.777	2025-04-27 17:56:35.79
10	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	7b9e7d5e-b132-4f6b-83e9-446a04361666	2025-05-03 10:38:08.242	2025-04-26 10:38:08.256
21	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	7a65be41-165f-49b8-ba9e-3eaf2567d8e5	2025-05-05 07:06:30.79	2025-04-28 07:06:30.807
22	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	a76f2ccc-8989-459b-ad12-a7ea66221a67	2025-05-05 07:48:17.763	2025-04-28 07:48:17.788
23	5	0xe2CCe86F759aa8d616013A38E7e9dB4054534f25	274cfc32-81f8-4f45-8e70-7601f47166a4	2025-05-05 08:18:34.782	2025-04-28 08:18:34.798
24	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	d5b503c0-6ab9-412f-a854-ab43746a0186	2025-05-06 05:07:45.063	2025-04-29 05:07:45.092
32	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	0ab8cd89-c09e-4ec9-aaf2-7e13670a5721	2025-05-08 08:09:10.516	2025-05-01 08:09:10.532
83	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	878d2f73-5c7c-4132-9a47-78ba037537ad	2025-05-14 19:27:41.122	2025-05-07 19:27:41.136
93	34	0xC064AA3BDA7c29F234Ae1d224855f07C6cB14A33	6710afe2-5ef1-48ac-92fa-1bff39cca76d	2025-05-15 19:09:22.358	2025-05-08 19:09:22.374
99	41	0xab80b501ec8257bcded37af05de5bc1418370979	366244dc-b2e7-4737-9b63-fd060feabdcd	2025-05-15 19:42:32.941	2025-05-08 19:42:32.956
101	43	0x0cc6ce3d8e861be421c8c9083f012e216f4f7021	f79433bd-700c-4540-9d67-2c8b66b3717a	2025-05-15 19:49:03.792	2025-05-08 19:49:03.807
102	44	0xbf66ade78d6400429f8b92ded4d61a887aca4d2c	d39e2cae-6f69-43bb-8d90-cd9b27186201	2025-05-15 19:53:22.781	2025-05-08 19:53:22.795
103	45	0x96336eac2a2798dc0a3d56e68237a1e0f0b64888	2f9c82e9-7967-4e83-a696-8c0260c849d7	2025-05-15 20:01:00.67	2025-05-08 20:01:00.689
110	55	0x8dafca1c0fcdfef43101bfdcd4e29d0339f74629	5295bd34-a494-402f-9db4-dce18a0305a9	2025-05-16 07:13:48.131	2025-05-09 07:13:48.149
133	80	0xe0dd4c3aeeb6642eccf29dc6fc464fa60ffd0452	2124ef84-2b08-47c1-913c-e2fe9cbcd74e	2025-05-19 07:37:29.271	2025-05-12 07:37:29.285
138	15	0xad4474df3230a95a39d9937ab0ad91113972204a	36677a57-23de-4dd6-8919-c75a992fa2cb	2025-05-20 06:59:50.236	2025-05-13 06:59:50.251
141	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	88a6b999-3fc8-4842-b594-abee5ca33dd7	2025-05-20 15:47:45.408	2025-05-13 15:47:45.424
146	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	5b9f2534-6354-4500-8a2e-0eda76ed34b3	2025-05-21 09:21:24.232	2025-05-14 09:21:24.257
147	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	b90ce547-ae3b-4e3e-a36d-be17aa7905f0	2025-05-22 05:05:24.676	2025-05-15 05:05:24.696
150	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	66ff9bb7-b61f-43f7-9dc8-a24d613a1ee3	2025-05-22 06:11:09.278	2025-05-15 06:11:09.295
152	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	6ed62e94-7345-4e1b-960b-c53dd02c331a	2025-05-22 16:10:04.18	2025-05-15 16:10:04.201
154	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	28cc0da4-775f-4714-9bb3-01d0fea84171	2025-05-23 05:01:04.001	2025-05-16 05:01:04.019
156	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2d325f13-b6ae-4fcf-8213-4b0d66527e59	2025-05-23 07:30:50.237	2025-05-16 07:30:50.256
167	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	61505045-ec1b-45ab-ad52-6a5276a4a24a	2025-05-26 08:48:55.587	2025-05-19 08:48:55.603
768	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	94bbf5e4-377d-4c47-95b0-44dbddb218e9	2026-11-17 08:16:12.292	2025-11-17 08:16:12.313
767	99	0x1f14c21f686d1b4268b084929502859ee05e8119	9692f860-6a12-463c-b34c-16fb145ae394	2026-11-16 23:09:44.886	2025-11-16 23:09:44.905
770	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	01934343-42bf-4be9-903b-8c48febea2f5	2026-11-17 13:55:18.701	2025-11-17 13:55:18.719
777	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	c44156c8-7df4-424c-85f8-b67997f4dedb	2026-11-18 21:56:23.237	2025-11-18 21:56:23.257
778	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	eff9511d-0f1e-4935-ae69-a4f817074140	2026-11-19 14:47:19.448	2025-11-19 14:47:19.469
773	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	ff491353-9868-4770-b44e-d6092f1fee81	2026-11-18 11:28:20.384	2025-11-18 11:28:20.403
789	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	baeed35c-86af-44be-82d9-0680ec1e0546	2026-11-24 07:52:53.628	2025-11-24 07:52:53.647
782	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	a0508186-2911-479e-9265-20355f17c563	2026-11-21 12:02:44.678	2025-11-21 12:02:44.698
19	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	12795546-2576-41a9-a00c-b571d3109191	2025-05-04 17:30:41.511	2025-04-27 17:30:41.525
25	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	435c7430-87cd-44da-bbf2-fc9795663fed	2025-05-06 05:44:29.898	2025-04-29 05:44:29.913
27	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	f9a3590c-1695-4f60-b24d-4df275d34a88	2025-05-06 09:03:44.549	2025-04-29 09:03:44.565
33	7	0x07311cB30a4D5fAa239db6b55CC1c70879A66385	3c370bb2-abac-4c96-ac22-7833bf5de155	2025-05-09 06:10:08.89	2025-05-02 06:10:08.908
51	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	889a2ed0-c6c4-448e-b9c1-937c03523694	2025-05-13 07:37:05.902	2025-05-06 07:37:05.918
54	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	160f263a-817f-49ad-b263-3edba2fd8b66	2025-05-13 08:00:58.155	2025-05-06 08:00:58.17
63	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	b46554ef-e1e0-4adc-80ad-3d2fb00f87bb	2025-05-14 12:31:50.599	2025-05-07 12:31:50.617
71	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	89af1fb4-8e09-460b-9efe-891d256541b1	2025-05-14 18:54:27.232	2025-05-07 18:54:27.247
82	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	043e3a9f-e6b3-478b-ad14-c6f898e13d29	2025-05-14 19:22:26.983	2025-05-07 19:22:26.998
92	33	0x7Ea416c45Dfb68D19d6E85C9Bc86d24eCf71d8be	043b6229-bc9e-4ffd-a34b-5b1132164603	2025-05-15 19:02:51.855	2025-05-08 19:02:51.87
98	40	0xd87c9fd353da990d0e784aead8e1cf229e6ea24a	c646dc82-d77d-444f-815c-df222f7c0eb9	2025-05-15 19:38:59.093	2025-05-08 19:38:59.107
100	42	0xb274f36d77cf9e7268f08be9605752690d674ed9	85dab9e8-ec7a-411f-be7d-0a80076eca46	2025-05-15 19:46:17.907	2025-05-08 19:46:17.921
111	57	0xe9684a40f40decdbbe9911176f54fca0e7a205b3	c9b686ab-20f7-42d0-9ff6-13a75c80d17e	2025-05-16 10:08:01.961	2025-05-09 10:08:01.976
157	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	13f44374-58d2-4203-8bdd-667eebdfc535	2025-05-23 07:41:43.958	2025-05-16 07:41:43.977
263	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2dc18d9e-9bb5-4173-861f-df910d8d295c	2025-06-03 05:03:11.088	2025-05-27 05:03:11.107
266	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	e3b473cc-cee2-4de0-93ec-4c8c3be52ae0	2025-06-03 05:10:55.511	2025-05-27 05:10:55.526
274	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	cea342aa-2bba-4ba1-a112-3b12715bc7be	2025-06-03 07:09:48.368	2025-05-27 07:09:48.385
282	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	61688503-a561-40be-95ae-e8f06bab22bb	2025-06-03 08:24:52.892	2025-05-27 08:24:52.908
292	99	0x1f14c21f686d1b4268b084929502859ee05e8119	242ee82f-3b07-49cb-9252-71e941909402	2025-06-03 09:33:09.534	2025-05-27 09:33:09.551
304	99	0x1f14c21f686d1b4268b084929502859ee05e8119	e60626d9-2ffa-4761-9776-d607dc4a9302	2026-05-27 20:20:06.471	2025-05-27 20:20:06.496
309	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	f1c61d65-55c8-42e5-8b04-0a910b1d64e6	2026-05-28 05:31:03.788	2025-05-28 05:31:03.806
317	99	0x1f14c21f686d1b4268b084929502859ee05e8119	d5c76368-b6f2-4ccb-87de-9644c509fc30	2026-05-28 12:03:17.163	2025-05-28 12:03:17.179
337	81	0xfc065ed0904e750c18288060bab3af32e855d307	2c00c047-0de5-410d-a315-96ab4993ef91	2026-05-30 06:56:26.603	2025-05-30 06:56:26.621
345	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	ffd57626-84cd-40b1-a081-2ded85131d66	2026-06-03 07:52:53.928	2025-06-03 07:52:53.945
346	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	3596e43a-67e8-43a0-961c-d920ba6957bf	2026-06-05 05:08:44.731	2025-06-05 05:08:44.747
358	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	3d0dfe82-d61e-4fa2-a0b8-c551bacdc42a	2026-06-12 08:37:02.299	2025-06-12 08:37:02.315
381	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	bfa9b7e3-6288-4313-8cc8-015c125118ee	2026-06-19 10:30:18.944	2025-06-19 10:30:18.961
390	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	465c228c-bc48-4532-bac4-caba96d0f2c3	2026-06-26 10:33:05.679	2025-06-26 10:33:05.697
396	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	ec62126c-b4c0-41b1-a599-f4c4318c1946	2026-07-04 20:18:39.836	2025-07-04 20:18:39.854
399	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	e00f5daf-e1e8-4ac7-9d05-e6a0b5b2c3b4	2026-07-08 11:14:34.814	2025-07-08 11:14:34.834
421	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	8aa878c3-9f8b-4546-8cd3-c54aaf9d74b0	2026-07-18 14:59:11.103	2025-07-18 14:59:11.121
423	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	e8ee9e46-ac8c-4cde-a580-ad6dab15f228	2026-07-21 07:21:03.055	2025-07-21 07:21:03.073
424	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	9b54c026-9ba7-4af5-847b-04c146bea2bc	2026-07-22 10:11:18.936	2025-07-22 10:11:18.953
425	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	99d7a8fb-fb25-422a-ba99-e4fa74e56485	2026-07-23 09:07:28.739	2025-07-23 09:07:28.757
427	99	0x1f14c21f686d1b4268b084929502859ee05e8119	8145de7f-9545-4e0b-9e25-cfd233c5d001	2026-07-28 04:58:34.906	2025-07-28 04:58:34.924
428	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	3cc021d6-5226-41a3-abec-8afb89633d93	2026-07-28 07:24:21.809	2025-07-28 07:24:21.829
404	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	d57646b0-12e7-4d47-af10-c1ca3ed892c4	2026-07-09 10:42:07.768	2025-07-09 10:42:07.789
403	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	10054d6f-7eb5-4108-806c-eb0dce2017f9	2026-07-08 12:58:22.044	2025-07-08 12:58:22.065
405	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	d8609f86-390f-45d6-a3c3-7e5295c2d18b	2026-07-09 10:48:04.032	2025-07-09 10:48:04.05
432	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	64ca2fd8-affe-4fa8-a99f-f147c497881c	2026-07-29 11:43:24.392	2025-07-29 11:43:24.411
433	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	4ff60180-f097-4d05-9984-6ba70bd009d1	2026-07-30 08:15:01.391	2025-07-30 08:15:01.409
434	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	48a15c76-0711-4c3d-aa6c-436a08fc0a19	2026-07-30 12:25:25.568	2025-07-30 12:25:25.586
820	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	b9f4e1e8-5b52-4f7b-950f-0d5e5ab00fa8	2026-12-04 10:49:43.553	2025-12-04 10:49:43.57
8	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	cc0afe7c-ee64-46d1-a9a7-b2c6961fe7e5	2025-05-03 10:13:41.661	2025-04-26 10:13:41.676
11	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	8df7e00d-778b-47ae-b001-6d16ab25160c	2025-05-03 13:05:23.246	2025-04-26 13:05:23.264
12	3	0x295514b489d94F8effdC4d728937582167Cc15B9	2f5f19cd-1d39-4ce2-9a25-1ac4ed66561a	2025-05-03 16:03:11.037	2025-04-26 16:03:11.052
13	3	0x295514b489d94F8effdC4d728937582167Cc15B9	5c946f66-f942-4f24-8548-072005c170ca	2025-05-03 16:03:51.553	2025-04-26 16:03:51.569
4	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	1a714782-ccd8-4e4e-8af0-21f94e499c09	2025-05-03 09:21:54.714	2025-04-26 09:21:54.728
5	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	19056220-f433-49fd-b86f-144c99445b15	2025-05-03 09:34:06.04	2025-04-26 09:34:06.054
3	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	0ffc47fa-e585-43e4-b915-fdf7e3801ae0	2025-05-03 09:15:42.899	2025-04-26 09:15:42.914
9	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	1ac0bf6d-d9f4-4225-ac7f-29e685c5052d	2025-05-03 10:37:14.938	2025-04-26 10:37:14.954
30	2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	602c3aac-a6a8-4463-9afa-df43b434938c	2025-05-06 19:20:50.469	2025-04-29 19:20:50.485
107	49	0x933d68f7bdde84a55f797e15544dfa961d3668ac	89d005d5-acd6-4caa-a555-58643096ec96	2025-05-15 20:24:42.295	2025-05-08 20:24:42.31
115	64	0x18d0b4429437bb38ec5b33f6f42af10fc5fe2fd1	e0c366cd-765c-4143-89a8-ad0970ba32a2	2025-05-16 11:03:34.498	2025-05-09 11:03:34.513
130	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	363a4d71-9e05-4245-a919-d60b0b9bfa9a	2025-05-18 14:16:19.278	2025-05-11 14:16:19.405
166	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	d46b9be9-ec6b-43fa-bfd2-012595a404fd	2025-05-26 08:43:39.161	2025-05-19 08:43:39.178
258	98	0x6a65b23dcbd5a218f173aee334d9022744d0ab20	cafa2fda-0a68-4510-a85a-fd421b6cebb4	2025-05-30 10:47:14.732	2025-05-23 10:47:14.749
284	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	dfd3b729-b6e0-4691-91b4-675d42b89b75	2025-06-03 08:26:52.395	2025-05-27 08:26:52.411
285	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	380620a1-d5d3-4cdc-8b0b-15bfc570af94	2025-06-03 08:31:36.955	2025-05-27 08:31:36.97
287	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	38a82e9c-0df9-4bbc-a13c-b73a6e864aa9	2025-06-03 08:35:32.214	2025-05-27 08:35:32.231
289	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	6d31a474-0f0f-401a-9a70-365d8a4eb7c8	2025-06-03 08:48:15.134	2025-05-27 08:48:15.151
315	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	41920a11-7b09-4598-90b9-396a987cea67	2026-05-28 11:54:08.619	2025-05-28 11:54:08.635
340	99	0x1f14c21f686d1b4268b084929502859ee05e8119	86a644af-f40b-4e59-8ef1-ea197451afc3	2026-05-30 19:42:44.438	2025-05-30 19:42:44.455
435	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	bf0500dd-e145-40e6-a8c5-b951f27609b4	2026-07-30 12:26:10.051	2025-07-30 12:26:10.069
436	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	107a1d7e-8469-4d83-bbec-c7f287789e4b	2026-07-31 07:59:34.509	2025-07-31 07:59:34.527
437	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	7459a866-67d9-4d2d-ad6b-7ecad9aaa829	2026-08-01 07:04:54.647	2025-08-01 07:04:54.667
412	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	b71d22d6-f3cc-4be8-aaf5-b4dcd53e5b65	2026-07-13 13:22:58.413	2025-07-13 13:22:58.433
450	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	361c5ecd-47de-4c91-b5fb-c1c5f9c53295	2026-08-06 07:12:35.56	2025-08-06 07:12:35.579
26	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	4c66b520-423f-49f4-8e42-11d33b28ef76	2025-05-06 08:59:42.343	2025-04-29 08:59:42.358
108	53	0x6769c8391d630c6679f96b8121f3be2e03ab7bf7	19536f95-32fa-4295-a2ed-c57f39bdad47	2025-05-16 07:03:19.266	2025-05-09 07:03:19.281
117	71	0x34ea039c3835b0c625da8bfb1e3cef1905d22913	153ff955-eab7-4341-a451-3a959a20309b	2025-05-16 12:40:15.64	2025-05-09 12:40:15.655
127	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	b4306f5c-811c-49f3-9d21-6fef0ce72214	2025-05-17 11:21:50.54	2025-05-10 11:21:50.555
160	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	7226791f-01fa-4f1d-a026-6c10939a403d	2025-05-24 18:25:35.773	2025-05-17 18:25:35.787
188	85	0xebe4ee33db0d0a0fd8be18fe7e45c006093a77c0	be9be0d9-a0dd-464a-b408-e5d0b4c59fc8	2025-05-27 09:48:33.712	2025-05-20 09:48:33.728
180	15	0xad4474df3230a95a39d9937ab0ad91113972204a	8e19ed43-5a4f-4cba-b84d-e5fff2f7b23c	2025-05-27 05:26:40.231	2025-05-20 05:26:40.257
202	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	03e8d17d-8054-4963-9358-83ded826b2d7	2025-05-28 07:19:50.673	2025-05-21 07:19:50.687
205	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	f1e182cd-abe3-40ca-b4f0-d006dc26058a	2025-05-28 07:25:52.058	2025-05-21 07:25:52.073
208	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	fc73fb2a-1590-4436-b9b3-4c8f2ee98106	2025-05-28 08:41:24.892	2025-05-21 08:41:24.907
219	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	f2967d2b-b46c-4217-93aa-1c81f406a36d	2025-05-28 18:53:06.676	2025-05-21 18:53:06.701
220	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	fcb3cbe7-5b28-4f70-bd42-4640f81ce2f0	2025-05-28 19:39:55.191	2025-05-21 19:39:55.208
223	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	06b71b27-eab1-4c85-90e2-3aafbc7afe5f	2025-05-28 19:57:58.97	2025-05-21 19:57:58.986
224	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	a59e7d09-8f69-4f91-a3cb-2f06c707f37e	2025-05-28 20:18:43.54	2025-05-21 20:18:43.557
236	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2b0cad05-cd01-4123-8451-0e6a39ddef34	2025-05-29 05:50:36.496	2025-05-22 05:50:36.512
239	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	8e9e3b83-2027-4fa7-b3f6-ba683597d097	2025-05-29 07:53:01.942	2025-05-22 07:53:01.962
242	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	5059aed1-f3bf-439b-8bd4-9fdef0428726	2025-05-29 09:47:06.76	2025-05-22 09:47:06.778
244	91	0x4191f0f0ea0b0f5bc6f46772db6a223045195112	0607b63e-32c1-48d8-a7a2-ccdf13f1e11a	2025-05-29 10:15:15.934	2025-05-22 10:15:15.948
247	5	0xe2cce86f759aa8d616013a38e7e9db4054534f25	11e1bb2c-163b-4e7b-a695-7985b58254c9	2025-05-29 12:16:43.732	2025-05-22 12:16:43.751
252	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	3b5d3d72-38c3-48e1-a886-2ea817e9de30	2025-05-30 05:18:08.532	2025-05-23 05:18:08.55
264	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	dee58c7e-760d-4491-8785-6784d9a62b4f	2025-06-03 05:07:22.285	2025-05-27 05:07:22.301
312	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	641ca448-de03-4d0f-a38f-897130fd7c64	2026-05-28 06:47:09.095	2025-05-28 06:47:09.109
335	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	21d9f5a4-090c-476d-b550-32f1deebaba1	2026-05-30 05:17:15.492	2025-05-30 05:17:15.508
339	100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	2c62092c-adc4-42fc-bba3-6ca6328c9c16	2026-05-30 12:03:13.013	2025-05-30 12:03:13.03
349	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	9b8f9d4c-5cb0-4fa7-b340-38bbb3222dba	2026-06-05 05:42:34.746	2025-06-05 05:42:34.765
353	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	fee8ca86-6eb3-4291-ade6-5bf99c3de486	2026-06-06 17:32:03.619	2025-06-06 17:32:03.635
355	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	3823ed48-2d77-4112-833d-f2bec9535415	2026-06-10 05:14:32.579	2025-06-10 05:14:32.594
359	99	0x1f14c21f686d1b4268b084929502859ee05e8119	b55648df-9475-4738-810a-e06eb6dfd4c9	2026-06-13 05:40:40.624	2025-06-13 05:40:40.641
371	100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	c5e48d0c-8b1f-4cbd-a1f2-402d11d6f01e	2026-06-15 10:12:41.518	2025-06-15 10:12:41.534
374	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	1d63d03c-4589-449b-a88c-0c582d0e180b	2026-06-16 12:45:43.949	2025-06-16 12:45:43.964
378	99	0x1f14c21f686d1b4268b084929502859ee05e8119	ee5f491c-0224-45df-95a9-89f0553f35a7	2026-06-18 14:20:06.611	2025-06-18 14:20:06.627
445	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	a89ac6eb-2e4a-437f-b892-d48667b17075	2026-08-01 11:03:06.869	2025-08-01 11:03:06.886
459	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	15b51aff-eaf8-452c-8e70-ca300c5fe48b	2026-08-08 07:37:47.157	2025-08-08 07:37:47.175
462	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	fb95e83a-d2e8-4de3-9f0e-1b8bee78d628	2026-08-11 07:16:59.57	2025-08-11 07:16:59.588
28	5	0xe2CCe86F759aa8d616013A38E7e9dB4054534f25	9fab0403-4104-4e51-9c2e-72cc64e57913	2025-05-06 10:43:19.13	2025-04-29 10:43:19.144
57	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	ec4fde8f-bc9a-45ae-9c23-673e4e7ed16a	2025-05-13 08:03:35.867	2025-05-06 08:03:35.883
52	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	09d8edda-d3b5-4140-b667-b246d01f0763	2025-05-13 07:43:04.178	2025-05-06 07:43:04.194
60	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	1cda8183-ed22-4ede-8dbd-c07d5f29bdd6	2025-05-13 09:21:45.431	2025-05-06 09:21:45.446
72	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	86409176-a1ce-480b-8dbc-af73c05fe2e5	2025-05-14 19:00:31.636	2025-05-07 19:00:31.651
74	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	62a0d7a0-012c-4652-a89f-716455e975b8	2025-05-14 19:05:06.069	2025-05-07 19:05:06.086
80	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	05aa3fec-574c-45c5-8e95-838f7dc2aae0	2025-05-14 19:18:26.78	2025-05-07 19:18:26.794
85	23	0x7C13a821a79E00dfF6e47Aa73b7466F580e5D154	65e53265-a66b-43c9-a243-8c1dfb02b338	2025-05-15 18:04:24.572	2025-05-08 18:04:24.589
86	25	0xfB753b13C9b5E12B9202a47b9d1f9a29fd3CbDF1	a74a48c8-be07-4edd-b422-5c356e1fb072	2025-05-15 18:11:01.882	2025-05-08 18:11:01.897
88	27	0xaE9054bcc0f89b2285CCA8ebBeaBD9a34280D4af	41c2e383-0176-4e3e-9b7b-ebce78d3d4eb	2025-05-15 18:42:30.992	2025-05-08 18:42:31.008
89	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	c31e08df-c24a-4fcd-bb20-0968634d75d5	2025-05-15 18:45:22.051	2025-05-08 18:45:22.068
91	32	0x4869ce8eaeAD8429DCC7736535c8444b05186711	8c0bc04a-1c51-4da8-8c82-3e8f8ed41097	2025-05-15 19:01:59.02	2025-05-08 19:01:59.038
112	61	0xee6c342b112e2ea5eaf03e859291bbf46c7ebde9	fce5e785-ce99-42da-b117-5aa7157e43ba	2025-05-16 10:46:46.709	2025-05-09 10:46:46.725
121	75	0x67f7a09aa3a3c639e46766288a0908008b36484a	df43afa3-2904-47aa-be39-549442aba323	2025-05-16 17:07:04.225	2025-05-09 17:07:04.24
119	73	0xc64c6325caf34486a8c0c23ef85ab1858be1babe	48c80a77-c70d-469f-acb2-6b9563113101	2025-05-16 14:06:28.99	2025-05-09 14:06:29.008
126	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	6129cd11-2025-435a-9dd3-b8e6f9e38234	2025-05-17 11:07:25.14	2025-05-10 11:07:25.162
161	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	f4af94fa-201c-44be-a881-ee00a9c0c587	2025-05-26 04:56:10.933	2025-05-19 04:56:10.948
259	5	0xe2cce86f759aa8d616013a38e7e9db4054534f25	9583b92b-c569-44b7-9d74-85d450928cec	2025-05-30 11:22:18.567	2025-05-23 11:22:18.583
270	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	16672cdc-3a67-4900-acc2-8ba4526af7b9	2025-06-03 05:23:47.397	2025-05-27 05:23:47.412
277	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2d466fe3-9cf2-419a-b85d-7b48c9da7849	2025-06-03 07:18:22.066	2025-05-27 07:18:22.084
280	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	fbbe8ed8-1ba2-45e5-afea-12522acaf67f	2025-06-03 07:29:50.776	2025-05-27 07:29:50.791
283	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	ac617d6c-abe5-40ba-99b5-777908da5d5e	2025-06-03 08:25:10.263	2025-05-27 08:25:10.281
286	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	adc8b978-fb2f-47cc-b213-f83e20e1d4c8	2025-06-03 08:35:08.839	2025-05-27 08:35:08.857
288	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	c3b0d232-e6e3-406d-a700-866b40a9d758	2025-06-03 08:35:48.64	2025-05-27 08:35:48.656
298	99	0x1f14c21f686d1b4268b084929502859ee05e8119	46be84f1-ef4c-4fa8-bef4-9a31a7509d71	2025-06-03 09:41:46.066	2025-05-27 09:41:46.083
314	100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	40ce7bc4-8b75-4a38-ad9d-e0c847871d97	2026-05-28 11:51:14.367	2025-05-28 11:51:14.382
342	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	09257f03-8606-456f-93d7-1f143f7af804	2026-06-02 05:06:46.045	2025-06-02 05:06:46.062
350	100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	75032856-7c32-4bb2-a3a7-8c15b1c1fda4	2026-06-05 15:56:53.576	2025-06-05 15:56:53.592
351	100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	9aa74cfd-34b8-47a5-b422-69f5dc8deabb	2026-06-05 16:31:56.445	2025-06-05 16:31:56.462
356	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2487200f-5986-4fa7-bbcb-76730a661524	2026-06-10 05:39:33.325	2025-06-10 05:39:33.342
360	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	4da6b68c-c1b7-483d-8fd9-120a4f62d52d	2026-06-13 08:36:18.041	2025-06-13 08:36:18.057
384	99	0x1f14c21f686d1b4268b084929502859ee05e8119	dcdb6b8b-79c6-49dc-a085-f47c1c5cba84	2026-06-23 05:24:20.264	2025-06-23 05:24:20.281
407	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	e1fa11a6-4457-426d-b185-b6bc445d8051	2026-07-09 18:34:24.498	2025-07-09 18:34:24.518
410	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	8d5f5d98-325a-4544-966a-326d38df91e1	2026-07-10 12:26:08.197	2025-07-10 12:26:08.214
411	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2a09e5d8-4e4d-4c1b-914e-d440a44798db	2026-07-11 09:36:37.203	2025-07-11 09:36:37.221
415	99	0x1f14c21f686d1b4268b084929502859ee05e8119	73da1900-9a72-4af8-9ed5-6c6c5d59c3cb	2026-07-15 18:27:46.545	2025-07-15 18:27:46.564
416	99	0x1f14c21f686d1b4268b084929502859ee05e8119	0d02c3fb-eda7-4d7d-91a6-c9b9937f39bc	2026-07-15 18:27:58.68	2025-07-15 18:27:58.701
417	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	1a0e394a-67ab-4a91-bc8e-38c471dcb931	2026-07-16 07:18:48.868	2025-07-16 07:18:48.888
419	99	0x1f14c21f686d1b4268b084929502859ee05e8119	4d3dfedd-db7f-4552-97ce-7f6df918ad3d	2026-07-18 04:43:15.274	2025-07-18 04:43:15.3
429	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	13a0a6db-3c17-48b2-821e-bf0b928eb41d	2026-07-28 11:47:38.359	2025-07-28 11:47:38.377
448	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	81e6455c-4a37-4c8f-b30e-01244c50eab0	2026-08-04 10:26:50.089	2025-08-04 10:26:50.106
455	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	5f3d8101-d21a-4107-ae32-b6a9046e7839	2026-08-07 12:57:25.656	2025-08-07 12:57:25.673
478	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	2b8a6add-f02b-4ca9-adac-eb3a26fc847a	2026-08-21 18:42:31.239	2025-08-21 18:42:31.258
492	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	13de3e8a-ba6d-4f96-922a-9ad4c4eeaaa0	2026-08-29 08:58:26.285	2025-08-29 08:58:26.303
493	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	dd232670-fed4-49c2-9c5e-1e772ff9775b	2026-08-29 10:41:44.762	2025-08-29 10:41:44.779
494	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	d7f53c2c-005a-435a-95b9-718c0cd6a02f	2026-08-29 13:09:50.381	2025-08-29 13:09:50.399
480	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	44b6cdfc-8b9f-4dae-b7e5-38e8e7a0bbf1	2026-08-25 07:50:29.162	2025-08-25 07:50:29.18
486	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	e42a1981-4f2a-475c-94ae-fcf6db163a75	2026-08-27 10:42:04.648	2025-08-27 10:42:04.666
495	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	a2f494e8-64db-4efa-8f4f-9f0e3a2c9ef5	2026-08-29 13:13:29.822	2025-08-29 13:13:29.84
29	5	0xe2CCe86F759aa8d616013A38E7e9dB4054534f25	2833cf87-95c3-4bb2-bd9a-e0a4d8406f1f	2025-05-06 10:44:00.152	2025-04-29 10:44:00.168
37	8	0x8AB79B36150Ffec37bFF771331feEC56028E6c0E	af325638-5b23-4afc-913d-cbbaa8255366	2025-05-09 07:31:20.368	2025-05-02 07:31:20.383
42	8	0x8AB79B36150Ffec37bFF771331feEC56028E6c0E	ea375612-56e6-48a3-af85-e19493dbb5bd	2025-05-09 09:15:56.373	2025-05-02 09:15:56.391
41	8	0x8AB79B36150Ffec37bFF771331feEC56028E6c0E	84331652-072e-442f-b2dd-4b848afd5636	2025-05-09 07:59:29.194	2025-05-02 07:59:29.209
45	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	3d9fcc84-f6a1-4790-adcd-5bcd00cd739b	2025-05-10 14:17:09.653	2025-05-03 14:17:09.669
48	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	2c07df20-7e18-475b-90ff-52d5ab46c3ce	2025-05-11 11:29:21.035	2025-05-04 11:29:21.049
55	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	5abfa00e-e2ea-47a2-8cd2-58f6e8454188	2025-05-13 08:01:13.33	2025-05-06 08:01:13.346
61	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	62a17038-4b30-4a8e-8720-4d6aa9570c03	2025-05-14 06:44:02.753	2025-05-07 06:44:02.769
62	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	94392dd7-7a43-44e9-b613-b75918f4668f	2025-05-14 06:44:42.629	2025-05-07 06:44:42.644
67	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	0dae3185-6dd1-4e6f-97eb-f61b76a198cf	2025-05-14 16:51:26.488	2025-05-07 16:51:26.503
69	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	7fa0d90a-4e4a-4f13-8f5b-ae192ed5c9d9	2025-05-14 18:30:22.709	2025-05-07 18:30:22.749
73	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	0b9641e0-17db-40b1-a346-c5fe994ac60d	2025-05-14 19:01:04.154	2025-05-07 19:01:04.17
75	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	968a1314-6158-4ed0-8d3f-1309282d629f	2025-05-14 19:07:54.95	2025-05-07 19:07:54.966
76	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	f64739cd-db41-499e-ab84-e74569d67bfd	2025-05-14 19:10:21.058	2025-05-07 19:10:21.072
77	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	126702f1-d660-4e7e-bf5c-13d4cdf4a6b8	2025-05-14 19:15:17.94	2025-05-07 19:15:17.954
78	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	9bb95f31-e97c-478c-8ce5-bc8410955807	2025-05-14 19:17:27.622	2025-05-07 19:17:27.637
79	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	2546e05f-fab9-44aa-94ae-1d4f19494041	2025-05-14 19:18:15.799	2025-05-07 19:18:15.813
106	48	0x596d7b4eb8ef912473e2e2e67666e0ac403672d7	5998c650-d0bd-4731-8010-bf779832b843	2025-05-15 20:21:27.232	2025-05-08 20:21:27.246
120	74	0xfe459ae41bbdfbeb62f0ac0ffcb7560957500522	bf094114-8a81-4bd2-84ae-673e5260fc66	2025-05-16 14:17:39.419	2025-05-09 14:17:39.436
131	78	0xfcad920f66c01135df5dedb31bcf206208575e57	ce8755b2-45d4-4ed5-ba35-efc1516f87f0	2025-05-19 07:11:27.213	2025-05-12 07:11:27.229
139	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	49359b4d-6517-4449-a358-b53ec9d2ec82	2025-05-20 09:54:14	2025-05-13 09:54:14.015
144	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	b351fc80-d865-485d-80d7-830e2657d533	2025-05-21 08:36:26.017	2025-05-14 08:36:26.034
164	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	0c56f1bc-86d6-4abb-b785-cc2f5ab81986	2025-05-26 08:25:34.181	2025-05-19 08:25:34.196
265	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	bd25c72e-0983-46ba-8d0a-4c252de83f62	2025-06-03 05:09:08.444	2025-05-27 05:09:08.461
295	99	0x1f14c21f686d1b4268b084929502859ee05e8119	8133a939-9079-4c23-8315-08a0eb874b4e	2025-06-03 09:38:10.618	2025-05-27 09:38:10.737
296	99	0x1f14c21f686d1b4268b084929502859ee05e8119	a8c10e5a-ac4c-4bbf-95ac-f3d8454613d7	2025-06-03 09:38:26.779	2025-05-27 09:38:26.821
300	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	d8a4bef5-4dbc-4fc5-a4b7-91d7b64c6484	2025-06-03 10:30:53.223	2025-05-27 10:30:53.241
316	100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	241cb8b7-e086-4ee1-a84a-b0970e81c25c	2026-05-28 11:56:56.312	2025-05-28 11:56:56.329
338	81	0xfc065ed0904e750c18288060bab3af32e855d307	bc9ae465-6490-49f1-86ae-d5538903f983	2026-05-30 07:08:15.272	2025-05-30 07:08:15.29
354	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	8160e0d1-6752-4cc3-8c4e-4be7df0d41ad	2026-06-09 09:47:39.292	2025-06-09 09:47:39.308
357	100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	13d63053-87f9-426f-ab28-8906a3e25a49	2026-06-11 06:03:10.279	2025-06-11 06:03:10.294
361	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	63b74795-048d-47a0-9719-5205602b026d	2026-06-13 10:16:46.031	2025-06-13 10:16:46.047
447	99	0x1f14c21f686d1b4268b084929502859ee05e8119	31756535-cd2d-4079-b088-14a5803e75a4	2026-08-03 18:31:59.595	2025-08-03 18:31:59.615
458	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	d3391ee8-3d8b-4b6b-97fe-87f90e21aff4	2026-08-08 07:15:30.195	2025-08-08 07:15:30.213
463	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	90f297bb-0201-45af-b71a-91dbf749372c	2026-08-11 11:07:08.494	2025-08-11 11:07:08.512
467	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	b49fc1e4-3c08-4ec7-b09e-eb10af1aff0a	2026-08-13 09:24:28.615	2025-08-13 09:24:28.633
454	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	29732f4a-116f-4ab8-9981-7edcc4a63bdc	2026-08-06 13:49:27.119	2025-08-06 13:49:27.137
475	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	412ddeed-dbb7-4dec-9b26-8e4f2176fa87	2026-08-19 12:19:46.007	2025-08-19 12:19:46.025
465	99	0x1f14c21f686d1b4268b084929502859ee05e8119	84f26a85-1f3e-41ae-8937-fd393876a56f	2026-08-13 05:07:12.272	2025-08-13 05:07:12.29
479	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	157b0f39-af43-4565-94c9-ac5f7a5bfc22	2026-08-24 13:39:55.552	2025-08-24 13:39:55.57
481	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	a97149a1-4390-4efe-b982-c07d2cd308bf	2026-08-25 08:41:08.451	2025-08-25 08:41:08.469
483	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	e2a84b4c-503c-4248-bce1-9a08e132938e	2026-08-27 08:56:40.264	2025-08-27 08:56:40.283
487	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	d3db5eef-76ad-4333-a739-2b7892c9ddff	2026-08-27 13:56:52.65	2025-08-27 13:56:52.667
491	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	a69a1b1d-84c7-4af3-bede-39e6239a5ae9	2026-08-29 07:08:40.725	2025-08-29 07:08:40.744
488	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	9b83b8a2-a04c-4e52-abcc-cf880d0f57e7	2026-08-28 08:34:10.988	2025-08-28 08:34:11.008
31	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	40a7f1c6-7c56-471b-abe1-ca5e2216c3e5	2025-05-07 05:28:24.87	2025-04-30 05:28:24.886
36	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	a12520d5-c748-4090-b38d-2ba5180b81a9	2025-05-09 07:24:05.374	2025-05-02 07:24:05.392
40	8	0x8AB79B36150Ffec37bFF771331feEC56028E6c0E	31dba0f5-728b-4781-8ac9-8628bb522cd3	2025-05-09 07:39:45.341	2025-05-02 07:39:45.358
38	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	20b23a52-f29c-4a3e-86b2-c290556461b6	2025-05-09 07:31:39.246	2025-05-02 07:31:39.261
39	8	0x8AB79B36150Ffec37bFF771331feEC56028E6c0E	8e14e810-5811-48b4-82b2-a827ad3c7acb	2025-05-09 07:39:11.422	2025-05-02 07:39:11.444
46	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	b57e9745-9196-479b-8f31-bedeb9b45c81	2025-05-11 11:19:01.319	2025-05-04 11:19:01.333
47	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	3db74f15-8ddb-4d9c-9e08-c80e96af0ea4	2025-05-11 11:24:07.486	2025-05-04 11:24:07.5
49	14	0x8C571cAec312743702eF5f7A89825F1395FFD1A5	b7b74225-1835-44d8-a148-c5b901f550e1	2025-05-12 05:24:45.719	2025-05-05 05:24:45.735
59	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	e14beef7-5ff7-4d6a-889c-2b9ab3e2eb7c	2025-05-13 08:16:59.265	2025-05-06 08:16:59.281
64	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	4e02c854-ff47-4b55-9622-8b3af98af9c1	2025-05-14 12:41:34.745	2025-05-07 12:41:34.76
66	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	d7a8fe52-f480-4dc6-94da-271b7b279704	2025-05-14 12:51:11.364	2025-05-07 12:51:11.38
65	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	b56bc835-e2ae-4c6b-8fb0-ca3c1b607a40	2025-05-14 12:42:41.904	2025-05-07 12:42:41.918
70	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	351ad77d-8be9-423b-8149-75c12caa180c	2025-05-14 18:51:58.032	2025-05-07 18:51:58.046
81	18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	36da2b29-fbac-42d3-b4df-493eb62a1a8f	2025-05-14 19:21:05.782	2025-05-07 19:21:05.803
109	54	0x24fa898fbae85d59797cd2980d335fb9e5c5246b	c78fe933-2e51-474b-a020-aced28475ccc	2025-05-16 07:10:19.717	2025-05-09 07:10:19.737
116	65	0xc8d462fd09e6a81a91ddc08f29a137068f37bdea	db82fe2c-756b-4d86-8bae-db7a7e0460ae	2025-05-16 11:05:11.884	2025-05-09 11:05:11.9
128	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	c498bc38-f766-4171-8038-9345660ef9af	2025-05-17 13:41:17.022	2025-05-10 13:41:17.037
135	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	fce030df-b225-42d6-8f99-8188decec2eb	2025-05-19 12:42:05.94	2025-05-12 12:42:05.957
136	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	d081e72c-cdbe-4445-8d19-8f361dcce50c	2025-05-20 05:04:43.621	2025-05-13 05:04:43.637
142	15	0xad4474df3230a95a39d9937ab0ad91113972204a	cfc9cd40-473a-4823-a009-b8aecf4e3988	2025-05-21 07:47:45.198	2025-05-14 07:47:45.215
145	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	50ae0236-e568-4bca-b899-aebbd144de66	2025-05-21 09:19:15.183	2025-05-14 09:19:15.201
148	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	277db81c-f5c4-4c4c-84f4-11725ef1bc9f	2025-05-22 05:17:54.982	2025-05-15 05:17:55
153	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	a8fddcf6-a879-4db7-a58e-a6601713041f	2025-05-22 18:49:51.474	2025-05-15 18:49:51.492
169	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	92817a2a-4bb5-4fab-904b-1de008df7ea1	2025-05-26 09:09:12.472	2025-05-19 09:09:12.49
158	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	e9ccaa8f-686c-4772-bd75-5e988524326b	2025-05-23 09:26:05.87	2025-05-16 09:26:05.891
174	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	03c6435b-b4ab-4f29-a0ca-63d95053f20c	2025-05-26 10:48:23.965	2025-05-19 10:48:23.984
176	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	37ce82d2-8a54-4776-9d15-b1808280591a	2025-05-26 19:52:15.237	2025-05-19 19:52:15.254
182	32	0x4869ce8eaead8429dcc7736535c8444b05186711	7ad74a69-7e56-4626-aeb9-6a409ef8155f	2025-05-27 05:46:41.716	2025-05-20 05:46:41.734
186	84	0xcd0295c2c7acd5becfa53bbbcb60bc7f88130423	a26d9579-e31d-466f-8c18-c534bdf46088	2025-05-27 09:00:46.247	2025-05-20 09:00:46.263
184	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	cc7ce15e-6f06-4500-b845-c39f1bbd4d2b	2025-05-27 08:33:50.332	2025-05-20 08:33:50.348
198	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	f356409f-f21b-4577-9d86-db8deab3f0d9	2025-05-28 07:06:53.882	2025-05-21 07:06:53.897
203	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	b8e4a1de-98ac-4c6f-9327-85e4acdf1556	2025-05-28 07:22:01.135	2025-05-21 07:22:01.149
207	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	d8f886dc-cd7e-496b-8aeb-a869192da18f	2025-05-28 08:36:44.895	2025-05-21 08:36:44.91
204	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	91cf98cb-ca0e-4c6b-a0cf-b5f25869174e	2025-05-28 07:23:04.941	2025-05-21 07:23:04.955
212	90	0xcb82803b69e434bcabad4c58d010fe89917207ac	069a3d71-4f57-4a74-bdad-ad35ae6297cb	2025-05-28 09:14:43.622	2025-05-21 09:14:43.638
216	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	74e63da9-2c97-4322-99ca-c9c2c037adab	2025-05-28 09:53:20.5	2025-05-21 09:53:20.516
221	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	7c35a54a-111b-41fa-8aa7-f931c7b04924	2025-05-28 19:50:05.753	2025-05-21 19:50:05.772
222	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	9db4b0e3-e44d-4692-b5e5-2d79dbf36ee9	2025-05-28 19:52:47.591	2025-05-21 19:52:47.607
225	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	2065a0cf-155a-4418-9b52-87e7e6266c94	2025-05-28 20:45:09.59	2025-05-21 20:45:09.606
234	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	facb0e88-50ea-4df1-aa7f-73ea63676871	2025-05-29 05:10:05.48	2025-05-22 05:10:05.504
238	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	c10c9a89-20bc-4b64-8eb2-f32c28c1cad6	2025-05-29 06:39:23.138	2025-05-22 06:39:23.156
240	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	cf3bfcf6-63c7-4ba1-83cc-5c701d224d96	2025-05-29 07:56:47.121	2025-05-22 07:56:47.137
253	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	fd182823-c93f-43e0-8921-c80e6fe6d10d	2025-05-30 06:11:08.203	2025-05-23 06:11:08.221
262	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	74efb60c-ae00-477e-9a12-0ed285048c9f	2025-06-03 05:01:15.001	2025-05-27 05:01:15.02
313	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	4b1e9175-278e-48e4-9e3f-5f6281061f76	2026-05-28 11:02:30.416	2025-05-28 11:02:30.432
333	101	0x0bd58ac07642fbc4562e5d107b353ae5fa65c8f1	58d4f4a9-b9bb-4646-bce7-86b7f94d6971	2026-05-29 12:54:28.11	2025-05-29 12:54:28.126
341	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	4e6e296e-2f59-4905-b180-766b3800a637	2026-05-31 12:12:52.947	2025-05-31 12:12:52.964
446	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	8e6b5e60-1f9f-41c9-bf15-11fa40115986	2026-08-01 17:35:04.917	2025-08-01 17:35:04.936
464	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	182a553a-34a1-4c81-a62d-cc85439e2214	2026-08-12 09:10:54.556	2025-08-12 09:10:54.574
468	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	36ed7355-7dbb-4e94-9d59-b0d3eedccfb6	2026-08-13 10:24:53.652	2025-08-13 10:24:53.67
451	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	9a5f373a-c1ff-4b11-ba6b-4bafe39b09c2	2026-08-06 09:20:41.491	2025-08-06 09:20:41.51
460	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	61f2d7f7-d889-4a3a-9a59-98e4f18469a4	2026-08-08 07:45:18.548	2025-08-08 07:45:18.566
456	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	db40e5dd-8e80-4c76-8d37-caa9b9805284	2026-08-07 20:12:42.086	2025-08-07 20:12:42.105
452	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	f1f7671a-fd4c-4621-9fb9-44e0c2ceae0d	2026-08-06 09:20:50.808	2025-08-06 09:20:50.828
470	99	0x1f14c21f686d1b4268b084929502859ee05e8119	a53bb584-cca1-4a10-bf84-fd201d263aca	2026-08-15 04:51:39.734	2025-08-15 04:51:39.751
474	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	17aef9a6-a9fb-4e81-8556-f01b890a9ca7	2026-08-18 07:35:35.798	2025-08-18 07:35:35.816
476	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	e3ba9a9f-16dc-4029-b482-1cbbaef0bf98	2026-08-21 07:24:46.159	2025-08-21 07:24:46.179
466	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	92413f94-0d18-4492-b233-37adc83e24c8	2026-08-13 08:29:17.104	2025-08-13 08:29:17.122
34	8	0x8AB79B36150Ffec37bFF771331feEC56028E6c0E	9d31afb5-25cb-45fb-91a0-3b7d5ef44fae	2025-05-09 07:15:08.916	2025-05-02 07:15:08.932
35	8	0x8AB79B36150Ffec37bFF771331feEC56028E6c0E	7f1b732d-d15c-4e66-b91d-d50803cead4b	2025-05-09 07:20:06.628	2025-05-02 07:20:06.645
43	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	fec7be06-4d21-4766-904b-46cd3a9be0e9	2025-05-10 14:08:51.451	2025-05-03 14:08:51.465
44	13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	678342cc-daaf-4362-9b70-599a40258ad1	2025-05-10 14:15:14.672	2025-05-03 14:15:14.687
50	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	5deac75c-8114-48ef-9498-7353fc1b43c9	2025-05-13 06:14:42.834	2025-05-06 06:14:42.85
56	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	0b5b531e-430c-4022-ac77-8e59fa9ab870	2025-05-13 08:02:58.866	2025-05-06 08:02:58.882
53	15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	a9b9922e-80e4-4a5d-9647-bb99ed4ec1d8	2025-05-13 07:51:43.481	2025-05-06 07:51:43.497
58	6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	645427b0-9f14-4ef8-aca7-dbdb99a22e19	2025-05-13 08:13:28.877	2025-05-06 08:13:28.892
496	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	c8bfc8dc-865a-4fc7-bdf1-31eee02d88a4	2026-08-29 13:13:52.126	2025-08-29 13:13:52.145
84	5	0xe2CCe86F759aa8d616013A38E7e9dB4054534f25	4f9d0782-26d7-4267-8ea5-3d3a5437ca1f	2025-05-15 11:12:31.02	2025-05-08 11:12:31.04
502	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	4669f7dd-84e3-44ec-aab8-e893d4a5fe7c	2026-09-02 17:12:51.485	2025-09-02 17:12:51.503
501	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	83f0988e-2a79-4cf5-9a1c-08943b3c2fe3	2026-09-02 12:17:08.5	2025-09-02 12:17:08.518
503	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	6956acb8-f326-4cb5-b8a8-b388b47b12ff	2026-09-04 17:54:20.538	2025-09-04 17:54:20.555
505	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	73bd8c9d-33ba-40ce-bc6c-a074de4d5094	2026-09-05 10:22:24.923	2025-09-05 10:22:24.942
95	37	0x089e6c5b287dF6D777fFCcCB24BE37568925f5FE	55ca0d7f-cba7-4411-ad89-1cd9f61010df	2025-05-15 19:28:59.62	2025-05-08 19:28:59.637
113	62	0x51eabc136ea8eb7bcbefc97ee41abb247dd75cf0	49ed04e6-e025-4583-aa57-4e0f0486a78d	2025-05-16 11:00:11.555	2025-05-09 11:00:11.57
504	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	2cc66bd6-2902-4ab8-bdc8-2ffd2542ecc6	2026-09-05 09:40:32.259	2025-09-05 09:40:32.276
498	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	cda59aef-907e-4f41-b0bf-617dc9a290d5	2026-09-01 07:17:33.777	2025-09-01 07:17:33.795
499	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	b5706b53-6ddb-4e02-a3d9-38b4715e2258	2026-09-02 10:37:26.339	2025-09-02 10:37:26.356
512	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	17595b0f-1f7c-4b21-9e6d-ecafd53ec273	2026-09-05 14:21:03.245	2025-09-05 14:21:03.262
513	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	171bb2e1-d1cc-45e6-83ba-a67ec4fc1c6a	2026-09-08 07:06:55.742	2025-09-08 07:06:55.759
514	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	34a124b1-409d-45a1-9b67-c0deb4fc514d	2026-09-08 07:09:58.529	2025-09-08 07:09:58.547
515	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	8c7bfc5b-133b-4c5f-958d-504d53547803	2026-09-08 07:51:48.342	2025-09-08 07:51:48.36
518	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	4f6848c1-b83c-4eea-aac7-2c9f72c68d18	2026-09-08 08:32:17.627	2025-09-08 08:32:17.646
520	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	09f798ac-7f6e-4423-915b-10f0ea29e60f	2026-09-10 07:16:49.804	2025-09-10 07:16:49.823
519	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	ec26f40d-490f-4237-a41e-668f1dff2047	2026-09-08 19:30:52.634	2025-09-08 19:30:52.652
105	47	0x7adc062be785ba8d01645342542073f7d30ccffb	cdcbc450-d23b-4eed-82e0-4792917b1bbf	2025-05-15 20:14:31.379	2025-05-08 20:14:31.394
104	46	0x711f16ec41dee999301b0b7cfaa1d08cb92f2097	2e15a5f9-eaa5-41f0-b430-4e1b81f4222b	2025-05-15 20:08:04.75	2025-05-08 20:08:04.765
118	72	0x6805037c523d970b0fb4b559fb88976a09b5aa45	10479ca3-b670-439d-85c9-abb048e6e14e	2025-05-16 12:41:06.434	2025-05-09 12:41:06.449
122	76	0x3cb85e61ce8a34d1cdbfebf3d778fc06ce92a83f	3260d3f3-812c-48ac-b81a-a839a3f2c353	2025-05-16 17:36:42.271	2025-05-09 17:36:42.288
123	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	e40abb1d-82cd-4bbc-bd36-76c152a41545	2025-05-16 18:02:51.059	2025-05-09 18:02:51.073
125	77	0x39abec58a79ef2c35622d10a8f63c1143dfa96f5	649d9dbb-ad32-4faa-8437-5f3db79d2124	2025-05-16 21:41:26.599	2025-05-09 21:41:26.625
159	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	491e9312-2cb0-43ed-a5c7-c04948ca0387	2025-05-23 09:27:11.463	2025-05-16 09:27:11.479
260	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	15ccc34d-89b2-4bda-97d0-a8a758e04275	2025-06-01 17:59:35.746	2025-05-25 17:59:35.764
516	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	5d8ac8c0-839e-4300-aefc-5f630e2b5855	2026-09-08 08:11:13.017	2025-09-08 08:11:13.034
517	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	970c8065-f4a2-42bb-ad96-0aeaeb1e2ced	2026-09-08 08:15:24.921	2025-09-08 08:15:24.938
271	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	a25d90db-b908-4c1f-8075-7d823e7b4ba2	2025-06-03 05:35:32.821	2025-05-27 05:35:32.836
276	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	80821b96-8720-43c9-b001-d99d91b89177	2025-06-03 07:17:28.931	2025-05-27 07:17:28.949
281	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	4f097c1a-f765-47a8-b027-b532264ec4d5	2025-06-03 07:33:39.5	2025-05-27 07:33:39.52
530	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	39eaf2b1-e907-4d2d-a402-05cd099f3e9e	2026-09-12 07:59:12.222	2025-09-12 07:59:12.239
291	99	0x1f14c21f686d1b4268b084929502859ee05e8119	2186d83d-3bda-4bb4-a5f2-257b1a160218	2025-06-03 09:09:58.385	2025-05-27 09:09:58.403
303	99	0x1f14c21f686d1b4268b084929502859ee05e8119	88c25334-94b4-4cb9-be7d-835fdab45c18	2026-05-27 15:59:51.506	2025-05-27 15:59:51.523
320	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	103a7c2f-dcdf-4de4-b22b-77420f729871	2026-05-28 20:48:33.138	2025-05-28 20:48:33.154
821	2	0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6	722f804c-a26c-4b5d-9684-2a13f1b8caaa	2027-01-17 13:45:46.475	2026-01-17 12:45:46.490604
822	2	0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6	fc144b6e-ef7f-4eb8-83a7-d10dd69f87f4	2027-01-17 13:45:53.068	2026-01-17 12:45:53.085861
114	63	0xd5e35d0641e2f97bd9573032f19c37f06303479b	81cacf56-5411-480f-ab11-8bd9511b4753	2025-05-16 11:01:48.283	2025-05-09 11:01:48.299
129	13	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	bc4138ba-f623-42ae-bfc6-afe193c2981a	2025-05-17 13:46:12.054	2025-05-10 13:46:12.068
557	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	1a5012f9-9dea-4828-8f1c-d0ab6bd376b1	2026-09-15 07:57:17.602	2025-09-15 07:57:17.619
556	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	c4057578-6bd1-4b9c-b059-aced1fc91824	2026-09-15 07:26:41.671	2025-09-15 07:26:41.688
555	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	25eae43f-1d60-4897-833b-b234c30869b4	2026-09-15 07:16:36.5	2025-09-15 07:16:36.517
134	80	0xe0dd4c3aeeb6642eccf29dc6fc464fa60ffd0452	3f5b2928-abe9-4538-97fa-8b5d3eff8196	2025-05-19 07:56:39.139	2025-05-12 07:56:39.153
137	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	e0ac7478-9b36-4238-a600-cf92a46e285a	2025-05-20 05:28:25.176	2025-05-13 05:28:25.191
140	81	0xfc065ed0904e750c18288060bab3af32e855d307	8a3455db-3823-4424-9ff7-4b26c932ef86	2025-05-20 11:38:12.452	2025-05-13 11:38:12.466
576	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	7ec6052d-b639-4bd2-93a2-1f1d65e1b60d	2026-09-18 09:30:18.608	2025-09-18 09:30:18.625
149	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	9fc28a01-01e8-468f-8645-b59dbbabb34d	2025-05-22 05:59:12.73	2025-05-15 05:59:12.747
564	99	0x1f14c21f686d1b4268b084929502859ee05e8119	23c551ab-9384-4301-a132-87224bd01f48	2026-09-16 04:47:16.114	2025-09-16 04:47:16.13
567	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2c70f5fb-c544-4033-81ae-d8cb6f4d2788	2026-09-16 08:47:55.263	2025-09-16 08:47:55.281
151	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	294faa41-c6d4-4d7d-9683-ad0d431e2c25	2025-05-22 06:21:37.682	2025-05-15 06:21:37.703
155	32	0x4869ce8eaead8429dcc7736535c8444b05186711	71a8c8bb-e941-4768-914d-d911160052f4	2025-05-23 06:50:15.137	2025-05-16 06:50:15.157
168	82	0x10707496c28a429183390cda2677ebc4bd37a874	032da0bb-17d5-4bf3-b501-9ba9cff22a02	2025-05-26 08:57:55.841	2025-05-19 08:57:55.856
257	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2252e774-6d97-4936-9007-80ffb52b0fe3	2025-05-30 09:44:51.284	2025-05-23 09:44:51.3
269	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	f51a8ecb-deda-4c69-9ced-4526c93d941f	2025-06-03 05:14:02.418	2025-05-27 05:14:02.435
273	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	c9cd29be-b94b-4867-9358-b4afce91462f	2025-06-03 06:36:14.042	2025-05-27 06:36:14.058
279	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	24872755-50a0-4036-afe6-405a033fc6ff	2025-06-03 07:26:24.057	2025-05-27 07:26:24.077
583	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	5b7add66-100d-4e96-9e45-78200e5e343e	2026-09-19 12:05:07.926	2025-09-19 12:05:07.945
293	99	0x1f14c21f686d1b4268b084929502859ee05e8119	86970c0f-fa9f-4b21-be5a-2907c40432c8	2025-06-03 09:35:01.084	2025-05-27 09:35:01.1
302	99	0x1f14c21f686d1b4268b084929502859ee05e8119	8964e141-d3f5-4ff1-9419-517e31b8d370	2026-05-27 15:40:59.518	2025-05-27 15:40:59.536
306	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	00b06953-007e-4472-b754-6fd0638a1c29	2026-05-28 05:28:17.825	2025-05-28 05:28:17.841
308	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	31036408-c29a-4699-ae7b-ddacfa308bc8	2026-05-28 05:30:38.053	2025-05-28 05:30:38.07
590	99	0x1f14c21f686d1b4268b084929502859ee05e8119	d1da0ec0-3b66-4939-9fea-61b59ec6285e	2026-09-22 04:30:06.274	2025-09-22 04:30:06.291
319	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	3db3a4cd-bcb8-4094-85c7-0ba6e213b141	2026-05-28 20:48:03.434	2025-05-28 20:48:03.45
596	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	3accfe44-73d2-4787-bf1f-a159622eda4c	2026-09-23 09:47:41.048	2025-09-23 09:47:41.065
601	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	e5ca94a3-a56a-4f4c-a355-8df9963b8724	2026-09-23 16:17:56.851	2025-09-23 16:17:56.87
606	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	dcc0acac-b4d5-4805-b6fc-e2a31ba4ec54	2026-09-25 13:37:25.072	2025-09-25 13:37:25.096
617	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	ed395d72-5e3d-469b-bd52-c742b906f7f6	2026-09-29 07:19:35.149	2025-09-29 07:19:35.168
618	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	a89cea68-5c59-4c3e-8a8a-fce997db2906	2026-09-29 07:19:39.434	2025-09-29 07:19:39.454
624	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	c84c0128-7713-4c57-8428-90fcf92df9af	2026-10-01 12:52:46.16	2025-10-01 12:52:46.178
621	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	5a033a3b-4fba-478b-a08d-01cfdf4476a7	2026-09-30 08:34:47.933	2025-09-30 08:34:47.952
626	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	c757474a-dbf1-4b2a-b075-535e52bf34df	2026-10-01 12:58:15.14	2025-10-01 12:58:15.16
642	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	c414a8df-ad2a-4ad1-8d57-ad1b2555f274	2026-10-03 10:39:31.899	2025-10-03 10:39:31.918
686	99	0x1f14c21f686d1b4268b084929502859ee05e8119	d03eedb8-bb24-4ce1-9e32-9c9b70a78376	2026-10-16 10:46:03.187	2025-10-16 10:46:03.208
173	5	0xe2cce86f759aa8d616013a38e7e9db4054534f25	4bb5cf66-e976-40fc-ad9a-2af96de61360	2025-05-26 10:40:45.518	2025-05-19 10:40:45.534
178	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	3cb00a9a-3773-44e8-9ff8-55ad7b707809	2025-05-27 05:09:53.071	2025-05-20 05:09:53.087
189	86	0xa23afd275ddc937d3b00c342bd9bf394ece471f3	062b5bac-85e8-4015-a076-6bd8c59d56ab	2025-05-27 10:36:39.054	2025-05-20 10:36:39.073
190	87	0x20b0af54a46129c09c89ec1766f08d4c9680f0d9	143548ea-82b7-4c21-ba8f-6b41508b6729	2025-05-27 12:28:20.588	2025-05-20 12:28:20.609
619	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	19c2ed6e-51c3-413b-b44c-502d4913935d	2026-09-29 07:19:47.11	2025-09-29 07:19:47.128
199	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	b0aa3993-5208-4d88-a01b-8e14a6c22d4a	2025-05-28 07:13:35.443	2025-05-21 07:13:35.462
200	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	75bf318c-cd01-496b-9bac-93f666903f1e	2025-05-28 07:15:23.67	2025-05-21 07:15:23.685
627	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	bf65f23b-e298-4ee7-8245-88ee25744351	2026-10-01 13:01:51.572	2025-10-01 13:01:51.591
625	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	6adf3f53-1f5f-4151-9dcb-dc6eebe9ad09	2026-10-01 12:55:15.892	2025-10-01 12:55:15.913
643	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	04190c06-ff1f-49ce-b648-f592362ca195	2026-10-03 10:40:20.467	2025-10-03 10:40:20.487
201	4	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	a3727205-f910-4eac-bc4b-e5ba60fc418d	2025-05-28 07:17:38.2	2025-05-21 07:17:38.215
261	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	e911bdff-2247-49fb-8f4f-6aa16524a507	2025-06-02 05:12:38.547	2025-05-26 05:12:38.562
294	99	0x1f14c21f686d1b4268b084929502859ee05e8119	500abb13-2729-4b24-a6e8-96a272582d4b	2025-06-03 09:36:39.127	2025-05-27 09:36:39.145
297	99	0x1f14c21f686d1b4268b084929502859ee05e8119	9f64beb8-833b-466b-b9eb-c8349dcfe623	2025-06-03 09:40:34.381	2025-05-27 09:40:34.399
299	99	0x1f14c21f686d1b4268b084929502859ee05e8119	c65f1b84-ab5c-4622-a6f6-9146967c65d4	2025-06-03 09:43:43.462	2025-05-27 09:43:43.483
321	99	0x1f14c21f686d1b4268b084929502859ee05e8119	f8c0e22e-6a46-4eaf-9972-df5195ac9fcb	2026-05-29 06:54:29.432	2025-05-29 06:54:29.447
646	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	f1b5d538-967b-4139-8774-42e9d6ff22aa	2026-10-03 13:07:26.584	2025-10-03 13:07:26.603
334	99	0x1f14c21f686d1b4268b084929502859ee05e8119	84128bd1-d0d1-487d-a8c5-1dc4a45515de	2026-05-30 04:58:45.63	2025-05-30 04:58:45.645
336	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	c7231f65-6c38-43d9-ab34-6fef1bd7490f	2026-05-30 05:19:51.096	2025-05-30 05:19:51.112
343	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	6792e8a3-3c5b-48ba-852b-aa1bf5e5fb45	2026-06-02 18:33:00.78	2025-06-02 18:33:00.799
344	99	0x1f14c21f686d1b4268b084929502859ee05e8119	61bfc86b-1096-4179-93ba-13c6ab2746fc	2026-06-03 04:11:23.617	2025-06-03 04:11:23.638
653	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	edb201f4-ca80-4722-8368-93ae03d53cf0	2026-10-06 07:47:00.74	2025-10-06 07:47:00.758
352	99	0x1f14c21f686d1b4268b084929502859ee05e8119	64763af5-f2a4-4e7a-8c8b-6630ead0d326	2026-06-06 04:46:04.971	2025-06-06 04:46:04.987
364	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	cc07f047-4860-4487-a55a-170d6bce7772	2026-06-13 11:03:09.069	2025-06-13 11:03:09.086
667	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	20ba8629-c2f1-4506-bfbf-25ac55a4fa69	2026-10-08 19:01:13.694	2025-10-08 19:01:13.72
376	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	397d7819-ab44-4895-a017-1fa44026cc29	2026-06-18 07:27:42.623	2025-06-18 07:27:42.639
661	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	d04c30b5-9298-413d-add9-9db045992d26	2026-10-06 20:29:02.209	2025-10-06 20:29:02.229
377	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	a7708820-03ed-4a7d-aa6b-11f3d99a99bc	2026-06-18 07:33:27.848	2025-06-18 07:33:27.863
375	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	82505ef8-1dc8-4319-be74-f3f322d69744	2026-06-17 08:23:46.279	2025-06-17 08:23:46.295
668	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	b3c6fd2f-482c-422c-bf0c-0456ef3fe4b4	2026-10-09 09:56:48.805	2025-10-09 09:56:48.823
669	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	802ec90e-5668-4514-a710-c9a276388d7b	2026-10-10 07:06:49.175	2025-10-10 07:06:49.192
675	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	88c8b392-29c3-4f3c-9c5c-1f4ef79b9b31	2026-10-13 07:05:54.116	2025-10-13 07:05:54.136
392	99	0x1f14c21f686d1b4268b084929502859ee05e8119	b2340f7c-9a2c-4168-989d-11b9ab4e2b0b	2026-06-29 05:22:16.214	2025-06-29 05:22:16.232
394	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	9805fe2f-781d-4ebb-9aaf-8222f80790ce	2026-07-03 10:32:51.145	2025-07-03 10:32:51.165
398	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	82533644-bf63-42a4-bed4-36e69a5e7e75	2026-07-07 17:58:48.922	2025-07-07 17:58:48.944
687	99	0x1f14c21f686d1b4268b084929502859ee05e8119	8187cf9b-b3b0-487a-8750-a41916a57359	2026-10-16 10:49:08.26	2025-10-16 10:49:08.281
685	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	19190b7a-02df-4b92-a00f-1d568906e473	2026-10-15 17:23:18.815	2025-10-15 17:23:18.835
700	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	07bf9b8c-fce7-4aac-9275-2049607ac35b	2026-10-23 07:31:14.504	2025-10-23 07:31:14.525
694	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	33764803-e7a3-4381-92a7-d483e6f77a0d	2026-10-20 11:05:00.274	2025-10-20 11:05:00.293
385	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	60134b22-18f9-452e-910f-943652042519	2026-06-24 09:13:13.268	2025-06-24 09:13:13.287
388	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	d95e8138-4d57-4358-a832-61e1430418f4	2026-06-25 09:23:56.898	2025-06-25 09:23:56.916
693	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	e68d10fb-122f-46a3-8059-4971338ed4b4	2026-10-20 10:43:32.844	2025-10-20 10:43:32.861
695	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	a44d24c7-ed64-4b1d-a863-132914183990	2026-10-21 11:28:06.159	2025-10-21 11:28:06.177
389	99	0x1f14c21f686d1b4268b084929502859ee05e8119	d1e1c318-c06a-46e5-9078-564d3491b5cb	2026-06-26 04:58:57.136	2025-06-26 04:58:57.151
393	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	74c24409-bb42-441f-afcf-a064d86e1281	2026-07-03 10:17:14.952	2025-07-03 10:17:14.971
401	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	7307eae9-559d-41e1-948d-2d458549b436	2026-07-08 11:21:29.059	2025-07-08 11:21:29.078
704	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	74cb675b-9d8d-4ec3-97fc-62d09d4cada3	2026-10-23 12:43:33.96	2025-10-23 12:43:33.979
406	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	6ea04603-8b0b-411f-8749-2f3f63ec5436	2026-07-09 11:09:17.693	2025-07-09 11:09:17.708
408	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	cc159eab-3c60-4cab-b207-8c02fe6f699a	2026-07-09 18:36:27.5	2025-07-09 18:36:27.518
409	99	0x1f14c21f686d1b4268b084929502859ee05e8119	43842938-7aed-4a96-baa2-9bcf453da988	2026-07-10 05:37:57.513	2025-07-10 05:37:57.533
418	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	c43cb292-e77b-4492-90c3-4472607823fe	2026-07-16 08:58:12.468	2025-07-16 08:58:12.486
420	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	ffbb6fca-1941-4ca5-8f7e-3798d3665640	2026-07-18 07:12:05.583	2025-07-18 07:12:05.601
717	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	addfed3f-6869-4e09-9ea2-9fdb167f7200	2026-10-27 08:04:35.778	2025-10-27 08:04:35.797
256	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	b92ff5c8-1392-49c2-b2ac-f296eba51cfd	2025-05-30 09:43:35.117	2025-05-23 09:43:35.134
736	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	efe77cf0-8730-4301-8d85-57a476bac207	2026-11-04 10:16:00.253	2025-11-04 10:16:00.27
272	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	2e3365f8-8f45-487d-bc3e-ba5972e72b92	2025-06-03 06:07:09.568	2025-05-27 06:07:09.584
275	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	b0cd326f-77e4-4229-9164-db7ad60e6b37	2025-06-03 07:14:43.425	2025-05-27 07:14:43.442
278	7	0x07311cb30a4d5faa239db6b55cc1c70879a66385	66aaeda3-25b6-4457-9d1a-2b9290ba452b	2025-06-03 07:23:57.85	2025-05-27 07:23:57.866
290	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	4b6743b2-9525-4f57-9df0-1a49ac8b57a5	2025-06-03 08:58:53.716	2025-05-27 08:58:53.733
728	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	0843e887-5039-4914-93de-3dff1bef49dd	2026-11-01 14:18:14.522	2025-11-01 14:18:14.54
301	99	0x1f14c21f686d1b4268b084929502859ee05e8119	0f1ebef7-ab8c-4eb3-a3de-1f64f8d0b1e4	2026-05-27 12:03:32.784	2025-05-27 12:03:32.8
734	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	6b732277-75a9-4e48-94d2-06a9a41a391f	2026-11-03 08:35:39.086	2025-11-03 08:35:39.105
318	100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	0d5f76e4-d08b-4e76-8ca5-500825e140b8	2026-05-28 14:05:39.356	2025-05-28 14:05:39.371
740	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	8d3b1bee-0407-471a-96d3-e4c1860b89f2	2026-11-05 14:14:37.786	2025-11-05 14:14:37.805
748	18	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	cd5b48a4-276c-4891-afc6-0d5fa95517e0	2026-11-06 16:30:20.658	2025-11-06 16:30:20.677
751	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	6692a1ed-c3cf-41fd-aa95-b94256d33a24	2026-11-10 07:58:56.153	2025-11-10 07:58:56.171
758	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	cfbdd7da-b4af-49ae-a036-9722d7d67f80	2026-11-13 09:59:25.621	2025-11-13 09:59:25.641
753	6	0x3d85fda5ea53e190404210a91150a1ddf463741f	02050537-97ad-477d-a5ff-0b0d496e8f39	2026-11-11 14:53:20.057	2025-11-11 14:53:20.078
\.


--
-- Data for Name: custodial_wallets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.custodial_wallets (id, address, email, password_hash, salt, encrypted_private_key, encryption_iv, active, created_at, updated_at, last_login_at) FROM stdin;
1	0x77cE72B7d17c2aAd7628251b0489ecC8258B8690	test@example.com	$2b$10$9F8NzZiisBpXctmDpxvVkOZCIgW/Hnn2Dc7N0klETljKmKdzhUQcy	$2b$10$xrHfwtxFePDBwPiVhA/f6u	55db3f41f8db3cbd4b56e37677543ddcb9296ba475a5076b00af6d13ed242fe29c1c36d8d6e37cd65bb8b2cbc34c4e0377737bbfe0f7dbadf5810c3e257d9d0bea43:8a754813c45ed5c017657f5ab3068473	c0bf4300223bcd7c6d27b3ab036adda5	t	2025-04-26 09:11:59.192	2025-04-26 09:11:59.192	2025-05-21 08:34:56.449
3	0x295514b489d94F8effdC4d728937582167Cc15B9	jaredballanti97@gmail.com	$2b$10$kohqUbi6BDaOMaTnG6N1leGqNm/5SyqvdJVHdknaYUe0N.WNxSGpa	$2b$10$kohqUbi6BDaOMaTnG6N1le	c3db3caa7b309fa3abaaef863c4ebc534db2dccf8fc21ab906588656572f72f062ee2c758ea039f991a43820faf39efae9e5d69529150a3b29a20b7c0e40daf6d597:801f982773f1b95e4823f89957593f1c	c2dbbc30fb2e8c662de083350aea1153	t	2025-04-26 16:03:10.876	2025-04-26 16:03:10.876	\N
4	0xf6EdD2F7FFa65777E0FAfB41D1af1FbB4D734aFB	info@dimax.org	$2b$10$LHWyA5h7WnboxkJ21RqRH.v9TAYlimeENk6wyt9IjkgOy4i3C1r1.	$2b$10$LHWyA5h7WnboxkJ21RqRH.	dc78969a122ce2c12837a3228384522d2418bd40c958158c3ed310fe7604d743e24d16eee2d552bcdb8b81500e578f1249af8dba83ea7e13867eb64aa2a4298f576a:d7ceb56c5f36ad588704d0292a7da713	68b107a2aa6ceef42be64ba43d8686d2	t	2025-04-26 16:09:04.764	2025-04-26 16:09:04.764	2025-05-22 10:11:45.015
5	0xe2CCe86F759aa8d616013A38E7e9dB4054534f25	mcallejaperxachs@gmail.com	$2b$10$Dh.dV5JXuk69HqUoLVSmSekTzYhsvgxU.NinAfkZwxxLjOFdAvOWq	$2b$10$Dh.dV5JXuk69HqUoLVSmSe	7b1f50fe24f622905129a2937dd78b6269dba0667d194e1ead5cb079f841be117b302f248074fd8bc885452228ebc48cc70cbdea1567d5661282529433af19a5aa33:385d31d919927632efed6b8a3bb1d4fd	aeefb7f12587dde84321c827698bd18e	t	2025-04-28 08:18:34.631	2025-05-20 10:03:29.262	2025-05-23 11:22:18.615
7	0x07311cB30a4D5fAa239db6b55CC1c70879A66385	ericagudo99@gmail.com	$2b$10$OqciGZsQ2/RdX.QbuL9G9OiIh2vr/3MrqElr11jV0mz8uYgDa3/2O	$2b$10$OqciGZsQ2/RdX.QbuL9G9O	0fa972498942585190ef8d812bdff99937f47b6fa80975a8f56dc8dcfc21ba2e48f360ce4bdfe3b8fe7fbcaff22a008291e922f6cece3a3efd8bb78d8f3cd42a7e76:df3f2f8a89aada03d1f82143674f1dd7	1ec60cc4fabcefc23df047fc60394834	t	2025-05-02 06:10:08.717	2025-05-02 06:10:08.717	2025-05-28 20:48:33.187
8	0x8AB79B36150Ffec37bFF771331feEC56028E6c0E	info@lorenzoballanti.com	$2b$10$.0QrZWRQklqhOizEL7/faOOKDPWhr8pZKPBoeKMksu1kcdDmCBRpy	$2b$10$.0QrZWRQklqhOizEL7/faO	38858b81fe9e7aac4481c1b5b1f7c4da247dbe659e1b3b1be31cf116845e0493c5396500849cd2b4c98253da60eb6e88209e0912993ed4ae4a664a2d451f4b25bfae:af3cfc01a00eb11886ebf715de483d55	4fc4a92321b24b45a7375bed50ef0cee	t	2025-05-02 07:15:08.784	2025-05-02 07:15:08.784	\N
13	0xc2dD65Af9fEd4A01Fb8764D65c591077F02c6497	dimax@dimax.org	$2b$10$SvuyJN0SZFj/KxEoQlVLjOf.HvFFxfcBGD/mBQ7WZ0IWxDsEfY7WK	$2b$10$SvuyJN0SZFj/KxEoQlVLjO	142024133f4a7dfc7b5b39a700f0c61b5bd8f7dd640000c2efa349e186b2799e470b10650a40352d16693a04b6c657f635a461943d573b47a78c5c95a883e3f09607:f1745ccdfe1a88f2b7eb08863ec36727	2103964c16a9e845e311e93f8ef9a8dd	t	2025-05-03 14:08:51.318	2025-05-07 19:05:29.349	2025-05-21 20:45:09.637
14	0x8C571cAec312743702eF5f7A89825F1395FFD1A5	cristian199833@gmail.com	$2b$10$hUuFScd511/XLOimrHe7WuggNUHd3b5Wz04HspdmEGeCUue25KVkW	$2b$10$hUuFScd511/XLOimrHe7Wu	1849c151199659afca7d7bab9b267351083afb7d343d4749b0bf9f23275a1f8fe96b3ff9ccf56807b92aa02cba5dca75158eda44c982b623b7347d76d9c5aea5fd54:4023049e7c424b10cb4bb44958e56a2e	01abdbb991c5538bc711d41b7a33456c	t	2025-05-05 05:24:45.554	2025-05-05 05:24:45.554	\N
15	0xaD4474DF3230a95a39d9937Ab0ad91113972204a	santi@jokerjocs.cat	$2b$10$AqaIhBeUzTXjNkI7VmVT/Omgch554OVAYv.UD.W559ZbNYAfcJ4Z.	$2b$10$AqaIhBeUzTXjNkI7VmVT/O	4d1846476b6e1abdb61f9768d6f8f5fda28b0d6df469dad58d39762c1ed5c8d0ab5377f1c12bb8ac99b8901fc69526618e5882fc337d3c65f3d7bb1e47cc380b94ac:8444d95c0bcac07dab0ab74cea120804	030e3fdf742717a56be7c59a9e014716	t	2025-05-06 07:37:05.749	2025-05-06 07:37:05.749	2025-05-28 05:38:27.668
18	0xA492f5CbAc34EAe26e4aa56A5056cf1Fee7439aD	Koper71@hotmail.com	$2b$10$hrhl2ZUpvyG.gE8Y/Dm.cewpYpWEOctnVJg0AATG3E6q75qaSsLby	$2b$10$hrhl2ZUpvyG.gE8Y/Dm.ce	56aa065d7e913be073d6dbcb358b4da22ef060ef0fc687a086cc80215e6f051ca5d2665e1529843f6d37bd9cc133bd10f8ab7d021ba7cbe11bae9139f9f3d91436ac:2145d075e796681340bfaac0842ed2d5	2887242a88bb6869b8a5d29c8225f24b	t	2025-05-07 12:31:50.422	2025-05-21 18:52:41.206	2025-05-25 17:59:35.795
19	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	test@waybank.com	6afc6f83c1c3cf79f7c48338189aaeae9f8c4f9cf56328149adab06b2470a4659be2590e0f8b077d5086bb46c08d6e7652c9adc89f945aca65597db6bdb77c25	20368e45d23f91a182b5fb30f080f9e7	ce4bf74a052de2402ccbcb116fd28dd22a22384dc086e0a646a3796af69a46d236883c561fbc17a202911c88f3b62ba33c8dc64e4f5875ec1e21d2c624117ed41f85e7e9b971012aa29e6d2cc0e2f3d7	5356c38a969e5ff84371b9aa44033938	t	2025-05-07 17:02:56.607	2025-05-07 17:02:56.607	\N
23	0x7C13a821a79E00dfF6e47Aa73b7466F580e5D154	pepe@pepe.com	$2b$10$/uLJBR1pRPEXWnWkIz.6teUug/KYSHr.aXUt8be/qGuEm.Xg1J6Ne	$2b$10$/uLJBR1pRPEXWnWkIz.6te	5a0d2a0116c4a3fed1b87d509ad2dbad7d95ab93062b4d44fab123878ca99d5f21fb0445432efe795ddc321a0449f80629e50f02cc38570083ef921a908267541443:dcdc0166ee4aaaad1e7d9e319389b0d8	852dae6fd70dda46e93f319292717ff6	t	2025-05-08 18:04:24.434	2025-05-08 18:04:24.434	\N
25	0xfB753b13C9b5E12B9202a47b9d1f9a29fd3CbDF1	aaaa@aaaa.com	$2b$10$jqXSsoARlk5FTcEAWPF7c.DVFK2H8HWczK.bjZDhufVEGgBSl9WxS	$2b$10$jqXSsoARlk5FTcEAWPF7c.	072328a0598a6592bf5f514a549c78348f0ac04c3705b1bdca0301346107c1b523f8848fa3306a8bb3878ee4b685bb7fd1895ec6e86ebb4f30c49c7befc28bf696b5:6242edb10987b9a7f1780aa20a493971	bb06c7e0050b5be2ff07bd14c6e600ae	t	2025-05-08 18:11:01.771	2025-05-08 18:11:01.771	\N
27	0xaE9054bcc0f89b2285CCA8ebBeaBD9a34280D4af	eeee@eeee.com	$2b$10$PupaKqELZoQ42XTXyhgvtOdlSxNKpfeZ0P1.HXYX6VhMPlCsimbmi	$2b$10$PupaKqELZoQ42XTXyhgvtO	e004d29e69baa054931d332f4956b4ee098fcc799f541bdf4885c7c9f3fd31855d5d97ceb1c85c2a3df138d7c26b85f903e5d6076fe4f3b436519446073b1f90108e:0e41af66bf94868d93a528504cc40703	5cdcd7069c1abb6873371308d400725f	t	2025-05-08 18:42:30.849	2025-05-08 18:42:30.849	\N
32	0x4869ce8eaeAD8429DCC7736535c8444b05186711	123@123.com	$2b$10$a15JUbaYO/bgtqrgZp3g8O.G5CS4eHYUpNFf/iiuzLAzvDEjLPAJS	$2b$10$a15JUbaYO/bgtqrgZp3g8O	ed503a24d5ce321a12ba663d2e83120ddfcebc30fd20329dc648e700ab13b101106cc63e13076c9eca1e10405d487b0123598181a05a22f7a7e33e314d26e3b4e2b8:6a82b1fd3810b424237a1568828e398f	93a38d7bada68a110d0dabf3e38bba3e	t	2025-05-08 19:01:58.879	2025-05-08 19:01:58.879	2025-05-22 05:50:51.296
33	0x7Ea416c45Dfb68D19d6E85C9Bc86d24eCf71d8be	manolo@manolo.com	$2b$10$Bb3SjYdD6dRs.a426cmDD.SVKOFPt7.Uc68YogxEBBZGsv7RkepGu	$2b$10$Bb3SjYdD6dRs.a426cmDD.	fb6fe2487858782d94fa868f58f10c49fc6edf5b9289dcf6c24f6fb70046a43274799c3917dec4a7090c75dc5a7cbceef120894e018c4a81c314a1181e8d6fde1f3d:f1d94b9afa9f696484147170312d7215	f4ea0bbf7b1847bfa958b08e6081a4ff	t	2025-05-08 19:02:51.742	2025-05-08 19:02:51.742	\N
34	0xC064AA3BDA7c29F234Ae1d224855f07C6cB14A33	manolo@manolo.net	$2b$10$ImJP22PUVRF2iW6jf8PZBOBf1kITTeoWKWGm0vLAA83Ns059uf/uG	$2b$10$ImJP22PUVRF2iW6jf8PZBO	58f3924580f19bbbcea63624d984501ed36d1725441a883f1b8dcac354f12077928e5dc44c18d30b8ff137171449d7f8b44edefcbca80a2c06044515879bf3d76491:cbed182f53861d72d299097ba7145913	c58c43629a321097201aff15b713011a	t	2025-05-08 19:09:22.248	2025-05-08 19:09:22.248	\N
2	0xb6BCA914CE6Ce0ab9720D1B1AE0D09C9e288d3C6	lballanti.lb@gmail.com	$2b$10$WpKPWSkJnhIaPeQDLFlTiOLjTbM2xH709WoNO.NQHjOW1n7IXsiNC	$2b$10$WpKPWSkJnhIaPeQDLFlTiO	38e2ac0c089ac1b143c3e7493ab52d5072a12100233fc5008e5dd9e952fce33ba222fdaebdb90a2779ce4e1a7d74f64856d4fc786fcb709d2cd0a3d1b5d29b0ae3a7:aba27f306fea9f10606c6718709a32c7	04361157a87ed70940e47a6a277c8784	t	2025-04-26 09:15:06.965	2026-01-17 12:42:13.149698	2026-01-17 12:47:22.784242
36	0x6Dc1CfD60f14B624FCAd9D1503DcD616E91F5A6A	eee@eee.com	$2b$10$SB0flOq/IxYVxrGyeMUob.t5FSRb86uGiO2/oYOOmLjP6eaTf5oae	$2b$10$SB0flOq/IxYVxrGyeMUob.	cf28f5ec4ef33405b0a344e24262b4437d60194584bdc4597776de7903854511429d3ecf2ba95f2139c368686f21eefc55a62c5cff07b629b87e778c065ce703ec8c:5f9751414b630a427d44f6bb67d4aec8	defee073e6a555e73ce4596e992fa0f7	t	2025-05-08 19:25:00.091	2025-05-08 19:25:00.091	\N
37	0x089e6c5b287dF6D777fFCcCB24BE37568925f5FE	werwerw@erwrewr.com	$2b$10$OAs1szgIgDB724OqrdTHwO5E6nh18D7s0K5./SoCZxWofyPmoaHUi	$2b$10$OAs1szgIgDB724OqrdTHwO	cda6b8405bbdcc676abb88565f338b99f56253fbd40ed9eb8532562746cfb8180da6c20a295520be302ff153a51bfaabcb59dbd410f9967e5aa09691fb04f1520580:71301c34f661555353400331b973ef5e	e7df82f9118743cb9519a144d064d4be	t	2025-05-08 19:28:59.503	2025-05-08 19:28:59.503	\N
38	0xd509250fB3ce748aD1feB4330769bea6527872eB	efwgdsg@efasf.com	$2b$10$3I6cgOv7.MkGsPor5eQUael6F8any.xWeYT5T7Zgy2Mfe2NbyPQoe	$2b$10$3I6cgOv7.MkGsPor5eQUae	1da76f4e0eb82321b335faac10fccd15d6b2937dfe42ce3c6b7264699f7b9ed148f6b6d52d91ee42a9e54eded5e88244bcdf63ea9c958695095e9cd3ff51499f818b:0f5a0433961a02f9a8676d8770f792f9	f58234bf95bdcbe505efccc847dd29dc	t	2025-05-08 19:33:21.398	2025-05-08 19:33:21.398	\N
39	0x2EbFc81363D834eb1E63f18E9D0a6E15F192ad53	ffsfsdf@sfsaefs.com	$2b$10$ypkBDUAKo5rpbSqH7LWTUO1bYAE6UCSMS8rHlGUO86gD5H/Mopjc2	$2b$10$ypkBDUAKo5rpbSqH7LWTUO	c4878bb2c97162da3b02df0ff672d1ebef5c32b15b9b8ea29609d1f0a19323197d7889a74c95bf3c1774067bba8e2f887f61b7834c96d1b863dd654d2a0a63230d23:3c167ca38bd837a27013412289e155ef	21720aa54147e3c0935ffe8753307fb3	t	2025-05-08 19:35:09.435	2025-05-08 19:35:09.435	\N
40	0xd87c9fd353da990d0e784aead8e1cf229e6ea24a	q3r3rw@efsfs.com	$2b$10$lzeXngsbG4aiUNCmcHexbOqM0/LvPpk9Gkd/FM4NlyIWXvxJf3uF6	$2b$10$lzeXngsbG4aiUNCmcHexbO	b0551fd482854d229f91b5ba8e5571d4b78ef36dc3be0b6bd309af8f5f6ece62139ef584277c26e77f44e2d5ff7120c9eb1383079bb6afd8a7e6228cdd4b2e3dcc9b:651d3c545f5a9934d34e665856932322	a6f7906ea1b660684b5630c8b217cc14	t	2025-05-08 19:38:59	2025-05-08 19:38:59	\N
41	0xab80b501ec8257bcded37af05de5bc1418370979	sgsgsg@sfsdgsg.com	$2b$10$SZx8n9VextgkDKvDYJrmKuDet/q6iGZ.NCZYu1yuQKVC4I9jU1jkK	$2b$10$SZx8n9VextgkDKvDYJrmKu	15cd8d1a019e247f33ead867e3ee9df8fcead2007c817c729580abcfc0f9c5759edc6cdd3b8a22bd7161911247131dbc0a414982c85a6c8a0d743fd0a1e3469dff02:3538b9844ea12cfa3478e667266b9c14	a60bca9ef8d4451b0fd747ed7f9f60a0	t	2025-05-08 19:42:32.852	2025-05-08 19:42:32.852	\N
42	0xb274f36d77cf9e7268f08be9605752690d674ed9	adawad@afafa.com	$2b$10$kE7VDOY90iShO0OnvM/nIO.6ZDtqHexvb5MkQM5PHKuuHH20TFm1e	$2b$10$kE7VDOY90iShO0OnvM/nIO	2db82e072803c40dd54a509b3ec97ee0fc9f04df1dba5c51dade02d9a5647aa11ad85e779f78e05fe1baf7a4ad46495514af510861e399798ccd9cdce720c81f4ebf:78ae1b3fcf84996af3a27bbb4b26a248	df727e93d262e5b6648c82bc2cc243c3	t	2025-05-08 19:46:17.816	2025-05-08 19:46:17.816	\N
43	0x0cc6ce3d8e861be421c8c9083f012e216f4f7021	fewefwfw@sfsfsf.com	$2b$10$U.DpE9h8pzyV4Y0zFNiBdOyz1AkPYLju1xGY2kMq6QcUxImn2bLQ.	$2b$10$U.DpE9h8pzyV4Y0zFNiBdO	f801872465860bd9fdf027336203ba5339a7611c3e9a05867810c8b7b8384603539a7d32e1bf8c46f9bb9240880888c31d7dc23f449d5449f01c17dcbea7dce388f8:39d42813570c2b6e62d3c65a36f91333	7212fb6bf449d64b35ae5cb87e262d8b	t	2025-05-08 19:49:03.697	2025-05-08 19:49:03.697	\N
44	0xbf66ade78d6400429f8b92ded4d61a887aca4d2c	efefsfg@sdfafs.com	$2b$10$Ph4bGm5mEgNprh2ajyXj/OZdsYt5jNoJgsbkKFOr02YDwot6ZDWXO	$2b$10$Ph4bGm5mEgNprh2ajyXj/O	560bf4011cdb386dff190286ef18d1021d814696360b36c5044c7d60438a1c6c712a0039efcf96edcc02b18488374cb25f08be06f997ed1f48fbfbca9118e1201a4f:1d2a81d2e3a6c5cd518d9e706efe466d	670e5acdb6e0fbdf1392f6c5e453a6b0	t	2025-05-08 19:53:22.69	2025-05-08 19:53:22.69	\N
45	0x96336eac2a2798dc0a3d56e68237a1e0f0b64888	sgwrtw@sefsf.com	$2b$10$oHuz0ubi2M.GaQ.e6DCTRuYxcQKJn7GoVoj.kYG64AHEnqcpoeaBO	$2b$10$oHuz0ubi2M.GaQ.e6DCTRu	fce6796bbd4f576cf73e87af5973ec62dd8b9c2062dee9f415b4f7dd5e61adcf9ecf1e42dcafa9fcd3de17f4dabf20ca54b54dcc3e4c1d55683fc2dac099252b26e4:38833c7742ba8237a9cdfd8357c29e27	b76d94fdef20d4b886a9a3bed7dcc713	t	2025-05-08 20:01:00.582	2025-05-08 20:01:00.582	\N
46	0x711f16ec41dee999301b0b7cfaa1d08cb92f2097	erwerwr@aeqrq.com	$2b$10$UY9ZLLV67.89jym3PHgZPOkdduE4eiJGqc5xzgdC6WnHInJ/LdpYu	$2b$10$UY9ZLLV67.89jym3PHgZPO	77d59b812f3725843d74e6d3dfa3af67d534db10524dfe5f99c495e102c035c81521a7909bddbc33cd5f2f5d8e4ccc4d2400b78a297fb2d183ccf96cf138926d1d64:6aff65e4330c3b023598651349f3218c	f27dc1363aa6b8111e22e8c37a6bff56	t	2025-05-08 20:08:04.564	2025-05-08 20:08:04.564	\N
47	0x7adc062be785ba8d01645342542073f7d30ccffb	wetwtet@ewetrwe.com	$2b$10$qSqceop2Z0vukzy6EHqgxewNl0y5yRak5mcD7Eb2gSGIP8HIY72dm	$2b$10$qSqceop2Z0vukzy6EHqgxe	66b9f2f0ba69799c1cb9818bb4c7b60514be199b2e3e01219413572529fa97332c4c1d3184fe7d86ce58d725befe89407a30024ea8ca0e731e977dd7a4bcf623156e:4f029e19f964cb0de17de4838262a236	32de362028b7d09e1d08355f864aadfb	t	2025-05-08 20:14:31.261	2025-05-08 20:14:31.261	\N
48	0x596d7b4eb8ef912473e2e2e67666e0ac403672d7	erwerwer@serwrew.com	$2b$10$oY14pIzXjeFNYM.Izxeh9ua6wMoHuSyehZCA3sNl/f7nEUcWoRvja	$2b$10$oY14pIzXjeFNYM.Izxeh9u	28121ff370b1ebee462dac0dc1dd9459389a3ec619441aa57e2d41975ad304523ae5789c0b46852585afb746631c04acb77b92f6078e1ff480887d6555c52cd4bca7:e8c3c6ac7f8c5cf4ffe1edb504060580	fc44fca6d34548889291ec44acd6187d	t	2025-05-08 20:21:27.144	2025-05-08 20:21:27.144	\N
49	0x933d68f7bdde84a55f797e15544dfa961d3668ac	erwerwr@qrqr.com	$2b$10$WU8svS3COQqPbijLRp9b5uwZHoDf4Ei1TbYhzXFBL3RIWEsiB39q2	$2b$10$WU8svS3COQqPbijLRp9b5u	081a20b0132c21748c84bc2e5db30ba35d97bf3e635ed3805c6bf9733a29fbf377e681a66027f79d8f9012c23975b1cdb594c0db6e1a05081afcda575d396986bdc9:e48106b8827b3a19cbd1c71c366984aa	c910170e61d2125f42447fdcdf7e56c0	t	2025-05-08 20:24:42.195	2025-05-08 20:24:42.195	\N
53	0x6769c8391d630c6679f96b8121f3be2e03ab7bf7	dfsdfs@sgsgfs.com	$2b$10$cdlF/y8M0.6E2oZtgobIt.Sg6X7caoYpirlElv2dv39zjhDcgn78C	$2b$10$cdlF/y8M0.6E2oZtgobIt.	b5c468cae38a43ad51f8db4bd0d9a7b80e2eb03aea0bfa1826b4b33a2d3b3deea9b9870d52a781624867f8803fddb43422e397d4422381416ac9555aefb6456008e8:2842bf036d23e21025be20e14ad039e8	372fb5247cfca765da3dc92c5b6e4a29	t	2025-05-09 07:03:19.115	2025-05-09 07:03:19.115	\N
54	0x24fa898fbae85d59797cd2980d335fb9e5c5246b	marcallejaprxc@gmail.com	$2b$10$pf4LO39OqSV2JhKXy50uq.QafOxq/RvPYCNpAr1.gzc1sgrXOv21y	$2b$10$pf4LO39OqSV2JhKXy50uq.	aca023e9ce4fada2abfc4e8e93792528843d9e3078cc4bd32cb8fe2111cd534467bf446bae4c926fd729ea3f35d4f2a604b6d6d80fe2f174e89f3dacc7ed1a723b4c:5ae25559e64f0db65ef66b1f1faecd87	415641978b099cad71de117403de7bd0	t	2025-05-09 07:10:19.603	2025-05-09 07:10:19.603	\N
55	0x8dafca1c0fcdfef43101bfdcd4e29d0339f74629	xmarcallejaprxc@gmail.com	$2b$10$pwfVJ9DTNiR.8RgG0yoi2eOPWRMuJUfJlOJTE88AqmMzcFIQkes3e	$2b$10$pwfVJ9DTNiR.8RgG0yoi2e	22b4c9a121598eae95b4ef8ce1439b6ecba5110906a51e534a405980a96b839e97a79bdca3a8d8f1fd55067a7aca5dea6a51c594a7ecd199f701156906c1d7cb42aa:b278fcec19ec99e2920342a7a138b628	e0e6311b560621894a26cf40df7efa57	t	2025-05-09 07:13:48.011	2025-05-09 07:13:48.011	\N
57	0xe9684a40f40decdbbe9911176f54fca0e7a205b3	fwefwf@sfsfew.com	$2b$10$92NgQbuGFsv.KqQfO3vDouCDX4HZD2NWh2ywqbl7cSrLgNW1IcgV.	$2b$10$92NgQbuGFsv.KqQfO3vDou	171f65582660bbc48af5c3fa5018719aadb75b6dd686557dccabc880a3ef640a4b2e01f1cf1cdffe1c59c694d8cc9a4fecdd26e135873e19705855b7670eafaa744d:f889a43c7f79fe75dee83a4c14bee78a	00d1257086d881984196d18aa59686fe	t	2025-05-09 10:08:01.842	2025-05-09 10:08:01.842	\N
61	0xee6c342b112e2ea5eaf03e859291bbf46c7ebde9	tetert@sefwf.com	$2b$10$N0YcRwBfJ0d2DlrvFEEmmOiw.l2C2tY6gJ0HpV4qXshg8uTs83Rr.	$2b$10$N0YcRwBfJ0d2DlrvFEEmmO	f84d3b48b4666aea9fc0d6efa6550ae0c00d892aa7492bf6c2fd0ad3401a1c0110c65d9979904e08fe2d7836e6cec06bcaf570614dc0d35611296bca545f441de822:a761474b9b71595a2f93830d8b24d101	595e59ff169c4615d93ce6626e1ea1c4	t	2025-05-09 10:46:46.619	2025-05-09 10:46:46.619	2025-05-09 10:46:46.747
62	0x51eabc136ea8eb7bcbefc97ee41abb247dd75cf0	etwtw@sfgsg.com	$2b$10$20Tf4qso9YeE/9SpLWZ/QOnkHH6E4xjpXSnTo6xdGafaiEa7lWSZO	$2b$10$20Tf4qso9YeE/9SpLWZ/QO	e8b5483985042961524ab86253201ea41cbafff2cf2062596dea06621324d7e7abd9e7201afb1d8ff7224ae1e6845c0386d04f1e21c13643b7f908b09c201e9beadd:bb975d16a3902f3af5293e97d65f0b1c	f74be34c308f7ef8602112cf46e0e24b	t	2025-05-09 11:00:11.436	2025-05-09 11:00:11.436	2025-05-09 11:00:11.609
63	0xd5e35d0641e2f97bd9573032f19c37f06303479b	mcallejaperxachs2@gmail.com	$2b$10$dkNx..bC4EeykRZ2axzNJO9pc086oseorQPNaw9GBuVRYJnSJTja.	$2b$10$dkNx..bC4EeykRZ2axzNJO	f7c05a388384066db950a7a07b595b8beef42928d541ab03a452069aef80c8d60ba9ebbe0e680b39fd2d134cf7efb3e99ddf9e03d6e1a7a2fd68d38c9e0f1fd9bc3d:0ea7eaee1ee1ec10b2a9e2c19c041723	9a9725ef8a92648a300cd504082a65e0	t	2025-05-09 11:01:48.17	2025-05-09 11:01:48.17	2025-05-09 11:01:48.331
64	0x18d0b4429437bb38ec5b33f6f42af10fc5fe2fd1	sfsfs@dfsf.com	$2b$10$hnR30qnjWBdzd2T3ShiYvOu2ilj8jI8J.MuEJMZZJbvt5C2JmzYVC	$2b$10$hnR30qnjWBdzd2T3ShiYvO	8aa53d7707e0467d38ff921849dd98fa7ef184a74b3bc0464111064a8929228eb06147567f159b8de3d3af24d6fc3ab29fd225e91539eac3639760d83a799b8aeb99:26da71a35a1ec2bcab5a192a7e67fe52	756327ec177cc7faa7cad9695feb8485	t	2025-05-09 11:03:34.349	2025-05-09 11:03:34.349	2025-05-09 11:03:34.545
65	0xc8d462fd09e6a81a91ddc08f29a137068f37bdea	qeqe@aefa.com	$2b$10$RymVcMbe2qU8fLo70sn0B.cXbJYD2uQ.4ptQk70.MpQJJYMu6vlGu	$2b$10$RymVcMbe2qU8fLo70sn0B.	6885446d51eaef70e33beb592b9f6339470ff795fb919d2909528d65dce9ac7598ef1d6720b9d77e15379ca1e68fe2beb699b5bf5db6a8452b91ab607a901e0dd2d6:e15dff7611346c993668efc2631e8531	e268a3f833a223a76c49203f6ccbb467	t	2025-05-09 11:05:11.771	2025-05-09 11:05:11.771	2025-05-09 11:05:11.93
71	0x34ea039c3835b0c625da8bfb1e3cef1905d22913	dfsdfs@sfsf.com	$2b$10$RJM41nCLlMmuv0IrjuC5SuD/xxskRagNvbSfqbQ8zAqc52fUVv0NG	$2b$10$RJM41nCLlMmuv0IrjuC5Su	1c8203edcad31f532585c7660f22c348eb85639d03074920bde4edc1db31268106bfece76b14154d0d90ce40934cab83476177afa988dba0b51274ccdf5e356c7455:273ba595d3479455e39ad5a5dbc302c0	2b01a703c39c8c1b633906da0ee3264d	t	2025-05-09 12:40:15.529	2025-05-09 12:40:15.529	2025-05-09 12:40:15.685
72	0x6805037c523d970b0fb4b559fb88976a09b5aa45	mcallejaperxachs3@gmail.com	$2b$10$7RQoG/GSF5iVT01o7h4mdOcpLY1l9WS5rdlG9N./0hUoTMuJ3DL6a	$2b$10$7RQoG/GSF5iVT01o7h4mdO	a06ded974a706355a19f47e8733e0a08f6b693c612e9b00fce760b61c3ec7802fe9cf3de3e16e358bb5d308eb74432f0bceee23b177135f4347b32a6787da422285f:07f76f7b60b0421c564a94168419709f	2040ab377f2a98bcdcbd88b12d59d126	t	2025-05-09 12:41:06.324	2025-05-09 12:41:06.324	2025-05-09 12:41:06.48
73	0xc64c6325caf34486a8c0c23ef85ab1858be1babe	dad@ddd.com	$2b$10$dgW2r5D8cdzTQqZ0Dg5CvOrAWnGigfCMRjgumXheVABdT.34X.98e	$2b$10$dgW2r5D8cdzTQqZ0Dg5CvO	c24a99f36618d1023b40b0c839c2d3e45ca415e097e4b0993bbdecab7e0e9c2f0384a435e739a46de9aa030839a4d5adf0a20481de48018071a261520e10aba71aa7:f37aaae570defb964fb9de050eef09b8	b6fb1c28d7d68b91588392c5d5860734	t	2025-05-09 14:06:28.865	2025-05-09 14:06:28.865	2025-05-09 14:06:29.043
74	0xfe459ae41bbdfbeb62f0ac0ffcb7560957500522	dfsfs@aedfafs.com	$2b$10$F1F5pYAhQB.kwkHAReoOluFbJ0GtMSgonmgXl9J.ZTCd7KLIJB0XS	$2b$10$F1F5pYAhQB.kwkHAReoOlu	c0ff4e21d6be0cff5d965597b4abf5447479c2d97d27a65030d08d9241f727b11f4f78e2565699704df23a201fb2521ba2f976228256edd630289cd82c410cc0f3f4:905ee2214e17c6637c957e384817a2e8	b49ffd3c652a2b86411fae7a0925937e	t	2025-05-09 14:17:39.303	2025-05-09 14:17:39.303	2025-05-09 14:17:39.466
75	0x67f7a09aa3a3c639e46766288a0908008b36484a	werqrf@sefw.com	$2b$10$sLNQQm4YYrN.4NY3Rza7h..Wa3v1kx855YUoCo/iegrWRcIlwSCPi	$2b$10$sLNQQm4YYrN.4NY3Rza7h.	ee40da1b6b41ec4e1537722a58c9c58a9eecceffa3fc0af6c68c5a179f2c638a9be80ac7813cb9eb06b58671be336a39ff8a899dc4fb22a30249be4e8c79d85852a3:bc363fc4af688b81feb09242efad6aa0	5b34ca2d9e81bb03939ca7a63c49afa3	t	2025-05-09 17:07:04.137	2025-05-09 17:07:04.137	2025-05-09 17:07:04.264
76	0x3cb85e61ce8a34d1cdbfebf3d778fc06ce92a83f	manolitogafotas@hotmail.es	$2b$10$SyxBmjvTodOrqHXnvF7KkO0QzeOpPepZ5s9ni7cKBvYRAHnwqfJbu	$2b$10$SyxBmjvTodOrqHXnvF7KkO	b3f18d81fd4916e42abe218cc20dc1f3be7ca446fb6c85845de5e4d38004c7c4fe8938ae7ab88b2e73fed14eb3596c2d3466f3c4c4e306426f9222cca1e31d6afe74:2ea938114ed6bb3af5e37d1efd217248	1c9a08d4139c038d9cf25bce290b2f18	t	2025-05-09 17:36:42.146	2025-05-09 17:36:42.146	2025-05-09 17:36:42.319
77	0x39abec58a79ef2c35622d10a8f63c1143dfa96f5	fafafsa@sefsafs.com	$2b$10$CUuPhFZbsdk6NhOWU6UBgeIM62uNyW3cMuPaG8Ij815O2QVZ5/OnO	$2b$10$CUuPhFZbsdk6NhOWU6UBge	ac5cb3520260ec959cf8a7b00a3650407ceaa96c1c2dcfc3b08d83bfc8c0bbfa45ccd3b926202763292c458c4fcaaaa5f6ccc02575e40dc1157f8d92b29f84573c41:df4fb169d51c20d4ff08ffdd673d2890	4361fcb789d1cf69524d0ae0bf37745e	t	2025-05-09 21:41:26.512	2025-05-09 21:41:26.512	2025-05-09 21:41:26.658
78	0xfcad920f66c01135df5dedb31bcf206208575e57	mcallejaperxachs5@gmail.com	$2b$10$n.QScb6N7R6CsOt5rN/Ltu6zCxFHp0VjASvwQS5ED3ARlp95at6Be	$2b$10$n.QScb6N7R6CsOt5rN/Ltu	5de5acb191ce8ff658b44e8a5c0cd3ec6b3072b2b3e6c55d9e310801045f476a7da4fe1ee21869ee4f36379867ae56492e3b96a637bb92dafef3a21f468d2258e12b:465ef28c8c4c456b1248e646071cfd6f	98ac37874bca7c91f13c9ba6b37816f6	t	2025-05-12 07:11:27.092	2025-05-12 07:11:27.092	2025-05-12 07:11:27.265
79	0x0dda8a3b3ca1fe48754db3cc63f77b2c0dd4b1f2	soporte40@gmail.com	$2b$10$3LE4s1fqYCemWZZpz6gSDOmVIfBMxpnZXJHCqeK7B0Y.fOqOn1jXG	$2b$10$3LE4s1fqYCemWZZpz6gSDO	e05571bd1abf02fa6f9de7db8c0399d72d8bb2847ddbb91a621de510cbe8281195e7d77d251cd856be15e87d3d9ea9ab04b984daa29b18cba7515fbaccaebbbc3768:329072afacff0f9ba23a22ec5389c01e	41536b5f729a96d140d47d28a0f83716	t	2025-05-12 07:35:38.336	2025-05-12 07:35:38.336	2025-05-12 07:35:38.46
80	0xe0dd4c3aeeb6642eccf29dc6fc464fa60ffd0452	chevillaalv@gmail.com	$2b$10$Od38mzP3HUOH1EGN4EA5oOVtFh7TJN2v3f9DpWo/TCudZ/a.fRsAy	$2b$10$Od38mzP3HUOH1EGN4EA5oO	63e2e2605f82dc0846b63371ca7a8825b1dd887b2198128dbb2611757ce1f90ef75d3029bf9d349c9b3a17cad9689a4b52556fb96ad0e8c5323ee907fbf86ce94786:3c5b454ecbc9db21c760e084731f6f62	8046981a83bbfa37aef3a8fae3c66127	t	2025-05-12 07:37:29.178	2025-05-12 07:37:29.178	2025-05-12 07:56:39.175
81	0xfc065ed0904e750c18288060bab3af32e855d307	christiantatoo23@hotmail.com	$2b$10$4pdvjv29uJhnbvJdLj1IleMCR9Rwey/lJhEHOCj5AwsLFhCGaX6Da	$2b$10$4pdvjv29uJhnbvJdLj1Ile	68f5d797c0df58573fc7411077a92375099717d1b3250ff7654cf8f0bac17c34b04782eaf362371c8671fa3b88418a16c782a1be8eb5d77d5644537de7fb9fc0e6fa:8266d1397176daa751c769966818717c	d6ae13f28ccc5c748ec02a153211d7fd	t	2025-05-13 11:38:12.305	2025-05-13 11:38:12.305	2025-05-13 11:38:12.529
82	0x10707496c28a429183390cda2677ebc4bd37a874	mcallejaperxach2@gmail.com	$2b$10$qWVLogWPSo9UurwbJ3G/v.FGirVEUezArDuQwAm7f7AbNujg7Q35a	$2b$10$qWVLogWPSo9UurwbJ3G/v.	a4dae5b78476899a6a1ff6fb50f818ff1aee7cde083f12a1abf72150d0206e57fb09fcecada597881c89eb1d8d80ab0ecc302d13065cb1b01be9f77897051bf81c97:20360b44b9eec35ce1d9d247ed20faa1	54ffb9b4f18f3c3bf72657314f4ae2e8	t	2025-05-19 08:57:55.709	2025-05-19 08:57:55.709	2025-05-19 08:57:55.887
83	0xa25f3cafcb0436f8f0e9510f8dcd60838b25724a	mcallejaprxc@gmail.com	$2b$10$IDdL8/gj7g/IzPPAyb6sFuc.YXE8Ynv0MWhIJWNlHDVUJWvOkwYUO	$2b$10$IDdL8/gj7g/IzPPAyb6sFu	80399910392216c0b56afb853c47f73ac5396b79666e09923cedc428e39622072b270651760748d4278386d09764358c2d50e836730ed7309e14aa41dbb7c08c0671:ce613b6f77ec7aa766f407eb60e86619	ac9e772eaf6319c956c79b9003697078	t	2025-05-20 08:37:33.578	2025-05-20 08:58:36.851	2025-05-20 08:37:33.817
84	0xcd0295c2c7acd5becfa53bbbcb60bc7f88130423	tradercristian7@gmail.com	$2b$10$QHqFHSjQm79FDYReySt0euI2B6thJZJuJijuAGEVDcIznNfLfADe6	$2b$10$QHqFHSjQm79FDYReySt0eu	5a599c893463892e49cafd61d747b7d05cd703231ef2a45ec56d0858387299627c192452a47ca203fa39cb28de3fee95c113bab6d54361b700bbf78e931beb39754e:8160589e63643cc25d50f35ab88bd74a	57eced208292b471e411dbddd78ea2cf	t	2025-05-20 09:00:46.118	2025-05-20 09:00:46.118	2025-05-20 09:25:30.308
85	0xebe4ee33db0d0a0fd8be18fe7e45c006093a77c0	marcalleja07@gmail.com	$2b$10$aFAze4haQqlE4uKifHQcyet6iPpXMZ8hlKJBWQ4R2iSbIZ8Odukiy	$2b$10$aFAze4haQqlE4uKifHQcye	53928f79e169014e62c41e62549232e1b84851f0acc341a50839e5a97a34a494a1ad8c761f2dfc0ddebaab55f4938ae7775f935669e8005e3f61d9efc26434414f84:cc760eb015944b13d5977dca3c559fc0	a15bc743eb2f6cfbbe7a2196d3138679	t	2025-05-20 09:48:33.604	2025-05-20 09:48:33.604	2025-05-20 09:48:33.764
86	0xa23afd275ddc937d3b00c342bd9bf394ece471f3	jbhfinancialgroup@gmail.com	$2b$10$izetdyGKrHpYR3ZsgR9wqeE2E0fkJLV1e0cfkidhqr./GRc4k.FyC	$2b$10$izetdyGKrHpYR3ZsgR9wqe	1a19d2ade224a3a449d7f263339b8ac18dc17b73cd343a3af438482d8e09963a37d7c43743d9664756087958f8c782bbd8bff4c1e0045f99d73f53e10ca8dab1b920:0c05a9bbbe8470259ef2b9f55a9e0045	e3191eda564842b31a1bd3f19ad8a9d3	t	2025-05-20 10:36:38.91	2025-05-20 10:36:38.91	2025-05-20 10:36:39.114
87	0x20b0af54a46129c09c89ec1766f08d4c9680f0d9	marasitaklk@gmail.com	$2b$10$bDwnBCYSuyLJNxDE33zwlu1PiuLWjhW33DqH51aiaW4gyKpiI5MAS	$2b$10$bDwnBCYSuyLJNxDE33zwlu	05003d3bb83194d76aa5f963ded595208115cb773172984b74284f092573fc7c4f22335245920de0b2be2855af9b8853a019941131323deff4a14848b272eced0097:e6d5669ce4d1e7f9678224f1d44d7c95	15f6f4c9118bc6491cc9a68d00a619ee	t	2025-05-20 12:28:20.353	2025-05-20 12:28:20.353	2025-05-20 12:28:20.641
88	0xe9d9418b827457aeeb1ff93e8b1c3fe3e65f31da	1234@1234.com	$2b$10$OX4mrFa8sx7f8hVCCj1jP.R6Hlq2P3Z4qL50NUEoNvn2XV8U.47Bi	$2b$10$OX4mrFa8sx7f8hVCCj1jP.	f8869f9e388bda82da9b359c2808a9602c1917764095b07f8f2f89d42637384fc63a0756e9ca6da03fcc005f2b5e4eac16abbdcc15cc2baa0c6bf4605879e1f89682:8dd29e2adaad72cb4650c0c8204c2582	35c2bf24540d608d6695ea2acab897a8	t	2025-05-21 05:14:00.378	2025-05-21 05:14:31.969	2025-05-21 05:15:27.196
89	0xcfe3fe501fb2fbd63eab34341fd5a55c22d0fe0d	callejamar231@gmail.com	$2b$10$4X/tc8/HfDyIqhHbEPUsRO86H/UKu54Yf84L4bZ5TwdZS4HpNSjxG	$2b$10$4X/tc8/HfDyIqhHbEPUsRO	f4f5b4521e844f26a417e32165deacafb5044af4a5d8e4f6d692132603d7fead00ae04a4edc46895d7b5f0efe22a6a69412638e8257162e7e0ed3f62e58dfd72643f:49cbb90ce78549911370073793ee5000	5325cfb724d0f04a948e8310ccdb38c6	t	2025-05-21 08:50:19.271	2025-05-21 08:50:19.271	2025-05-21 08:50:19.47
90	0xcb82803b69e434bcabad4c58d010fe89917207ac	martacalleja20@gmail.com	$2b$10$oaRREyNmdTol/tGIQWKHXOAPIKgZ5wDjCKc9eUDSgZV31iwKhiWKu	$2b$10$oaRREyNmdTol/tGIQWKHXO	64671a8066ce6fef5c8851f8311f81e049b3d6681ef706c3eb2a265d0b4ddffa0a628a34b5f11fac020b04de2c3b866fe201a2fa4c1f3c77054f15125e78d3b8a08f:ca9eca98f0dac51ea6a1fd4d05382c8c	a1c77f45a2d3678a8bd0b559f4e92a3c	t	2025-05-21 09:11:46.824	2025-05-21 09:14:20.711	2025-05-21 09:14:43.669
91	0x4191f0f0ea0b0f5bc6f46772db6a223045195112	info@jbhfinancialgroup.com	$2b$10$CnUkt.NXhKF4X3Cz2mVOMOLpPbhvRqinxwLfPqjHTBu6.baeEV6j.	$2b$10$CnUkt.NXhKF4X3Cz2mVOMO	8577d9d41b4c30bc1686c06b6ca48825dd4106ba3cfe1ea7537c9ffa49383dcf430f6a60314b253743af94f6100bf46b7fbbd466325c99386232fe94b599b319034a:17742c330ee66bae22cb062a3766adc4	0702ffad6aa3f3f361213086533fb522	t	2025-05-22 10:15:15.848	2025-05-22 10:15:15.848	2025-05-22 10:15:15.971
92	0x26a8416bd9e038343e23ac9ce05f76b7707cd652	mcallejaperxachs8@gmail.com	$2b$10$a7ZKj2WzvTNk4IeDWte2Au.rKu.uwNEJO3Wg4Ff.ZAukUe4PXNSxu	$2b$10$a7ZKj2WzvTNk4IeDWte2Au	6a604ed2c38a73db8eff8b88853b6ce8f8ad09d7f6e95e0abe084729fa6386a48b52711358ea2bdcf3eebbf6f9f5a6f13ffc93a523d7c6a846c05396c0fe17efcdaf:e2c6b496a7023d32074d30d305b2d0be	2026007585a24d75e37d8eb91ec2022b	t	2025-05-22 11:20:15.518	2025-05-22 11:20:15.518	2025-05-22 11:20:15.685
93	0x1e8b49fd52936b74829c642064c55eba4fbf5173	mcallejaperxachs10@gmail.com	$2b$10$UNeEGC5jDvnLoUJ5mBudluHZCan9cBpRgxhNuLgSQxFArijW1zNmq	$2b$10$UNeEGC5jDvnLoUJ5mBudlu	76b37d4ede1ea6e6f4b91d8d5d29037ba9b05f28b99068d135aac182e506d3e447221ccf632b9907b208f3bbb57652425ac41f0e1a2944acc9f06c2bf8dbcf2354bf:dfaa62d6b8f2bf621ddf9de10d9443d8	53f6e9e576d4a6a4d15fee2097a2be84	t	2025-05-22 11:50:25.485	2025-05-22 11:50:25.485	2025-05-22 11:50:25.664
94	0x072e5c543c2d898af125c20d30c8d13a66dda9af	mcallejaperxachs20@gmail.com	$2b$10$bI0GipeeCbyvNbR2b/Kk5e6QeWvciSXS/RBEiCAgGAJ7bQyYR0u/a	$2b$10$bI0GipeeCbyvNbR2b/Kk5e	1b639be5a2779b01f765f776c698d25463d01e425e3d02bf3db1b645ab2162f79e84eb874f5292951ced3e9e6171c5ebf1f290ee621d19d3a94596c4040eaf246b7d:d20e429a9e4ffc9b66989ca7cfbac87f	ea393e5f3b327b17c36dc0bb266b30cd	t	2025-05-22 13:48:32.352	2025-05-22 13:48:32.352	2025-05-22 13:48:32.547
95	0x6a3dd94845a56fab9b76908528a4097e6c03969b	cristian199833@gmail.es	$2b$10$XnW3V7nEm6ZBXe0ngAqzHeCHPXcxfJwoPeO.BFzLGT3FdfyrLxF9i	$2b$10$XnW3V7nEm6ZBXe0ngAqzHe	c0c7c633b355c63f4567368d01961beec66366de0ea6f87dd200116df4aab4b44c2366e978a4bc710036954895337fe1556b6f35462994933a1851ed477553e5abd0:64ed29129970890591ab03e58d5bea5b	d35b87c8a7fb581eae451cb855a0a9a6	t	2025-05-23 05:06:21.097	2025-05-23 05:06:21.097	2025-05-23 05:06:21.29
96	0x2d17a38b68ae92940f517bbf5c4669a804a3ad65	mcallejaperxachs50@gmail.com	$2b$10$TqR25Dsg3IcI6hHB9yV8se9it3.QGns8G2ZjZl/UAZJCAuU7YYAOy	$2b$10$TqR25Dsg3IcI6hHB9yV8se	b8ac082fddf7b0480ee150f4babeacf68d559369003e025bc47552e4afd1e3805cfe75a0deb348da6ab78f30db787776846bbfab8ea41e792b8252da8cdb82692df9:c919a4ac5a3836c4d193d55e10bd72c4	0e583b455885ac4b4c21e1f1dae1a35a	t	2025-05-23 08:01:31.172	2025-05-23 08:01:31.172	2025-05-23 08:01:31.388
97	0x0e233b52b94e961efb151dc8aa1f48c5e69ab5e3	mcallejaperxachs77@gmail.com	$2b$10$lB8L96J0lA5uSakjrpIDF.98GOCEKd5ttXWYfyAsNE5cztaZA7eOC	$2b$10$lB8L96J0lA5uSakjrpIDF.	5c7fedda19154f1ae353298d9c00ed390b55507f03028c85b268c71a18f14542b35f3b4161277cd2d7d732712cb1873e2ed42c27a7f22ff857d3e79f97ba69434e5f:12e8be9dba9a91e7305337c3d09d16c3	6bd35811b63a8881f1ba5b1d1617fbbc	t	2025-05-23 08:41:50.787	2025-05-23 08:41:50.787	2025-05-23 08:41:50.941
98	0x6a65b23dcbd5a218f173aee334d9022744d0ab20	mcallejaperxachs88@gmail.com	$2b$10$jpnH/6DwV7IOuEV7duGBs.oXFtErTHoeBsCQRaDG7dtn8hYKmlsLO	$2b$10$jpnH/6DwV7IOuEV7duGBs.	0c328d47a381b540b16c3dd3ee06f5a5ca7a06861e50d083929528dc4dbc94c080e7399e60d312d1a3033c5f03c2db311b859a29f7038e34f247eea2dc4d34d2d72c:36941e3827bb4e02a035f4b74712807f	f3e0ed9cd24bec29f23f01bfdb20e969	t	2025-05-23 10:47:14.606	2025-05-23 10:47:14.606	2025-05-23 10:47:14.784
99	0x1f14c21f686d1b4268b084929502859ee05e8119	jaumereales@gmail.com	$2b$10$4Wq/Y2jzTjxuhG.8EVTohe3EDrKacqqkwVuDXHIlkO5Bsg/UPiboC	$2b$10$4Wq/Y2jzTjxuhG.8EVTohe	d8495299451331ae20b1290b012cda85736c5d63e054bee02976d972dd55d8d347dd64299ec7d9ae71a4066e5d4de694f8b91b651ff0f2754c4498c7a9d7960b0c04:03004fa299ab6f622551c528626bb637	6e4bdd042576ec542e1da6d325ee4b18	t	2025-05-27 09:09:58.264	2025-05-27 09:09:58.264	2025-05-29 06:54:29.479
100	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	isabelcpconde@gmail.com	$2b$10$LH47V7zRat76rJ7hxvlXNe12kOESh7fwrqUpHUOQsA6OxuM5n3u8G	$2b$10$LH47V7zRat76rJ7hxvlXNe	55788f909293fceb25f421cd7123ae618eaa3d02722efd60642ef15e2e841009bf97e7431f251a89bc6a734ee12ce78b3df69ac5f03d96f966c22c710c094b251339:6f23b9376d930adc401e5d44ec643355	5ebf2ae7430443d0cb27ce147ebbd732	t	2025-05-28 11:51:14.253	2025-05-28 11:51:14.253	2025-05-28 14:05:39.405
101	0x0bd58ac07642fbc4562e5d107b353ae5fa65c8f1	ajblazquez1967@gmail.com	$2b$10$A45wpjCP7x2aISMWtI9kUODw7XJVzU8rms6A7wGBJMpw4fKPqanXm	$2b$10$A45wpjCP7x2aISMWtI9kUO	85d9758f71a4f5122594c4bb873ff295a68ab51250ce3f91517036421946c8a0e6a3831842a4d6f26bb10b1636fc31c7d152120cbe830e5460a401e027e7998fcef4:69a40f6a476ea81fdac74088639108de	c85d567a6d3f6a8b7d315785f5b6b70b	t	2025-05-29 09:27:19.753	2025-05-29 09:27:19.753	2025-05-29 12:54:28.157
102	0xd268039ced2a505a1711089da83e464a95d2856a	raizcuadrada144@gmail.com	$2b$10$hDVeUWOABzvFUTz6rmkgvuDiWklPO3oHNMlrMRX3VoOViOxbo..7e	$2b$10$hDVeUWOABzvFUTz6rmkgvu	b8681b9866ea9c48719504a76152aecdd4149168f41848a6211caf05985b3dde4059352c848dd4d869b2d12b3bbc403e05a7f93179ef443472df495b6ddbc0ea9620:9201918b0fc2dfe88364f0ac68341f77	a49b18025bf4a44e74a44c9b11cdc8bd	t	2025-05-29 09:29:19.739	2025-05-29 09:29:19.739	2025-05-29 11:56:46.027
103	0x75470ca3fd1da06d93a9bd91981e6824e7be2391	garzon.Joaquin@icloud.com	$2b$10$67tYZ.7.aWxxxWsMOozrGumcEAAbygl5//YhRgsoCx32r.YNzxwDO	$2b$10$67tYZ.7.aWxxxWsMOozrGu	a789d4082b9b169941e7ab604c9c1b0358fdaeaac89043e5820c88faa76cf024dc267225d034908847486fb12d5274b06eb286d93bb7f29f59ea02caf102839df0ab:791a242d81f7a57357892f3380344b9e	c9205a8ede3efc0a69c3bbf0e540e96f	t	2025-05-29 09:38:43.199	2025-05-29 09:38:43.199	2025-05-29 11:58:42.305
104	0x7de2eb01f97b2326c6b679354f262526358ef759	mon.amores@gmail.com	$2b$10$KxQVIHdO7DCZLNdqYQYvDOH34igBd62I3Sm9PoaUk8KLY0ae3x2L6	$2b$10$KxQVIHdO7DCZLNdqYQYvDO	e11218ddb976fd8f00ffcdb6991d7dedc9d1051b70b6699bec5146ec3be2ff4520db8669a37a814e85b44ffe3f50ded501dc5a1bd3ee3577258b835dfc9fdf5b924e:8701ff5185b2de29e62a855178618d9b	3abe999d1cd8a2604bd060ccc3cb3ba6	t	2025-05-29 09:41:05.426	2025-05-29 09:41:05.426	2025-05-29 11:59:27.579
6	0x3D85fdA5ea53e190404210a91150a1dDF463741f	cristian199833@hotmail.es	$2b$10$T04U7zA6Z3gCHNJCiGpUoO3QWeNvz5LZEUXZ2CkBYtUkDWV3HkUqW	$2b$10$T04U7zA6Z3gCHNJCiGpUoO	11773ffde3a81a078793cc8df8176c880262075a02d9175a5e6295b247e3c169caea114a1f367fe6078452e3169718126f3020031b53f5fed94f4f30f09b6cfed678:bb671fa4d58f57b2ca94661cd3337fa4	f5c37a8949b683c3474f957f56a8903f	t	2025-04-29 05:07:44.906	2025-05-20 05:03:53.861	2025-12-19 11:22:00.659087
\.


--
-- Data for Name: custom_pools; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.custom_pools (id, name, address, fee_tier, token0_address, token0_symbol, token0_name, token0_decimals, token1_address, token1_symbol, token1_name, token1_decimals, active, created_at, updated_at, network_id, network_name, created_by, network) FROM stdin;
1	ETH-DAI	0x60594a405d53811d3bc4766596efd80fd545a270	500	0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2	ETH	Ethereum	18	0x6B175474E89094C44Da98b954EedeAC495271d0F	DAI	Dai Stablecoin	18	t	2025-04-01 21:15:08.183	2025-04-01 21:15:08.183	1	Ethereum	system	ethereum
2	USDT-ETH	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	3000	0xdAC17F958D2ee523a2206206994597C13D831ec7	USDT	Tether USD	6	0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2	ETH	Ethereum	18	t	2025-04-01 21:15:08.183	2025-04-01 21:15:08.183	1	Ethereum	system	ethereum
6558	WBTC/USDC	0x99ac8ca7087fa4a2a1fb6357269965a2014abc35	3000	0x2260fac5e5542a773aa44fbcfedf7c193bc2c599	WBTC	WBTC	18	0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48	USDC	USDC	6	t	2025-04-19 11:55:29.205	2025-04-19 11:55:29.205	1	ETHEREUM	0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F	ethereum
27	USDC / ETH	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	500	0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48	USDC	USD Coin	6	0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2	ETH	Ethereum	18	t	2025-04-01 23:12:54.586	2025-04-01 23:12:54.586	1	ETHEREUM	0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F	ethereum
\.


--
-- Data for Name: fee_withdrawals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fee_withdrawals (id, wallet_address, position_id, pool_address, pool_name, token_pair, amount, currency, status, transaction_hash, requested_at, processed_at, processed_by, notes, network, fee_type, apr_before_withdrawal, apr_after_withdrawal, apr_penalty_applied, apr_penalty_amount) FROM stdin;
2	0x9dae8525796c538990cf71733460d61f9cfc3776	1	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC-ETH Pool	USDC-ETH	10124.620000	USDC	completed	0xmanual_withdrawal_admin_entry_1757341905.345873	2025-05-15 14:31:45.345873	2025-05-15 14:31:45.345873	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Retirada manual de 8640 EUR convertido a USD (tipo cambio: 1.1719) - Fecha ajustada para cooldown hasta mayo 2026	polygon	fees	\N	\N	f	7.73
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.invoices (id, invoice_number, wallet_address, position_id, amount, status, payment_method, transaction_hash, bank_reference, issue_date, due_date, paid_date, client_name, client_address, client_city, client_country, client_tax_id, notes, additional_data, created_at, updated_at, client_email, client_phone, billing_profile_id, payment_intent_id, items, currency) FROM stdin;
5	INV-2025-04-00005	0xa9e74ad8fe43859411184f7c887ea9964100505b	20	3538.17	Paid	Bank Transfer	0xff2ca06e28649472e43785325ef6ce121dc87a5cdc22baa7b7962eb354c9769b	\N	2025-04-04 15:44:19.459	2025-04-11 15:44:19.459	2025-04-04 00:00:00	Javier Duran Urrea	C/ Bartomeu Paulis nº 6, Malgrat de Mar, 08380	Barcelona	España	77633350R	Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 20}	2025-04-04 15:44:19.499	2025-11-11 15:41:42.231	\N	\N	\N	\N	\N	USD
6	INV-2025-04-00006	0xa9e74ad8fe43859411184f7c887ea9964100505b	21	10000.00	Paid	Bank Transfer	0x511fe320976bcd7504e4e26c9df31d807e38b11f3ab15b97663f269c26cfc1f3	\N	2025-04-04 15:58:28.344	2025-04-11 15:58:28.344	2025-04-04 00:00:00	Adrian Galindo I Jimenez	Crer. LLuís Millet 0121 PBJ El Masnou 08320	Barcelona	España	47333642X	Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 21}	2025-04-04 15:58:28.401	2025-11-11 15:41:32.52	\N	\N	\N	\N	\N	USD
67	INV-2025-04-00008	0xe19adf4350a59dca68013e28cf41e7fcae051b95	78	196021.00	Paid	Bank Transfer	\N	\N	2025-04-16 10:57:07.546	2025-04-23 10:57:07.546	2025-04-16 00:00:00	Cristian Holandes 	Carrer d’ Enric Morera 20 Gerona				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 78}	2025-04-16 10:57:07.718	2025-11-11 16:03:35.422	\N	\N	\N	\N	\N	USD
70	INV-2025-04-00011	0xe19adf4350a59dca68013e28cf41e7fcae051b95	81	10775.00	Paid	Bank Transfer	\N	\N	2025-04-16 11:06:53.642	2025-04-23 11:06:53.642	2025-04-16 00:00:00	Cristian Holandes 	Carrer d’ Enric Morera 20 Gerona				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 81}	2025-04-16 11:06:53.764	2025-11-11 16:03:41.856	\N	\N	\N	\N	\N	USD
71	INV-2025-04-00012	0xe19adf4350a59dca68013e28cf41e7fcae051b95	82	11061.00	Paid	Bank Transfer	\N	\N	2025-04-16 11:08:08.897	2025-04-23 11:08:08.897	2025-04-16 00:00:00	Cristian Holandes 	Carrer d’ Enric Morera 20 Gerona				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 82}	2025-04-16 11:08:09.015	2025-11-11 16:03:50.054	\N	\N	\N	\N	\N	USD
85	INV-2025-05-00001	0xad4474df3230a95a39d9937ab0ad91113972204a	102	10000.00	Paid	Wallet Payment	\N	Paid in cash	2025-05-06 07:41:36.452	2025-05-13 07:41:36.452	2025-05-06 00:00:00	Joker Jocs de Blanes SL	Carrer del Bellaire 39/41	Blanes	España	B17401217	Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 102}	2025-05-06 07:41:36.538	2025-11-11 15:41:14.699	\N	\N	\N	\N	\N	USD
86	INV-2025-05-00002	0x8aaa8b6e3385333b1753c4075111996ceb150644	103	100.00	Paid	Wallet Payment	\N	\N	2025-05-06 09:48:59.784	2025-05-13 09:48:59.784	2025-05-06 00:00:00	Sergio Javier Marçal	80 Passeig Mestrança	Blanes	Gerona		Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 365, "positionId": 103}	2025-05-06 09:48:59.875	2025-11-11 15:41:08.247	\N	\N	\N	\N	\N	USD
89	INV-2025-05-00004	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	107	30000.00	Paid	Bank Transfer	\N	\N	2025-05-07 12:36:41.579	2025-05-14 12:36:41.579	2025-05-07 00:00:00	Inmaculada De la Concepcion Corzo Guisado	Calle la selva 12 1 2 Blanes 	Blanes	España	53074821K	Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 90, "positionId": 107}	2025-05-07 12:36:41.725	2025-11-11 16:05:54.961	\N	\N	\N	\N	\N	USD
96	INV-2025-05-00008	0x8aaa8b6e3385333b1753c4075111996ceb150644	114	2000.00	Paid	Wallet Payment	\N	\N	2025-05-09 08:47:19.868	2025-05-16 08:47:19.868	2025-05-09 00:00:00	Sergio Javier Marçal	80 Passeig Mestrança	Blanes	España		Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 30, "positionId": 114}	2025-05-09 08:47:19.95	2025-11-11 15:40:59.736	\N	\N	\N	\N	\N	USD
99	INV-2025-05-00009	0xfc065ed0904e750c18288060bab3af32e855d307	117	107670.00	Paid	Bank Transfer	\N	\N	2025-05-13 12:04:13.442	2025-05-20 12:04:13.442	2025-05-16 00:00:00	Cristian Mari	Carrer Olivers 23 Barcelona 				Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 365, "positionId": 117}	2025-05-13 12:04:13.602	2025-11-11 16:03:02.429	\N	\N	\N	\N	\N	USD
101	INV-2025-05-00010	0xe19adf4350a59dca68013e28cf41e7fcae051b95	119	40769.35	Paid	Bank Transfer	\N	\N	2025-05-16 08:33:33.396	2025-05-23 08:33:33.396	2025-05-16 00:00:00	Cristian Holandes 	Carrer d’ Enric Morera 20 Gerona				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 119}	2025-05-16 08:33:33.466	2025-11-11 16:03:23.852	\N	\N	\N	\N	\N	USD
103	INV-2025-05-00011	0xfc065ed0904e750c18288060bab3af32e855d307	121	9851.34	Paid	Bank Transfer	\N	\N	2025-05-17 13:27:12.758	2025-05-24 13:27:12.758	2025-05-17 00:00:00	Cristian Mari	Carrer Olivers 23 Barcelona 				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 121}	2025-05-17 13:27:12.883	2025-11-11 16:02:49.543	\N	\N	\N	\N	\N	USD
109	INV-2025-05-00016	0x7ee905e3a0132cf867a78aa9ccfa6c49cfdda066	129	160000.00	Paid	Bank Transfer	\N	\N	2025-05-26 09:12:35.523	2025-06-02 09:12:35.523	2025-05-26 00:00:00	Jared Ballanti	Carrer de Cristòfor Colom 10				Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 365, "positionId": 129}	2025-05-26 09:12:35.633	2025-11-11 16:00:50.222	\N	\N	\N	\N	\N	USD
122	INV-2025-05-00021	0xd268039ced2a505a1711089da83e464a95d2856a	146	6000.00	Paid	Bank Transfer	\N	\N	2025-05-29 09:37:01.204	2025-06-05 09:37:01.204	2025-05-29 00:00:00	Anna Amores	Carrer de Cristòfor Colom 5				Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 365, "positionId": 146}	2025-05-29 09:37:01.288	2025-11-11 16:01:11.591	\N	\N	\N	\N	\N	USD
123	INV-2025-05-00022	0x75470ca3fd1da06d93a9bd91981e6824e7be2391	147	10000.00	Paid	Bank Transfer	\N	\N	2025-05-29 09:39:07.521	2025-06-05 09:39:07.521	2025-05-29 00:00:00	Joaquin Garzon	Carrer de Valls 10				Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 365, "positionId": 147}	2025-05-29 09:39:07.604	2025-11-11 15:59:31.479	\N	\N	\N	\N	\N	USD
124	INV-2025-05-00023	0x7de2eb01f97b2326c6b679354f262526358ef759	148	10000.00	Paid	Bank Transfer	\N	\N	2025-05-29 09:41:37.752	2025-06-05 09:41:37.752	2025-05-29 00:00:00	Montserrat Amores	Calle Jacinto Verdaguer 10	Blanes	Gerona		Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 365, "positionId": 148}	2025-05-29 09:41:37.844	2025-11-11 15:59:21.636	\N	\N	\N	\N	\N	USD
126	INV-2025-05-00024	0xa7f4137db52d5a4af26bc7f5f7e153b697f62828	150	7500.00	Paid	Bank Transfer	\N	\N	2025-05-29 13:30:57.719	2025-06-05 13:30:57.719	2025-05-29 00:00:00	Alejandro Peralta Quesada	Carrer de Felícia Fuster i Viladecans 16				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 150}	2025-05-29 13:30:57.811	2025-11-11 15:58:58.668	\N	\N	\N	\N	\N	USD
127	INV-2025-05-00025	0x4f8b21e63469525749e2bd4246bec01e6a1b9220	151	7000.00	Paid	Bank Transfer	\N	\N	2025-05-29 13:35:02.131	2025-06-05 13:35:02.131	2025-05-29 00:00:00	Javier Duran Urrea	C/ Bartomeu Paulis nº 6, Malgrat de Mar, 08380				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 151}	2025-05-29 13:35:02.224	2025-11-11 16:04:43.233	\N	\N	\N	\N	\N	USD
128	INV-2025-05-00026	0xa7f4137db52d5a4af26bc7f5f7e153b697f62828	152	6000.00	Paid	Bank Transfer	\N	\N	2025-05-30 08:33:34.597	2025-06-06 08:33:34.597	2025-05-30 00:00:00	Alejandro Peralta Quesada	Carrer de Felícia Fuster i Viladecans 16				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 152}	2025-05-30 08:33:34.697	2025-11-11 15:58:48.475	\N	\N	\N	\N	\N	USD
143	INV-2025-06-00010	0x7d7fc32793b94d05fcaa7e50e7ba531111c96f16	173	4500.00	Paid	Bank Transfer	\N	\N	2025-06-13 11:08:46.322	2025-06-20 11:08:46.322	2025-06-13 00:00:00	Hugo Antequera	Calle la selva 12 1 2 Blanes 				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 173}	2025-06-13 11:08:46.409	2025-11-11 15:57:45.553	\N	\N	\N	\N	\N	USD
144	INV-2025-06-00011	0xa7f4137db52d5a4af26bc7f5f7e153b697f62828	174	6847.00	Paid	Bank Transfer	\N	\N	2025-06-13 12:10:25.699	2025-06-20 12:10:25.699	2025-06-13 00:00:00	Alejandro Peralta Quesada	Carrer de Felícia Fuster i Viladecans 				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 174}	2025-06-13 12:10:25.784	2025-11-11 15:57:18.448	\N	\N	\N	\N	\N	USD
156	INV-2025-06-00017	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	191	2000.00	Paid	Bank Transfer	\N	\N	2025-06-19 08:56:00.436	2025-06-26 08:56:00.436	2025-06-19 00:00:00	Inmaculada De la Concepcion Corzo Guisado	Calle la selva 12 1 2 Blanes 				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 191}	2025-06-19 08:56:00.53	2025-11-11 15:56:10.836	\N	\N	\N	\N	\N	USD
169	INV-2025-07-00002	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	214	65000.00	Paid	Bank Transfer	\N	\N	2025-07-08 12:47:10.717	2025-07-15 12:47:10.717	2025-07-08 00:00:00	Inmaculada De la Concepcion Corzo Guisado	Calle la selva 12 1 2 Blanes 				Payment for USDC/ETH pool position. Created by admin. - Actualizado automáticamente a Pagado al activar la posición.	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 214}	2025-07-08 12:47:10.811	2025-11-11 15:56:04.911	\N	\N	\N	\N	\N	USD
183	INV-2025-07-00009	0xc2be5767fb88376cab0780782bda0edd1e2ea88c	243	10000.00	Paid	Bank Transfer	\N	\N	2025-07-17 08:16:07.613	2025-07-24 08:16:07.613	2025-07-17 00:00:00	Adrian Galindo	Crer. LLuís Millet 0121 PBJ El Masnou 08320				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 243}	2025-07-17 08:16:07.709	2025-11-11 16:05:08.879	\N	\N	\N	\N	\N	USD
184	INV-2025-07-00010	0xc2be5767fb88376cab0780782bda0edd1e2ea88c	244	10000.00	Paid	Bank Transfer	\N	\N	2025-07-17 08:17:38.413	2025-07-24 08:17:38.413	2025-07-17 00:00:00	Adrian Galindo	Crer. LLuís Millet 0121 PBJ El Masnou 08320				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 90, "positionId": 244}	2025-07-17 08:17:38.513	2025-11-11 16:05:17.637	\N	\N	\N	\N	\N	USD
253	INV-2025-11-00003	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	330	6000.00	Pending	Bank Transfer	\N	\N	2025-11-17 08:09:44.218	2025-11-24 08:09:44.218	\N	User 0x4d5c...ee85	\N	\N	\N	\N	Payment for USDC/ETH pool position. Created by admin.	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 330}	2025-11-17 08:09:44.377	2025-11-17 08:09:44.377	\N	\N	\N	\N	\N	USD
205	INV-2025-08-00002	0xf5d3d369879460e172e30b5a7dbc1a2d3e285bb4	271	41692.00	Paid	Bank Transfer	\N	\N	2025-08-01 10:53:19.612	2025-08-08 10:53:19.612	2025-08-18 00:00:00	Jordi Pere Noguera Vila	Avinguda del Ripollès 20				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 365, "positionId": 271}	2025-08-01 10:53:19.708	2025-11-11 15:54:30.43	\N	\N	\N	\N	\N	USD
209	INV-2025-08-00006	0x8e2517df89b7e662a46dce6e7490342d0bf620e8	275	100.00	Paid	Wallet Payment	\N	\N	2025-08-10 13:53:24.214	2025-08-17 13:53:24.214	2025-08-21 00:00:00	Aparicio Gómez Nebot	Carrer de la Bonanova (Passeig de la Bonanova) 				Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 30, "positionId": 275}	2025-08-10 13:53:24.309	2025-11-11 15:53:07.37	\N	\N	\N	\N	\N	USD
217	INV-2025-08-00007	0xfe13d4499bb58fab5a1751124a4071352a68a067	284	7000.00	Paid	Bank Transfer	\N	\N	2025-08-27 10:43:22.052	2025-09-03 10:43:22.052	2025-08-27 00:00:00	David Alonso	Carrer de Girona 10				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 284}	2025-08-27 10:43:22.146	2025-11-11 15:52:23.171	\N	\N	\N	\N	\N	USD
220	INV-2025-09-00002	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	290	30000.00	Paid	Bank Transfer	\N	\N	2025-09-02 11:54:19.066	2025-09-09 11:54:19.066	2025-09-02 00:00:00	Inmaculada De la Concepcion Corzo Guisado	Calle la selva 12 1 2 Blanes 				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 90, "positionId": 290}	2025-09-02 11:54:19.154	2025-11-11 15:55:55.692	\N	\N	\N	\N	\N	USD
229	INV-2025-09-00009	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	301	30000.00	Paid	Bank Transfer	\N	\N	2025-09-15 07:55:52.775	2025-09-22 07:55:52.775	2025-09-15 00:00:00	Raul Antequera	Calle la selva 12 1 2 Blanes 				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 90, "positionId": 301}	2025-09-15 07:55:52.866	2025-11-11 15:52:07.243	\N	\N	\N	\N	\N	USD
230	INV-2025-09-00010	0xd44e7aac81c9d4d2a486df60b03de02638dc7bd7	302	10000.00	Paid	Bank Transfer	\N	\N	2025-09-15 16:18:23.25	2025-09-22 16:18:23.25	2025-09-18 00:00:00	Modesta Maleta Terry	Carrer Ardales 55 p02	Blanes	Gerona		Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 30, "positionId": 302}	2025-09-15 16:18:23.343	2025-11-11 15:38:19.299	\N	\N	\N	\N	\N	USD
231	INV-2025-09-00011	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	303	20000.00	Paid	Bank Transfer	\N	\N	2025-09-18 08:45:18.481	2025-09-25 08:45:18.481	2025-09-23 00:00:00	Raul Antequera Martinez	Calle la selva 12 1 2 Blanes 				Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 303}	2025-09-18 08:45:18.571	2025-11-11 15:55:17.212	\N	\N	\N	\N	\N	USD
236	INV-2025-09-00013	0xd44e7aac81c9d4d2a486df60b03de02638dc7bd7	311	20000.00	Paid	Bank Transfer	\N	\N	2025-09-30 12:00:15.584	2025-10-07 12:00:15.584	2025-10-01 00:00:00	Modesta Maleta Terry	Carrer Ardales 55 p02	Blanes	Gerona		Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 311}	2025-09-30 12:00:15.684	2025-11-11 15:38:07.974	\N	\N	\N	\N	\N	USD
237	INV-2025-10-00001	0xec370896441ecd15fc5b216edd1b6af02346200f	312	1000.00	Paid	Wallet Payment	\N	\N	2025-10-01 15:15:17.496	2025-10-08 15:15:17.496	2025-10-01 00:00:00	Pep Pou	Carrer de la Marina 12				Algorithmic software license	{"poolName": "USDC/ETH", "timeframe": 30, "positionId": 312}	2025-10-01 15:15:17.589	2025-11-11 15:50:50.547	\N	\N	\N	\N	\N	USD
240	INV-2025-10-00002	0xd44e7aac81c9d4d2a486df60b03de02638dc7bd7	315	20000.00	Paid	Bank Transfer	\N	\N	2025-10-02 16:15:23.761	2025-10-09 16:15:23.761	2025-10-20 00:00:00	Modesta Maleta Terry	Carrer Ardales 55 Gerona	Blanes	Gerona		Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 30, "positionId": 315}	2025-10-02 16:15:23.854	2025-11-11 16:02:34.57	\N	\N	\N	\N	\N	USD
250	INV-2025-10-00003	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	327	10000.00	Paid	Bank Transfer	\N	\N	2025-10-30 16:07:00.034	2025-11-06 16:07:00.034	2025-11-03 00:00:00	Raul Antequera Martinez				Calle la selva 12 1 2 Blanes 	Algorithmic software license	{"poolName": "USDC/ETH", "createdBy": "admin", "timeframe": 90, "positionId": 327}	2025-10-30 16:07:00.127	2025-11-11 15:51:59.855	\N	\N	\N	\N	\N	USD
251	INV-2025-11-00001	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	328	10000.00	Pending	Bank Transfer	\N	\N	2025-11-14 19:45:26.696	2025-11-21 19:45:26.696	\N	User 0x6b22...271f	\N	\N	\N	\N	Payment for USDC/ETH pool position. Contract start date: 2025-11-14	{"poolName": "USDC/ETH", "timeframe": 365, "positionId": 328}	2025-11-14 19:45:26.791	2025-11-14 19:45:26.791	\N	\N	\N	\N	\N	USD
252	INV-2025-11-00002	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	329	10000.00	Pending	Bank Transfer	\N	\N	2025-11-14 19:45:43.071	2025-11-21 19:45:43.071	\N	User 0x6b22...271f	\N	\N	\N	\N	Payment for USDC/ETH pool position. Contract start date: 2025-11-14	{"poolName": "USDC/ETH", "timeframe": 365, "positionId": 329}	2025-11-14 19:45:43.158	2025-11-14 19:45:43.158	\N	\N	\N	\N	\N	USD
\.


--
-- Data for Name: landing_videos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.landing_videos (id, language, main_video_url, full_video_url, video_type, active, created_at, updated_at, created_by) FROM stdin;
1	es	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:39:53.57	2025-05-05 14:39:53.57	system_migration
2	en	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:39:53.597	2025-05-05 14:39:53.597	system_migration
3	ar	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:48:04.753	2025-05-05 14:48:04.753	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
4	pt	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:48:15.584	2025-05-05 14:48:15.584	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
5	it	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:48:25.562	2025-05-05 14:48:25.562	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
6	fr	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:48:38.146	2025-05-05 14:48:38.146	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
7	de	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:48:49.191	2025-05-05 14:48:49.191	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
8	hi	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:49:00.024	2025-05-05 14:49:00.024	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
9	zh	https://www.youtube.com/watch?v=X1DjmMOBLIk	https://www.youtube.com/watch?v=X1DjmMOBLIk	video/mp4	t	2025-05-05 14:49:09.06	2025-05-05 14:49:09.06	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leads (id, full_name, email, phone, company, investment_size, message, consent_given, created_at, updated_at, status, assigned_to, notes, source, follow_up_date, last_contact, language_preference, original_referrer, additional_data) FROM stdin;
3	Lorenzo Ballanti Moran	lballanti.lb@gmail.com	639640453	JBH Financial Group S.L.	25000-50000	A ver cuanto tardais en responderme	t	2025-05-05 14:22:07.103	2025-05-05 18:20:47.566	no_interesado	\N		landing_page	\N	2025-05-05 18:20:35.98	es	\N	\N
5	Lorenzo Ballanti Moran	lballanti.lb@gmail.com	+34 	JBH Financial Group S.L.	5000-10000	kyfkgdfkhgdkjg	t	2025-05-05 20:47:03.646	2025-05-05 20:47:57.384	no_interesado	\N		landing_page	\N	\N	en	\N	{"phoneFormatted": "+34 ", "phoneCountryCode": "es"}
4	Lorenzo Ballanti Moran	lballanti.lb@gmail.com	+34 	JBH Financial Group S.L.	5000-10000	sfssgsegesew	t	2025-05-05 18:59:18.419	2025-05-05 20:48:03.747	no_interesado	\N		landing_page	\N	\N	en	\N	{"phoneFormatted": "+34 ", "phoneCountryCode": "es"}
2	Lorenzo Ballanti Moran	lballanti.lb@gmail.com	639640453	JBH Financial Group S.L.	50000-100000	Esta es una prueba, decirme si la habéis recibido en el email de Elysium. A ver lo que tardáis en leerla.	t	2025-05-05 13:40:56.29	2025-05-05 20:48:07.907	no_interesado	\N		landing_page	\N	\N	es	\N	\N
1	Lorenzo Ballanti Moran	lballanti.lb@gmail.com	639640453	JBH Financial Group S.L.	25000-50000	Esta es una prueba, decirme si la habéis recibido en el email de Elysium. A ver lo que tardáis en leerla.	t	2025-05-05 13:33:45.121	2025-05-05 20:48:12.117	no_interesado	\N		landing_page	\N	\N	es	\N	\N
6	Mar Calleja 	mcallejaperxachs@gmail.com	+34 	\N	5000-10000	Hola, perros quiero que me contestéis 	t	2025-05-06 10:44:41.85	2025-05-19 06:45:08.217	no_interesado	\N		landing_page	\N	\N	es	\N	{"phoneFormatted": "+34 ", "phoneCountryCode": "es"}
\.


--
-- Data for Name: legal_signatures; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.legal_signatures (id, user_id, wallet_address, document_type, version, signature_date, ip_address, user_agent, location_data, device_info, blockchain_signature, referral_source, additional_data, email, consent_text, document_hash) FROM stdin;
190	4369	0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b	terms_of_use	1.0	2025-05-05 08:05:50.394	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Firefox", "isMobile": false, "platform": "unknown", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "138.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"via": "1.1 google", "host": "waybank.net", "accept": "*/*", "cookie": "_ga_R8LV7N6C04=GS1.1.1746432316.1.1.1746432325.0.0.0; _ga=GA1.1.1957619082.1746432316; _ga_XXXXXXXXXX=GS1.1.1746432319.1.1.1746432325.0.0.0", "origin": "https://waybank.net", "referer": "https://waybank.net/dashboard", "alt-used": "waybank.net", "priority": "u=0", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0", "traceparent": "00-af941220910f25e07483397dcb0bb17e-fcd97b9a37ddaf32-01", "content-type": "application/json", "server-timing": "depproxy;dur=1746432350177, pid1req;dur=1746432350191", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3", "x-forwarded-for": "67.218.250.44, 34.111.179.208, 35.191.38.80,35.202.5.198", "x-forwarded-host": "waybank.net", "x-replit-user-id": "", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "x-cloud-trace-context": "af941220910f25e07483397dcb0bb17e/18219729669796507442;o=1", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-05-05T08:05:50.376Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "waybank.net", "origin": "https://waybank.net", "referer": "https://waybank.net/dashboard", "forwardedHost": "waybank.net", "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://waybank.net/api/user/0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-05T08:05:50.376Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
191	4369	0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b	privacy_policy	1.0	2025-05-05 08:05:50.445	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Firefox", "isMobile": false, "platform": "unknown", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "138.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"via": "1.1 google", "host": "waybank.net", "accept": "*/*", "cookie": "_ga_R8LV7N6C04=GS1.1.1746432316.1.1.1746432325.0.0.0; _ga=GA1.1.1957619082.1746432316; _ga_XXXXXXXXXX=GS1.1.1746432319.1.1.1746432325.0.0.0", "origin": "https://waybank.net", "referer": "https://waybank.net/dashboard", "alt-used": "waybank.net", "priority": "u=0", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0", "traceparent": "00-af941220910f25e07483397dcb0bb17e-fcd97b9a37ddaf32-01", "content-type": "application/json", "server-timing": "depproxy;dur=1746432350177, pid1req;dur=1746432350191", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3", "x-forwarded-for": "67.218.250.44, 34.111.179.208, 35.191.38.80,35.202.5.198", "x-forwarded-host": "waybank.net", "x-replit-user-id": "", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "x-cloud-trace-context": "af941220910f25e07483397dcb0bb17e/18219729669796507442;o=1", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-05-05T08:05:50.428Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "waybank.net", "origin": "https://waybank.net", "referer": "https://waybank.net/dashboard", "forwardedHost": "waybank.net", "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://waybank.net/api/user/0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-05T08:05:50.428Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
192	4369	0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b	disclaimer	1.0	2025-05-05 08:05:50.483	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Firefox", "isMobile": false, "platform": "unknown", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "138.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"via": "1.1 google", "host": "waybank.net", "accept": "*/*", "cookie": "_ga_R8LV7N6C04=GS1.1.1746432316.1.1.1746432325.0.0.0; _ga=GA1.1.1957619082.1746432316; _ga_XXXXXXXXXX=GS1.1.1746432319.1.1.1746432325.0.0.0", "origin": "https://waybank.net", "referer": "https://waybank.net/dashboard", "alt-used": "waybank.net", "priority": "u=0", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:138.0) Gecko/20100101 Firefox/138.0", "traceparent": "00-af941220910f25e07483397dcb0bb17e-fcd97b9a37ddaf32-01", "content-type": "application/json", "server-timing": "depproxy;dur=1746432350177, pid1req;dur=1746432350191", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-MX,es;q=0.8,en-US;q=0.5,en;q=0.3", "x-forwarded-for": "67.218.250.44, 34.111.179.208, 35.191.38.80,35.202.5.198", "x-forwarded-host": "waybank.net", "x-replit-user-id": "", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "x-cloud-trace-context": "af941220910f25e07483397dcb0bb17e/18219729669796507442;o=1", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-05-05T08:05:50.467Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "waybank.net", "origin": "https://waybank.net", "referer": "https://waybank.net/dashboard", "forwardedHost": "waybank.net", "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://waybank.net/api/user/0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-05T08:05:50.467Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
211	5090	0xc64c6325caf34486a8c0c23ef85ab1858be1babe	terms_of_use	1.0	2025-05-09 14:08:25.396	127.0.0.1	curl/8.11.1	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": null, "connectionType": "proxy", "timezoneOffset": 0}	{"os": "Unknown", "browser": "Unknown", "isMobile": false, "platform": "unknown", "userAgent": "curl/8.11.1", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "unknown", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"host": "localhost:5000", "accept": "*/*", "user-agent": "curl/8.11.1", "content-type": "application/json", "content-length": "63"}, "protocol": "http", "timestamp": "2025-05-09T14:08:25.376Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": false}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "localhost:5000", "origin": null, "referer": null, "forwardedHost": null, "forwardedProto": null}, "legalComplianceInfo": {"websiteUrl": "http://localhost:5000/api/user/0xc64c6325caf34486a8c0c23ef85ab1858be1babe/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-09T14:08:25.376Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
212	5090	0xc64c6325caf34486a8c0c23ef85ab1858be1babe	privacy_policy	1.0	2025-05-09 14:08:25.422	127.0.0.1	curl/8.11.1	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": null, "connectionType": "proxy", "timezoneOffset": 0}	{"os": "Unknown", "browser": "Unknown", "isMobile": false, "platform": "unknown", "userAgent": "curl/8.11.1", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "unknown", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"host": "localhost:5000", "accept": "*/*", "user-agent": "curl/8.11.1", "content-type": "application/json", "content-length": "63"}, "protocol": "http", "timestamp": "2025-05-09T14:08:25.406Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": false}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "localhost:5000", "origin": null, "referer": null, "forwardedHost": null, "forwardedProto": null}, "legalComplianceInfo": {"websiteUrl": "http://localhost:5000/api/user/0xc64c6325caf34486a8c0c23ef85ab1858be1babe/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-09T14:08:25.406Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
3	1	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	disclaimer	1.0	2025-12-19 12:40:44.957626	172.31.71.194	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-ES,es;q=0.9,en;q=0.8", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Chrome", "isMobile": false, "platform": "macOS", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "screenInfo": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "clientHints": {"model": null, "mobile": "?0", "bitness": null, "platform": "macOS", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "143.0.0.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"dnt": "1", "host": "6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "accept": "*/*", "cookie": "connect.sid=s%3AfxE-HZiPgVBy2BVWBBImTg72ngtPtjc4.MLH5cpY%2BuCsa6qVXukeh9nEsgI8iUste0xvyzw9Qj0s", "origin": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "referer": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/dashboard", "sec-ch-ua": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "content-type": "application/json", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-ES,es;q=0.9,en;q=0.8", "x-forwarded-for": "139.47.119.220, 10.82.5.22", "sec-ch-ua-mobile": "?0", "x-replit-user-id": "", "x-wallet-address": "0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "sec-ch-ua-platform": "\\"macOS\\"", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "sec-fetch-storage-access": "active", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-12-19T12:40:44.866Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "origin": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "referer": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/dashboard", "forwardedHost": null, "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/api/user/0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-12-19T12:40:44.866Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
213	5090	0xc64c6325caf34486a8c0c23ef85ab1858be1babe	disclaimer	1.0	2025-05-09 14:08:25.447	127.0.0.1	curl/8.11.1	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": null, "connectionType": "proxy", "timezoneOffset": 0}	{"os": "Unknown", "browser": "Unknown", "isMobile": false, "platform": "unknown", "userAgent": "curl/8.11.1", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "unknown", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"host": "localhost:5000", "accept": "*/*", "user-agent": "curl/8.11.1", "content-type": "application/json", "content-length": "63"}, "protocol": "http", "timestamp": "2025-05-09T14:08:25.431Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": false}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "localhost:5000", "origin": null, "referer": null, "forwardedHost": null, "forwardedProto": null}, "legalComplianceInfo": {"websiteUrl": "http://localhost:5000/api/user/0xc64c6325caf34486a8c0c23ef85ab1858be1babe/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-09T14:08:25.431Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
235	4217	0x07311cb30a4d5faa239db6b55cc1c70879a66385	terms_of_use	1.0	2025-05-13 05:07:22.526	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-ES,es;q=0.9", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Safari", "isMobile": false, "platform": "unknown", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "18.4", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"via": "1.1 google", "host": "waypool.net", "accept": "*/*", "cookie": "_ga_R8LV7N6C04=GS2.1.s1747112593$o2$g1$t1747112684$j0$l0$h0; _ga_XXXXXXXXXX=GS2.1.s1747112596$o1$g1$t1747112684$j0$l0$h0; custodialSession=d081e72c-cdbe-4445-8d19-8f361dcce50c; _ga=GA1.1.1408582263.1746868365", "origin": "https://waypool.net", "referer": "https://waypool.net/dashboard", "priority": "u=3, i", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15", "traceparent": "00-ec46ea7410f9ccd655d4ef90ffa991d6-0b71af02c355e68a-01", "content-type": "application/json", "server-timing": "depproxy;dur=1747112842332, pid1req;dur=1747112842346", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br", "accept-language": "es-ES,es;q=0.9", "x-forwarded-for": "217.165.249.14, 34.111.179.208, 35.191.8.103,104.154.113.146", "x-forwarded-host": "waypool.net", "x-replit-user-id": "", "x-wallet-address": "0x07311cb30a4d5faa239db6b55cc1c70879a66385", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "x-cloud-trace-context": "ec46ea7410f9ccd655d4ef90ffa991d6/824632633187493514;o=1", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-05-13T05:07:22.508Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "waypool.net", "origin": "https://waypool.net", "referer": "https://waypool.net/dashboard", "forwardedHost": "waypool.net", "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://waypool.net/api/user/0x07311cb30a4d5faa239db6b55cc1c70879a66385/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-13T05:07:22.508Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
236	4217	0x07311cb30a4d5faa239db6b55cc1c70879a66385	privacy_policy	1.0	2025-05-13 05:07:22.577	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-ES,es;q=0.9", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Safari", "isMobile": false, "platform": "unknown", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "18.4", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"via": "1.1 google", "host": "waypool.net", "accept": "*/*", "cookie": "_ga_R8LV7N6C04=GS2.1.s1747112593$o2$g1$t1747112684$j0$l0$h0; _ga_XXXXXXXXXX=GS2.1.s1747112596$o1$g1$t1747112684$j0$l0$h0; custodialSession=d081e72c-cdbe-4445-8d19-8f361dcce50c; _ga=GA1.1.1408582263.1746868365", "origin": "https://waypool.net", "referer": "https://waypool.net/dashboard", "priority": "u=3, i", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15", "traceparent": "00-ec46ea7410f9ccd655d4ef90ffa991d6-0b71af02c355e68a-01", "content-type": "application/json", "server-timing": "depproxy;dur=1747112842332, pid1req;dur=1747112842346", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br", "accept-language": "es-ES,es;q=0.9", "x-forwarded-for": "217.165.249.14, 34.111.179.208, 35.191.8.103,104.154.113.146", "x-forwarded-host": "waypool.net", "x-replit-user-id": "", "x-wallet-address": "0x07311cb30a4d5faa239db6b55cc1c70879a66385", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "x-cloud-trace-context": "ec46ea7410f9ccd655d4ef90ffa991d6/824632633187493514;o=1", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-05-13T05:07:22.562Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "waypool.net", "origin": "https://waypool.net", "referer": "https://waypool.net/dashboard", "forwardedHost": "waypool.net", "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://waypool.net/api/user/0x07311cb30a4d5faa239db6b55cc1c70879a66385/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-13T05:07:22.562Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
237	4217	0x07311cb30a4d5faa239db6b55cc1c70879a66385	disclaimer	1.0	2025-05-13 05:07:22.608	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-ES,es;q=0.9", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Safari", "isMobile": false, "platform": "unknown", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15", "screenInfo": null, "clientHints": {"model": null, "mobile": null, "bitness": null, "platform": "unknown", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "18.4", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"via": "1.1 google", "host": "waypool.net", "accept": "*/*", "cookie": "_ga_R8LV7N6C04=GS2.1.s1747112593$o2$g1$t1747112684$j0$l0$h0; _ga_XXXXXXXXXX=GS2.1.s1747112596$o1$g1$t1747112684$j0$l0$h0; custodialSession=d081e72c-cdbe-4445-8d19-8f361dcce50c; _ga=GA1.1.1408582263.1746868365", "origin": "https://waypool.net", "referer": "https://waypool.net/dashboard", "priority": "u=3, i", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.4 Safari/605.1.15", "traceparent": "00-ec46ea7410f9ccd655d4ef90ffa991d6-0b71af02c355e68a-01", "content-type": "application/json", "server-timing": "depproxy;dur=1747112842332, pid1req;dur=1747112842346", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br", "accept-language": "es-ES,es;q=0.9", "x-forwarded-for": "217.165.249.14, 34.111.179.208, 35.191.8.103,104.154.113.146", "x-forwarded-host": "waypool.net", "x-replit-user-id": "", "x-wallet-address": "0x07311cb30a4d5faa239db6b55cc1c70879a66385", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "x-cloud-trace-context": "ec46ea7410f9ccd655d4ef90ffa991d6/824632633187493514;o=1", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-05-13T05:07:22.592Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "waypool.net", "origin": "https://waypool.net", "referer": "https://waypool.net/dashboard", "forwardedHost": "waypool.net", "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://waypool.net/api/user/0x07311cb30a4d5faa239db6b55cc1c70879a66385/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-05-13T05:07:22.592Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
1	1	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	terms_of_use	1.0	2025-12-19 12:40:44.627453	172.31.71.194	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-ES,es;q=0.9,en;q=0.8", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Chrome", "isMobile": false, "platform": "macOS", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "screenInfo": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "clientHints": {"model": null, "mobile": "?0", "bitness": null, "platform": "macOS", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "143.0.0.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"dnt": "1", "host": "6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "accept": "*/*", "cookie": "connect.sid=s%3AfxE-HZiPgVBy2BVWBBImTg72ngtPtjc4.MLH5cpY%2BuCsa6qVXukeh9nEsgI8iUste0xvyzw9Qj0s", "origin": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "referer": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/dashboard", "sec-ch-ua": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "content-type": "application/json", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-ES,es;q=0.9,en;q=0.8", "x-forwarded-for": "139.47.119.220, 10.82.5.22", "sec-ch-ua-mobile": "?0", "x-replit-user-id": "", "x-wallet-address": "0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "sec-ch-ua-platform": "\\"macOS\\"", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "sec-fetch-storage-access": "active", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-12-19T12:40:44.535Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "origin": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "referer": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/dashboard", "forwardedHost": null, "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/api/user/0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-12-19T12:40:44.535Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
2	1	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	privacy_policy	1.0	2025-12-19 12:40:44.798655	172.31.71.194	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "UTC", "acceptLanguage": "es-ES,es;q=0.9,en;q=0.8", "connectionType": "proxy", "timezoneOffset": 0}	{"os": "MacOS", "browser": "Chrome", "isMobile": false, "platform": "macOS", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "screenInfo": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "clientHints": {"model": null, "mobile": "?0", "bitness": null, "platform": "macOS", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "143.0.0.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"dnt": "1", "host": "6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "accept": "*/*", "cookie": "connect.sid=s%3AfxE-HZiPgVBy2BVWBBImTg72ngtPtjc4.MLH5cpY%2BuCsa6qVXukeh9nEsgI8iUste0xvyzw9Qj0s", "origin": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "referer": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/dashboard", "sec-ch-ua": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "content-type": "application/json", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-ES,es;q=0.9,en;q=0.8", "x-forwarded-for": "139.47.119.220, 10.82.5.22", "sec-ch-ua-mobile": "?0", "x-replit-user-id": "", "x-wallet-address": "0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f", "x-forwarded-proto": "https", "x-replit-user-bio": "", "x-replit-user-url": "", "sec-ch-ua-platform": "\\"macOS\\"", "x-replit-user-name": "", "x-replit-user-roles": "", "x-replit-user-teams": "", "sec-fetch-storage-access": "active", "x-replit-user-profile-image": ""}, "protocol": "http", "timestamp": "2025-12-19T12:40:44.708Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "UTC", "timezoneOffset": 0, "originVerification": {"host": "6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "origin": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev", "referer": "https://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/dashboard", "forwardedHost": null, "forwardedProto": "https"}, "legalComplianceInfo": {"websiteUrl": "http://6c893567-ba24-48a9-b6e3-3655b04bb04d-00-1rhw0pg4hh0w7.spock.replit.dev/api/user/0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2025-12-19T12:40:44.708Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
4	235	0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6	terms_of_use	1.0	2026-01-17 12:47:29.531811	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "Europe/Madrid", "acceptLanguage": "es-ES,es;q=0.9,en;q=0.8", "connectionType": "proxy", "timezoneOffset": -60}	{"os": "MacOS", "browser": "Chrome", "isMobile": false, "platform": "macOS", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "screenInfo": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "clientHints": {"model": null, "mobile": "?0", "bitness": null, "platform": "macOS", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "143.0.0.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"dnt": "1", "host": "localhost:5000", "accept": "*/*", "cookie": "_ga=GA1.1.184626669.1768650984; _ga_XXXXXXXXXX=GS2.1.s1768650993$o1$g1$t1768654028$j59$l0$h0; _ga_R8LV7N6C04=GS2.1.s1768650983$o1$g1$t1768654034$j53$l0$h0; custodialSession=5e77ba70-51a6-4d46-a1b4-a4c2a4d10120", "origin": "https://waybank.info", "referer": "https://waybank.info/dashboard", "priority": "u=1, i", "sec-ch-ua": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "connection": "close", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "content-type": "application/json", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-ES,es;q=0.9,en;q=0.8", "x-forwarded-for": "67.218.250.49", "sec-ch-ua-mobile": "?0", "x-forwarded-host": "waybank.info", "x-wallet-address": "0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6", "sec-ch-ua-platform": "\\"macOS\\"", "x-forwarded-server": "waybank.info"}, "protocol": "http", "timestamp": "2026-01-17T12:47:29.514Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "Europe/Madrid", "timezoneOffset": -60, "originVerification": {"host": "localhost:5000", "origin": "https://waybank.info", "referer": "https://waybank.info/dashboard", "forwardedHost": "waybank.info", "forwardedProto": null}, "legalComplianceInfo": {"websiteUrl": "http://localhost:5000/api/user/0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2026-01-17T12:47:29.514Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
5	235	0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6	privacy_policy	1.0	2026-01-17 12:47:29.583151	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "Europe/Madrid", "acceptLanguage": "es-ES,es;q=0.9,en;q=0.8", "connectionType": "proxy", "timezoneOffset": -60}	{"os": "MacOS", "browser": "Chrome", "isMobile": false, "platform": "macOS", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "screenInfo": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "clientHints": {"model": null, "mobile": "?0", "bitness": null, "platform": "macOS", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "143.0.0.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"dnt": "1", "host": "localhost:5000", "accept": "*/*", "cookie": "_ga=GA1.1.184626669.1768650984; _ga_XXXXXXXXXX=GS2.1.s1768650993$o1$g1$t1768654028$j59$l0$h0; _ga_R8LV7N6C04=GS2.1.s1768650983$o1$g1$t1768654034$j53$l0$h0; custodialSession=5e77ba70-51a6-4d46-a1b4-a4c2a4d10120", "origin": "https://waybank.info", "referer": "https://waybank.info/dashboard", "priority": "u=1, i", "sec-ch-ua": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "connection": "close", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "content-type": "application/json", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-ES,es;q=0.9,en;q=0.8", "x-forwarded-for": "67.218.250.49", "sec-ch-ua-mobile": "?0", "x-forwarded-host": "waybank.info", "x-wallet-address": "0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6", "sec-ch-ua-platform": "\\"macOS\\"", "x-forwarded-server": "waybank.info"}, "protocol": "http", "timestamp": "2026-01-17T12:47:29.566Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "Europe/Madrid", "timezoneOffset": -60, "originVerification": {"host": "localhost:5000", "origin": "https://waybank.info", "referer": "https://waybank.info/dashboard", "forwardedHost": "waybank.info", "forwardedProto": null}, "legalComplianceInfo": {"websiteUrl": "http://localhost:5000/api/user/0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2026-01-17T12:47:29.566Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
6	235	0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6	disclaimer	1.0	2026-01-17 12:47:29.663384	127.0.0.1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	{"asn": null, "isp": null, "geoIp": {"city": null, "region": null, "country": null, "latitude": null, "continent": null, "longitude": null}, "timezone": "Europe/Madrid", "acceptLanguage": "es-ES,es;q=0.9,en;q=0.8", "connectionType": "proxy", "timezoneOffset": -60}	{"os": "MacOS", "browser": "Chrome", "isMobile": false, "platform": "macOS", "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "screenInfo": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "clientHints": {"model": null, "mobile": "?0", "bitness": null, "platform": "macOS", "architecture": null, "fullVersionList": null}, "colorScheme": null, "deviceMemory": null, "browserVersion": "143.0.0.0", "screenDimensions": {"width": null, "height": null}, "hardwareConcurrency": null}	\N	\N	{"method": "POST", "secure": false, "headers": {"dnt": "1", "host": "localhost:5000", "accept": "*/*", "cookie": "_ga=GA1.1.184626669.1768650984; _ga_XXXXXXXXXX=GS2.1.s1768650993$o1$g1$t1768654028$j59$l0$h0; _ga_R8LV7N6C04=GS2.1.s1768650983$o1$g1$t1768654034$j53$l0$h0; custodialSession=5e77ba70-51a6-4d46-a1b4-a4c2a4d10120", "origin": "https://waybank.info", "referer": "https://waybank.info/dashboard", "priority": "u=1, i", "sec-ch-ua": "\\"Google Chrome\\";v=\\"143\\", \\"Chromium\\";v=\\"143\\", \\"Not A(Brand\\";v=\\"24\\"", "connection": "close", "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36", "content-type": "application/json", "content-length": "58", "sec-fetch-dest": "empty", "sec-fetch-mode": "cors", "sec-fetch-site": "same-origin", "accept-encoding": "gzip, deflate, br, zstd", "accept-language": "es-ES,es;q=0.9,en;q=0.8", "x-forwarded-for": "67.218.250.49", "sec-ch-ua-mobile": "?0", "x-forwarded-host": "waybank.info", "x-wallet-address": "0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6", "sec-ch-ua-platform": "\\"macOS\\"", "x-forwarded-server": "waybank.info"}, "protocol": "http", "timestamp": "2026-01-17T12:47:29.604Z", "sessionInfo": {"sessionId": null, "authMethod": "session", "cookieExists": true}, "timezoneName": "Europe/Madrid", "timezoneOffset": -60, "originVerification": {"host": "localhost:5000", "origin": "https://waybank.info", "referer": "https://waybank.info/dashboard", "forwardedHost": "waybank.info", "forwardedProto": null}, "legalComplianceInfo": {"websiteUrl": "http://localhost:5000/api/user/0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6/legal-acceptance", "companyInfo": {"name": "Elysium Media FZCO", "address": "Premises no. 58510-001, IFZA Business Park, DDP, DUBAI, UAE", "jurisdiction": "Dubai, UAE", "registrationId": "58510"}, "acceptanceDate": "2026-01-17T12:47:29.604Z", "signatureMethod": "explicit_checkbox"}}	\N	\N	\N
\.


--
-- Data for Name: managed_nfts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.managed_nfts (id, network, version, token_id, contract_address, token0_symbol, token1_symbol, value_usdc, status, fee_tier, pool_address, image_url, additional_data, created_at, updated_at, created_by) FROM stdin;
249	polygon	V4	22012	\N	Unknown	Unknown	6000.00	Active	\N	\N	\N	\N	2025-05-29 10:06:54.035	2025-05-29 10:06:54.035	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
250	polygon	V4	22013	\N	Unknown	Unknown	10000.00	Active	\N	\N	\N	\N	2025-05-29 10:08:58.013	2025-05-29 10:08:58.013	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
251	polygon	V4	21843	\N	Unknown	Unknown	21500.00	Active	\N	\N	\N	\N	2025-05-29 13:45:11.558	2025-06-13 12:39:11.34	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
252	polygon	V4	22034	\N	Unknown	Unknown	27000.00	Active	\N	\N	\N	\N	2025-05-29 13:46:04.989	2025-06-13 12:41:46.026	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
253	polygon	V4	23477	\N	Unknown	Unknown	20001.00	Active	\N	\N	\N	\N	2025-06-06 12:09:50.762	2025-06-06 12:09:50.762	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
254	polygon	V4	 208109	\N	Unknown	Unknown	29016.00	Active	\N	\N	\N	\N	2025-06-16 06:47:02.734	2025-07-09 10:39:05.611	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
257	polygon	V4	25424	\N	Unknown	Unknown	0.00	Active	\N	\N	\N	\N	2025-06-17 07:43:18.519	2025-06-17 07:43:32.862	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
258	polygon	V4	25619	\N	Unknown	Unknown	10000.00	Active	\N	\N	\N	\N	2025-06-18 09:27:12.731	2025-06-18 09:27:12.731	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
259	polygon	V4	25617	\N	Unknown	Unknown	10000.00	Active	\N	\N	\N	\N	2025-06-18 09:29:24.57	2025-06-18 09:29:24.57	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
260	polygon	V4	25615	\N	Unknown	Unknown	2000.00	Active	\N	\N	\N	\N	2025-06-19 09:15:04.308	2025-06-19 09:15:04.308	0x0a57b7d48f2b4d8cace0abec9e878c307259b77e
261	polygon	V4	25614	\N	Unknown	Unknown	4500.00	Active	\N	\N	\N	\N	2025-06-19 09:17:05.603	2025-06-19 09:17:05.603	0x0a57b7d48f2b4d8cace0abec9e878c307259b77e
262	polygon	V4	26173	\N	Unknown	Unknown	34075.00	Active	\N	\N	\N	\N	2025-06-20 07:54:50.592	2025-06-20 07:54:50.592	0x0a57b7d48f2b4d8cace0abec9e878c307259b77e
263	polygon	V4	28175	\N	Unknown	Unknown	15000.00	Active	\N	\N	\N	\N	2025-07-01 07:29:07.635	2025-07-01 07:29:07.635	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
264	polygon	V4	29095	\N	Unknown	Unknown	2500.00	Active	\N	\N	\N	\N	2025-07-07 13:30:04.166	2025-07-23 13:06:51.9	0x3d85fda5ea53e190404210a91150a1ddf463741f
265	polygon	V4	29221	\N	Unknown	Unknown	65000.00	Active	\N	\N	\N	\N	2025-07-08 12:49:45.286	2025-07-08 12:49:45.286	0x3d85fda5ea53e190404210a91150a1ddf463741f
266	polygon	V4	29370	\N	Unknown	Unknown	35000.00	Active	\N	\N	\N	\N	2025-07-09 07:42:19.137	2025-07-09 07:42:19.137	0x3d85fda5ea53e190404210a91150a1ddf463741f
267	polygon	V3	21644	\N	Unknown	Unknown	3000.00	Active	\N	\N	\N	\N	2025-07-30 08:24:27.738	2025-07-30 09:14:50.72	0x0a57b7d48f2b4d8cace0abec9e878c307259b77e
268	polygon	V4	1769384	\N	Unknown	Unknown	3800.00	Active	\N	\N	\N	\N	2025-07-30 08:38:01.9	2025-07-30 08:38:01.9	0x0a57b7d48f2b4d8cace0abec9e878c307259b77e
269	polygon	V3	21648	\N	Unknown	Unknown	4000.00	Active	\N	\N	\N	\N	2025-07-30 09:13:54.34	2025-07-30 09:13:54.34	0x3d85fda5ea53e190404210a91150a1ddf463741f
270	polygon	V3	21651	\N	Unknown	Unknown	4000.00	Active	\N	\N	\N	\N	2025-07-30 09:14:05.897	2025-07-30 09:14:05.897	0x3d85fda5ea53e190404210a91150a1ddf463741f
271	unichain	V4	1370104	\N	Unknown	Unknown	18000.00	Active	\N	\N	\N	\N	2025-09-02 09:14:29.507	2025-09-02 09:14:29.507	0x3d85fda5ea53e190404210a91150a1ddf463741f
272	unichain	V4	1406380	\N	Unknown	Unknown	30000.00	Active	\N	\N	\N	\N	2025-09-05 11:47:01.978	2025-09-05 11:47:01.978	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
273	unichain	V4	1406389	\N	Unknown	Unknown	30000.00	Active	\N	\N	\N	\N	2025-09-15 14:08:08.283	2025-09-15 14:08:08.283	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
274	polygon	V4	20481	\N	Unknown	Unknown	3000.00	Active	\N	\N	\N	\N	2025-09-24 07:26:08.424	2025-09-24 07:26:08.424	0x3d85fda5ea53e190404210a91150a1ddf463741f
275	polygon	V4	20480	\N	Unknown	Unknown	3000.00	Active	\N	\N	\N	\N	2025-09-24 07:27:47.651	2025-09-24 07:27:47.651	0x3d85fda5ea53e190404210a91150a1ddf463741f
276	polygon	V4	38783	\N	Unknown	Unknown	22255.00	Active	\N	\N	\N	\N	2025-09-25 13:40:25.301	2025-09-25 13:40:43.01	0x3d85fda5ea53e190404210a91150a1ddf463741f
1	polygon	V3	1889096	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	18000.00	Active	\N	\N	\N	\N	2025-04-10 17:49:57.135	2025-04-14 20:58:13.715	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
2	polygon	V3	2399317	\N	Unknown	Unknown	4036.50	Finalized	\N	\N	\N	\N	2025-04-11 10:31:49.336	2025-04-14 20:53:44.972	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
3	polygon	V3	2410452	\N	Unknown	Unknown	4563.00	Active	\N	\N	\N	\N	2025-04-11 10:32:07.971	2025-06-13 08:35:43.091	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
4	polygon	V3	2411855	\N	Unknown	Unknown	33384.00	Finalized	\N	\N	\N	\N	2025-04-11 10:32:26.553	2025-04-14 20:53:38.078	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
5	polygon	V3	2411793	\N	Unknown	Unknown	49471.50	Active	\N	\N	\N	\N	2025-04-11 10:32:43.51	2025-06-12 11:01:11.685	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
6	polygon	V3	2411787	\N	Unknown	Unknown	27339.00	Active	\N	\N	\N	\N	2025-04-11 10:32:56.665	2025-06-12 11:02:18.73	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
7	polygon	V3	2410468	\N	Unknown	Unknown	20533.50	Finalized	\N	\N	\N	\N	2025-04-11 10:33:09.829	2025-04-14 20:53:13.172	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
8	polygon	V3	2411893	\N	Unknown	Unknown	13396.50	Finalized	\N	\N	\N	\N	2025-04-11 10:33:36.631	2025-04-14 20:53:08.291	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
9	polygon	V3	2397917	\N	Unknown	Unknown	62673.00	Active	\N	\N	\N	\N	2025-04-11 10:34:00.392	2025-05-02 08:06:01.092	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
10	polygon	V3	579082	\N	Unknown	Unknown	163098.00	Active	\N	\N	\N	\N	2025-04-11 10:34:13.771	2025-06-16 06:48:03.607	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
11	polygon	V3	867212	\N	Unknown	Unknown	50000.00	Active	\N	\N	\N	\N	2025-04-11 10:34:25.908	2025-07-08 09:46:05.053	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
12	polygon	V3	1117383	\N	Unknown	Unknown	151866.00	Finalized	\N	\N	\N	\N	2025-04-11 10:34:37.629	2025-04-14 20:52:41.969	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
13	polygon	V4	1091591	\N	Unknown	Unknown	11641.50	Active	\N	\N	\N	\N	2025-04-11 10:34:47.906	2025-07-16 08:41:22.355	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
14	polygon	V4	2428912	\N	Unknown	Unknown	14742.00	Active	\N	\N	\N	\N	2025-04-11 10:34:59.264	2025-07-14 07:53:04.111	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
15	polygon	V3	2428877	\N	Unknown	Unknown	7702.50	Active	\N	\N	\N	\N	2025-04-11 10:35:09.363	2025-06-04 07:59:35.589	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
16	polygon	V3	2434746	\N	Unknown	Unknown	9438.00	Finalized	\N	\N	\N	\N	2025-04-11 10:35:22.124	2025-04-14 20:52:24.256	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
17	polygon	V3	2428878	\N	Unknown	Unknown	10978.50	Finalized	\N	\N	\N	\N	2025-04-11 10:35:33.227	2025-04-14 20:52:19.967	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
18	polygon	V3	2434739	\N	Unknown	Unknown	6688.50	Active	\N	\N	\N	\N	2025-04-11 10:35:45.862	2025-06-25 08:10:13.965	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
19	polygon	V4	2428917	\N	Unknown	Unknown	33559.50	Active	\N	\N	\N	\N	2025-04-11 10:35:59.373	2025-07-09 09:36:35.244	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
20	polygon	V3	2428915	\N	Unknown	Unknown	2398.50	Finalized	\N	\N	\N	\N	2025-04-11 10:36:09.169	2025-04-14 20:52:07.626	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
21	polygon	V3	2431675	\N	Unknown	Unknown	39039.00	Active	\N	\N	\N	\N	2025-04-11 10:36:38.364	2025-06-25 08:24:41.547	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
22	polygon	V4	2428914	\N	Unknown	Unknown	50000.00	Active	\N	\N	\N	\N	2025-04-11 10:36:51.097	2025-07-21 08:05:38.257	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
23	polygon	V3	2427773	\N	Unknown	Unknown	37537.50	Active	\N	\N	\N	\N	2025-04-11 10:37:01.432	2025-06-12 11:40:04.772	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
24	polygon	V3	2431697	\N	Unknown	Unknown	3471.00	Active	\N	\N	\N	\N	2025-04-11 10:37:14.991	2025-05-05 08:07:00.999	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
25	polygon	V4	2428879	\N	Unknown	Unknown	20650.50	Active	\N	\N	\N	\N	2025-04-11 10:37:25.639	2025-07-09 09:45:52.928	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
26	polygon	V4	2427771	\N	Unknown	Unknown	53000.00	Active	\N	\N	\N	\N	2025-04-11 10:37:37.754	2025-09-01 08:52:54.106	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
27	polygon	V3	2431674	\N	Unknown	Unknown	7332.00	Active	\N	\N	\N	\N	2025-04-11 10:37:48.95	2025-06-13 10:18:35.311	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
28	polygon	V3	1948147	\N	Unknown	Unknown	40521.00	Finalized	\N	\N	\N	\N	2025-04-11 10:37:59.299	2025-04-14 20:51:31.863	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
29	polygon	V3	2427742	\N	Unknown	Unknown	80400.00	Active	\N	\N	\N	\N	2025-04-11 10:38:08.655	2025-09-01 08:24:25.068	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
30	polygon	V3	2093191	\N	Unknown	Unknown	10000.00	Active	\N	\N	\N	{"owner": "0xc3a049B80A44312A964197829cb82F24d72ed6C7"}	2025-04-11 10:38:18.417	2025-07-09 13:44:08.585	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
31	polygon	V4	2428881	\N	Unknown	Unknown	14137.50	Active	\N	\N	\N	\N	2025-04-11 10:38:28.96	2025-07-09 09:37:13.213	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
32	polygon	V4	2429190	\N	Unknown	Unknown	1053.00	Active	\N	\N	\N	\N	2025-04-11 10:38:39.21	2025-08-18 08:59:20.644	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
33	polygon	V4	2430145	\N	Unknown	Unknown	13767.00	Active	\N	\N	\N	\N	2025-04-11 10:38:49.403	2025-07-11 10:44:40.072	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
34	polygon	V3	13767	\N	Unknown	Unknown	2184.00	Finalized	\N	\N	\N	\N	2025-04-11 10:39:03.457	2025-04-14 20:51:08.018	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
35	polygon	V3	2434742	\N	Unknown	Unknown	4134.00	Active	\N	\N	\N	\N	2025-04-11 10:39:14.405	2025-06-25 08:41:51.572	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
36	polygon	V4	2431686	\N	Unknown	Unknown	41574.00	Active	\N	\N	\N	\N	2025-04-11 10:39:26.473	2025-07-10 09:51:25.235	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
37	polygon	V3	2434744	\N	Unknown	Unknown	17842.50	Active	\N	\N	\N	\N	2025-04-11 10:39:40.286	2025-05-28 13:43:29.904	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
38	polygon	V3	2430123	\N	Unknown	Unknown	3529.49	Active	\N	\N	\N	\N	2025-04-11 10:39:52.82	2025-09-03 09:12:41.227	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
39	polygon	V3	2392217	\N	Unknown	Unknown	30000.00	Active	\N	\N	\N	\N	2025-04-11 10:40:03.177	2025-07-04 09:44:13.756	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
40	polygon	V3	2428884	\N	Unknown	Unknown	15249.00	Active	\N	\N	\N	\N	2025-04-11 10:40:14.251	2025-05-19 10:25:03.727	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
41	polygon	V3	2436086	\N	Unknown	Unknown	27066.00	Finalized	\N	\N	\N	\N	2025-04-11 10:40:25.421	2025-04-14 20:50:40.06	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
42	polygon	V3	2428846	\N	Unknown	Unknown	6786.00	Finalized	\N	\N	\N	\N	2025-04-11 10:40:36.275	2025-04-14 20:50:36.051	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
43	polygon	V3	2431677	\N	Unknown	Unknown	10276.50	Active	\N	\N	\N	\N	2025-04-11 10:40:46.694	2025-06-17 07:39:47.32	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
44	polygon	V3	2431681	\N	Unknown	Unknown	7254.00	Active	\N	\N	\N	\N	2025-04-11 10:40:57.645	2025-06-20 09:28:27.739	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
45	polygon	V3	2430124	\N	Unknown	Unknown	22971.00	Finalized	\N	\N	\N	\N	2025-04-11 10:41:09.122	2025-04-14 20:50:25.029	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
46	polygon	V4	2428913	\N	Unknown	Unknown	40696.50	Active	\N	\N	\N	\N	2025-04-11 10:41:21.429	2025-07-14 09:00:26.973	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
47	polygon	V3	2430144	\N	Unknown	Unknown	163741.50	Active	\N	\N	\N	\N	2025-04-11 10:41:32.3	2025-05-27 07:44:51.005	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
48	polygon	V3	2431689	\N	Unknown	Unknown	18973.50	Active	\N	\N	\N	\N	2025-04-11 10:41:43.257	2025-06-25 08:33:01.723	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
49	polygon	V3	2391793	\N	Unknown	Unknown	5000.00	Active	\N	\N	\N	\N	2025-04-11 10:41:53.665	2025-07-04 09:32:14.089	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
50	polygon	V4	2430130	\N	Unknown	Unknown	1053.00	Active	\N	\N	\N	\N	2025-04-11 10:42:04.175	2025-08-18 08:59:01.025	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
51	polygon	V3	2428839	\N	Unknown	Unknown	24102.00	Active	\N	\N	\N	\N	2025-04-11 10:42:14.997	2025-05-26 08:11:09.064	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
52	polygon	V3	2428841	\N	Unknown	Unknown	42432.00	Finalized	\N	\N	\N	\N	2025-04-11 10:42:31.681	2025-04-14 20:49:53.211	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
53	polygon	V4	2428919	\N	Unknown	Unknown	23868.00	Active	\N	\N	\N	\N	2025-04-11 10:42:43.335	2025-07-14 09:37:49.986	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
54	polygon	V3	2429186	\N	Unknown	Unknown	16497.00	Finalized	\N	\N	\N	\N	2025-04-11 10:42:54.02	2025-04-14 20:49:44.101	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
55	polygon	V3	2436090	\N	Unknown	Unknown	5245.50	Active	\N	\N	\N	\N	2025-04-11 10:43:04.541	2025-06-13 07:52:16.321	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
56	polygon	V3	2436091	\N	Unknown	Unknown	5245.50	Active	\N	\N	\N	\N	2025-04-11 10:43:14.979	2025-06-13 07:50:14.114	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
57	polygon	V3	2434747	\N	Unknown	Unknown	27261.00	Finalized	\N	\N	\N	\N	2025-04-11 10:43:25.445	2025-04-14 20:49:30.568	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
58	polygon	V4	2436094	\N	Unknown	Unknown	6747.00	Active	\N	\N	\N	\N	2025-04-11 10:43:35.027	2025-07-11 08:27:52.387	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
59	polygon	V3	2436093	\N	Unknown	Unknown	3646.50	Finalized	\N	\N	\N	\N	2025-04-11 10:43:46.978	2025-04-14 20:49:21.585	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
60	polygon	V3	2436087	\N	Unknown	Unknown	3646.50	Finalized	\N	\N	\N	\N	2025-04-11 10:43:57.205	2025-04-14 20:49:16.455	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
61	polygon	V3	2235544	\N	Unknown	Unknown	2827.50	Finalized	\N	\N	\N	\N	2025-04-11 10:44:11.059	2025-04-14 20:49:10.916	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
62	polygon	V4	2269099	\N	Unknown	Unknown	6532.50	Active	\N	\N	\N	\N	2025-04-11 10:44:22.526	2025-07-11 08:23:34.362	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
63	polygon	V3	389976	\N	Unknown	Unknown	18876.00	Finalized	\N	\N	\N	\N	2025-04-11 10:44:33.304	2025-04-14 20:49:01.61	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
64	polygon	V3	389946	\N	Unknown	Unknown	22561.50	Finalized	\N	\N	\N	\N	2025-04-11 10:44:43.918	2025-04-14 20:48:56.647	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
65	polygon	V3	395089	\N	Unknown	Unknown	4134.00	Finalized	\N	\N	\N	\N	2025-04-11 10:44:56.334	2025-04-14 20:48:51.704	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
66	polygon	V3	395355	\N	Unknown	Unknown	76342.50	Finalized	\N	\N	\N	\N	2025-04-11 10:45:07.248	2025-04-14 20:48:47.506	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
67	polygon	V3	394945	\N	Unknown	Unknown	15000.00	Active	\N	\N	\N	\N	2025-04-11 10:45:17.533	2025-09-04 07:06:38.439	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
68	polygon	V3	390157	\N	Unknown	Unknown	26988.00	Finalized	\N	\N	\N	\N	2025-04-11 10:45:28.258	2025-04-14 20:48:38.522	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
69	polygon	V3	2219478	\N	Unknown	Unknown	7078.50	Finalized	\N	\N	\N	\N	2025-04-11 10:45:37.74	2025-04-14 20:48:33.759	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
70	polygon	V4	2081092	\N	Unknown	Unknown	29016.00	Active	\N	\N	\N	\N	2025-04-11 10:45:48.333	2025-07-09 13:43:37.84	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
71	polygon	V3	2081123	\N	Unknown	Unknown	66066.00	Finalized	\N	\N	\N	\N	2025-04-11 10:45:58.635	2025-04-14 20:48:22.604	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
72	polygon	V4	2467310	\N	Unknown	Unknown	12226.50	Active	\N	\N	\N	\N	2025-04-11 10:46:10.119	2025-07-09 10:42:33.614	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
73	polygon	V3	2467314	\N	Unknown	Unknown	63628.50	Finalized	\N	\N	\N	\N	2025-04-11 10:46:21.329	2025-04-14 20:48:14.698	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
74	polygon	V3	2467316	\N	Unknown	Unknown	137358.00	Finalized	\N	\N	\N	\N	2025-04-11 10:46:32.301	2025-04-14 20:48:09.087	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
75	polygon	V3	2432374	\N	Unknown	Unknown	26988.00	Finalized	\N	\N	\N	\N	2025-04-11 10:46:44.079	2025-04-14 20:48:03.395	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
76	polygon	V3	2431426	\N	Unknown	Unknown	17511.00	Finalized	\N	\N	\N	\N	2025-04-11 10:46:54.97	2025-04-14 20:47:58.985	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
77	polygon	V3	2431187	\N	Unknown	Unknown	6708.00	Finalized	\N	\N	\N	\N	2025-04-11 10:47:05.512	2025-04-14 20:47:53.559	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
78	polygon	V3	2467320	\N	Unknown	Unknown	1365.00	Finalized	\N	\N	\N	\N	2025-04-11 10:47:16.527	2025-04-14 20:47:47.997	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
79	polygon	V3	2410464	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:39:23.012	2025-04-14 13:39:23.012	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
80	polygon	V3	2410359	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:40:15.959	2025-04-14 13:40:15.959	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
81	polygon	V3	1215547	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:40:36.03	2025-04-14 13:40:36.03	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
82	polygon	V3	2391945	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:41:02.431	2025-04-14 13:41:02.431	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
83	polygon	V3	2380719	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:41:14.777	2025-04-14 13:41:14.777	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
84	polygon	V3	1455750	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:41:27.383	2025-04-14 13:41:27.383	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
85	polygon	V3	2431161	\N	Unknown	Unknown	20000.00	Active	\N	\N	\N	\N	2025-04-14 13:42:25.126	2025-09-08 14:29:11.743	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
86	polygon	V3	961602	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:42:36.633	2025-04-14 13:42:36.633	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
87	polygon	V3	578883	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-14 13:42:54.221	2025-04-14 20:47:43.265	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
88	polygon	V3	579293	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:43:07.126	2025-04-14 13:43:07.126	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
89	polygon	V3	578780	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:43:28.146	2025-04-14 13:43:28.146	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
90	polygon	V3	2137059	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:43:47.656	2025-04-14 13:43:47.656	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
91	polygon	V3	2137062	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:44:02.511	2025-04-14 13:44:02.511	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
92	polygon	V3	2188996	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:44:14.524	2025-04-14 13:44:14.524	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
93	polygon	V3	84515	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:44:28.734	2025-05-27 08:17:38.345	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
94	polygon	V3	1092909	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:44:59.926	2025-04-14 13:44:59.926	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
95	polygon	V3	1456257	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:45:14.336	2025-04-14 13:45:14.336	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
96	polygon	V3	2431180	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:45:26.739	2025-04-14 13:45:26.739	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
97	polygon	V3	2431419	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:45:39.877	2025-04-14 13:45:39.877	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
98	polygon	V3	345263	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:45:51.685	2025-04-14 13:45:51.685	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
99	polygon	V3	514413	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:46:03.187	2025-05-06 11:46:43.713	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
100	polygon	V3	704317	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:46:24.643	2025-04-14 13:46:24.643	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
101	polygon	V4	812705	\N	Unknown	Unknown	10000.00	Active	\N	\N	\N	\N	2025-04-14 13:46:35.922	2025-07-29 11:23:35.031	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
102	polygon	V4	976349	\N	Unknown	Unknown	5098.54	Active	\N	\N	\N	\N	2025-04-14 13:46:48.837	2025-07-09 09:41:30.784	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
103	polygon	V3	1954815	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:47:01.31	2025-04-14 13:47:01.31	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
104	polygon	V3	2429192	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:48:55.355	2025-04-14 13:48:55.355	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
105	polygon	V4	2430142	\N	Unknown	Unknown	2464.00	Active	\N	\N	\N	\N	2025-04-14 13:49:24.729	2025-07-22 09:26:22.471	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
106	polygon	V4	2428918	\N	Unknown	Unknown	0.00	Active	\N	\N	\N	\N	2025-04-14 13:50:51.765	2025-07-22 09:12:28.518	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
107	polygon	V3	2436092	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:52:10.007	2025-04-14 13:52:10.007	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
108	polygon	V3	2081090	\N	Unknown	Unknown	1100.00	Finalized	\N	\N	\N	\N	2025-04-14 13:53:21.857	2025-04-14 20:47:32.699	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
109	polygon	V3	2081119	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:54:13.863	2025-04-14 13:54:13.863	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
110	polygon	V3	2081108	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:54:32.962	2025-04-14 13:54:32.962	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
111	polygon	V3	2081110	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:54:44.368	2025-04-14 13:54:44.368	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
112	polygon	V3	2081112	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:54:56.869	2025-04-14 13:54:56.869	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
113	polygon	V3	2081103	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:55:08.895	2025-04-14 13:55:08.895	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
115	polygon	V3	2081093	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:55:38.374	2025-04-14 13:55:38.374	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
116	polygon	V4	2081105	\N	Unknown	Unknown	100.00	Active	\N	\N	\N	\N	2025-04-14 13:55:49.887	2025-07-29 07:51:31.737	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
117	polygon	V3	2081102	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:56:03.939	2025-04-14 13:56:03.939	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
118	polygon	V4	2067959	\N	Unknown	Unknown	28500.00	Active	\N	\N	\N	\N	2025-04-14 13:56:15.95	2025-07-09 10:39:52.242	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
119	polygon	V3	2189004	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:56:28.412	2025-04-14 13:56:28.412	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
121	polygon	V3	2467319	\N	Unknown	Unknown	2750.00	Finalized	\N	\N	\N	\N	2025-04-14 13:57:00.59	2025-04-14 20:47:28.2	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
122	polygon	V3	2437754	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 13:57:47.516	2025-04-14 13:57:47.516	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
123	polygon	V4	14479	\N	Unknown	Unknown	96021.00	Active	\N	\N	\N	\N	2025-04-14 14:22:52.196	2025-05-16 10:10:10.554	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
124	polygon	V4	13749	\N	Unknown	Unknown	10775.00	Active	\N	\N	\N	\N	2025-04-14 14:23:30.772	2025-04-16 11:02:02.769	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
125	polygon	V4	13748	\N	Unknown	Unknown	11061.00	Active	\N	\N	\N	\N	2025-04-14 14:23:53.89	2025-04-16 11:18:18.411	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
129	polygon	V4	13744	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:25:38.255	2025-04-14 14:25:38.255	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
130	polygon	V4	13743	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:25:54.205	2025-04-14 14:25:54.205	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
131	polygon	V4	13742	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:26:13.275	2025-04-14 14:26:13.275	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
132	polygon	V4	13741	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:26:35.77	2025-04-14 14:26:35.77	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
133	polygon	V4	13740	\N	Unknown	Unknown	24000.00	Active	\N	\N	\N	\N	2025-04-14 14:26:55.244	2025-04-16 10:29:50.403	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
134	polygon	V3	2437760	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:28:04.359	2025-04-14 14:28:04.359	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
135	polygon	V3	6781	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:31:18.467	2025-04-14 14:31:18.467	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
136	polygon	V4	3696	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:31:45.094	2025-04-14 14:31:45.094	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
137	polygon	V4	3690	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:32:06.561	2025-04-14 14:32:06.561	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
138	polygon	V3	1460263	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:38:42.676	2025-04-14 14:38:42.676	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
139	polygon	V3	2427747	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:39:20.78	2025-04-14 14:39:20.78	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
140	polygon	V3	2081122	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:42:12.968	2025-04-14 14:42:12.968	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
141	polygon	V3	1571303	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:42:32.076	2025-04-14 14:42:32.076	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
142	polygon	V3	1017837	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:42:55.926	2025-04-14 14:42:55.926	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
143	polygon	V3	2153083	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:46:40.502	2025-04-14 14:46:40.502	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
144	polygon	V3	2067981	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:46:59.958	2025-04-14 14:46:59.959	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
145	polygon	V4	3685	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:47:21.145	2025-04-14 14:47:21.145	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
146	polygon	V4	2971	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:47:41.517	2025-04-14 14:47:41.517	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
147	polygon	V4	2640	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:48:03.569	2025-04-14 14:48:03.569	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
148	polygon	V3	2263784	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:48:50.096	2025-04-14 14:48:50.096	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
149	polygon	V3	2326573	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:49:11.529	2025-04-14 14:49:11.529	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
150	polygon	V3	2326578	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:49:28.502	2025-04-14 14:49:28.502	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
151	polygon	V3	2337497	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:49:57.997	2025-04-14 14:49:57.997	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
152	polygon	V3	2394664	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:50:24.328	2025-04-14 14:50:24.328	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
153	polygon	V3	2263774	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:50:44.832	2025-04-14 14:50:44.832	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
154	polygon	V3	2250787	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:51:06.338	2025-04-14 14:51:06.338	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
155	polygon	V3	2203184	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:51:28.335	2025-04-14 14:51:28.335	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
156	polygon	V3	2158203	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:51:53.082	2025-04-14 14:51:53.082	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
157	polygon	V3	2158201	\N	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:52:15.351	2025-04-14 14:52:15.351	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
158	polygon	V3	2153153	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 14:52:52.098	2025-04-14 15:03:12.539	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
159	polygon	V3	2153076	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:07:10.526	2025-04-14 15:07:10.526	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
160	polygon	V3	2152940	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:07:44.159	2025-04-14 15:07:44.159	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
161	polygon	V3	2151771	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:08:27.255	2025-04-14 15:08:27.255	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
162	polygon	V3	2151759	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:08:54.228	2025-04-14 15:08:54.228	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
163	polygon	V3	1878045	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:09:23.726	2025-04-14 15:09:23.726	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
164	polygon	V3	1878057	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:10:02.275	2025-04-14 15:10:02.275	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
165	polygon	V3	1878064	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:10:30.576	2025-04-14 15:10:30.576	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
166	polygon	V3	1879711	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:11:02.035	2025-04-14 15:11:02.035	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
167	polygon	V3	1877644	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:12:15.324	2025-04-14 15:12:15.324	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
168	polygon	V3	1877638	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:14:32.632	2025-04-14 15:14:32.632	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
169	polygon	V3	1821517	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:15:04.789	2025-04-14 15:15:04.789	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
170	polygon	V3	1878019	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:15:33.137	2025-04-14 15:15:33.137	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
171	polygon	V3	1878016	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:15:57.918	2025-04-14 15:15:57.918	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
172	polygon	V3	1878009	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:16:27.598	2025-04-14 15:16:27.598	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
173	polygon	V3	1877992	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:16:50.002	2025-04-14 15:16:50.002	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
174	polygon	V3	1877934	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:17:19.08	2025-04-14 15:17:19.08	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
175	polygon	V3	1877958	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:17:46.166	2025-04-14 15:17:46.166	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
176	polygon	V3	1877984	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:18:11.43	2025-04-14 15:18:11.43	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
177	polygon	V3	1877990	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Unknown	\N	\N	\N	\N	2025-04-14 15:18:35.685	2025-04-14 15:18:35.685	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
178	polygon	V3	1808174	0xc36442b4a4522e871399cd717abdd847ab11fe88	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-14 15:19:01.793	2025-04-14 20:47:05.313	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
179	polygon	V3	1877634	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:11:57.303	2025-04-15 09:11:57.303	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
180	polygon	V3	1877628	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:12:17.786	2025-04-15 09:12:17.786	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
181	polygon	V3	1807573	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:12:34.722	2025-04-15 09:12:34.722	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
182	polygon	V3	1877929	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:12:52.401	2025-04-15 09:12:52.401	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
183	polygon	V3	1877925	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:13:11.797	2025-04-15 09:13:11.797	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
184	polygon	V3	1877920	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:13:26.757	2025-04-15 09:13:26.757	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
185	polygon	V3	1877914	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:13:46.185	2025-04-15 09:13:46.185	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
186	polygon	V3	1877858	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:15:27.843	2025-04-15 09:15:27.843	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
187	polygon	V3	1877869	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:15:42.788	2025-04-15 09:15:42.788	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
188	polygon	V3	1877882	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:17:07.603	2025-04-15 09:17:07.603	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
189	polygon	V3	1877907	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:17:25.69	2025-04-15 09:17:25.69	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
190	polygon	V3	1804978	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:17:41.928	2025-04-15 09:17:41.928	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
191	polygon	V3	1877626	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:18:12.238	2025-04-15 09:18:12.238	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
192	polygon	V3	1877623	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:18:28.996	2025-04-15 09:18:28.996	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
193	polygon	V3	1801347	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:18:43.619	2025-04-15 09:18:43.619	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
194	polygon	V3	1877849	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:19:00.613	2025-04-15 09:19:00.613	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
195	polygon	V3	1877846	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:19:22.213	2025-04-15 09:19:22.213	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
196	polygon	V3	1877841	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:19:37.88	2025-04-15 09:19:37.88	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
197	polygon	V3	1877835	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:19:56.004	2025-04-15 09:19:56.004	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
198	polygon	V3	1877764	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:20:42.255	2025-04-15 09:20:42.255	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
199	polygon	V3	1877789	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:20:59.5	2025-04-15 09:20:59.5	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
200	polygon	V3	1877805	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:21:16.51	2025-04-15 09:21:16.51	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
201	polygon	V3	1877824	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:21:34.012	2025-04-15 09:21:34.012	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
202	polygon	V3	1799969	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:21:49.592	2025-04-15 09:21:49.592	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
203	polygon	V3	1877615	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:22:07.787	2025-04-15 09:22:07.787	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
204	polygon	V3	1877604	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:22:23.431	2025-04-15 09:22:23.431	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
205	polygon	V3	1794722	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:22:39.006	2025-04-15 09:22:39.006	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
206	polygon	V3	1877728	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:22:53.036	2025-04-15 09:22:53.036	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
207	polygon	V3	1877723	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:23:10.435	2025-04-15 09:23:10.435	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
208	polygon	V3	1877710	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:23:23.046	2025-04-15 09:23:23.046	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
209	polygon	V3	1877707	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:24:34.025	2025-04-15 09:24:34.025	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
210	polygon	V3	1877597	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:24:50.531	2025-04-15 09:24:50.531	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
211	polygon	V3	1877700	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:25:09.398	2025-04-15 09:25:09.398	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
212	polygon	V3	1877697	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:25:23.534	2025-04-15 09:25:23.534	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
213	polygon	V3	1877654	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:25:42.948	2025-04-15 09:25:42.948	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
214	polygon	V3	1877550	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:25:59.545	2025-04-15 09:25:59.545	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
215	polygon	V3	1785001	\N	Unknown	Unknown	0.00	Finalized	\N	\N	\N	\N	2025-04-15 09:26:33.112	2025-04-15 09:26:33.112	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
219	polygon	V3	397433	\N	Unknown	Unknown	71000.00	Active	\N	\N	\N	\N	2025-04-24 15:39:21.736	2025-04-25 10:47:47.095	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
228	polygon	V4	17989	\N	Unknown	Unknown	10000.00	Active	\N	\N	\N	\N	2025-05-06 08:02:17.217	2025-05-06 08:02:17.217	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
229	polygon	V4	18003	\N	Unknown	Unknown	100.00	Active	\N	\N	\N	\N	2025-05-06 10:18:13.291	2025-05-06 10:18:13.291	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
230	polygon	V4	18008	\N	Unknown	Unknown	51980.00	Active	\N	\N	\N	\N	2025-05-06 11:30:48.948	2025-05-06 11:30:48.948	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
231	polygon	V4	18149	\N	Unknown	Unknown	30000.00	Active	\N	\N	\N	\N	2025-05-07 12:42:12.967	2025-05-07 12:42:12.967	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
232	polygon	V4	18592	\N	Unknown	Unknown	2000.00	Active	\N	\N	\N	\N	2025-05-09 09:05:18.241	2025-05-09 09:05:18.241	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
233	polygon	V4	18007	\N	Unknown	Unknown	40768.35	Active	\N	\N	\N	\N	2025-05-16 10:10:51.42	2025-05-16 10:10:51.42	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
234	polygon	V4	19924	\N	Unknown	Unknown	100000.00	Active	\N	\N	\N	\N	2025-05-16 10:23:14.277	2025-05-16 10:23:14.277	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
235	polygon	V4	14476	\N	Unknown	Unknown	96021.00	Active	\N	\N	\N	\N	2025-05-16 10:30:45.282	2025-05-16 10:30:45.282	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
237	polygon	V4	13747	\N	Unknown	Unknown	0.00	Active	\N	\N	\N	\N	2025-05-20 07:38:33.308	2025-05-20 07:38:33.308	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
238	polygon	V4	13746	\N	Unknown	Unknown	0.00	Active	\N	\N	\N	\N	2025-05-20 07:41:43.868	2025-05-20 07:41:43.868	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
239	polygon	V4	13745	\N	Unknown	Unknown	0.00	Active	\N	\N	\N	\N	2025-05-20 07:45:00.667	2025-05-20 07:45:00.667	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
240	polygon	V4	20483	\N	Unknown	Unknown	3000.00	Active	\N	\N	\N	\N	2025-05-20 09:40:07.179	2025-05-20 09:40:07.179	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
242	unichain	V4	277909	\N	Unknown	Unknown	0.00	Active	\N	\N	\N	\N	2025-05-23 16:00:05.411	2025-05-23 16:00:05.411	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
243	polygon	V4	21622	\N	Unknown	Unknown	10000.00	Active	\N	\N	\N	\N	2025-05-27 07:30:12.948	2025-05-27 07:30:12.948	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
244	polygon	V4	21621	\N	Unknown	Unknown	160000.00	Active	\N	\N	\N	\N	2025-05-27 07:30:50.747	2025-05-27 07:30:50.747	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
245	polygon	V4	21634	\N	Unknown	Unknown	3000.00	Active	\N	\N	\N	\N	2025-05-27 09:34:59.283	2025-05-27 09:34:59.283	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
246	polygon	V4	21824	\N	Unknown	Unknown	2000.00	Active	\N	\N	\N	\N	2025-05-28 12:00:07.894	2025-05-28 12:00:07.894	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
247	polygon	V4	20490	\N	Unknown	Unknown	7000.00	Active	\N	\N	\N	\N	2025-05-29 09:59:55.3	2025-05-29 09:59:55.3	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
248	polygon	V4	22011	\N	Unknown	Unknown	10000.00	Active	\N	\N	\N	\N	2025-05-29 10:02:17.665	2025-05-29 10:02:17.665	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f
\.


--
-- Data for Name: podcasts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.podcasts (id, title, description, audio_url, language, duration, file_size, audio_type, category, tags, transcript, thumbnail_url, published_date, active, featured, download_count, play_count, created_at, updated_at, created_by) FROM stdin;
4	Nuevo Podcast Test Final	Descripción del nuevo podcast	/podcast/audio/episode1.wav	en	1225	50000000	wav	DeFi	{Uniswap,WayPool,DeFi}	Transcripción del podcast	/podcast/episode1.jpg	\N	t	f	0	0	2025-05-24 17:22:32.894542	2025-05-24 17:26:14.086519	admin
1	Introduction to WayPool Algorithmic Liquidity Management - UPDATED	Updated description	/podcast/audio/episode1.wav	en	1890	75000000	wav	DeFi	{Uniswap,WayPool,DeFi}	Updated transcript	/podcast/episode1.jpg	\N	t	t	0	0	2025-05-24 15:08:37.679191	2025-05-24 17:26:33.7871	system
\.


--
-- Data for Name: position_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.position_history (id, wallet_address, token_id, pool_address, pool_name, token0, token1, token0_decimals, token1_decimals, token0_amount, token1_amount, liquidity_added, tx_hash, deposited_usdc, "timestamp", timeframe, status, apr, fees_earned, lower_price, upper_price, in_range, data, nft_token_id, network, start_date, end_date, range_width, impermanent_loss_risk, fees_collected, total_fees_collected, fee_collection_status, last_collection_date, contract_address, fee, closed_date, payment_status, token_pair, nft_url, last_updated, payment_intent_id, contract_duration) FROM stdin;
20	0xa9e74ad8fe43859411184f7c887ea9964100505b	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3538.17	0	\N	\N	3538.17	2025-04-04 15:44:16.863	365	Active	102.60	0.00	0.00000000	0.00000000	t	\N	2437754	polygon	2025-04-14 13:06:08.677	2026-04-14 13:06:08.677	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
22	0xa9e74ad8fe43859411184f7c887ea9964100505b	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	10000	0	\N	\N	10000.00	2025-04-04 15:58:26.399	365	Active	102.60	0.00	0.00000000	0.00000000	t	\N	2437754	polygon	2025-04-14 12:59:25.361	2026-04-14 12:59:25.361	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
92	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	\N	0x99ac8ca7087fa4a2a1fb6357269965a2014abc35	WBTC/USDC	WBTC	USDC	18	6	9000	5.101512075743715	\N	\N	18000.00	2025-04-24 14:17:19.463	365	Active	32.14	1080.54	0.00000000	0.00000000	t	\N	\N	polygon	2025-11-10 15:06:43.744	2024-05-25 00:00:00	±20%	Medium	8949.24	8949.24	Active	2025-05-11 20:16:48.562	\N	\N	\N	\N	\N	\N	\N	\N	365
103	0x8aaa8b6e3385333b1753c4075111996ceb150644	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1746524937780	100.00	2025-05-06 09:48:58.058	365	Active	51.64	24.21	0.32000000	0.64000000	t	\N	18003	polygon	2025-05-06 10:19:33.35	2026-05-06 10:19:33.35	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
116	0xe0dd4c3aeeb6642eccf29dc6fc464fa60ffd0452	2431161	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	10000	3.819258662280071	\N	\N	20000.00	2025-09-08 14:29:11.885	365	Active	50.00	1.28	0.00000000	0.00000000	t	\N	2431161	polygon	2025-05-12 08:04:28.485	2026-05-12 08:04:28.485	±10%	High	7560.00	7560.00	Active	2025-05-12 08:04:28.485	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/ETH	\N	\N	\N	365
117	0xfc065ed0904e750c18288060bab3af32e855d307	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	bank-447bc890	107670.00	2025-05-13 12:04:11.604	365	Finalized	0.00	3053.73	0.32000000	0.64000000	t	\N		ethereum	2025-05-13 12:04:10.547	2026-05-13 12:04:10.547	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
118	0x3370201c0ac55184a23a330b363002cbd8579c90	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	3000	1.17382005469491	\N	\N	5670.00	2025-07-09 10:42:33.679	365	Active	50.00	1450.57	0.00000000	0.00000000	t	\N	2467310	polygon	2025-05-15 00:00:00	2026-05-15 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/WETH	\N	\N	\N	365
121	0xfc065ed0904e750c18288060bab3af32e855d307	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	4925.67	1.9875253783953546	\N	\N	9851.34	2025-05-17 13:27:12.539	365	Finalized	0.00	124.71	0.00000000	0.00000000	t	\N		polygon	2025-05-17 00:00:00	2026-05-17 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
122	0x1810d6d068eaf1ed3f9503b7ffb04c630e07f820	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	WETH	6	18	8750	3.6541123066047474	\N	\N	10000.00	2025-05-19 10:25:03.797	365	Active	9.44	422.66	0.00000000	0.00000000	t	\N	2428884	polygon	2025-05-19 00:00:00	2026-05-19 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.05%	\N	\N	USDC/WETH	\N	\N	\N	365
124	0x8aaa8b6e3385333b1753c4075111996ceb150644	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1747733092272	3000.00	2025-05-20 09:25:19.682	365	Active	61.43	793.34	0.32000000	0.64000000	t	\N	20483	polygon	2025-05-20 09:33:41.973	2026-05-20 09:33:41.973	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3	\N	\N	USDC/ETH	\N	\N	\N	365
130	0x07311cb30a4d5faa239db6b55cc1c70879a66385	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	bank-dfaacf05	10000.00	2025-05-27 07:11:12.404	365	Active	28.45	69.47	0.32000000	0.64000000	t	\N		polygon	2025-05-27 07:13:33.297	2026-05-27 07:13:33.297	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
138	0x1f14c21f686d1b4268b084929502859ee05e8119	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1000	0.3787853607841327	\N	\N	5750.00	2025-05-27 09:19:54.993	1825	Active	36.58	1002.49	0.00000000	0.00000000	t	\N	21634	polygon	2025-05-27 00:00:00	2030-05-26 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
107	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	15000	8.180211315309021	\N	\N	30000.00	2025-05-07 12:36:41.005	365	Active	34.60	0.02	0.00000000	0.00000000	t	\N		polygon	2025-11-06 16:30:26.95	2025-08-05 00:00:00	±10%	High	5223.75	5223.75	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
120	0xe19adf4350a59dca68013e28cf41e7fcae051b95	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	50000	19.51215222723955	\N	\N	100000.00	2025-05-16 08:34:22.575	365	Active	88.00	54187.31	0.00000000	0.00000000	t	\N	19924	polygon	2025-05-16 00:00:00	2026-05-16 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
102	0xad4474df3230a95a39d9937ab0ad91113972204a	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5000	2.768357527312155	\N	\N	10000.00	2025-05-06 07:41:35.982	365	Active	50.10	0.04	0.00000000	0.00000000	t	\N		polygon	2025-11-13 09:54:50.459	2025-10-29 07:44:26.605	±10%	High	3028.20	3028.20	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
114	0x8aaa8b6e3385333b1753c4075111996ceb150644	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1746780430399	2000.00	2025-05-09 08:47:18.316	365	Active	38.95	358.87	0.32000000	0.64000000	t	\N		polygon	2025-05-09 09:02:14.053	2025-06-08 08:47:10.399	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
144	0x0bd58ac07642fbc4562e5d107b353ae5fa65c8f1	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	bank-363deb4b	7000.00	2025-05-29 09:27:53.864	365	Active	66.10	2.62	0.32000000	0.64000000	t	\N	20490	polygon	2025-05-29 09:43:26.242	2026-05-29 09:43:26.242	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
146	0xd268039ced2a505a1711089da83e464a95d2856a	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	bank-5cec362a	6000.00	2025-05-29 09:36:58.484	365	Active	62.10	0.34	0.32000000	0.64000000	t	\N	22012	polygon	2025-05-29 09:43:39.817	2026-05-29 09:43:39.817	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
147	0x75470ca3fd1da06d93a9bd91981e6824e7be2391	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	bank-e91be7f2	10000.00	2025-05-29 09:39:04.783	365	Active	62.10	0.57	0.32000000	0.64000000	t	\N	22011	polygon	2025-05-29 09:43:01.643	2026-05-29 09:43:01.643	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
148	0x7de2eb01f97b2326c6b679354f262526358ef759	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	bank-73d439df	10000.00	2025-05-29 09:41:35.129	365	Active	62.10	0.58	0.32000000	0.64000000	t	\N	22013	polygon	2025-05-29 09:43:16.206	2026-05-29 09:43:16.206	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
164	0x83b313772e40c2fbda47e1849abeae68dc6894e8	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	11750	4.30597661292435	\N	\N	23500.00	2025-06-12 11:45:54.023	365	Pending	33.15	1509.91	0.00000000	0.00000000	t	\N	2427773	polygon	2025-06-12 00:00:00	2026-06-12 00:00:00	±10%	High	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
172	0x4c914790ea45f39ff3d76456815acb7bdd06c318	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3000	1.191275068876522	\N	\N	6000.00	2025-06-13 10:30:03.304	365	Active	9.44	167.03	0.00000000	0.00000000	t	\N	2431674	polygon	2025-06-13 00:00:00	2026-06-13 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
174	0xa7f4137db52d5a4af26bc7f5f7e153b697f62828	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3423.5	1.3407758416436406	\N	\N	6847.00	2025-06-13 12:10:24.928	365	Finalized	0.00	0.00	0.00000000	0.00000000	t	\N		ethereum	2025-06-13 00:00:00	2026-06-13 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
173	0x7d7fc32793b94d05fcaa7e50e7ba531111c96f16	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2250	0.8877463981098535	\N	\N	4500.00	2025-06-13 11:08:45.691	365	Active	32.00	258.09	0.00000000	0.00000000	t	\N	25614	polygon	2025-09-12 09:06:50.106	2025-09-11 11:36:01.251	±10%	High	358.60	358.60	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
151	0x4f8b21e63469525749e2bd4246bec01e6a1b9220	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3500	1.301726320908988	\N	\N	7000.00	2025-05-29 13:35:01.78	365	Active	66.00	70.89	0.00000000	0.00000000	t	\N	22084	polygon	2025-10-09 22:50:43.119	2025-10-07 20:20:44.372	±10%	High	2229.47	2229.47	Active	2025-07-08 10:27:11.226	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
154	0xe19adf4350a59dca68013e28cf41e7fcae051b95	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	0.5	0.00019949538042698085	\N	\N	20001.00	2025-06-02 08:49:53.604	365	Active	56.00	6375.24	0.00000000	0.00000000	t	\N		polygon	2025-06-02 00:00:00	2026-06-02 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
157	0xc3a049b80a44312a964197829cb82f24d72ed6c7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	8954.24	3.4091527208648906	\N	\N	10000.00	2025-07-09 13:44:08.645	365	Active	50.00	2700.68	0.00000000	0.00000000	t	\N	2093191	polygon	2025-07-04 05:02:49.372	2026-07-04 05:02:49.372	±30%	Medium	93.77	93.77	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/ETH	\N	\N	\N	365
153	0x4f8b21e63469525749e2bd4246bec01e6a1b9220	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	10000	3.815056239971301	\N	\N	20000.00	2025-05-30 08:44:23.199	365	Active	72.60	222.80	0.00000000	0.00000000	t	\N		polygon	2025-10-09 22:50:49.462	2025-10-04 21:26:38.242	±10%	High	6898.08	6898.08	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
160	0xf031b70eef6dd808b00c5268daafc12ea0626010	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	24736	9.00764126446604	\N	\N	21822.42	2025-06-12 11:01:11.753	365	Active	9.44	561.57	0.00000000	0.00000000	t	\N	2411793	polygon	2025-08-06 08:39:30.041	2025-09-05 08:39:30.041	±10%	High	1654.91	1654.91	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	Unknown/Unknown	\N	\N	\N	365
178	0xb95fdea884a53746e6bc8a4b3ca0e8b3440d0ca4v	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3000	1.1427103553874856	\N	\N	6000.00	2025-06-16 08:51:23.082	365	Active	62.00	0.00	0.00000000	0.00000000	t	\N		polygon	2025-06-16 00:00:00	2026-06-16 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
179	0xb95fdea884a53746e6bc8a4b3ca0e8b3440d0ca4	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	15000	5.705675562719785	\N	\N	30000.00	2025-06-16 08:52:44.347	90	Finalized	32.00	922.58	0.00000000	0.00000000	t	\N		polygon	2025-09-16 08:07:16.681	2025-12-15 08:07:16.681	±10%	High	2428.62	2428.62	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
184	0xadbd9c39ad4e12622d7b1a7ebd5db6f625a656fd	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	10000	3.806308627805427	\N	\N	20000.00	2025-06-16 09:21:32.5	90	Finalized	32.00	614.58	0.00000000	0.00000000	t	\N		polygon	2025-09-16 08:04:35.424	2025-12-15 08:04:35.424	±10%	High	1619.04	1619.04	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
191	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1000	0.3955680555061095	\N	\N	2000.00	2025-06-19 08:55:59.829	365	Active	37.50	289.08	0.00000000	0.00000000	t	\N	25615	polygon	2025-06-19 00:00:00	2026-06-19 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
194	0xedba6c432e9827623697d75cc8c34a9460a88528	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2000	0.7840851899071536	\N	\N	4000.00	2025-06-20 09:31:45.177	365	Active	9.44	138.03	0.00000000	0.00000000	t	\N	2431681	polygon	2025-06-20 00:00:00	2026-06-20 00:00:00	±40%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
197	0xf3baba6e26ae23b166ee72d4e0e6187bd2a2ff59	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	25000	9.798810816319332	\N	\N	50000.00	2025-07-08 09:46:05.12	365	Finalized	9.44	238.55	0.00000000	0.00000000	t	\N	867212	polygon	2025-06-20 00:00:00	2026-06-20 00:00:00	±40%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/ETH	\N	\N	\N	365
207	0x8e16127d161599d030be8b178855171b8c71bc50	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	750	0.30631678673791096	\N	\N	1500.00	2025-07-09 09:41:30.849	365	Active	7.00	16.86	0.00000000	0.00000000	t	\N	976349	polygon	2025-06-30 00:00:00	2026-06-30 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	Unknown/Unknown	\N	\N	\N	365
212	0x913b0223882186ca5da539a2ea7361cf5a475a4a	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	1250	0.48785982693354096	\N	\N	2500.00	2025-07-23 13:06:51.982	365	Active	7.00	0.00	0.00000000	0.00000000	t	\N	29095	polygon	2025-07-07 00:00:00	2026-07-07 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/ETH	\N	\N	\N	365
180	0xb95fdea884a53746e6bc8a4b3ca0e8b3440d0ca4	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	22395	8.518573615140639	\N	\N	74790.00	2025-06-16 08:53:55.581	365	Active	74.00	12.32	0.00000000	0.00000000	t	\N		polygon	2025-10-21 09:18:41.373	2025-11-20 09:18:41.373	±10%	High	14966.83	14966.83	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
201	0x86d9f46cff667dccf7af872331757aa118adba43	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	11000	4.509755902400404	\N	\N	22000.00	2025-06-25 08:25:57.091	365	Active	7.08	510.36	0.00000000	0.00000000	t	\N	2431675	polygon	2025-06-25 00:00:00	2025-07-25 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
217	0xef0f1144467e6578cc30a4f845747e66461d6701	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	5500	2.105913259542715	\N	\N	11000.00	2025-07-09 09:37:13.274	365	Active	50.00	0.84	0.00000000	0.00000000	t	\N	2428881	polygon	2025-07-09 00:00:00	2025-08-08 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	0.3%	\N	\N	\N	\N	\N	\N	365
219	0x93d54815381821141de11a4c40a2de3bfd338377	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	11500	4.4073296345186845	\N	\N	23000.00	2025-07-09 09:36:35.306	365	Active	50.00	3958.99	0.00000000	0.00000000	t	\N	2428917	polygon	2025-07-09 00:00:00	2025-08-08 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	0.3%	\N	\N	\N	\N	\N	\N	365
238	0x2e3006364ae3adb067faf31ed31fb504b5675bfb	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	526	0.1763505447992057	\N	\N	1052.00	2025-07-15 09:15:36.302	365	Active	9.44	0.00	0.00000000	0.00000000	t	\N		polygon	2025-07-15 00:00:00	2026-07-15 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
262	0x3e2451ed9eacf35a5172f8440f062167dffc93f0	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1900	0.498771469303721	\N	\N	3800.00	2025-07-30 08:20:55.186	30	Pending	7.08	46.76	0.00000000	0.00000000	t	\N	1769384	polygon	2025-07-30 00:00:00	2025-08-29 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
263	0xea8776a80da4487f58b0576c0da78a11a59c101a	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	1500	0.3924445574728999	\N	\N	3000.00	2025-07-30 09:14:50.785	365	Active	7.00	0.22	0.00000000	0.00000000	t	\N	21644	polygon	2025-07-30 00:00:00	2026-07-30 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/ETH	\N	\N	\N	365
214	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	32500	12.604550063173475	\N	\N	65000.00	2025-07-08 12:47:10.333	365	Active	40.10	2201.84	0.00000000	0.00000000	t	\N	29221	polygon	2025-10-06 20:30:03.418	2025-10-06 00:00:00	±20%	Medium	6487.93	6487.93	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.05%	\N	\N	USDC/ETH	\N	\N	\N	365
244	0xc2be5767fb88376cab0780782bda0edd1e2ea88c	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5000	1.4518337101672014	\N	\N	12550.00	2025-07-17 08:17:38.011	365	Active	72.00	2346.95	0.00000000	0.00000000	t	\N		polygon	2025-07-17 00:00:00	2025-10-15 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
215	0xe014653c1b7b0ea2ef19701a02b772b46f9945eb	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	17500	6.655246384099934	\N	\N	35000.00	2025-07-09 07:44:23.296	365	Active	58.00	9694.33	0.00000000	0.00000000	t	\N	29730	polygon	2025-07-09 00:00:00	2026-07-09 00:00:00	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
221	0x97e58bc1073528178a0f5ffed77d6e4558601c52	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	7500	2.8742660980613737	\N	\N	15000.00	2025-07-09 09:46:46.606	365	Active	7.08	32.54	0.00000000	0.00000000	t	\N	2428879	polygon	2025-10-15 06:36:23.047	2025-08-08 00:00:00	±50%	Low	285.94	285.94	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
251	0xe19adf4350a59dca68013e28cf41e7fcae051b95	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	25990	7.035608521709837	\N	\N	51980.00	2025-07-23 09:12:52.428	365	Active	88.00	19644.69	0.00000000	0.00000000	t	\N		polygon	2025-07-23 00:00:00	2026-07-23 00:00:00	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
233	0x3051c8d7273cf2f1bf2ff1f2a9f809ad5868c21c	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1500	0.49280169535836765	\N	\N	8000.00	2025-07-14 08:06:12.234	365	Active	7.08	191.51	0.00000000	0.00000000	t	\N	2428912	polygon	2025-07-14 00:00:00	2025-08-13 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
267	0x243806d0e03455a826496e15bd3894bf1ebb1294	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	7500	1.940106344198784	\N	\N	15000.00	2025-09-04 07:06:38.511	365	Active	7.00	245.71	0.00000000	0.00000000	t	\N	394945	polygon	2025-07-31 00:00:00	2026-07-31 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	Unknown/Unknown	\N	\N	\N	365
276	0xad4474df3230a95a39d9937ab0ad91113972204a	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1250	0.26991839846419663	\N	\N	2500.00	2025-08-13 08:34:24.094	1095	Active	64.00	405.11	0.00000000	0.00000000	t	\N		polygon	2025-08-13 00:00:00	2028-08-12 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
278	0xc49a45652750cef8877fa63c67c831800f987cba	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	500	0.11717417410950734	\N	\N	1000.00	2025-08-18 08:59:01.091	365	Active	50.00	55.34	0.00000000	0.00000000	t	\N	2430130	polygon	2025-08-18 00:00:00	2025-09-17 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	0.3%	\N	\N	\N	\N	\N	\N	365
296	0x9ed9f5b0da78216a648fee8de16479c0aefeb25b	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1757840962280	100.00	2025-09-14 09:10:25.936	365	Pending	60.93	0.00	0.32000000	0.64000000	t	\N	\N	ethereum	2025-09-14 09:09:22.28	2026-09-14 09:09:22.28	±30%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
297	0x9ed9f5b0da78216a648fee8de16479c0aefeb25b	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1757841811064	50.00	2025-09-14 09:24:34.719	90	Pending	17.18	0.00	0.32000000	0.64000000	t	\N	\N	ethereum	2025-09-14 09:23:31.064	2025-12-13 10:23:31.064	±10%	High	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
290	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	15000	3.4308128918251697	\N	\N	30000.00	2025-09-02 11:54:17.77	365	Active	43.10	2326.96	0.00000000	0.00000000	t	\N		polygon	2025-09-02 00:00:00	2025-12-01 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
264	0x1a071bc2323afc4e991d2789bc0dc8b138430327	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2000	0.5240953391583255	\N	\N	4000.00	2025-07-30 09:08:29.909	365	Active	7.00	0.29	0.00000000	0.00000000	t	\N	21651	polygon	2025-07-30 00:00:00	2025-08-29 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.05	\N	\N	USDC/ETH	\N	\N	\N	365
265	0x1d75ec689f9febd55a4c2d16479bed88e48f4749	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2000	0.5240953391583255	\N	\N	4000.00	2025-07-30 09:13:08.202	365	Active	7.00	0.29	0.00000000	0.00000000	t	\N	21648	polygon	2025-07-30 00:00:00	2025-08-29 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
155	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	0.5	0.00019949538042698085	\N	\N	20000.00	2025-06-02 08:50:35.742	365	Active	35.00	4400.12	0.00000000	0.00000000	t	\N		polygon	2025-06-02 08:50:51.385	2026-06-02 08:50:51.385	±10%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
324	0x9dae8525796c538990cf71733460d61f9cfc3776	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	10000	6.25	\N	\N	20000.00	2025-10-28 10:42:20.046	1095	Active	8.40	0.00	0.00000000	0.00000000	t	\N		polygon	2024-05-15 00:00:00	2027-05-15 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
326	0xb2ed7c83cf83387ddc24ef8104670add136ff1ef	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1000	0.625	\N	\N	2000.00	2025-10-28 12:22:01.93	365	Active	7.00	1.50	0.00000000	0.00000000	t	\N		polygon	2025-10-28 00:00:00	2026-10-28 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
302	0xd44e7aac81c9d4d2a486df60b03de02638dc7bd7	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	bank-64f5fc73	10000.00	2025-09-15 16:18:21.475	365	Active	34.60	237.49	0.32000000	0.64000000	t	\N		ethereum	2025-10-22 14:18:54.651	2025-10-18 08:46:28.273	±40%	Medium	324.48	324.48	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
303	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	10000	2.176094673941493	\N	\N	20000.00	2025-09-18 08:45:17.788	365	Active	30.60	389.01	0.00000000	0.00000000	t	\N		polygon	2025-10-25 11:50:41.21	2025-10-23 12:43:18.002	±20%	Medium	535.93	535.93	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
306	0xdccff441718a46f85ab151f4ab74be189e29a871	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1500	0.3647412174505682	\N	\N	3000.00	2025-09-29 07:57:17.152	365	Active	7.00	0.00	0.00000000	0.00000000	t	\N		polygon	2025-09-29 00:00:00	2025-10-29 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
301	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	15000	3.25030596500619	\N	\N	30000.00	2025-09-15 07:55:52.316	365	Active	34.60	1925.10	0.00000000	0.00000000	t	\N		polygon	2025-09-11 00:00:00	2025-12-10 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
327	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5000	3.125	\N	\N	10000.00	2025-10-30 16:06:59.365	365	Active	48.31	189.74	0.00000000	0.00000000	t	\N		ethereum	2025-11-03 08:36:38.699	2026-02-01 08:36:38.699	±20%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
281	0xe19adf4350a59dca68013e28cf41e7fcae051b95	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5387.5	1.2792584784422234	\N	\N	10775.00	2025-08-20 07:23:21.149	365	Active	88.00	2544.21	0.00000000	0.00000000	t	\N		polygon	2025-09-19 19:36:23.792	2025-10-19 19:36:23.792	±10%	High	1073.48	1073.48	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
229	0xdc97f4a9ba2caaaacfff56c3597e22eec6ceb4c9	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2500	0.8382938237154178	\N	\N	5000.00	2025-07-11 08:28:35.808	365	Active	7.08	22.00	0.00000000	0.00000000	t	\N	2436094	polygon	2025-12-19 11:30:32.311	2025-08-10 00:00:00	±50%	Low	156.62	156.62	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
181	0x8ce77381d312b58e3af61972ad02a1b69355291a	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	4500	1.7117026688159354	\N	\N	9000.00	2025-06-16 09:01:49.848	365	Active	41.00	0.44	0.00000000	0.00000000	t	\N		polygon	2026-01-07 13:33:16.639	2025-07-16 00:00:00	±10%	High	2078.15	2078.15	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
282	0xe19adf4350a59dca68013e28cf41e7fcae051b95	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5530.5	1.3132137382876503	\N	\N	11061.00	2025-08-20 07:24:21.718	365	Active	88.00	2611.76	0.00000000	0.00000000	t	\N		polygon	2025-09-19 19:36:11.403	2025-10-19 19:36:11.403	±10%	High	1101.94	1101.94	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
261	0x8e2517df89b7e662a46dce6e7490342d0bf620e8	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5000	1.306921257387567	\N	\N	10000.00	2025-07-29 11:24:21.179	365	Active	7.08	157.77	0.00000000	0.00000000	t	\N	812705	polygon	2025-10-24 15:00:59.322	2025-08-28 00:00:00	±50%	Low	169.96	169.96	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
275	0x8e2517df89b7e662a46dce6e7490342d0bf620e8	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1754833999385	100.00	2025-08-10 13:53:22.326	365	Active	56.93	24.39	0.32000000	0.64000000	t	\N	\N	ethereum	2025-08-10 13:53:19.385	2025-09-09 13:53:19.385	±30%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
134	0xe014653c1b7b0ea2ef19701a02b772b46f9945eb	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	81871	31.49561224448838	\N	\N	96500.00	2025-05-27 07:51:09.379	365	Active	9.44	0.02	0.00000000	0.00000000	t	\N	2430144	polygon	2025-12-30 07:21:19.178	2025-08-07 10:26:50.339	±10%	High	6465.81	6465.81	Active	2025-07-08 10:26:50.339	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
77	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	13740	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	12000	7.609044279835012	\N	\N	24000.00	2025-04-16 10:29:23.107	365	Active	37.00	6104.85	0.00000000	0.00000000	t	\N	13740	polygon	2025-05-11 20:56:20.332	2026-05-11 20:56:20.332	±50%	Low	21505.27	21505.27	Active	2025-05-11 20:56:20.332	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
170	0x28368ad803ff966988012b03f2e5152af6cbe0f7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1750	0.6890748472154936	\N	\N	3500.00	2025-06-13 08:36:29.333	365	Active	7.08	8.86	0.00000000	0.00000000	t	\N	2410452	polygon	2025-10-21 16:17:18.22	2025-07-13 00:00:00	±50%	Low	88.72	88.72	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
159	0x2abdce11450920d491e32c258c4d5f3fcdc51874	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	32325.35	12.296936238919082	\N	\N	64650.70	2025-06-04 08:02:21.575	365	Active	9.44	2725.15	0.00000000	0.00000000	t	\N	23979	polygon	2025-08-07 09:04:44.889	2025-08-07 07:56:07.921	±30%	Medium	1191.35	1191.35	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
162	0x4c470e1deac2b073679ffbb95229a50de5906903	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	13669.5	4.977763270723583	\N	\N	6555.13	2025-06-12 11:03:33.207	365	Active	9.44	0.21	0.00000000	0.00000000	t	\N	2411787	polygon	2025-12-19 11:20:36.549	2025-07-12 00:00:00	±10%	High	322.91	322.91	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
101	0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1735.5	0.9510750804663176	\N	\N	2000.00	2025-05-05 08:11:29.15	365	Active	9.44	46.80	0.00000000	0.00000000	t	\N	2431697	polygon	2025-09-29 10:06:30.196	2025-08-07 10:26:19.957	±10%	High	176.44	176.44	Active	2025-07-08 10:26:19.957	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
152	0xa7f4137db52d5a4af26bc7f5f7e153b697f62828	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3000	1.1445168719913903	\N	\N	14000.00	2025-05-30 08:33:34.065	365	Active	78.00	817.28	0.00000000	0.00000000	t	\N		polygon	2025-12-21 11:40:04.603	2025-10-02 05:48:31.022	±10%	High	7243.56	7243.56	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
150	0xa7f4137db52d5a4af26bc7f5f7e153b697f62828	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	3750	1.3908579690650322	\N	\N	7500.00	2025-06-13 12:39:11.4	365	Active	68.00	381.69	0.00000000	0.00000000	t	\N	21843	polygon	2025-12-21 11:39:57.539	2025-10-02 05:48:25.445	±10%	High	3478.33	3478.33	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/ETH	\N	\N	\N	365
78	0xe19adf4350a59dca68013e28cf41e7fcae051b95	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	WETH	6	18	98010.5	62.07697015902567	\N	\N	96021.00	2025-05-16 10:10:10.611	365	Active	88.00	51920.59	0.00000000	0.00000000	t	\N	14479	polygon	2025-05-16 11:28:04.597	2026-05-16 11:28:04.597	±10%	High	40779.78	40779.78	Active	2025-05-16 11:28:04.597	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.05%	\N	\N	USDC/WETH	\N	\N	\N	365
192	0x706fcc76a7de84a28a105dbd79983785f74364f7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	17037.5	6.710504031225753	\N	\N	58000.00	2025-06-20 07:58:17.626	1095	Active	9.44	2243.09	0.00000000	0.00000000	t	\N	26173 	polygon	2025-08-18 17:39:18.707	2028-08-17 17:39:18.707	±10%	High	526.43	526.43	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
304	0x210de46106c3a38e1a315b6a7ca488fdf0b06d8c	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	12051	2.8897276079801233	\N	\N	24102.00	2025-09-24 07:38:43.764	365	Active	18.14	2715.94	0.00000000	0.00000000	t	\N		polygon	2025-05-26 00:00:00	2026-05-26 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
129	0x7ee905e3a0132cf867a78aa9ccfa6c49cfdda066	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	bank-db7c9a2b	160000.00	2025-05-26 09:12:33.819	365	Active	32.65	9564.31	0.32000000	0.64000000	t	\N	21621	polygon	2025-05-26 09:16:17.61	2026-05-26 09:12:33.654	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
140	0x45f749ce8acf4d839cf149aa41b19179c836c123	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	20787	7.87915673137679	\N	\N	20000.00	2025-07-10 09:51:25.303	365	Active	7.08	0.00	0.00000000	0.00000000	t	\N	2431686	polygon	2025-10-24 07:31:45.351	2025-06-26 00:00:00	±10%	High	583.12	583.12	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/ETH	\N	\N	\N	365
141	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1748433250008	0.00	2025-05-28 11:54:10.593	365	Active	0.00	0.00	0.32000000	0.64000000	t	\N	21824	polygon	2025-05-28 11:56:48.398	2025-06-27 11:56:48.398	±30%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
143	0x988e8fa8772456171127b5246ee6c86f4a818813	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	8921.5	3.3358173590577924	\N	\N	17843.00	2025-05-28 13:45:54.205	365	Active	9.44	27.83	0.00000000	0.00000000	t	\N	2434744	polygon	2026-01-07 21:32:50.173	2025-08-07 10:27:01.126	±10%	High	1576.92	1576.92	Active	2025-07-08 10:27:01.126	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
166	0xfe82fb6378f54f0fa967a1fe06b0bb8f039f8eee	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2000	0.7894601532226452	\N	\N	4263.81	2025-06-13 07:51:59.153	365	Active	9.44	17.52	0.00000000	0.00000000	t	\N	2436091	ethereum	2025-12-29 18:50:18.17	2025-10-26 13:36:21.586	±10%	High	213.10	213.10	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
168	0x4b951a078fb48be35e59954edba5bb8a93f0255a	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2000	0.7894601532226452	\N	\N	4263.81	2025-06-13 07:54:11.491	365	Active	9.44	18.35	0.00000000	0.00000000	t	\N	2436090	ethereum	2025-12-29 19:06:58.991	2025-10-26 13:47:41.094	±10%	High	213.12	213.12	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
182	0xadbd9c39ad4e12622d7b1a7ebd5db6f625a656fd	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5000	1.9021683222889874	\N	\N	10000.00	2025-06-16 09:19:05.962	365	Active	52.00	0.01	0.00000000	0.00000000	t	\N		polygon	2025-10-21 09:17:27.292	2025-10-16 08:04:55.065	±10%	High	2573.70	2573.70	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
183	0xadbd9c39ad4e12622d7b1a7ebd5db6f625a656fd	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	17395.5	6.62126417349893	\N	\N	54791.00	2025-06-16 09:20:39.779	365	Active	74.00	0.05	0.00000000	0.00000000	t	\N		polygon	2025-10-21 09:17:25.456	2025-11-20 09:17:25.456	±10%	High	11625.39	11625.39	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
186	0x80ace41d5833875966bf56a7306f37b843f41faa	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2500	0.969645018361746	\N	\N	5000.00	2025-06-17 07:42:46.616	365	Active	57.10	221.08	0.00000000	0.00000000	t	\N	2431677	polygon	2025-09-19 13:03:41.051	2025-10-19 13:03:41.051	±10%	High	869.02	869.02	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
188	0xb95fdea884a53746e6bc8a4b3ca0e8b3440d0ca4	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3000	1.1890489906880874	\N	\N	6000.00	2025-06-18 07:33:13.372	365	Active	52.00	0.70	0.00000000	0.00000000	t	\N		polygon	2025-10-21 09:18:36.061	2025-10-16 08:06:56.817	±10%	High	1517.30	1517.30	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
189	0x14e69d740a147d7a51c6d2d80a54ad7b7529bf15	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5000	1.9817483178134792	\N	\N	10000.00	2025-06-18 07:33:52.795	365	Active	51.00	0.05	0.00000000	0.00000000	t	\N	25617	polygon	2025-07-24 17:27:54.203	2025-08-23 17:27:54.203	±10%	High	714.42	714.42	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
203	0x55269ccf2538393b60a2ef049797e5e50a697800	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	6000	2.459866855854766	\N	\N	12000.00	2025-06-25 08:34:01.121	365	Active	7.08	283.03	0.00000000	0.00000000	t	\N	2431689	polygon	2025-06-25 00:00:00	2025-07-25 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
205	0x4c3ed0105606dbb88c1437061812eda4094bdec4	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1500	0.6167124682193813	\N	\N	3000.00	2025-06-25 08:42:37.573	365	Active	7.08	27.02	0.00000000	0.00000000	t	\N	2434742	polygon	2025-06-25 00:00:00	2025-07-25 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
199	0x2b3021281e8bbbba488f7f66da4d182cf3df99c9	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1750	0.7172937244592337	\N	\N	3500.00	2025-06-25 08:11:57.897	365	Active	7.08	54.86	0.00000000	0.00000000	t	\N	2434739	polygon	2025-09-30 14:12:46.169	2025-07-25 00:00:00	±50%	Low	66.26	66.26	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
213	0x55715192e451f3327d05a9dad7452824f7ccf8e7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	25000	9.701248877761643	\N	\N	50000.00	2025-07-08 11:44:01.985	365	Active	7.08	1827.55	0.00000000	0.00000000	t	\N	867212	polygon	2025-07-08 00:00:00	2025-08-07 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
209	0xdd7a881134d5c13c566e6344c48ebad3461040bc	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2500	0.977806190619754	\N	\N	5000.00	2025-07-04 09:34:04.816	365	Active	9.44	0.00	0.00000000	0.00000000	t	\N	2391793	polygon	2026-01-07 12:24:19.682	2025-08-03 00:00:00	±50%	Low	242.48	242.48	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
211	0x6bbddf1d6cb6b4b6e8451c092fe0121a44913926	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	15000	5.8668371437185245	\N	\N	30000.00	2025-07-04 09:45:43.828	365	Active	9.44	69.92	0.00000000	0.00000000	t	\N	2392217	polygon	2026-01-07 12:22:55.263	2025-08-03 00:00:00	±50%	Low	1454.90	1454.90	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
177	0xcb35b91a8b4e70acccee81a003e7cc5ff5d07d78	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5000	1.9040029942354977	\N	\N	10000.00	2025-06-16 08:33:08.075	365	Active	57.00	0.01	0.00000000	0.00000000	t	\N	25619	polygon	2026-01-07 13:32:25.485	2025-07-16 00:00:00	±10%	High	3210.16	3210.16	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0,05	\N	\N	USDC/ETH	\N	\N	\N	365
235	0x489405b99f046bed4862a481e02f7db75e37fd66	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	500	0.16480553365781497	\N	\N	26954.00	2025-07-14 09:01:17.065	365	Active	7.08	0.03	0.00000000	0.00000000	t	\N	2428913	polygon	2025-11-14 09:39:43.155	2025-08-13 00:00:00	±50%	Low	645.19	645.19	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
237	0x4a7f33a940aaa7aba8e76eb77d97f679c76b5fe8	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	8000	2.6281088147748903	\N	\N	16000.00	2025-07-14 09:38:28.808	365	Active	7.08	383.03	0.00000000	0.00000000	t	\N	2428919	polygon	2025-07-14 00:00:00	2025-08-13 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
243	0xc2be5767fb88376cab0780782bda0edd1e2ea88c	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	5000	1.4518337101672014	\N	\N	10000.00	2025-07-17 08:16:07.163	365	Active	62.00	0.02	0.00000000	0.00000000	t	\N		polygon	2025-09-21 22:04:34.797	2025-10-21 22:04:34.797	±10%	High	1686.72	1686.72	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
246	0x8648553513f80564d5a7a26a7b3d370d8c0f0293	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	25000	6.594830774388171	\N	\N	50000.00	2025-07-21 08:07:26.177	365	Active	7.08	1129.76	0.00000000	0.00000000	t	\N	2428914	polygon	2025-07-21 00:00:00	2025-08-20 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
248	0xd17ba251a4e9c4f6a44e92a95cb7186ebd8cdfc9	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	7500	2.0543613423948313	\N	\N	15000.00	2025-07-22 09:13:34.434	365	Active	7.08	1.12	0.00000000	0.00000000	t	\N	2428918	polygon	2025-07-22 00:00:00	2025-08-21 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
250	0x647f007b6b71a86aa62c218eed38d00b1123a23d	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	500	0.1375688343510315	\N	\N	1000.00	2025-07-22 09:27:04.064	365	Active	7.08	22.99	0.00000000	0.00000000	t	\N	2430142	polygon	2025-07-22 00:00:00	2025-08-21 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
256	0x3ef3c5b8ad4e83b735c530177dad13020cedcc8a	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	50	0.012910223659167682	\N	\N	100.00	2025-07-29 07:53:10.892	365	Active	7.80	0.07	0.00000000	0.00000000	t	\N	2081105	polygon	2025-07-29 00:00:00	2025-08-28 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
227	0xdc97f4a9ba2caaaacfff56c3597e22eec6ceb4c9	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2500	0.8382938237154178	\N	\N	5000.00	2025-07-11 08:27:32.401	365	Active	7.08	22.00	0.00000000	0.00000000	t	\N	2269099	polygon	2025-12-19 11:30:31.015	2025-08-10 00:00:00	±50%	Low	156.62	156.62	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
242	0x55715192e451f3327d05a9dad7452824f7ccf8e7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	4552.5	1.4389263763609648	\N	\N	9105.00	2025-07-16 08:59:03.911	365	Active	7.08	318.67	0.00000000	0.00000000	t	\N	1091591	polygon	2025-07-16 00:00:00	2025-08-15 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
231	0x36960261fbd11259494aa2de2a70b7cc5c84f086	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	8483	2.8209353510262525	\N	\N	16966.00	2025-07-11 10:46:46.78	365	Active	7.08	224.40	0.00000000	0.00000000	t	\N	2430145	polygon	2025-10-12 14:58:23.395	2025-08-10 00:00:00	±50%	Low	308.11	308.11	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
258	0xc3a049b80a44312a964197829cb82f24d72ed6c7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	14508	3.7453795886947963	\N	\N	29016.00	2025-07-29 09:47:41.623	365	Active	9.44	1056.81	0.00000000	0.00000000	t	\N	2081092	polygon	2025-08-29 12:48:48.74	2025-08-28 00:00:00	±50%	Low	236.64	236.64	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
257	0x2abdce11450920d491e32c258c4d5f3fcdc51874	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	81549	21.032115335253156	\N	\N	163098.00	2025-07-29 09:34:54.786	365	Active	9.44	5940.32	0.00000000	0.00000000	t	\N		polygon	2025-08-29 12:49:05.69	2025-08-28 09:35:39.934	±50%	Low	1313.24	1313.24	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
266	0xf5be55c376a184a0a76f69571acdf49434139676	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	250	0.0646708184007482	\N	\N	1000.00	2025-07-31 08:01:35.787	365	Active	7.00	0.00	0.00000000	0.00000000	t	\N	2081119	polygon	2025-10-28 09:05:45.756	2025-08-30 00:00:00	±50%	Low	17.14	17.14	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
271	0xf5d3d369879460e172e30b5a7dbc1a2d3e285bb4	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	20846	5.755725864433291	\N	\N	41692.00	2025-08-01 10:53:19.231	365	Active	37.01	3180.10	0.00000000	0.00000000	t	\N		polygon	2025-08-01 00:00:00	2025-08-31 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
277	0x84ef53a88318f3a3a1b6cfaa201ab88886f716b5	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	9000	2.109135133971132	\N	\N	18000.00	2025-08-18 08:56:44.895	365	Active	7.00	199.40	0.00000000	0.00000000	t	\N	1370104	polygon	2025-08-18 00:00:00	2025-09-17 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
280	0x8408bee8cc983917ceae498a3cfc05590bc0c7a5	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	500	0.11717417410950734	\N	\N	1000.00	2025-08-18 08:59:52.947	365	Active	5.00	11.84	0.00000000	0.00000000	t	\N	2429190	polygon	2025-08-18 00:00:00	2025-09-17 00:00:00	±50%	Low	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
284	0xfe13d4499bb58fab5a1751124a4071352a68a067	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3500	0.7617950626286372	\N	\N	7000.00	2025-08-27 10:43:21.634	365	Active	62.10	0.00	0.00000000	0.00000000	t	\N		polygon	2025-08-27 00:00:00	2025-09-26 00:00:00	±10%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
289	0xd4c5ab71c425bdcf3703fbee7e2a2e438531a18f	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	26500	5.924283730887442	\N	\N	53000.00	2025-09-01 08:54:20.12	365	Active	7.08	88.59	0.00000000	0.00000000	t	\N	2427771	polygon	2025-09-01 00:00:00	2025-10-01 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
283	0xe19adf4350a59dca68013e28cf41e7fcae051b95	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	20384.675	4.429027861810373	\N	\N	40769.35	2025-08-25 08:40:00.798	365	Active	88.00	8639.63	0.00000000	0.00000000	t	\N		polygon	2025-09-29 20:34:31.158	2025-10-29 20:34:31.158	±10%	High	3924.93	3924.93	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
300	0xb6c98ddf3668f579c2fb28f3bf6209b18433e297	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1757844442613	100.00	2025-09-14 10:08:26.267	365	Active	56.93	10.49	0.32000000	0.64000000	t	\N	\N	ethereum	2025-10-16 08:30:58.122	2025-10-14 10:07:22.613	±30%	Medium	4.98	4.98	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
294	0x89c948ee06b9b7b9cd20fc8bf9f7083e3f52a440	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	20000	4.596960576261569	\N	\N	40000.00	2025-09-03 13:08:14.907	365	Active	7.00	1.14	0.00000000	0.00000000	t	\N		polygon	2025-12-19 14:20:42.914	2025-10-03 13:08:32.674	±50%	Low	821.19	821.19	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
269	0x1a6bf9d5780926edcb9bc20fcbe7e610bd55c148	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	10000	2.586808458931712	\N	\N	20000.00	2025-07-31 09:12:55.122	365	Active	7.00	99.61	0.00000000	0.00000000	t	\N	2467314	polygon	2025-12-19 17:12:39.044	2025-08-30 00:00:00	±50%	Low	543.56	543.56	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
268	0xb31eec9828aabfdebca889dae56fe6bb56b58c94	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	6750	1.7460957097789056	\N	\N	13500.00	2025-07-31 09:11:45.361	365	Active	7.00	0.02	0.00000000	0.00000000	t	\N	2423186	polygon	2026-01-07 17:01:47.655	2025-08-30 00:00:00	±50%	Low	416.08	416.08	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
293	0xaa5ab1e659050faa1f25b2cf202d85317eb077fd	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1764.745	0.40940803601548303	\N	\N	3529.49	2025-09-03 09:13:41.8	365	Active	7.80	102.94	0.00000000	0.00000000	t	\N	2430123	polygon	2025-09-03 00:00:00	2025-10-03 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
286	0xf45231882bbf632dac2f46a938fff1dc7ec327b3	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	40200	8.984071599523002	\N	\N	80400.00	2025-09-01 08:26:53.577	365	Active	7.08	234.25	0.00000000	0.00000000	t	\N	2427742	polygon	2025-12-31 15:23:14.412	2025-10-01 00:00:00	±50%	Low	1897.02	1897.02	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
308	0x7dab6346245d6b47c195128ea22820caea24ff7a	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	5500	3.4375	\N	\N	11000.00	2025-09-30 08:33:44.231	365	Active	7.00	0.81	0.00000000	0.00000000	t	\N	2467319	polygon	2025-09-30 00:00:00	2025-10-30 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	Unknown/Unknown	\N	\N	\N	365
310	0x8d6a8789014d79b647fcd6baefdfe356549c9e03	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	5000	3.125	\N	\N	15000.00	2025-09-30 10:35:41.838	365	Active	7.00	1.32	0.00000000	0.00000000	t	\N	2434747	polygon	2025-09-30 00:00:00	2025-10-30 00:00:00	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	Unknown/Unknown	\N	\N	\N	365
311	0xd44e7aac81c9d4d2a486df60b03de02638dc7bd7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	10000	6.25	\N	\N	20000.00	2025-09-30 12:00:14.533	365	Active	54.00	500.53	0.00000000	0.00000000	t	\N		polygon	2025-10-30 17:36:46.334	2025-10-30 00:00:00	±20%	Medium	909.37	909.37	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
312	0xec370896441ecd15fc5b216edd1b6af02346200f	\N	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	18	18	0	0	\N	pending_1759331715426	1000.00	2025-10-01 15:15:15.632	365	Active	34.10	12.82	0.32000000	0.64000000	t	\N		ethereum	2025-10-01 15:40:04.284	2025-10-31 15:40:04.284	±50%	Low	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
313	0x3153f50104746dd78f127f0e802041912a1387da	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1500	0.9375	\N	\N	3000.00	2025-10-02 07:59:32.262	365	Active	7.00	0.00	0.00000000	0.00000000	t	\N		polygon	2025-10-02 00:00:00	2025-11-01 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
314	0x0c53e9ecfb1fd8c8e289fc53be4bc6aa807562d7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1500	0.9375	\N	\N	3000.00	2025-10-02 08:07:26.049	365	Active	7.00	5.29	0.00000000	0.00000000	t	\N		polygon	2025-11-02 16:38:11.985	2025-11-01 08:07:42.385	±20%	Medium	18.04	18.04	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
315	0xd44e7aac81c9d4d2a486df60b03de02638dc7bd7	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	10000	6.25	\N	\N	20000.00	2025-10-02 16:15:23.236	365	Active	54.00	450.66	0.00000000	0.00000000	t	\N		ethereum	2025-11-01 10:03:29.153	2025-11-01 00:00:00	±20%	Medium	900.06	900.06	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
316	0x117db44171ec85310f5de227ba6eb5f68e4bf435	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	27485	17.178125	\N	\N	54970.00	2025-10-06 12:43:31.553	365	Active	7.00	0.01	0.00000000	0.00000000	t	\N		polygon	2025-11-08 14:08:28.242	2025-11-05 00:00:00	±20%	Medium	354.09	354.09	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
317	0x5143dcf58ea0ca05b41ddc7b9eb0afec7aa1fedf	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1000	0.625	\N	\N	2000.00	2025-10-06 12:46:44.607	365	Active	7.00	0.00	0.00000000	0.00000000	t	\N		polygon	2025-10-06 00:00:00	2025-11-05 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
318	0x60abd6f66451d8ab4cc41b302b31f0ccb7a972ad	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1600	1	\N	\N	3200.00	2025-10-10 11:07:02.646	365	Active	7.00	21.80	0.00000000	0.00000000	t	\N		polygon	2025-10-10 00:00:00	2025-11-09 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
321	0x30cf590e4d39eb95eee7d5bbf10aa15a04ae6adf	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	1500	0.9375	\N	\N	3000.00	2025-10-14 08:23:11.065	365	Active	7.00	0.10	0.00000000	0.00000000	t	\N	20481	polygon	2025-11-13 09:02:33.646	2025-11-13 00:00:00	±50%	Low	17.48	17.48	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
325	0xe5a7546da6b4f5eef837b5dfbe311a331e6d574c	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	2450	1.53125	\N	\N	4900.00	2025-10-28 12:04:22.498	365	Active	7.00	0.48	0.00000000	0.00000000	t	\N		polygon	2025-10-28 00:00:00	2025-11-27 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
330	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	3000	1.875	\N	\N	6000.00	2025-11-17 08:09:43.606	365	Active	45.10	0.21	0.00000000	0.00000000	t	\N		polygon	2025-11-17 15:58:44.79	2025-12-17 15:58:44.79	±30%	High	0.00	0.00	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88		\N	\N	USDC/ETH	\N	\N	\N	365
331	0xfdd111d91c32c0d87be10751b5b6c6b48a7cc8f5	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	6	18	500	0.3125	\N	\N	1000.00	2025-11-18 10:28:53.673	365	Active	7.00	0.00	0.00000000	0.00000000	t	\N		polygon	2025-11-18 00:00:00	2025-12-18 00:00:00	±20%	Medium	0.00	0.00	Pending	\N	\N	\N	\N	\N	\N	\N	\N	\N	365
158	0xc12705de58d486ce0a7e015679b1bb78245a9842	\N	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	Unknown	Unknown	6	18	3851	1.466193348408206	\N	\N	7000.00	2025-06-04 07:59:35.653	365	Active	11.33	355.07	0.00000000	0.00000000	t	\N	2428877	polygon	2025-08-07 09:25:01.458	2025-08-07 07:53:01.779	±30%	Medium	147.39	147.39	Pending	\N	0xC36442b4a4522E871399CD717aBDD847Ab11FE88	0.3%	\N	\N	USDC/ETH	\N	\N	\N	365
\.


--
-- Data for Name: position_preferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.position_preferences (id, wallet_address, default_slippage, auto_compound, price_range_width, default_timeframe, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: real_positions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.real_positions (id, wallet_address, virtual_position_id, pool_address, pool_name, token0, token1, token0_amount, token1_amount, token_id, tx_hash, network, status, block_explorer_url, liquidity_value, fees_earned, in_range, additional_data, created_at, updated_at, nft_url, contract_address, token_pair, fee) FROM stdin;
1	0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F	1	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDT-ETH	USDT	ETH	100	0.05	2487090	\N	ethereum	Active	\N	\N	\N	t	\N	2025-04-03 19:35:17.88	2025-04-03 19:35:17.88	\N	\N	\N	\N
2	0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F	5	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC-ETH	USDC	ETH	1000	0.5	2487091	\N	ethereum	Active	\N	1500.25	12.35	t	\N	2025-04-03 19:35:23.428	2025-04-03 19:35:23.428	\N	\N	\N	\N
3	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	8	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8654092	0xa526a03c23db553afd5ef80785b9980f898db8185309ebdc30dade5a23bb5dc0	ethereum	confirmed	https://etherscan.io/tx/0xa526a03c23db553afd5ef80785b9980f898db8185309ebdc30dade5a23bb5dc0	12500.50	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T11:34:05.365Z", "originalDeposit": "1000.00"}	2025-04-04 11:34:05.379	2025-04-04 11:34:12.428	\N	\N	\N	\N
4	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	9	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3972802	0x02754d4279c12271cb73e41573d69b493dd0456357d5830b06541d5d1c63cb38	ethereum	confirmed	https://etherscan.io/tx/0x02754d4279c12271cb73e41573d69b493dd0456357d5830b06541d5d1c63cb38	7500.25	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T11:38:47.732Z", "originalDeposit": "1500.00"}	2025-04-04 11:38:47.747	2025-04-04 11:38:54.795	\N	\N	\N	\N
5	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	11	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	7335687	0xc93612fa00507d375577f30399c8a50cc96ed74e561562c24fbd2cc4d494323b	ethereum	confirmed	https://etherscan.io/tx/0xc93612fa00507d375577f30399c8a50cc96ed74e561562c24fbd2cc4d494323b	9750.00	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T12:00:13.928Z", "originalDeposit": "500.00"}	2025-04-04 12:00:13.942	2025-04-04 12:00:20.991	\N	\N	\N	\N
6	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	12	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9068658	0x4dc04d65b11f19fb94cc6246b1051e9fd58686e7a6ca310d3fca998b0fa2936b	ethereum	confirmed	https://etherscan.io/tx/0x4dc04d65b11f19fb94cc6246b1051e9fd58686e7a6ca310d3fca998b0fa2936b	32500.25	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T12:31:46.336Z", "originalDeposit": "1000.00"}	2025-04-04 12:31:46.35	2025-04-04 12:31:53.4	\N	\N	\N	\N
7	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	13	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9975837	0x0d527a1d68b248e20f2c47666b088098aeb951aa41001deffef614af7bfa521b	ethereum	confirmed	https://etherscan.io/tx/0x0d527a1d68b248e20f2c47666b088098aeb951aa41001deffef614af7bfa521b	18750.50	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T12:48:20.681Z", "originalDeposit": "100.00"}	2025-04-04 12:48:20.695	2025-04-04 12:48:27.745	\N	\N	\N	\N
8	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	14	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2734187	0x01903e77a115521138a86967e442a4954e198431085f34b6de3251d2eb4c17f1	ethereum	confirmed	https://etherscan.io/tx/0x01903e77a115521138a86967e442a4954e198431085f34b6de3251d2eb4c17f1	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T13:57:07.414Z", "originalDeposit": "1000.00"}	2025-04-04 13:57:07.415	2025-04-04 13:57:14.474	\N	\N	\N	\N
9	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	15	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8135362	0xe069e00abe66618a35e1f1dc8bf6e2d67a133aadd4e8a7d488bdafcac98ba0ca	ethereum	confirmed	https://etherscan.io/tx/0xe069e00abe66618a35e1f1dc8bf6e2d67a133aadd4e8a7d488bdafcac98ba0ca	5000.75	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T14:23:43.344Z", "originalDeposit": "100.00"}	2025-04-04 14:23:43.362	2025-04-04 14:23:50.415	\N	\N	\N	\N
10	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	16	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6424529	0x2390134a301ff18c28bdb7ef5aa8e4c84f029fb1e52387911764a4a6e36024dd	ethereum	confirmed	https://etherscan.io/tx/0x2390134a301ff18c28bdb7ef5aa8e4c84f029fb1e52387911764a4a6e36024dd	45000.75	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T14:30:17.446Z", "originalDeposit": "1000.00"}	2025-04-04 14:30:17.463	2025-04-04 14:30:24.51	\N	\N	\N	\N
11	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	17	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8061751	0xf5ad53d15e7eeae74e6c2800210cd98e84a8801fd208f1214efe286fa69c2a82	ethereum	confirmed	https://etherscan.io/tx/0xf5ad53d15e7eeae74e6c2800210cd98e84a8801fd208f1214efe286fa69c2a82	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T14:37:05.235Z", "originalDeposit": "100.00"}	2025-04-04 14:37:05.251	2025-04-04 14:37:12.298	\N	\N	\N	\N
12	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	23	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6551216	0xc01ab7d87fe011e51f7aa17b286a1dffaf04cc71b892ded665daeec71b87a829	ethereum	confirmed	https://etherscan.io/tx/0xc01ab7d87fe011e51f7aa17b286a1dffaf04cc71b892ded665daeec71b87a829	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T22:27:14.423Z", "originalDeposit": "5000.00"}	2025-04-04 22:27:14.439	2025-04-04 22:27:21.49	\N	\N	\N	\N
13	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	24	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9624093	0x91dce3c22761cd1d8af4038b73278be74bf470d2dcce20a44224e3fc56609810	ethereum	confirmed	https://etherscan.io/tx/0x91dce3c22761cd1d8af4038b73278be74bf470d2dcce20a44224e3fc56609810	27500.25	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T22:30:08.075Z", "originalDeposit": "1000.00"}	2025-04-04 22:30:08.09	2025-04-04 22:30:15.143	\N	\N	\N	\N
14	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	25	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1478900	0x0059b337e1d2136736dbfbd96d681c6469e5526e18ffdde6c85329f10d584b5c	ethereum	confirmed	https://etherscan.io/tx/0x0059b337e1d2136736dbfbd96d681c6469e5526e18ffdde6c85329f10d584b5c	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-04T23:07:28.764Z", "originalDeposit": "100.00"}	2025-04-04 23:07:28.779	2025-04-04 23:07:35.829	\N	\N	\N	\N
15	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	26	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2281238	0x319e49e98bd2f7ef5ee8e1f0fc39720ced7544e1d1c3b8fbc19505e2d98c90aa	ethereum	confirmed	https://etherscan.io/tx/0x319e49e98bd2f7ef5ee8e1f0fc39720ced7544e1d1c3b8fbc19505e2d98c90aa	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-05T19:55:35.217Z", "originalDeposit": "1000.00"}	2025-04-05 19:55:35.233	2025-04-05 19:55:42.28	\N	\N	\N	\N
16	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	27	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3722558	0xe632c2241ff37cdba50263a6d00884fa332732511c9126af0b31ef190cec782e	ethereum	confirmed	https://etherscan.io/tx/0xe632c2241ff37cdba50263a6d00884fa332732511c9126af0b31ef190cec782e	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-05T22:25:01.212Z", "originalDeposit": "100.00"}	2025-04-05 22:25:01.226	2025-04-05 22:25:08.275	\N	\N	\N	\N
17	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	28	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9093573	0xa2cd2409fcb80ee5eab72e20d60ec51a5f13afa2aa291c06000f5e94cfc51fdb	ethereum	confirmed	https://etherscan.io/tx/0xa2cd2409fcb80ee5eab72e20d60ec51a5f13afa2aa291c06000f5e94cfc51fdb	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T01:16:22.273Z", "originalDeposit": "80.00"}	2025-04-06 01:16:22.288	2025-04-06 01:16:29.335	\N	\N	\N	\N
18	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	29	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5229453	0x6c80e6a726acdea643bfbfb5fd6c83b12d454953037863fcbf4dd896a021c414	ethereum	confirmed	https://etherscan.io/tx/0x6c80e6a726acdea643bfbfb5fd6c83b12d454953037863fcbf4dd896a021c414	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T02:22:31.691Z", "originalDeposit": "1.00"}	2025-04-06 02:22:31.706	2025-04-06 02:22:38.756	\N	\N	\N	\N
19	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	30	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5804325	0xba34cb1b59328c5084fb8a3e140e9ce341bd4f6fcecaead263a4ba04e28cf42f	ethereum	confirmed	https://etherscan.io/tx/0xba34cb1b59328c5084fb8a3e140e9ce341bd4f6fcecaead263a4ba04e28cf42f	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T02:24:58.572Z", "originalDeposit": "1.00"}	2025-04-06 02:24:58.594	2025-04-06 02:25:05.641	\N	\N	\N	\N
20	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	31	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4770938	0xf44c83af3fcd9b8c5082286ea79f81365eab2c9096ce88b36c647efbbf38dae6	ethereum	confirmed	https://etherscan.io/tx/0xf44c83af3fcd9b8c5082286ea79f81365eab2c9096ce88b36c647efbbf38dae6	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T02:49:42.324Z", "originalDeposit": "1.00"}	2025-04-06 02:49:42.339	2025-04-06 02:49:49.387	\N	\N	\N	\N
21	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	32	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	7448796	0x45c1825b7f0eea03814306a2af003fe6d90dd24bd3fb810a6d211bd32c0631a1	ethereum	confirmed	https://etherscan.io/tx/0x45c1825b7f0eea03814306a2af003fe6d90dd24bd3fb810a6d211bd32c0631a1	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:01:41.036Z", "originalDeposit": "1.00"}	2025-04-06 03:01:41.052	2025-04-06 03:01:48.097	\N	\N	\N	\N
22	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	33	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	7075289	0x1c44a60b800b18341a80c4f2ac5ef5bde9eef90231139d364c2f4f2385f683b9	ethereum	confirmed	https://etherscan.io/tx/0x1c44a60b800b18341a80c4f2ac5ef5bde9eef90231139d364c2f4f2385f683b9	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:01:49.744Z", "originalDeposit": "1.00"}	2025-04-06 03:01:49.758	2025-04-06 03:01:56.804	\N	\N	\N	\N
23	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	34	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3297560	0x6a81b1e4c1ece1182de349e809c10ec68adbe572335178528b2e33dbe30a8e12	ethereum	confirmed	https://etherscan.io/tx/0x6a81b1e4c1ece1182de349e809c10ec68adbe572335178528b2e33dbe30a8e12	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:02:31.676Z", "originalDeposit": "1.00"}	2025-04-06 03:02:31.69	2025-04-06 03:02:38.735	\N	\N	\N	\N
24	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	35	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4803678	0x0d861bdb11e01dcec9ed3c8f38791fc72fafa3acbce3bfe8e9285e0982ae2ab5	ethereum	confirmed	https://etherscan.io/tx/0x0d861bdb11e01dcec9ed3c8f38791fc72fafa3acbce3bfe8e9285e0982ae2ab5	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:02:47.739Z", "originalDeposit": "1.00"}	2025-04-06 03:02:47.755	2025-04-06 03:02:54.801	\N	\N	\N	\N
25	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	36	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8301380	0x6ea7b74eff16912578849f68d7d4246d32ccca79bd97fb64672320aa5e441016	ethereum	confirmed	https://etherscan.io/tx/0x6ea7b74eff16912578849f68d7d4246d32ccca79bd97fb64672320aa5e441016	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:04:10.873Z", "originalDeposit": "1.00"}	2025-04-06 03:04:10.887	2025-04-06 03:04:17.932	\N	\N	\N	\N
26	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	37	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9502066	0x97e11536c32fdb6a36f78f20965fb93154be8ea587932245193e1d41ff62705b	ethereum	confirmed	https://etherscan.io/tx/0x97e11536c32fdb6a36f78f20965fb93154be8ea587932245193e1d41ff62705b	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:09:21.753Z", "originalDeposit": "1.00"}	2025-04-06 03:09:21.767	2025-04-06 03:09:28.815	\N	\N	\N	\N
27	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	38	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3942963	0xc8712acc1708de50e9d44deeb4108d47bf6653257307203856599a1abe5e135c	ethereum	confirmed	https://etherscan.io/tx/0xc8712acc1708de50e9d44deeb4108d47bf6653257307203856599a1abe5e135c	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:13:44.247Z", "originalDeposit": "1.00"}	2025-04-06 03:13:44.262	2025-04-06 03:13:51.315	\N	\N	\N	\N
28	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	39	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5184962	0xcd5998da41c163dfe73e374c4ec20ff264785d5c4032e666c92d0689aaaf1509	ethereum	confirmed	https://etherscan.io/tx/0xcd5998da41c163dfe73e374c4ec20ff264785d5c4032e666c92d0689aaaf1509	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:15:36.710Z", "originalDeposit": "1.00"}	2025-04-06 03:15:36.724	2025-04-06 03:15:43.769	\N	\N	\N	\N
29	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	40	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3749979	0xc56e460284349594609b8fbdb33a310880c557f217a9d8bb5b824b678f4795f6	ethereum	confirmed	https://etherscan.io/tx/0xc56e460284349594609b8fbdb33a310880c557f217a9d8bb5b824b678f4795f6	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:17:48.459Z", "originalDeposit": "2.00"}	2025-04-06 03:17:48.474	2025-04-06 03:17:55.523	\N	\N	\N	\N
30	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	41	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4633767	0x2277654079175714bfed8ebdb4b97c9626c0dade0de94137024fd5ade086b546	ethereum	confirmed	https://etherscan.io/tx/0x2277654079175714bfed8ebdb4b97c9626c0dade0de94137024fd5ade086b546	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:18:23.268Z", "originalDeposit": "2.00"}	2025-04-06 03:18:23.284	2025-04-06 03:18:30.342	\N	\N	\N	\N
31	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	42	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4840342	0x32f97716f1c1433d35fcec2c56c4e94d5749bd3780b7057de586f2dff8f21952	ethereum	confirmed	https://etherscan.io/tx/0x32f97716f1c1433d35fcec2c56c4e94d5749bd3780b7057de586f2dff8f21952	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:22:49.772Z", "originalDeposit": "1.00"}	2025-04-06 03:22:49.787	2025-04-06 03:22:56.836	\N	\N	\N	\N
32	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	43	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5784598	0x4827bd3991283751f7bd73ea82c5f1aadafaa770362cdcb6a1338fe78b931af7	ethereum	confirmed	https://etherscan.io/tx/0x4827bd3991283751f7bd73ea82c5f1aadafaa770362cdcb6a1338fe78b931af7	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:24:16.602Z", "originalDeposit": "1.00"}	2025-04-06 03:24:16.617	2025-04-06 03:24:23.661	\N	\N	\N	\N
33	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	44	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9775898	0x53464af60325d205029713c07cb2b2ab1345850904079cfbfa13987611a40b78	ethereum	confirmed	https://etherscan.io/tx/0x53464af60325d205029713c07cb2b2ab1345850904079cfbfa13987611a40b78	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:25:17.473Z", "originalDeposit": "1.00"}	2025-04-06 03:25:17.489	2025-04-06 03:25:24.537	\N	\N	\N	\N
34	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	45	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	7765941	0x8798103099db046f0b560b6e2feebd95bd5450afd9e1b6b48a4650ca100e3377	ethereum	confirmed	https://etherscan.io/tx/0x8798103099db046f0b560b6e2feebd95bd5450afd9e1b6b48a4650ca100e3377	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:26:57.316Z", "originalDeposit": "1.00"}	2025-04-06 03:26:57.331	2025-04-06 03:27:04.378	\N	\N	\N	\N
35	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	46	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1794291	0x6958545cb6b740c097df5ca628092474a7c5bff2d0004094d3133ee755bb1c91	ethereum	confirmed	https://etherscan.io/tx/0x6958545cb6b740c097df5ca628092474a7c5bff2d0004094d3133ee755bb1c91	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:31:28.830Z", "originalDeposit": "1.00"}	2025-04-06 03:31:28.844	2025-04-06 03:31:35.888	\N	\N	\N	\N
36	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	47	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9819420	0x5c557872c6e4075a6a304f92a021a0caed7e70f0389cc2dad82e38bddc9badd3	ethereum	confirmed	https://etherscan.io/tx/0x5c557872c6e4075a6a304f92a021a0caed7e70f0389cc2dad82e38bddc9badd3	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:34:12.702Z", "originalDeposit": "1.00"}	2025-04-06 03:34:12.716	2025-04-06 03:34:19.761	\N	\N	\N	\N
37	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	48	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1506442	0x70b58b5301716b9a607071ac4023ca14722abe6944aae81f63ebd49f6786e48c	ethereum	confirmed	https://etherscan.io/tx/0x70b58b5301716b9a607071ac4023ca14722abe6944aae81f63ebd49f6786e48c	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:40:23.869Z", "originalDeposit": "1.00"}	2025-04-06 03:40:23.883	2025-04-06 03:40:30.926	\N	\N	\N	\N
38	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	49	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4190296	0xb3fb028d46ee8e84afc6dcd8aef411a39596319d632bef818c82250a755314d2	ethereum	confirmed	https://etherscan.io/tx/0xb3fb028d46ee8e84afc6dcd8aef411a39596319d632bef818c82250a755314d2	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T03:47:48.531Z", "originalDeposit": "2.00"}	2025-04-06 03:47:48.546	2025-04-06 03:47:55.593	\N	\N	\N	\N
39	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	50	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9813657	0x2edf20b5db9070021da579f4cff63283dc8d185b608e1389edbc6d6f90530f46	ethereum	confirmed	https://etherscan.io/tx/0x2edf20b5db9070021da579f4cff63283dc8d185b608e1389edbc6d6f90530f46	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T04:08:38.126Z", "originalDeposit": "1.00"}	2025-04-06 04:08:38.142	2025-04-06 04:08:45.212	\N	\N	\N	\N
40	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	51	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6435029	0x9f27b889f5c6c073228efb48d9cbe6818a74dae2070913cb91908a5ccb400cac	ethereum	confirmed	https://etherscan.io/tx/0x9f27b889f5c6c073228efb48d9cbe6818a74dae2070913cb91908a5ccb400cac	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T04:18:54.450Z", "originalDeposit": "1.00"}	2025-04-06 04:18:54.467	2025-04-06 04:19:01.513	\N	\N	\N	\N
41	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	52	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6610643	0x0643764f4f97929b4c4fef6f5d9f89c5f15456bdb7a3db538d04af2610d571c6	ethereum	confirmed	https://etherscan.io/tx/0x0643764f4f97929b4c4fef6f5d9f89c5f15456bdb7a3db538d04af2610d571c6	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T12:01:50.201Z", "originalDeposit": "1.00"}	2025-04-06 12:01:50.217	2025-04-06 12:01:57.283	\N	\N	\N	\N
42	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	53	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1140862	0x78164576cd248b67632d5c31060150fd578ad3ae1e603fa226a72ce0cf48b725	ethereum	confirmed	https://etherscan.io/tx/0x78164576cd248b67632d5c31060150fd578ad3ae1e603fa226a72ce0cf48b725	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T12:02:35.554Z", "originalDeposit": "1.00"}	2025-04-06 12:02:35.571	2025-04-06 12:02:42.638	\N	\N	\N	\N
43	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	54	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2153540	0xef75fb329124ed1fc4ff3f95807e561cb4609a290b1e5ce1edd6febd19987770	ethereum	confirmed	https://etherscan.io/tx/0xef75fb329124ed1fc4ff3f95807e561cb4609a290b1e5ce1edd6febd19987770	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T12:02:51.839Z", "originalDeposit": "1.00"}	2025-04-06 12:02:51.856	2025-04-06 12:02:58.921	\N	\N	\N	\N
44	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	55	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4289607	0x65954166da6ccab7f4c280d3dcb1f92dfc315d45ae90ab9787020f71e885515c	ethereum	confirmed	https://etherscan.io/tx/0x65954166da6ccab7f4c280d3dcb1f92dfc315d45ae90ab9787020f71e885515c	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T21:32:12.926Z", "originalDeposit": "10000.00"}	2025-04-06 21:32:12.94	2025-04-06 21:32:20.014	\N	\N	\N	\N
45	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	56	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1276854	0xc0e5b343e0a3017f712a4ae2f5b3d8ab12531f90c0d19ea1c6ad9d61eb728213	ethereum	confirmed	https://etherscan.io/tx/0xc0e5b343e0a3017f712a4ae2f5b3d8ab12531f90c0d19ea1c6ad9d61eb728213	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-06T21:49:07.039Z", "originalDeposit": "1.00"}	2025-04-06 21:49:07.055	2025-04-06 21:49:14.121	\N	\N	\N	\N
46	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	57	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4805979	0xbb346da4530c38661cd29b1c481d48f915f3c96b1596b81cc1e2a2969979428b	ethereum	confirmed	https://etherscan.io/tx/0xbb346da4530c38661cd29b1c481d48f915f3c96b1596b81cc1e2a2969979428b	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-07T07:12:27.739Z", "originalDeposit": "1000.00"}	2025-04-07 07:12:27.757	2025-04-07 07:12:34.987	\N	\N	\N	\N
47	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	58	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5072097	0x77e2fc817e473ff5b43844c626b289390a9486287d176b8b44271cb2be3ea88b	ethereum	confirmed	https://etherscan.io/tx/0x77e2fc817e473ff5b43844c626b289390a9486287d176b8b44271cb2be3ea88b	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-07T11:27:10.000Z", "originalDeposit": "1000.00"}	2025-04-07 11:27:10.015	2025-04-07 11:27:17.063	\N	\N	\N	\N
48	0x7ee905e3a0132cf867a78aa9ccfa6c49cfdda066	59	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1185226	0xf036563299efb9439af14508a6e61e1d1ba50d6edd91c71d39b7cfd9a4b9406c	ethereum	confirmed	https://etherscan.io/tx/0xf036563299efb9439af14508a6e61e1d1ba50d6edd91c71d39b7cfd9a4b9406c	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-07T11:34:26.609Z", "originalDeposit": "1000.00"}	2025-04-07 11:34:26.625	2025-04-07 11:34:33.838	\N	\N	\N	\N
49	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	60	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3629282	0xb6602781c4ec71560896a621a3355838c5d45294a9f42c79131286b4b7f54b56	ethereum	confirmed	https://etherscan.io/tx/0xb6602781c4ec71560896a621a3355838c5d45294a9f42c79131286b4b7f54b56	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-08T07:56:25.067Z", "originalDeposit": "1.00"}	2025-04-08 07:56:25.082	2025-04-08 07:56:32.144	\N	\N	\N	\N
50	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	61	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	7249027	0x09a01100509f2a2b8dbaa16c9f0f1d083008f7cd8c5496f781cfd90fce177f50	ethereum	confirmed	https://etherscan.io/tx/0x09a01100509f2a2b8dbaa16c9f0f1d083008f7cd8c5496f781cfd90fce177f50	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T20:53:41.394Z", "originalDeposit": "1.00"}	2025-04-11 20:53:41.431	2025-04-11 20:53:48.571	\N	\N	\N	\N
51	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	62	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1680337	0x02da3f004668506faef08b8147251a70ca4892ddf5e22e87d427d409a25266e1	ethereum	confirmed	https://etherscan.io/tx/0x02da3f004668506faef08b8147251a70ca4892ddf5e22e87d427d409a25266e1	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T20:57:05.798Z", "originalDeposit": "1.00"}	2025-04-11 20:57:05.835	2025-04-11 20:57:12.969	\N	\N	\N	\N
52	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	63	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6100234	0xf598f5b722fc7458aac896b4da49151598758e9c118327590e0bc11df1bea7b9	ethereum	confirmed	https://etherscan.io/tx/0xf598f5b722fc7458aac896b4da49151598758e9c118327590e0bc11df1bea7b9	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T20:58:07.770Z", "originalDeposit": "1.00"}	2025-04-11 20:58:07.808	2025-04-11 20:58:14.95	\N	\N	\N	\N
53	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	64	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2939835	0x5d7ea9634b9d44797c1a7bf78e2d30b000730abd5ed263c47ace5805f803795b	ethereum	confirmed	https://etherscan.io/tx/0x5d7ea9634b9d44797c1a7bf78e2d30b000730abd5ed263c47ace5805f803795b	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T21:00:23.256Z", "originalDeposit": "1.00"}	2025-04-11 21:00:23.293	2025-04-11 21:00:30.428	\N	\N	\N	\N
54	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	65	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1840834	0x9719804981ddf44cc8c04d24811052bb07222203df7d8ff3b8f85a6c88eeeafd	ethereum	confirmed	https://etherscan.io/tx/0x9719804981ddf44cc8c04d24811052bb07222203df7d8ff3b8f85a6c88eeeafd	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T21:01:15.420Z", "originalDeposit": "1.00"}	2025-04-11 21:01:15.458	2025-04-11 21:01:22.591	\N	\N	\N	\N
55	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	66	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	\N	\N	ethereum	pending	\N	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T21:03:17.564Z", "originalDeposit": "1.00"}	2025-04-11 21:03:17.605	2025-04-11 21:03:17.605	\N	\N	\N	\N
56	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	67	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8892106	0x22fd06af37b1ea7d97a4142ec7c6bb4da641ef5732b12bef2b7822011eb688a0	ethereum	confirmed	https://etherscan.io/tx/0x22fd06af37b1ea7d97a4142ec7c6bb4da641ef5732b12bef2b7822011eb688a0	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T21:03:51.230Z", "originalDeposit": "1.00"}	2025-04-11 21:03:51.266	2025-04-11 21:03:58.398	\N	\N	\N	\N
57	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	68	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9551144	0x212c902c69d891cac7b103c98dc023adbd2c51f554cb9314c3c697372388ed9c	ethereum	confirmed	https://etherscan.io/tx/0x212c902c69d891cac7b103c98dc023adbd2c51f554cb9314c3c697372388ed9c	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T21:10:08.510Z", "originalDeposit": "1.00"}	2025-04-11 21:10:08.548	2025-04-11 21:10:15.684	\N	\N	\N	\N
58	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	69	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9917137	0x296ab3fa2af53dceec09445158f779bfa3e7178c91832afb1086773e17b51041	ethereum	confirmed	https://etherscan.io/tx/0x296ab3fa2af53dceec09445158f779bfa3e7178c91832afb1086773e17b51041	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T21:14:21.427Z", "originalDeposit": "1.00"}	2025-04-11 21:14:21.463	2025-04-11 21:14:28.599	\N	\N	\N	\N
59	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	70	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2412948	0xabb598f7e886f3da6338bcf4c63beba41404ab2e7be2cbde6b64e81115a053c8	ethereum	confirmed	https://etherscan.io/tx/0xabb598f7e886f3da6338bcf4c63beba41404ab2e7be2cbde6b64e81115a053c8	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-11T21:37:41.071Z", "originalDeposit": "1.00"}	2025-04-11 21:37:41.108	2025-04-11 21:37:48.511	\N	\N	\N	\N
60	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	71	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4372000	0x3e732dc5a17da8ddcac1c9f18ce15112caf9625042efc21cc558d95b2529461e	ethereum	confirmed	https://etherscan.io/tx/0x3e732dc5a17da8ddcac1c9f18ce15112caf9625042efc21cc558d95b2529461e	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-12T09:58:13.428Z", "originalDeposit": "1.00"}	2025-04-12 09:58:13.444	2025-04-12 09:58:20.515	\N	\N	\N	\N
61	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	72	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8758847	0xbceb0940042ff17ddb1c2705ac31522252987478c1cbf3a957c475eba402d8c7	ethereum	confirmed	https://etherscan.io/tx/0xbceb0940042ff17ddb1c2705ac31522252987478c1cbf3a957c475eba402d8c7	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-12T09:58:47.221Z", "originalDeposit": "1.00"}	2025-04-12 09:58:47.237	2025-04-12 09:58:54.305	\N	\N	\N	\N
62	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	73	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3388239	0xd07c34498b2f84c140dd19fa7eac6d6114f1b04cc150d3409616d83c06e74b21	ethereum	confirmed	https://etherscan.io/tx/0xd07c34498b2f84c140dd19fa7eac6d6114f1b04cc150d3409616d83c06e74b21	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-12T10:12:00.061Z", "originalDeposit": "1.00"}	2025-04-12 10:12:00.109	2025-04-12 10:12:07.253	\N	\N	\N	\N
63	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	74	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1152186	0xe00662d9bb0e654b306f2134f78e61e593009e03535df20b1ceae1dae492aa50	ethereum	confirmed	https://etherscan.io/tx/0xe00662d9bb0e654b306f2134f78e61e593009e03535df20b1ceae1dae492aa50	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-12T10:13:52.684Z", "originalDeposit": "1.00"}	2025-04-12 10:13:52.72	2025-04-12 10:13:59.851	\N	\N	\N	\N
64	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	75	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9412282	0x330d178f89b864bee0b05b141610603ff0230ea86d8dd0869b07deb9e2e491cd	ethereum	confirmed	https://etherscan.io/tx/0x330d178f89b864bee0b05b141610603ff0230ea86d8dd0869b07deb9e2e491cd	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-12T10:34:45.264Z", "originalDeposit": "35.00"}	2025-04-12 10:34:45.3	2025-04-12 10:34:52.432	\N	\N	\N	\N
65	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	76	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2877046	0x373d96d3774b0337aa54af01cccd3acb7487d5788c34c5d714739bbb44161a91	ethereum	confirmed	https://etherscan.io/tx/0x373d96d3774b0337aa54af01cccd3acb7487d5788c34c5d714739bbb44161a91	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-12T13:41:56.037Z", "originalDeposit": "11.00"}	2025-04-12 13:41:56.074	2025-04-12 13:42:03.21	\N	\N	\N	\N
66	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	83	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	7800986	0x8a4829c16a7c3c012589189e16e7a2756dae60f4d05bdb66a50af9699ae27af2	ethereum	confirmed	https://etherscan.io/tx/0x8a4829c16a7c3c012589189e16e7a2756dae60f4d05bdb66a50af9699ae27af2	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-18T10:07:42.363Z", "originalDeposit": "1000.00"}	2025-04-18 10:07:42.378	2025-04-18 10:07:49.434	\N	\N	\N	\N
67	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	84	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3546956	0xaafd0d4bcd211a844ac76dcbc2a66f309be4ce70a9343a2869d2a9c8f7519494	ethereum	confirmed	https://etherscan.io/tx/0xaafd0d4bcd211a844ac76dcbc2a66f309be4ce70a9343a2869d2a9c8f7519494	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-18T10:14:08.806Z", "originalDeposit": "1200.00"}	2025-04-18 10:14:08.821	2025-04-18 10:14:15.868	\N	\N	\N	\N
68	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	85	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6246199	0x779916fe96abc977fd65e3d237eee1d68541919b385c10bbcd76bb54058de733	ethereum	confirmed	https://etherscan.io/tx/0x779916fe96abc977fd65e3d237eee1d68541919b385c10bbcd76bb54058de733	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-18T10:16:57.031Z", "originalDeposit": "1200.00"}	2025-04-18 10:16:57.046	2025-04-18 10:17:04.091	\N	\N	\N	\N
69	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	86	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1104182	0x9212d75c9bbd1cb2f2f90fb80390a44595b40381c3a1d2835c5ab71c02568588	ethereum	confirmed	https://etherscan.io/tx/0x9212d75c9bbd1cb2f2f90fb80390a44595b40381c3a1d2835c5ab71c02568588	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-18T10:27:35.003Z", "originalDeposit": "1000.00"}	2025-04-18 10:27:35.018	2025-04-18 10:27:42.063	\N	\N	\N	\N
70	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	87	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6106531	0x971ea9d92b78e574226cae1e0bbd6b834bd4440bd84b7a4f9e5b243ea7c560b2	ethereum	confirmed	https://etherscan.io/tx/0x971ea9d92b78e574226cae1e0bbd6b834bd4440bd84b7a4f9e5b243ea7c560b2	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-21T10:15:57.579Z", "originalDeposit": "10000.00"}	2025-04-21 10:15:57.595	2025-04-21 10:16:04.664	\N	\N	\N	\N
71	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	96	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	7892173	0x562d1e0c3ed234573e6581a0589e2a146b738d922edb7ee38c52721eb7818a6c	ethereum	confirmed	https://etherscan.io/tx/0x562d1e0c3ed234573e6581a0589e2a146b738d922edb7ee38c52721eb7818a6c	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-29T08:27:13.462Z", "originalDeposit": "1.00"}	2025-04-29 08:27:13.479	2025-04-29 08:27:20.613	\N	\N	\N	\N
72	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	97	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2705524	0x2fc745e3458b411239057d1bdf272ff50945f3d75feedda954ab1185611dd191	ethereum	confirmed	https://etherscan.io/tx/0x2fc745e3458b411239057d1bdf272ff50945f3d75feedda954ab1185611dd191	\N	\N	t	{"priceRange": {}, "creationDate": "2025-04-29T09:56:40.391Z", "originalDeposit": "5000.00"}	2025-04-29 09:56:40.407	2025-04-29 09:56:47.609	\N	\N	\N	\N
73	0x8aaa8b6e3385333b1753c4075111996ceb150644	103	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6476160	0x0fa4da348d1c748a2c1a5e4258f412bb49bf7f943d84057ce7de13c0a6b00e49	ethereum	confirmed	https://etherscan.io/tx/0x0fa4da348d1c748a2c1a5e4258f412bb49bf7f943d84057ce7de13c0a6b00e49	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-06T09:48:59.975Z", "originalDeposit": "100.00"}	2025-05-06 09:48:59.993	2025-05-06 09:49:07.091	\N	\N	\N	\N
74	0x8aaa8b6e3385333b1753c4075111996ceb150644	106	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6682621	0x3f29354462f1d03fcf9a3147866ed1e1fc79c452f16fc93bf6f7527b202191cb	ethereum	confirmed	https://etherscan.io/tx/0x3f29354462f1d03fcf9a3147866ed1e1fc79c452f16fc93bf6f7527b202191cb	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-06T16:58:00.801Z", "originalDeposit": "5000.00"}	2025-05-06 16:58:00.818	2025-05-06 16:58:07.898	\N	\N	\N	\N
75	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	108	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1588578	0xeca3b03aadd4035a166cbf52bc9fbfd6ad9253bbbef6fa3a731ee70d976af140	ethereum	confirmed	https://etherscan.io/tx/0xeca3b03aadd4035a166cbf52bc9fbfd6ad9253bbbef6fa3a731ee70d976af140	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-07T20:22:16.348Z", "originalDeposit": "1.00"}	2025-05-07 20:22:16.363	2025-05-07 20:22:23.413	\N	\N	\N	\N
76	0x8aaa8b6e3385333b1753c4075111996ceb150644	109	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8276214	0xd4726696db2aa3b65788bcf0b8d2857762c3400fc98f011eadadbada0d08fb4f	ethereum	confirmed	https://etherscan.io/tx/0xd4726696db2aa3b65788bcf0b8d2857762c3400fc98f011eadadbada0d08fb4f	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-08T18:37:42.360Z", "originalDeposit": "5000.00"}	2025-05-08 18:37:42.376	2025-05-08 18:37:49.455	\N	\N	\N	\N
77	0x8aaa8b6e3385333b1753c4075111996ceb150644	110	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2074339	0x02f20d82ace36462bb4a8327f9e60558fc911ba9e92e7d78ab071dfa37f113b9	ethereum	confirmed	https://etherscan.io/tx/0x02f20d82ace36462bb4a8327f9e60558fc911ba9e92e7d78ab071dfa37f113b9	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-08T18:40:54.374Z", "originalDeposit": "3000.00"}	2025-05-08 18:40:54.392	2025-05-08 18:41:01.538	\N	\N	\N	\N
78	0x8aaa8b6e3385333b1753c4075111996ceb150644	111	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1640213	0xaf271b414cfcc82c2ae99058fb7dc6c33f4aa969752457d194380603ba2d2ce5	ethereum	confirmed	https://etherscan.io/tx/0xaf271b414cfcc82c2ae99058fb7dc6c33f4aa969752457d194380603ba2d2ce5	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-09T08:40:57.368Z", "originalDeposit": "1000.00"}	2025-05-09 08:40:57.384	2025-05-09 08:41:04.452	\N	\N	\N	\N
79	0x8aaa8b6e3385333b1753c4075111996ceb150644	112	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3177772	0x2e65dac9656df88dda83e972336c86c987285d208019b5728abf0ed87a3c0861	ethereum	confirmed	https://etherscan.io/tx/0x2e65dac9656df88dda83e972336c86c987285d208019b5728abf0ed87a3c0861	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-09T08:42:05.396Z", "originalDeposit": "1000.00"}	2025-05-09 08:42:05.412	2025-05-09 08:42:12.475	\N	\N	\N	\N
80	0x8aaa8b6e3385333b1753c4075111996ceb150644	113	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8800723	0x35b3ca3c586c09955c8b69454de7548a67255cc6a84d258da1e99b5c72377b64	ethereum	confirmed	https://etherscan.io/tx/0x35b3ca3c586c09955c8b69454de7548a67255cc6a84d258da1e99b5c72377b64	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-09T08:43:53.467Z", "originalDeposit": "1000.00"}	2025-05-09 08:43:53.49	2025-05-09 08:44:00.553	\N	\N	\N	\N
81	0x8aaa8b6e3385333b1753c4075111996ceb150644	114	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5791050	0x88f6d5859ae78c64e8cc515d0ab6d1aa7660322e96d95faf8a9d9dbe941f8a7f	ethereum	confirmed	https://etherscan.io/tx/0x88f6d5859ae78c64e8cc515d0ab6d1aa7660322e96d95faf8a9d9dbe941f8a7f	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-09T08:47:19.995Z", "originalDeposit": "2000.00"}	2025-05-09 08:47:20.009	2025-05-09 08:47:27.084	\N	\N	\N	\N
82	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	115	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4559842	0x1645431521661ae2e0eb2699a64abd2c8873e74be47949ea7713cb34af74cbe4	ethereum	confirmed	https://etherscan.io/tx/0x1645431521661ae2e0eb2699a64abd2c8873e74be47949ea7713cb34af74cbe4	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-11T13:01:00.277Z", "originalDeposit": "1.00"}	2025-05-11 13:01:00.293	2025-05-11 13:01:07.346	\N	\N	\N	\N
83	0xfc065ed0904e750c18288060bab3af32e855d307	117	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9145047	0xe17db0574c05c10e14c1db296dc93c9ced302df20785cd34f76ab59dd998610c	ethereum	confirmed	https://etherscan.io/tx/0xe17db0574c05c10e14c1db296dc93c9ced302df20785cd34f76ab59dd998610c	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-13T12:04:13.668Z", "originalDeposit": "107670.00"}	2025-05-13 12:04:13.685	2025-05-13 12:04:20.766	\N	\N	\N	\N
84	0x8aaa8b6e3385333b1753c4075111996ceb150644	123	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2111369	0xde327890e41d3a7ca439ed281c31e42517a3bc0c71505e4a32e405cbed21ee91	ethereum	confirmed	https://etherscan.io/tx/0xde327890e41d3a7ca439ed281c31e42517a3bc0c71505e4a32e405cbed21ee91	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-20T09:21:54.902Z", "originalDeposit": "2000.00"}	2025-05-20 09:21:54.92	2025-05-20 09:22:02.128	\N	\N	\N	\N
85	0x8aaa8b6e3385333b1753c4075111996ceb150644	124	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5197961	0x8db9f9782ac9a57ea5686dc942da72d07b43a4130eae72af115546ca400e51a9	ethereum	confirmed	https://etherscan.io/tx/0x8db9f9782ac9a57ea5686dc942da72d07b43a4130eae72af115546ca400e51a9	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-20T09:25:23.033Z", "originalDeposit": "3000.00"}	2025-05-20 09:25:23.051	2025-05-20 09:25:30.13	\N	\N	\N	\N
86	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	125	0x88e6a0c2ddd26feeb64f039a2c41296fcb3f5640	USDC/ETH	USDC	ETH	0.01	0.001	2877936	0x1645b09fbb288afcd48889df3d05da21875b47d764fb72cf01ad8b69303a5ab1	ethereum	confirmed	https://etherscan.io/tx/0x1645b09fbb288afcd48889df3d05da21875b47d764fb72cf01ad8b69303a5ab1	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-24T11:31:15.685Z", "originalDeposit": "1.00"}	2025-05-24 11:31:15.703	2025-05-24 11:31:22.776	\N	\N	\N	\N
87	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	126	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4866795	0xfa8da8a4cc3499091e43529bbb7ec2090ad0dfd2bcbb513af2698ff125fff250	ethereum	confirmed	https://etherscan.io/tx/0xfa8da8a4cc3499091e43529bbb7ec2090ad0dfd2bcbb513af2698ff125fff250	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-24T13:04:58.682Z", "originalDeposit": "1.00"}	2025-05-24 13:04:58.696	2025-05-24 13:05:05.752	\N	\N	\N	\N
88	0x7ee905e3a0132cf867a78aa9ccfa6c49cfdda066	129	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4427061	0xfc703c9ef5d2f433c326258e7880b20393e4cbce080191f604b0ed64b5c00fbf	ethereum	confirmed	https://etherscan.io/tx/0xfc703c9ef5d2f433c326258e7880b20393e4cbce080191f604b0ed64b5c00fbf	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-26T09:12:35.691Z", "originalDeposit": "160000.00"}	2025-05-26 09:12:35.723	2025-05-26 09:12:42.792	\N	\N	\N	\N
89	0x07311cb30a4d5faa239db6b55cc1c70879a66385	130	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6584760	0x72ac55dd3161229d8ece891ea213176a09b927e7c9bfe73f560ff9dcce48c2c6	ethereum	confirmed	https://etherscan.io/tx/0x72ac55dd3161229d8ece891ea213176a09b927e7c9bfe73f560ff9dcce48c2c6	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-27T07:11:15.643Z", "originalDeposit": "10000.00"}	2025-05-27 07:11:15.662	2025-05-27 07:11:22.904	\N	\N	\N	\N
90	0x3d85fda5ea53e190404210a91150a1ddf463741f	131	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3220305	0xeb10925b8cb2213cc7c5745ad382f6b585d40485a78022432a246bbb74fe10af	ethereum	confirmed	https://etherscan.io/tx/0xeb10925b8cb2213cc7c5745ad382f6b585d40485a78022432a246bbb74fe10af	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-27T07:27:21.747Z", "originalDeposit": "200.00"}	2025-05-27 07:27:21.763	2025-05-27 07:27:28.935	\N	\N	\N	\N
91	0x3d85fda5ea53e190404210a91150a1ddf463741f	132	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5666555	0x213c9189d96b7cfcfd951efee64748c091d8233767f21f22ed95b3552c842828	ethereum	confirmed	https://etherscan.io/tx/0x213c9189d96b7cfcfd951efee64748c091d8233767f21f22ed95b3552c842828	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-27T07:28:27.207Z", "originalDeposit": "25000.00"}	2025-05-27 07:28:27.223	2025-05-27 07:28:34.287	\N	\N	\N	\N
92	0x3d85fda5ea53e190404210a91150a1ddf463741f	136	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3449347	0x5d1bf2af0458e3d80e8f53a5099127ebd0a8b3ffe2af4158592b6543125f9d82	ethereum	confirmed	https://etherscan.io/tx/0x5d1bf2af0458e3d80e8f53a5099127ebd0a8b3ffe2af4158592b6543125f9d82	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-27T08:25:59.684Z", "originalDeposit": "1.00"}	2025-05-27 08:25:59.7	2025-05-27 08:26:07.002	\N	\N	\N	\N
93	0x3d85fda5ea53e190404210a91150a1ddf463741f	137	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4894588	0xb324a018d4d6be838709c7c621c844b2b35b9c698aed5a82134262677d2f1994	ethereum	confirmed	https://etherscan.io/tx/0xb324a018d4d6be838709c7c621c844b2b35b9c698aed5a82134262677d2f1994	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-27T08:26:25.018Z", "originalDeposit": "25000.00"}	2025-05-27 08:26:25.039	2025-05-27 08:26:32.117	\N	\N	\N	\N
94	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	141	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6299568	0x6d107f6fb4b7f1bae9533829bcad7559a1a52af6bf79ec824099e55984df5b6d	ethereum	confirmed	https://etherscan.io/tx/0x6d107f6fb4b7f1bae9533829bcad7559a1a52af6bf79ec824099e55984df5b6d	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-28T11:54:12.515Z", "originalDeposit": "2000.00"}	2025-05-28 11:54:12.532	2025-05-28 11:54:19.625	\N	\N	\N	\N
95	0x0bd58ac07642fbc4562e5d107b353ae5fa65c8f1	144	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5579411	0xc1b64748e639b02384778f34262793f0e67e70f7ab6b073927e984287a2eb3a7	ethereum	confirmed	https://etherscan.io/tx/0xc1b64748e639b02384778f34262793f0e67e70f7ab6b073927e984287a2eb3a7	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-29T09:27:56.849Z", "originalDeposit": "7000.00"}	2025-05-29 09:27:56.865	2025-05-29 09:28:03.972	\N	\N	\N	\N
96	0xd268039ced2a505a1711089da83e464a95d2856a	145	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3072091	0xfc9be1214216e68078f68c88bda5aff90194ff80e820e9424cca8a42571774eb	ethereum	confirmed	https://etherscan.io/tx/0xfc9be1214216e68078f68c88bda5aff90194ff80e820e9424cca8a42571774eb	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-29T09:29:46.280Z", "originalDeposit": "10000.00"}	2025-05-29 09:29:46.296	2025-05-29 09:29:53.361	\N	\N	\N	\N
97	0xd268039ced2a505a1711089da83e464a95d2856a	146	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9708849	0x2139f4cba7512eb29ab276fa2ad177399090a61e83be3d33567808b609d2275a	ethereum	confirmed	https://etherscan.io/tx/0x2139f4cba7512eb29ab276fa2ad177399090a61e83be3d33567808b609d2275a	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-29T09:37:01.336Z", "originalDeposit": "6000.00"}	2025-05-29 09:37:01.352	2025-05-29 09:37:08.469	\N	\N	\N	\N
98	0x75470ca3fd1da06d93a9bd91981e6824e7be2391	147	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2419945	0x042507367eed0e82e4f0f6609a8fa87dfc5151406ac540d3e55ad33c5423f3a9	ethereum	confirmed	https://etherscan.io/tx/0x042507367eed0e82e4f0f6609a8fa87dfc5151406ac540d3e55ad33c5423f3a9	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-29T09:39:07.650Z", "originalDeposit": "10000.00"}	2025-05-29 09:39:07.666	2025-05-29 09:39:14.839	\N	\N	\N	\N
99	0x7de2eb01f97b2326c6b679354f262526358ef759	148	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6389605	0x52e78ab93d926408770861e30e18f66540ff61227b1f88ac6f082f81efb9b593	ethereum	confirmed	https://etherscan.io/tx/0x52e78ab93d926408770861e30e18f66540ff61227b1f88ac6f082f81efb9b593	\N	\N	t	{"priceRange": {}, "creationDate": "2025-05-29T09:41:37.890Z", "originalDeposit": "10000.00"}	2025-05-29 09:41:37.906	2025-05-29 09:41:44.971	\N	\N	\N	\N
100	0x8e2517df89b7e662a46dce6e7490342d0bf620e8	272	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1581490	0x5da2709b15af521acc62289de91d10e61c06921fe7ccbb4e01d0adf874508c70	ethereum	confirmed	https://etherscan.io/tx/0x5da2709b15af521acc62289de91d10e61c06921fe7ccbb4e01d0adf874508c70	\N	\N	t	{"priceRange": {}, "creationDate": "2025-08-02T19:48:30.371Z", "originalDeposit": "100.00"}	2025-08-02 19:48:30.392	2025-08-02 19:48:37.484	\N	\N	\N	\N
101	0x8e2517df89b7e662a46dce6e7490342d0bf620e8	273	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3090844	0x513f7039c0d16e84a47fb003f09a7986feb87a833b9ad5620cc1cb7ebbd111fd	ethereum	confirmed	https://etherscan.io/tx/0x513f7039c0d16e84a47fb003f09a7986feb87a833b9ad5620cc1cb7ebbd111fd	\N	\N	t	{"priceRange": {}, "creationDate": "2025-08-02T19:51:42.137Z", "originalDeposit": "100.00"}	2025-08-02 19:51:42.156	2025-08-02 19:51:49.446	\N	\N	\N	\N
102	0x8e2517df89b7e662a46dce6e7490342d0bf620e8	274	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2604847	0x7f67de165e9fa6fda96559bf26d959d3324443a0363d4e1f3e3ece30224f41cd	ethereum	confirmed	https://etherscan.io/tx/0x7f67de165e9fa6fda96559bf26d959d3324443a0363d4e1f3e3ece30224f41cd	\N	\N	t	{"priceRange": {}, "creationDate": "2025-08-02T19:59:12.658Z", "originalDeposit": "100.00"}	2025-08-02 19:59:12.678	2025-08-02 19:59:19.745	\N	\N	\N	\N
103	0x8e2517df89b7e662a46dce6e7490342d0bf620e8	275	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9670128	0x52a8232f7650f45d5a000a31d2643c566dc018e30d26531d9f8bf1fdbf7ffd3a	ethereum	confirmed	https://etherscan.io/tx/0x52a8232f7650f45d5a000a31d2643c566dc018e30d26531d9f8bf1fdbf7ffd3a	\N	\N	t	{"priceRange": {}, "creationDate": "2025-08-10T13:53:24.369Z", "originalDeposit": "100.00"}	2025-08-10 13:53:24.389	2025-08-10 13:53:31.502	\N	\N	\N	\N
104	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	295	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4054455	0x5bc12ebd0ac90dca4655dc2fcdc70e2139a7c70c634f6ce459b630c309505e63	ethereum	confirmed	https://etherscan.io/tx/0x5bc12ebd0ac90dca4655dc2fcdc70e2139a7c70c634f6ce459b630c309505e63	\N	\N	t	{"priceRange": {}, "creationDate": "2025-09-11T10:18:46.486Z", "originalDeposit": "6000.00"}	2025-09-11 10:18:46.504	2025-09-11 10:18:53.874	\N	\N	\N	\N
105	0x9ed9f5b0da78216a648fee8de16479c0aefeb25b	296	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6064394	0xc63b912295fecc48a8e8eb89e004ef024776b91e6ff261a60468f388d9e7b52b	ethereum	confirmed	https://etherscan.io/tx/0xc63b912295fecc48a8e8eb89e004ef024776b91e6ff261a60468f388d9e7b52b	\N	\N	t	{"priceRange": {}, "creationDate": "2025-09-14T09:10:27.963Z", "originalDeposit": "100.00"}	2025-09-14 09:10:27.981	2025-09-14 09:10:35.075	\N	\N	\N	\N
106	0x9ed9f5b0da78216a648fee8de16479c0aefeb25b	297	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	4759689	0x6543762efddcb9b8b9ccdd562ccfc68df1ee2c98db21ee723f92d49e9428882a	ethereum	confirmed	https://etherscan.io/tx/0x6543762efddcb9b8b9ccdd562ccfc68df1ee2c98db21ee723f92d49e9428882a	\N	\N	t	{"priceRange": {}, "creationDate": "2025-09-14T09:24:36.557Z", "originalDeposit": "50.00"}	2025-09-14 09:24:36.575	2025-09-14 09:24:44.074	\N	\N	\N	\N
107	0xb6c98ddf3668f579c2fb28f3bf6209b18433e297	298	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	9443956	0x024b33b34dcec464bfc51c65eff82bce8c72f2a7e1e25573c3d76d7cfd7972ec	ethereum	confirmed	https://etherscan.io/tx/0x024b33b34dcec464bfc51c65eff82bce8c72f2a7e1e25573c3d76d7cfd7972ec	\N	\N	t	{"priceRange": {}, "creationDate": "2025-09-14T10:01:12.492Z", "originalDeposit": "100.00"}	2025-09-14 10:01:12.511	2025-09-14 10:01:22.889	\N	\N	\N	\N
108	0xb6c98ddf3668f579c2fb28f3bf6209b18433e297	299	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	3039597	0x23dbf7fd071e706fd103bd952d87a057e724ec5bce45d93763c758c9f0ed8c4e	ethereum	confirmed	https://etherscan.io/tx/0x23dbf7fd071e706fd103bd952d87a057e724ec5bce45d93763c758c9f0ed8c4e	\N	\N	t	{"priceRange": {}, "creationDate": "2025-09-14T10:07:01.646Z", "originalDeposit": "100.00"}	2025-09-14 10:07:01.663	2025-09-14 10:07:08.733	\N	\N	\N	\N
109	0xb6c98ddf3668f579c2fb28f3bf6209b18433e297	300	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	5106664	0x99477319dbe80f1c0ccbebffedd50e4d6d79a46462ac42fa03a2bdf56a89a1df	ethereum	confirmed	https://etherscan.io/tx/0x99477319dbe80f1c0ccbebffedd50e4d6d79a46462ac42fa03a2bdf56a89a1df	\N	\N	t	{"priceRange": {}, "creationDate": "2025-09-14T10:08:28.021Z", "originalDeposit": "100.00"}	2025-09-14 10:08:28.038	2025-09-14 10:08:35.109	\N	\N	\N	\N
110	0xd44e7aac81c9d4d2a486df60b03de02638dc7bd7	302	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	2852075	0x024be15c3694a94467393a97360c688e2a16d18e3d3368c1209d7c845ffb3844	ethereum	confirmed	https://etherscan.io/tx/0x024be15c3694a94467393a97360c688e2a16d18e3d3368c1209d7c845ffb3844	\N	\N	t	{"priceRange": {}, "creationDate": "2025-09-15T16:18:23.398Z", "originalDeposit": "10000.00"}	2025-09-15 16:18:23.416	2025-09-15 16:18:30.487	\N	\N	\N	\N
111	0xec370896441ecd15fc5b216edd1b6af02346200f	312	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	1489057	0xa045413adac37aba347472c1c1c900ba271fe55cc3138250227de10478e1d516	ethereum	confirmed	https://etherscan.io/tx/0xa045413adac37aba347472c1c1c900ba271fe55cc3138250227de10478e1d516	\N	\N	t	{"priceRange": {}, "creationDate": "2025-10-01T15:15:17.648Z", "originalDeposit": "1000.00"}	2025-10-01 15:15:17.671	2025-10-01 15:15:25.439	\N	\N	\N	\N
112	0x9dae8525796c538990cf71733460d61f9cfc3776	322	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8885467	0xa33b2f1ddd9cce0c653f9088f2aa8de5987aabe17311372b5dc01add06f34558	ethereum	confirmed	https://etherscan.io/tx/0xa33b2f1ddd9cce0c653f9088f2aa8de5987aabe17311372b5dc01add06f34558	\N	\N	t	{"priceRange": {}, "creationDate": "2025-10-20T12:41:28.371Z", "originalDeposit": "20000.00"}	2025-10-20 12:41:28.39	2025-10-20 12:41:35.93	\N	\N	\N	\N
113	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	328	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	8853276	0xcc8d2810456b0c71c5fdb1a8557948846e3a586d074876d4af286c06b0498d0b	ethereum	confirmed	https://etherscan.io/tx/0xcc8d2810456b0c71c5fdb1a8557948846e3a586d074876d4af286c06b0498d0b	\N	\N	t	{"priceRange": {}, "creationDate": "2025-11-14T19:45:26.852Z", "originalDeposit": "10000.00"}	2025-11-14 19:45:26.873	2025-11-14 19:45:33.957	\N	\N	\N	\N
114	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	329	0x4e68ccd3e89f51c3074ca5072bbac773960dfa36	USDC/ETH	USDC	ETH	0.01	0.001	6298015	0x3ae63ca2f84eb5d682ca870c09efce9d1784d48ecd5f0f54f47e3bb302d91774	ethereum	confirmed	https://etherscan.io/tx/0x3ae63ca2f84eb5d682ca870c09efce9d1784d48ecd5f0f54f47e3bb302d91774	\N	\N	t	{"priceRange": {}, "creationDate": "2025-11-14T19:45:43.207Z", "originalDeposit": "10000.00"}	2025-11-14 19:45:43.227	2025-11-14 19:45:50.298	\N	\N	\N	\N
\.


--
-- Data for Name: referral_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.referral_subscribers (id, email, language, name, referral_code, active, last_email_sent_at, created_at, updated_at) FROM stdin;
1	lballanti.lb@gmail.com	es	Lorenzo	\N	t	2025-05-08 13:33:13.504	2025-05-08 13:33:13.504	2025-05-08 13:33:13.504
2	info@lorenzoballanti.com	es	Lorenzo	\N	t	2025-05-08 13:44:10.064	2025-05-08 13:44:10.064	2025-05-08 13:44:10.064
\.


--
-- Data for Name: referrals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.referrals (id, referral_code, wallet_address, total_rewards, created_at, updated_at) FROM stdin;
1	6b22ce-bbcg-m95ulj6h	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	0.00	2025-04-06 16:19:35.145	2025-04-06 16:19:35.145
2	825a23-n01e-m967ht3s	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	0.00	2025-04-06 22:20:36.413	2025-04-06 22:20:36.413
3	b6bca9-7l5u-ma2w7cis	0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6	0.00	2025-04-29 19:20:56.371	2025-04-29 19:20:56.371
4	c2dd65-ts8p-ma8atftd	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	0.00	2025-05-03 14:08:52.576	2025-05-03 14:08:52.576
5	c3a049-qxko-ma8d3aap	0xc3a049b80a44312a964197829cb82f24d72ed6c7	0.00	2025-05-03 15:12:31.217	2025-05-03 15:12:31.217
6	e19adf-sg48-ma8lqmpx	0xe19adf4350a59dca68013e28cf41e7fcae051b95	0.00	2025-05-03 19:14:37.334	2025-05-03 19:14:37.334
7	2abdce-tiqj-ma9j9fyo	0x2abdce11450920d491e32c258c4d5f3fcdc51874	0.00	2025-05-04 10:53:02.369	2025-05-04 10:53:02.369
8	8c571c-epom-maamz5zw	0x8c571caec312743702ef5f7a89825f1395ffd1a5	0.00	2025-05-05 05:24:47.623	2025-05-05 05:24:47.623
9	b30bfc-a9z5-maaspra5	0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b	0.00	2025-05-05 08:05:26.252	2025-05-05 08:05:26.252
10	8ce773-dzfv-mac1tsso	0x8ce77381d312b58e3af61972ad02a1b69355291a	0.00	2025-05-06 05:08:17.56	2025-05-06 05:08:17.56
11	3d85fd-ma96-mac478gc	0x3d85fda5ea53e190404210a91150a1ddf463741f	0.00	2025-05-06 06:14:43.612	2025-05-06 06:14:43.612
12	ad4474-teqn-mac756nq	0xad4474df3230a95a39d9937ab0ad91113972204a	0.00	2025-05-06 07:37:06.824	2025-05-06 07:37:06.824
13	8aaa8b-6qpo-macbsd1g	0x8aaa8b6e3385333b1753c4075111996ceb150644	0.00	2025-05-06 09:47:06.644	2025-05-06 09:47:06.644
14	a492f5-3705-madx433j	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	0.00	2025-05-07 12:31:51.743	2025-05-07 12:31:51.743
15	c12705-55pv-mae7zpuq	0xc12705de58d486ce0a7e015679b1bb78245a9842	0.00	2025-05-07 17:36:23.73	2025-05-07 17:36:23.73
16	4c9147-gwlf-maea4k83	0x4c914790ea45f39ff3d76456815acb7bdd06c318	0.00	2025-05-07 18:36:08.948	2025-05-07 18:36:08.948
17	e2cce8-rt7l-maf9pwyv	0xe2cce86f759aa8d616013a38e7e9db4054534f25	0.00	2025-05-08 11:12:31.801	2025-05-08 11:12:31.801
\.


--
-- Data for Name: referred_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.referred_users (id, referral_id, referred_wallet_address, joined_at, status, earned_rewards, apr_boost) FROM stdin;
2	2	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	2025-04-07 07:48:47.549	active	0.00	1.01
1	1	0x825a23354fef0f82fedc0da599be8ccb3c4e8e28	2025-04-06 23:33:35.756	active	0.04	1.01
3	1	0xc2dd65af9fed4a01fb8764d65c591077f02c6497	2025-05-21 19:58:08.456	active	0.00	1.01
4	11	0xad4474df3230a95a39d9937ab0ad91113972204a	2025-05-22 05:47:48.95	active	0.00	1.01
5	11	0x4869ce8eaead8429dcc7736535c8444b05186711	2025-05-22 05:50:54.269	active	0.00	1.01
6	11	0x6a3dd94845a56fab9b76908528a4097e6c03969b	2025-05-23 05:06:24.252	active	0.00	1.01
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.support_tickets (id, ticket_number, wallet_address, subject, category, status, priority, created_at, updated_at, closed_at, is_deleted, description, unread_by_user, unread_by_admin, last_read_by_user, last_read_by_admin) FROM stdin;
8	WB70453946	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Test subject	Account Issues	open	high	2025-04-21 16:58:24.555	2025-04-21 17:02:50.574	\N	t	UTDJEDJF HFSJRZXN HFUFUFUYF	f	f	\N	2025-04-21 17:02:30.096
2	WB30050839	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Test subject	Feature Request	closed	medium	2025-04-03 08:35:00.524	2025-04-03 15:38:37.939	2025-04-03 08:39:21.054	t	\N	f	f	\N	\N
1	WB70874965	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Prueba de ticket	Technical Support	closed	high	2025-04-03 08:25:08.765	2025-04-03 15:45:14.733	2025-04-03 09:13:37.327	t	\N	f	f	\N	\N
3	WB28740168	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Test subject	Technical Support	closed	low	2025-04-04 11:48:07.417	2025-04-04 11:50:01.133	2025-04-04 11:50:01.133	t	\N	f	f	\N	\N
10	WB23366642	0x10707496c28a429183390cda2677ebc4bd37a874	Contraseña	Technical Support	closed	urgent	2025-05-19 09:00:33.683	2025-05-22 09:25:34.458	2025-05-19 16:38:34.548	f	No me deja acceder con mi contraseña 	t	f	\N	2025-05-22 09:25:34.458
4	WB07909375	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Test subject	Account Issues	closed	urgent	2025-04-05 23:51:19.109	2025-04-14 13:12:12.187	2025-04-06 00:27:43.082	t	Esta es una prueba, quiero saber si funciona	f	f	2025-04-06 00:37:13.106	2025-04-06 00:37:18.05
5	WB18401567	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Test subject	general	closed	medium	2025-04-06 00:26:24.03	2025-04-14 13:12:14.851	2025-04-06 14:17:34.232	t	jgljgl	f	f	2025-04-06 14:20:52.289	2025-04-06 00:37:20.713
6	WB40080841	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Test subject	Payment Problems	closed	low	2025-04-08 08:20:00.825	2025-04-14 13:12:20.013	2025-04-08 08:35:57.485	t	wdqweyhry	f	f	2025-04-08 08:35:14.999	2025-04-08 08:35:50.781
9	WB05029689	0x6b22ceb508db3c81d69ed6451d63b56a1fb7271f	Estoy probando	Technical Support	closed	medium	2025-05-10 14:40:50.312	2025-05-19 09:09:30.236	2025-05-10 14:48:14.469	t	jkgvglghlgl	f	f	2025-05-10 14:48:05.643	2025-05-19 06:45:39.612
7	WB49754348	0x8ce77381d312b58e3af61972ad02a1b69355291a	No se ven las pools	Technical Support	closed	urgent	2025-04-10 09:48:17.561	2025-05-19 09:09:33.349	2025-04-18 06:07:00.385	t	Hola Lorenzo, está igual que el otro día, no se pueden ver las pools, no has podido solucionarlo? ya me dices	f	f	2025-04-18 08:12:17.63	2025-04-18 09:01:10.168
\.


--
-- Data for Name: ticket_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ticket_messages (id, ticket_id, sender, message, attachment_url, created_at, is_deleted) FROM stdin;
1	1	user	Este es un mensaje de prueba para el ticket	\N	2025-04-03 08:25:12.834	f
2	3	admin	qeqweqeqe	\N	2025-04-04 11:49:04.758	f
3	3	user	weqweqweq	\N	2025-04-04 11:49:14.978	f
4	4	admin	hola esta es la respuesta del admin	\N	2025-04-05 23:56:13.563	f
5	4	user	ok, perfecto, yo soy el usuario	\N	2025-04-05 23:56:34.985	f
6	4	user	hi	\N	2025-04-06 00:04:31.893	f
7	4	admin	pos eso	\N	2025-04-06 00:04:51.789	f
8	6	admin	hola mundo	\N	2025-04-08 08:34:58.523	f
9	6	user	hola de nuevo	\N	2025-04-08 08:35:24.445	f
10	7	admin	Revisa de nuevo. Ya deberias poder visualizar las Pools	\N	2025-04-14 13:12:53.296	f
11	7	user	Tienes razón, gracias por la solucion tan rápida!	\N	2025-04-18 06:06:57.313	f
12	9	admin	bkbkbkj	\N	2025-05-10 14:41:14.578	f
13	10	admin	Estamos revisando el proceso de recuperación de contraseñas y le daremos respuesta en breve.	\N	2025-05-19 09:08:52.982	f
14	10	admin	Buenas, cuando puedas intenta restablecer la contraseña y confirma si has podido acceder con la nueva.	\N	2025-05-19 10:41:39.649	f
15	10	admin	Sistema de recuperación de contraseñas solucionado.	\N	2025-05-19 16:38:26.211	f
\.


--
-- Data for Name: timeframe_adjustments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.timeframe_adjustments (id, timeframe, adjustment_percentage, description, updated_at, updated_by) FROM stdin;
1	30	-24.56	Adjustment for 1 month timeframe	2025-12-19 09:20:55.453472	system
2	90	-17.37	Adjustment for 3 months timeframe	2025-12-19 09:20:55.611661	system
3	365	-4.52	Adjustment for 1 year timeframe	2025-12-19 09:20:55.767852	system
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, wallet_address, theme, default_network, is_admin, created_at, updated_at, has_accepted_legal_terms, legal_terms_accepted_at, terms_of_use_accepted, privacy_policy_accepted, disclaimer_accepted, referral_code, username, harvest_percentage, language, referral_date, email, referred_by, wallet_display, gas_preference, auto_harvest) FROM stdin;
222	0x53c439fa6e77e82d06777d33d930243f14c6cec7	dark	ethereum	f	2026-01-16 12:04:04.148619	2026-01-16 12:04:04.148619	f	\N	f	f	f	\N	user_53c439	100	es	\N	\N	\N	shortened	standard	f
1754	0x7ee905e3a0132cf867a78aa9ccfa6c49cfdda066	dark	ethereum	t	2025-12-19 10:56:09.996949	2025-12-19 10:56:09.996949	t	2025-04-07 11:33:53.33	t	t	t	\N	user_7ee905	100	es	\N	jaredballanti97@gmail.com	\N	shortened	standard	f
1759	0x8ce77381d312b58e3af61972ad02a1b69355291a	dark	ethereum	t	2025-12-19 10:56:09.936752	2025-12-19 10:56:09.936752	t	2025-04-08 07:20:26.643	t	t	t	\N	user_8ce773	100	es	\N	cristian199833@hotmail.es	\N	shortened	standard	f
3129	0xe19adf4350a59dca68013e28cf41e7fcae051b95	system	polygon	f	2025-12-19 10:56:10.014101	2025-12-19 10:56:10.014101	t	2025-04-22 21:37:50.549	t	t	t	\N	user_0xE19AdF	100	es	\N	ymcmusic55@gmail.com	\N	shortened	standard	f
3589	0x2abdce11450920d491e32c258c4d5f3fcdc51874	dark	ethereum	f	2025-12-19 10:56:10.010906	2025-12-19 10:56:10.010906	t	2025-04-24 09:29:04.066	t	t	t	\N	user_2abdce	100	es	\N	anamartinezgarcia6@gmail.com	\N	shortened	standard	f
3590	0xc3a049b80a44312a964197829cb82f24d72ed6c7	light	ethereum	f	2025-12-19 10:56:10.003878	2025-12-19 10:56:10.003878	t	2025-04-24 09:48:34.207	t	t	t	\N	user_c3a049	100	es	\N	carlesberini@gmail.com	\N	shortened	standard	f
3660	0xc12705de58d486ce0a7e015679b1bb78245a9842	dark	ethereum	f	2025-12-19 10:56:10.016482	2025-12-19 10:56:10.016482	t	2025-04-24 15:45:21.244	t	t	t	\N	user_c12705	100	es	\N	ainacanizalmartinez@gmail.com	\N	shortened	standard	f
3783	0xb31eec9828aabfdebca889dae56fe6bb56b58c94	dark	ethereum	f	2025-12-19 10:56:10.007044	2025-12-19 10:56:10.007044	t	2025-04-26 10:34:29.706	t	t	t	\N	user_b31eec	100	es	\N	yvannaquijandria@gmail.com	\N	shortened	standard	f
3806	0x8408bee8cc983917ceae498a3cfc05590bc0c7a5	dark	ethereum	f	2025-12-19 10:56:10.003938	2025-12-19 10:56:10.003938	t	2025-04-26 11:36:33.662	t	t	t	\N	user_8408be	100	es	\N	fabi1408.fmq@gmail.com	\N	shortened	standard	f
4055	0x3d85fda5ea53e190404210a91150a1ddf463741f	dark	polygon	t	2025-12-19 10:56:10.001288	2025-12-19 10:56:10.001288	t	2025-04-29 05:08:06.393	t	t	t	\N	user_3d85fd	100	es	\N	admincristian@admin.com	\N	shortened	standard	t
4217	0x07311cb30a4d5faa239db6b55cc1c70879a66385	dark	ethereum	f	2025-12-19 10:56:09.670214	2025-12-19 10:56:09.670214	t	2025-05-13 05:07:22.477	t	t	t	\N	user_07311c	100	es	\N	ericagudo99@gmail.com	\N	shortened	standard	f
4369	0xb30bfcb883deed13735ce2e464bbcc836dc1dc8b	dark	ethereum	f	2025-12-19 10:56:09.839731	2025-12-19 10:56:09.839731	t	2025-05-05 08:05:50.336	t	t	t	\N	user_b30bfc	100	es	\N	barbaraescast@gmail.com	\N	shortened	standard	f
4626	0xad4474df3230a95a39d9937ab0ad91113972204a	dark	ethereum	f	2025-12-19 10:56:10.009894	2025-12-19 10:56:10.009894	t	2025-05-06 07:37:16.612	t	t	t	\N	user_ad4474	100	es	\N	santi@jokerjocs.cat	\N	shortened	standard	f
4725	0xa492f5cbac34eae26e4aa56a5056cf1fee7439ad	dark	ethereum	f	2025-12-19 10:56:10.165867	2025-12-19 10:56:10.165867	t	2025-05-07 12:32:24.129	t	t	t	\N	user_a492f5	100	es	\N	Koper71@hotmail.com	\N	shortened	standard	f
6210	0xfc065ed0904e750c18288060bab3af32e855d307	dark	ethereum	f	2025-12-19 10:56:10.171352	2025-12-19 10:56:10.171352	t	2025-05-13 11:38:28.399	t	t	t	\N	user_fc065e	100	es	\N	\N	\N	shortened	standard	f
6313	0x3370201c0ac55184a23a330b363002cbd8579c90	dark	ethereum	f	2025-12-19 10:56:10.171774	2025-12-19 10:56:10.171774	t	2025-05-15 10:50:46.896	t	t	t	\N	user_337020	100	es	\N	Arcasparracristian@gmail.com	\N	shortened	standard	f
6902	0x1810d6d068eaf1ed3f9503b7ffb04c630e07f820	dark	ethereum	f	2025-12-19 10:56:10.175405	2025-12-19 10:56:10.175405	t	2025-05-19 10:15:36.793	t	t	t	\N	user_1810d6	100	es	\N	garciasantosj@gmail.com	\N	shortened	standard	f
7392	0x4191f0f0ea0b0f5bc6f46772db6a223045195112	dark	ethereum	f	2025-12-19 10:56:10.181055	2025-12-19 10:56:10.181055	t	2025-05-22 10:15:26.618	t	t	t	\N	user_4191f0	100	es	\N	\N	\N	shortened	standard	f
7496	0x4f8b21e63469525749e2bd4246bec01e6a1b9220	dark	ethereum	f	2025-12-19 10:56:10.184413	2025-12-19 10:56:10.184413	t	2025-05-23 11:39:11.663	t	t	t	\N	user_4f8b21	100	es	\N	dogman70000@gmail.com	\N	shortened	standard	f
7724	0xe014653c1b7b0ea2ef19701a02b772b46f9945eb	dark	ethereum	f	2025-12-19 10:56:10.331777	2025-12-19 10:56:10.331777	t	2025-05-27 07:43:20.898	t	t	t	\N	user_e01465	100	es	\N	oscarmsosa89@gmail.com	\N	shortened	standard	f
7737	0x1f14c21f686d1b4268b084929502859ee05e8119	dark	ethereum	f	2025-12-19 10:56:10.333794	2025-12-19 10:56:10.333794	t	2025-05-27 09:10:20.442	t	t	t	\N	user_1f14c2	100	es	\N	\N	\N	shortened	standard	f
7795	0x83b313772e40c2fbda47e1849abeae68dc6894e8	dark	ethereum	f	2025-12-19 10:56:10.336791	2025-12-19 10:56:10.336791	t	2025-05-28 07:22:23.01	t	t	t	\N	user_83b313	100	es	\N	arnautrebejo1002@gmail.com	\N	shortened	standard	f
7807	0x988e8fa8772456171127b5246ee6c86f4a818813	system	polygon	f	2025-12-19 10:56:10.341213	2025-12-19 10:56:10.341213	t	2025-05-29 07:11:49.288	t	t	t	\N	user_0x988e8f	100	es	\N	jj2274.jj@gmail.com	\N	shortened	standard	f
7844	0x0bd58ac07642fbc4562e5d107b353ae5fa65c8f1	dark	ethereum	f	2025-12-19 10:56:10.341979	2025-12-19 10:56:10.341979	t	2025-05-29 09:27:30.91	t	t	t	\N	user_0bd58a	100	es	\N	\N	\N	shortened	standard	f
7855	0x75470ca3fd1da06d93a9bd91981e6824e7be2391	dark	ethereum	f	2025-12-19 10:56:10.352452	2025-12-19 10:56:10.352452	t	2025-05-29 09:38:53.183	t	t	t	\N	user_75470c	100	es	\N	\N	\N	shortened	standard	f
7860	0x7de2eb01f97b2326c6b679354f262526358ef759	dark	ethereum	f	2025-12-19 10:56:10.484212	2025-12-19 10:56:10.484212	t	2025-05-29 09:41:17.373	t	t	t	\N	user_7de2eb	100	es	\N	\N	\N	shortened	standard	f
8211	0xfe82fb6378f54f0fa967a1fe06b0bb8f039f8eee	dark	ethereum	f	2025-12-19 10:56:10.4995	2025-12-19 10:56:10.4995	t	2025-06-09 13:46:16.656	t	t	t	\N	user_fe82fb	100	es	\N	florenag@hotmail.com	\N	shortened	standard	f
8245	0x4b951a078fb48be35e59954edba5bb8a93f0255a	dark	ethereum	f	2025-12-19 10:56:10.502845	2025-12-19 10:56:10.502845	t	2025-06-10 18:56:04.599	t	t	t	\N	user_4b951a	100	es	\N	mercenc72@hotmail.com	\N	shortened	standard	f
8250	0xaa5ab1e659050faa1f25b2cf202d85317eb077fd	dark	ethereum	f	2025-12-19 10:56:10.506591	2025-12-19 10:56:10.506591	t	2025-06-12 08:56:19.122	t	t	t	\N	user_aa5ab1	100	es	\N	pep.marinabeer@gmail.com	\N	shortened	standard	f
8258	0xf031b70eef6dd808b00c5268daafc12ea0626010	dark	ethereum	f	2025-12-19 10:56:10.508657	2025-12-19 10:56:10.508657	t	2025-06-12 10:41:36.772	t	t	t	\N	user_f031b7	100	es	\N	davidrosa71@gmail.com	\N	shortened	standard	f
8406	0xcb35b91a8b4e70acccee81a003e7cc5ff5d07d78	system	polygon	f	2025-12-19 10:56:10.521538	2025-12-19 10:56:10.521538	t	2025-07-16 07:10:25.778	t	t	t	\N	user_0xCB35B9	100	es	\N	canestrut3000sl@hotmail.com	\N	shortened	standard	f
8407	0xb95fdea884a53746e6bc8a4b3ca0e8b3440d0ca4v	system	polygon	f	2025-12-19 10:56:10.636203	2025-12-19 10:56:10.636203	f	\N	f	f	f	\N	user_0xB95fdE	100	es	\N	\N	\N	shortened	standard	f
8409	0xadbd9c39ad4e12622d7b1a7ebd5db6f625a656fd	system	polygon	f	2025-12-19 10:56:10.665006	2025-12-19 10:56:10.665006	t	2025-07-07 11:24:10.05	t	t	t	\N	user_0xAdbD9c	100	es	\N	laurentrodriguez9@gmail.com	\N	shortened	standard	f
8411	0x14e69d740a147d7a51c6d2d80a54ad7b7529bf15	system	polygon	f	2025-12-19 10:56:10.667751	2025-12-19 10:56:10.667751	t	2025-07-07 17:41:48.492	t	t	t	\N	user_0x14E69d	100	es	\N	e.mil@gmail.com	\N	shortened	standard	f
8416	0xedba6c432e9827623697d75cc8c34a9460a88528	dark	ethereum	f	2025-12-19 10:56:10.673144	2025-12-19 10:56:10.673144	t	2025-06-19 13:24:38.382	t	t	t	\N	user_edba6c	100	es	\N	monica.df21@gmail.com	\N	shortened	standard	f
8422	0xf3baba6e26ae23b166ee72d4e0e6187bd2a2ff59	dark	ethereum	f	2025-12-19 10:56:10.674576	2025-12-19 10:56:10.674576	t	2025-06-20 09:49:21.041	t	t	t	\N	user_f3baba	100	es	\N	auroracavadagarcia@yahoo.es	\N	shortened	standard	f
8439	0xe2a6c76fca2f10959953c8589a1b0de5891a5b3e	dark	ethereum	f	2025-12-19 10:56:10.686067	2025-12-19 10:56:10.686067	t	2025-06-25 08:18:35.27	t	t	t	\N	user_e2a6c7	100	es	\N	\N	\N	shortened	standard	f
8443	0x55269ccf2538393b60a2ef049797e5e50a697800	dark	ethereum	f	2025-12-19 10:56:10.789164	2025-12-19 10:56:10.789164	t	2025-06-25 08:31:57.295	t	t	t	\N	user_55269c	100	es	\N	Pedrotomero88@gmail.com	\N	shortened	standard	f
8461	0x8e16127d161599d030be8b178855171b8c71bc50	dark	ethereum	f	2025-12-19 10:56:10.831142	2025-12-19 10:56:10.831142	t	2025-06-30 10:16:07.984	t	t	t	\N	user_8e1612	100	es	\N	Martalvarez941@gmail.com	\N	shortened	standard	f
8476	0xdd7a881134d5c13c566e6344c48ebad3461040bc	system	polygon	f	2025-12-19 10:56:10.833575	2025-12-19 10:56:10.833575	t	2025-07-04 09:59:33.383	t	t	t	\N	user_0xDd7A88	100	es	\N	ritamac1979@gmail.com	\N	shortened	standard	f
8480	0x913b0223882186ca5da539a2ea7361cf5a475a4a	system	polygon	f	2025-12-19 10:56:10.839366	2025-12-19 10:56:10.839366	f	\N	f	f	f	\N	user_0x913b02	100	es	\N	angel2.3.64@hotmail.com	\N	shortened	standard	f
8528	0xef0f1144467e6578cc30a4f845747e66461d6701	dark	ethereum	f	2025-12-19 10:56:10.841018	2025-12-19 10:56:10.841018	t	2025-07-09 09:11:42.751	t	t	t	\N	user_ef0f11	100	es	\N	Edgararcasvalls@gmail.com	\N	shortened	standard	f
8529	0x93d54815381821141de11a4c40a2de3bfd338377	dark	ethereum	f	2025-12-19 10:56:10.854659	2025-12-19 10:56:10.854659	t	2025-07-09 09:16:07.811	t	t	t	\N	user_93d548	100	es	\N	careaga.calero@gmail.com	\N	shortened	standard	f
8534	0x97e58bc1073528178a0f5ffed77d6e4558601c52	dark	ethereum	f	2025-12-19 10:56:10.857319	2025-12-19 10:56:10.857319	t	2025-07-09 09:42:33.6	t	t	t	\N	user_97e58b	100	es	\N	Baheco@hotmail.com	\N	shortened	standard	f
8628	0xdc97f4a9ba2caaaacfff56c3597e22eec6ceb4c9	system	polygon	f	2025-12-19 10:56:10.942722	2025-12-19 10:56:10.942722	t	2025-07-11 08:37:59.899	t	t	t	\N	user_0xDc97F4	100	es	\N	santisanchez7933@gmail.com	\N	shortened	standard	f
8629	0x36960261fbd11259494aa2de2a70b7cc5c84f086	system	polygon	f	2025-12-19 10:56:10.997561	2025-12-19 10:56:10.997561	t	2025-07-11 10:52:48.909	t	t	t	\N	user_0x369602	100	es	\N	pelucarmen24@hotmail.es	\N	shortened	standard	f
8649	0x4a7f33a940aaa7aba8e76eb77d97f679c76b5fe8	dark	ethereum	f	2025-12-19 10:56:11.003478	2025-12-19 10:56:11.003478	t	2025-07-14 09:36:36.255	t	t	t	\N	user_4a7f33	100	es	\N	gixam@hotmail.es	\N	shortened	standard	f
8666	0x2e3006364ae3adb067faf31ed31fb504b5675bfb	system	polygon	f	2025-12-19 10:56:11.007311	2025-12-19 10:56:11.007311	f	\N	f	f	f	\N	user_0x2e3006	100	es	\N	vidbaca@gmail.com	\N	shortened	standard	f
8948	0xd17ba251a4e9c4f6a44e92a95cb7186ebd8cdfc9	dark	ethereum	f	2025-12-19 10:56:11.023057	2025-12-19 10:56:11.023057	t	2025-07-22 09:09:08.244	t	t	t	\N	user_d17ba2	100	es	\N	montsecarrer58@gmail.com	\N	shortened	standard	f
8951	0x647f007b6b71a86aa62c218eed38d00b1123a23d	dark	ethereum	f	2025-12-19 10:56:11.025718	2025-12-19 10:56:11.025718	t	2025-07-22 09:24:34.96	t	t	t	\N	user_647f00	100	es	\N	idohervas7@gmail.com	\N	shortened	standard	f
9115	0x9dae8525796c538990cf71733460d61f9cfc3776	dark	polygon	f	2025-12-19 10:56:11.09474	2025-12-19 10:56:11.09474	t	2025-09-26 14:40:31.307	t	t	t	\N	user_0x9dae85	100	es	\N	chevillaalv@gmail.com	\N	full	standard	f
9255	0x8e2517df89b7e662a46dce6e7490342d0bf620e8	dark	ethereum	f	2025-12-19 10:56:11.166557	2025-12-19 10:56:11.166557	t	2025-07-28 13:09:52.886	t	t	t	\N	user_8e2517	100	es	\N	apariciogomeznebot@gmail.com	\N	shortened	standard	f
9337	0x243806d0e03455a826496e15bd3894bf1ebb1294	dark	ethereum	f	2025-12-19 10:56:11.168875	2025-12-19 10:56:11.168875	t	2025-07-29 15:30:42.415	t	t	t	\N	user_243806	100	es	\N	krismunuera89@gmail.com	\N	shortened	standard	f
9410	0xea8776a80da4487f58b0576c0da78a11a59c101a	dark	ethereum	f	2025-12-19 10:56:11.170545	2025-12-19 10:56:11.170545	t	2025-07-30 08:14:06.953	t	t	t	\N	user_ea8776	100	es	\N	ajits1216@gmail.com	\N	shortened	standard	f
9411	0x3e2451ed9eacf35a5172f8440f062167dffc93f0	system	polygon	f	2025-12-19 10:56:11.171726	2025-12-19 10:56:11.171726	t	2025-07-30 08:33:49.396	t	t	t	\N	user_0x3E2451	100	es	\N	ajits1216@gmail.com	\N	shortened	standard	f
9412	0x1a071bc2323afc4e991d2789bc0dc8b138430327	dark	ethereum	f	2025-12-19 10:56:11.173385	2025-12-19 10:56:11.173385	t	2025-07-30 09:05:34.794	t	t	t	\N	user_1a071b	100	es	\N	ajits1216@gmail.com	\N	shortened	standard	f
10292	0xfe13d4499bb58fab5a1751124a4071352a68a067	dark	ethereum	f	2025-12-19 10:56:11.333814	2025-12-19 10:56:11.333814	t	2025-08-27 10:41:48.494	t	t	t	\N	user_fe13d4	100	es	\N	\N	\N	shortened	standard	f
10471	0xf45231882bbf632dac2f46a938fff1dc7ec327b3	dark	ethereum	f	2025-12-19 10:56:11.335918	2025-12-19 10:56:11.335918	t	2025-09-01 08:04:53.487	t	t	t	\N	user_f45231	100	es	\N	davidschelvis@hotmail.com	\N	shortened	standard	f
10476	0xd4c5ab71c425bdcf3703fbee7e2a2e438531a18f	dark	ethereum	f	2025-12-19 10:56:11.337525	2025-12-19 10:56:11.337525	t	2025-09-01 08:22:22.29	t	t	t	\N	user_d4c5ab	100	es	\N	cgibert3@gmail.com	\N	shortened	standard	f
10525	0x89c948ee06b9b7b9cd20fc8bf9f7083e3f52a440	system	polygon	f	2025-12-19 10:56:11.339789	2025-12-19 10:56:11.339789	t	2025-09-03 13:09:24.724	t	t	t	\N	user_0x89C948	100	es	\N	crissnietoflorido@gmail.com	\N	shortened	standard	f
10981	0xb6c98ddf3668f579c2fb28f3bf6209b18433e297	dark	polygon	f	2025-12-19 10:56:11.363884	2025-12-19 10:56:11.363884	t	2025-09-14 09:57:46.7	t	t	t	\N	user_b6c98d	100	es	\N	hantcrz@gmail.com	\N	shortened	standard	f
11054	0xd44e7aac81c9d4d2a486df60b03de02638dc7bd7	dark	ethereum	f	2025-12-19 10:56:11.400811	2025-12-19 10:56:11.400811	t	2025-09-15 16:16:16.455	t	t	t	\N	user_d44e7a	100	es	\N	\N	\N	shortened	standard	f
11336	0xdccff441718a46f85ab151f4ab74be189e29a871	dark	ethereum	f	2025-12-19 10:56:11.496556	2025-12-19 10:56:11.496556	t	2025-09-22 11:21:27.813	t	t	t	\N	user_dccff4	100	es	\N	\N	\N	shortened	standard	f
11427	0x7dab6346245d6b47c195128ea22820caea24ff7a	system	polygon	f	2025-12-19 10:56:11.501086	2025-12-19 10:56:11.501086	t	2025-09-30 09:11:43.169	t	t	t	\N	user_0x7dab63	100	es	\N	rafa.baztan@hotmail.com	\N	shortened	standard	f
11567	0xd6cbdc161668f4b7473f9f3b71bcfd9a094c0cb4	dark	ethereum	f	2025-12-19 10:56:11.672377	2025-12-19 10:56:11.672377	f	\N	f	f	f	\N	user_d6cbdc	100	es	\N	\N	\N	shortened	standard	f
11570	0xfca53097013c05083cf2aef0d2a4cfe8d2b8d90b	dark	ethereum	f	2025-12-19 10:56:11.699114	2025-12-19 10:56:11.699114	f	\N	f	f	f	\N	user_fca530	100	es	\N	\N	\N	shortened	standard	f
11576	0xd7a570e2d92fbb8e265ca300729b0328c931535a	dark	ethereum	f	2025-12-19 10:56:11.706267	2025-12-19 10:56:11.706267	f	\N	f	f	f	\N	user_d7a570	100	es	\N	\N	\N	shortened	standard	f
11581	0x88bf096670c159ebc961548ad82b9297778ca973	dark	ethereum	f	2025-12-19 10:56:11.828813	2025-12-19 10:56:11.828813	f	\N	f	f	f	\N	user_88bf09	100	es	\N	\N	\N	shortened	standard	f
11633	0xe4d19680dff89fb45eddadd538772556f9c26548	dark	ethereum	f	2025-12-19 10:56:11.832473	2025-12-19 10:56:11.832473	f	\N	f	f	f	\N	user_e4d196	100	es	\N	\N	\N	shortened	standard	f
11652	0x55e474ff75da3fbcff4b6fd851514b9f4d997844	dark	ethereum	f	2025-12-19 10:56:11.838654	2025-12-19 10:56:11.838654	t	2025-10-23 08:38:32.591	t	t	t	\N	user_55e474	100	es	\N	\N	\N	shortened	standard	f
11669	0xe5a7546da6b4f5eef837b5dfbe311a331e6d574c	dark	ethereum	f	2025-12-19 10:56:11.868359	2025-12-19 10:56:11.868359	t	2025-10-27 12:02:38.367	t	t	t	\N	user_e5a754	100	es	\N	\N	\N	shortened	standard	f
11675	0xfb30af9c050344009badb1eb930da0f9bc2fe389	dark	ethereum	f	2025-12-19 10:56:11.995641	2025-12-19 10:56:11.995641	f	\N	f	f	f	\N	user_fb30af	100	es	\N	\N	\N	shortened	standard	f
11718	0x0c2a568bcd85c61079b0db703c92f23ff91d7f9c	dark	ethereum	f	2025-12-19 10:56:11.997359	2025-12-19 10:56:11.997359	f	\N	f	f	f	\N	user_0c2a56	100	es	\N	\N	\N	shortened	standard	f
11735	0xed3b235b67c457ff194bca04dcf44847ce935f89	dark	ethereum	f	2025-12-19 10:56:12.00771	2025-12-19 10:56:12.00771	f	\N	f	f	f	\N	user_ed3b23	100	es	\N	\N	\N	shortened	standard	f
11736	0x359df3b9733762f25ae437e6d4b9c2dd81d1565a	dark	ethereum	f	2025-12-19 10:56:12.011995	2025-12-19 10:56:12.011995	f	\N	f	f	f	\N	user_359df3	100	es	\N	\N	\N	shortened	standard	f
11755	0x64c6ffdfe60eb3543e9e22afb3662a0bedd8b059	dark	ethereum	f	2025-12-19 10:56:12.035584	2025-12-19 10:56:12.035584	f	\N	f	f	f	\N	user_64c6ff	100	es	\N	\N	\N	shortened	standard	f
11758	0x1140727968448ab7d10e666c2c6e4e3411aede1b	dark	ethereum	f	2025-12-19 10:56:12.036912	2025-12-19 10:56:12.036912	f	\N	f	f	f	\N	user_114072	100	es	\N	\N	\N	shortened	standard	f
11761	0x8b37c7d1120cbd078cb69b694ea825fdf031128b	dark	ethereum	f	2025-12-19 10:56:12.162196	2025-12-19 10:56:12.162196	f	\N	f	f	f	\N	user_8b37c7	100	es	\N	\N	\N	shortened	standard	f
11764	0x711b88d65e113b4399653d9986ebe8f1755b68d7	dark	ethereum	f	2025-12-19 10:56:12.163597	2025-12-19 10:56:12.163597	f	\N	f	f	f	\N	user_711b88	100	es	\N	\N	\N	shortened	standard	f
235	0xb6bca914ce6ce0ab9720d1b1ae0d09c9e288d3c6	dark	ethereum	f	2026-01-17 12:45:53.333221	2026-01-17 12:47:29.478	t	2026-01-17 12:47:29.478	t	t	t	\N	user_b6bca9	100	es	\N	lballanti.lb@gmail.com	\N	shortened	standard	f
8507	0x55715192e451f3327d05a9dad7452824f7ccf8e7	system	polygon	f	2025-12-19 10:56:10.839199	2025-12-19 10:56:10.839199	t	2025-07-08 11:53:23.161	t	t	t	\N	user_0x557151	100	es	\N	auroracavadagarcia@yahoo.es	\N	shortened	standard	f
8645	0x489405b99f046bed4862a481e02f7db75e37fd66	system	polygon	f	2025-12-19 10:56:11.002537	2025-12-19 10:56:11.002537	t	2025-07-14 09:08:25.58	t	t	t	\N	user_0x489405	100	es	\N	gixam@hotmail.com	\N	shortened	standard	f
8686	0xc2be5767fb88376cab0780782bda0edd1e2ea88c	dark	ethereum	f	2025-12-19 10:56:11.007007	2025-12-19 10:56:11.007007	t	2025-07-16 17:44:35.912	t	t	t	\N	user_c2be57	100	es	\N	adriadvance@gmail.com	\N	shortened	standard	f
9319	0x3ef3c5b8ad4e83b735c530177dad13020cedcc8a	dark	ethereum	f	2025-12-19 10:56:11.166715	2025-12-19 10:56:11.166715	t	2025-07-29 07:48:16.287	t	t	t	\N	user_3ef3c5	100	es	\N	jordi@duranassegurances.com	\N	shortened	standard	f
9418	0x1a6bf9d5780926edcb9bc20fcbe7e610bd55c148	dark	ethereum	f	2025-12-19 10:56:11.192416	2025-12-19 10:56:11.192416	t	2025-07-30 09:11:27.923	t	t	t	\N	user_1a6bf9	100	es	\N	amaurycalderon30@gmail.com	\N	shortened	standard	f
9466	0xc49a45652750cef8877fa63c67c831800f987cba	dark	ethereum	f	2025-12-19 10:56:11.247863	2025-12-19 10:56:11.247863	t	2025-07-31 17:33:17.28	t	t	t	\N	user_c49a45	100	es	\N	rodrigo.38999.rmq@gmail.com	\N	shortened	standard	f
9467	0xf5d3d369879460e172e30b5a7dbc1a2d3e285bb4	dark	ethereum	f	2025-12-19 10:56:11.331628	2025-12-19 10:56:11.331628	t	2025-08-01 10:45:52.375	t	t	t	\N	user_f5d3d3	100	es	\N	\N	\N	shortened	standard	f
10896	0x4d5cc20ffb1e9f9fcd5046b491ecfaf7d910ee85	dark	ethereum	f	2025-12-19 10:56:11.340551	2025-12-19 10:56:11.340551	t	2025-09-11 10:17:21.923	t	t	t	\N	user_4d5cc2	100	es	\N	\N	\N	shortened	standard	f
10972	0x9ed9f5b0da78216a648fee8de16479c0aefeb25b	dark	ethereum	f	2025-12-19 10:56:11.362598	2025-12-19 10:56:11.362598	t	2025-09-14 09:08:15.877	t	t	t	\N	user_9ed9f5	100	es	\N	\N	\N	shortened	standard	f
11429	0x0a57b7d48f2b4d8cace0abec9e878c307259b77e	dark	ethereum	t	2025-12-19 10:56:11.502469	2025-12-19 10:56:11.502469	f	\N	f	f	f	\N	user_0a57b7	100	es	\N	\N	\N	shortened	standard	f
11430	0xec370896441ecd15fc5b216edd1b6af02346200f	dark	ethereum	f	2025-12-19 10:56:11.505408	2025-12-19 10:56:11.505408	t	2025-10-01 15:12:37.551	t	t	t	\N	user_ec3708	100	es	\N	\N	\N	shortened	standard	f
11435	0x6faadee07819680de07004dd1e75425ca5fa58cd	dark	ethereum	f	2025-12-19 10:56:11.507361	2025-12-19 10:56:11.507361	f	\N	f	f	f	\N	user_6faade	100	es	\N	\N	\N	shortened	standard	f
11442	0x9ca05d14875469edb821f59b5d8a10ebf09f32dd	dark	ethereum	f	2025-12-19 10:56:11.531123	2025-12-19 10:56:11.531123	f	\N	f	f	f	\N	user_9ca05d	100	es	\N	\N	\N	shortened	standard	f
11449	0x117db44171ec85310f5de227ba6eb5f68e4bf435	dark	ethereum	f	2025-12-19 10:56:11.532319	2025-12-19 10:56:11.532319	t	2025-10-02 10:16:10.193	t	t	t	\N	user_117db4	100	es	\N	\N	\N	shortened	standard	f
11497	0x5143dcf58ea0ca05b41ddc7b9eb0afec7aa1fedf	dark	ethereum	f	2025-12-19 10:56:11.662757	2025-12-19 10:56:11.662757	t	2025-10-06 08:19:16.389	t	t	t	\N	user_5143dc	100	es	\N	\N	\N	shortened	standard	f
11510	0x54d826e4ebcc9d4ff6c166210e046a9fc38253c1	dark	ethereum	f	2025-12-19 10:56:11.666646	2025-12-19 10:56:11.666646	t	2025-10-07 08:24:49.974	t	t	t	\N	user_54d826	100	es	\N	\N	\N	shortened	standard	f
11538	0x0cb43ef0a6b2bd454fa5222c519184dafb1bf0c2	dark	ethereum	f	2025-12-19 10:56:11.66805	2025-12-19 10:56:11.66805	f	\N	f	f	f	\N	user_0cb43e	100	es	\N	\N	\N	shortened	standard	f
11551	0xa04d6f5ee5a1f3a1bae645e840eb8602dfc2d5c5	dark	ethereum	f	2025-12-19 10:56:11.671746	2025-12-19 10:56:11.671746	f	\N	f	f	f	\N	user_a04d6f	100	es	\N	\N	\N	shortened	standard	f
11556	0xc58321d917cfe8dc961c5f5885c3ec0e6f5b84a1	dark	ethereum	f	2025-12-19 10:56:11.67196	2025-12-19 10:56:11.67196	f	\N	f	f	f	\N	user_c58321	100	es	\N	\N	\N	shortened	standard	f
11582	0x30cf590e4d39eb95eee7d5bbf10aa15a04ae6adf	dark	ethereum	f	2025-12-19 10:56:11.832717	2025-12-19 10:56:11.832717	t	2025-10-14 08:13:11.319	t	t	t	\N	user_30cf59	100	es	\N	\N	\N	shortened	standard	f
11638	0xdb470d49f028823449bb0de20f471a7d89eef978	dark	ethereum	f	2025-12-19 10:56:11.834182	2025-12-19 10:56:11.834182	f	\N	f	f	f	\N	user_db470d	100	es	\N	\N	\N	shortened	standard	f
11653	0x3b82a89786f800ac00ba2b4c4a39fa74c9b2282b	dark	ethereum	f	2025-12-19 10:56:11.839627	2025-12-19 10:56:11.839627	t	2025-10-23 12:52:36.073	t	t	t	\N	user_3b82a8	100	es	\N	\N	\N	shortened	standard	f
11658	0xb2ed7c83cf83387ddc24ef8104670add136ff1ef	dark	ethereum	f	2025-12-19 10:56:11.867342	2025-12-19 10:56:11.867342	t	2025-10-24 10:17:54.866	t	t	t	\N	user_b2ed7c	100	es	\N	\N	\N	shortened	standard	f
11712	0x7a40527ca6027db4cd61f41c51a08a808fe62a5e	dark	ethereum	f	2025-12-19 10:56:11.997583	2025-12-19 10:56:11.997583	t	2025-11-04 17:41:01.744	t	t	t	\N	user_7a4052	100	es	\N	\N	\N	shortened	standard	f
11724	0x6ee3bf758c9133ea7ba6d2ab3d36214a0ca03884	dark	ethereum	f	2025-12-19 10:56:11.998736	2025-12-19 10:56:11.998736	f	\N	f	f	f	\N	user_6ee3bf	100	es	\N	\N	\N	shortened	standard	f
11730	0x5d5cd2b7a8e15e2324cbbefb5f58dfec9f81b0ad	dark	ethereum	f	2025-12-19 10:56:12.007025	2025-12-19 10:56:12.007025	f	\N	f	f	f	\N	user_5d5cd2	100	es	\N	\N	\N	shortened	standard	f
11797	0x21bcb3e59df62f1ea90e7b2e1fd569edda1ed2b7	dark	ethereum	f	2025-12-19 10:56:12.164134	2025-12-19 10:56:12.164134	t	2025-11-12 09:06:03.491	t	t	t	\N	user_21bcb3	100	es	\N	\N	\N	shortened	standard	f
11826	0xb435e4ef95b027c8008b516d4723feb8f03658d4	dark	ethereum	f	2025-12-19 10:56:12.164196	2025-12-19 10:56:12.164196	f	\N	f	f	f	\N	user_b435e4	100	es	\N	\N	\N	shortened	standard	f
11833	0x314cd5bd6880c4731c6a049efadc01590c975832	dark	ethereum	f	2025-12-19 10:56:12.173569	2025-12-19 10:56:12.173569	f	\N	f	f	f	\N	user_314cd5	100	es	\N	\N	\N	shortened	standard	f
11837	0x51107b3b430440ea796e36a0d3c99fbd51bbad41	dark	ethereum	f	2025-12-19 10:56:12.17427	2025-12-19 10:56:12.17427	f	\N	f	f	f	\N	user_51107b	100	es	\N	\N	\N	shortened	standard	f
11843	0x588330a3326c0987f6d0150394ae3e86de5eb9ab	dark	ethereum	f	2025-12-19 10:56:12.20374	2025-12-19 10:56:12.20374	f	\N	f	f	f	\N	user_588330	100	es	\N	\N	\N	shortened	standard	f
11844	0xcd1b2fde5bc12a971b6fee281c47618e34b855a8	dark	ethereum	f	2025-12-19 10:56:12.20512	2025-12-19 10:56:12.20512	f	\N	f	f	f	\N	user_cd1b2f	100	es	\N	\N	\N	shortened	standard	f
11849	0x08a1d19c8d57497fb5bc12fedc90c7f5476acfcb	dark	ethereum	f	2025-12-19 10:56:12.32836	2025-12-19 10:56:12.32836	f	\N	f	f	f	\N	user_08a1d1	100	es	\N	\N	\N	shortened	standard	f
11861	0xb3f3c86928f5d5592635859f60b152d98b3d8c88	dark	ethereum	f	2025-12-19 10:56:12.333531	2025-12-19 10:56:12.333531	f	\N	f	f	f	\N	user_b3f3c8	100	es	\N	\N	\N	shortened	standard	f
11862	0xb4b546c4d2ffd83c787981ad92f748beae796a60	dark	ethereum	f	2025-12-19 10:56:12.334052	2025-12-19 10:56:12.334052	f	\N	f	f	f	\N	user_b4b546	100	es	\N	\N	\N	shortened	standard	f
11863	0xcc07b43f8bdce411928df2a6179ab26036654760	dark	ethereum	f	2025-12-19 10:56:12.322871	2025-12-19 10:56:12.322871	f	\N	f	f	f	\N	user_cc07b4	100	es	\N	\N	\N	shortened	standard	f
11871	0x9e21e28bb0a14bec4b96c107c0532c876425397d	dark	ethereum	f	2025-12-19 10:56:12.339845	2025-12-19 10:56:12.339845	f	\N	f	f	f	\N	user_9e21e2	100	es	\N	\N	\N	shortened	standard	f
11878	0xfdd111d91c32c0d87be10751b5b6c6b48a7cc8f5	dark	ethereum	f	2025-12-19 10:56:12.340495	2025-12-19 10:56:12.340495	t	2025-11-18 10:26:09.464	t	t	t	\N	user_fdd111	100	es	\N	\N	\N	shortened	standard	f
11938	0xdca072e10954e0bf04949523d851afac6df7aa6f	dark	ethereum	f	2025-12-19 10:56:12.373604	2025-12-19 10:56:12.373604	f	\N	f	f	f	\N	user_dca072	100	es	\N	\N	\N	shortened	standard	f
11941	0x82ff6874a9076563128432f0e4435edf2bf852a2	dark	ethereum	f	2025-12-19 10:56:12.475944	2025-12-19 10:56:12.475944	f	\N	f	f	f	\N	user_82ff68	100	es	\N	\N	\N	shortened	standard	f
11944	0x4793fed632140f2018dc76e3495357edb0a54eb3	dark	ethereum	f	2025-12-19 10:56:12.494014	2025-12-19 10:56:12.494014	f	\N	f	f	f	\N	user_4793fe	100	es	\N	\N	\N	shortened	standard	f
11972	0xb547fd3b164950f91a339ce6bc5415ed7285700e	dark	ethereum	f	2025-12-19 10:56:12.499532	2025-12-19 10:56:12.499532	f	\N	f	f	f	\N	user_b547fd	100	es	\N	\N	\N	shortened	standard	f
11975	0x828b04363bfa8337555d18714164e8dae3c0c276	dark	ethereum	f	2025-12-19 10:56:12.499667	2025-12-19 10:56:12.499667	f	\N	f	f	f	\N	user_828b04	100	es	\N	\N	\N	shortened	standard	f
12024	0xdb1d7a126064b981f4468af9b872f8ab323e3a98	dark	ethereum	f	2025-12-19 10:56:12.506798	2025-12-19 10:56:12.506798	t	2025-12-04 13:18:29.807	t	t	t	\N	user_db1d7a	100	es	\N	\N	\N	shortened	standard	f
4635	0x8aaa8b6e3385333b1753c4075111996ceb150644	dark	ethereum	f	2025-12-19 10:56:10.088512	2025-12-19 10:56:10.088512	t	2025-05-06 09:47:18.849	t	t	t	\N	user_8aaa8b	100	es	\N	\N	\N	shortened	standard	f
4771	0x4c914790ea45f39ff3d76456815acb7bdd06c318	dark	ethereum	f	2025-12-19 10:56:10.168406	2025-12-19 10:56:10.168406	t	2025-05-07 18:41:08.654	t	t	t	\N	user_4c9147	100	es	\N	crisru1971@gmail.com	\N	shortened	standard	f
6347	0x210de46106c3a38e1a315b6a7ca488fdf0b06d8c	dark	ethereum	f	2025-12-19 10:56:10.174778	2025-12-19 10:56:10.174778	t	2025-05-16 07:51:50.435	t	t	t	\N	user_210de4	100	es	\N	Raybenabraham@icloud.com	\N	shortened	standard	f
7046	0xa23afd275ddc937d3b00c342bd9bf394ece471f3	dark	ethereum	f	2025-12-19 10:56:10.176763	2025-12-19 10:56:10.176763	t	2025-05-20 10:36:48.655	t	t	t	\N	user_a23afd	100	es	\N	\N	\N	shortened	standard	f
7499	0xa7f4137db52d5a4af26bc7f5f7e153b697f62828	dark	ethereum	f	2025-12-19 10:56:10.241103	2025-12-19 10:56:10.241103	t	2025-05-23 11:49:25.52	t	t	t	\N	user_a7f413	100	es	\N	aleeexpq92@gmail.com	\N	shortened	standard	f
7742	0x45f749ce8acf4d839cf149aa41b19179c836c123	dark	ethereum	f	2025-12-19 10:56:10.336585	2025-12-19 10:56:10.336585	t	2025-05-27 10:09:20.915	t	t	t	\N	user_45f749	100	es	\N	jesusbenitez40@hotmail.com	\N	shortened	standard	f
7802	0x11f4b0cdd9869eb1bd3cf8e89fb68134e0226b20	dark	ethereum	f	2025-12-19 10:56:10.340579	2025-12-19 10:56:10.340579	t	2025-05-28 11:51:34.017	t	t	t	\N	user_11f4b0	100	en	\N	\N	\N	shortened	standard	f
7850	0xd268039ced2a505a1711089da83e464a95d2856a	dark	ethereum	f	2025-12-19 10:56:10.349254	2025-12-19 10:56:10.349254	t	2025-05-29 11:57:00.645	t	t	t	\N	user_d26803	100	es	\N	\N	\N	shortened	standard	f
8204	0x2b3021281e8bbbba488f7f66da4d182cf3df99c9	dark	ethereum	f	2025-12-19 10:56:10.498237	2025-12-19 10:56:10.498237	t	2025-06-07 14:49:24.506	t	t	t	\N	user_2b3021	100	es	\N	aestirado@hotmail.com	\N	shortened	standard	f
8230	0x28368ad803ff966988012b03f2e5152af6cbe0f7	dark	ethereum	f	2025-12-19 10:56:10.502665	2025-12-19 10:56:10.502665	t	2025-06-10 08:24:44.397	t	t	t	\N	user_28368a	100	es	\N	maribel604@hotmail.com	\N	shortened	standard	f
8253	0x4c470e1deac2b073679ffbb95229a50de5906903	dark	ethereum	f	2025-12-19 10:56:10.506852	2025-12-19 10:56:10.506852	t	2025-06-12 10:35:44.575	t	t	t	\N	user_4c470e	100	es	\N	ju.antonifg@gmail.com	\N	shortened	standard	f
8287	0x7d7fc32793b94d05fcaa7e50e7ba531111c96f16	dark	polygon	f	2025-12-19 10:56:10.517622	2025-12-19 10:56:10.517622	t	2025-06-13 10:59:26.851	t	t	t	\N	user_7d7fc3	100	es	\N	\N	\N	shortened	standard	f
8408	0xb95fdea884a53746e6bc8a4b3ca0e8b3440d0ca4	system	polygon	f	2025-12-19 10:56:10.664007	2025-12-19 10:56:10.664007	t	2025-07-03 14:41:25.52	t	t	t	\N	user_0xB95fdE	100	es	\N	marcroma88@hotmail.com	\N	shortened	standard	f
8410	0x80ace41d5833875966bf56a7306f37b843f41faa	dark	ethereum	f	2025-12-19 10:56:10.667605	2025-12-19 10:56:10.667605	t	2025-06-17 07:37:33.268	t	t	t	\N	user_80ace4	100	es	\N	marcelofichera@gmail.com	\N	shortened	standard	f
8421	0x706fcc76a7de84a28a105dbd79983785f74364f7	system	polygon	f	2025-12-19 10:56:10.67228	2025-12-19 10:56:10.67228	t	2025-06-20 12:22:11.68	t	t	t	\N	user_0x706FCC	100	es	\N	123triplikate@gmail.com	\N	shortened	standard	f
8442	0x86d9f46cff667dccf7af872331757aa118adba43	dark	ethereum	f	2025-12-19 10:56:10.689582	2025-12-19 10:56:10.689582	t	2025-06-25 08:23:31.111	t	t	t	\N	user_86d9f4	100	es	\N	Joanandrea10@gmail.com	\N	shortened	standard	f
8448	0x4c3ed0105606dbb88c1437061812eda4094bdec4	dark	ethereum	f	2025-12-19 10:56:10.830762	2025-12-19 10:56:10.830762	t	2025-06-25 08:41:03.842	t	t	t	\N	user_4c3ed0	100	es	\N	xxivanetdanetxx@gmail.com	\N	shortened	standard	f
8477	0x6bbddf1d6cb6b4b6e8451c092fe0121a44913926	system	polygon	f	2025-12-19 10:56:10.834919	2025-12-19 10:56:10.834919	t	2025-07-04 09:50:58.295	t	t	t	\N	user_0x6Bbddf	100	es	\N	joan_balmanya@yahoo.es	\N	shortened	standard	f
8640	0x3051c8d7273cf2f1bf2ff1f2a9f809ad5868c21c	system	polygon	f	2025-12-19 10:56:10.997928	2025-12-19 10:56:10.997928	t	2025-07-14 08:30:07.223	t	t	t	\N	user_0x3051c8	100	es	\N	aaronquirozsidera@gmail.com	\N	shortened	standard	f
8646	0x8648553513f80564d5a7a26a7b3d370d8c0f0293	dark	ethereum	f	2025-12-19 10:56:11.004824	2025-12-19 10:56:11.004824	t	2025-07-14 09:04:11.13	t	t	t	\N	user_864855	100	es	\N	gixam@hotmail.com	\N	shortened	standard	f
9417	0x1d75ec689f9febd55a4c2d16479bed88e48f4749	dark	ethereum	f	2025-12-19 10:56:11.174055	2025-12-19 10:56:11.174055	t	2025-07-30 09:10:57.085	t	t	t	\N	user_1d75ec	100	es	\N	ajits1216@gmail.com	\N	shortened	standard	f
9465	0xf5be55c376a184a0a76f69571acdf49434139676	system	polygon	f	2025-12-19 10:56:11.19548	2025-12-19 10:56:11.19548	t	2025-07-31 08:03:27.892	t	t	t	\N	user_0xf5bE55	100	es	\N	Apalom.63@gmail.com	\N	shortened	standard	f
10145	0x84ef53a88318f3a3a1b6cfaa201ab88886f716b5	system	polygon	f	2025-12-19 10:56:11.333112	2025-12-19 10:56:11.333112	t	2025-09-02 08:53:58.998	t	t	t	\N	user_0x84EF53	100	es	\N	alcazarrayacristian@gmail.com	\N	shortened	standard	f
11428	0x8d6a8789014d79b647fcd6baefdfe356549c9e03	system	polygon	f	2025-12-19 10:56:11.501338	2025-12-19 10:56:11.501338	t	2025-09-30 10:28:29.484	t	t	t	\N	user_0x8D6A87	100	es	\N	cortesrussell.david@gmail.com	\N	shortened	standard	f
11433	0x0c53e9ecfb1fd8c8e289fc53be4bc6aa807562d7	dark	ethereum	f	2025-12-19 10:56:11.50663	2025-12-19 10:56:11.50663	t	2025-10-02 07:59:30.592	t	t	t	\N	user_0c53e9	100	es	\N	ivanortadominguez@gmail.com	\N	shortened	standard	f
11458	0x6329ebe7ea3d7cf28980eac577460a20c27d0c82	dark	ethereum	f	2025-12-19 10:56:11.553669	2025-12-19 10:56:11.553669	t	2025-10-04 11:04:43.41	t	t	t	\N	user_6329eb	100	es	\N	\N	\N	shortened	standard	f
11531	0x60abd6f66451d8ab4cc41b302b31f0ccb7a972ad	dark	ethereum	f	2025-12-19 10:56:11.668152	2025-12-19 10:56:11.668152	t	2025-10-10 09:06:38.517	t	t	t	\N	user_60abd6	100	es	\N	\N	\N	shortened	standard	f
11573	0xec6e38b054f7e2eb00548a1ad1b0fa04c69b24cb	dark	ethereum	f	2025-12-19 10:56:11.699468	2025-12-19 10:56:11.699468	f	\N	f	f	f	\N	user_ec6e38	100	es	\N	\N	\N	shortened	standard	f
11641	0x83c4fb40866553348bd57a3c484512e072aebf5b	dark	ethereum	f	2025-12-19 10:56:11.838047	2025-12-19 10:56:11.838047	f	\N	f	f	f	\N	user_83c4fb	100	es	\N	\N	\N	shortened	standard	f
11674	0x1e681e2845aeec652b4532a8e1aa591c01050986	dark	ethereum	f	2025-12-19 10:56:11.858894	2025-12-19 10:56:11.858894	f	\N	f	f	f	\N	user_1e681e	100	es	\N	\N	\N	shortened	standard	f
11727	0x015687d4999c5e5bc8246efab84a109dad1dbcb6	dark	ethereum	f	2025-12-19 10:56:12.004765	2025-12-19 10:56:12.004765	f	\N	f	f	f	\N	user_015687	100	es	\N	\N	\N	shortened	standard	f
11831	0xc05e9bcb8747ca03c8eb972ce18851fdf93074d0	dark	ethereum	f	2025-12-19 10:56:12.171613	2025-12-19 10:56:12.171613	f	\N	f	f	f	\N	user_c05e9b	100	es	\N	\N	\N	shortened	standard	f
11840	0x6bf9870ec5c8d279f6774264d2c5eee48d280e89	dark	ethereum	f	2025-12-19 10:56:12.167563	2025-12-19 10:56:12.167563	f	\N	f	f	f	\N	user_6bf987	100	es	\N	\N	\N	shortened	standard	f
11850	0x122f90062549ff778806a15fa3b2a66973b9ea1c	dark	ethereum	f	2025-12-19 10:56:12.331314	2025-12-19 10:56:12.331314	f	\N	f	f	f	\N	user_122f90	100	es	\N	\N	\N	shortened	standard	f
11868	0x25bdfc6f2792ef6123695a159905542af3ac4b37	dark	ethereum	f	2025-12-19 10:56:12.33893	2025-12-19 10:56:12.33893	f	\N	f	f	f	\N	user_25bdfc	100	es	\N	\N	\N	shortened	standard	f
11921	0x835d5936f72b6e6d5e88afae7ad500426bd2962a	dark	ethereum	f	2025-12-19 10:56:12.373189	2025-12-19 10:56:12.373189	f	\N	f	f	f	\N	user_835d59	100	es	\N	\N	\N	shortened	standard	f
11961	0xeae448e1537aa3c6b2a37e2ab26bba7ca2de9436	dark	ethereum	f	2025-12-19 10:56:12.496318	2025-12-19 10:56:12.496318	f	\N	f	f	f	\N	user_eae448	100	es	\N	\N	\N	shortened	standard	f
12012	0xaa9523f84b0bc350c62f7eb187e6f4f2295b01ff	dark	ethereum	f	2025-12-19 10:56:12.507359	2025-12-19 10:56:12.507359	t	2025-12-04 10:11:15.168	t	t	t	\N	user_aa9523	100	es	\N	\N	\N	shortened	standard	f
12019	0x56f67ff20c3fb81fab2aff1cfcb22c0fd0de4167	dark	ethereum	f	2025-12-19 10:56:12.507948	2025-12-19 10:56:12.507948	f	\N	f	f	f	\N	user_56f67f	100	es	\N	\N	\N	shortened	standard	f
83	0x08476da7fa9f54c8e931a4ab185d18f2caa76b4b	dark	ethereum	f	2025-12-20 12:54:02.646437	2025-12-20 12:54:02.646437	f	\N	f	f	f	\N	user_08476d	100	es	\N	\N	\N	shortened	standard	f
88	0xc01e4e7567f8223810485308973b75a14c0459d0	dark	ethereum	f	2025-12-20 12:54:05.957503	2025-12-20 12:54:05.957503	f	\N	f	f	f	\N	user_c01e4e	100	es	\N	\N	\N	shortened	standard	f
89	0x701c3791828d3358f4e80dd148419252d23e9273	dark	ethereum	f	2025-12-20 12:54:09.34297	2025-12-20 12:54:09.34297	f	\N	f	f	f	\N	user_701c37	100	es	\N	\N	\N	shortened	standard	f
90	0xc294413f8bd1261c5d18316a55399c6438fd1136	dark	ethereum	f	2025-12-20 16:07:27.90325	2025-12-20 16:07:27.90325	f	\N	f	f	f	\N	user_c29441	100	es	\N	\N	\N	shortened	standard	f
95	0x2100a6a6a155b75a19bd51997735a32616ba3e9f	dark	ethereum	f	2025-12-20 16:07:30.714947	2025-12-20 16:07:30.714947	f	\N	f	f	f	\N	user_2100a6	100	es	\N	\N	\N	shortened	standard	f
96	0xa61f7eb74fe38c7e3466063620f8270aab37666e	dark	ethereum	f	2025-12-20 16:08:33.963442	2025-12-20 16:08:33.963442	f	\N	f	f	f	\N	user_a61f7e	100	es	\N	\N	\N	shortened	standard	f
191	0x9d51be6be8dfa91a721e22e50a9185ff12aec07c	dark	ethereum	f	2026-01-09 06:39:48.679937	2026-01-09 06:39:48.679937	f	\N	f	f	f	\N	user_9d51be	100	es	\N	\N	\N	shortened	standard	f
1	0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F	dark	unichain	t	2025-12-19 10:56:09.489797	2025-12-19 12:40:44.377	t	2025-12-19 12:40:44.377	t	t	t	WBY6XRLN	admin_waybank	100	en	\N	lballanti.lb@gmail.com	\N	shortened	standard	t
196	0xea8406bef76df7dc747d927c15cbf7cec0057eee	dark	ethereum	f	2026-01-09 12:13:22.446569	2026-01-09 12:13:22.446569	f	\N	f	f	f	\N	user_ea8406	100	es	\N	\N	\N	shortened	standard	f
201	0x2c1bc010eeea09d26fd97112060d2d4c366aaec8	dark	ethereum	f	2026-01-09 12:20:43.894217	2026-01-09 12:20:43.894217	f	\N	f	f	f	\N	user_2c1bc0	100	es	\N	\N	\N	shortened	standard	f
\.


--
-- Data for Name: wallet_seed_phrases; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wallet_seed_phrases (id, wallet_address, seed_phrase, created_at) FROM stdin;
1	0x6b22cEB508db3C81d69ED6451d63B56a1fb7271F	abandono abeja abogado abono abrigo abrir absoluto absurdo abuela acabar academia acceso	2025-05-20 10:17:28.635
2	0xf6edd2f7ffa65777e0fafb41d1af1fbb4d734afb	aumento azar aumento aduana astilla asiento alarma asesor aliado alivio asistir anuario	2025-05-21 07:25:58.783
3	0x4191f0f0ea0b0f5bc6f46772db6a223045195112	ayer alfiler aparato aseo ácido ajuste atajo ajuste acceso abrigo afectar alejar	2025-05-22 10:15:33.247
\.


--
-- Name: app_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.app_config_id_seq', 1, true);


--
-- Name: billing_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.billing_profiles_id_seq', 1, false);


--
-- Name: custodial_recovery_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.custodial_recovery_tokens_id_seq', 1, false);


--
-- Name: custodial_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.custodial_sessions_id_seq', 823, true);


--
-- Name: custodial_wallets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.custodial_wallets_id_seq', 1, true);


--
-- Name: custom_pools_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.custom_pools_id_seq', 1360, true);


--
-- Name: fee_withdrawals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fee_withdrawals_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.invoices_id_seq', 1, false);


--
-- Name: landing_videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.landing_videos_id_seq', 2, true);


--
-- Name: leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leads_id_seq', 1, false);


--
-- Name: legal_signatures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.legal_signatures_id_seq', 6, true);


--
-- Name: managed_nfts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.managed_nfts_id_seq', 1, false);


--
-- Name: podcasts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.podcasts_id_seq', 1, false);


--
-- Name: position_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.position_history_id_seq', 1, false);


--
-- Name: position_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.position_preferences_id_seq', 1, false);


--
-- Name: real_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.real_positions_id_seq', 1, false);


--
-- Name: referral_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.referral_subscribers_id_seq', 1, false);


--
-- Name: referrals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.referrals_id_seq', 1, false);


--
-- Name: referred_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.referred_users_id_seq', 1, false);


--
-- Name: support_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.support_tickets_id_seq', 1, false);


--
-- Name: ticket_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ticket_messages_id_seq', 1, false);


--
-- Name: timeframe_adjustments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.timeframe_adjustments_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 715, true);


--
-- Name: wallet_seed_phrases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wallet_seed_phrases_id_seq', 1, false);


--
-- Name: app_config app_config_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_config
    ADD CONSTRAINT app_config_key_key UNIQUE (key);


--
-- Name: app_config app_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_config
    ADD CONSTRAINT app_config_pkey PRIMARY KEY (id);


--
-- Name: billing_profiles billing_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_profiles
    ADD CONSTRAINT billing_profiles_pkey PRIMARY KEY (id);


--
-- Name: custodial_recovery_tokens custodial_recovery_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_recovery_tokens
    ADD CONSTRAINT custodial_recovery_tokens_pkey PRIMARY KEY (id);


--
-- Name: custodial_recovery_tokens custodial_recovery_tokens_recovery_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_recovery_tokens
    ADD CONSTRAINT custodial_recovery_tokens_recovery_token_key UNIQUE (recovery_token);


--
-- Name: custodial_sessions custodial_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_sessions
    ADD CONSTRAINT custodial_sessions_pkey PRIMARY KEY (id);


--
-- Name: custodial_sessions custodial_sessions_session_token_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_sessions
    ADD CONSTRAINT custodial_sessions_session_token_key UNIQUE (session_token);


--
-- Name: custodial_wallets custodial_wallets_address_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_wallets
    ADD CONSTRAINT custodial_wallets_address_key UNIQUE (address);


--
-- Name: custodial_wallets custodial_wallets_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_wallets
    ADD CONSTRAINT custodial_wallets_email_key UNIQUE (email);


--
-- Name: custodial_wallets custodial_wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_wallets
    ADD CONSTRAINT custodial_wallets_pkey PRIMARY KEY (id);


--
-- Name: custom_pools custom_pools_address_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_pools
    ADD CONSTRAINT custom_pools_address_key UNIQUE (address);


--
-- Name: custom_pools custom_pools_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custom_pools
    ADD CONSTRAINT custom_pools_pkey PRIMARY KEY (id);


--
-- Name: fee_withdrawals fee_withdrawals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fee_withdrawals
    ADD CONSTRAINT fee_withdrawals_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_invoice_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_invoice_number_key UNIQUE (invoice_number);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: landing_videos landing_videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.landing_videos
    ADD CONSTRAINT landing_videos_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: legal_signatures legal_signatures_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legal_signatures
    ADD CONSTRAINT legal_signatures_pkey PRIMARY KEY (id);


--
-- Name: managed_nfts managed_nfts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.managed_nfts
    ADD CONSTRAINT managed_nfts_pkey PRIMARY KEY (id);


--
-- Name: podcasts podcasts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.podcasts
    ADD CONSTRAINT podcasts_pkey PRIMARY KEY (id);


--
-- Name: position_history position_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.position_history
    ADD CONSTRAINT position_history_pkey PRIMARY KEY (id);


--
-- Name: position_preferences position_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.position_preferences
    ADD CONSTRAINT position_preferences_pkey PRIMARY KEY (id);


--
-- Name: real_positions real_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.real_positions
    ADD CONSTRAINT real_positions_pkey PRIMARY KEY (id);


--
-- Name: referral_subscribers referral_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_subscribers
    ADD CONSTRAINT referral_subscribers_email_key UNIQUE (email);


--
-- Name: referral_subscribers referral_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referral_subscribers
    ADD CONSTRAINT referral_subscribers_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_pkey PRIMARY KEY (id);


--
-- Name: referrals referrals_referral_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referrals
    ADD CONSTRAINT referrals_referral_code_key UNIQUE (referral_code);


--
-- Name: referred_users referred_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referred_users
    ADD CONSTRAINT referred_users_pkey PRIMARY KEY (id);


--
-- Name: referred_users referred_users_referred_wallet_address_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referred_users
    ADD CONSTRAINT referred_users_referred_wallet_address_key UNIQUE (referred_wallet_address);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: ticket_messages ticket_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ticket_messages
    ADD CONSTRAINT ticket_messages_pkey PRIMARY KEY (id);


--
-- Name: timeframe_adjustments timeframe_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timeframe_adjustments
    ADD CONSTRAINT timeframe_adjustments_pkey PRIMARY KEY (id);


--
-- Name: timeframe_adjustments timeframe_adjustments_timeframe_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.timeframe_adjustments
    ADD CONSTRAINT timeframe_adjustments_timeframe_key UNIQUE (timeframe);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_wallet_address_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_wallet_address_key UNIQUE (wallet_address);


--
-- Name: wallet_seed_phrases wallet_seed_phrases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wallet_seed_phrases
    ADD CONSTRAINT wallet_seed_phrases_pkey PRIMARY KEY (id);


--
-- Name: custodial_recovery_tokens custodial_recovery_tokens_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_recovery_tokens
    ADD CONSTRAINT custodial_recovery_tokens_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.custodial_wallets(id) ON DELETE CASCADE;


--
-- Name: custodial_sessions custodial_sessions_wallet_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.custodial_sessions
    ADD CONSTRAINT custodial_sessions_wallet_id_fkey FOREIGN KEY (wallet_id) REFERENCES public.custodial_wallets(id) ON DELETE CASCADE;


--
-- Name: referred_users referred_users_referral_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.referred_users
    ADD CONSTRAINT referred_users_referral_id_fkey FOREIGN KEY (referral_id) REFERENCES public.referrals(id);


--
-- PostgreSQL database dump complete
--

\unrestrict JMKHS8an8n9FhMsx29AvCGdCoQuEul2GQ7pOC1BYMuxSRvzrlfRgvReXznrbNO9

