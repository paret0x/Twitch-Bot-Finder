
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
	$CountSinceLastBot = 0
	$SleepTime = 30

	While ($DoLoop -eq 1) {
		$Response = Invoke-WebRequest -URI $StreamerUrl
		
		if ($Response.statuscode -ne 200) {
			Write-Host "Failed to query twitch.tv/" $StreamerName
			break
		}
		
		if ($Response -match $ViewerPattern) {
			$ViewerList = $matches[1].Split(",")
			$NewBots = @()
			
			for ($index = 0; $index -lt $ViewerList.count; $index++) { 
				$Viewer = $ViewerList[$index]
				$Viewer = $Viewer.Trim('"', ' ')
				
				if ($global:BotList.Contains($Viewer) -and -not $FoundBots.Contains($Viewer)) {
					$NewBots += $Viewer
				}
			}
			
			if ($NewBots.length -gt 0) {
				$CountSinceLastBot = 1
				
				Write-Host ""
				for ($index = 0; $index -lt $NewBots.count; $index++) {
					$BotName = $NewBots[$index]
					Write-Host "Found new bot: $BotName"
					$FoundBots += $BotName
				}
			} else {
				$NumSeconds = $SleepTime * $CountSinceLastBot
				$MinuteCount = [int][Math]::Floor($NumSeconds / 60)
				$SecondCount = $NumSeconds % 60
				Write-Host -NoNewLine "`rNo new bots found in $MinuteCount minute(s) and $SecondCount seconds. " 
				$CountSinceLastBot += 1
			}
		}
			
		Start-Sleep -Seconds $SleepTime
	}	
}

GetBotList
$StreamerName = Read-Host "Enter twitch.tv username you want to monitor"
CheckStreamForBots $StreamerName
