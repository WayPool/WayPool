-- Índices críticos para optimización de rendimiento en producción
-- Mejoras identificadas en la auditoría del panel de administración

-- =============================
-- ÍNDICES PARA TABLA USERS
-- =============================

-- Índice para búsquedas por wallet_address (ya existe UNIQUE, pero asegurar performance)
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);

-- Índice para búsquedas por email (frecuente en admin panel)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;

-- Índice para filtrar usuarios admin
CREATE INDEX IF NOT EXISTS idx_users_admin ON users(is_admin) WHERE is_admin = true;

-- Índice compuesto para búsquedas admin frecuentes
CREATE INDEX IF NOT EXISTS idx_users_admin_search ON users(wallet_address, email, is_admin);

-- =============================
-- ÍNDICES PARA POSITION_HISTORY
-- =============================

-- Índice para búsquedas por wallet_address (MUY frecuente)
CREATE INDEX IF NOT EXISTS idx_position_history_wallet ON position_history(wallet_address);

-- Índice para filtrar por status (crítico para admin panel)
CREATE INDEX IF NOT EXISTS idx_position_history_status ON position_history(status);

-- Índice para ordenar por fecha de inicio
CREATE INDEX IF NOT EXISTS idx_position_history_start_date ON position_history(start_date DESC);

-- Índice para ordenar por timestamp
CREATE INDEX IF NOT EXISTS idx_position_history_timestamp ON position_history(timestamp DESC);

-- Índice para filtrar por montos depositados
CREATE INDEX IF NOT EXISTS idx_position_history_amount ON position_history(deposited_usdc);

-- Índice compuesto para consultas admin optimizadas (elimina N+1)
CREATE INDEX IF NOT EXISTS idx_position_history_admin_search 
ON position_history(wallet_address, status, start_date DESC, deposited_usdc);

-- Índice para búsquedas por rango de fechas
CREATE INDEX IF NOT EXISTS idx_position_history_date_range 
ON position_history(start_date, end_date) WHERE start_date IS NOT NULL;

-- Índice para posiciones activas (consulta muy frecuente)
CREATE INDEX IF NOT EXISTS idx_position_history_active 
ON position_history(wallet_address, status) WHERE status = 'Active';

-- Índice para cálculos de fees
CREATE INDEX IF NOT EXISTS idx_position_history_fees 
ON position_history(status, fees_earned) WHERE status = 'Active';

-- =============================
-- ÍNDICES PARA BILLING_PROFILES
-- =============================

-- Índice para búsquedas por wallet_address
CREATE INDEX IF NOT EXISTS idx_billing_profiles_wallet ON billing_profiles(wallet_address);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_billing_profiles_email ON billing_profiles(email) WHERE email IS NOT NULL;

-- Índice para perfiles por defecto
CREATE INDEX IF NOT EXISTS idx_billing_profiles_default ON billing_profiles(is_default) WHERE is_default = true;

-- =============================
-- ÍNDICES PARA CUSTOM_POOLS
-- =============================

-- Índice para búsquedas por address
CREATE INDEX IF NOT EXISTS idx_custom_pools_address ON custom_pools(address);

-- Índice para filtrar pools activos
CREATE INDEX IF NOT EXISTS idx_custom_pools_active ON custom_pools(active) WHERE active = true;

-- Índice para búsquedas por red
CREATE INDEX IF NOT EXISTS idx_custom_pools_network ON custom_pools(network);

-- Índice compuesto para admin de pools
CREATE INDEX IF NOT EXISTS idx_custom_pools_admin 
ON custom_pools(active, network, created_at DESC);

-- =============================
-- ÍNDICES PARA SUPPORT_TICKETS
-- =============================

-- Índice para búsquedas por wallet_address
CREATE INDEX IF NOT EXISTS idx_support_tickets_wallet ON support_tickets(wallet_address);

-- Índice para filtrar por status
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);

-- Índice para ordenar por fecha de creación
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON support_tickets(created_at DESC);

-- Índice para tickets no eliminados
CREATE INDEX IF NOT EXISTS idx_support_tickets_active 
ON support_tickets(status, created_at DESC) WHERE is_deleted = false;

-- =============================
-- ÍNDICES PARA REAL_POSITIONS
-- =============================

-- Índice para búsquedas por wallet_address
CREATE INDEX IF NOT EXISTS idx_real_positions_wallet ON real_positions(wallet_address);

-- Índice para relacionar con posiciones virtuales
CREATE INDEX IF NOT EXISTS idx_real_positions_virtual ON real_positions(virtual_position_id);

-- Índice para filtrar por status
CREATE INDEX IF NOT EXISTS idx_real_positions_status ON real_positions(status);

-- Índice para búsquedas por red
CREATE INDEX IF NOT EXISTS idx_real_positions_network ON real_positions(network);

-- =============================
-- ÍNDICES PARA INVOICES
-- =============================

-- Índice para búsquedas por wallet_address
CREATE INDEX IF NOT EXISTS idx_invoices_wallet ON invoices(wallet_address);

-- Índice para filtrar por status de pago
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- Índice para ordenar por fecha de emisión
CREATE INDEX IF NOT EXISTS idx_invoices_issue_date ON invoices(issue_date DESC);

-- Índice para relacionar con posiciones
CREATE INDEX IF NOT EXISTS idx_invoices_position ON invoices(position_id);

-- =============================
-- ÍNDICES PARA APP_CONFIG
-- =============================

-- Índice para búsquedas por clave (frecuente)
CREATE INDEX IF NOT EXISTS idx_app_config_key ON app_config(key);

-- =============================
-- ESTADÍSTICAS DE TABLA
-- =============================

-- Actualizar estadísticas para mejor plan de consultas
ANALYZE users;
ANALYZE position_history;
ANALYZE billing_profiles;
ANALYZE custom_pools;
ANALYZE support_tickets;
ANALYZE real_positions;
ANALYZE invoices;
ANALYZE app_config;