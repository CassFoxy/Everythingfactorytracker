#Requires AutoHotkey v2.0
#SingleInstance Force

; ==================================================
; GLOBAL STATE
; ==================================================

global ScriptDir := RegExReplace(A_ScriptFullPath, "\\[^\\]+$")
global Running := false
global Paused := false
global IntroGui := ""
global SettingsGui := ""

global ItemListView := ""
global ItemNameEdit := ""
global GoldItemCheck := ""
global MutationChecks := []
global SelectedItemName := ""
global btnToggleAll := ""

global DebugGoldSearch := true

; ==================================================
; ITEM CONFIGURATION
; ==================================================

global ItemConfigs := Map()

global MutationNames := [
    "Polished",
    "Bubbly",
    "Pearly",
    "Frosted",
    "Glowing",
    "Sparkly",
    "Surged",
    "Fiery",
    "Eclipsed",
    "Glitched",
    "Corrupted",
    "Akashic"
]

global ShowUpToTargets := [
    [642, 415],  ; 1 = Polished
    [693, 411],  ; 2 = Bubbly
    [750, 414],  ; 3 = Pearly
    [811, 411],  ; 4 = Frosted
    [868, 409],  ; 5 = Glowing
    [924, 407],  ; 6 = Sparkly
    [981, 410],  ; 7 = Surged
    [1039, 413], ; 8 = Fiery
    [1093, 412], ; 9 = Eclipsed
    [1153, 410], ; 10 = Glitched
    [1216, 411]  ; 11 = Corrupted
]

global MutationTargets := [
    [641, 581],
    [694, 570],
    [752, 575],
    [805, 579],
    [863, 575],
    [919, 581],
    [982, 585],
    [1043, 583],
    [1099, 578],
    [1155, 580],
    [1213, 580],
    [1266, 583]
]

; ==================================================
; SCREEN / SEARCH SETTINGS
; ==================================================

CoordMode "Mouse", "Screen"
CoordMode "Pixel", "Screen"
CoordMode "ToolTip", "Screen"

global StopButtonColor := 0xD96B2B
global StopButtonVariation := 35

global Pos := Map(
    "SettingsBtn", [1307, 338],
    "ExitBtn",     [1300, 231],
    "SearchBar",   [457, 889],
    "ItemEntry",   [677, 425],
    "RerollBtn",   [1122, 680]
)

global StopImageArea := Map(
    "X1", 964,
    "Y1", 751,
    "X2", 1123,
    "Y2", 797
)

global SearchX1 := 401
global SearchY1 := 386
global SearchX2 := 926
global SearchY2 := 404

global GoldTileColor := 0xF09704
global FirstTileColor := 0x91BEFE
global ColorVariation := 10
global GoldSearchVariation := 35
global StepY := 2

; ==================================================
; STARTUP
; ==================================================

ShowIntroGui()

; ==================================================
; HOTKEYS
; ==================================================

F2::ToggleRun()
F3::ShowSettingsGui(false)
F6::TogglePause()
F8::ExitApp()
Esc::ExitApp()

; ==================================================
; INTRO GUI
; ==================================================

ShowIntroGui() {
    global IntroGui

    if IsObject(IntroGui) {
        try IntroGui.Destroy()
    }

    IntroGui := Gui(, "Autoroll Macro")
    IntroGui.Opt("+AlwaysOnTop")
    IntroGui.BackColor := "2A103D"
    IntroGui.SetFont("s10", "Segoe UI")

    IntroGui.AddText(
        "xm ym w430 cFFFFFF",
        "Welcome to the autoroll macro! Designed by Dire"
        . "`n`nThis version automatically sets Show Up To before each reroll."
        . "`n`nIf you wish to roll gold items, please check the gold item box before saving item."
        . "`n`nPlease set the game to fullscreen windowed, not F11 fullscreen."
    )

    IntroGui.AddText(
        "xm y+16 w430 cFFFFFF",
        "Hotkeys:"
        . "`nF2 = Start / Stop macro"
        . "`nF3 = Open settings"
        . "`nF6 = Pause / Resume"
        . "`nF8 = Exit script"
        . "`nEsc = Exit script"
    )

    btnContinue := IntroGui.AddButton("xm y+18 w100", "Continue")
    btnExit := IntroGui.AddButton("x+10 w100", "Exit")

    btnContinue.OnEvent("Click", ContinueToSettings)
    btnExit.OnEvent("Click", (*) => ExitApp())
    IntroGui.OnEvent("Close", (*) => ExitApp())

    IntroGui.Show("AutoSize Center")

    ContinueToSettings(*) {
        global IntroGui
        IntroGui.Destroy()
        ShowSettingsGui(true)
    }
}

; ==================================================
; SETTINGS GUI
; ==================================================

ShowSettingsGui(firstOpen := false) {
    global SettingsGui, ItemListView, ItemNameEdit, GoldItemCheck, MutationChecks
    global MutationNames, SelectedItemName, btnToggleAll

    if IsObject(SettingsGui) {
        try SettingsGui.Destroy()
    }

    SettingsGui := Gui(, "Everything Factory Reroll")
    SettingsGui.Opt("+AlwaysOnTop")
    SettingsGui.BackColor := "2A103D"
    SettingsGui.SetFont("s10", "Segoe UI")

    SettingsGui.AddText("xm ym cFFFFFF", "Items")

    ItemListView := SettingsGui.AddListView("xm y+5 w220 h220 -Multi", ["Item Name"])
    ItemListView.OnEvent("ItemSelect", OnItemSelected)

    SettingsGui.AddText("x+20 yp-20 cFFFFFF", "Selected item name:")
    ItemNameEdit := SettingsGui.AddEdit("x+0 y+5 w220", "")

    SettingsGui.AddText("x250 y70 cFFFFFF", "Gold item:")
    GoldItemCheck := SettingsGui.Add("CheckBox", "x+10 yp-2 w120 cFFFFFF", "")

    SettingsGui.AddText("x280 y100 cFFFFFF", "Target mutations for selected item:")

    MutationChecks := []
    mutationStartX := 280
    mutationStartY := 130
    colWidth := 150
    rowHeight := 28

    Loop MutationNames.Length {
        idx := A_Index
        col := Mod(idx - 1, 2)
        row := Floor((idx - 1) / 2)

        x := mutationStartX + (col * colWidth)
        y := mutationStartY + (row * rowHeight)

        cb := SettingsGui.Add("Checkbox", "x" x " y" y " w130 Checked cFFFFFF", MutationNames[idx])
        MutationChecks.Push(cb)
    }

    btnToggleAll := SettingsGui.AddButton("x280 y+12 w140", "Deselect All")

    btnAdd := SettingsGui.AddButton("xm y+16 w100 Default", "Add Item")
    btnRemove := SettingsGui.AddButton("x+10 w100", "Remove Item")
    btnSaveItem := SettingsGui.AddButton("x+20 w120", "Save Item")
    btnSaveAll := SettingsGui.AddButton("xm y+16 w100", "Save All")

    SettingsGui.AddText(
        "x+20 yp w260 cFFFFFF",
        "Hotkeys:"
        . "`nF2 = Start / Stop macro"
        . "`nF3 = Reopen settings"
        . "`nF6 = Pause / Resume"
        . "`nF8 = Exit script"
        . "`nEsc = Exit script"
    )

    btnToggleAll.OnEvent("Click", ToggleAllMutations)
    btnAdd.OnEvent("Click", AddItem)
    btnRemove.OnEvent("Click", RemoveItem)
    btnSaveItem.OnEvent("Click", SaveSelectedItem)
    btnSaveAll.OnEvent("Click", SaveAllAndClose)
    SettingsGui.OnEvent("Close", GuiClosed)

    RefreshItemList()

    if (SelectedItemName = "" && ItemConfigs.Count > 0) {
        for itemName, _ in ItemConfigs {
            SelectedItemName := itemName
            break
        }
    }

    if (SelectedItemName != "")
        LoadSelectedItemIntoEditor(SelectedItemName)

    UpdateToggleAllButtonText()
    SettingsGui.Show("AutoSize Center")

    if firstOpen {
        ToolTip "Add items, choose mutations for each item, then press Save All"
        SetTimer () => ToolTip(), -2600
    }

    ToggleAllMutations(*) {
        global MutationChecks
        allChecked := true

        for _, cb in MutationChecks {
            if !cb.Value {
                allChecked := false
                break
            }
        }

        newValue := allChecked ? 0 : 1

        for _, cb in MutationChecks
            cb.Value := newValue

        UpdateToggleAllButtonText()
    }

    UpdateToggleAllButtonText() {
        global MutationChecks, btnToggleAll

        allChecked := true
        for _, cb in MutationChecks {
            if !cb.Value {
                allChecked := false
                break
            }
        }

        if IsObject(btnToggleAll)
            btnToggleAll.Text := allChecked ? "Deselect All" : "Select All"
    }

    AddItem(*) {
        global ItemNameEdit, SelectedItemName, MutationChecks, GoldItemCheck

        newName := Trim(ItemNameEdit.Value)
        if (newName = "") {
            MsgBox "Enter an item name first."
            return
        }

        SelectedItemName := newName

        for _, cb in MutationChecks
            cb.Value := 1

        GoldItemCheck.Value := 0

        if !SaveCurrentEditorToConfig()
            return

        RefreshItemList()
        UpdateToggleAllButtonText()
        ItemNameEdit.Value := ""
        GoldItemCheck.Value := 0
        ItemNameEdit.Focus()
    }

    RemoveItem(*) {
        global ItemConfigs, SelectedItemName, ItemListView, ItemNameEdit, MutationChecks, GoldItemCheck

        row := ItemListView.GetNext()
        if !row {
            MsgBox "Select an item to remove."
            return
        }

        itemName := ItemListView.GetText(row, 1)
        if (itemName = "") {
            MsgBox "Could not determine the selected item."
            return
        }

        if ItemConfigs.Has(itemName)
            ItemConfigs.Delete(itemName)

        ItemListView.Delete(row)

        SelectedItemName := ""
        ItemNameEdit.Value := ""
        GoldItemCheck.Value := 0

        for _, cb in MutationChecks
            cb.Value := 0

        if (ItemConfigs.Count > 0) {
            RefreshItemList()
            firstRow := ItemListView.GetNext()
            if !firstRow
                firstRow := 1

            if (firstRow) {
                nextName := ItemListView.GetText(firstRow, 1)
                if (nextName != "") {
                    SelectedItemName := nextName
                    ItemListView.Modify(firstRow, "+Select +Focus")
                    LoadSelectedItemIntoEditor(nextName)
                }
            }
        } else {
            RefreshItemList()
        }

        UpdateToggleAllButtonText()
    }

    SaveSelectedItem(*) {
        SaveCurrentEditorToConfig()
        UpdateToggleAllButtonText()
    }

    SaveAllAndClose(*) {
        global SettingsGui, ItemConfigs

        if !SaveCurrentEditorToConfig()
            return

        if (ItemConfigs.Count = 0) {
            MsgBox "Add at least one item."
            return
        }

        if !AnyItemHasMutations() {
            MsgBox "At least one item must have at least one mutation selected."
            return
        }

        ToolTip "Settings saved"
        SetTimer () => ToolTip(), -1000
        SettingsGui.Opt("-AlwaysOnTop")
        SettingsGui.Hide()
    }

    GuiClosed(*) {
        global SettingsGui
        SettingsGui.Opt("-AlwaysOnTop")
        SettingsGui.Hide()
    }

    OnItemSelected(ctrl, row, selected) {
        global ItemListView, SelectedItemName

        if !selected
            return

        if !SaveCurrentEditorToConfig(false)
            return

        itemName := ItemListView.GetText(row, 1)
        SelectedItemName := itemName
        LoadSelectedItemIntoEditor(itemName)
        UpdateToggleAllButtonText()
    }
}

; ==================================================
; ITEM CONFIG HELPERS
; ==================================================

RefreshItemList() {
    global ItemListView, ItemConfigs, SelectedItemName

    if !IsObject(ItemListView)
        return

    ItemListView.Delete()

    selectedRow := 0
    rowIndex := 0

    for itemName, config in ItemConfigs {
        rowIndex += 1
        ItemListView.Add(, itemName)
        if (itemName = SelectedItemName)
            selectedRow := rowIndex
    }

    if (selectedRow > 0)
        ItemListView.Modify(selectedRow, "+Select +Focus")
}

LoadSelectedItemIntoEditor(itemName) {
    global ItemConfigs, ItemNameEdit, GoldItemCheck, MutationChecks, MutationNames

    if !ItemConfigs.Has(itemName)
        return

    ItemNameEdit.Value := itemName
    GoldItemCheck.Value := ItemConfigs[itemName].Has("GoldItem") ? ItemConfigs[itemName]["GoldItem"] : 0
    selectedMutations := ItemConfigs[itemName]["Mutations"]

    Loop MutationChecks.Length {
        mutationName := MutationNames[A_Index]
        MutationChecks[A_Index].Value := ArrayHasValue(selectedMutations, mutationName) ? 1 : 0
    }
}

SaveCurrentEditorToConfig(showErrors := true) {
    global ItemConfigs, ItemNameEdit, GoldItemCheck, MutationChecks, MutationNames, SelectedItemName

    editorName := Trim(ItemNameEdit.Value)

    if (editorName = "")
        editorName := SelectedItemName

    if (editorName = "") {
        if showErrors
            MsgBox "Item name cannot be blank."
        return false
    }

    chosenMutations := []
    Loop MutationChecks.Length {
        if MutationChecks[A_Index].Value
            chosenMutations.Push(MutationNames[A_Index])
    }

    if (chosenMutations.Length = 0) {
        if showErrors
            MsgBox "Select at least one mutation for this item."
        return false
    }

    if (SelectedItemName != "" && SelectedItemName != editorName && ItemConfigs.Has(SelectedItemName))
        ItemConfigs.Delete(SelectedItemName)

    ItemConfigs[editorName] := Map(
        "Mutations", chosenMutations,
        "GoldItem", GoldItemCheck.Value
    )

    SelectedItemName := editorName
    RefreshItemList()
    return true
}

AnyItemHasMutations() {
    global ItemConfigs

    for _, config in ItemConfigs {
        if config["Mutations"].Length > 0
            return true
    }
    return false
}

ArrayHasValue(arr, value) {
    for _, v in arr {
        if (v = value)
            return true
    }
    return false
}

GetMutationIndexByName(name) {
    global MutationNames

    Loop MutationNames.Length {
        if (MutationNames[A_Index] = name)
            return A_Index
    }
    return 0
}

; ==================================================
; RUN CONTROL
; ==================================================

ToggleRun() {
    global Running, Paused, ItemConfigs

    if (ItemConfigs.Count = 0) {
        MsgBox "Set up at least one item first with F3."
        return
    }

    if !AnyItemHasMutations() {
        MsgBox "Each run needs at least one item with assigned mutations."
        return
    }

    Running := !Running

    if Running {
        Paused := false
        ToolTip "Macro started"
        SetTimer () => ToolTip(), -800
        SetTimer RunConfiguredItems, -1
    } else {
        ToolTip "Macro stopped"
        SetTimer () => ToolTip(), -800
    }
}

TogglePause() {
    global Paused, Running
    if !Running
        return

    Paused := !Paused
    ToolTip Paused ? "Paused" : "Resumed"
    SetTimer () => ToolTip(), -800
}

RunConfiguredItems() {
    global Running, ItemConfigs

    for itemName, config in ItemConfigs {
        if !Running
            break

        WaitIfPaused()
        RunItemWithConfiguredMutations(itemName, config)

        if !Running
            break
    }

    Running := false
    ToolTip "Finished configured items"
    SetTimer () => ToolTip(), -1200
}

RunItemWithConfiguredMutations(itemName, config) {
    global Running

    mutationList := config["Mutations"]
    goldItem := config.Has("GoldItem") ? config["GoldItem"] : 0

    i := mutationList.Length
    while (i >= 1) {
        if !Running
            break

        mutationName := mutationList[i]
        mutationIndex := GetMutationIndexByName(mutationName)

        if (mutationIndex > 0) {
            coords := MutationTargets[mutationIndex]
            RunSingleItemMutation(
                coords[1],
                coords[2],
                mutationName,
                itemName,
                goldItem,
                mutationIndex
            )
        }

        if !Running
            break

        i -= 1
    }
}

; ==================================================
; MAIN REROLL ROUTINE
; ==================================================

RunSingleItemMutation(targetX, targetY, mutationName, itemName, goldItem := 0, targetMutationIndex := 1) {
    global Pos, Running, ShowUpToTargets, MutationNames

    if !Running
        return

    MoveAndClick(Pos["SettingsBtn"][1], Pos["SettingsBtn"][2])

    showUpToIndex := targetMutationIndex - 1
    if (showUpToIndex < 1)
        showUpToIndex := 1
    if (showUpToIndex > ShowUpToTargets.Length)
        showUpToIndex := ShowUpToTargets.Length

    showCoords := ShowUpToTargets[showUpToIndex]
    showUpToName := MutationNames[showUpToIndex]

    ToolTip "Show Up To: " showUpToName
    SetTimer () => ToolTip(), -900

    Sleep 250
    MoveAndClick(showCoords[1], showCoords[2])

    Sleep 250
    Send "{WheelDown 8}"
    Sleep 400

    MoveAndClick(targetX, targetY)
    MoveAndClick(Pos["ExitBtn"][1], Pos["ExitBtn"][2])
    MoveAndClick(Pos["SearchBar"][1], Pos["SearchBar"][2])

    Sleep 150
    Send "^a"
    Sleep 120
    Send "{Backspace}"
    Sleep 180

    TypeSlow(itemName, 80)

    Sleep 300

    if goldItem {
        if FindItemByColor(GoldTileColor, &gx, &gy) {
            MoveAndClick(gx, gy)
        } else {
            ToolTip "Gold item not found, using default item entry: " itemName
            SetTimer () => ToolTip(), -1200
            MoveAndClick(Pos["ItemEntry"][1], Pos["ItemEntry"][2])
        }
    } else {
        if FindNonGoldBlueStarTile(&nx, &ny) {
            MoveAndClick(nx, ny)
        } else {
            ToolTip "Non-gold blue star tile not found, using default item entry: " itemName
            SetTimer () => ToolTip(), -1200
            MoveAndClick(Pos["ItemEntry"][1], Pos["ItemEntry"][2])
        }
    }

    MoveAndClick(Pos["RerollBtn"][1], Pos["RerollBtn"][2])

    ToolTip "Waiting for stop button to disappear: " mutationName " | " itemName
    SetTimer () => ToolTip(), -1500

    if WaitForStopButtonGone() {
        ToolTip "Done: " mutationName " | " itemName
        SetTimer () => ToolTip(), -1000
        Sleep 250
    }
}

; ==================================================
; STOP BUTTON WAIT
; ==================================================

WaitForStopButtonGone() {
    global Running, StopImageArea, StopButtonColor, StopButtonVariation

    Sleep 3000

    while Running {
        WaitIfPaused()

        stopButtonVisible := PixelSearch(
            &foundX,
            &foundY,
            StopImageArea["X1"],
            StopImageArea["Y1"],
            StopImageArea["X2"],
            StopImageArea["Y2"],
            StopButtonColor,
            StopButtonVariation
        )

        if stopButtonVisible {
            ToolTip "Stop button visible - waiting..."
            SetTimer () => ToolTip(), -900
            Sleep 800
            continue
        }

        return true
    }

    return false
}

; ==================================================
; ITEM TILE SEARCH
; ==================================================

FindItemByColor(searchColor, &outX := 0, &outY := 0) {
    global SearchX1, SearchY1, SearchX2, SearchY2, StepY, ColorVariation

    if (SearchX2 <= SearchX1 || SearchY2 <= SearchY1)
        return false

    midY := Floor((SearchY1 + SearchY2) / 2)

    if TrySearchRowForColor(midY, searchColor, &outX, &outY)
        return true

    offset := StepY
    while (offset <= (SearchY2 - SearchY1)) {
        yUp := midY - offset
        if (yUp >= SearchY1) {
            if TrySearchRowForColor(yUp, searchColor, &outX, &outY)
                return true
        }

        yDown := midY + offset
        if (yDown <= SearchY2) {
            if TrySearchRowForColor(yDown, searchColor, &outX, &outY)
                return true
        }

        offset += StepY
    }

    return false
}

TrySearchRowForColor(y, searchColor, &fx, &fy) {
    global SearchX1, SearchX2, ColorVariation

    try {
        found := PixelSearch(&fx, &fy, SearchX1, y, SearchX2, y, searchColor, ColorVariation)
        return found
    } catch {
        return false
    }
}

FindNonGoldBlueStarTile(&outX := 0, &outY := 0) {
    global SearchX1, SearchY1, SearchX2, SearchY2, StepY, DebugGoldSearch

    if (SearchX2 <= SearchX1 || SearchY2 <= SearchY1)
        return false

    midY := Floor((SearchY1 + SearchY2) / 2)

    if TrySearchRowForNonGoldBlueStar(midY, &outX, &outY)
        return true

    offset := StepY
    while (offset <= (SearchY2 - SearchY1)) {
        yUp := midY - offset
        if (yUp >= SearchY1) {
            if TrySearchRowForNonGoldBlueStar(yUp, &outX, &outY)
                return true
        }

        yDown := midY + offset
        if (yDown <= SearchY2) {
            if TrySearchRowForNonGoldBlueStar(yDown, &outX, &outY)
                return true
        }

        offset += StepY
    }

    if DebugGoldSearch
        ToolTip "GOLD DEBUG`nNo valid non-gold tile found"

    return false
}

TrySearchRowForNonGoldBlueStar(y, &fx, &fy) {
    global SearchX1, SearchX2, FirstTileColor, ColorVariation, DebugGoldSearch

    startX := SearchX1

    while (startX <= SearchX2) {
        try {
            foundBlue := PixelSearch(&px, &py, startX, y, SearchX2, y, FirstTileColor, ColorVariation)
        } catch {
            if DebugGoldSearch
                ToolTip "GOLD DEBUG`nBlue PixelSearch exception on row y=" y
            return false
        }

        if !foundBlue {
            if DebugGoldSearch
                ToolTip "GOLD DEBUG`nNo more blue stars on row y=" y
            return false
        }

        goldFound := IsGoldNearBlueStar(px, py, &gx, &gy)

        if DebugGoldSearch {
            ToolTip "GOLD DEBUG"
                . "`nBlue star: " px "," py
                . "`nGold search box: " (px + 26) "," (py - 8) " -> " (px + 90) "," (py + 14)
                . "`nGold found: " (goldFound ? "YES - SKIP" : "NO - SELECT")
                . (goldFound ? "`nGold pixel: " gx "," gy : "")
                . "`nNext search starts at x=" (px + 1)
        }

        Sleep 250

        if !goldFound {
            fx := px
            fy := py

            if DebugGoldSearch {
                ToolTip "GOLD DEBUG"
                    . "`nBlue star: " px "," py
                    . "`nRESULT: SELECTING THIS TILE"
                Sleep 350
            }

            return true
        }

        startX := px + 1
    }

    return false
}

IsGoldNearBlueStar(blueX, blueY, &goldX := 0, &goldY := 0) {
    global GoldTileColor, GoldSearchVariation, SearchX2, SearchY2, DebugGoldSearch

    x1 := blueX + 26
    y1 := blueY - 8
    x2 := blueX + 90
    y2 := blueY + 14

    if (x2 > SearchX2)
        x2 := SearchX2
    if (y2 > SearchY2)
        y2 := SearchY2
    if (y1 < 0)
        y1 := 0

    try {
        foundGold := PixelSearch(&goldX, &goldY, x1, y1, x2, y2, GoldTileColor, GoldSearchVariation)

        if DebugGoldSearch {
            ToolTip "GOLD DEBUG"
                . "`nBlue star: " blueX "," blueY
                . "`nGold box: " x1 "," y1 " -> " x2 "," y2
                . "`nFound gold: " (foundGold ? "YES" : "NO")
                . (foundGold ? "`nGold pixel: " goldX "," goldY : "")
        }

        Sleep 150
        return foundGold
    } catch {
        if DebugGoldSearch
            ToolTip "GOLD DEBUG`nGold PixelSearch exception"

        goldX := 0
        goldY := 0
        return false
    }
}

; ==================================================
; INPUT HELPERS
; ==================================================

TypeSlow(text, delayMs := 80) {
    for _, ch in StrSplit(text) {
        SendText ch
        Sleep delayMs
    }
}

MoveAndClick(x, y) {
    global Running
    if !Running
        return

    WaitIfPaused()
    MouseMove x, y, 0
    Sleep 100
    MouseMove 1, 0, 0, "R"
    Sleep 100
    Click
    Sleep 220
}

WaitIfPaused() {
    global Paused, Running
    while Paused && Running
        Sleep 100
}