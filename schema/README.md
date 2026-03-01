# R&D Library Schema

世界最先端のR&Dを社内DBとして管理するためのデータスキーマ。  
**学術分野を主軸、産業分類を補助軸**とするハイブリッド設計。  
生物学の分類階層（界・門・綱・目・科・属・種）を参考にした階層構造。

## 設計方針

| 軸 | 役割 | 参考体系 |
|----|------|----------|
| **学術（主軸）** | 研究の本質・内容の分類 | OECD FOS, UNESCO, arXiv, ACM CCS |
| **産業（補助軸）** | 応用・事業との紐付け | GICS, 日本標準産業分類 |

## Incompressibility Principle（非圧縮性原理）

gemology、material science、pathology など異質な領域を一つの階層に統合すると情報が失われる。**複数の判断軸を持つ多次元構造**で表現する。詳細は `dimensions.md` 参照。

## ファイル構成

```
schema/
├── rd-entry.schema.json     # メインエントリスキーマ
├── academic-taxonomy.json  # 学術分野の分類体系（生物学階層参考）
├── industry-taxonomy.json  # 産業分類体系（GICS準拠）
├── dimensions-taxonomy.json# 多次元判断軸の定義
├── dimensions.md           # Incompressibility Principle の説明
└── README.md               # 本ドキュメント
```

## 学術タクソノミー（生物学階層との対応）

| 階層 | 生物学 | 学術 | 例 |
|------|--------|------|-----|
| 1 | 界 (Kingdom) | Domain | natural_sciences, engineering_technology |
| 2 | 門 (Phylum) | Field | mathematics, physics, computer_science |
| 3 | 綱 (Class) | Discipline | algebra, artificial_intelligence |
| 4 | 目 (Order) | Subdiscipline | group_theory, deep_learning |
| 5 | 科 (Family) | Specialty | Lie groups, transformers |
| 6 | 属 (Genus) | Topic | 研究トピック |
| 7 | 種 (Species) | Focus | 個別の研究焦点 |

**必須**: Domain, Field  
**推奨**: Discipline, Subdiscipline  
**任意**: Specialty, Topic, Focus（粒度に応じて）

## 産業タクソノミー

| 階層 | 例 |
|------|-----|
| Sector | information_technology, health_care |
| Industry Group | software, biotechnology |
| Industry | 74産業 |
| Sub-Industry | 163サブ産業 |
| Application | 応用分野（R&D固有） |

## 引用ルール

- **origin が日本**: 日本語で引用可
- **origin が日本以外**: **origin言語**で引用（英語論文→英語、独語→独語など）

## 多次元表現（dimensions）

一つの階層に収まらない領域は `dimensions` で複数軸に値を付与する。

```json
{
  "dimensions": [
    { "axis": "subject", "value": "inorganic_material" },
    { "axis": "scale", "value": "macroscale" },
    { "axis": "intent", "value": "aesthetic" },
    { "axis": "intent", "value": "industrial" }
  ]
}
```

## 使用例

```json
{
  "id": "uuid-xxx",
  "title": "Attention Is All You Need",
  "title_ja": "Attention Is All You Need",
  "origin": {
    "organization": "Google",
    "country": "US",
    "language": "en",
    "person": "Vaswani et al."
  },
  "citation": "Vaswani, A., et al. (2017). Attention Is All You Need. NeurIPS.",
  "academic": {
    "domain": "engineering_technology",
    "field": "computer_science",
    "discipline": "artificial_intelligence",
    "subdiscipline": "deep_learning",
    "specialty": "transformers",
    "research_type": "applied"
  },
  "industry": {
    "sector": "information_technology",
    "application": "nlp"
  },
  "source": {
    "type": "paper",
    "year": 2017,
    "venue": "NeurIPS"
  },
  "maturity": "commercialized",
  "dimensions": [
    { "axis": "subject", "value": "conceptual" },
    { "axis": "scale", "value": "atomic_molecular" },
    { "axis": "intent", "value": "fundamental" },
    { "axis": "domain", "value": "engineering_technology" }
  ]
}
```

## 参照

- [OECD Frascati Manual 2015](https://www.oecd.org/publications/frascati-manual-2015-9789264239012-en.htm)
- [Fields of Science and Technology (FOS)](https://en.wikipedia.org/wiki/Fields_of_Science_and_Technology)
- [GICS - Global Industry Classification Standard](https://www.msci.com/gics)
- [arXiv Category Taxonomy](https://arxiv.org/category_taxonomy)
