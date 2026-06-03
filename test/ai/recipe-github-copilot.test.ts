import { describe, expect, test } from 'bun:test';
import { getRecipe } from '../../src/core/ai/recipes/index.ts';
import { applyResolveAuth, applyOpenAICompatConfig } from '../../src/core/ai/gateway.ts';
import { AIConfigError } from '../../src/core/ai/errors.ts';

describe('recipe: github-copilot', () => {
  test('registered with expected shape', () => {
    const r = getRecipe('github-copilot');
    expect(r).toBeDefined();
    expect(r!.tier).toBe('openai-compat');
    expect(r!.implementation).toBe('openai-compatible');
    expect(r!.base_url_default).toBe('https://api.githubcopilot.com');
    expect(r!.auth_env?.any_required).toEqual([
      'COPILOT_GITHUB_TOKEN',
      'GH_TOKEN',
      'GITHUB_TOKEN',
    ]);
    expect(r!.touchpoints.chat).toBeDefined();
  });

  test('resolveAuth token precedence: COPILOT_GITHUB_TOKEN > GH_TOKEN > GITHUB_TOKEN', () => {
    const r = getRecipe('github-copilot')!;

    const a = r.resolveAuth!({
      COPILOT_GITHUB_TOKEN: 'copilot-token',
      GH_TOKEN: 'gh-token',
      GITHUB_TOKEN: 'github-token',
    });
    expect(a.token).toBe('Bearer copilot-token');

    const b = r.resolveAuth!({
      GH_TOKEN: 'gh-token',
      GITHUB_TOKEN: 'github-token',
    });
    expect(b.token).toBe('Bearer gh-token');

    const c = r.resolveAuth!({ GITHUB_TOKEN: 'github-token' });
    expect(c.token).toBe('Bearer github-token');
  });

  test('resolveAuth throws when no supported token env is present', () => {
    const r = getRecipe('github-copilot')!;
    expect(() => r.resolveAuth!({})).toThrow(AIConfigError);
  });

  test('applyResolveAuth returns apiKey path for bearer auth', () => {
    const r = getRecipe('github-copilot')!;
    const auth = applyResolveAuth(
      r,
      { env: { GH_TOKEN: 'gh-token' } } as any,
      'chat',
    );
    expect(auth.apiKey).toBe('gh-token');
    expect(auth.headers?.Authorization).toBeUndefined();
  });

  test('resolveOpenAICompatConfig honors COPILOT_BASE_URL override', () => {
    const r = getRecipe('github-copilot')!;
    const cfg = applyOpenAICompatConfig(
      r,
      { env: { COPILOT_BASE_URL: 'https://proxy.example.com/' } } as any,
    );
    expect(cfg.baseURL).toBe('https://proxy.example.com');
  });
});
