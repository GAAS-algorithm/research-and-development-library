# パッケージ化できない多次元複雑系

R&D Library の設計哲学を表す中核概念。

## 定義

| 要素 | 意味 |
|------|------|
| **パッケージ化できない** | Incompressibility Principle。異質な領域（gemology, material science, pathology 等）を一つの階層・樹形図に統合すると情報が失われる。単一の「箱」に収められない。 |
| **多次元** | 複数の独立した判断軸で表現。subject, scale, intent, domain, dimensions, frontier_topics, foundational_math, industry 等。一つの座標系では表現しきれない。 |
| **複雑系** | 数学↔R&D の双方向共創、非線形な影響関係、`informs` / `informed_by` によるネットワーク。単純なパイプラインではない。 |

## 単純なパッケージ（本スキーマが採用しないモデル）

```
[数学] → [R&D] → [産業]
一方向・階層・圧縮可能
```

## 多次元複雑系（本スキーマのモデル）

```
軸1 ─┬─ 軸2 ─┬─ 軸3 ─┬─ ...
     │        │        │
双方向リンク・非圧縮・emergent
```

## 関連ファイル

| ファイル | 役割 |
|---------|------|
| `dimensions.md` | Incompressibility Principle、多次元判断軸 |
| `dimensions-taxonomy.json` | 軸の定義 |
| `rd-math-relationship.md` | 双方向共創（複雑系の一側面） |
| `frontier-topics.json` | ブレイクスルー予測領域 |
| `foundational-mathematics.json` | 純粋数学の分類 |
