#!/usr/bin/env python3
"""
Add discovery_en and representative_formula_en fields to tier1-awards-laureates.json.
Translates Japanese discovery and representative_formula to English with accurate
mathematical/scientific terminology.
"""

import json
import sys
from pathlib import Path
from typing import Optional

# Translation mappings for discovery and representative_formula
# Keys: Japanese text (exact match), Values: English translation
DISCOVERY_TRANSLATIONS = {
    "数学における革新的貢献": "Revolutionary contributions to mathematics",
    "3次元多様体の虚双曲幾何学": "Virtual hyperbolic geometry of 3-manifolds",
    "解析学・組み合わせ論・数論への貢献": "Contributions to analysis, combinatorics, and number theory",
    "ミニマルモデルプログラムと双有理幾何学": "Minimal model program and birational geometry",
    "Langlandsプログラムへの貢献": "Contributions to the Langlands program",
    "モジュラー空間の動力学": "Dynamics of moduli spaces",
    "確率偏微分方程式の理論": "Theory of stochastic partial differential equations",
    "代数解析学・ホッジ理論": "Algebraic analysis, Hodge theory",
    "理論計算機科学・スペクトラルグラフ理論": "Theoretical computer science, spectral graph theory",
    "微分幾何学・偏微分方程式": "Differential geometry, partial differential equations",
    "位相・代数幾何・数論への貢献": "Contributions to topology, algebraic geometry, and number theory",
    "指数定理の発見と証明": "Discovery and proof of the index theorem",
    "偏微分方程式の理論": "Theory of partial differential equations",
    "調和解析・力学系": "Harmonic analysis, dynamical systems",
    "大偏差理論": "Large deviation theory",
    "群論の基礎的貢献": "Fundamental contributions to group theory",
    "幾何学への革命的貢献": "Revolutionary contributions to geometry",
    "数論への広範な貢献": "Broad contributions to number theory",
    "トポロジー・幾何学・代数学": "Topology, geometry, algebra",
    "離散数学・理論計算機科学": "Discrete mathematics, theoretical computer science",
    "代数幾何・数論": "Algebraic geometry, number theory",
    "力学系・エルゴード理論": "Dynamical systems, ergodic theory",
    "フェルマーの最終定理の証明": "Proof of Fermat's Last Theorem",
    "ウェーブレット理論": "Wavelet theory",
    "Langlandsプログラム": "Langlands program",
    "幾何解析・ゲージ理論": "Geometric analysis, gauge theory",
    "エルゴード理論・格子群": "Ergodic theory, lattice groups",
    "理論計算機科学・離散数学": "Theoretical computer science, discrete mathematics",
    "トポロジー・力学系": "Topology, dynamical systems",
    "偏微分方程式の正則性理論": "Regularity theory of partial differential equations",
    "確率論・関数解析": "Probability theory, functional analysis",
    "被覆曲面論、プラトー問題": "Covering surface theory, Plateau problem",
    "超関数論、ゼータ関数": "Distribution theory, zeta functions",
    "代数幾何、層のコホモロジー": "Algebraic geometry, sheaf cohomology",
    "数論、特異点論": "Number theory, singularity theory",
    "偏微分方程式、微分トポロジー": "Partial differential equations, differential topology",
    "K理論、連続体仮説、スキーム論、微分トポロジー": "K-theory, continuum hypothesis, scheme theory, differential topology",
    "超越数論、特異点解消、トポロジー、有限群": "Transcendental number theory, resolution of singularities, topology, finite groups",
    "大篩法、代数曲面": "Large sieve, algebraic surfaces",
    "Weil予想、多変数複素解析、格子群、代数K理論": "Weil conjectures, several complex variables, lattice groups, algebraic K-theory",
    "作用素環、3次元多様体、Calabi-Yau": "Operator algebras, 3-manifolds, Calabi-Yau",
    "4次元多様体、Mordell予想": "4-manifolds, Mordell conjecture",
    "量子群、Jones多項式、双有理幾何、数理物理": "Quantum groups, Jones polynomial, birational geometry, mathematical physics",
    "解析学、粘性解、力学系、有限群": "Analysis, viscosity solutions, dynamical systems, finite groups",
    "モンスター群、組み合わせ論、ミラー対称性、力学系": "Monster group, combinatorics, mirror symmetry, dynamical systems",
    "Langlands対応、 motivic cohomology": "Langlands correspondence, motivic cohomology",
    "確率論、Poincaré予想、解析学、SLE": "Probability theory, Poincaré conjecture, analysis, SLE",
    "エルゴード理論、Fundamental Lemma、パーコレーション、輸送理論": "Ergodic theory, Fundamental Lemma, percolation, transport theory",
    "力学系、数論、SPDE、モジュライ空間": "Dynamical systems, number theory, SPDE, moduli spaces",
    "双有理幾何、最適輸送、perfectoid空間、数論": "Birational geometry, optimal transport, perfectoid spaces, number theory",
    "統計力学、組み合わせ論、素数、球充填": "Statistical mechanics, combinatorics, prime numbers, sphere packing",
    "プログラミング技法・コンパイラ": "Programming techniques, compilers",
    "EDSAC、プログラムライブラリ": "EDSAC, program libraries",
    "誤り検出・訂正符号": "Error-correcting codes",
    "人工知能の創設": "Founding of artificial intelligence",
    "数値解析・後方誤差解析": "Numerical analysis, backward error analysis",
    "人工知能・LISP": "Artificial intelligence, LISP",
    "構造化プログラミング": "Structured programming",
    "データベース技術": "Database technology",
    "アルゴリズム解析・TeX": "Algorithm analysis, TeX",
    "AI・認知科学・リスト処理": "AI, cognitive science, list processing",
    "非決定性有限オートマトン": "Nondeterministic finite automata",
    "FORTRAN・BNF": "FORTRAN, BNF",
    "プログラム検証・アルゴリズム": "Program verification, algorithms",
    "APL言語": "APL language",
    "プログラミング言語設計": "Programming language design",
    "リレーショナルデータベース": "Relational database",
    "NP完全性の理論": "Theory of NP-completeness",
    "UNIXオペレーティングシステム": "UNIX operating system",
    "Pascal・Modula": "Pascal, Modula",
    "NP完全性・アルゴリズム理論": "NP-completeness, algorithm theory",
    "アルゴリズム・データ構造": "Algorithms, data structures",
    "コンパイラ・RISC": "Compilers, RISC",
    "コンピュータグラフィックス・Sketchpad": "Computer graphics, Sketchpad",
    "浮動小数点演算": "Floating-point arithmetic",
    "CTSS・Multics": "CTSS, Multics",
    "ML・型推論・CCS": "ML, type inference, CCS",
    "分散PC・ワークステーション": "Distributed PCs, workstations",
    "計算量理論の基礎": "Foundations of computational complexity theory",
    "大規模AIシステム": "Large-scale AI systems",
    "計算量理論・暗号": "Computational complexity theory, cryptography",
    "時相論理・プログラム検証": "Temporal logic, program verification",
    "マウス・ハイパーテキスト": "Mouse, hypertext",
    "データベース・トランザクション": "Database transactions",
    "コンピュータアーキテクチャ・OS": "Computer architecture, operating systems",
    "計算理論・暗号・通信複雑度": "Computational theory, cryptography, communication complexity",
    "オブジェクト指向・Simula": "Object-oriented programming, Simula",
    "公開鍵暗号RSA": "Public-key cryptography RSA",
    "オブジェクト指向・Smalltalk": "Object-oriented programming, Smalltalk",
    "TCP/IP・インターネット": "TCP/IP, Internet",
    "ALGOL 60・コンパイラ": "ALGOL 60, compilers",
    "最適化コンパイラ": "Optimizing compilers",
    "モデルチェッキング": "Model checking",
    "データ抽象・分散計算": "Data abstraction, distributed computing",
    "Alto・イーサネット": "Alto, Ethernet",
    "PAC学習・計算理論": "PAC learning, computational theory",
    "確率・因果推論": "Probability, causal inference",
    "暗号の計算量理論的基礎": "Computational complexity foundations of cryptography",
    "分散システム・論理クロック": "Distributed systems, logical clocks",
    "データベースシステム": "Database systems",
    "公開鍵暗号・鍵交換": "Public-key cryptography, key exchange",
    "World Wide Web": "World Wide Web",
    "コンピュータアーキテクチャ": "Computer architecture",
    "ディープラーニング": "Deep learning",
    "3D CG・Pixar": "3D computer graphics, Pixar",
    "コンパイラ・ドラゴンブック": "Compilers, Dragon Book",
    "数値アルゴリズム・LINPACK": "Numerical algorithms, LINPACK",
    "イーサネット": "Ethernet",
    "計算理論・乱択": "Computational theory, randomization",
    "強化学習の基礎": "Foundations of reinforcement learning",
    "C型肝炎ウイルスの同定": "Identification of hepatitis C virus",
    "mRNA修飾・ワクチン基盤": "mRNA modification, vaccine platform",
    "タンパク質構造予測": "Protein structure prediction",
    "AlphaFold・タンパク質構造予測": "AlphaFold, protein structure prediction",
    "先天免疫・GLP-1": "Innate immunity, GLP-1",
    "核輸送・細胞分化・嚢胞性線維症": "Nuclear transport, cell differentiation, cystic fibrosis",
    "タンパク質折り畳みの原子分解能解析": "Atomic-resolution analysis of protein folding",
    "パルサーの発見": "Discovery of pulsars",
    "COVID-19ワクチンの迅速開発": "Rapid development of COVID-19 vaccine",
    "理論天体物理学": "Theoretical astrophysics",
    "抗体工学・治療用抗体": "Antibody engineering, therapeutic antibodies",
    "メタマテリアル・電磁気学": "Metamaterials, electromagnetism",
}

REPRESENTATIVE_FORMULA_TRANSLATIONS = {
    "Serre双対性": "Serre duality",
    "Lax-Milgramの定理": "Lax-Milgram theorem",
    "Carlesonの定理": "Carleson's theorem",
    "Gromov-Hausdorff距離": "Gromov-Hausdorff distance",
    "Tate加群": "Tate module",
    "Milnorの球面": "Milnor spheres",
    "Szemerédiの定理": "Szemerédi's theorem",
    "Weil予想の証明": "Proof of the Weil conjectures",
    "Sinai-Ruelle-Bowen測度": "Sinai-Ruelle-Bowen measure",
    "ハミング符号": "Hamming code",
    "Dijkstra法": "Dijkstra's algorithm",
    "O記法": "Big O notation",
    "BNF": "BNF",
    "Floyd-Warshall法": "Floyd-Warshall algorithm",
    "クイックソート": "Quicksort",
    "正規形": "Normal form",
    "Liskovの置換原則": "Liskov substitution principle",
    "Lamportタイムスタンプ": "Lamport timestamp",
    "ベイジアンネットワーク": "Bayesian network",
    "バックプロパゲーション": "Backpropagation",
    "π計算": "π-calculus",
    "時間階層定理": "Time hierarchy theorem",
    "超関数": "Distribution (generalized function)",
    "Kodaira消滅定理": "Kodaira vanishing theorem",
    "Atiyah-Singer指数定理": "Atiyah-Singer index theorem",
    "非可換幾何": "Noncommutative geometry",
    "Jones多項式": "Jones polynomial",
    "perfectoid空間": "Perfectoid spaces",
    "E8格子": "E8 lattice",
    "Langlands対応": "Langlands correspondence",
    "Q学習": "Q-learning",
}


def translate_discovery(ja_text: Optional[str]) -> Optional[str]:
    """Translate discovery from Japanese to English."""
    if ja_text is None:
        return None
    return DISCOVERY_TRANSLATIONS.get(ja_text, ja_text)


def translate_representative_formula(ja_text: Optional[str]) -> Optional[str]:
    """Translate representative_formula from Japanese to English.
    Preserves LaTeX formulas and mathematical notation.
    """
    if ja_text is None:
        return None

    # Check for exact match first
    if ja_text in REPRESENTATIVE_FORMULA_TRANSLATIONS:
        return REPRESENTATIVE_FORMULA_TRANSLATIONS[ja_text]

    # Handle formulas that contain LaTeX - translate Japanese prefix/suffix
    # KPZ方程式 $...$ -> KPZ equation $...$
    if "KPZ方程式" in ja_text:
        return "KPZ equation " + ja_text.replace("KPZ方程式 ", "")
    # Atiyah-Singer指数定理 $...$ -> Atiyah-Singer index theorem $...$
    if "Atiyah-Singer指数定理" in ja_text:
        return "Atiyah-Singer index theorem " + ja_text.replace("Atiyah-Singer指数定理 ", "")
    # Nashの埋め込み定理 $...$ -> Nash embedding theorem $...$
    if "Nashの埋め込み定理" in ja_text:
        return "Nash embedding theorem " + ja_text.replace("Nashの埋め込み定理 ", "")
    # Cook-Levinの定理 SAT $...$ -> Cook-Levin theorem SAT $...$
    if "Cook-Levinの定理" in ja_text:
        return "Cook-Levin theorem " + ja_text.replace("Cook-Levinの定理 ", "")
    # Talagrandの不等式 -> Talagrand's inequality
    if "Talagrandの不等式" in ja_text:
        return "Talagrand's inequality"

    # Already in English (e.g., "modularity theorem", "RSA", "HTTP", "AlphaFold")
    return ja_text


def process_entries(entries: list) -> list:
    """Add discovery_en and representative_formula_en to each entry."""
    for entry in entries:
        discovery = entry.get("discovery")
        representative_formula = entry.get("representative_formula")

        entry["discovery_en"] = translate_discovery(discovery)
        entry["representative_formula_en"] = translate_representative_formula(
            representative_formula
        )
    return entries


def main():
    data_dir = Path(__file__).parent.parent / "data"
    input_path = data_dir / "tier1-awards-laureates.json"
    output_path = data_dir / "tier1-awards-laureates.json"

    if not input_path.exists():
        print(f"Error: File not found: {input_path}", file=sys.stderr)
        sys.exit(1)

    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Process each award's entries
    for award_key, award_data in data.get("awards", {}).items():
        if "entries" in award_data:
            process_entries(award_data["entries"])

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Successfully updated {output_path}")
    print(f"Added discovery_en and representative_formula_en to all entries.")


if __name__ == "__main__":
    main()
