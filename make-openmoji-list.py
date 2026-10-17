#!/usr/bin/env python3
"""
openmoji-categorized フォルダ内の PNG を全部探して、
index.html が読み込む「openmoji-list.js」を作るスクリプトです。

使い方（index.html と同じ場所で実行）:
    python3 make-openmoji-list.py
フォルダ名が違う場合:
    python3 make-openmoji-list.py images/openmoji-categorized

アイコン画像を追加・削除したときは、もう一度実行すれば一覧が更新されます。
"""
import os, sys
from urllib.parse import quote

here   = os.path.dirname(os.path.abspath(__file__))
folder = sys.argv[1] if len(sys.argv) > 1 else "openmoji-categorized"
root   = os.path.join(here, folder)

if not os.path.isdir(root):
    sys.exit(f"フォルダが見つかりません: {root}")

paths = []
for dirpath, _dirs, files in os.walk(root):
    for f in files:
        if f.lower().endswith(".png"):
            rel = os.path.relpath(os.path.join(dirpath, f), here).replace(os.sep, "/")
            paths.append(quote(rel, safe="/"))  # 日本語・記号を含むファイル名でも安全に
paths.sort()

out = os.path.join(here, "openmoji-list.js")
with open(out, "w", encoding="utf-8") as fp:
    fp.write("/* make-openmoji-list.py で自動生成（手で編集しない） */\n")
    fp.write("const OPENMOJI_ICONS = [\n")
    fp.write(",\n".join(f'  "{p}"' for p in paths))
    fp.write("\n];\n")

print(f"{len(paths)} 枚 → {out}")
