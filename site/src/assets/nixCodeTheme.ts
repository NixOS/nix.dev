/* Nix Code VS Code theme
 * Templated on gruvbox.
 * Colours are approximations in sRGB.
*/

const c = {
  transparent: "#0000",
  grey: {
    0: "#dedede",
    1: "#c7c7c7",
    2: "#b1b1b1",
    3: "#9b9b9b",
    4: "#868686",
    5: "#747474",
    6: "#636363",
    7: "#505050",
    8: "#3d3d3d",
    9: "#2b2b2b",
    10: "#1b1b1b",
  },
  // blue
  blue: {
    d: "#4d6fb7",
    m: "#6799ff",
    l: "#8cb6ff",
  },
  // purple
  cyan: {
    d: "#865ca6",
    m: "#bd7ded",
    l: "#d39bff",
  },
  // avocado
  green: {
    d: "#5b7f2a",
    m: "#7db229",
    l: "#99ca5b",
  },
  // amber
  orange: {
    d: "#926a00",
    m: "#cd9300",
    l: "#e4ae28",
  },
  // mulberry
  magenta: {
    d: "#a65176",
    m: "#ec6ba6",
    l: "#ff8cbe",
  },
  // mahogany
  red: {
    d: "#ab5639",
    m: "#f47246",
    l: "#ff936c",
  },
  // aquamarine
  yellow: {
    d: "#00876c",
    m: "#00bc97",
    l: "#00d6b0",
  },
};

export const light = {
  colors: {
    "activityBar.background": c.grey[0],
    "activityBar.border": c.grey[1],
    "activityBar.foreground": c.grey[9],
    "activityBarBadge.background": c.blue.m,
    "activityBarBadge.foreground": c.grey[1],
    "activityBarTop.background": c.grey[0],
    "activityBarTop.foreground": c.grey[9],
    "badge.background": c.magenta.m,
    "badge.foreground": c.grey[1],
    "button.background": c.blue.m,
    "button.foreground": c.grey[9],
    "button.hoverBackground": c.blue.m,
    "debugToolBar.background": c.grey[0],
    "diffEditor.insertedTextBackground": `${c.green.d}30`,
    "diffEditor.removedTextBackground": `${c.orange.d}30`,
    "dropdown.background": c.grey[0],
    "dropdown.border": c.grey[1],
    "dropdown.foreground": c.grey[9],
    "editor.background": c.grey[0],
    "editor.findMatchBackground": `${c.blue.d}70`,
    "editor.findMatchHighlightBackground": `${c.orange.d}30`,
    "editor.findRangeHighlightBackground": `${c.blue.d}70`,
    "editor.foreground": c.grey[9],
    "editor.hoverHighlightBackground": `${c.cyan.m}50`,
    "editor.lineHighlightBackground": c.grey[1],
    "editor.lineHighlightBorder": c.transparent,
    "editor.selectionBackground": `${c.cyan.m}40`,
    "editor.selectionHighlightBackground": `${c.orange.d}40`,
    "editorBracketHighlight.foreground1": c.magenta.m,
    "editorBracketHighlight.foreground2": c.blue.m,
    "editorBracketHighlight.foreground3": c.cyan.m,
    "editorBracketHighlight.foreground4": c.green.m,
    "editorBracketHighlight.foreground5": c.orange.m,
    "editorBracketHighlight.foreground6": c.orange.m,
    "editorBracketHighlight.unexpectedBracket.foreground": c.orange.m,
    "editorBracketMatch.background": `${c.grey[5]}80`,
    "editorBracketMatch.border": c.transparent,
    "editorCodeLens.foreground": `${c.grey[6]}90`,
    "editorCursor.foreground": c.grey[9],
    "editorError.foreground": c.orange.m,
    "editorGhostText.background": `${c.grey[3]}60`,
    "editorGroup.border": c.grey[1],
    "editorGroup.dropBackground": c.grey[1],
    "editorGroupHeader.noTabsBackground": c.grey[0],
    "editorGroupHeader.tabsBackground": c.grey[0],
    "editorGroupHeader.tabsBorder": c.grey[1],
    "editorGutter.addedBackground": c.green.d,
    "editorGutter.background": c.transparent,
    "editorGutter.deletedBackground": c.orange.d,
    "editorGutter.modifiedBackground": c.blue.d,
    "editorHoverWidget.background": c.grey[0],
    "editorHoverWidget.border": c.grey[1],
    "editorIndentGuide.activeBackground": c.grey[3],
    "editorInfo.foreground": c.blue.m,
    "editorLineNumber.foreground": c.grey[3],
    "editorLink.activeForeground": c.grey[9],
    "editorOverviewRuler.addedForeground": c.blue.d,
    "editorOverviewRuler.border": c.transparent,
    "editorOverviewRuler.commonContentForeground": c.grey[5],
    "editorOverviewRuler.currentContentForeground": c.blue.m,
    "editorOverviewRuler.deletedForeground": c.blue.d,
    "editorOverviewRuler.errorForeground": c.orange.d,
    "editorOverviewRuler.findMatchForeground": c.grey[7],
    "editorOverviewRuler.incomingContentForeground": c.cyan.m,
    "editorOverviewRuler.infoForeground": c.magenta.d,
    "editorOverviewRuler.modifiedForeground": c.blue.d,
    "editorOverviewRuler.rangeHighlightForeground": c.grey[7],
    "editorOverviewRuler.selectionHighlightForeground": c.grey[3],
    "editorOverviewRuler.warningForeground": c.orange.m,
    "editorOverviewRuler.wordHighlightForeground": c.grey[3],
    "editorOverviewRuler.wordHighlightStrongForeground": c.grey[3],
    "editorRuler.foreground": `${c.grey[6]}40`,
    "editorStickyScroll.shadow": `${c.grey[2]}99`,
    "editorStickyScrollHover.background": c.grey[1],
    "editorSuggestWidget.background": c.grey[0],
    "editorSuggestWidget.border": c.grey[1],
    "editorSuggestWidget.foreground": c.grey[9],
    "editorSuggestWidget.highlightForeground": c.cyan.m,
    "editorSuggestWidget.selectedBackground": c.grey[1],
    "editorWarning.foreground": c.orange.m,
    "editorWhitespace.foreground": `${c.grey[6]}20`,
    "editorWidget.background": c.grey[0],
    "editorWidget.border": c.grey[1],
    "errorForeground": c.orange.d,
    "extensionButton.prominentBackground": `${c.green.d}80`,
    "extensionButton.prominentHoverBackground": `${c.green.d}30`,
    "focusBorder": c.grey[1],
    "foreground": c.grey[9],
    "gitDecoration.addedResourceForeground": c.grey[9],
    "gitDecoration.conflictingResourceForeground": c.magenta.m,
    "gitDecoration.deletedResourceForeground": c.orange.m,
    "gitDecoration.ignoredResourceForeground": c.grey[4],
    "gitDecoration.modifiedResourceForeground": c.orange.m,
    "gitDecoration.untrackedResourceForeground": c.green.m,
    "gitlens.closedAutolinkedIssueIconColor": c.magenta.m,
    "gitlens.closedPullRequestIconColor": c.orange.m,
    "gitlens.decorations.branchAheadForegroundColor": c.green.m,
    "gitlens.decorations.branchBehindForegroundColor": c.orange.m,
    "gitlens.decorations.branchDivergedForegroundColor": c.orange.m,
    "gitlens.decorations.branchMissingUpstreamForegroundColor": c.orange.m,
    "gitlens.decorations.statusMergingOrRebasingConflictForegroundColor": c.orange.m,
    "gitlens.decorations.statusMergingOrRebasingForegroundColor": c.orange.m,
    "gitlens.decorations.workspaceCurrentForegroundColor": c.green.m,
    "gitlens.decorations.workspaceRepoMissingForegroundColor": c.grey[4],
    "gitlens.decorations.workspaceRepoOpenForegroundColor": c.green.m,
    "gitlens.decorations.worktreeHasUncommittedChangesForegroundColor": c.grey[5],
    "gitlens.decorations.worktreeMissingForegroundColor": c.orange.m,
    "gitlens.graphChangesColumnAddedColor": c.green.m,
    "gitlens.graphChangesColumnDeletedColor": c.orange.m,
    "gitlens.graphLane10Color": c.green.m,
    "gitlens.graphLane1Color": c.blue.d,
    "gitlens.graphLane2Color": c.blue.m,
    "gitlens.graphLane3Color": c.magenta.d,
    "gitlens.graphLane4Color": c.magenta.m,
    "gitlens.graphLane5Color": c.cyan.d,
    "gitlens.graphLane6Color": c.cyan.m,
    "gitlens.graphLane7Color": c.orange.d,
    "gitlens.graphLane8Color": c.orange.m,
    "gitlens.graphLane9Color": c.green.d,
    "gitlens.graphMinimapMarkerHeadColor": c.green.m,
    "gitlens.graphMinimapMarkerHighlightsColor": c.green.d,
    "gitlens.graphMinimapMarkerLocalBranchesColor": c.blue.d,
    "gitlens.graphMinimapMarkerPullRequestsColor": c.orange.d,
    "gitlens.graphMinimapMarkerRemoteBranchesColor": c.blue.m,
    "gitlens.graphMinimapMarkerStashesColor": c.magenta.m,
    "gitlens.graphMinimapMarkerTagsColor": c.grey[4],
    "gitlens.graphMinimapMarkerUpstreamColor": c.cyan.m,
    "gitlens.graphScrollMarkerHeadColor": c.green.d,
    "gitlens.graphScrollMarkerHighlightsColor": c.orange.m,
    "gitlens.graphScrollMarkerLocalBranchesColor": c.blue.d,
    "gitlens.graphScrollMarkerPullRequestsColor": c.orange.d,
    "gitlens.graphScrollMarkerRemoteBranchesColor": c.blue.m,
    "gitlens.graphScrollMarkerStashesColor": c.magenta.m,
    "gitlens.graphScrollMarkerTagsColor": c.grey[4],
    "gitlens.graphScrollMarkerUpstreamColor": c.cyan.d,
    "gitlens.gutterBackgroundColor": c.grey[1],
    "gitlens.gutterForegroundColor": c.grey[9],
    "gitlens.gutterUncommittedForegroundColor": c.blue.m,
    "gitlens.launchpadIndicatorAttentionColor": c.orange.d,
    "gitlens.launchpadIndicatorAttentionHoverColor": c.orange.m,
    "gitlens.launchpadIndicatorBlockedColor": c.orange.d,
    "gitlens.launchpadIndicatorBlockedHoverColor": c.orange.m,
    "gitlens.launchpadIndicatorMergeableColor": c.green.d,
    "gitlens.launchpadIndicatorMergeableHoverColor": c.green.m,
    "gitlens.lineHighlightBackgroundColor": c.grey[1],
    "gitlens.lineHighlightOverviewRulerColor": c.blue.m,
    "gitlens.mergedPullRequestIconColor": c.magenta.m,
    "gitlens.openAutolinkedIssueIconColor": c.green.m,
    "gitlens.openPullRequestIconColor": c.green.m,
    "gitlens.trailingLineBackgroundColor": c.grey[0],
    "gitlens.trailingLineForegroundColor": `${c.grey[5]}a0`,
    "gitlens.unpublishedChangesIconColor": c.green.m,
    "gitlens.unpublishedCommitIconColor": c.green.m,
    "gitlens.unpulledChangesIconColor": c.orange.d,
    "icon.foreground": c.grey[9],
    "input.background": c.grey[0],
    "input.border": c.grey[1],
    "input.foreground": c.grey[9],
    "input.placeholderForeground": c.grey[9],
    "inputOption.activeBorder": c.grey[9],
    "inputValidation.errorBackground": c.orange.m,
    "inputValidation.errorBorder": c.orange.d,
    "inputValidation.infoBackground": c.blue.m,
    "inputValidation.infoBorder": c.blue.d,
    "inputValidation.warningBackground": c.orange.m,
    "inputValidation.warningBorder": c.orange.d,
    "list.activeSelectionBackground": c.grey[1],
    "list.activeSelectionForeground": c.cyan.d,
    "list.dropBackground": c.grey[1],
    "list.focusBackground": c.grey[1],
    "list.focusForeground": c.grey[9],
    "list.highlightForeground": c.cyan.m,
    "list.hoverBackground": c.grey[1],
    "list.hoverForeground": c.grey[8],
    "list.inactiveSelectionBackground": c.grey[1],
    "list.inactiveSelectionForeground": c.cyan.m,
    "menu.border": c.grey[1],
    "menu.separatorBackground": c.grey[1],
    "merge.border": c.transparent,
    "merge.currentContentBackground": c.blue.m,
    "merge.currentHeaderBackground": c.blue.m,
    "merge.incomingContentBackground": `${c.cyan.m}20`,
    "merge.incomingHeaderBackground": `${c.cyan.m}40`,
    "notebook.cellBorderColor": c.orange.l,
    "notebook.cellEditorBackground": c.grey[1],
    "notebook.focusedCellBorder": c.grey[6],
    "notebook.focusedEditorBorder": c.orange.l,
    "panel.border": c.grey[1],
    "panelTitle.activeForeground": c.grey[9],
    "peekView.border": c.grey[1],
    "peekViewEditor.background": c.grey[1],
    "peekViewEditor.matchHighlightBackground": c.orange.l,
    "peekViewEditorGutter.background": c.grey[1],
    "peekViewResult.background": c.grey[1],
    "peekViewResult.fileForeground": c.grey[9],
    "peekViewResult.lineForeground": c.grey[9],
    "peekViewResult.matchHighlightBackground": c.orange.l,
    "peekViewResult.selectionBackground": c.blue.m,
    "peekViewResult.selectionForeground": c.grey[9],
    "peekViewTitle.background": c.grey[1],
    "peekViewTitleDescription.foreground": c.grey[7],
    "peekViewTitleLabel.foreground": c.grey[9],
    "progressBar.background": c.cyan.m,
    "scmGraph.historyItemHoverDefaultLabelForeground": c.grey[1],
    "scmGraph.historyItemHoverLabelForeground": c.grey[1],
    "scrollbar.shadow": c.grey[0],
    "scrollbarSlider.activeBackground": c.cyan.m,
    "scrollbarSlider.background": `${c.grey[2]}99`,
    "scrollbarSlider.hoverBackground": c.grey[3],
    "selection.background": `${c.cyan.m}80`,
    "sideBar.background": c.grey[0],
    "sideBar.border": c.grey[1],
    "sideBar.foreground": c.grey[8],
    "sideBarSectionHeader.background": c.transparent,
    "sideBarSectionHeader.foreground": c.grey[9],
    "sideBarTitle.foreground": c.grey[9],
    "statusBar.background": c.grey[0],
    "statusBar.border": c.grey[1],
    "statusBar.debuggingBackground": c.orange.d,
    "statusBar.debuggingBorder": c.transparent,
    "statusBar.debuggingForeground": c.grey[0],
    "statusBar.foreground": c.grey[9],
    "statusBar.noFolderBackground": c.grey[0],
    "statusBar.noFolderBorder": c.transparent,
    "tab.activeBackground": c.grey[1],
    "tab.activeBorder": c.cyan.m,
    "tab.activeForeground": c.grey[9],
    "tab.border": c.transparent,
    "tab.inactiveBackground": c.grey[0],
    "tab.inactiveForeground": c.grey[6],
    "tab.unfocusedActiveBorder": c.transparent,
    "tab.unfocusedActiveForeground": c.grey[6],
    "tab.unfocusedInactiveForeground": c.grey[5],
    "terminal.ansiBlack": c.grey[1],
    "terminal.ansiBlue": c.blue.m,
    "terminal.ansiBrightBlack": c.grey[5],
    "terminal.ansiBrightBlue": c.blue.d,
    "terminal.ansiBrightCyan": c.cyan.d,
    "terminal.ansiBrightcyan": c.green.d,
    "terminal.ansiBrightMagenta": c.magenta.d,
    "terminal.ansiBrightRed": c.orange.d,
    "terminal.ansiBrightWhite": c.grey[9],
    "terminal.ansiBrightYellow": c.orange.d,
    "terminal.ansiCyan": c.cyan.m,
    "terminal.ansicyan": c.green.m,
    "terminal.ansiMagenta": c.magenta.m,
    "terminal.ansiRed": c.orange.m,
    "terminal.ansiWhite": c.grey[6],
    "terminal.ansiYellow": c.orange.m,
    "terminal.background": c.grey[0],
    "terminal.foreground": c.grey[9],
    "textLink.activeForeground": c.blue.m,
    "textLink.foreground": c.blue.d,
    "titleBar.activeBackground": c.grey[0],
    "titleBar.activeForeground": c.grey[9],
    "titleBar.inactiveBackground": c.grey[0],
    "widget.border": c.grey[1],
    "widget.shadow": c.grey[0]
  },
  displayName: "Nix Code Light",
  name: "nix-code-light",
  semanticHighlighting: true,
  semanticTokenColors: {
    "component": c.orange.d,
    "constant.builtin": c.magenta.d,
    "function": c.cyan.d,
    "function.builtin": c.orange.d,
    "method": c.cyan.d,
    "parameter": c.blue.d,
    "property": c.blue.d,
    "property:python": c.grey[9],
    "variable": c.grey[9]
  },
  tokenColors: [
    {
      settings: {
        foreground: c.grey[9]
      }
    },
    {
      scope: "emphasis",
      settings: {
        fontStyle: "italic"
      }
    },
    {
      scope: "strong",
      settings: {
        fontStyle: "bold"
      }
    },
    {
      scope: "header",
      settings: {
        foreground: c.blue.m
      }
    },
    {
      scope: [
        "comment",
        "punctuation.definition.comment"
      ],
      settings: {
        fontStyle: "italic",
        foreground: c.grey[5]
      }
    },
    {
      scope: [
        "constant",
        "support.constant",
        "variable.arguments"
      ],
      settings: {
        foreground: c.magenta.d
      }
    },
    {
      scope: "constant.rgb-value",
      settings: {
        foreground: c.grey[9]
      }
    },
    {
      scope: "entity.name.selector",
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "entity.name.tag",
        "punctuation.tag"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: [
        "invalid",
        "invalid.illegal"
      ],
      settings: {
        foreground: c.orange.m
      }
    },
    {
      scope: "invalid.deprecated",
      settings: {
        foreground: c.magenta.m
      }
    },
    {
      scope: "meta.selector",
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "meta.preprocessor",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "meta.preprocessor.string",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: "meta.preprocessor.numeric",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: "meta.header.diff",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "storage",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "storage.type",
        "storage.modifier"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "string",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: "string.tag",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: "string.value",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: "string.regexp",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "string.escape",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "string.quasi",
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "string.entity",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: "object",
      settings: {
        foreground: c.grey[9]
      }
    },
    {
      scope: "module.node",
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: "support.type.property-name",
      settings: {
        foreground: c.cyan.m
      }
    },
    {
      scope: "keyword",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "keyword.control.module",
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "keyword.control.less",
      settings: {
        foreground: c.orange.m
      }
    },
    {
      scope: "keyword.operator",
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "keyword.operator.new",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: "metatag.php",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "support.function.git-rebase",
      settings: {
        foreground: c.cyan.m
      }
    },
    {
      scope: "constant.sha.git-rebase",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: [
        "meta.type.name",
        "meta.return.type",
        "meta.return-type",
        "meta.cast",
        "meta.type.annotation",
        "support.type",
        "storage.type.cs",
        "variable.class"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "variable.this",
        "support.variable"
      ],
      settings: {
        foreground: c.magenta.d
      }
    },
    {
      scope: [
        "entity.name",
        "entity.static",
        "entity.name.class.static.function",
        "entity.name.function",
        "entity.name.class",
        "entity.name.type"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "entity.function",
        "entity.name.function.static"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "entity.name.function.function-call",
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "support.function.builtin",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "entity.name.method",
        "entity.name.method.function-call",
        "entity.name.static.function-call"
      ],
      settings: {
        foreground: c.cyan.m
      }
    },
    {
      scope: "brace",
      settings: {
        foreground: c.grey[8]
      }
    },
    {
      scope: [
        "meta.parameter.type.variable",
        "variable.parameter",
        "variable.name",
        "variable.other",
        "variable",
        "string.constant.other.placeholder"
      ],
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: "prototype",
      settings: {
        foreground: c.magenta.d
      }
    },
    {
      scope: [
        "punctuation"
      ],
      settings: {
        foreground: c.grey[6]
      }
    },
    {
      scope: "punctuation.quoted",
      settings: {
        foreground: c.grey[9]
      }
    },
    {
      scope: "punctuation.quasi",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "*url*",
        "*link*",
        "*uri*"
      ],
      settings: {
        fontStyle: "underline"
      }
    },
    {
      scope: [
        "meta.function.python",
        "entity.name.function.python"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: [
        "storage.type.function.python",
        "storage.modifier.declaration",
        "storage.type.class.python",
        "storage.type.string.python"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "storage.type.function.async.python"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "meta.function-call.generic",
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: "meta.function-call.arguments",
      settings: {
        foreground: c.grey[8]
      }
    },
    {
      scope: "entity.name.function.decorator",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.d
      }
    },
    {
      scope: "constant.other.caps",
      settings: {
        fontStyle: "bold"
      }
    },
    {
      scope: "keyword.operator.logical",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "punctuation.definition.logical-expression",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "string.interpolated.dollar.shell",
        "string.interpolated.backtick.shell"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "keyword.control.directive",
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "support.function.C99",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "meta.function.cs",
        "entity.name.function.cs",
        "entity.name.type.namespace.cs"
      ],
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: [
        "keyword.other.using.cs",
        "entity.name.variable.field.cs",
        "entity.name.variable.local.cs",
        "variable.other.readwrite.cs"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: [
        "keyword.other.this.cs",
        "keyword.other.base.cs"
      ],
      settings: {
        foreground: c.magenta.d
      }
    },
    {
      scope: "meta.scope.prerequisites",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "entity.name.function.target",
      settings: {
        fontStyle: "bold",
        foreground: c.green.d
      }
    },
    {
      scope: [
        "storage.modifier.import.java",
        "storage.modifier.package.java"
      ],
      settings: {
        foreground: c.grey[7]
      }
    },
    {
      scope: [
        "keyword.other.import.java",
        "keyword.other.package.java"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "storage.type.java",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "storage.type.annotation",
      settings: {
        fontStyle: "bold",
        foreground: c.blue.d
      }
    },
    {
      scope: "keyword.other.documentation.javadoc",
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "comment.block.javadoc variable.parameter.java",
      settings: {
        fontStyle: "bold",
        foreground: c.green.d
      }
    },
    {
      scope: [
        "source.java variable.other.object",
        "source.java variable.other.definition.java"
      ],
      settings: {
        foreground: c.grey[9]
      }
    },
    {
      scope: "meta.function-parameters.lisp",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "markup.underline",
      settings: {
        fontStyle: "underline"
      }
    },
    {
      scope: "string.other.link.title.markdown",
      settings: {
        fontStyle: "underline",
        foreground: c.grey[5]
      }
    },
    {
      scope: "markup.underline.link",
      settings: {
        foreground: c.magenta.d
      }
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.d
      }
    },
    {
      scope: "markup.heading",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.d
      }
    },
    {
      scope: "heading.1.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.d
      }
    },
    {
      scope: "heading.2.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.d
      }
    },
    {
      scope: "heading.3.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.d
      }
    },
    {
      scope: "heading.4.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.green.d
      }
    },
    {
      scope: "heading.5.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.blue.d
      }
    },
    {
      scope: "heading.6.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.magenta.d
      }
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic"
      }
    },
    {
      scope: "markup.inserted",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: "markup.deleted",
      settings: {
        foreground: c.orange.m
      }
    },
    {
      scope: "markup.changed",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "markup.punctuation.quote.beginning",
      settings: {
        foreground: c.green.m
      }
    },
    {
      scope: "markup.punctuation.list.beginning",
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: [
        "markup.inline.raw",
        "markup.fenced_code.block"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: "string.quoted.double.json",
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: "entity.other.attribute-name.css",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "source.css meta.selector",
      settings: {
        foreground: c.grey[9]
      }
    },
    {
      scope: "support.type.property-name.css",
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: "entity.other.attribute-name.class",
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: [
        "source.css support.function.transform",
        "source.css support.function.timing-function",
        "source.css support.function.misc"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "support.property-value",
        "constant.rgb-value",
        "support.property-value.scss",
        "constant.rgb-value.scss"
      ],
      settings: {
        foreground: c.orange.m
      }
    },
    {
      scope: [
        "entity.name.tag.css"
      ],
      settings: {
        fontStyle: ""
      }
    },
    {
      scope: [
        "punctuation.definition.tag"
      ],
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: [
        "text.html entity.name.tag",
        "text.html punctuation.tag"
      ],
      settings: {
        // fontStyle: "bold",
        foreground: c.cyan.d
      }
    },
    {
      scope: [
        "source.js variable.language"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "source.ts variable.language"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "source.go storage.type"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "source.go entity.name.import"
      ],
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: [
        "source.go keyword.package",
        "source.go keyword.import"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: [
        "source.go keyword.interface",
        "source.go keyword.struct"
      ],
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: [
        "source.go entity.name.type"
      ],
      settings: {
        foreground: c.grey[9]
      }
    },
    {
      scope: [
        "source.go entity.name.function"
      ],
      settings: {
        foreground: c.magenta.d
      }
    },
    {
      scope: [
        "keyword.control.cucumber.table"
      ],
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: [
        "source.reason string.double",
        "source.reason string.regexp"
      ],
      settings: {
        foreground: c.green.d
      }
    },
    {
      scope: [
        "source.reason keyword.control.less"
      ],
      settings: {
        foreground: c.cyan.d
      }
    },
    {
      scope: [
        "source.reason entity.name.function"
      ],
      settings: {
        foreground: c.blue.d
      }
    },
    {
      scope: [
        "source.reason support.property-value",
        "source.reason entity.name.filename"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "source.powershell variable.other.member.powershell"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "source.powershell support.function.powershell"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "source.powershell support.function.attribute.powershell"
      ],
      settings: {
        foreground: c.grey[7]
      }
    },
    {
      scope: [
        "source.powershell meta.hashtable.assignment.powershell variable.other.readwrite.powershell"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "support.function.be.latex",
        "support.function.general.tex",
        "support.function.section.latex",
        "support.function.textbf.latex",
        "support.function.textit.latex",
        "support.function.texttt.latex",
        "support.function.emph.latex",
        "support.function.url.latex"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "support.class.math.block.tex",
        "support.class.math.block.environment.latex"
      ],
      settings: {
        foreground: c.orange.d
      }
    },
    {
      scope: [
        "keyword.control.preamble.latex",
        "keyword.control.include.latex"
      ],
      settings: {
        foreground: c.magenta.d
      }
    },
    {
      scope: [
        "support.class.latex"
      ],
      settings: {
        foreground: c.cyan.d
      }
    }
  ],
  type: "light"
};

export const dark = {
  colors: {
    "activityBar.background": c.grey[10],
    "activityBar.border": c.grey[9],
    "activityBar.foreground": c.grey[1],
    "activityBarBadge.background": c.blue.m,
    "activityBarBadge.foreground": c.grey[1],
    "activityBarTop.background": c.grey[10],
    "activityBarTop.foreground": c.grey[1],
    "badge.background": c.magenta.m,
    "badge.foreground": c.grey[1],
    "button.background": c.blue.m,
    "button.foreground": c.grey[1],
    "button.hoverBackground": c.blue.m,
    "debugToolBar.background": c.grey[10],
    "diffEditor.insertedTextBackground": `${c.green.l}30`,
    "diffEditor.removedTextBackground": `${c.orange.l}30`,
    "dropdown.background": c.grey[10],
    "dropdown.border": c.grey[9],
    "dropdown.foreground": c.grey[1],
    "editor.background": c.grey[10],
    "editor.findMatchBackground": `${c.blue.l}70`,
    "editor.findMatchHighlightBackground": `${c.orange.l}30`,
    "editor.findRangeHighlightBackground": `${c.blue.l}70`,
    "editor.foreground": c.grey[1],
    "editor.hoverHighlightBackground": `${c.cyan.m}50`,
    "editor.lineHighlightBackground": c.grey[9],
    "editor.lineHighlightBorder": c.transparent,
    "editor.selectionBackground": `${c.cyan.m}40`,
    "editor.selectionHighlightBackground": `${c.orange.l}40`,
    "editorBracketHighlight.foreground1": c.magenta.m,
    "editorBracketHighlight.foreground2": c.blue.m,
    "editorBracketHighlight.foreground3": c.cyan.m,
    "editorBracketHighlight.foreground4": c.green.m,
    "editorBracketHighlight.foreground5": c.orange.m,
    "editorBracketHighlight.foreground6": c.orange.m,
    "editorBracketHighlight.unexpectedBracket.foreground": c.orange.m,
    "editorBracketMatch.background": `${c.grey[5]}80`,
    "editorBracketMatch.border": c.transparent,
    "editorCodeLens.foreground": `${c.grey[4]}90`,
    "editorCursor.foreground": c.grey[1],
    "editorError.foreground": c.orange.m,
    "editorGhostText.background": `${c.grey[7]}60`,
    "editorGroup.border": c.grey[9],
    "editorGroup.dropBackground": c.grey[9],
    "editorGroupHeader.noTabsBackground": c.grey[10],
    "editorGroupHeader.tabsBackground": c.grey[10],
    "editorGroupHeader.tabsBorder": c.grey[9],
    "editorGutter.addedBackground": c.green.l,
    "editorGutter.background": c.transparent,
    "editorGutter.deletedBackground": c.orange.l,
    "editorGutter.modifiedBackground": c.blue.l,
    "editorHoverWidget.background": c.grey[10],
    "editorHoverWidget.border": c.grey[9],
    "editorIndentGuide.activeBackground": c.grey[7],
    "editorInfo.foreground": c.blue.m,
    "editorLineNumber.foreground": c.grey[7],
    "editorLink.activeForeground": c.grey[1],
    "editorOverviewRuler.addedForeground": c.blue.l,
    "editorOverviewRuler.border": c.transparent,
    "editorOverviewRuler.commonContentForeground": c.grey[5],
    "editorOverviewRuler.currentContentForeground": c.blue.m,
    "editorOverviewRuler.deletedForeground": c.blue.l,
    "editorOverviewRuler.errorForeground": c.orange.l,
    "editorOverviewRuler.findMatchForeground": c.grey[3],
    "editorOverviewRuler.incomingContentForeground": c.cyan.m,
    "editorOverviewRuler.infoForeground": c.magenta.l,
    "editorOverviewRuler.modifiedForeground": c.blue.l,
    "editorOverviewRuler.rangeHighlightForeground": c.grey[3],
    "editorOverviewRuler.selectionHighlightForeground": c.grey[7],
    "editorOverviewRuler.warningForeground": c.orange.m,
    "editorOverviewRuler.wordHighlightForeground": c.grey[7],
    "editorOverviewRuler.wordHighlightStrongForeground": c.grey[7],
    "editorRuler.foreground": `${c.grey[4]}40`,
    "editorStickyScroll.shadow": `${c.grey[8]}99`,
    "editorStickyScrollHover.background": c.grey[9],
    "editorSuggestWidget.background": c.grey[10],
    "editorSuggestWidget.border": c.grey[9],
    "editorSuggestWidget.foreground": c.grey[1],
    "editorSuggestWidget.highlightForeground": c.cyan.m,
    "editorSuggestWidget.selectedBackground": c.grey[9],
    "editorWarning.foreground": c.orange.m,
    "editorWhitespace.foreground": `${c.grey[4]}20`,
    "editorWidget.background": c.grey[10],
    "editorWidget.border": c.grey[9],
    "errorForeground": c.orange.l,
    "extensionButton.prominentBackground": `${c.green.l}80`,
    "extensionButton.prominentHoverBackground": `${c.green.l}30`,
    "focusBorder": c.grey[9],
    "foreground": c.grey[1],
    "gitDecoration.addedResourceForeground": c.grey[1],
    "gitDecoration.conflictingResourceForeground": c.magenta.m,
    "gitDecoration.deletedResourceForeground": c.orange.m,
    "gitDecoration.ignoredResourceForeground": c.grey[6],
    "gitDecoration.modifiedResourceForeground": c.orange.m,
    "gitDecoration.untrackedResourceForeground": c.green.m,
    "gitlens.closedAutolinkedIssueIconColor": c.magenta.m,
    "gitlens.closedPullRequestIconColor": c.orange.m,
    "gitlens.decorations.branchAheadForegroundColor": c.green.m,
    "gitlens.decorations.branchBehindForegroundColor": c.orange.m,
    "gitlens.decorations.branchDivergedForegroundColor": c.orange.m,
    "gitlens.decorations.branchMissingUpstreamForegroundColor": c.orange.m,
    "gitlens.decorations.statusMergingOrRebasingConflictForegroundColor": c.orange.m,
    "gitlens.decorations.statusMergingOrRebasingForegroundColor": c.orange.m,
    "gitlens.decorations.workspaceCurrentForegroundColor": c.green.m,
    "gitlens.decorations.workspaceRepoMissingForegroundColor": c.grey[6],
    "gitlens.decorations.workspaceRepoOpenForegroundColor": c.green.m,
    "gitlens.decorations.worktreeHasUncommittedChangesForegroundColor": c.grey[5],
    "gitlens.decorations.worktreeMissingForegroundColor": c.orange.m,
    "gitlens.graphChangesColumnAddedColor": c.green.m,
    "gitlens.graphChangesColumnDeletedColor": c.orange.m,
    "gitlens.graphLane10Color": c.green.m,
    "gitlens.graphLane1Color": c.blue.l,
    "gitlens.graphLane2Color": c.blue.m,
    "gitlens.graphLane3Color": c.magenta.l,
    "gitlens.graphLane4Color": c.magenta.m,
    "gitlens.graphLane5Color": c.cyan.l,
    "gitlens.graphLane6Color": c.cyan.m,
    "gitlens.graphLane7Color": c.orange.l,
    "gitlens.graphLane8Color": c.orange.m,
    "gitlens.graphLane9Color": c.green.l,
    "gitlens.graphMinimapMarkerHeadColor": c.green.m,
    "gitlens.graphMinimapMarkerHighlightsColor": c.green.l,
    "gitlens.graphMinimapMarkerLocalBranchesColor": c.blue.l,
    "gitlens.graphMinimapMarkerPullRequestsColor": c.orange.l,
    "gitlens.graphMinimapMarkerRemoteBranchesColor": c.blue.m,
    "gitlens.graphMinimapMarkerStashesColor": c.magenta.m,
    "gitlens.graphMinimapMarkerTagsColor": c.grey[6],
    "gitlens.graphMinimapMarkerUpstreamColor": c.cyan.m,
    "gitlens.graphScrollMarkerHeadColor": c.green.l,
    "gitlens.graphScrollMarkerHighlightsColor": c.orange.m,
    "gitlens.graphScrollMarkerLocalBranchesColor": c.blue.l
    , "gitlens.graphScrollMarkerPullRequestsColor": c.orange.l,
    "gitlens.graphScrollMarkerRemoteBranchesColor": c.blue.m,
    "gitlens.graphScrollMarkerStashesColor": c.magenta.m,
    "gitlens.graphScrollMarkerTagsColor": c.grey[6],
    "gitlens.graphScrollMarkerUpstreamColor": c.cyan.l,
    "gitlens.gutterBackgroundColor": c.grey[9],
    "gitlens.gutterForegroundColor": c.grey[1],
    "gitlens.gutterUncommittedForegroundColor": c.blue.m,
    "gitlens.launchpadIndicatorAttentionColor": c.orange.l,
    "gitlens.launchpadIndicatorAttentionHoverColor": c.orange.m,
    "gitlens.launchpadIndicatorBlockedColor": c.orange.l,
    "gitlens.launchpadIndicatorBlockedHoverColor": c.orange.m,
    "gitlens.launchpadIndicatorMergeableColor": c.green.l,
    "gitlens.launchpadIndicatorMergeableHoverColor": c.green.m,
    "gitlens.lineHighlightBackgroundColor": c.grey[9],
    "gitlens.lineHighlightOverviewRulerColor": c.blue.m,
    "gitlens.mergedPullRequestIconColor": c.magenta.m,
    "gitlens.openAutolinkedIssueIconColor": c.green.m,
    "gitlens.openPullRequestIconColor": c.green.m,
    "gitlens.trailingLineBackgroundColor": `${c.grey[10]}a0`,
    "gitlens.trailingLineForegroundColor": `${c.grey[5]}a0`,
    "gitlens.unpublishedChangesIconColor": c.green.m,
    "gitlens.unpublishedCommitIconColor": c.green.m
    , "gitlens.unpulledChangesIconColor": c.orange.l,
    "icon.foreground": c.grey[1],
    "input.background": c.grey[10],
    "input.border": c.grey[9],
    "input.foreground": c.grey[1],
    "input.placeholderForeground": c.grey[1],
    "inputOption.activeBorder": c.grey[1],
    "inputValidation.errorBackground": c.orange.m,
    "inputValidation.errorBorder": c.orange.l,
    "inputValidation.infoBackground": c.blue.m,
    "inputValidation.infoBorder": c.blue.l,
    "inputValidation.warningBackground": c.orange.m,
    "inputValidation.warningBorder": c.orange.l,
    "list.activeSelectionBackground": c.grey[9],
    "list.activeSelectionForeground": c.cyan.l,
    "list.dropBackground": c.grey[9],
    "list.focusBackground": c.grey[9],
    "list.focusForeground": c.grey[1],
    "list.highlightForeground": c.cyan.m,
    "list.hoverBackground": c.grey[9],
    "list.hoverForeground": c.orange.l,
    "list.inactiveSelectionBackground": c.grey[9],
    "list.inactiveSelectionForeground": c.cyan.m,
    "menu.border": c.grey[9],
    "menu.separatorBackground": c.grey[9],
    "merge.border": c.transparent,
    "merge.currentContentBackground": c.blue.m,
    "merge.currentHeaderBackground": c.blue.m,
    "merge.incomingContentBackground": `${c.cyan.m}20`,
    "merge.incomingHeaderBackground": `${c.cyan.m}40`,
    "notebook.cellBorderColor": c.grey[8],
    "notebook.cellEditorBackground": c.grey[9],
    "notebook.focusedCellBorder": c.grey[4],
    "notebook.focusedEditorBorder": c.grey[8],
    "panel.border": c.grey[9],
    "panelTitle.activeForeground": c.grey[1],
    "peekView.border": c.grey[9],
    "peekViewEditor.background": c.grey[9],
    "peekViewEditor.matchHighlightBackground": c.grey[8],
    "peekViewEditorGutter.background": c.grey[9],
    "peekViewResult.background": c.grey[9],
    "peekViewResult.fileForeground": c.grey[1],
    "peekViewResult.lineForeground": c.grey[1],
    "peekViewResult.matchHighlightBackground": c.grey[8],
    "peekViewResult.selectionBackground": c.blue.m,
    "peekViewResult.selectionForeground": c.grey[1],
    "peekViewTitle.background": c.grey[9],
    "peekViewTitleDescription.foreground": c.grey[3],
    "peekViewTitleLabel.foreground": c.grey[1],
    "progressBar.background": c.cyan.m,
    "scmGraph.historyItemHoverDefaultLabelForeground": c.grey[1],
    "scmGraph.historyItemHoverLabelForeground": c.grey[1],
    "scrollbar.shadow": c.grey[10],
    "scrollbarSlider.activeBackground": c.cyan.m,
    "scrollbarSlider.background": `${c.grey[8]}99`,
    "scrollbarSlider.hoverBackground": c.grey[7],
    "selection.background": `${c.cyan.m}80`,
    "sideBar.background": c.grey[10],
    "sideBar.border": c.grey[9],
    "sideBar.foreground": c.orange.l,
    "sideBarSectionHeader.background": c.transparent,
    "sideBarSectionHeader.foreground": c.grey[1],
    "sideBarTitle.foreground": c.grey[1],
    "statusBar.background": c.grey[10],
    "statusBar.border": c.grey[9], "statusBar.debuggingBackground": c.orange.l,

    "statusBar.debuggingBorder": c.transparent,
    "statusBar.debuggingForeground": c.grey[10],
    "statusBar.foreground": c.grey[1],
    "statusBar.noFolderBackground": c.grey[10],
    "statusBar.noFolderBorder": c.transparent,
    "tab.activeBackground": c.grey[9],
    "tab.activeBorder": c.cyan.m,
    "tab.activeForeground": c.grey[1],
    "tab.border": c.transparent,
    "tab.inactiveBackground": c.grey[10],
    "tab.inactiveForeground": c.grey[4],
    "tab.unfocusedActiveBorder": c.transparent,
    "tab.unfocusedActiveForeground": c.grey[4],
    "tab.unfocusedInactiveForeground": c.grey[5],
    "terminal.ansiBlack": c.grey[9],
    "terminal.ansiBlue": c.blue.m,
    "terminal.ansiBrightBlack": c.grey[5],
    "terminal.ansiBrightBlue": c.blue.l,
    "terminal.ansiBrightCyan": c.cyan.l,
    "terminal.ansiBrightcyan": c.green.l,
    "terminal.ansiBrightMagenta": c.magenta.l,
    "terminal.ansiBrightRed": c.orange.l,
    "terminal.ansiBrightWhite": c.grey[1],
    "terminal.ansiBrightYellow": c.orange.l,
    "terminal.ansiCyan": c.cyan.m,
    "terminal.ansicyan": c.green.m,
    "terminal.ansiMagenta": c.magenta.m,
    "terminal.ansiRed": c.orange.m,
    "terminal.ansiWhite": c.grey[4],
    "terminal.ansiYellow": c.orange.m,
    "terminal.background": c.grey[10],
    "terminal.foreground": c.grey[1],
    "textLink.activeForeground": c.blue.m,
    "textLink.foreground": c.blue.l,
    "titleBar.activeBackground": c.grey[10],
    "titleBar.activeForeground": c.grey[1],
    "titleBar.inactiveBackground": c.grey[10],
    "widget.border": c.grey[9],
    "widget.shadow": `${c.grey[10]}30`
  },
  displayName: "Nix Code Dark",
  name: "nix-code-dark",
  semanticHighlighting: true,
  semanticTokenColors: {
    "component": c.orange.l,

    "constant.builtin": c.magenta.l,
    "function": c.cyan.l, "function.builtin": c.orange.l,

    "method": c.cyan.l,
    "parameter": c.blue.l,
    "property": c.blue.l,
    "property:python": c.grey[1],
    "variable": c.grey[1]
  },
  tokenColors: [
    {
      settings: {
        foreground: c.grey[1]
      }
    },
    {
      scope: "emphasis",
      settings: {
        fontStyle: "italic"
      }
    },
    {
      scope: "strong",
      settings: {
        fontStyle: "bold"
      }
    },
    {
      scope: "header",
      settings: {
        foreground: c.blue.m
      }
    },
    {
      scope: [
        "comment",
        "punctuation.definition.comment"
      ],
      settings: {
        fontStyle: "italic",
        foreground: c.grey[5]
      }
    },
    {
      scope: [
        "constant",
        "support.constant",
        "variable.arguments"
      ],
      settings: {
        foreground: c.magenta.l
      }
    },
    {
      scope: "constant.rgb-value",
      settings: {
        foreground: c.grey[1]
      }
    },
    {
      scope: "entity.name.selector",
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "entity.other.attribute-name",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "entity.name.tag",
        "punctuation.tag"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: [
        "invalid",
        "invalid.illegal"
      ],
      settings: {
        foreground: c.orange.m
      }
    },
    {
      scope: "invalid.deprecated",
      settings: {
        foreground: c.magenta.m
      }
    },
    {
      scope: "meta.selector",
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "meta.preprocessor",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "meta.preprocessor.string",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: "meta.preprocessor.numeric",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: "meta.header.diff",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "storage",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "storage.type",
        "storage.modifier"
      ],
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "string",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: "string.tag",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: "string.value",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: "string.regexp",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "string.escape",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "string.quasi",
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "string.entity",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: "object",
      settings: {
        foreground: c.grey[1]
      }
    },
    {
      scope: "module.node",
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: "support.type.property-name",
      settings: {
        foreground: c.cyan.m
      }
    },
    {
      scope: "keyword",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "keyword.control",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "keyword.control.module",
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "keyword.control.less",
      settings: {
        foreground: c.orange.m
      }
    },
    {
      scope: "keyword.operator",
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "keyword.operator.new",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "keyword.other.unit",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: "metatag.php",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "support.function.git-rebase",
      settings: {
        foreground: c.cyan.m
      }
    },
    {
      scope: "constant.sha.git-rebase",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: [
        "meta.type.name",
        "meta.return.type",
        "meta.return-type",
        "meta.cast",
        "meta.type.annotation",
        "support.type",
        "storage.type.cs",
        "variable.class"
      ],
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "variable.this",
        "support.variable"
      ],
      settings: {
        foreground: c.magenta.l
      }
    },
    {
      scope: [
        "entity.name",
        "entity.static",
        "entity.name.class.static.function",
        "entity.name.function",
        "entity.name.class",
        "entity.name.type"
      ],
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "entity.function",
        "entity.name.function.static"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "entity.name.function.function-call",
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "support.function.builtin",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: [
        "entity.name.method",
        "entity.name.method.function-call",
        "entity.name.static.function-call"
      ],
      settings: {
        foreground: c.cyan.m
      }
    },
    {
      scope: "brace",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "meta.parameter.type.variable",
        "variable.parameter",
        "variable.name",
        "variable.other",
        "variable",
        "string.constant.other.placeholder"
      ],
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: "prototype",
      settings: {
        foreground: c.magenta.l
      }
    },
    {
      scope: [
        "punctuation"
      ],
      settings: {
        foreground: c.grey[4]
      }
    },
    {
      scope: "punctuation.quoted",
      settings: {
        foreground: c.grey[1]
      }
    },
    {
      scope: "punctuation.quasi",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "*url*",
        "*link*",
        "*uri*"
      ],
      settings: {
        fontStyle: "underline"
      }
    },
    {
      scope: [
        "meta.function.python",
        "entity.name.function.python"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: [
        "storage.type.function.python",
        "storage.modifier.declaration",
        "storage.type.class.python",
        "storage.type.string.python"
      ],
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "storage.type.function.async.python"
      ],
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "meta.function-call.generic",
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: "meta.function-call.arguments",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "entity.name.function.decorator",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.l
      }
    },
    {
      scope: "constant.other.caps",
      settings: {
        fontStyle: "bold"
      }
    },
    {
      scope: "keyword.operator.logical",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "punctuation.definition.logical-expression",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: [
        "string.interpolated.dollar.shell",
        "string.interpolated.backtick.shell"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "keyword.control.directive",
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "support.function.C99",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "meta.function.cs",
        "entity.name.function.cs",
        "entity.name.type.namespace.cs"
      ],
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: [
        "keyword.other.using.cs",
        "entity.name.variable.field.cs",
        "entity.name.variable.local.cs",
        "variable.other.readwrite.cs"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: [
        "keyword.other.this.cs",
        "keyword.other.base.cs"
      ],
      settings: {
        foreground: c.magenta.l
      }
    },
    {
      scope: "meta.scope.prerequisites",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "entity.name.function.target",
      settings: {
        fontStyle: "bold",
        foreground: c.green.l
      }
    },
    {
      scope: [
        "storage.modifier.import.java",
        "storage.modifier.package.java"
      ],
      settings: {
        foreground: c.grey[3]
      }
    },
    {
      scope: [
        "keyword.other.import.java",
        "keyword.other.package.java"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "storage.type.java",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "storage.type.annotation",
      settings: {
        fontStyle: "bold",
        foreground: c.blue.l
      }
    },
    {
      scope: "keyword.other.documentation.javadoc",
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "comment.block.javadoc variable.parameter.java",
      settings: {
        fontStyle: "bold",
        foreground: c.green.l
      }
    },
    {
      scope: [
        "source.java variable.other.object",
        "source.java variable.other.definition.java"
      ],
      settings: {
        foreground: c.grey[1]
      }
    },
    {
      scope: "meta.function-parameters.lisp",
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: "markup.underline",
      settings: {
        fontStyle: "underline"
      }
    },
    {
      scope: "string.other.link.title.markdown",
      settings: {
        fontStyle: "underline",
        foreground: c.grey[5]
      }
    },
    {
      scope: "markup.underline.link",
      settings: {
        foreground: c.magenta.l
      }
    },
    {
      scope: "markup.bold",
      settings: {
        fontStyle: "bold", foreground: c.orange.l

      }
    },
    {
      scope: "markup.heading",
      settings: {
        fontStyle: "bold", foreground: c.orange.l

      }
    },
    {
      scope: "heading.1.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.l
      }
    },
    {
      scope: "heading.2.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold", foreground: c.orange.l

      }
    },
    {
      scope: "heading.3.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.orange.l
      }
    },
    {
      scope: "heading.4.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.green.l
      }
    },
    {
      scope: "heading.5.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.blue.l
      }
    },
    {
      scope: "heading.6.markdown entity.name.section.markdown",
      settings: {
        fontStyle: "bold",
        foreground: c.magenta.l
      }
    },
    {
      scope: "markup.italic",
      settings: {
        fontStyle: "italic"
      }
    },
    {
      scope: "markup.inserted",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: "markup.deleted",
      settings: {
        foreground: c.orange.m
      }
    },
    {
      scope: "markup.changed",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "markup.punctuation.quote.beginning",
      settings: {
        foreground: c.green.m
      }
    },
    {
      scope: "markup.punctuation.list.beginning",
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: [
        "markup.inline.raw",
        "markup.fenced_code.block"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: "string.quoted.double.json",
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: "entity.other.attribute-name.css",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "source.css meta.selector",
      settings: {
        foreground: c.grey[1]
      }
    },
    {
      scope: "support.type.property-name.css",
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: "entity.other.attribute-name.class",
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: [
        "source.css support.function.transform",
        "source.css support.function.timing-function",
        "source.css support.function.misc"
      ],
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "support.property-value",
        "constant.rgb-value",
        "support.property-value.scss",
        "constant.rgb-value.scss"
      ],
      settings: {
        foreground: c.orange.m
      }
    },
    {
      scope: [
        "entity.name.tag.css"
      ],
      settings: {
        fontStyle: ""
      }
    },
    {
      scope: [
        "punctuation.definition.tag"
      ],
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: [
        "text.html entity.name.tag",
        "text.html punctuation.tag"
      ],
      settings: {
        // fontStyle: "bold",
        foreground: c.cyan.l
      }
    },
    {
      scope: [
        "source.js variable.language"
      ],
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: [
        "source.ts variable.language"
      ],
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: [
        "source.go storage.type"
      ],
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "source.go entity.name.import"
      ],
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: [
        "source.go keyword.package",
        "source.go keyword.import"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: [
        "source.go keyword.interface",
        "source.go keyword.struct"
      ],
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: [
        "source.go entity.name.type"
      ],
      settings: {
        foreground: c.grey[1]
      }
    },
    {
      scope: [
        "source.go entity.name.function"
      ],
      settings: {
        foreground: c.magenta.l
      }
    },
    {
      scope: [
        "keyword.control.cucumber.table"
      ],
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: [
        "source.reason string.double",
        "source.reason string.regexp"
      ],
      settings: {
        foreground: c.green.l
      }
    },
    {
      scope: [
        "source.reason keyword.control.less"
      ],
      settings: {
        foreground: c.cyan.l
      }
    },
    {
      scope: [
        "source.reason entity.name.function"
      ],
      settings: {
        foreground: c.blue.l
      }
    },
    {
      scope: [
        "source.reason support.property-value",
        "source.reason entity.name.filename"
      ],
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: [
        "source.powershell variable.other.member.powershell"
      ],
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: [
        "source.powershell support.function.powershell"
      ],
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "source.powershell support.function.attribute.powershell"
      ],
      settings: {
        foreground: c.grey[3]
      }
    },
    {
      scope: [
        "source.powershell meta.hashtable.assignment.powershell variable.other.readwrite.powershell"
      ],
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: [
        "support.function.be.latex",
        "support.function.general.tex",
        "support.function.section.latex",
        "support.function.textbf.latex",
        "support.function.textit.latex",
        "support.function.texttt.latex",
        "support.function.emph.latex",
        "support.function.url.latex"
      ],
      settings: {
        foreground: c.orange.l
      }
    },
    {
      scope: [
        "support.class.math.block.tex",
        "support.class.math.block.environment.latex"
      ],
      settings: {
        foreground: c.orange.l

      }
    },
    {
      scope: [
        "keyword.control.preamble.latex",
        "keyword.control.include.latex"
      ],
      settings: {
        foreground: c.magenta.l
      }
    },
    {
      scope: [
        "support.class.latex"
      ],
      settings: {
        foreground: c.cyan.l
      }
    }
  ],
  type: "dark"
};
