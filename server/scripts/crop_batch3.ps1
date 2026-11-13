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

$crops = @(
    # 1. Spin-On Engine Oil Filter: original 1024x441. Filter is x=25 to 490, y=100 to 440
    @{
        File = "media_1794577776104_dd330af0.jpg";
        Out = "spin-on-engine-oil-filter.jpg";
        X = 20; Y = 100; W = 475; H = 340
    },
    # 2. Aluminum Coolant Thermostat Housing: original 1024x433. Housing is x=60 to 420, y=20 to 425
    @{
        File = "media_1794577814683_edc82b23.jpg";
        Out = "aluminum-coolant-thermostat-housing.jpg";
        X = 60; Y = 20; W = 365; H = 405
    },
    # 3. Valve Cover Gasket Set: original 1024x447. Gaskets + cover are x=10 to 570, y=130 to 390
    @{
        File = "media_1794577858544_ed036e42.jpg";
        Out = "valve-cover-gasket-set.jpg";
        X = 10; Y = 130; W = 560; H = 265
    },
    # 4. Serpentine Drive Belt 6PK1840: original 1024x486. Belt is x=150 to 420, y=20 to 480
    @{
        File = "media_1794577881159_2859127a.jpg";
        Out = "serpentine-drive-belt-6pk1840.jpg";
        X = 145; Y = 15; W = 280; H = 465
    },
    # 5. Hydraulic Engine Mount Right: original 1024x419. Mount is x=30 to 410, y=50 to 415
    @{
        File = "media_1794577907353_3b3ff0a0.jpg";
        Out = "hydraulic-engine-mount-right.jpg";
        X = 30; Y = 50; W = 385; H = 365
    },
    # 6. Timing Belt & Tensioner Kit: original 1024x402. Belt & pulleys are x=50 to 480, y=80 to 395
    @{
        File = "media_1794577934992_bf94f674.jpg";
        Out = "timing-belt-tensioner-kit.jpg";
        X = 50; Y = 80; W = 435; H = 315
    },
    # 7. Iridium IX Spark Plugs Set: original 1024x364. Plugs & boxes are x=20 to 525, y=170 to 360
    @{
        File = "media_1794577963235_da7e293c.jpg";
        Out = "iridium-spark-plugs-set4.jpg";
        X = 20; Y = 170; W = 510; H = 190
    },
    # 8. Brake Caliper Rebuild Seal Kit: original 1016x456. Rubber seals are x=20 to 460, y=120 to 400
    @{
        File = "media_1794577987240_f0791808.jpg";
        Out = "brake-caliper-rebuild-seal-kit.jpg";
        X = 20; Y = 120; W = 445; H = 285
    },
    # 9. Performance Slotted Brake Pads: original 1024x446. Rotors & pads are x=25 to 455, y=30 to 440
    @{
        File = "media_1794578011608_beaea717.jpg";
        Out = "performance-slotted-brake-pads-rear.jpg";
        X = 25; Y = 30; W = 435; H = 410
    },
    # 10. ABS Wheel Speed Sensor: original 1024x423. Sensor wire is x=40 to 470, y=120 to 420
    @{
        File = "media_1794578050896_a1fc4fdf.jpg";
        Out = "abs-wheel-speed-sensor-front-left.jpg";
        X = 40; Y = 125; W = 435; H = 295
    },
    # 11. Rear Drum Brake Shoe Kit: original 1024x408. Shoes & springs are x=5 to 540, y=120 to 400
    @{
        File = "media_1794578090988_550a5f2e.jpg";
        Out = "rear-drum-brake-shoe-kit.jpg";
        X = 5; Y = 120; W = 540; H = 285
    },
    # 12. Ventilated Front Brake Rotor Pair: original 1024x440. Rotors are x=50 to 435, y=5 to 435
    @{
        File = "media_1794578117715_bc6a657a.jpg";
        Out = "ventilated-front-brake-rotor-pair.jpg";
        X = 50; Y = 5; W = 390; H = 430
    },
    # 13. Front Ceramic Brake Pad Set: original 1024x417. Pads & box are x=35 to 455, y=70 to 415
    @{
        File = "media_1794578142328_1a093a64.jpg";
        Out = "front-ceramic-brake-pad-set.jpg";
        X = 35; Y = 70; W = 425; H = 345
    }
)

foreach ($c in $crops) {
    $srcPath = Join-Path $uploadsBrain $c.File
    if (-not (Test-Path $srcPath)) {
        Write-Warning "Source file not found: $srcPath"
        continue
    }

    $srcImg = [System.Drawing.Bitmap]::FromFile($srcPath)
    
    $x = [Math]::Max(0, [int]$c.X)
    $y = [Math]::Max(0, [int]$c.Y)
    $w = [Math]::Min($srcImg.Width - $x, [int]$c.W)
    $h = [Math]::Min($srcImg.Height - $y, [int]$c.H)

    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    
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

Write-Host "All 13 batch 3 images cropped and saved successfully!"

