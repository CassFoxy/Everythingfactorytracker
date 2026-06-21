#Requires AutoHotkey v2.0

CoordMode "Mouse", "Screen"
CoordMode "Pixel", "Screen"
CoordMode "ToolTip", "Screen"

; ==================================================
; Script State
; ==================================================
global running := false
global paused := false
global searchBoxVisible := false
global indexSearchBoxVisible := false
global SearchBoxGui := 0
global IndexSearchBoxGui := 0
global modeChoice := "Perma"

global startupDone := false
global modeDone := false
global instructionsGui := 0
global modeGui := 0
global didZoomSetup := false

; ==================================================
; Player Adjustable Settings
; Press F5 to edit and save walk timings into the script
; ==================================================
global walkToConveyorMs := 2400
global walkToConveyorStartMs := 800

; ==================================================
; Wait / Timeout Settings
; ==================================================
global permaPixelTimeoutMs := 30000
global nonPermaPixelTimeoutMs := 30000
global dingTimeoutMs := 900000
global pixelDisappearTimeoutMs := 8000

; ==================================================
; GOLD Item Pixel Search
; ==================================================
global x1 := 920
global y1 := 265
global x2 := 1004
global y2 := 315
global targetColor := 0xFFE79A
global variation := 5

; ==================================================
; INDEX Item Pixel Search
; Same perma pattern as regular perma, using index color
; ==================================================
global indexX1 := 920
global indexY1 := 265
global indexX2 := 1004
global indexY2 := 315
global indexTargetColor := 0x806BAC
global indexVariation := 5

; ==================================================
; Audio / Ding Detection
; ==================================================
global dingHeard := false
global waitingForDing := false
global AudioMeter := 0
global TriggerThreshold := 0.08
global AudioPollMs := 35
global DingCooldownMs := 1200
global LastDingTick := 0

AudioMeter := SoundGetInterface("{C02216F6-8C67-4B5B-9D00-D008E73E0064}")
if !AudioMeter {
    MsgBox "Unable to get audio meter."
    ExitApp
}

ShowInstructionsGui()
ShowModeGui()

; ==================================================
; Hotkeys
; ==================================================
F2::StartOrStop()
F4::ReloadScript()
F5::EditWalkTimings()
F6::TogglePause()
F7::ToggleSearchBox()
F8::ToggleIndexSearchBox()
F9::TestPeak()
Esc::ExitApp

; ==================================================
; General Helpers
; ==================================================
ReloadScript() {
    ToolTip "Reloading script...", 20, 80
    Sleep 150
    Reload
}

EditWalkTimings() {
    global walkToConveyorMs, walkToConveyorStartMs

    result1 := InputBox(
        "Enter Walk To Conveyor time in milliseconds.",
        "Edit Walk To Conveyor",
        "w320 h140",
        walkToConveyorMs
    )
    if (result1.Result != "OK")
        return

    newWalkToConveyor := Trim(result1.Value)
    if !RegExMatch(newWalkToConveyor, "^\d+$") {
        MsgBox "Walk To Conveyor must be a whole number in milliseconds."
        return
    }

    result2 := InputBox(
        "Enter Walk To Conveyor Start time in milliseconds.",
        "Edit Walk To Conveyor Start",
        "w320 h140",
        walkToConveyorStartMs
    )
    if (result2.Result != "OK")
        return

    newWalkToConveyorStart := Trim(result2.Value)
    if !RegExMatch(newWalkToConveyorStart, "^\d+$") {
        MsgBox "Walk To Conveyor Start must be a whole number in milliseconds."
        return
    }

    scriptText := FileRead(A_ScriptFullPath)

    scriptText := RegExReplace(
        scriptText,
        "m)^global walkToConveyorMs := \d+\R?",
        "global walkToConveyorMs := " newWalkToConveyor "`r`n"
    )

    scriptText := RegExReplace(
        scriptText,
        "m)^global walkToConveyorStartMs := \d+\R?",
        "global walkToConveyorStartMs := " newWalkToConveyorStart "`r`n"
    )

    FileDelete A_ScriptFullPath
    FileAppend scriptText, A_ScriptFullPath

    MsgBox "Walk timings saved.`n`nWalk To Conveyor: " newWalkToConveyor " ms`nWalk To Conveyor Start: " newWalkToConveyorStart " ms`n`nThe script will now reload."
    Reload
}

DoZoomCenterSetup() {
    Send "{i down}"
    Sleep 1500
    Send "{i up}"

    Sleep 100

    Send "{o down}"
    Sleep 650
    Send "{o up}"
}

; ==================================================
; GUI
; ==================================================
ShowInstructionsGui() {
    global startupDone, instructionsGui
    startupDone := false

    titleText := "Welcome to Dire's Gold Item Macro!"

    bodyText := "Setup / Prerequisites:`n`n"
        . "Make sure Roblox is open before starting.`n"
        . "For perma items please relog and press F2 on return to auto position search box..`n"
        . "Press F7 to show the gold target box.`n"
        . "For non perma items simply walk to conveyor and line the search box up with the word GOLD.`n"
	. "Press F8 to show the index target box.`n"
	. "Same as non perma items, walk to conveyor and line the box up with the !.`n"
        . "Modes:`n"
        . "- Perma Items = full movement cycle, gold color`n"
        . "- Non Perma Items = gold pixel search only`n"
        . "- Gold Ding = hear ding, then search for first gold item and buy it`n"
        . "- Index Items = full movement cycle using index color`n`n"
        . "Controls:`n`n"
        . "F2 = Start/Stop script`n"
        . "F4 = Reload script`n"
        . "F5 = Edit walk timings and save to script`n"
        . "F6 = Pause/Unpause`n"
        . "F7 = Toggle gold search box overlay`n"
        . "F8 = Toggle index search box overlay`n"
        . "F9 = Show current peak`n"
        . "Esc = Exit script`n`n"
        . "Press Continue to continue to mode selection."

    instructionsGui := Gui("+AlwaysOnTop", "Script Instructions")
    instructionsGui.BackColor := "2B1140"

    instructionsGui.SetFont("s16 cFFFFFF w700", "Segoe UI")
    instructionsGui.Add("Text", "x20 y18 w540 h30 BackgroundTrans Center", titleText)

    instructionsGui.SetFont("s10 cFFFFFF", "Segoe UI")
    instructionsGui.Add("Text", "x20 y60 w540 h455 BackgroundTrans", bodyText)

    btnContinue := instructionsGui.Add("Button", "x230 y520 w120 h34 Default", "Continue")
    btnContinue.OnEvent("Click", InstructionsContinue)
    instructionsGui.OnEvent("Close", InstructionsContinue)

    instructionsGui.Show("w580 h575 Center")

    while !startupDone
        Sleep 50
}

InstructionsContinue(*) {
    global startupDone, instructionsGui
    startupDone := true
    try instructionsGui.Destroy()
}

ShowModeGui() {
    global modeChoice, modeDone, modeGui
    modeDone := false

    modeGui := Gui("+AlwaysOnTop", "Choose Mode")
    modeGui.BackColor := "2B1140"

    modeGui.SetFont("s16 cFFFFFF w700", "Segoe UI")
    modeGui.Add("Text", "x20 y20 w400 h30 BackgroundTrans Center", "Choose Mode")

    modeGui.SetFont("s10 cFFFFFF", "Segoe UI")
    modeGui.Add("Text", "x25 y60 w390 h50 BackgroundTrans Center"
        , "Select which mode you want loaded.`nThe script will wait for F2 after this.")

    btnPerma := modeGui.Add("Button", "x30  y130 w170 h40 Default", "Perma Items")
    btnNonPerma := modeGui.Add("Button", "x220 y130 w170 h40", "Non Perma Items")
    btnGoldDing := modeGui.Add("Button", "x30  y185 w170 h40", "Gold Ding")
    btnIndexItems := modeGui.Add("Button", "x220 y185 w170 h40", "Index Items")

    btnPerma.OnEvent("Click", ModePerma)
    btnNonPerma.OnEvent("Click", ModeNonPerma)
    btnGoldDing.OnEvent("Click", ModeGoldDing)
    btnIndexItems.OnEvent("Click", ModeIndexItems)
    modeGui.OnEvent("Close", ModePerma)

    modeGui.Show("w420 h255 Center")

    while !modeDone
        Sleep 50
}

ModePerma(*) {
    global modeChoice, modeDone, modeGui
    modeChoice := "Perma"
    modeDone := true
    try modeGui.Destroy()
}

ModeNonPerma(*) {
    global modeChoice, modeDone, modeGui
    modeChoice := "NonPerma"
    modeDone := true
    try modeGui.Destroy()
}

ModeGoldDing(*) {
    global modeChoice, modeDone, modeGui
    modeChoice := "GoldDing"
    modeDone := true
    try modeGui.Destroy()
}

ModeIndexItems(*) {
    global modeChoice, modeDone, modeGui
    modeChoice := "IndexItems"
    modeDone := true
    try modeGui.Destroy()
}

; ==================================================
; Main Start / Stop
; ==================================================
StartOrStop() {
    global running, paused, dingHeard, waitingForDing, AudioPollMs, didZoomSetup

    if running {
        running := false
        paused := false
        dingHeard := false
        waitingForDing := false
        didZoomSetup := false
        SetTimer CheckAudioPeak, 0
        ToolTip "Script stopped", 20, 20
        SetTimer () => ToolTip(), -800
        return
    }

    running := true
    paused := false
    dingHeard := false
    waitingForDing := false
    didZoomSetup := false

    if WinExist("ahk_exe RobloxPlayerBeta.exe") {
        WinActivate "ahk_exe RobloxPlayerBeta.exe"
        WinWaitActive "ahk_exe RobloxPlayerBeta.exe",, 2
    }

    SetTimer CheckAudioPeak, AudioPollMs
    SetTimer MainLoop, -10
}

TogglePause() {
    global paused, running
    if running
        paused := !paused
}

; ==================================================
; Search Box Overlays
; ==================================================
ToggleSearchBox() {
    global searchBoxVisible
    searchBoxVisible := !searchBoxVisible

    if searchBoxVisible
        ShowSearchBox()
    else
        HideSearchBox()
}

ToggleIndexSearchBox() {
    global indexSearchBoxVisible
    indexSearchBoxVisible := !indexSearchBoxVisible

    if indexSearchBoxVisible
        ShowIndexSearchBox()
    else
        HideIndexSearchBox()
}

ShowSearchBox() {
    global x1, y1, x2, y2, SearchBoxGui
    ShowBox(&SearchBoxGui, x1, y1, x2, y2)
}

HideSearchBox() {
    global SearchBoxGui
    if IsObject(SearchBoxGui)
        SearchBoxGui.Hide()
}

ShowIndexSearchBox() {
    global indexX1, indexY1, indexX2, indexY2, IndexSearchBoxGui
    ShowBox(&IndexSearchBoxGui, indexX1, indexY1, indexX2, indexY2)
}

HideIndexSearchBox() {
    global IndexSearchBoxGui
    if IsObject(IndexSearchBoxGui)
        IndexSearchBoxGui.Hide()
}

ShowBox(&boxGui, x1, y1, x2, y2) {
    w := x2 - x1
    h := y2 - y1
    t := 2

    if (w < 1 || h < 1) {
        MsgBox "Invalid search box size."
        return
    }

    if IsObject(boxGui)
        boxGui.Destroy()

    boxGui := Gui("+AlwaysOnTop -Caption +ToolWindow +E0x20")
    boxGui.BackColor := "Lime"

    boxGui.Add("Progress", "x0 y0 w" w " h" t " BackgroundRed")
    boxGui.Add("Progress", "x0 y0 w" t " h" h " BackgroundRed")
    boxGui.Add("Progress", "x0 y" (h - t) " w" w " h" t " BackgroundRed")
    boxGui.Add("Progress", "x" (w - t) " y0 w" t " h" h " BackgroundRed")

    boxGui.Show("x" x1 " y" y1 " w" w " h" h " NoActivate")
    WinSetTransColor "Lime", boxGui.Hwnd
}

; ==================================================
; Audio / Ding Functions
; ==================================================
TestPeak() {
    peak := GetPeak()
    ToolTip "Peak: " Round(peak, 4), 20, 20
    SetTimer () => ToolTip(), -1000
}

CheckAudioPeak() {
    global running, paused, waitingForDing, dingHeard
    global TriggerThreshold, DingCooldownMs, LastDingTick

    if !running
        return
    if paused
        return
    if !waitingForDing
        return

    peak := GetPeak()
    if (peak >= TriggerThreshold) {
        now := A_TickCount
        if (now - LastDingTick >= DingCooldownMs) {
            LastDingTick := now
            dingHeard := true
            ShowDingHeard()
        }
    }
}

GetPeak() {
    global AudioMeter
    peak := 0.0
    ComCall 3, AudioMeter, "float*", &peak
    return peak
}

ShowDingHeard() {
    ToolTip "DING HEARD", 20, 50
    SetTimer ClearDingTooltip, -900
}

ClearDingTooltip() {
    ToolTip
}

WaitForDing(timeoutMs := 0) {
    global running, paused, dingHeard, waitingForDing
    startTime := A_TickCount
    dingHeard := false
    waitingForDing := true

    Loop {
        WaitWhilePaused()
        if !running {
            waitingForDing := false
            return false
        }

        if dingHeard {
            dingHeard := false
            waitingForDing := false
            return true
        }

        if (timeoutMs > 0 && (A_TickCount - startTime >= timeoutMs)) {
            waitingForDing := false
            return false
        }

        Sleep 25
    }
}

; ==================================================
; Mode Routing
; ==================================================
MainLoop() {
    global modeChoice
    global x1, y1, x2, y2, targetColor, variation
    global indexX1, indexY1, indexX2, indexY2, indexTargetColor, indexVariation

    switch modeChoice {
        case "Perma":
            RunPermaPattern(x1, y1, x2, y2, targetColor, variation, false, false, false)
        case "GoldDing":
            RunPermaPattern(x1, y1, x2, y2, targetColor, variation, false, false, true)
        case "NonPerma":
            RunNonPermaMode()
        case "IndexItems":
            RunPermaPattern(indexX1, indexY1, indexX2, indexY2, indexTargetColor, indexVariation, false, true, false)
    }
}

; ==================================================
; Perma Pattern
; Used by:
; - Perma Items
; - Gold Ding
; - Index Items
; ==================================================
RunPermaPattern(searchX1, searchY1, searchX2, searchY2, searchColor, searchVariation := 5
    , requireDingBeforeE := false, waitForDisappearAfterE := false, waitForDingBeforeSearch := false) {
    global running, didZoomSetup
    global walkToConveyorMs, walkToConveyorStartMs
    global permaPixelTimeoutMs, pixelDisappearTimeoutMs, dingTimeoutMs

    while running {
        restartCycle := false

        WaitWhilePaused()
        if !running
            break

        if !didZoomSetup {
            DoZoomCenterSetup()
            didZoomSetup := true
        }

        ; =========================
        ; Rebirth Loop
        ; =========================
        MouseMove 950, 800, 0
        Sleep 500
        MouseMove 951, 800, 0
        Sleep 500
        Click
        Sleep 500

        WaitWhilePaused()
        if !running
            break

        MouseMove 544, 426, 0
        Sleep 500
        MouseMove 545, 426, 0
        Sleep 500
        Loop 4 {
            Click
            Sleep 300
            WaitWhilePaused()
            if !running
                break
        }
        if !running
            break

        WaitWhilePaused()
        if !running
            break

        MouseMove 950, 800, 0
        Sleep 500
        MouseMove 951, 800, 0
        Sleep 500
        Click
        Sleep 100

        WaitWhilePaused()
        if !running
            break

        MouseMove 1055, 630, 0
        Sleep 500
        MouseMove 1055, 631, 0
        Sleep 500
        Click
        Sleep 100

        WaitWhilePaused()
        if !running
            break

        MouseMove 179, 443, 0
        Sleep 50
        MouseMove 180, 443, 0
        Sleep 50
        Click
        Sleep 100
        MouseMove 950, 110, 0
        MouseMove 950, 111, 0

        WaitWhilePaused()
        if !running
            break

        ; =========================
        ; Walk To Conveyor
        ; =========================
        Sleep 1500
        Send "{w down}"
        Sleep walkToConveyorMs
        Send "{w up}"

        ; =========================
        ; Walk To Conveyor Start
        ; =========================
        Sleep 1500
        Send "{a down}"
        Sleep walkToConveyorStartMs
        Send "{a up}"

        WaitWhilePaused()
        if !running
            break

        Sleep 5000

        WaitWhilePaused()
        if !running
            break

        Loop 4 {
            if waitForDingBeforeSearch {
                heard := WaitForDing(dingTimeoutMs)
                if !running
                    break

                if !heard {
                    restartCycle := true
                    break
                }
            }

            found := WaitForPixelThenPressE(
                searchX1, searchY1, searchX2, searchY2,
                searchColor, searchVariation, permaPixelTimeoutMs, requireDingBeforeE
            )
            if !running
                break

            if !found {
                restartCycle := true
                break
            }

            if waitForDisappearAfterE {
                WaitForPixelToDisappear(
                    searchX1, searchY1, searchX2, searchY2,
                    searchColor, searchVariation, pixelDisappearTimeoutMs
                )
                if !running
                    break
            }

            Sleep 500
            WaitWhilePaused()
            if !running
                break
        }
        if !running
            break

        if restartCycle
            continue

        WaitWhilePaused()
        if !running
            break

        MouseMove 73, 455, 0
        Sleep 50
        MouseMove 74, 455, 0
        Sleep 50
        Click
        Sleep 100
    }
}

; ==================================================
; Non Perma Mode
; ==================================================
RunNonPermaMode() {
    global running
    global x1, y1, x2, y2, targetColor, variation
    global nonPermaPixelTimeoutMs

    while running {
        WaitWhilePaused()
        if !running
            break

        found := WaitForPixelThenPressE(x1, y1, x2, y2, targetColor, variation, nonPermaPixelTimeoutMs, false)
        if !running
            break

        if !found
            Sleep 50

        Sleep 100
    }
}

; ==================================================
; Pixel Search + Press E
; requireDingBeforeE kept for flexibility
; Gold Ding now waits for ding BEFORE search, not before E
; ==================================================
WaitForPixelThenPressE(x1, y1, x2, y2, targetColor, variation := 5, timeoutMs := 0, requireDingBeforeE := false) {
    global running, dingTimeoutMs
    startTime := A_TickCount

    Loop {
        WaitWhilePaused()
        if !running
            return false

        if PixelSearch(&px, &py, x1, y1, x2, y2, targetColor, variation) {
            Sleep 350

            if requireDingBeforeE {
                heard := WaitForDing(dingTimeoutMs)
                if !heard || !running
                    return false
            }

            Send "e"
            Sleep 350
            return true
        }

        if (timeoutMs > 0 && (A_TickCount - startTime >= timeoutMs))
            return false

        Sleep 50
    }
}

; ==================================================
; Wait For Pixel To Disappear
; Helps Index Items avoid pressing E repeatedly on same item
; ==================================================
WaitForPixelToDisappear(x1, y1, x2, y2, targetColor, variation := 5, timeoutMs := 3000) {
    global running
    startTime := A_TickCount

    Loop {
        WaitWhilePaused()
        if !running
            return false

        if !PixelSearch(&px, &py, x1, y1, x2, y2, targetColor, variation)
            return true

        if (timeoutMs > 0 && (A_TickCount - startTime >= timeoutMs))
            return false

        Sleep 50
    }
}

; ==================================================
; Pause Helper
; ==================================================
WaitWhilePaused() {
    global paused, running
    while (paused && running)
        Sleep 100
}