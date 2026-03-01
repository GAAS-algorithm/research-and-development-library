# 機関抜け漏れチェック結果

世界の予算規模・著名度の高い研究機関とスキーマ内の `top_institutions` の照合結果。

## 抜け漏れ（missing / underrepresented）

### アカデミック（Nature Index 上位）

| 機関 | 国 | 備考 |
|------|-----|------|
| **Chinese Academy of Sciences (CAS)** | 中国 | Nature Index #1 |
| **Harvard University** | 米国 | Nature Index #2 |
| **University of Science and Technology of China (USTC)** | 中国 | Nature Index #3 |
| **University of Chinese Academy of Sciences (UCAS)** | 中国 | Nature Index #5 |
| **University of Oxford** | 英国 | THE #1 |
| **University of Cambridge** | 英国 | |
| **ETH Zurich** | スイス | |
| **EPFL** | スイス | |
| **University of Tokyo** | 日本 | |
| **Tsinghua University** | 中国 | |
| **Peking University** | 中国 | |

### 国立研究機関

| 機関 | 国 | 備考 |
|------|-----|------|
| **CNRS** | 仏 | 欧州最大級、€4B予算 |
| **RIKEN** | 日本 | 日本最大の総合研究所 |
| **Fraunhofer-Gesellschaft** | 独 | 応用研究、€3.6B |
| **Helmholtz Association** | 独 | |
| **NIH** | 米国 | 約$47B、医療研究 |
| **NSF** | 米国 | 基礎研究助成 |
| **AIST (産総研)** | 日本 | |
| **JST** | 日本 | |

### 企業R&D

| 機関 | 国 | 備考 |
|------|-----|------|
| **Amazon** | 米国 | R&D世界最大 $68B |
| **Meta** | 米国 | $44B |
| **NVIDIA** | 米国 | AI半導体 |
| **Huawei** | 中国 | $26B |

## スキーマに含まれる機関（抜粋）

- MIT, IBM, Google, Microsoft, NIST, NASA, CERN, Fermilab, SLAC
- IAS, IHES, Max Planck
- Broad Institute, Stanford, Caltech
- OpenAI, Anthropic, DeepMind
- ITER, TerraPower, Climeworks, QuantumScape, etc.

## 対応済み（2025-03）

- **frontier_topics** に `also_notable` を追加
- CAS, CNRS, RIKEN, Harvard, Oxford, Cambridge, ETH, Fraunhofer, Helmholtz, USTC, Huawei, Amazon, Meta 等を各トピックに割り当て
- **foundational-mathematics** に Oxford, Cambridge, Princeton, CAS, RIKEN を追加
