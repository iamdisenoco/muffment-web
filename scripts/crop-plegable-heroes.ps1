# Auto-crop bounding box de pixels no-transparentes para plegable-{2..7}-hero-pre-crop.png
# Output: plegable-{N}-hero-v3.png con A-frame ocupando 100% del canvas
# Uso: pwsh -File scripts/crop-plegable-heroes.ps1

Add-Type -AssemblyName System.Drawing
$dir = "C:\Users\User\Downloads\muffment-web\public\img\products\2026"
$pad = 4

foreach ($n in 2..7) {
    $src = Join-Path $dir "plegable-$n-hero-pre-crop.png"
    $dst = Join-Path $dir "plegable-$n-hero-v3.png"

    if (-not (Test-Path $src)) {
        Write-Host "MISS plegable-$n-hero-pre-crop.png — skipping"
        continue
    }

    $bmp = New-Object System.Drawing.Bitmap($src)
    $w = $bmp.Width; $h = $bmp.Height

    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $data = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bytes = New-Object byte[] ($data.Stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($data.Scan0, $bytes, 0, $bytes.Length)
    $bmp.UnlockBits($data)

    $minX = $w; $minY = $h; $maxX = 0; $maxY = 0
    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $idx = ($y * $data.Stride) + ($x * 4) + 3
            if ($bytes[$idx] -gt 5) {
                if ($x -lt $minX) { $minX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -gt $maxY) { $maxY = $y }
            }
        }
    }

    $cx = [Math]::Max(0, $minX - $pad)
    $cy = [Math]::Max(0, $minY - $pad)
    $cw = [Math]::Min($w - $cx, $maxX - $minX + 1 + 2 * $pad)
    $ch = [Math]::Min($h - $cy, $maxY - $minY + 1 + 2 * $pad)

    $cropped = New-Object System.Drawing.Bitmap($cw, $ch, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($cropped)
    $g.DrawImage($bmp, (New-Object System.Drawing.Rectangle(0, 0, $cw, $ch)), (New-Object System.Drawing.Rectangle($cx, $cy, $cw, $ch)), [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $cropped.Save($dst, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    $bmp.Dispose()

    $sizeMB = [math]::Round((Get-Item $dst).Length / 1048576, 2)
    $msg = 'plegable-{0}-hero-v3.png  {1}x{2} -> {3}x{4}  ({5} MB)' -f $n, $w, $h, $cw, $ch, $sizeMB
    Write-Host $msg
}

Write-Host ""
Write-Host "Done."
