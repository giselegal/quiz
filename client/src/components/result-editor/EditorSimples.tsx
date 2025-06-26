
"use client";
import { safeLocalStorage } from "@/utils/safeLocalStorage";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Palette, Type } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const EditorSimples: React.FC = () => {
  const [cores, setCores] = useState({
    primaria: '#B89B7A',
    secundaria: '#aa6b5d',
    fundo: '#fffaf7',
    texto: '#432818'
  });
  
  const [texto, setTexto] = useState({
    titulo: 'Descubra Seu Estilo Único',
    subtitulo: 'Guia Personalizado',
    descricao: 'Transforme sua imagem com confiança.',
    botao: 'Adquirir Agora'
  });

  const salvar = () => {
    safeLocalStorage.setItem('editorConfig', JSON.stringify({ cores, texto }));
    toast({
      title: "Salvo!",
      description: "Configurações foram salvas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Editor Visual Simples</h1>
          <p className="text-gray-600">Edite cores e textos em tempo real</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Palette className="h-5 w-5 mr-2 text-blue-600" />
                <h2 className="text-xl font-semibold">Cores</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Cor Primária</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      type="color"
                      value={cores.primaria}
                      onChange={(e) => setCores({...cores, primaria: e.target.value})}
                      className="w-16"
                    />
                    <Input
                      type="text"
                      value={cores.primaria}
                      onChange={(e) => setCores({...cores, primaria: e.target.value})}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Type className="h-5 w-5 mr-2 text-green-600" />
                <h2 className="text-xl font-semibold">Textos</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Título Principal</Label>
                  <Input
                    value={texto.titulo}
                    onChange={(e) => setTexto({...texto, titulo: e.target.value})}
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            <Button onClick={salvar} className="w-full" size="lg">
              <Save className="h-4 w-4 mr-2" />
              Salvar Configurações
            </Button>
          </div>

          <div className="lg:sticky lg:top-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div 
                className="p-6 rounded-lg"
                style={{
                  backgroundColor: cores.fundo,
                  color: cores.texto
                }}
              >
                <h1 
                  className="text-4xl font-bold mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${cores.primaria}, ${cores.secundaria})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {texto.titulo}
                </h1>
                
                <button
                  className="px-6 py-3 rounded-lg text-white font-semibold"
                  style={{
                    background: `linear-gradient(135deg, ${cores.primaria}, ${cores.secundaria})`
                  }}
                >
                  {texto.botao}
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorSimples;
