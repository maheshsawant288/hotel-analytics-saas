import Papa from 'papaparse';
import { Booking, Channel, BookingStatus } from '@/types';

export interface CSVParseResult {
  data: Partial<Booking>[];
  errors: string[];
}

const VALID_CHANNELS = new Set<Channel>([
  'direct', 'booking_com', 'makemytrip', 'agoda', 'goibibo', 'expedia', 'walk_in',
]);

const VALID_STATUSES = new Set<BookingStatus>([
  'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show',
]);

export function parseBookingsCSV(csvText: string): CSVParseResult {
  const errors: string[] = [];

  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
  });

  if (result.errors.length > 0) {
    errors.push(...result.errors.map((e) => `Row ${e.row}: ${e.message}`));
  }

  const data: Partial<Booking>[] = result.data.map((row, i) => {
    const rowNum = i + 2;

    const channel = row.channel as Channel;
    const status = row.status as BookingStatus;
    const roomRate = parseFloat(row.room_rate);

    if (!VALID_CHANNELS.has(channel)) {
      errors.push(`Row ${rowNum}: invalid channel "${row.channel}"`);
    }
    if (!VALID_STATUSES.has(status)) {
      errors.push(`Row ${rowNum}: invalid status "${row.status}"`);
    }
    if (isNaN(roomRate)) {
      errors.push(`Row ${rowNum}: room_rate "${row.room_rate}" is not a number`);
    }

    return {
      hotel_id: row.hotel_id,
      room_id: row.room_id,
      check_in: row.check_in,
      check_out: row.check_out,
      status: VALID_STATUSES.has(status) ? status : undefined,
      channel: VALID_CHANNELS.has(channel) ? channel : undefined,
      room_rate: isNaN(roomRate) ? undefined : roomRate,
      adults: parseInt(row.adults) || 1,
      children: parseInt(row.children) || 0,
    };
  });

  return { data, errors };
}
