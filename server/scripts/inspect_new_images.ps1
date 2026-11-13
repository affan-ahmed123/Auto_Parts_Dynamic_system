Add-Type -AssemblyName System.Drawing
$dir = "C:/Users/iakbe/.gemini/antigravity/brain/548809fc-5f93-473b-95d2-085b47be6b6d/.user_uploaded"
$files = @(
  "media_1794577259738_1d0837cc.jpg",
  "media_1794577287041_923f7cad.jpg",
  "media_1794577312538_fc7b9130.jpg",
  "media_1794577343175_a0823b10.jpg",
  "media_1794577369654_3b66255a.jpg",
  "media_1794577395024_12ac6737.png",
  "media_1794577421165_9454dabd.jpg",
  "media_1794577453469_ed595e9c.jpg",
  "media_1794577480172_0c4f3631.jpg",
  "media_1794577508497_8b987d3f.png",
  "media_1794577535559_be6d96ce.png",
  "media_1794577564439_8e26a388.jpg",
  "media_1794577599540_1c1ab67e.jpg",
  "media_1794577625639_f5103436.jpg"
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

