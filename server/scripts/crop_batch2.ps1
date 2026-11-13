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
    # 1. OBD2 Scanner: original 1024x368. Left tablet+vci module: x=30 to 480, y=40 to 365
    @{
        File = "media_1794577259738_1d0837cc.jpg";
        Out = "obd2-scanner-diagnostic-tool.jpg";
        X = 25; Y = 40; W = 460; H = 320
    },
    # 2. Starter Motor: original 1024x323. Left starter: x=50 to 470, y=20 to 320
    @{
        File = "media_1794577287041_923f7cad.jpg";
        Out = "starter-motor-assembly-14kw.jpg";
        X = 50; Y = 20; W = 425; H = 300
    },
    # 3. 130A Alternator: original 1024x441. Left alternator+box: x=35 to 475, y=15 to 435
    @{
        File = "media_1794577312538_fc7b9130.jpg";
        Out = "alternator-130a-high-output.jpg";
        X = 35; Y = 15; W = 445; H = 415
    },
    # 4. AGM Battery 12V 60Ah: original 1024x466. Left battery: x=5 to 505, y=20 to 460
    @{
        File = "media_1794577343175_a0823b10.jpg";
        Out = "agm-maintenance-free-battery-12v.jpg";
        X = 5; Y = 20; W = 500; H = 435
    },
    # 5. Direct-Ignition Coil Pack: original 1024x446. Left coils: x=100 to 420, y=20 to 440
    @{
        File = "media_1794577369654_3b66255a.jpg";
        Out = "direct-ignition-coil-pack.jpg";
        X = 100; Y = 20; W = 325; H = 415
    },
    # 6. Outer Tie Rod End: original 1024x440. Left tie rods: x=20 to 465, y=20 to 435
    @{
        File = "media_1794577395024_12ac6737.png";
        Out = "outer-tie-rod-end-pair.jpg";
        X = 20; Y = 20; W = 450; H = 415
    },
    # 7. Rear Coil Springs: original 1024x444. Left springs+box: x=60 to 485, y=40 to 440
    @{
        File = "media_1794577421165_9454dabd.jpg";
        Out = "rear-coil-spring-set.jpg";
        X = 60; Y = 40; W = 430; H = 395
    },
    # 8. Front Sway Bar Link Kit: original 1024x464. Left links+box: x=30 to 490, y=20 to 460
    @{
        File = "media_1794577453469_ed595e9c.jpg";
        Out = "front-sway-bar-link-kit.jpg";
        X = 30; Y = 20; W = 465; H = 435
    },
    # 9. Lower Control Arm & Ball Joint: original 1024x516. Left arms: x=30 to 535, y=30 to 510
    @{
        File = "media_1794577480172_0c4f3631.jpg";
        Out = "lower-control-arm-ball-joint.jpg";
        X = 30; Y = 30; W = 505; H = 475
    },
    # 10. Front Gas Shock Absorbers: original 1024x509. Left shocks: x=100 to 395, y=10 to 500
    @{
        File = "media_1794577508497_8b987d3f.png";
        Out = "front-gas-shock-absorbers.jpg";
        X = 95; Y = 10; W = 305; H = 490
    },
    # 11. Cartridge Oil Filter Euro: original 1024x410. Left filter: x=155 to 320, y=45 to 395
    @{
        File = "media_1794577535559_be6d96ce.png";
        Out = "cartridge-oil-filter-euro.jpg";
        X = 150; Y = 40; W = 175; H = 360
    },
    # 12. Cartridge Fuel Filter: original 1024x402. Left filter+gasket: x=60 to 460, y=60 to 390
    @{
        File = "media_1794577564439_8e26a388.jpg";
        Out = "cartridge-fuel-filter-element.jpg";
        X = 60; Y = 60; W = 405; H = 330
    },
    # 13. Cabin Air Filter: original 1024x451. Left filters+box: x=50 to 465, y=20 to 445
    @{
        File = "media_1794577599540_1c1ab67e.jpg";
        Out = "activated-carbon-cabin-filter.jpg";
        X = 50; Y = 20; W = 415; H = 425
    },
    # 14. Engine Air Intake Filter: original 991x453. Left blue filter: x=60 to 510, y=10 to 445
    @{
        File = "media_1794577625639_f5103436.jpg";
        Out = "engine-air-intake-filter.jpg";
        X = 60; Y = 10; W = 455; H = 430
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

Write-Host "All 14 batch 2 images cropped and saved successfully!"

