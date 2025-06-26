import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Save, 
  Upload, 
  Undo2, 
  Redo2, 
  Eye, 
  Smartphone, 
  Plus, 
  Trash2, 
  GripVertical, 
  Edit3,
  Type,
  Image as ImageIcon,
  MousePointer,
  ToggleLeft,
  Palette,
  Settings,
  Loader2,
  ArrowLeft
} from "lucide-react";

// Tipos melhorados
interface QuizOption {
  id: string;
  text: string;
  value: string;
  image?: string;
  scoreValue?: number;
  styleCategory?: string;
}

interface Component {
  id: string;
  type: 'heading' | 'text' | 'image' | 'input' | 'button' | 'options' | 'spacer';
  props: any;
}

interface Step {
  id: string;
  name: string;
  components: Component[];
}

interface HeaderConfig {
  logoUrl: string;
  showLogo: boolean;
  showProgress: boolean;
  showBackButton: boolean;
}

interface EditorState {
  steps: Step[];
  currentStepId: string;
  selectedComponentId: string | null;
  headerConfig: HeaderConfig;
  selectedOptions: Set<string>;
  history: any[];
  historyIndex: number;
}

const AdvancedQuizEditor: React.FC = () => {
  console.log("🚀 AdvancedQuizEditor está renderizando!");

  // Estados principais
  const [editorState, setEditorState] = useState<EditorState>({
    steps: [
      {
        id: "intro",
        name: "🏠 Introdução",
        components: [
          {
            id: "intro-title",
            type: "heading",
            props: {
              text: "DESCUBRA SEU ESTILO PESSOAL",
              fontSize: "2.5rem",
              fontWeight: "700",
              textAlign: "center",
              color: "#432818"
            }
          },
          {
            id: "intro-subtitle",
            type: "text",
            props: {
              text: "Responda algumas perguntas e descubra qual estilo combina mais com você!",
              fontSize: "1.25rem",
              textAlign: "center",
              color: "#8B5A3C"
            }
          },
          {
            id: "name-input",
            type: "input",
            props: {
              label: "SEU NOME *",
              placeholder: "Digite seu primeiro nome aqui...",
              required: true
            }
          },
          {
            id: "start-button",
            type: "button",
            props: {
              buttonText: "COMEÇAR TESTE",
              buttonStyle: "primary",
              actionType: "goToNextStep"
            }
          }
        ]
      },
      {
        id: "q1",
        name: "Q1 👗 Roupa Favorita",
        components: [
          {
            id: "q1-title",
            type: "heading",
            props: {
              text: "QUAL O SEU TIPO DE ROUPA FAVORITA?",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q1-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q1-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 2,
              choices: [
                {
                  id: "q1-natural",
                  text: "Conforto, leveza e praticidade no vestir",
                  value: "natural",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp",
                  styleCategory: "Natural"
                },
                {
                  id: "q1-classico",
                  text: "Discrição, caimento clássico e sobriedade",
                  value: "classico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp",
                  styleCategory: "Clássico"
                },
                {
                  id: "q1-contemporaneo",
                  text: "Praticidade com um toque de estilo atual",
                  value: "contemporaneo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q1-elegante",
                  text: "Elegância refinada, moderna e sem exageros",
                  value: "elegante",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp",
                  styleCategory: "Elegante"
                },
                {
                  id: "q1-romantico",
                  text: "Delicadeza em tecidos suaves e fluidos",
                  value: "romantico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp",
                  styleCategory: "Romântico"
                },
                {
                  id: "q1-sexy",
                  text: "Sensualidade com destaque para o corpo",
                  value: "sexy",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp",
                  styleCategory: "Sexy"
                },
                {
                  id: "q1-dramatico",
                  text: "Impacto visual com peças estruturadas e assimétricas",
                  value: "dramatico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp",
                  styleCategory: "Dramático"
                },
                {
                  id: "q1-criativo",
                  text: "Mix criativo com formas ousadas e originais",
                  value: "criativo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q1-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q2",
        name: "Q2 🧠 Personalidade",
        components: [
          {
            id: "q2-title",
            type: "heading",
            props: {
              text: "RESUMA A SUA PERSONALIDADE:",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q2-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q2-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 1,
              choices: [
                {
                  id: "q2-natural",
                  text: "Informal, espontânea, alegre, essencialista",
                  value: "natural",
                  styleCategory: "Natural"
                },
                {
                  id: "q2-classico",
                  text: "Conservadora, séria, organizada",
                  value: "classico",
                  styleCategory: "Clássico"
                },
                {
                  id: "q2-contemporaneo",
                  text: "Informada, ativa, prática",
                  value: "contemporaneo",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q2-elegante",
                  text: "Exigente, sofisticada, seletiva",
                  value: "elegante",
                  styleCategory: "Elegante"
                },
                {
                  id: "q2-romantico",
                  text: "Feminina, meiga, delicada, sensível",
                  value: "romantico",
                  styleCategory: "Romântico"
                },
                {
                  id: "q2-sexy",
                  text: "Glamorosa, vaidosa, sensual",
                  value: "sexy",
                  styleCategory: "Sexy"
                },
                {
                  id: "q2-dramatico",
                  text: "Cosmopolita, moderna e audaciosa",
                  value: "dramatico",
                  styleCategory: "Dramático"
                },
                {
                  id: "q2-criativo",
                  text: "Exótica, aventureira, livre",
                  value: "criativo",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q2-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q3",
        name: "Q3 👀 Visual",
        components: [
          {
            id: "q3-title",
            type: "heading",
            props: {
              text: "QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q3-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q3-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 2,
              choices: [
                {
                  id: "q3-natural",
                  text: "Visual leve, despojado e natural",
                  value: "natural",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp",
                  styleCategory: "Natural"
                },
                {
                  id: "q3-classico",
                  text: "Visual clássico e tradicional",
                  value: "classico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp",
                  styleCategory: "Clássico"
                },
                {
                  id: "q3-contemporaneo",
                  text: "Visual casual com toque atual",
                  value: "contemporaneo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q3-elegante",
                  text: "Visual refinado e imponente",
                  value: "elegante",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp",
                  styleCategory: "Elegante"
                },
                {
                  id: "q3-romantico",
                  text: "Visual romântico, feminino e delicado",
                  value: "romantico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp",
                  styleCategory: "Romântico"
                },
                {
                  id: "q3-sexy",
                  text: "Visual sensual, com saia justa e decote",
                  value: "sexy",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp",
                  styleCategory: "Sexy"
                },
                {
                  id: "q3-dramatico",
                  text: "Visual marcante e urbano (jeans + jaqueta)",
                  value: "dramatico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp",
                  styleCategory: "Dramático"
                },
                {
                  id: "q3-criativo",
                  text: "Visual criativo, colorido e ousado",
                  value: "criativo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q3-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q4",
        name: "Q4 ✨ Detalhes",
        components: [
          {
            id: "q4-title",
            type: "heading",
            props: {
              text: "QUAIS DETALHES VOCÊ GOSTA?",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q4-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q4-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 1,
              choices: [
                {
                  id: "q4-natural",
                  text: "Poucos detalhes, básico e prático",
                  value: "natural",
                  styleCategory: "Natural"
                },
                {
                  id: "q4-classico",
                  text: "Bem discretos e sutis, clean e clássico",
                  value: "classico",
                  styleCategory: "Clássico"
                },
                {
                  id: "q4-contemporaneo",
                  text: "Básico, mas com um toque de estilo",
                  value: "contemporaneo",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q4-elegante",
                  text: "Detalhes refinados, chic e que deem status",
                  value: "elegante",
                  styleCategory: "Elegante"
                },
                {
                  id: "q4-romantico",
                  text: "Detalhes delicados, laços, babados",
                  value: "romantico",
                  styleCategory: "Romântico"
                },
                {
                  id: "q4-sexy",
                  text: "Roupas que valorizem meu corpo: couro, zíper, fendas",
                  value: "sexy",
                  styleCategory: "Sexy"
                },
                {
                  id: "q4-dramatico",
                  text: "Detalhes marcantes, firmeza e peso",
                  value: "dramatico",
                  styleCategory: "Dramático"
                },
                {
                  id: "q4-criativo",
                  text: "Detalhes diferentes do convencional, produções ousadas",
                  value: "criativo",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q4-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q5",
        name: "Q5 🎨 Estampas",
        components: [
          {
            id: "q5-title",
            type: "heading",
            props: {
              text: "QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q5-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q5-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 2,
              choices: [
                {
                  id: "q5-natural",
                  text: "Estampas clean, com poucas informações",
                  value: "natural",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp",
                  styleCategory: "Natural"
                },
                {
                  id: "q5-classico",
                  text: "Estampas clássicas e atemporais",
                  value: "classico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp",
                  styleCategory: "Clássico"
                },
                {
                  id: "q5-contemporaneo",
                  text: "Atemporais, mas que tenham uma pegada de atual e moderna",
                  value: "contemporaneo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q5-elegante",
                  text: "Estampas clássicas e atemporais, mas sofisticadas",
                  value: "elegante",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp",
                  styleCategory: "Elegante"
                },
                {
                  id: "q5-romantico",
                  text: "Estampas florais e/ou delicadas como bolinhas, borboletas e corações",
                  value: "romantico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp",
                  styleCategory: "Romântico"
                },
                {
                  id: "q5-sexy",
                  text: "Estampas de animal print, como onça, zebra e cobra",
                  value: "sexy",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp",
                  styleCategory: "Sexy"
                },
                {
                  id: "q5-dramatico",
                  text: "Estampas geométricas, abstratas e exageradas como grandes poás",
                  value: "dramatico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp",
                  styleCategory: "Dramático"
                },
                {
                  id: "q5-criativo",
                  text: "Estampas diferentes do usual, como africanas, xadrez grandes",
                  value: "criativo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q5-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q6",
        name: "Q6 🧥 Casaco",
        components: [
          {
            id: "q6-title",
            type: "heading",
            props: {
              text: "QUAL CASACO É SEU FAVORITO?",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q6-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q6-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 2,
              choices: [
                {
                  id: "q6-natural",
                  text: "Cardigã bege confortável e casual",
                  value: "natural",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/29_sdogoy.webp",
                  styleCategory: "Natural"
                },
                {
                  id: "q6-classico",
                  text: "Blazer verde estruturado",
                  value: "classico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/30_nfth8k.webp",
                  styleCategory: "Clássico"
                },
                {
                  id: "q6-contemporaneo",
                  text: "Trench coat bege tradicional",
                  value: "contemporaneo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/31_tcmhcl.webp",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q6-elegante",
                  text: "Blazer branco refinado",
                  value: "elegante",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/32_h78pd8.webp",
                  styleCategory: "Elegante"
                },
                {
                  id: "q6-romantico",
                  text: "Casaco pink vibrante e moderno",
                  value: "romantico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/33_u8pldd.webp",
                  styleCategory: "Romântico"
                },
                {
                  id: "q6-sexy",
                  text: "Jaqueta vinho de couro estilosa",
                  value: "sexy",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/34_peadir.webp",
                  styleCategory: "Sexy"
                },
                {
                  id: "q6-dramatico",
                  text: "Jaqueta preta estilo rocker",
                  value: "dramatico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735379/35_pulzso.webp",
                  styleCategory: "Dramático"
                },
                {
                  id: "q6-criativo",
                  text: "Casaco estampado criativo e colorido",
                  value: "criativo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735377/36_cympaq.webp",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q6-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q7",
        name: "Q7 👖 Calça",
        components: [
          {
            id: "q7-title",
            type: "heading",
            props: {
              text: "QUAL SUA CALÇA FAVORITA?",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q7-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q7-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 2,
              choices: [
                {
                  id: "q7-natural",
                  text: "Calça fluida acetinada bege",
                  value: "natural",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/38_iilv0l.webp",
                  styleCategory: "Natural"
                },
                {
                  id: "q7-classico",
                  text: "Calça de alfaiataria cinza",
                  value: "classico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735417/39_arsswu.webp",
                  styleCategory: "Clássico"
                },
                {
                  id: "q7-contemporaneo",
                  text: "Jeans reto e básico",
                  value: "contemporaneo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/40_beq52x.webp",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q7-elegante",
                  text: "Calça reta bege de tecido",
                  value: "elegante",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735419/41_hconq4.webp",
                  styleCategory: "Elegante"
                },
                {
                  id: "q7-romantico",
                  text: "Calça ampla rosa alfaiatada",
                  value: "romantico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735420/42_q8xws1.webp",
                  styleCategory: "Romântico"
                },
                {
                  id: "q7-sexy",
                  text: "Legging preta de couro",
                  value: "sexy",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/43_ljy7sh.webp",
                  styleCategory: "Sexy"
                },
                {
                  id: "q7-dramatico",
                  text: "Calça reta preta de couro",
                  value: "dramatico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/44_nqgvoq.webp",
                  styleCategory: "Dramático"
                },
                {
                  id: "q7-criativo",
                  text: "Calça estampada floral leve e ampla",
                  value: "criativo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735425/45_lp64m8.webp",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q7-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q8",
        name: "Q8 👠 Sapatos",
        components: [
          {
            id: "q8-title",
            type: "heading",
            props: {
              text: "QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q8-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q8-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 2,
              choices: [
                {
                  id: "q8-natural",
                  text: "Rasteirinha bege baixa e confortável",
                  value: "natural",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/47_lhlqyb.webp",
                  styleCategory: "Natural"
                },
                {
                  id: "q8-classico",
                  text: "Sapato social marrom clássico",
                  value: "classico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/48_h9jdlg.webp",
                  styleCategory: "Clássico"
                },
                {
                  id: "q8-contemporaneo",
                  text: "Tênis branco moderno e versátil",
                  value: "contemporaneo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735426/49_ufdxbh.webp",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q8-elegante",
                  text: "Scarpin nude elegante",
                  value: "elegante",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/50_d3vdbg.webp",
                  styleCategory: "Elegante"
                },
                {
                  id: "q8-romantico",
                  text: "Sapatilha rosa delicada",
                  value: "romantico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/51_mwdmfg.webp",
                  styleCategory: "Romântico"
                },
                {
                  id: "q8-sexy",
                  text: "Salto alto preto stiletto",
                  value: "sexy",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/52_ygprzd.webp",
                  styleCategory: "Sexy"
                },
                {
                  id: "q8-dramatico",
                  text: "Coturno preto rocker",
                  value: "dramatico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735427/53_lqhcv1.webp",
                  styleCategory: "Dramático"
                },
                {
                  id: "q8-criativo",
                  text: "Bota colorida estampada",
                  value: "criativo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/54_vl2dwy.webp",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q8-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q9",
        name: "Q9 💍 Acessórios",
        components: [
          {
            id: "q9-title",
            type: "heading",
            props: {
              text: "QUAIS ACESSÓRIOS VOCÊ MAIS USA?",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q9-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q9-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 2,
              choices: [
                {
                  id: "q9-natural",
                  text: "Básicos discretos, funcional",
                  value: "natural",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/56_awzskh.webp",
                  styleCategory: "Natural"
                },
                {
                  id: "q9-classico",
                  text: "Pérolas, relógio, clássicos atemporais",
                  value: "classico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/57_r0hzd8.webp",
                  styleCategory: "Clássico"
                },
                {
                  id: "q9-contemporaneo",
                  text: "Relógio moderno, básicos atuais",
                  value: "contemporaneo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735428/58_kwbtwb.webp",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q9-elegante",
                  text: "Joias finas, sofisticados e de qualidade",
                  value: "elegante",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/59_ffbznt.webp",
                  styleCategory: "Elegante"
                },
                {
                  id: "q9-romantico",
                  text: "Delicados, florais, femininos",
                  value: "romantico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/60_qkh7g2.webp",
                  styleCategory: "Romântico"
                },
                {
                  id: "q9-sexy",
                  text: "Chamativos, que destaquem",
                  value: "sexy",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/61_b8zwpf.webp",
                  styleCategory: "Sexy"
                },
                {
                  id: "q9-dramatico",
                  text: "Marcantes, geométricos, statement",
                  value: "dramatico",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735429/62_pcj4kz.webp",
                  styleCategory: "Dramático"
                },
                {
                  id: "q9-criativo",
                  text: "Diferentes, artesanais, únicos",
                  value: "criativo",
                  image: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/63_dafzgn.webp",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q9-continue",
            type: "button",
            props: {
              buttonText: "Continuar",
              disabled: true
            }
          }
        ]
      },
      {
        id: "q10",
        name: "Q10 🧵 Tecidos",
        components: [
          {
            id: "q10-title",
            type: "heading",
            props: {
              text: "VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...",
              fontSize: "1.875rem",
              fontWeight: "700",
              textAlign: "center"
            }
          },
          {
            id: "q10-spacer",
            type: "spacer",
            props: { height: 20 }
          },
          {
            id: "q10-options",
            type: "options",
            props: {
              selectionType: "multiple",
              maxSelections: 3,
              minSelections: 3,
              gridCols: 1,
              choices: [
                {
                  id: "q10-natural",
                  text: "São fáceis de cuidar.",
                  value: "natural",
                  styleCategory: "Natural"
                },
                {
                  id: "q10-classico",
                  text: "São de excelente qualidade.",
                  value: "classico",
                  styleCategory: "Clássico"
                },
                {
                  id: "q10-contemporaneo",
                  text: "São fáceis de cuidar e modernos.",
                  value: "contemporaneo",
                  styleCategory: "Contemporâneo"
                },
                {
                  id: "q10-elegante",
                  text: "São sofisticados.",
                  value: "elegante",
                  styleCategory: "Elegante"
                },
                {
                  id: "q10-romantico",
                  text: "São delicados.",
                  value: "romantico",
                  styleCategory: "Romântico"
                },
                {
                  id: "q10-sexy",
                  text: "São perfeitos ao meu corpo.",
                  value: "sexy",
                  styleCategory: "Sexy"
                },
                {
                  id: "q10-dramatico",
                  text: "São diferentes, e trazem um efeito para minha roupa.",
                  value: "dramatico",
                  styleCategory: "Dramático"
                },
                {
                  id: "q10-criativo",
                  text: "São exclusivos, criam identidade no look.",
                  value: "criativo",
                  styleCategory: "Criativo"
                }
              ]
            }
          },
          {
            id: "q10-continue",
            type: "button",
            props: {
              buttonText: "Ver Resultado",
              disabled: true
            }
          }
        ]
      }
    ],
    currentStepId: "intro",
    selectedComponentId: null,
    headerConfig: {
      logoUrl: "https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp",
      showLogo: true,
      showProgress: true,
      showBackButton: false
    },
    selectedOptions: new Set(),
    history: [],
    historyIndex: -1
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [deviceView, setDeviceView] = useState<'mobile'>('mobile');

  // Get current step and component
  const currentStep = editorState.steps.find(step => step.id === editorState.currentStepId);
  const selectedComponent = currentStep?.components.find(comp => comp.id === editorState.selectedComponentId);

  // Handlers
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("✅ Quiz salvo com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao salvar:", error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("🚀 Quiz publicado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao publicar:", error);
    } finally {
      setIsPublishing(false);
    }
  }, []);

  const handleUndo = useCallback(() => {
    console.log('Undo action');
  }, []);

  const handleRedo = useCallback(() => {
    console.log('Redo action');
  }, []);

  const handleStepSelect = useCallback((stepId: string) => {
    setEditorState(prev => ({
      ...prev,
      currentStepId: stepId,
      selectedComponentId: null
    }));
  }, []);

  const handleComponentSelect = useCallback((componentId: string) => {
    setEditorState(prev => ({
      ...prev,
      selectedComponentId: componentId
    }));
  }, []);

  const handleComponentUpdate = useCallback((componentId: string, newProps: any) => {
    setEditorState(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === prev.currentStepId
          ? {
              ...step,
              components: step.components.map(comp =>
                comp.id === componentId
                  ? { ...comp, props: { ...comp.props, ...newProps } }
                  : comp
              )
            }
          : step
      )
    }));
  }, []);

  const handleAddComponent = useCallback((type: string) => {
    const newComponent: Component = {
      id: `${type}-${Date.now()}`,
      type: type as any,
      props: getDefaultProps(type)
    };

    setEditorState(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === prev.currentStepId
          ? { ...step, components: [...step.components, newComponent] }
          : step
      )
    }));
  }, []);

  const getDefaultProps = (type: string) => {
    switch (type) {
      case 'heading':
        return { text: 'Novo Título', fontSize: '1.5rem', fontWeight: '600', textAlign: 'center', color: '#432818' };
      case 'text':
        return { text: 'Novo texto', fontSize: '1rem', textAlign: 'left', color: '#8B5A3C' };
      case 'image':
        return { src: '', alt: 'Imagem', width: '100%', height: 'auto' };
      case 'input':
        return { label: 'Campo', placeholder: 'Digite aqui...', required: false };
      case 'button':
        return { buttonText: 'Clique aqui', buttonStyle: 'primary', actionType: 'goToNextStep', backgroundColor: '#8B4513', color: 'white' };
      case 'options':
        return { 
          questionText: 'Escolha uma opção',
          selectionType: 'single',
          minSelections: 1,
          maxSelections: 1,
          gridCols: 2,
          choices: [
            { id: 'opt1', text: 'Opção 1', value: 'option1' },
            { id: 'opt2', text: 'Opção 2', value: 'option2' }
          ]
        };
      case 'spacer':
        return { height: 20 };
      default:
        return {};
    }
  };

  // Component renderers
  const renderComponent = (component: Component) => {
    const isSelected = component.id === editorState.selectedComponentId;
    const baseClasses = `relative transition-all duration-200 cursor-pointer ${
      isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-1 hover:ring-gray-300'
    }`;

    switch (component.type) {
      case 'heading':
        return (
          <div
            key={component.id}
            className={`${baseClasses} p-2 rounded-md`}
            onClick={() => handleComponentSelect(component.id)}
          >
            <h1
              style={{
                fontSize: component.props.fontSize || '2rem',
                fontWeight: component.props.fontWeight || '700',
                textAlign: component.props.textAlign || 'center',
                color: component.props.color || '#000',
              }}
            >
              {component.props.text || 'Título'}
            </h1>
          </div>
        );

      case 'text':
        return (
          <div
            key={component.id}
            className={`${baseClasses} p-2 rounded-md`}
            onClick={() => handleComponentSelect(component.id)}
          >
            <p
              style={{
                fontSize: component.props.fontSize || '1rem',
                textAlign: component.props.textAlign || 'left',
                color: component.props.color || '#000',
              }}
            >
              {component.props.text || 'Texto'}
            </p>
          </div>
        );

      case 'input':
        return (
          <div
            key={component.id}
            className={`${baseClasses} p-2 rounded-md`}
            onClick={() => handleComponentSelect(component.id)}
          >
            <div className="space-y-2">
              {component.props.label && (
                <Label className="text-sm font-medium">
                  {component.props.label}
                </Label>
              )}
              <Input
                placeholder={component.props.placeholder || 'Digite aqui...'}
                className="w-full"
                disabled
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div
            key={component.id}
            className={`${baseClasses} p-2 rounded-md`}
            onClick={() => handleComponentSelect(component.id)}
          >
            <Button
              className={`w-full ${
                component.props.buttonStyle === 'primary' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              disabled={component.props.disabled}
            >
              {component.props.buttonText || 'Botão'}
            </Button>
          </div>
        );

      case 'options':
        return (
          <div
            key={component.id}
            className={`${baseClasses} p-2 rounded-md`}
            onClick={() => handleComponentSelect(component.id)}
          >
            <div className={`grid gap-4 ${
              component.props.gridCols === 2 ? 'grid-cols-1' : 'grid-cols-1'
            }`}>
              {component.props.choices?.slice(0, 3).map((choice: any) => (
                <div
                  key={choice.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50"
                >
                  {choice.image && (
                    <div className="mb-2">
                      <img
                        src={choice.image}
                        alt={choice.text}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  )}
                  <p className="text-sm">{choice.text}</p>
                </div>
              ))}
              {component.props.choices?.length > 3 && (
                <div className="text-center text-gray-500 text-sm">
                  +{component.props.choices.length - 3} mais opções
                </div>
              )}
            </div>
          </div>
        );

      case 'spacer':
        return (
          <div
            key={component.id}
            className={`${baseClasses}`}
            onClick={() => handleComponentSelect(component.id)}
            style={{ height: component.props.height || 20 }}
          >
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">Espaçador</span>
            </div>
          </div>
        );

      default:
        return (
          <div
            key={component.id}
            className={`${baseClasses} p-4 border-2 border-dashed border-gray-300 rounded`}
            onClick={() => handleComponentSelect(component.id)}
          >
            <span className="text-gray-400">Componente desconhecido</span>
          </div>
        );
    }
  };

  const renderPropertiesPanel = () => {
    if (!selectedComponent) {
      return (
        <div className="p-6 text-center text-gray-500">
          <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Selecione um componente para editar suas propriedades</p>
        </div>
      );
    }

    return (
      <div className="p-6 space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h3 className="font-semibold text-gray-900">Propriedades</h3>
          <p className="text-sm text-gray-500 capitalize">{selectedComponent.type}</p>
        </div>

        {selectedComponent.type === 'heading' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="heading-text">Texto</Label>
              <Input
                id="heading-text"
                value={selectedComponent.props.text || ''}
                onChange={(e) => handleComponentUpdate(selectedComponent.id, { text: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="heading-size">Tamanho da Fonte</Label>
              <Select
                value={selectedComponent.props.fontSize || '2rem'}
                onValueChange={(value) => handleComponentUpdate(selectedComponent.id, { fontSize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.5rem">Pequeno</SelectItem>
                  <SelectItem value="2rem">Médio</SelectItem>
                  <SelectItem value="2.5rem">Grande</SelectItem>
                  <SelectItem value="3rem">Extra Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="heading-color">Cor</Label>
              <Input
                id="heading-color"
                type="color"
                value={selectedComponent.props.color || '#000000'}
                onChange={(e) => handleComponentUpdate(selectedComponent.id, { color: e.target.value })}
              />
            </div>
          </div>
        )}

        {selectedComponent.type === 'text' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text-content">Texto</Label>
              <Textarea
                id="text-content"
                value={selectedComponent.props.text || ''}
                onChange={(e) => handleComponentUpdate(selectedComponent.id, { text: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="text-size">Tamanho da Fonte</Label>
              <Select
                value={selectedComponent.props.fontSize || '1rem'}
                onValueChange={(value) => handleComponentUpdate(selectedComponent.id, { fontSize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.875rem">Pequeno</SelectItem>
                  <SelectItem value="1rem">Normal</SelectItem>
                  <SelectItem value="1.25rem">Grande</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {selectedComponent.type === 'input' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="input-label">Rótulo</Label>
              <Input
                id="input-label"
                value={selectedComponent.props.label || ''}
                onChange={(e) => handleComponentUpdate(selectedComponent.id, { label: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="input-placeholder">Placeholder</Label>
              <Input
                id="input-placeholder"
                value={selectedComponent.props.placeholder || ''}
                onChange={(e) => handleComponentUpdate(selectedComponent.id, { placeholder: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="input-required"
                checked={selectedComponent.props.required || false}
                onCheckedChange={(checked) => handleComponentUpdate(selectedComponent.id, { required: checked })}
              />
              <Label htmlFor="input-required">Campo obrigatório</Label>
            </div>
          </div>
        )}

        {selectedComponent.type === 'button' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-text">Texto do Botão</Label>
              <Input
                id="button-text"
                value={selectedComponent.props.buttonText || ''}
                onChange={(e) => handleComponentUpdate(selectedComponent.id, { buttonText: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="button-style">Estilo</Label>
              <Select
                value={selectedComponent.props.buttonStyle || 'primary'}
                onValueChange={(value) => handleComponentUpdate(selectedComponent.id, { buttonStyle: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primário</SelectItem>
                  <SelectItem value="secondary">Secundário</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="button-disabled"
                checked={selectedComponent.props.disabled || false}
                onCheckedChange={(checked) => handleComponentUpdate(selectedComponent.id, { disabled: checked })}
              />
              <Label htmlFor="button-disabled">Desabilitado</Label>
            </div>
          </div>
        )}

        {selectedComponent.type === 'spacer' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="spacer-height">Altura (px)</Label>
              <Input
                id="spacer-height"
                type="number"
                value={selectedComponent.props.height || 20}
                onChange={(e) => handleComponentUpdate(selectedComponent.id, { height: parseInt(e.target.value) || 20 })}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Navbar com backdrop blur */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold text-gray-900">Editor Avançado</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Desfazer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              title="Refazer"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </>
            )}
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
          >
            {isPublishing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publicando...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Publicar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Layout de 4 colunas */}
      <div className="flex-1 flex overflow-hidden">
        {/* 1. Coluna Etapas (250px) */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Etapas</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {editorState.steps.map((step) => (
              <div
                key={step.id}
                className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${
                  step.id === editorState.currentStepId
                    ? 'bg-blue-50 border-l-4 border-l-blue-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleStepSelect(step.id)}
              >
                <div className="font-medium text-sm">{step.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {step.components.length} componentes
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Coluna Componentes (280px) */}
        <div className="w-70 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Componentes</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[
              { type: 'heading', icon: Type, label: 'Título' },
              { type: 'text', icon: Type, label: 'Texto' },
              { type: 'input', icon: Edit3, label: 'Campo de Entrada' },
              { type: 'button', icon: MousePointer, label: 'Botão' },
              { type: 'options', icon: ToggleLeft, label: 'Opções Múltiplas' },
              { type: 'image', icon: ImageIcon, label: 'Imagem' },
              { type: 'spacer', icon: GripVertical, label: 'Espaçador' }
            ].map((component) => (
              <div
                key={component.type}
                className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleAddComponent(component.type)}
              >
                <component.icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">{component.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Canvas Mobile (flex-1) */}
        <div className="flex-1 bg-gray-100 flex flex-col items-center overflow-y-auto">
          <div className="w-full max-w-sm mx-auto my-8">
            {/* Preview mobile com gradiente no header */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border">
              {/* Header com gradiente */}
              <div 
                className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between px-4"
                style={{
                  background: 'linear-gradient(135deg, #8B4513 0%, #432818 100%)'
                }}
              >
                {editorState.headerConfig.showLogo && (
                  <img
                    src={editorState.headerConfig.logoUrl}
                    alt="Logo"
                    className="h-8 w-auto"
                  />
                )}
                {editorState.headerConfig.showBackButton && (
                  <ArrowLeft className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Progress bar */}
              {editorState.headerConfig.showProgress && (
                <div className="h-1 bg-gray-200">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: '25%' }}
                  />
                </div>
              )}

              {/* Conteúdo do quiz */}
              <div className="p-6 space-y-4 min-h-96">
                {currentStep?.components.map(renderComponent)}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Painel Propriedades (380px) */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Propriedades</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {renderPropertiesPanel()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedQuizEditor;