Add-Type -AssemblyName System.Drawing
$dir = "C:/Users/iakbe/.gemini/antigravity/brain/548809fc-5f93-473b-95d2-085b47be6b6d/.user_uploaded"
$files = @(
  "media_1794576072655_cb17c617.jpg",
  "media_1794576253578_892bebf0.jpg",
  "media_1794576299620_2650eca0.jpg",
  "media_1794576345687_bb481f13.jpg",
  "media_1794576382279_defaf898.jpg",
  "media_1794576438594_eae83a88.jpg",
  "media_1794576468803_44c0e6ad.jpg",
  "media_1794576507625_4ed8bb92.jpg",
  "media_1794576543722_5f694e2f.jpg",
  "media_1794576584231_474027ed.jpg",
  "media_1794576620811_9570a531.png",
  "media_1794576795012_4c686745.jpg",
  "media_1794576837721_7a87c444.jpg",
  "media_1794576878945_bb671cf4.jpg",
  "media_1794576906104_24b281fc.jpg"
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

