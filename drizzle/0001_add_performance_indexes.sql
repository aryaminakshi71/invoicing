-- Add performance indexes for frequently queried columns

-- Invoices table indexes
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_organization_id ON invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client_id ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_organization_status ON invoices(organization_id, status);

-- Clients table indexes
CREATE INDEX IF NOT EXISTS idx_clients_organization_id ON clients(organization_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Sessions table indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);

-- Organizations table indexes
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_created_at ON organizations(created_at DESC);

-- Organization members table indexes
CREATE INDEX IF NOT EXISTS idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_organization_members_role ON organization_members(role);

-- Payments table indexes (if exists)
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- Invoice items table indexes
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_invoices_org_client_status ON invoices(organization_id, client_id, status);
CREATE INDEX IF NOT EXISTS idx_invoices_status_due_date ON invoices(status, due_date);
