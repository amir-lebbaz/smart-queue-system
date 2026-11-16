export type TicketType = 'qr' | 'walkin';
export type TicketStatus = 'waiting' | 'called' | 'serving' | 'held' | 'completed' | 'cancelled';
export type FeedbackRating = 'great' | 'okay' | 'bad';
export type SubscriptionPlan = 'starter' | 'pro' | 'elite';
export type BillingCycle = 'monthly' | 'yearly';

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
  plan?: SubscriptionPlan;
  billing_cycle?: BillingCycle;
  subscription_expires_at?: string | number | null;
}

export interface Ticket {
  id: number;
  org_slug: string;
  ticket_number: number;
  customer_name: string | null;
  customer_phone: string; // Mandatory phone number
  ticket_type: TicketType;
  status: TicketStatus;
  estimated_wait_mins: number;
  estimated_clock_time: string; // formatted 'HH:MM'
  feedback_rating?: FeedbackRating | null;
  feedback_created_at?: number | null;
  created_at: number;
}

export interface DailyStats {
  totalIssued: number;
  totalCompleted: number;
  totalHeld: number;
  totalCancelled: number;
  currentWaiting: number;
  ratings?: {
    great: number;
    okay: number;
    bad: number;
  };
}

export interface QueueState {
  organization: Organization;
  currentTicket: Ticket | null; // Currently called or serving
  heldTickets: Ticket[];
  waitingTickets: Ticket[];
  completedCount: number;
  totalWaiting: number;
  stats?: DailyStats;
  myTicketStatus?: TicketStatus | null;
}
