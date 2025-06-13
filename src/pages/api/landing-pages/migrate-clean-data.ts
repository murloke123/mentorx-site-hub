import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { TemplateService } from '@/services/templateService';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Buscar todas as landing pages que precisam de migração
    const { data: landingPages, error: fetchError } = await supabase
      .from('course_landing_pages')
      .select('id, sec_hero, sec_hero_clean')
      .is('sec_hero_clean', null);
      
    if (fetchError) {
      throw fetchError;
    }
    
    console.log(`🔄 Migrando ${landingPages.length} landing pages...`);
    
    const results = [];
    
    for (const page of landingPages) {
      try {
        // Migrar dados antigos para estrutura limpa
        const cleanData = TemplateService.migrateOldStructure(page.sec_hero);
        
        // Atualizar no banco
        const { error: updateError } = await supabase
          .from('course_landing_pages')
          .update({
            sec_hero_clean: cleanData,
            updated_at: new Date().toISOString()
          })
          .eq('id', page.id);
          
        if (updateError) {
          throw updateError;
        }
        
        results.push({
          id: page.id,
          status: 'success',
          cleanData
        });
        
        console.log(`✅ Migrado: ${page.id}`);
        
      } catch (error) {
        console.error(`❌ Erro ao migrar ${page.id}:`, error);
        results.push({
          id: page.id,
          status: 'error',
          error: error.message
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: `Migração concluída. ${results.filter(r => r.status === 'success').length} sucessos, ${results.filter(r => r.status === 'error').length} erros.`,
      results
    });
    
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

// Endpoint GET para verificar status da migração
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: stats, error } = await supabase
      .from('course_landing_pages')
      .select('id, sec_hero_clean')
      .not('sec_hero', 'is', null);
      
    if (error) throw error;
    
    const total = stats.length;
    const migrated = stats.filter(s => s.sec_hero_clean !== null).length;
    const pending = total - migrated;
    
    return NextResponse.json({
      total,
      migrated,
      pending,
      migrationComplete: pending === 0
    });
    
  } catch (error) {
    console.error('❌ Erro ao verificar status:', error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
} 