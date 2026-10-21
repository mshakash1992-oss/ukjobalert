$ErrorActionPreference = 'Stop'
$path = Join-Path (Get-Location) 'app\jobs\[slug]\page.tsx'
if (-not (Test-Path -LiteralPath $path)) { throw "File not found: $path" }
$code = [System.IO.File]::ReadAllText($path)
$original = $code
$backup = Join-Path (Split-Path $path) ('page-before-company-link-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.txt')
[System.IO.File]::WriteAllText($backup, $original)
if ($code -notmatch 'const companyHref\s*=') {
  $anchor = '  const companyInitial = companyName.slice(0, 1).toUpperCase();'
  if (-not $code.Contains($anchor)) { throw 'Expected companyInitial line not found. No changes made.' }
  $code = $code.Replace($anchor, $anchor + "`r`n" + '  const companyHref = `/companies/${encodeURIComponent(value(job.employer_id))}`;')
}
$oldPosted = '<p className={styles.companyName}>Posted by {companyName}</p>'
$newPosted = '<p className={styles.companyName}>Posted by <Link href={companyHref} style={{color:"#C8102E",fontWeight:600,textDecoration:"underline",textUnderlineOffset:3}}>{companyName}</Link></p>'
if ($code.Contains($oldPosted)) { $code = $code.Replace($oldPosted, $newPosted) }
$oldSidebar = '<div><h2>{companyName}</h2><span className={styles.sideVerified}>'
$newSidebar = '<div><h2><Link href={companyHref} style={{color:"inherit",textDecoration:"none"}}>{companyName}</Link></h2><span className={styles.sideVerified}>'
if ($code.Contains($oldSidebar)) { $code = $code.Replace($oldSidebar, $newSidebar) }
$oldJobs = 'href={`/jobs?keyword=${encodeURIComponent(companyName)}`}'
if ($code.Contains($oldJobs)) { $code = $code.Replace($oldJobs, 'href={companyHref}') }
if ($code -eq $original) { Write-Host 'No changes needed or expected text was not found. Inspect the file.'; exit 0 }
[System.IO.File]::WriteAllText($path, $code)
Write-Host 'Company links updated. Backup:' $backup
Write-Host 'Now run npm run build'
