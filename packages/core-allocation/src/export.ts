import { AllocationLedgerEntry } from './models';

export function exportLedgerToCSV(ledger: AllocationLedgerEntry[]): string {
    const header = 'Period Label,Period Start,Period End,Owner ID,Cost ID,Allocated Amount,Rationale,Status,Evidence\n';

    const rows = ledger.map(entry => {
        return [
            `"${entry.period.label}"`,
            entry.period.start.toISOString(),
            entry.period.end.toISOString(),
            `"${entry.owner_id}"`,
            `"${entry.cost_id}"`,
            entry.allocated_amount.toFixed(2),
            `"${entry.rationale.replace(/"/g, '""')}"`,
            entry.status,
            `"${entry.evidence_refs.join(';')}"`
        ].join(',');
    });

    return header + rows.join('\n');
}

export function exportLedgerToJSON(ledger: AllocationLedgerEntry[]): string {
    return JSON.stringify(ledger, null, 2);
}
