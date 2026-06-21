#Requires AutoHotkey v2.0
#SingleInstance Force

CoordMode "Mouse", "Screen"
CoordMode "Pixel", "Screen"
CoordMode "ToolTip", "Screen"

global Running := false
global Paused := false
global IntroGui := ""

global StopButtonColor := 0xD96B2B
global StopButtonVariation := 35

global StopAreaX1 := 964
global StopAreaY1 := 751
global StopAreaX2 := 1123
global StopAreaY2 := 797

ShowStartupGui()

F2:: {
    global Running, Paused

    Running := !Running

    if Running {
        Paused := false
        ToolTip "Macro started"
        SetTimer () => ToolTip(), -800
        SetTimer RunMacro, -1
    } else {
        ToolTip "Macro stopped"
        SetTimer () => ToolTip(), -800
    }
}

F6:: {
    global Paused, Running
    if !Running
        return

    Paused := !Paused
    ToolTip Paused ? "Paused" : "Resumed"
    SetTimer () => ToolTip(), -800
}

F8::ExitApp
Esc::ExitApp

ShowStartupGui() {
    global IntroGui

    if IsObject(IntroGui) {
        try IntroGui.Destroy()
    }

    IntroGui := Gui(, "Dire's scrap reroll macro")
    IntroGui.Opt("+AlwaysOnTop")
    IntroGui.BackColor := "2B0A3D"

    IntroGui.SetFont("s11 cFFFFFF", "Segoe UI")
    IntroGui.AddText("xm ym w420",
        "Welcome to Dire's scrap reroll macro!"
        . "`n`nSet target mutation to eclipse and turn off `"Roll Until exactly target`""
        . "`nSet `"Show up to`" to Fiery"
        . "`n`nF2 to start / stop"
        . "`nF6 to pause"
        . "`nF8/Esc to Exit app"
    )

    IntroGui.SetFont("s10 cFFFFFF", "Segoe UI")
    btnContinue := IntroGui.AddButton("xm y+20 w100", "Continue")
    btnExit := IntroGui.AddButton("x+10 w100", "Exit")

    btnContinue.OnEvent("Click", CloseIntroGui)
    btnExit.OnEvent("Click", (*) => ExitApp())
    IntroGui.OnEvent("Close", (*) => ExitApp())

    IntroGui.Show("AutoSize Center")
}

CloseIntroGui(*) {
    global IntroGui
    IntroGui.Destroy()
}

RunMacro() {
    global Running
    global StopButtonColor, StopButtonVariation
    global StopAreaX1, StopAreaY1, StopAreaX2, StopAreaY2

    Loop {
        if !Running
            break

        WaitIfPaused()
        if !Running
            break

        ; item select
        MouseMove 674, 430, 0
        Sleep 100
        MouseMove 675, 430, 0
        Sleep 100
        Click
        Sleep 250

        if !Running
            break

        WaitIfPaused()
        if !Running
            break

        ; reroll button
        MouseMove 1154, 720, 0
        Sleep 100
        MouseMove 1155, 720, 0
        Sleep 100
        Click
        Sleep 1000

        if !Running
            break

        while Running && PixelSearch(&foundX, &foundY, StopAreaX1, StopAreaY1, StopAreaX2, StopAreaY2, StopButtonColor, StopButtonVariation) {
            WaitIfPaused()
            if !Running
                break
            ToolTip "Stop button found - waiting..."
            Sleep 800
        }

        if !Running
            break

        ToolTip "Stop button gone - restarting..."
        Sleep 500
    }

    Running := false
}

WaitIfPaused() {
    global Paused, Running
    while Paused && Running
        Sleep 100
}