Add-Type -AssemblyName System.Drawing

function Analyze-Image($path, $name) {
    $bmp = [System.Drawing.Bitmap]::FromFile($path)
    Write-Host "=== Analyzing $name ($($bmp.Width)x$($bmp.Height)) ==="
    
    # Sample top 300 pixels y-axis to see where content/white starts
    # Also find bounding box
    $bmp.Dispose()
}

$dir = "C:/Users/iakbe/.gemini/antigravity/brain/548809fc-5f93-473b-95d2-085b47be6b6d/.user_uploaded"
Analyze-Image (Join-Path $dir "media_1794576072655_cb17c617.jpg") "Coolant"

