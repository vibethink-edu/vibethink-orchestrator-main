-- Migration: Create meetings table
-- Description: Table to store meeting transcriptions and AI-generated minutes
-- Author: AI Pair Platform - Backend Team
-- Version: 1.0.0

-- Create meetings table
CREATE TABLE IF NOT EXISTS public.meetings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Meeting metadata
    title TEXT NOT NULL,
    meeting_date DATE NOT NULL DEFAULT CURRENT_DATE,
    attendees TEXT[] DEFAULT '{}',
    
    -- AI processing results
    transcription TEXT NOT NULL,
    meeting_minutes JSONB NOT NULL DEFAULT '{}',
    
    -- Processing metadata
    processing_metadata JSONB DEFAULT '{}',
    
    -- File metadata
    original_filename TEXT,
    file_size_bytes BIGINT,
    file_type TEXT,
    
    -- Status and timestamps
    status TEXT DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_meetings_company_id ON public.meetings(company_id);
CREATE INDEX idx_meetings_created_by ON public.meetings(created_by);
CREATE INDEX idx_meetings_created_at ON public.meetings(created_at DESC);
CREATE INDEX idx_meetings_meeting_date ON public.meetings(meeting_date DESC);
CREATE INDEX idx_meetings_status ON public.meetings(status);

-- Enable RLS (Row Level Security)
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for multi-tenant isolation

-- Policy for SELECT: Users can only see meetings from their company
CREATE POLICY "Users can view meetings from their company" ON public.meetings
    FOR SELECT USING (
        company_id IN (
            SELECT up.company_id 
            FROM public.user_profiles up 
            WHERE up.id = auth.uid()
        )
    );

-- Policy for INSERT: Users can only create meetings for their company
CREATE POLICY "Users can create meetings for their company" ON public.meetings
    FOR INSERT WITH CHECK (
        company_id IN (
            SELECT up.company_id 
            FROM public.user_profiles up 
            WHERE up.id = auth.uid()
        )
        AND created_by = auth.uid()
    );

-- Policy for UPDATE: Users can only update meetings they created in their company
CREATE POLICY "Users can update their own meetings" ON public.meetings
    FOR UPDATE USING (
        company_id IN (
            SELECT up.company_id 
            FROM public.user_profiles up 
            WHERE up.id = auth.uid()
        )
        AND created_by = auth.uid()
    );

-- Policy for DELETE: Only ADMIN+ can delete meetings in their company
CREATE POLICY "Admins can delete meetings in their company" ON public.meetings
    FOR DELETE USING (
        company_id IN (
            SELECT up.company_id 
            FROM public.user_profiles up 
            WHERE up.id = auth.uid()
            AND up.role IN ('ADMIN', 'OWNER')
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_meetings_updated_at 
    BEFORE UPDATE ON public.meetings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE public.meetings IS 'Stores meeting transcriptions and AI-generated minutes with multi-tenant isolation';
COMMENT ON COLUMN public.meetings.company_id IS 'Company that owns this meeting (for multi-tenant isolation)';
COMMENT ON COLUMN public.meetings.meeting_minutes IS 'AI-generated structured meeting minutes in JSON format';
COMMENT ON COLUMN public.meetings.processing_metadata IS 'Metadata about AI processing (tokens used, cost, duration, etc.)';
COMMENT ON COLUMN public.meetings.attendees IS 'Array of attendee names or emails'; 