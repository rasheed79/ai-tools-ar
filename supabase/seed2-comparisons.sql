-- Comparisons for new + existing tools
-- Run after seed.sql + seed2.sql
-- Uses slug subqueries — no need to know UUIDs

insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'chatgpt'        and b.slug = 'claude'          on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'chatgpt'        and b.slug = 'gemini'          on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'chatgpt'        and b.slug = 'perplexity'      on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'claude'         and b.slug = 'gemini'          on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'claude'         and b.slug = 'perplexity'      on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'chatgpt'        and b.slug = 'jasper-ai'       on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'jasper-ai'      and b.slug = 'grammarly'       on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'notion-ai'      and b.slug = 'jasper-ai'       on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'midjourney'     and b.slug = 'dalle-3'         on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'midjourney'     and b.slug = 'canva-ai'        on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'midjourney'     and b.slug = 'leonardo-ai'     on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'dalle-3'        and b.slug = 'adobe-firefly'   on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'canva-ai'       and b.slug = 'adobe-firefly'   on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'leonardo-ai'    and b.slug = 'adobe-firefly'   on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'github-copilot' and b.slug = 'cursor'          on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'github-copilot' and b.slug = 'replit-ai'       on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'cursor'         and b.slug = 'replit-ai'       on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'elevenlabs'     and b.slug = 'murf-ai'         on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'elevenlabs'     and b.slug = 'suno'            on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'murf-ai'        and b.slug = 'suno'            on conflict do nothing;
insert into comparisons (tool_a_id, tool_b_id)
select a.id, b.id from tools a, tools b where a.slug = 'runway'         and b.slug = 'synthesia'       on conflict do nothing;
