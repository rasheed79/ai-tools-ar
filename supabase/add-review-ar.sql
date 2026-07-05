-- Run once in Supabase SQL Editor: adds long-form review column, fixes AdSense "low value content" flag
alter table tools add column if not exists review_ar text;
