$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$publicRoot = Join-Path $projectRoot 'public'
$htmlPath = Join-Path $publicRoot 'index.html'
$cssPath = Join-Path $publicRoot 'styles.css'
$scriptPath = Join-Path $publicRoot 'script.js'

$requiredFiles = @(
    $htmlPath,
    $cssPath,
    $scriptPath,
    (Join-Path $publicRoot 'images\hero-bromo.webp'),
    (Join-Path $publicRoot 'images\twin-horizon-bromo.webp'),
    (Join-Path $publicRoot 'images\trip-ijen.webp'),
    (Join-Path $publicRoot 'images\trip-komodo.webp'),
    (Join-Path $publicRoot 'images\trip-sumba.webp')
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path -LiteralPath $file)) {
        throw "Berkas wajib tidak ditemukan: $file"
    }
}

$html = Get-Content -Raw -LiteralPath $htmlPath
$css = Get-Content -Raw -LiteralPath $cssPath
$script = Get-Content -Raw -LiteralPath $scriptPath

if ($html.Contains([char]0x2014) -or $html.Contains([char]0x2013)) {
    throw 'Karakter em dash atau en dash ditemukan pada HTML.'
}

if ($html -match '<img(?![^>]*\balt=)[^>]*>') {
    throw 'Ada elemen gambar tanpa alt text.'
}

if ($html -match 'alt="\s*"') {
    throw 'Ada alt text kosong.'
}

foreach ($eventName in @('view_package', 'click_package', 'click_whatsapp', 'click_whatsapp_package', 'open_faq')) {
    if (-not $script.Contains($eventName)) {
        throw "Event analytics belum tersedia: $eventName"
    }
}

if (-not $css.Contains('prefers-reduced-motion')) {
    throw 'Fallback reduced motion belum tersedia.'
}

if (-not $css.Contains('prefers-color-scheme: dark')) {
    throw 'Token mode gelap belum tersedia.'
}

Write-Host 'Verifikasi statis berhasil.' -ForegroundColor Green
