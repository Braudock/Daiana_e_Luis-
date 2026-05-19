import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Servir arquivos estáticos do frontend (React / Vite) compilado
app.use(express.static(path.resolve('./dist')));

// Inicializa a API do Gemini
// Requer variável de ambiente GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Lê o relatório de contexto
const contextoHistori = fs.readFileSync(path.resolve('./contexto_luis_paula.md'), 'utf-8');

const SYSTEM_PROMPT = `
Você é o "Curador Inteligente" do Arquivo Afetivo de Daiana e Luis ("Memória Viva").
Seu papel é ajudar a reviver memórias, contar a história de amor deles de forma poética, carinhosa e elegante, baseando-se RIGOROSAMENTE nos fatos documentados abaixo.
Se o usuário perguntar algo que esteja no contexto, responda poeticamente.
Se perguntar algo que NÃO está no contexto, diga que esse detalhe ainda não foi gravado nos arquivos do coração.

=== ARQUIVO AFETIVO (BASE DE DADOS) ===
${contextoHistori}
========================================

Aja sempre de forma acolhedora, como um guardião das memórias.
Use tom romântico, formatado em Markdown.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const formattedHistory = history ? history.map((msg: any) => {
      // O SDK GoogleGenAI espera objetos de Content, mas podemos simplificar passando os textos na sessão ou reconstruindo o histórico
      // Vamos simplificar passando o histórico como parte do prompt no fallback ou usando o modelo
      return `${msg.role === 'user' ? 'Usuário' : 'Curador'}: ${msg.content}`;
    }).join('\n') : '';

    const fullPrompt = `${SYSTEM_PROMPT}\n\nHistórico da conversa:\n${formattedHistory}\n\nUsuário: ${message}\nCurador:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    res.json({ reply: response.text });
  } catch (error) {
    console.error("Erro no Gemini API:", error);
    res.status(500).json({ reply: "Sinto muito, houve uma falha ao acessar as memórias no momento." });
  }
});

// Qualquer outra rota serve o index.html do frontend (para Single Page Application routing)
app.get('*all', (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'));
});

// Apenas inicia o servidor se NÃO estiver rodando no ambiente Serverless da Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
