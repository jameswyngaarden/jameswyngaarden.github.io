from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

def get_glyph_path(font_path, glyph_name):
    font = TTFont(font_path)
    glyph_set = font.getGlyphSet()
    pen = SVGPathPen(glyph_set)
    glyph_set[glyph_name].draw(pen)
    return pen.getCommands()

font_file = "subset.ttf" # Use the .ttf version fonttools made
for char in ["J", "B", "W", "I"]:
    print(f"Path for {char}:")
    print(get_glyph_path(font_file, char))
    print("-" * 20)
