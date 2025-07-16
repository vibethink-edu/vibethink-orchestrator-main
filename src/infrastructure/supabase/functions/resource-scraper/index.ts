
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapeRequest {
  url: string;
  extractionType: 'article' | 'product' | 'research' | 'general';
  tags?: string[];
  userId: string;
}

serve(async (req) => {
  console.log('Resource scraper function called');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const { url, extractionType, tags = [], userId }: ScrapeRequest = await req.json();

    console.log('Scraping URL:', url, 'Type:', extractionType);

    // Step 1: Scrape with Firecrawl
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v0/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('FIRECRAWL_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        pageOptions: {
          onlyMainContent: true,
          includeHtml: false,
        },
        extractorOptions: {
          mode: 'llm-extraction',
          extractionPrompt: `Extract the main content from this webpage. Focus on:
          - Title and main heading
          - Key information and data
          - Important links and references
          - Publication date if available
          - Author information if available
          
          Return structured data suitable for ${extractionType} type content.`
        }
      }),
    });

    if (!firecrawlResponse.ok) {
      throw new Error(`Firecrawl API failed: ${firecrawlResponse.statusText}`);
    }

    const scrapeResult = await firecrawlResponse.json();
    console.log('Scraping completed');

    // Step 2: AI-powered content analysis and categorization
    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Eres un analista de contenido especializado. Analiza el contenido scrapeado y proporciona:
            1. Resumen ejecutivo (2-3 frases)
            2. Categorías relevantes
            3. Palabras clave importantes
            4. Nivel de confiabilidad (1-10)
            5. Utilidad para ${extractionType}
            6. Tags sugeridos adicionales
            
            Responde en formato JSON estructurado.`
          },
          {
            role: 'user',
            content: `URL: ${url}
            Tipo de extracción: ${extractionType}
            Tags proporcionados: ${tags.join(', ')}
            
            Contenido scrapeado: ${JSON.stringify(scrapeResult.data?.content || scrapeResult.data?.text)}`
          }
        ],
        temperature: 0.2,
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`AI analysis failed: ${analysisResponse.statusText}`);
    }

    const analysisResult = await analysisResponse.json();
    let analysis;
    
    try {
      analysis = JSON.parse(analysisResult.choices[0].message.content);
    } catch {
      // Fallback if JSON parsing fails
      analysis = {
        summary: analysisResult.choices[0].message.content.substring(0, 300),
        categories: [extractionType],
        keywords: tags,
        reliability: 7,
        utility: 8,
        suggestedTags: []
      };
    }

    console.log('AI analysis completed');

    // Step 3: Store in database
    const { data: resourceRecord, error: dbError } = await supabase
      .from('scraped_resources')
      .insert({
        url,
        title: scrapeResult.data?.title || analysis.title || 'Untitled',
        content: scrapeResult.data?.content || scrapeResult.data?.text,
        summary: analysis.summary,
        extraction_type: extractionType,
        categories: analysis.categories || [extractionType],
        keywords: analysis.keywords || [],
        tags: [...tags, ...(analysis.suggestedTags || [])],
        reliability_score: analysis.reliability || 7,
        utility_score: analysis.utility || 8,
        user_id: userId,
        scraped_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to store resource: ${dbError.message}`);
    }

    console.log('Resource stored with ID:', resourceRecord.id);

    // Step 4: Send real-time notification
    const channel = supabase.channel('resources');
    await channel.send({
      type: 'broadcast',
      event: 'resource_scraped',
      payload: {
        resourceId: resourceRecord.id,
        url,
        title: resourceRecord.title,
        userId,
      }
    });

    return new Response(JSON.stringify({
      success: true,
      resourceId: resourceRecord.id,
      title: resourceRecord.title,
      summary: analysis.summary,
      categories: analysis.categories,
      suggestedTags: analysis.suggestedTags,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in resource-scraper:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
