# R&D Library Schema

世界最先端のR&Dを社内DBとして管理するためのデータスキーマ。  
**学術分野を主軸、産業分類を補助軸**とするハイブリッド設計。  
生物学の分類階層（界・門・綱・目・科・属・種）を参考にした階層構造。

## 設計方針

| 軸 | 役割 | 参考体系 |
|----|------|----------|
| **学術（主軸）** | 研究の本質・内容の分類 | OECD FOS, UNESCO, arXiv, ACM CCS |
| **産業（補助軸）** | 応用・事業との紐付け | GICS, 日本標準産業分類 |

## パッケージ化できない多次元複雑系

R&D Library の設計哲学。単一階層に圧縮できず、複数軸で表現し、双方向リンクを持つ複雑系。詳細は `multidimensional-complex-system.md` 参照。

## Incompressibility Principle（非圧縮性原理）

gemology、material science、pathology など異質な領域を一つの階層に統合すると情報が失われる。**複数の判断軸を持つ多次元構造**で表現する。詳細は `dimensions.md` 参照。

## ファイル構成

```
schema/
├── rd-entry.schema.json          # メインエントリスキーマ
├── rd-categories.json            # R&D カテゴリ体系（ファイル別一覧）
├── research-awards.json         # 研究者格付けコンペティション（Nobel, Abel, Fields等）
├── research-awards-check.md     # 賞の規模・インパクトチェック結果
├── major-awards-detail.md       # Breakthrough, Nobel, Abel, Fields, Lasker の詳細
├── institutions-index.json       # 世界の主要研究機関一覧（抜け漏れチェック用）
├── institutions-gap-analysis.md  # 機関抜け漏れチェック結果
├── multidimensional-complex-system.md  # パッケージ化できない多次元複雑系
├── academic-taxonomy.json        # 学術分野の分類体系（生物学階層参考）
├── industry-taxonomy.json        # 産業分類体系（GICS準拠）
├── dimensions-taxonomy.json      # 多次元判断軸の定義
├── dimensions.md                # Incompressibility Principle の説明
├── frontier-topics.json          # ブレイクスルー予測領域（別トピック化）
├── foundational-mathematics.json # 純粋数学（IAS, IHES等）の分類
├── rd-math-relationship.md      # R&D と数学の双方向共創関係
└── README.md                    # 本ドキュメント

data/
└── nobel-prizes.json            # ノーベル賞全部門受賞者（1901-2025）、発見・方程式
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

## Frontier Topics（ブレイクスルー予測領域）

通常の学術分類に収まらず、**別トピックとして重点追跡**すべき領域。`frontier-topics.json` で定義。

| トピック | 説明 |
|---------|------|
| nuclear_fission | 核分裂（SMR、溶融塩炉、廃棄物処理） |
| nuclear_fusion | 核融合（ITER、レーザー核融合、民間） |
| superconductivity | 超伝導（室温超伝導、実用化） |
| quantum_computing | 量子コンピューティング |
| artificial_general_intelligence | 汎用人工知能 |
| synthetic_biology | 合成生物学 |
| brain_computer_interface | 脳コンピュータインターフェース |
| carbon_capture_utilization | 二酸化炭素回収・利用 |
| space_propulsion | 宇宙推進 |
| longevity_aging | 長寿・老化 |
| solid_state_battery | 全固体電池 |
| geothermal_deep | 深部地熱 |
| gravitational_wave | 重力波（LIGO, LISA, マルチメッセンジャー） |
| particle_physics | 素粒子物理学（zepto second, subattometer） |
| semiconductors | 半導体・AIハードウェア |
| post_quantum_cryptography | 量子耐性暗号 |
| climate_weather_ai | 気候・気象AI |
| precision_medicine_ai | 精密医療AI |
| cybersecurity | サイバーセキュリティ |
| trustworthy_ai | 信頼性の高いAI・AI安全 |

各トピックに `top_institutions`（Top 3 機関）と `also_notable`（追加機関）を定義。引用・追跡の参照先として利用。

## Nobel Prizes（ノーベル賞データ）

`data/nobel-prizes.json` に全部門（物理・化学・医学生理学・文学・平和・経済学）の受賞者を創設年（1901）から順に記載。主な発見（discovery）と代表的な方程式（representative_equation、該当する場合）を付与。

## Research Awards（研究者格付けコンペティション）

`research-awards.json` で主要賞を規模・インパクト順に定義。創設経緯・特徴・過去受賞者の詳細は `major-awards-detail.md`。

| Tier | 賞 | 分野 |
|------|-----|------|
| 1 | Nobel, Breakthrough, Abel, Fields, Turing, Lasker, Copley | 各分野最高峰 |
| 2 | Kyoto, Crafoord, Wolf, Shaw, Kavli, Gairdner, Brain Prize | |
| 3 | Gauss, Millennium Technology | |

## Foundational Mathematics（純粋数学）

IAS, IHES 等が研究する最先端の数理（model, functor, duality, 幾何）。**R&D と双方向共創** — 数学→R&D のブレイクスルーも R&D→数学 のブレイクスルーもあり得る。前工程でも同列の下位でもない。詳細は `rd-math-relationship.md`。

| 軸 | 例 |
|----|-----|
| **Framework** | category_theory, model_theory, sheaf_theory |
| **Core Concept** | functor, duality, model, moduli |
| **Duality Type** | langlands_duality, serre_duality, isbell_duality |
| **Geometric Area** | algebraic_geometry, arithmetic_geometry, p_adic_geometry |

```json
{
  "foundational_math": {
    "framework": "category_theory",
    "core_concept": "duality",
    "duality_type": "langlands_duality",
    "geometric_area": "algebraic_geometry"
  },
  "informs": ["entry-rd-042"],
  "informed_by": []
}
```

```json
{
  "frontier_topics": ["nuclear_fusion", "superconductivity"]
}
```

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
  "frontier_topics": ["artificial_general_intelligence"],
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
