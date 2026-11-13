Add-Type -AssemblyName System.Drawing

$uploadsBrain = "C:/Users/iakbe/.gemini/antigravity/brain/548809fc-5f93-473b-95d2-085b47be6b6d/.user_uploaded"
$destDirs = @(
    "C:/Users/iakbe/OneDrive/Desktop/parts/server/uploads/parts",
    "C:/Users/iakbe/OneDrive/Desktop/parts/client/public/uploads/parts"
)

foreach ($dir in $destDirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Define specs for each image: [SourceFile, OutputFilename, CropX, CropY, CropWidth, CropHeight]
# If CropX/Y/W/H are -1, it means auto or full.
$crops = @(
    # 1. Honda Coolant 4L: original 708x628. Header ends around y=210. Bottle is from y=210 to 628, x=180 to 650
    @{
        File = "media_1794576072655_cb17c617.jpg";
        Out = "honda-coolant-4l.jpg";
        X = 200; Y = 210; W = 450; H = 415
    },
    # 2. Bendix DOT 4 Brake Fluid: original 615x516. Bottle is x=150 to 450, y=50 to 495
    @{
        File = "media_1794576253578_892bebf0.jpg";
        Out = "bendix-dot4-brake-fluid.jpg";
        X = 140; Y = 40; W = 320; H = 460
    },
    # 3. Shell Helix 0W-20: original 499x530. Bottle is centered, x=30 to 470, y=30 to 500
    @{
        File = "media_1794576299620_2650eca0.jpg";
        Out = "shell-helix-0w20.jpg";
        X = 35; Y = 35; W = 430; H = 480
    },
    # 4. Motorcraft 5W-30 Oil: original 499x504. Red bottle is x=60 to 370, y=70 to 470
    @{
        File = "media_1794576345687_bb481f13.jpg";
        Out = "motorcraft-5w30-oil.jpg";
        X = 60; Y = 60; W = 320; H = 420
    },
    # 5. Chrome Lug Nuts: original 611x518. Box and nuts are x=25 to 585, y=10 to 505
    @{
        File = "media_1794576382279_defaf898.jpg";
        Out = "chrome-lug-nuts-m12.jpg";
        X = 20; Y = 10; W = 570; H = 500
    },
    # 6. Front Wheel Hub & Bearing Assembly: original 620x627. Header ends y=170. Hub is y=180 to 620, x=60 to 560
    @{
        File = "media_1794576438594_eae83a88.jpg";
        Out = "wheel-hub-bearing-assembly.jpg";
        X = 60; Y = 220; W = 500; H = 400
    },
    # 7. Michelin Primacy 4 Tyre: original 652x494. Tyre is x=70 to 580, y=60 to 480
    @{
        File = "media_1794576468803_44c0e6ad.jpg";
        Out = "michelin-primacy4-tyre.jpg";
        X = 65; Y = 60; W = 520; H = 430
    },
    # 8. Heavy-Duty Mud Flaps: original 622x640. Header ends y=210. Flaps are y=220 to 640, x=80 to 550
    @{
        File = "media_1794576507625_4ed8bb92.jpg";
        Out = "molded-splash-guards-mudflaps.jpg";
        X = 90; Y = 240; W = 460; H = 395
    },
    # 9. Silicone Wiper Blades: original 656x627. Header ends y=200. Wipers are y=220 to 627, x=60 to 580
    @{
        File = "media_1794576543722_5f694e2f.jpg";
        Out = "silicone-wiper-blades-pair.jpg";
        X = 60; Y = 230; W = 530; H = 390
    },
    # 10. Front Honeycomb Grille: original 649x577. Header ends y=80. Grilles are y=85 to 570, x=30 to 610
    @{
        File = "media_1794576584231_474027ed.jpg";
        Out = "front-honeycomb-grille.jpg";
        X = 30; Y = 85; W = 590; H = 485
    },
    # 11. Power Heated Side Mirror: original 1024x374. Mirror is on left: x=40 to 480, y=90 to 360
    @{
        File = "media_1794576620811_9570a531.png";
        Out = "power-heated-side-mirror.jpg";
        X = 45; Y = 95; W = 435; H = 270
    },
    # 12. T10 LED Bulbs: original 682x621. Header ends y=200. Bulbs are y=240 to 620, x=100 to 580
    @{
        File = "media_1794576795012_4c686745.jpg";
        Out = "t10-w5w-led-bulbs.jpg";
        X = 100; Y = 260; W = 480; H = 360
    },
    # 13. LED Tail Light Assembly: original 1024x463. Tail light is on left: x=20 to 480, y=40 to 455
    @{
        File = "media_1794576837721_7a87c444.jpg";
        Out = "led-tail-light-assembly.jpg";
        X = 20; Y = 40; W = 460; H = 415
    },
    # 14. Clear Lens Fog Lights: original 1024x428. Fog lights are on left: x=35 to 475, y=30 to 420
    @{
        File = "media_1794576878945_bb671cf4.jpg";
        Out = "clear-lens-fog-lights-pair.jpg";
        X = 35; Y = 30; W = 435; H = 390
    },
    # 15. H11 LED Headlight Bulbs: original 1024x380. Headlight bulbs on left: x=40 to 480, y=5 to 375
    @{
        File = "media_1794576906104_24b281fc.jpg";
        Out = "h11-led-headlight-bulbs.jpg";
        X = 40; Y = 5; W = 440; H = 370
    }
)

foreach ($c in $crops) {
    $srcPath = Join-Path $uploadsBrain $c.File
    if (-not (Test-Path $srcPath)) {
        Write-Warning "Source file not found: $srcPath"
        continue
    }

    $srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)
    
    # Bound checks
    $x = [Math]::Max(0, [int]$c.X)
    $y = [Math]::Max(0, [int]$c.Y)
    $w = [Math]::Min($srcImg.Width - $x, [int]$c.W)
    $h = [Math]::Min($srcImg.Height - $y, [int]$c.H)

    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    
    # Create clean cropped bitmap
    $cropped = New-Object System.Drawing.Bitmap($w, $h)
    $graphics = [System.Drawing.Graphics]::FromImage($cropped)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.Clear([System.Drawing.Color]::White)
    $graphics.DrawImage($srcImg, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)

    foreach ($dir in $destDirs) {
        $outPath = Join-Path $dir $c.Out
        $cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    }

    $graphics.Dispose()
    $cropped.Dispose()
    $srcImg.Dispose()

    Write-Host "Processed and saved: $($c.Out) ($w x $h)"
}

Write-Host "All 15 images cropped and saved successfully!"

