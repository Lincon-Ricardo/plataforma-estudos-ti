# Level Up IT — treinador pessoal de carreira em TI

Local-first, zero custo. Next.js 14 + React + TypeScript + Tailwind. Sem backend obrigatório.
Supabase/Vercel/IA são **opcionais** — custos em `.env.example`.

## Executar no Windows (PowerShell)

```powershell
cd levelup-it
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Testar e validar

```powershell
cd levelup-it
npm test        # vitest: recomendação, seed, metas, revisão espaçada
npx tsc --noEmit
npm run build
```

## Backup

Perfil → “Copiar backup JSON” → salve como `backup-levelup.json`.
Importar: cole o JSON no mesmo campo. Dados no `localStorage` (chave `levelup-it-v1`).

## Conteúdo (todas as 8 etapas base prontas)

- Dashboard real (recomendação por progresso, tempo planejado × realizado, progresso por módulo, revisões, dificuldades, últimos exercícios, projetos, metas 30/60/90)
- Perfil editável + backup/restore
- Diagnóstico 11 áreas × 2 questões, com lacunas e sequência
- Trilha 9 módulos, **19 aulas reais** (quiz ≥80% para concluir), nenhuma pendente
- Revisão espaçada 1/3/7/14/30d + plano semanal que reorganiza
- **8 incidentes** simulados (hipótese → evidência → diagnóstico → solução)
- **7 labs** com comandos, esperado e verificação (o app nunca executa nada sozinho)
- 8 projetos com requisitos/testes/qualidade
- Relatório de evolução, diário privado com alerta anti-segredos
- Tutor IA opcional (`POST /api/tutor`): sem `OPENAI_API_KEY` retorna 501 com mensagem e indica o modo offline — a chave fica só no servidor

## Ativar a IA (opcional, com custo)

```powershell
Copy-Item .env.example .env.local
# edite .env.local: OPENAI_API_KEY=... (+ OPENAI_MODEL opcional)
npm run dev
```

Pay-as-you-go (ex.: gpt-4o-mini ~US$ 0.15–0.60/1M tokens — confira no provedor).
Sem chave, tudo funciona offline.

## Deploy (quando quiser internet)

Vercel: importe o repo, root `levelup-it`, `npm run build`. Hobby grátis.
Supabase (sync multi-dispositivo): só então — free tier basta; Pro US$ 25/mês.
A camada `src/lib/store.tsx` isola a troca. Headers de segurança em `next.config.mjs`.
AWS (trilhas M7): só simulação/planejamento aqui; nunca crie recurso real sem confirmação.
