Add-Type -AssemblyName System.Drawing
$dir = "C:/Users/iakbe/.gemini/antigravity/brain/548809fc-5f93-473b-95d2-085b47be6b6d/.user_uploaded"
$files = @(
  "media_1794577776104_dd330af0.jpg",
  "media_1794577814683_edc82b23.jpg",
  "media_1794577858544_ed036e42.jpg",
  "media_1794577881159_2859127a.jpg",
  "media_1794577907353_3b3ff0a0.jpg",
  "media_1794577934992_bf94f674.jpg",
  "media_1794577963235_da7e293c.jpg",
  "media_1794577987240_f0791808.jpg",
  "media_1794578011608_beaea717.jpg",
  "media_1794578050896_a1fc4fdf.jpg",
  "media_1794578090988_550a5f2e.jpg",
  "media_1794578117715_bc6a657a.jpg",
  "media_1794578142328_1a093a64.jpg"
)

foreach ($f in $files) {
  $p = Join-Path $dir $f
  if (Test-Path $p) {
    $img = [System.Drawing.Image]::FromFile($p)
    Write-Output ("{0}: {1}x{2}" -f $f, $img.Width, $img.Height)
    $img.Dispose()
  } else {
    Write-Output ("{0}: NOT FOUND" -f $f)
  }
}

