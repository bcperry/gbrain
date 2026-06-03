$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$bun = Join-Path $env:USERPROFILE '.bun\bin\bun.exe'
$gh = 'C:\Program Files\GitHub CLI\gh.exe'

if (-not (Test-Path $bun)) {
  throw "Bun executable not found at $bun"
}

if (Test-Path $gh) {
  $env:COPILOT_GITHUB_TOKEN = (& $gh auth token)
} elseif (Get-Command gh -ErrorAction SilentlyContinue) {
  $env:COPILOT_GITHUB_TOKEN = (& gh auth token)
}

$env:MCP_STDIO = '1'
Set-Location $repoRoot
& $bun run --silent (Join-Path $repoRoot 'src\cli.ts') serve
exit $LASTEXITCODE
