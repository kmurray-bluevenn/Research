$now = [datetime]::Now.ToString()
$logFile = [System.IO.Path]::Combine($Env:HOMEDRIVE + "\", "build log.txt")
$logText = [string]::Format("CI Build started | {0}", $now)
if (!(Test-Path -Path $logFile))
{
	New-Item -ItemType file -Path $logFile
}
Add-Content -Path $logFile -Value $logText