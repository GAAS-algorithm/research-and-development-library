# R&D Library Data

## nobel-prizes.json

ノーベル賞全部門の受賞者（1901-2025）。創設年から順番に記載。

### 構造

```json
{
  "categories": {
    "physics": [...],
    "chemistry": [...],
    "physiology_or_medicine": [...],
    "literature": [...],
    "peace": [...],
    "economic_sciences": [...]
  }
}
```

### 各エントリ

- `year`: 授賞年
- `laureates`: 受賞者名の配列
- `discovery`: 主な発見・授賞理由（Nobel.org 公式）
- `representative_equation`: 代表的な方程式（該当する場合のみ）

### 代表的な方程式の例

| 部門 | 例 |
|------|-----|
| Physics | E=mc² (Einstein), E=hν (Planck), Schrödinger方程式, [x,p]=iℏ (Heisenberg) |
| Chemistry | Nernst方程式, Arrhenius式 |
| Medicine | Hodgkin–Huxley方程式 |
| Economics | Black–Scholes式, Nash均衡 |
