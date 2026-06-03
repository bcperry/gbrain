import type { Recipe } from '../types.ts';
import { AIConfigError } from '../errors.ts';

/**
 * GitHub Copilot subscription-backed inference.
 *
 * This recipe routes directly to GitHub Copilot's hosted inference endpoint
 * (`api.githubcopilot.com`) and authenticates with a GitHub token associated
 * with an active Copilot subscription. It is not GitHub Models/BYOK.
 *
 * Token precedence mirrors Copilot CLI docs:
 *   COPILOT_GITHUB_TOKEN > GH_TOKEN > GITHUB_TOKEN
 */
export const githubCopilot: Recipe = {
  id: 'github-copilot',
  name: 'GitHub Copilot (subscription)',
  tier: 'openai-compat',
  implementation: 'openai-compatible',
  base_url_default: 'https://api.githubcopilot.com',
  auth_env: {
    required: [],
    any_required: ['COPILOT_GITHUB_TOKEN', 'GH_TOKEN', 'GITHUB_TOKEN'],
    optional: [
      'COPILOT_BASE_URL',
      'COPILOT_GITHUB_TOKEN',
      'GH_TOKEN',
      'GITHUB_TOKEN',
      'COPILOT_INTEGRATION_ID',
      'COPILOT_EDITOR_VERSION',
      'COPILOT_EDITOR_PLUGIN_VERSION',
    ],
    setup_url: 'https://docs.github.com/copilot/how-tos/copilot-cli',
  },
  resolveAuth(env) {
    const token = env.COPILOT_GITHUB_TOKEN ?? env.GH_TOKEN ?? env.GITHUB_TOKEN;
    if (!token) {
      throw new AIConfigError(
        'GitHub Copilot chat requires one of COPILOT_GITHUB_TOKEN, GH_TOKEN, or GITHUB_TOKEN.',
        'Run `gh auth token` and export COPILOT_GITHUB_TOKEN (or GH_TOKEN/GITHUB_TOKEN) from an account with Copilot access.',
      );
    }
    return { headerName: 'Authorization', token: `Bearer ${token}` };
  },
  resolveOpenAICompatConfig(env) {
    const baseURL = (env.COPILOT_BASE_URL ?? 'https://api.githubcopilot.com').replace(/\/+$/, '');
    return { baseURL };
  },
  resolveDefaultHeaders(env) {
    return {
      'copilot-integration-id': env.COPILOT_INTEGRATION_ID ?? 'gbrain',
      'editor-version': env.COPILOT_EDITOR_VERSION ?? 'vscode/1.99.0',
      'editor-plugin-version': env.COPILOT_EDITOR_PLUGIN_VERSION ?? 'gbrain/0.1.0',
    };
  },
  touchpoints: {
    embedding: {
      models: ['text-embedding-3-small'],
      default_dims: 1536,
      dims_options: [512, 768, 1024, 1536],
      price_last_verified: '2026-06-03',
      max_batch_tokens: 100_000,
    },
    expansion: {
      models: ['gpt-5.4-mini', 'gpt-4o-mini-2024-07-18'],
      price_last_verified: '2026-06-03',
    },
    chat: {
      models: [
        'gpt-5.5',
        'gpt-5.4',
        'gpt-5.4-mini',
        'gpt-5.3-codex',
        'gpt-5.2-codex',
        'claude-sonnet-4.6',
        'claude-opus-4.7',
        'gemini-3.5-flash',
      ],
      supports_tools: true,
      supports_subagent_loop: false,
      supports_prompt_cache: false,
      price_last_verified: '2026-06-03',
    },
  },
  setup_hint:
    'Export COPILOT_GITHUB_TOKEN (preferred) or GH_TOKEN/GITHUB_TOKEN from a GitHub identity with Copilot access, then use github-copilot:<model> (for example github-copilot:gpt-5.5).',
};
