# GBrain Copilot Operating Instructions

When working in this workspace, use the local GBrain as the persistent brain and skill system.

- Read and follow `INSTALL_FOR_AGENTS.md` and `AGENTS.md` for setup and operating protocol.
- Use the `gbrain` MCP server when available before external lookup or fresh speculation.
- Use brain-first lookup for substantive user requests: search/query the brain, then answer or act.
- Read `skills/RESOLVER.md` to choose skills. Treat the resolver as the dispatcher, then read the selected `skills/<name>/SKILL.md` before applying that skill.
- Apply the core skills by default:
  - `skills/signal-detector/SKILL.md` for every inbound message worth capturing.
  - `skills/brain-ops/SKILL.md` for brain lookup and write decisions.
  - `skills/conventions/quality.md` for citation, source, and backlink expectations.
- This checkout supports GitHub Copilot subscription auth through `github-copilot:*` models. Do not assume Anthropic is required for `think` or subagent loops.
- Do not silently change `search.mode`; ask the operator first. The intended local mode is `tokenmax` unless they choose otherwise.
