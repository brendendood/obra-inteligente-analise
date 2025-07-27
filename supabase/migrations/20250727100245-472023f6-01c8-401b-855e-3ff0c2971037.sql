-- Add new event types to user_event_type enum
ALTER TYPE user_event_type ADD VALUE IF NOT EXISTS 'budget_generated';
ALTER TYPE user_event_type ADD VALUE IF NOT EXISTS 'schedule_created';