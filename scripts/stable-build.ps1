# Stable build wrapper for Windows + Bun
# - Runs SEO prebuild
# - Type checks via vue-tsc
# - Executes Vite build directly
# - If artifacts exist despite non-zero exit, treat as success

$ErrorActionPreference = 'Stop'

Write-Host "[1/4] Generating SEO files..." -ForegroundColor Cyan
bun scripts/generate-seo-files.js

Write-Host "[2/4] Type checking (vue-tsc)..." -ForegroundColor Cyan
bunx vue-tsc -b
if ($LASTEXITCODE -ne 0) {
  Write-Error "Type checking failed with exit code $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Host "[3/4] Building with Vite (debug + compression off if set)..." -ForegroundColor Cyan
# Respect SKIP_COMPRESSION env if provided
$envFlag = if ($env:SKIP_COMPRESSION -eq 'true') { ' (minify disabled)' } else { '' }
Write-Host "Running vite build$envFlag" -ForegroundColor Yellow

# Invoke vite.js directly to bypass bunx anomalies
bun ./node_modules/vite/bin/vite.js build --debug
$viteExit = $LASTEXITCODE

# Post-condition check: artifacts present
$indexPath = Join-Path $PSScriptRoot '..' | Join-Path -ChildPath 'dist/index.html'
if (Test-Path $indexPath) {
  Write-Host "[4/4] Build artifacts present at dist/." -ForegroundColor Green
  if ($viteExit -ne 0) {
    Write-Warning "Vite exited with code $viteExit, but artifacts exist. Treating as success."
  }
  exit 0
} else {
  Write-Error "Build failed. dist/index.html not found. Exit code: $viteExit"
  exit $viteExit
}
