import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Save, Edit3, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  LandingPageData,
  HeroSection,
  AboutCourseSection,
  AboutMentorSection,
  ResultsSection,
  TestimonialsSection,
  CurriculumSection,
  BonusSection,
  PricingSection,
  FAQSection,
  FinalCTASection
} from '@/types/landing-page';
import { updateLandingPageSection } from '@/services/landingPageService';

interface LandingPageEditorProps {
  landingPageData: LandingPageData;
  onDataChange: (updatedData: LandingPageData) => void;
}

const LandingPageEditor: React.FC<LandingPageEditorProps> = ({ 
  landingPageData, 
  onDataChange 
}) => {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const sections = [
    { key: 'sec_hero', title: 'Seção Hero', icon: '🎯', data: landingPageData.sec_hero },
    { key: 'sec_about_course', title: 'Sobre o Curso', icon: '📚', data: landingPageData.sec_about_course },
    { key: 'sec_about_mentor', title: 'Sobre o Mentor', icon: '👨‍🏫', data: landingPageData.sec_about_mentor },
    { key: 'sec_results', title: 'Resultados Comprovados', icon: '📊', data: landingPageData.sec_results },
    { key: 'sec_testimonials', title: 'Depoimentos', icon: '💬', data: landingPageData.sec_testimonials },
    { key: 'sec_curriculum', title: 'Conteúdo Programático', icon: '📋', data: landingPageData.sec_curriculum },
    { key: 'sec_bonus', title: 'Bônus Exclusivos', icon: '🎁', data: landingPageData.sec_bonus },
    { key: 'sec_pricing', title: 'Preços', icon: '💰', data: landingPageData.sec_pricing },
    { key: 'sec_faq', title: 'FAQ', icon: '❓', data: landingPageData.sec_faq },
    { key: 'sec_final_cta', title: 'Chamada Final', icon: '🚀', data: landingPageData.sec_final_cta }
  ];

  const handleEditSection = (sectionKey: string) => {
    setEditingSection(sectionKey);
    const section = sections.find(s => s.key === sectionKey);
    if (section) {
      setFormData({ ...section.data });
    }
  };

  const handleSaveSection = async () => {
    if (!editingSection || !landingPageData.id) return;

    setIsSaving(true);
    try {
      await updateLandingPageSection(landingPageData.id, {
        sectionType: editingSection as any,
        data: formData
      });

      // Atualizar dados locais
      const updatedData = {
        ...landingPageData,
        [editingSection]: formData
      };
      onDataChange(updatedData);

      setEditingSection(null);
      toast({
        title: 'Seção atualizada!',
        description: 'As alterações foram salvas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar seção:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível salvar as alterações.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setFormData({});
  };

  const toggleSection = (sectionKey: string) => {
    const newCollapsed = new Set(collapsedSections);
    if (newCollapsed.has(sectionKey)) {
      newCollapsed.delete(sectionKey);
    } else {
      newCollapsed.add(sectionKey);
    }
    setCollapsedSections(newCollapsed);
  };

  const renderFieldEditor = (key: string, value: any, label: string, type = 'text') => {
    if (type === 'textarea') {
      return (
        <div className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Textarea
            id={key}
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
            className="min-h-[100px]"
          />
        </div>
      );
    }

    if (type === 'array') {
      return (
        <div className="space-y-2">
          <Label>{label}</Label>
          <div className="space-y-2">
            {(value || []).map((item: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const newArray = [...(value || [])];
                    newArray[index] = e.target.value;
                    setFormData({ ...formData, [key]: newArray });
                  }}
                  placeholder={`${label} ${index + 1}`}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newArray = (value || []).filter((_: any, i: number) => i !== index);
                    setFormData({ ...formData, [key]: newArray });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newArray = [...(value || []), ''];
                setFormData({ ...formData, [key]: newArray });
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar {label}
            </Button>
          </div>
        </div>
      );
    }

    if (type === 'number') {
      return (
        <div className="space-y-2">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            type="number"
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [key]: parseFloat(e.target.value) || 0 })}
          />
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <Label htmlFor={key}>{label}</Label>
        <Input
          id={key}
          type={type}
          value={value || ''}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        />
      </div>
    );
  };

  const renderSectionEditor = (sectionKey: string, data: any) => {
    switch (sectionKey) {
      case 'sec_hero':
        return (
          <div className="space-y-4">
            {renderFieldEditor('title', data.title, 'Título')}
            {renderFieldEditor('subtitle', data.subtitle, 'Subtítulo')}
            {renderFieldEditor('description', data.description, 'Descrição', 'textarea')}
            {renderFieldEditor('cta_text', data.cta_text, 'Texto do Botão')}
            {renderFieldEditor('course_duration', data.course_duration, 'Duração do Curso')}
            {renderFieldEditor('students_count', data.students_count, 'Número de Alunos')}
            {renderFieldEditor('rating', data.rating, 'Avaliação')}
            {renderFieldEditor('content_hours', data.content_hours, 'Horas de Conteúdo')}
          </div>
        );

      case 'sec_about_course':
        return (
          <div className="space-y-4">
            {renderFieldEditor('title', data.title, 'Título')}
            {renderFieldEditor('description', data.description, 'Descrição', 'textarea')}
            {renderFieldEditor('objectives', data.objectives, 'Objetivos', 'array')}
            {renderFieldEditor('target_audience', data.target_audience, 'Público-Alvo', 'array')}
            {renderFieldEditor('prerequisites', data.prerequisites, 'Pré-requisitos')}
            {renderFieldEditor('methodology', data.methodology, 'Metodologia')}
          </div>
        );

      case 'sec_about_mentor':
        return (
          <div className="space-y-4">
            {renderFieldEditor('title', data.title, 'Título')}
            {renderFieldEditor('mentor_name', data.mentor_name, 'Nome do Mentor')}
            {renderFieldEditor('description', data.description, 'Descrição', 'textarea')}
            {renderFieldEditor('bio', data.bio, 'Biografia', 'textarea')}
            {renderFieldEditor('credentials', data.credentials, 'Credenciais', 'array')}
            {renderFieldEditor('achievements', data.achievements, 'Conquistas', 'array')}
            {renderFieldEditor('experience_years', data.experience_years, 'Anos de Experiência', 'number')}
          </div>
        );

      case 'sec_pricing':
        return (
          <div className="space-y-4">
            {renderFieldEditor('title', data.title, 'Título')}
            {renderFieldEditor('subtitle', data.subtitle, 'Subtítulo')}
            {renderFieldEditor('price', data.price, 'Preço', 'number')}
            {renderFieldEditor('original_price', data.original_price, 'Preço Original', 'number')}
            {renderFieldEditor('discount_percentage', data.discount_percentage, 'Desconto (%)', 'number')}
          </div>
        );

      case 'sec_faq':
        return (
          <div className="space-y-4">
            {renderFieldEditor('title', data.title, 'Título')}
            {renderFieldEditor('subtitle', data.subtitle, 'Subtítulo')}
            <div className="space-y-2">
              <Label>Perguntas e Respostas</Label>
              {(data.faqs || []).map((faq: any, index: number) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <Input
                      value={faq.question || ''}
                      onChange={(e) => {
                        const newFaqs = [...(data.faqs || [])];
                        newFaqs[index] = { ...faq, question: e.target.value };
                        setFormData({ ...formData, faqs: newFaqs });
                      }}
                      placeholder="Pergunta"
                    />
                    <Textarea
                      value={faq.answer || ''}
                      onChange={(e) => {
                        const newFaqs = [...(data.faqs || [])];
                        newFaqs[index] = { ...faq, answer: e.target.value };
                        setFormData({ ...formData, faqs: newFaqs });
                      }}
                      placeholder="Resposta"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFaqs = (data.faqs || []).filter((_: any, i: number) => i !== index);
                        setFormData({ ...formData, faqs: newFaqs });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const newFaqs = [...(data.faqs || []), { question: '', answer: '' }];
                  setFormData({ ...formData, faqs: newFaqs });
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar FAQ
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {renderFieldEditor('title', data.title, 'Título')}
            {renderFieldEditor('subtitle', data.subtitle, 'Subtítulo')}
            {data.description && renderFieldEditor('description', data.description, 'Descrição', 'textarea')}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Editor de Landing Page</h2>
        <Badge variant="secondary">
          {sections.length} seções
        </Badge>
      </div>

      {sections.map((section) => {
        const isCollapsed = collapsedSections.has(section.key);
        const isEditing = editingSection === section.key;

        return (
          <Card key={section.key} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSection(section.key)}
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(section.key)}
                  >
                    {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isCollapsed && (
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    {renderSectionEditor(section.key, formData)}
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleSaveSection}
                        disabled={isSaving}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Salvando...' : 'Salvar'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">
                      <strong>Título:</strong> {section.data.title || 'Não definido'}
                    </div>
                    {(section.data as any).subtitle && (
                      <div className="text-sm text-gray-600">
                        <strong>Subtítulo:</strong> {(section.data as any).subtitle}
                      </div>
                    )}
                    {(section.data as any).description && (
                      <div className="text-sm text-gray-600">
                        <strong>Descrição:</strong> {(section.data as any).description.substring(0, 100)}
                        {(section.data as any).description.length > 100 ? '...' : ''}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default LandingPageEditor; 