Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "C:\Users\cwilc\Desktop\School\vertexplayer\mongo-start.bat" & Chr(34), 0
WshShell.Run chr(34) & "C:\Users\cwilc\Desktop\School\vertexplayer\node-start.bat" & Chr(34), 0
WScript.Sleep 2000
WshShell.Run chr(34) & "http://localhost:3000" & Chr(34), 0
Set WshShell = Nothing