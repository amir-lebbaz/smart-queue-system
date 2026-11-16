export type TicketType = 'qr' | 'walkin';
export type TicketStatus = 'waiting' | 'serving' | 'held' | 'completed' | 'cancelled';

export interface Organization {
  id: number;
  slug: string;
  name: string;
  sector_label: string; // e.g., 'مريض' | 'زبون' | 'طالب'
  staff_title: string;  // e.g., 'الطبيب' | 'الحلاق' | 'المسير'
  pin_code: string;
  avg_service_mins: number;
  current_ticket_number: number;
  last_issued_number: number;
  last_call_timestamp: number | null;
  is_active: number;
}

export interface Ticket {
  id: number;
  org_slug: string;
  ticket_number: number;
  customer_name: string | null;
  customer_phone: string | null;
  ticket_type: TicketType;
  status: TicketStatus;
  estimated_wait_mins: number;
  estimated_clock_time: string; // formatted 'HH:MM'
  created_at: number;
}

export interface DailyStats {
  totalIssued: number;
  totalCompleted: number;
  totalHeld: number;
  totalCancelled: number;
  currentWaiting: number;
}

export interface QueueState {
  organization: Organization;
  currentTicket: Ticket | null;
  heldTickets: Ticket[];
  waitingTickets: Ticket[];
  completedCount: number;
  totalWaiting: number;
  stats?: DailyStats;
}
