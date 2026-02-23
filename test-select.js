const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zljmdaaixhswrquuhwfx.supabase.co';
const supabaseKey = 'sb_publishable_AapLccShuKYV2t0FFmSLEA_7okriTjK';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSelect() {
  console.log("Testing public SELECT query (like a visitor)...");

  const { data: allArticles, error: allErr } = await supabase
    .from('articles')
    .select('id, title, slug, status, published_at');

  console.log("All Articles:", JSON.stringify(allArticles, null, 2));
  if (allErr) console.error("Error fetching all:", allErr);

  const now = new Date().toISOString();
  console.log("Current ISO time used for filter:", now);

  const { data: pubArticles, error: pubErr } = await supabase
    .from('articles')
    .select('id, title, slug, status, published_at')
    .eq('status', 'published')
    .lte('published_at', now);

  console.log("Filtered Published Articles:", JSON.stringify(pubArticles, null, 2));
  if (pubErr) console.error("Error fetching published:", pubErr);
}

testSelect();
