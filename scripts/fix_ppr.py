# -*- coding: utf-8 -*-
"""构建后处理：清除同一段落内多余的 <a:pPr>（富文本混排会产生重复 pPr，
PowerPoint 会重排版导致行序错乱）。每次 node build 之后必须运行：
    python fix_ppr.py "输出文件.pptx"
"""
import sys, zipfile, shutil
from lxml import etree

A = "http://schemas.openxmlformats.org/drawingml/2006/main"
def tag(t): return f"{{{A}}}{t}"

def main(path):
    tmp = path + ".tmp"
    fixed = 0
    with zipfile.ZipFile(path) as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename.startswith("ppt/slides/slide") and item.filename.endswith(".xml"):
                root = etree.fromstring(data)
                for p in root.iter(tag("p")):
                    pprs = p.findall(tag("pPr"))
                    for extra in pprs[1:]:
                        p.remove(extra)
                        fixed += 1
                data = etree.tostring(root, xml_declaration=True, encoding="UTF-8", standalone=True)
            zout.writestr(item, data)
    shutil.move(tmp, path)
    print(f"fix_ppr: removed {fixed} duplicate pPr -> {path}")

if __name__ == "__main__":
    main(sys.argv[1])
