param([int]$Port = 4173)
$ErrorActionPreference = 'Stop'
$root = [System.IO.Path]::GetFullPath($PSScriptRoot)
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "ICON CAFE demo: http://localhost:$Port/"
try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      $relative = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/')).Replace('/', [System.IO.Path]::DirectorySeparatorChar)
      $file = [System.IO.Path]::GetFullPath((Join-Path $root $relative))
      if (-not $file.StartsWith($root + [System.IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase) -and $file -ne $root) {
        $context.Response.StatusCode = 403
      } else {
        if ([System.IO.Directory]::Exists($file)) { $file = Join-Path $file 'index.html' }
        if ([System.IO.File]::Exists($file)) {
          $mime = switch ([System.IO.Path]::GetExtension($file).ToLowerInvariant()) {
            '.html' { 'text/html; charset=utf-8' }
            '.css' { 'text/css; charset=utf-8' }
            '.js' { 'text/javascript; charset=utf-8' }
            '.jpg' { 'image/jpeg' }
            '.png' { 'image/png' }
            '.svg' { 'image/svg+xml' }
            default { 'application/octet-stream' }
          }
          $bytes = [System.IO.File]::ReadAllBytes($file)
          $context.Response.ContentType = $mime
          $context.Response.ContentLength64 = $bytes.Length
          if ($context.Request.HttpMethod -ne 'HEAD') { $context.Response.OutputStream.Write($bytes, 0, $bytes.Length) }
        } else { $context.Response.StatusCode = 404 }
      }
    } catch {
      $context.Response.StatusCode = 500
    } finally { $context.Response.Close() }
  }
} finally { $listener.Stop(); $listener.Close() }
