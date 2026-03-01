#!/usr/bin/env python3
"""
Build nobel-prizes.json from Nobel Prize API and add representative equations.
"""
import json
import urllib.request
from pathlib import Path

# Representative equations for specific laureates (key: (category, year) or (category, year, partial_name))
EQUATIONS = {
    # Physics
    ("physics", 1921): "E=mc²",
    ("physics", 1918): "E=hν",
    ("physics", 1933): "iℏ∂ψ/∂t = Ĥψ",  # Schrödinger
    ("physics", 1933): "(iγ^μ∂_μ - m)ψ = 0",  # Dirac - same year, different laureate
    ("physics", 1922): "E_n = -13.6eV/n²",  # Bohr
    ("physics", 1932): "[x,p] = iℏ",  # Heisenberg
    ("physics", 1928): "J = AT²e^(-W/kT)",  # Richardson
    ("physics", 1911): "λ_max T = b",  # Wien
    ("physics", 1967): "nuclear reaction rates (Bethe formula)",  # Bethe
    ("physics", 1972): "BCS theory (superconductivity)",  # Bardeen, Cooper, Schrieffer
}

# Per-laureate equations (some years have multiple laureates with different equations)
LAUREATE_EQUATIONS = {
    ("physics", 1921, "Einstein"): "E=mc²",
    ("physics", 1918, "Planck"): "E=hν",
    ("physics", 1933, "Schrödinger"): "iℏ∂ψ/∂t = Ĥψ; (iγ^μ∂_μ - m)ψ = 0 (Dirac)",
    ("physics", 1933, "Dirac"): "iℏ∂ψ/∂t = Ĥψ (Schrödinger); (iγ^μ∂_μ - m)ψ = 0",
    ("physics", 1922, "Bohr"): "E_n = -13.6eV/n²",
    ("physics", 1932, "Heisenberg"): "[x,p] = iℏ",
    ("physics", 1928, "Richardson"): "J = AT²e^(-W/kT)",
    ("physics", 1911, "Wien"): "λ_max T = b",
    ("physics", 1967, "Bethe"): "nuclear reaction rates (Bethe formula)",
    ("physics", 1972, "Bardeen"): "BCS theory: Δ(T) gap equation",
    ("physics", 1972, "Cooper"): "BCS theory: Δ(T) gap equation",
    ("physics", 1972, "Schrieffer"): "BCS theory: Δ(T) gap equation",
    # Chemistry
    ("chemistry", 1910, "van der Waals"): "(P + a/V²)(V - b) = RT",
    ("chemistry", 1920, "Nernst"): "E = E° - (RT/nF)lnQ",
    ("chemistry", 1903, "Arrhenius"): "k = Ae^(-Ea/RT)",
    ("chemistry", 1968, "Onsager"): "Onsager reciprocal relations: L_ik = L_ki",
    ("chemistry", 1992, "Marcus"): "Marcus theory (electron transfer): ΔG‡ = (λ/4)(1 + ΔG°/λ)²",
    ("chemistry", 1946, "Sumner"): "v = V_max[S]/(K_m + [S])",  # Michaelis-Menten (enzyme work)
    # Physiology or Medicine
    ("physiology_or_medicine", 1963, "Hodgkin"): "Hodgkin-Huxley: C_m dV/dt = -ΣI_ion",
    ("physiology_or_medicine", 1963, "Huxley"): "Hodgkin-Huxley: C_m dV/dt = -ΣI_ion",
    # Economic Sciences
    ("economic_sciences", 1997, "Merton"): "Black-Scholes: ∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S - rV = 0",
    ("economic_sciences", 1997, "Scholes"): "Black-Scholes: ∂V/∂t + ½σ²S²∂²V/∂S² + rS∂V/∂S - rV = 0",
    ("economic_sciences", 1994, "Nash"): "Nash equilibrium",
    ("economic_sciences", 1987, "Solow"): "Solow growth model: Y = A K^α L^(1-α)",
    ("economic_sciences", 1971, "Kuznets"): "Kuznets curve",
}

CATEGORY_MAP = {
    "physics": "physics",
    "chemistry": "chemistry",
    "physiology or medicine": "physiology_or_medicine",
    "medicine": "physiology_or_medicine",
    "literature": "literature",
    "peace": "peace",
    "economic sciences": "economic_sciences",
}


def get_equation(category, year, laureate_names):
    """Get representative equation for this prize."""
    for (cat, yr, name_part), eq in LAUREATE_EQUATIONS.items():
        if cat == category and yr == year:
            for ln in laureate_names:
                if name_part.lower() in ln.lower():
                    return eq
    return None


def main():
    # Use cached API data (fetch via: curl -o nobel-api.json "https://api.nobelprize.org/2.1/nobelPrizes?limit=1000")
    cache_path = Path(__file__).parent.parent / "data" / "nobel-api-cache.json"
    if cache_path.exists():
        with open(cache_path, encoding="utf-8") as f:
            api_data = json.load(f)
    else:
        try:
            url = "https://api.nobelprize.org/2.1/nobelPrizes?limit=1000"
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req) as response:
                api_data = json.loads(response.read())
            cache_path.parent.mkdir(parents=True, exist_ok=True)
            with open(cache_path, "w", encoding="utf-8") as f:
                json.dump(api_data, f, indent=2)
        except Exception as e:
            print(f"API fetch failed: {e}. Using embedded fallback.")
            api_data = {"nobelPrizes": []}

    categories = {
        "physics": [],
        "chemistry": [],
        "physiology_or_medicine": [],
        "literature": [],
        "peace": [],
        "economic_sciences": [],
    }

    for prize in api_data["nobelPrizes"]:
        year = int(prize["awardYear"])
        cat_en = prize["category"]["en"].lower()
        cat = CATEGORY_MAP.get(cat_en)
        if not cat:
            continue

        # Get laureates - handle orgs and shared motivations
        laureates = []
        discovery = None

        for laur in prize.get("laureates", []):
            name = laur.get("knownName", laur.get("orgName", {}))
            if isinstance(name, dict):
                name = name.get("en", "")
            if name:
                laureates.append(name)
            if laur.get("motivation"):
                mot = laur["motivation"]
                if isinstance(mot, dict):
                    mot = mot.get("en", "")
                if mot and not discovery:
                    discovery = mot.strip('"')

        if not laureates and prize.get("laureates"):
            for laur in prize["laureates"]:
                org = laur.get("orgName", {})
                if isinstance(org, dict):
                    org = org.get("en", "")
                if org:
                    laureates.append(org)

        if not discovery and prize.get("laureates"):
            for laur in prize["laureates"]:
                if laur.get("motivation"):
                    mot = laur["motivation"]
                    if isinstance(mot, dict):
                        mot = mot.get("en", "")
                    if mot:
                        discovery = mot.strip('"')
                        break

        if not discovery:
            discovery = "No citation available"

        # Representative equation
        rep_eq = get_equation(cat, year, laureates)
        if rep_eq is None and cat in ["physics", "chemistry"] and year in [
            1910, 1920, 1903, 1968, 1992
        ]:
            # Fallback for key equations
            key_map = {
                (1910, "chemistry"): "(P + a/V²)(V - b) = RT",
                (1920, "chemistry"): "E = E° - (RT/nF)lnQ",
                (1903, "chemistry"): "k = Ae^(-Ea/RT)",
                (1968, "chemistry"): "Onsager reciprocal relations: L_ik = L_ki",
                (1992, "chemistry"): "Marcus theory (electron transfer)",
            }
            rep_eq = key_map.get((year, cat))

        if cat in ["literature", "peace"]:
            rep_eq = None

        # Omit years with no award (empty laureates)
        if not laureates:
            continue

        # Fix HTML entities in discovery
        if discovery:
            discovery = discovery.replace("&ouml;", "ö").replace("&auml;", "ä").replace("&uuml;", "ü")
            discovery = discovery.replace("&Ouml;", "Ö").replace("&eacute;", "é").replace("&agrave;", "à")

        entry = {
            "year": year,
            "laureates": laureates,
            "discovery": discovery,
            "representative_equation": rep_eq,
        }
        categories[cat].append(entry)

    # Sort each category by year
    for cat in categories:
        categories[cat].sort(key=lambda x: x["year"])

    output = {
        "categories": categories,
        "source": "Nobel Prize official (nobelprize.org, api.nobelprize.org)",
    }

    out_path = Path(__file__).parent.parent / "data" / "nobel-prizes.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Written {out_path}")
    for cat, entries in categories.items():
        print(f"  {cat}: {len(entries)} entries")


if __name__ == "__main__":
    main()
