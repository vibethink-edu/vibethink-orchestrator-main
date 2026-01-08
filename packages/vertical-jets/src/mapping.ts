import { UsageEvent } from '@vibethink/core-assets';
import { JET_TAXONOMY } from './config';

// Domain Types (Interfaces representing external system data)
export interface JetCrew {
    id: string;
    name: string;
    role: 'pilot' | 'copilot' | 'attendant';
}

export interface JetLeg {
    id: string;
    origin: string; // ICAO
    destination: string; // ICAO
    off_block: Date;
    on_block: Date;
    flight_time_minutes: number;
}

export interface JetFlight {
    id: string;
    tail_number: string;
    legs: JetLeg[];
    crew: JetCrew[];
    owner_id?: string; // Who booked/flew this?
    flight_type: 'owner' | 'charter' | 'maintenance' | 'relocation';
}

// Mapper Function
export function mapFlightToUsageEvent(flight: JetFlight, assetId: string): UsageEvent {
    // Calculate total duration
    const totalMinutes = flight.legs.reduce((acc, leg) => acc + leg.flight_time_minutes, 0);
    const totalHours = totalMinutes / 60;

    if (!flight.legs.length) {
        throw new Error(`Invalid flight data: Flight ${flight.id} has no legs.`);
    }

    // Determine global start/end
    const startAt = flight.legs[0].off_block;
    const endAt = flight.legs[flight.legs.length - 1].on_block;

    // Tags for traceability
    const tags = [
        `flight_number:${flight.id}`,
        `tail_number:${flight.tail_number}`,
        `type:${flight.flight_type}`
    ];

    if (flight.owner_id) {
        tags.push(`owner_id:${flight.owner_id}`);
    }

    return {
        id: `usage_flight_${flight.id}`,
        asset_id: assetId,
        start_at: startAt,
        end_at: endAt,
        usage_metric: JET_TAXONOMY.USAGE_METRICS.FLIGHT_HOURS as 'hours', // Force cast or ensure alignment
        metric_value: totalHours,
        refs: {
            source: 'vertical-jets',
            source_ids: [flight.id, ...flight.legs.map(l => l.id)],
            tags: tags
        }
    };
}
