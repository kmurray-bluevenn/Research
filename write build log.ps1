$version = $args[0]
$now = [datetime]::Now.ToString()
$logFile = [System.IO.Path]::Combine($Env:HOMEDRIVE + "\", "build log.txt")
$logText = [string]::Format("{0} CI Build started | {1}",$version, $now)
if (!(Test-Path -Path $logFile))
{
	New-Item -ItemType file -Path $logFile
}
Add-Content -Path $logFile -Value $logText