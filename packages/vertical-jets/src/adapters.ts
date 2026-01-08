import { JetFlight, JetCrew } from './mapping';

export interface JetDataSourceAdapter {
    fetchFlights(assetId: string, start: Date, end: Date): Promise<JetFlight[]>;
    fetchCrewDetails(crewId: string): Promise<JetCrew>;
    // Other methods to import external data
}
