
$global:BotList = @()

function GetBotList() {
	$BotListUrl = "https://raw.githubusercontent.com/paret0x/Twitch-Bot-Finder/main/botlist.txt"

	$BotListResponse = Invoke-WebRequest -URI $BotListUrl
	if ($BotListResponse.statuscode -ne 200) {
		Write-Host "Failed to get bot list with error code " $BotListResponse.statuscode
		return
	}

	$Bots = $BotListResponse.Content.Split([System.Environment]::NewLine)
	Write-Host "Checking against list of" $Bots.length "bots"
	
	for ($index = 0; $index -le $Bots.length; $index++) {
		$Bot = $Bots[$index]
		$global:BotList += $Bot
	}
}

function CheckStreamForBots($StreamerName) {
	Write-Host "Monitoring twitch.tv/$StreamerName for bots"

	$StreamerUrl = "https://tmi.twitch.tv/group/user/$StreamerName/chatters"
	$DoLoop = 1
	$FoundBots = @()

	$ViewerPattern = [regex]'"viewers":\[(.*)\]}}'

	While ($DoLoop -eq 1) {
		$Response = Invoke-WebRequest -URI $StreamerUrl
		
		if ($Response.statuscode -ne 200) {
			Write-Host "Failed to query twitch.tv/" $StreamerName
			break
		}
		
		if ($Response -match $ViewerPattern) {
			$ViewerList = $matches[1].Split(",")
			$BotFound = $false
			
			for ($index = 0; $index -lt $ViewerList.count; $index++) { 
				$Viewer = $ViewerList[$index]
				$Viewer = $Viewer.Trim('"', ' ')
				
				if ($BotList.Contains($Viewer) -and -not $FoundBots.Contains($Viewer)) {
					Write-Host "Found new bot:" $Viewer
					$FoundBots += $Viewer
					$BotFound = $true
				}
			}
			
			if (-not $BotFound) {
				Write-Host "No bots found this round"
			}
		}
			
		Start-Sleep -Seconds 30
	}	
}

GetBotList
$StreamerName = Read-Host "Enter twitch.tv username you want to monitor"
CheckStreamForBots $StreamerName
