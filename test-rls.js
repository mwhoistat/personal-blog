const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://zljmdaaixhswrquuhwfx.supabase.co',
  'sb_publishable_AapLccShuKYV2t0FFmSLEA_7okriTjK'
);

async function testRLS() {
  console.log("Attempting insert using ANON KEY...");

  // Try to insert a dummy article (this simulates an unauthenticated request without cookies)
  const result = await supabase
    .from('articles')
    .insert({
      title: 'Audit RLS Test',
      slug: 'audit-rls-test-' + Date.now(),
      content: 'This is a test.',
      status: 'draft',
      author_id: '00000000-0000-0000-0000-000000000000'
    })
    .select()
    .single();

  console.log("Insert Result:", JSON.stringify(result, null, 2));
}

testRLS();
