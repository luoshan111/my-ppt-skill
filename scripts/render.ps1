# 用 PowerPoint COM 将 PPTX 渲染为 PNG。任务清单文件为 UTF-8(BOM)，每行: pptx路径|输出目录
param([string]$Jobs = "render_jobs.txt")
$ErrorActionPreference = "Stop"
$lines = Get-Content -Path $Jobs -Encoding UTF8 | Where-Object { $_.Trim() -ne "" }
$pp = New-Object -ComObject PowerPoint.Application
foreach ($line in $lines) {
    $parts = $line -split '\|', 2
    $src = $parts[0].Trim(); $out = $parts[1].Trim()
    New-Item -ItemType Directory -Force -Path $out | Out-Null
    $pres = $pp.Presentations.Open($src, $true, $false, $false)
    $pres.Export($out, "PNG", 1600, 900)
    $pres.Close()
    Write-Output ("DONE " + $out)
}
$pp.Quit()
Write-Output "ALL_DONE"
