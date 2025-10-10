# Generated with tex2nix 0.0.0
{
  texlive,
  extraTexPackages ? { },
}:
(texlive.combine (
  {
    inherit (texlive) scheme-small;
    "amsmath" = texlive."amsmath";
    "atbegshi" = texlive."atbegshi";
    "atveryend" = texlive."atveryend";
    "bitset" = texlive."bitset";
    "capt-of" = texlive."capt-of";
    "cmap" = texlive."cmap";
    "colortbl" = texlive."colortbl";
    "etexcmds" = texlive."etexcmds";
    "etoolbox" = texlive."etoolbox";
    "fancyvrb" = texlive."fancyvrb";
    "float" = texlive."float";
    "fncychap" = texlive."fncychap";
    "fontspec" = texlive."fontspec";
    "framed" = texlive."framed";
    "geometry" = texlive."geometry";
    "gettitlestring" = texlive."gettitlestring";
    "hopatch" = texlive."hopatch";
    "hycolor" = texlive."hycolor";
    "hypcap" = texlive."hypcap";
    "hyperref" = texlive."hyperref";
    "iftex" = texlive."iftex";
    "infwarerr" = texlive."infwarerr";
    "intcalc" = texlive."intcalc";
    "kvdefinekeys" = texlive."kvdefinekeys";
    "kvoptions" = texlive."kvoptions";
    "kvsetkeys" = texlive."kvsetkeys";
    "letltxmacro" = texlive."letltxmacro";
    "ltxcmds" = texlive."ltxcmds";
    "minitoc" = texlive."minitoc";
    "needspace" = texlive."needspace";
    "ntheorem" = texlive."ntheorem";
    "parskip" = texlive."parskip";
    "pdfescape" = texlive."pdfescape";
    "pdftexcmds" = texlive."pdftexcmds";
    "polyglossia" = texlive."polyglossia";
    "refcount" = texlive."refcount";
    "rerunfilecheck" = texlive."rerunfilecheck";
    "stringenc" = texlive."stringenc";
    "tabulary" = texlive."tabulary";
    "titlesec" = texlive."titlesec";
    "uniquecounter" = texlive."uniquecounter";
    "upquote" = texlive."upquote";
    "url" = texlive."url";
    "varwidth" = texlive."varwidth";
    "wrapfig" = texlive."wrapfig";
    "xcolor" = texlive."xcolor";

  }
  // extraTexPackages
))
