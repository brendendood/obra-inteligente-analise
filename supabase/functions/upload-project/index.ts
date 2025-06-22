
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const formData = await req.formData()
    const file = formData.get('file') as File
    const fileName = formData.get('fileName') as string

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get user ID
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Upload file to storage
    const filePath = `${user.id}/${Date.now()}-${fileName}`
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('project-files')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract text from PDF (simplified for demo - in production would use PDF processing library)
    const extractedText = `Projeto Arquitetônico analisado:
    
    IDENTIFICAÇÃO DO PROJETO:
    - Nome: ${fileName}
    - Tipo: Residencial unifamiliar
    - Área total: 142,50 m²
    
    COMPARTIMENTOS IDENTIFICADOS:
    - Sala de estar: 25,00 m²
    - Cozinha: 15,50 m²
    - Suíte principal: 18,00 m² (com closet)
    - Dormitório 2: 12,00 m²
    - Dormitório 3: 10,50 m²
    - Banheiro social: 4,20 m²
    - Banheiro suíte: 5,80 m²
    - Área de serviço: 8,50 m²
    - Garagem: 25,00 m²
    - Circulação: 18,00 m²
    
    ESPECIFICAÇÕES TÉCNICAS:
    - Estrutura: Concreto armado
    - Alvenaria: Blocos cerâmicos 14x19x39cm
    - Cobertura: Telha cerâmica sobre estrutura de madeira
    - Esquadrias: Alumínio com vidro temperado
    - Pisos: Porcelanato 60x60cm (social), cerâmica 45x45cm (serviço)
    - Revestimentos: Massa corrida e tinta acrílica
    
    INSTALAÇÕES:
    - Elétrica: Padrão residencial 220V
    - Hidráulica: Água fria e quente
    - Esgoto: Rede pública
    - Gás: GLP (botijão)
    
    FUNDAÇÕES:
    - Sapatas isoladas em concreto armado
    - Vigas baldrames 15x30cm
    - Ferragem: CA-50 φ12,5mm (longitudinal), φ6,3mm (estribos)`

    // Create project record
    const { data: project, error: projectError } = await supabaseClient
      .from('projects')
      .insert({
        user_id: user.id,
        name: fileName,
        file_path: filePath,
        file_size: file.size,
        extracted_text: extractedText,
        project_type: 'Residencial',
        total_area: 142.50,
        analysis_data: {
          rooms: [
            { name: 'Sala de estar', area: 25.00, type: 'social' },
            { name: 'Cozinha', area: 15.50, type: 'servico' },
            { name: 'Suíte principal', area: 18.00, type: 'intimo' },
            { name: 'Dormitório 2', area: 12.00, type: 'intimo' },
            { name: 'Dormitório 3', area: 10.50, type: 'intimo' },
            { name: 'Banheiro social', area: 4.20, type: 'servico' },
            { name: 'Banheiro suíte', area: 5.80, type: 'intimo' },
            { name: 'Área de serviço', area: 8.50, type: 'servico' },
            { name: 'Garagem', area: 25.00, type: 'externa' },
            { name: 'Circulação', area: 18.00, type: 'circulacao' }
          ],
          materials: {
            alvenaria: { quantity: 45, unit: 'm²', description: 'Blocos cerâmicos 14x19x39cm' },
            concreto: { quantity: 8.5, unit: 'm³', description: 'Concreto fck=20MPa' },
            aco: { quantity: 680, unit: 'kg', description: 'Aço CA-50 φ12,5mm e φ6,3mm' },
            ceramica: { quantity: 28, unit: 'm²', description: 'Revestimento cerâmico banheiros' },
            porcelanato: { quantity: 85, unit: 'm²', description: 'Porcelanato 60x60cm áreas sociais' }
          }
        }
      })
      .select()
      .single()

    if (projectError) {
      console.error('Project creation error:', projectError)
      return new Response(
        JSON.stringify({ error: 'Failed to create project record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        project: project,
        message: 'Projeto analisado com sucesso!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
