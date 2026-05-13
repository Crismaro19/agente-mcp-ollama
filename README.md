# 🧠 agente-mcp-ollama

Agente IA local construido con:

- 🦙 Ollama
- 🔌 MCP (Model Context Protocol)
- 🧠 RAG con ChromaDB
- ⚡ TypeScript
- 🧪 Vitest
- 🏗️ Nx Monorepo

El proyecto implementa un agente capaz de:

- usar herramientas vía MCP
- conectarse a múltiples servidores MCP
- usar modelos locales con Ollama
- consultar documentación mediante RAG
- ejecutar loops agente → tool → resultado
- funcionar completamente local

---

# ✨ Arquitectura

```txt
Usuario
   │
   ▼
┌─────────────┐
│   Agent     │
│ orchestration
└──────┬──────┘
       │
       ├──────────────► MCP Client
       │                    │
       │                    ▼
       │              MCP Server
       │                    │
       │               Tools / APIs
       │
       ├──────────────► Ollama
       │                    │
       │               Qwen / Llama
       │
       └──────────────► RAG
                            │
                     ChromaDB + Embeddings
```

---

# 📦 Tecnologías

- TypeScript
- Nx 22
- Vitest
- Ollama
- MCP SDK
- ChromaDB
- pnpm
- Node.js 25

---

# 📁 Estructura

```txt
libs/
 ├── agent/
 │    └── lógica principal del agente
 │
 ├── llm/
 │    └── cliente Ollama
 │
 ├── mcp/
 │    ├── MCP Client
 │    └── MCP Server
 │
 └── rag/
      ├── embeddings
      └── búsqueda semántica
```

---

# 🚀 Instalación

## 1. Clonar repositorio

```bash
git clone https://github.com/Crismaro19/agente-mcp-ollama.git
cd agente-mcp-ollama
```

## 2. Instalar dependencias

```bash
pnpm install
```

---

# 🦙 Instalar Ollama

Descargar:

```txt
https://ollama.com
```

---

# 📥 Descargar modelos

## Modelo principal

```bash
ollama pull qwen3:5b
```

## Embeddings

```bash
ollama pull nomic-embed-text
```

---

# 🧠 Ejecutar ChromaDB

```bash
docker run -p 8000:8000 chromadb/chroma
```

---

# ▶️ Ejecutar MCP Server

```bash
node --import tsx libs/mcp/src/lib/server.ts
```

# ▶️ Ejecutar MCP inspector

````bash
npx -y @modelcontextprotocol/inspector npx -y tsx libs/mcp/src/lib/server.ts
---

# 🧪 Tests

## Ejecutar todos

```bash
npm run test
````

---

# 🛣️ Roadmap

- [ ] soporte WebSocket MCP
- [ ] planner agent
- [ ] streaming responses
- [ ] herramientas dinámicas
- [ ] multi-agent
- [ ] UI web
- [ ] evaluación automática
- [ ] observabilidad

---

# 📚 Referencias

- MCP Specification
- Ollama
- ChromaDB
- Nx
- Vitest

---

# 🤝 Contribuciones

PRs y sugerencias son bienvenidas.

---

# 📄 Licencia

MIT
