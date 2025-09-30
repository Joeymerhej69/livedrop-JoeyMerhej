Branch: feature/ai-week3-prompting

Title: Week 3 - RAG + Open-Source LLMs (knowledge base, prompts, evals, notebook, chat CLI)

Description:

- Added prompting materials under `docs/prompting/`:
  - `knowledge-base.md` (20 Shoplite docs)
  - `ground-truth-qa.md` (20 Q&A pairs)
  - `assistant-prompts.yml` (structured prompts)
  - `evals.md` (retrieval + response + edge tests)
- Added Colab notebook `notebooks/llm-deployment.ipynb` that is self-contained and demonstrates FAISS-based retrieval and an example open-source LLM generation pipeline (uses a placeholder HF model; instructor should pick a model appropriate for Colab GPU).
- Added CLI `src/chat-interface.py` to call the deployed RAG API.

Notes:

- Notebook uses open-source models only (no OpenAI). The model name in the notebook is a placeholder and should be replaced with a Llama-style model that fits the available GPU.
- Do not hardcode ngrok tokens; the notebook asks for the token at runtime.
- I did not push changes or create the branch remotely; please review and push from your machine when ready.
