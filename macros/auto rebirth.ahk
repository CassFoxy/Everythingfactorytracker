#SingleInstance Force
CoordMode, Mouse, Screen

running := false
guiReady := false
finalSleep := 5000

; ===== Startup GUI =====
Gui, +LastFound +OwnDialogs +AlwaysOnTop -MinimizeBox -MaximizeBox
Gui, Color, 2E1065, 2E1065
Gui, Font, s11 cWhite, Segoe UI
Gui, Margin, 20, 18

Gui, Add, Text, w340 Center, Welcome to Dire's Rebirth Macro
Gui, Add, Text, w340 Center,
Gui, Add, Text, w340, Hotkey Instructions
Gui, Add, Text, w340, F2 = Start / Stop Macro
Gui, Add, Text, w340, F4 = Change Final Sleep + Reload
Gui, Add, Text, w340, Esc = Exit Macro
Gui, Add, Text, w340 Center,
Gui, Add, Button, w140 h32 gContinueMacro -Theme, Continue

Gui, Show,, Dire's Rebirth Macro
return

ContinueMacro:
guiReady := true
Gui, Destroy
return

F2::
if (!guiReady)
{
    MsgBox, 48, Dire's Rebirth Macro, Press Continue on the welcome window first.
    return
}

running := !running

while (running)
{
    ; Move to 944,806 and double-click
    MouseMove, 944, 806, 0
    Sleep, 150
    MouseMove, 945, 806, 0
    Click
    Sleep, 100
    Click
    Sleep, 100

    ; Move to 1092,607 and click
    MouseMove, 1092, 607, 0
    Sleep, 150
    MouseMove, 1093, 607, 0
    Click
    Sleep, 100

    ; Move to 62,446 and click
    MouseMove, 62, 446, 0
    Sleep, 150
    MouseMove, 63, 446, 0
    Sleep, 100
    Click

    ; Final sleep before restarting loop
    Sleep, finalSleep
}
return

F4::
Gui, +LastFound +OwnDialogs +AlwaysOnTop
InputBox, newSleep, Adjust Final Sleep, Enter final sleep time in milliseconds:, , 280, 140,,,,, %finalSleep%
if ErrorLevel
    return

if newSleep is not integer
{
    MsgBox, 48, Invalid Input, Please enter a whole number.
    return
}

if (newSleep < 0)
{
    MsgBox, 48, Invalid Input, Please enter 0 or higher.
    return
}

oldSleep := finalSleep
finalSleep := newSleep

FileRead, scriptText, %A_ScriptFullPath%
if ErrorLevel
{
    MsgBox, 16, Error, Could not read the script file.
    finalSleep := oldSleep
    return
}

scriptText := RegExReplace(scriptText
    , "m)^finalSleep := \K\d+"
    , finalSleep
    , replaceCount
    , 1)

if (replaceCount = 0)
{
    MsgBox, 16, Error, Could not find finalSleep := line in the script.
    finalSleep := oldSleep
    return
}

FileDelete, %A_ScriptFullPath%
FileAppend, %scriptText%, %A_ScriptFullPath%
if ErrorLevel
{
    MsgBox, 16, Error, Could not save the updated script.
    finalSleep := oldSleep
    return
}

ToolTip, Final sleep updated to %finalSleep% ms
SetTimer, RemoveToolTip, -1500
Reload
return

RemoveToolTip:
ToolTip
return

GuiClose:
ExitApp

Esc::ExitApp