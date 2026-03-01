# Incompressibility Principle と多次元構造

## Incompressibility Principle（非圧縮性原理）

gemology（宝石学）、material science（材料科学）、pathology（病理学）など、異質な学術領域を一つの階層に統合しようとすると、**情報の損失**または**不自然な強制**が発生する。

- **Gemology**: 鉱物学・美学・商業の交点。単一の「親」に収まらない
- **Material Science**: 物理学・化学・工学の境界。スケールも原子〜マクロまで連続
- **Pathology**: 医学・生物学・統計学の統合。対象は組織・病因・診断

これらを一つの樹形図に押し込むと、いずれかが歪む。**一つの軸では表現しきれない** — これが Incompressibility Principle である。

### 設計方針

**一つの階層にまとめない。複数の判断軸を並列に持ち、各エントリは多次元空間上の点として表現する。**

---

## 多次元判断軸（Dimensions）

各軸は**独立**であり、**直交**を目指す。一つのエントリは複数の軸に同時に値を持つ。

### Axis 1: Subject（対象の性質）

| 値 | 説明 | 例 |
|----|------|-----|
| `inorganic_material` | 無機物・鉱物 | gemology, metallurgy |
| `organic_material` | 有機物・高分子 | polymer science |
| `biological` | 生物・生体 | pathology, physiology |
| `conceptual` | 概念・記号 | mathematics, logic |
| `hybrid` | 複合 | biomaterials, bioinformatics |

### Axis 2: Scale（スケール）

| 値 | 説明 | 例 |
|----|------|-----|
| `subatomic` | 素粒子・量子 | particle physics |
| `atomic_molecular` | 原子・分子 | chemistry, crystallography |
| `nanoscale` | ナノ | nanotechnology |
| `microscale` | マイクロ | materials science, histology |
| `macroscale` | マクロ | gemology (宝石), mechanics |
| `organism` | 個体 | pathology, clinical medicine |
| `population` | 集団 | epidemiology, ecology |

### Axis 3: Intent（目的・意図）

| 値 | 説明 | 例 |
|----|------|-----|
| `aesthetic` | 美的・文化的 | gemology, art conservation |
| `industrial` | 産業・製造 | material science, chemical engineering |
| `diagnostic` | 診断・判定 | pathology, radiology |
| `therapeutic` | 治療・介入 | pharmacology, surgery |
| `fundamental` | 基礎理解 | pure mathematics, theoretical physics |

### Axis 4: Domain（学術領域・FOS）

OECD FOS に準拠。既存の `academic.domain` と対応。

| 値 | 例 |
|----|-----|
| `natural_sciences` | physics, chemistry, geology |
| `engineering_technology` | materials engineering, computer science |
| `medical_health` | pathology, radiology |
| `agricultural_sciences` | soil science |
| `social_sciences` | — |
| `humanities` | art history (gemology の一部) |

### Axis 5: Temporality（時間軸の扱い）

| 値 | 説明 | 例 |
|----|------|-----|
| `formation` | 生成・形成過程 | crystallography, gem formation |
| `steady_state` | 平衡・現状 | material properties |
| `degradation` | 劣化・病変 | pathology, corrosion |
| `evolution` | 進化・変化 | evolutionary biology |

### Axis 6: Industry（産業・応用先）

既存の `industry` と対応。補助軸。

---

## 例: Gemology, Material Science, Pathology の多次元表現

| 軸 | Gemology | Material Science | Pathology |
|----|----------|------------------|-----------|
| **Subject** | inorganic_material, hybrid | inorganic_material, organic_material | biological |
| **Scale** | macroscale, atomic_molecular (構造) | atomic_molecular 〜 macroscale | microscale, organism |
| **Intent** | aesthetic, industrial | industrial, fundamental | diagnostic, therapeutic |
| **Domain** | natural_sciences, humanities | engineering_technology, natural_sciences | medical_health |
| **Temporality** | formation, steady_state | steady_state, formation | degradation, steady_state |

一つのエントリに複数値を持つことも可（例: Gemology は aesthetic かつ industrial）。

---

## スキーマでの表現

`dimensions` プロパティで、軸名と値のペアを列挙する。軸は拡張可能。

```json
{
  "dimensions": [
    { "axis": "subject", "value": "inorganic_material" },
    { "axis": "scale", "value": "macroscale" },
    { "axis": "scale", "value": "atomic_molecular" },
    { "axis": "intent", "value": "aesthetic" },
    { "axis": "intent", "value": "industrial" },
    { "axis": "domain", "value": "natural_sciences" },
    { "axis": "temporality", "value": "formation" }
  ]
}
```

**検索・フィルタ**: 任意の軸の組み合わせでクエリ可能。例: `subject=biological AND intent=diagnostic` → pathology 周辺。

---

## まとめ

| 原理 | 内容 |
|------|------|
| **Incompressibility** | 異質な領域を一つの階層に圧縮すると情報が失われる |
| **多次元表現** | 複数の独立した判断軸で位置づける |
| **直交性** | 各軸は独立。組み合わせで表現力が増す |
| **拡張性** | 新たな軸を追加可能。既存データは影響を受けない |
