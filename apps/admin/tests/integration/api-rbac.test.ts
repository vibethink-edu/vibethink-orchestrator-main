import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/admin/tenants/route';

// Mock the Auth Service
vi.mock('@/lib/auth', () => ({
    getAdminSession: vi.fn(),
}));

// Mock Audit Service to avoid side effects
vi.mock('@/lib/audit-service', () => ({
    AuditService: {
        log: vi.fn(),
    }
}));

import { getAdminSession } from '@/lib/auth';

describe('Admin API Security & RBAC', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /tenants', () => {
        it('🛡️ should return 401 if not authenticated', async () => {
            (getAdminSession as any).mockResolvedValue(null);

            const req = new NextRequest("http://localhost/api/admin/tenants");
            const res = await GET(req);

            expect(res.status).toBe(401);
            const body = await res.json();
            expect(body.error).toBe("Unauthorized");
        });

        it('🛡️ should return 200 for SUPPORT role (Read Access)', async () => {
            (getAdminSession as any).mockResolvedValue({ role: 'SUPPORT', email: 'support@vito.io' });

            const req = new NextRequest("http://localhost/api/admin/tenants");
            const res = await GET(req);

            expect(res.status).toBe(200);
            // Verify Anti-Cache Headers
            expect(res.headers.get('Cache-Control')).toContain('no-store');
        });
    });

    describe('POST /tenants (Mutations)', () => {
        it('🛡️ should return 403 for SUPPORT role (Write Denied)', async () => {
            (getAdminSession as any).mockResolvedValue({ role: 'SUPPORT', email: 'support@vito.io' });

            const req = new NextRequest("http://localhost/api/admin/tenants", {
                method: 'POST',
                body: JSON.stringify({ name: "New Tenant" })
            });
            const res = await POST(req);

            expect(res.status).toBe(403);
        });

        it('🛡️ should return 400 if reason_code is missing (Audit Context)', async () => {
            (getAdminSession as any).mockResolvedValue({ role: 'OPS', email: 'ops@vito.io' });

            const req = new NextRequest("http://localhost/api/admin/tenants", {
                method: 'POST',
                body: JSON.stringify({ name: "New Tenant" }) // Missing reason_code
            });
            const res = await POST(req);

            expect(res.status).toBe(400);
            const body = await res.json();
            expect(body.error).toBe("MISSING_AUDIT_CONTEXT");
        });

        it('✅ should success (200) for OPS role with valid context', async () => {
            (getAdminSession as any).mockResolvedValue({ role: 'OPS', email: 'ops@vito.io' });

            const req = new NextRequest("http://localhost/api/admin/tenants", {
                method: 'POST',
                body: JSON.stringify({
                    name: "New Tenant",
                    reason_code: "TICKET-123",
                    ticket_ref: "JIRA-999"
                })
            });
            const res = await POST(req);

            expect(res.status).toBe(200);
        });
    });
});
