
import { GoogleGenAI } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the initial 'data:application/pdf;base64,' part
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

const PROMPT = `
Você é um especialista em segurança do trabalho e direito trabalhista. Analise o documento PDF em anexo, que é um laudo pericial de insalubridade. Sua análise deve ser completa, técnica e focada em encontrar oportunidades para a defesa da empresa reclamada.

Siga estritamente a estrutura de resposta abaixo, gerando o conteúdo para cada seção em formato Markdown:

### 1. RESUMO DO PROCESSO E PARTICIPANTES
- **Processo Nº:** (Se houver)
- **Reclamante:** Nome completo do reclamante.
- **Reclamada:** Nome da empresa.
- **Participantes da Diligência Pericial:** Liste todos os presentes na perícia (perito, assistentes técnicos, representantes da empresa, reclamante, etc.).

### 2. FUNÇÕES E ATIVIDADES DO RECLAMANTE
- **Período do Contrato:** Data de início e fim do trabalho.
- **Funções Desempenhadas:** Liste todas as funções/cargos exercidos pelo reclamante, com os respectivos períodos.
- **Locais de Trabalho:** Descreva os setores ou locais onde o reclamante trabalhou.
- **Atividades Realizadas:** Descreva detalhadamente as tarefas e atividades executadas pelo reclamante, conforme descrito no laudo.

### 3. ANÁLISE DOS AGENTES INSALUBRES CONSTATADOS
Foque EXCLUSIVAMENTE nos agentes que o perito concluiu como insalubres. Não mencione os agentes descartados.
Para cada agente insalubre, informe:
- **Agente:** (Ex: Ruído, Óleos Minerais, Calor, etc.)
- **Norma Regulamentadora (NR):** A NR e anexo correspondente (Ex: NR-15, Anexo 1).
- **Quantificação/Avaliação:** O valor medido ou a avaliação qualitativa feita pelo perito.
- **Limite de Tolerância/Análise:** O limite legal e a conclusão do perito para a caracterização da insalubridade.
- **Período de Exposição:** O período do contrato em que o perito considerou haver a exposição insalubre.

### 4. PONTOS CRÍTICOS E INCONSISTÊNCIAS NO LAUDO (ESTRATÉGIA DE DEFESA)
Com base nas NRs (NR-6, NR-9, NR-15, etc.), jurisprudência e boas práticas de higiene ocupacional, identifique falhas, omissões ou inconsistências no laudo. Exemplos de pontos a observar:
- **EPIs (Equipamentos de Proteção Individual):** O perito desconsiderou o uso de EPIs eficazes? Havia CA (Certificado de Aprovação) válido? A neutralização do agente foi analisada corretamente?
- **Metodologia de Avaliação:** A medição dos agentes (ex: ruído) seguiu a metodologia correta (NHO-01 da Fundacentro)? O tempo de medição foi representativo da jornada de trabalho?
- **Avaliação Qualitativa:** A análise qualitativa (ex: agentes químicos sem limite de tolerância) foi bem fundamentada? O contato com o agente era realmente habitual e permanente?
- **Fontes de Informação:** O perito baseou-se apenas no relato do reclamante, ignorando documentos como PPRA, PCMSO, fichas de EPI?
- **Tempo de Exposição:** A conclusão sobre o tempo de exposição (permanente vs. eventual/intermitente) é questionável?

### 5. ELABORAÇÃO DA CONTESTAÇÃO TÉCNICA
Com base nos pontos críticos identificados, redija um texto técnico e fundamentado para a contestação do laudo pericial. Argumente de forma clara e objetiva, citando as normas técnicas e legais que amparam cada ponto da contestação. A contestação deve ser persuasiva e direcionada ao juízo.

### 6. QUESITOS SUPLEMENTARES AO PERITO
Formule de 3 a 5 quesitos (perguntas) técnicos e estratégicos para serem apresentados ao perito, com o objetivo de esclarecer as inconsistências ou levar o perito a reconsiderar sua conclusão. Os quesitos devem ser diretos e explorar as fraquezas do laudo.

Responda sem usar marcadores de citação e não adicione fontes ou links. A resposta deve ser um texto contínuo e bem estruturado.
`;


export const analyzePdfReport = async (file: File): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key for Gemini is not configured.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const base64Pdf = await fileToBase64(file);

  const pdfPart = {
    inlineData: {
      mimeType: 'application/pdf',
      data: base64Pdf,
    },
  };

  const textPart = {
    text: PROMPT,
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: { parts: [pdfPart, textPart] },
  });

  return response.text;
};
