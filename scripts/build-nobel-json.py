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

# Per-laureate equations (LaTeX format: "Name $...$" for KaTeX rendering)
# Physics - expanded for comprehensive formula coverage
LAUREATE_EQUATIONS = {
    # Already had
    ("physics", 1921, "Einstein"): "Einstein $E = mc^2$",
    ("physics", 1918, "Planck"): "Planck $E = h\\nu$",
    ("physics", 1933, "Schrödinger"): "Schrödinger $i\\hbar \\partial\\psi/\\partial t = \\hat{H}\\psi$",
    ("physics", 1933, "Dirac"): "Dirac $(i\\gamma^\\mu \\partial_\\mu - m)\\psi = 0$",
    ("physics", 1922, "Bohr"): "Bohr $E_n = -13.6\\,\\mathrm{eV}/n^2$",
    ("physics", 1932, "Heisenberg"): "Heisenberg $[\\hat{x}, \\hat{p}] = i\\hbar$",
    ("physics", 1928, "Richardson"): "Richardson $J = AT^2 e^{-W/(kT)}$",
    ("physics", 1911, "Wien"): "Wien $\\lambda_{\\max} T = b$",
    ("physics", 1967, "Bethe"): "Bethe nuclear reaction rates (Bethe formula)",
    ("physics", 1972, "Bardeen"): "BCS $\\Delta(T)$ gap equation",
    ("physics", 1972, "Cooper"): "BCS $\\Delta(T)$ gap equation",
    ("physics", 1972, "Schrieffer"): "BCS $\\Delta(T)$ gap equation",
    # Additional Physics formulas
    ("physics", 1902, "Lorentz"): "Lorentz $\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B})$",
    ("physics", 1902, "Zeeman"): "Zeeman $\\Delta E = \\mu_B B$",
    ("physics", 1903, "Becquerel"): "Radioactivity $N = N_0 e^{-\\lambda t}$",
    ("physics", 1903, "Curie"): "Radioactivity $N = N_0 e^{-\\lambda t}$",
    ("physics", 1906, "Thomson"): "Thomson $e/m$ ratio",
    ("physics", 1913, "Onnes"): "Onnes superconductivity $R = 0$",
    ("physics", 1914, "Laue"): "Bragg $2d\\sin\\theta = n\\lambda$",
    ("physics", 1915, "Bragg"): "Bragg $2d\\sin\\theta = n\\lambda$",
    ("physics", 1923, "Millikan"): "Millikan $E = h\\nu - W$ (photoelectric)",
    ("physics", 1925, "Franck"): "Franck-Hertz $E_n - E_m = h\\nu$",
    ("physics", 1925, "Hertz"): "Franck-Hertz $E_n - E_m = h\\nu$",
    ("physics", 1927, "Compton"): "Compton $\\Delta\\lambda = \\frac{h}{m_e c}(1 - \\cos\\theta)$",
    ("physics", 1929, "Broglie"): "de Broglie $\\lambda = h/p$",
    ("physics", 1930, "Raman"): "Raman $\\Delta\\nu$ shift",
    ("physics", 1935, "Chadwick"): "Chadwick neutron $m_n \\approx m_p$",
    ("physics", 1938, "Fermi"): "Fermi $E_F = \\frac{\\hbar^2}{2m}(3\\pi^2 n)^{2/3}$",
    ("physics", 1945, "Pauli"): "Pauli exclusion $n_i \\le 1$",
    ("physics", 1949, "Yukawa"): "Yukawa $V(r) \\propto e^{-r/r_0}/r$",
    ("physics", 1954, "Born"): "Born $|\\psi|^2$ probability",
    ("physics", 1958, "Cherenkov"): "Cherenkov $v > c/n$, $\\cos\\theta = c/(nv)$",
    ("physics", 1962, "Landau"): "Landau $E_n = \\hbar\\omega_c(n + 1/2)$",
    ("physics", 1964, "Townes"): "LASER $E = h\\nu$ stimulated emission",
    ("physics", 1965, "Feynman"): "QED $S = \\int \\mathcal{L}\\,d^4x$",
    ("physics", 1965, "Schwinger"): "QED $S = \\int \\mathcal{L}\\,d^4x$",
    ("physics", 1965, "Tomonaga"): "QED $S = \\int \\mathcal{L}\\,d^4x$",
    ("physics", 1969, "Gell-Mann"): "Quarks $SU(3)$, $q = \\pm e/3, \\pm 2e/3$",
    ("physics", 1973, "Josephson"): "Josephson $I = I_c \\sin\\phi$",
    ("physics", 1976, "Richter"): "J/ψ $m \\approx 3.1\\,\\mathrm{GeV}$",
    ("physics", 1976, "Ting"): "J/ψ $m \\approx 3.1\\,\\mathrm{GeV}$",
    ("physics", 1979, "Weinberg"): "Weinberg $\\sin^2\\theta_W \\approx 0.23$",
    ("physics", 1979, "Glashow"): "Glashow $SU(2)_L \\times U(1)_Y$",
    ("physics", 1979, "Salam"): "Salam electroweak unification",
    ("physics", 1983, "Chandrasekhar"): "Chandrasekhar $M_{\\mathrm{Ch}} \\approx 1.4 M_\\odot$",
    ("physics", 1984, "Rubbia"): "W, Z bosons $m_W, m_Z$",
    ("physics", 1988, "Lederman"): "Muon neutrino $\\nu_\\mu$",
    ("physics", 1990, "Friedman"): "Quark structure $Q^2$ scaling",
    ("physics", 1995, "Perl"): "Tau $\\tau^-$ lepton",
    ("physics", 1999, "t Hooft"): "Renormalization gauge theories",
    ("physics", 2004, "Gross"): "QCD $\\beta$-function asymptotic freedom",
    ("physics", 2004, "Politzer"): "QCD $\\beta$-function asymptotic freedom",
    ("physics", 2004, "Wilczek"): "QCD $\\beta$-function asymptotic freedom",
    ("physics", 2012, "Higgs"): "Higgs $m_H^2 v^2 = -\\mu^2$",
    ("physics", 2013, "Englert"): "Higgs $m_H^2 v^2 = -\\mu^2$",
    ("physics", 1910, "van der Waals"): "van der Waals $(P + a/V^2)(V - b) = RT$",
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
    # Economic Sciences - expanded formulas
    ("economic_sciences", 1969, "Frisch"): "Frisch $Y_t = f(K_t, L_t, A_t)$ dynamic models",
    ("economic_sciences", 1969, "Tinbergen"): "Tinbergen $Y_t = f(K_t, L_t, A_t)$ econometrics",
    ("economic_sciences", 1970, "Samuelson"): "Samuelson revealed preference, $\\partial x_i/\\partial p_j$",
    ("economic_sciences", 1971, "Kuznets"): "Kuznets curve $G(y) \\to \\Delta$ inequality",
    ("economic_sciences", 1972, "Hicks"): "Hicks IS-LM $Y = C(Y) + I(r) + G$",
    ("economic_sciences", 1972, "Arrow"): "Arrow impossibility theorem",
    ("economic_sciences", 1973, "Leontief"): "Leontief $X = (I - A)^{-1}Y$ input-output",
    ("economic_sciences", 1975, "Kantorovich"): "Kantorovich $\\min c^T x$ s.t. $Ax = b$",
    ("economic_sciences", 1975, "Koopmans"): "Koopmans $\\max \\sum u_i(x_i)$ allocation",
    ("economic_sciences", 1976, "Friedman"): "Friedman $MV = PY$ quantity theory",
    ("economic_sciences", 1977, "Ohlin"): "Heckscher-Ohlin $F(K,L)$ factor proportions",
    ("economic_sciences", 1977, "Meade"): "Meade trade $\\tau$, welfare",
    ("economic_sciences", 1978, "Simon"): "Simon satisficing $u(x) \\ge \\bar{u}$",
    ("economic_sciences", 1979, "Schultz"): "Schultz human capital $Y = f(H, K, L)$",
    ("economic_sciences", 1979, "Lewis"): "Lewis dual economy $w = \\mathrm{MPL}$",
    ("economic_sciences", 1980, "Klein"): "Klein $Y_t = \\Phi(Y_{t-1}, X_t)$ econometric",
    ("economic_sciences", 1981, "Tobin"): "Tobin's q $q = V/K$",
    ("economic_sciences", 1982, "Stigler"): "Stigler $MC = MR$ regulation",
    ("economic_sciences", 1983, "Debreu"): "Debreu $p \\cdot x_i \\le p \\cdot \\omega_i$ GE",
    ("economic_sciences", 1985, "Modigliani"): "Modigliani-Miller $V_L = V_U$, lifecycle $C = \\alpha Y$",
    ("economic_sciences", 1987, "Solow"): "Solow $Y = A K^\\alpha L^{1-\\alpha}$",
    ("economic_sciences", 1988, "Allais"): "Allais paradox $u(x) \\not\\propto$ expected",
    ("economic_sciences", 1990, "Markowitz"): "Markowitz $\\sigma_p^2 = w^T \\Sigma w$",
    ("economic_sciences", 1990, "Sharpe"): "Sharpe CAPM $E[R_i] = R_f + \\beta_i(E[R_m]-R_f)$",
    ("economic_sciences", 1990, "Miller"): "Modigliani-Miller $V_L = V_U$",
    ("economic_sciences", 1991, "Coase"): "Coase $TC_1 = TC_2$ at optimum",
    ("economic_sciences", 1992, "Becker"): "Becker $U = u(c, l, h)$ human capital",
    ("economic_sciences", 1994, "Nash"): "Nash $u_i(s_i^*, s_{-i}^*) \\ge u_i(s_i, s_{-i}^*)$",
    ("economic_sciences", 1994, "Harsanyi"): "Harsanyi Bayesian games",
    ("economic_sciences", 1994, "Selten"): "Selten subgame perfection",
    ("economic_sciences", 1995, "Lucas"): "Lucas $E_t[x_{t+1}]$ rational expectations",
    ("economic_sciences", 1996, "Mirrlees"): "Mirrlees $\\max \\int v(y-T(y))f(y)dy$",
    ("economic_sciences", 1996, "Vickrey"): "Vickrey $b_i = v_i$ truthful auction",
    ("economic_sciences", 1997, "Merton"): "Black-Scholes $\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0$",
    ("economic_sciences", 1997, "Scholes"): "Black-Scholes $\\frac{\\partial V}{\\partial t} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0$",
    ("economic_sciences", 1998, "Sen"): "Sen $W = f(u_1, \\ldots, u_n)$ capability",
    ("economic_sciences", 1999, "Mundell"): "Mundell-Fleming $IS$-$LM$-$BP$",
    ("economic_sciences", 2000, "Heckman"): "Heckman $E[Y|X,D=1] - E[Y|X,D=0]$ selection",
    ("economic_sciences", 2000, "McFadden"): "McFadden $P(i) = \\frac{e^{V_i}}{\\sum_j e^{V_j}}$",
    ("economic_sciences", 2001, "Akerlof"): "Akerlof lemon $p = \\bar{q}$ adverse selection",
    ("economic_sciences", 2001, "Spence"): "Spence $e^*(\\theta)$ signaling",
    ("economic_sciences", 2001, "Stiglitz"): "Stiglitz screening $w(y)$",
    ("economic_sciences", 2002, "Kahneman"): "Kahneman $v(\\Delta x)$ prospect theory",
    ("economic_sciences", 2003, "Engle"): "Engle ARCH $\\sigma_t^2 = \\omega + \\alpha \\varepsilon_{t-1}^2$",
    ("economic_sciences", 2003, "Granger"): "Granger $y_t \\to x_t$ cointegration",
    ("economic_sciences", 2004, "Kydland"): "RBC $\\max E \\sum \\beta^t u(c_t, l_t)$",
    ("economic_sciences", 2004, "Prescott"): "RBC $y_t = z_t F(k_t, l_t)$",
    ("economic_sciences", 2005, "Aumann"): "Aumann correlated equilibrium",
    ("economic_sciences", 2005, "Schelling"): "Schelling focal point",
    ("economic_sciences", 2006, "Phelps"): "Phelps $\\pi = \\pi^e + \\alpha(u^* - u)$ Phillips",
    ("economic_sciences", 2007, "Hurwicz"): "Hurwicz mechanism $f(\\theta)$",
    ("economic_sciences", 2007, "Maskin"): "Maskin monotonicity",
    ("economic_sciences", 2007, "Myerson"): "Myerson $\\sum t_i(\\theta) \\le 0$",
    ("economic_sciences", 2008, "Krugman"): "Krugman $Y_i = (\\sum_j \\tau_{ij} Y_j)^{1/(1-\\sigma)}$",
    ("economic_sciences", 2010, "Diamond"): "DMP $\\theta = v/u$ matching",
    ("economic_sciences", 2010, "Mortensen"): "DMP $m(u,v)$ search",
    ("economic_sciences", 2010, "Pissarides"): "DMP $\\beta J = w - rU$",
    ("economic_sciences", 2011, "Sargent"): "Sargent VAR $y_t = A y_{t-1} + \\varepsilon_t$",
    ("economic_sciences", 2011, "Sims"): "Sims VAR structural",
    ("economic_sciences", 2012, "Shapley"): "Shapley $\\phi_i(v) = \\sum_S \\frac{|S|!(n-|S|-1)!}{n!}[v(S\\cup i)-v(S)]$",
    ("economic_sciences", 2012, "Roth"): "Roth stable matching DA",
    ("economic_sciences", 2013, "Fama"): "Fama $E[R_{t+1}|\\mathcal{F}_t]$ efficient",
    ("economic_sciences", 2013, "Shiller"): "Shiller $P = \\sum D_t/(1+r)^t$",
    ("economic_sciences", 2014, "Tirole"): "Tirole $\\pi = (p-c)q$ market power",
    ("economic_sciences", 2015, "Deaton"): "Deaton $C = \\alpha + \\beta Y$ consumption",
    ("economic_sciences", 2016, "Hart"): "Hart $\\max_{e} E[S(e)-c(e)]$ contracts",
    ("economic_sciences", 2016, "Holmström"): "Holmström $s(y)$ incentive",
    ("economic_sciences", 2017, "Thaler"): "Thaler $v(x) = x^\\alpha$ loss aversion",
    ("economic_sciences", 2018, "Nordhaus"): "Nordhaus DICE $C = f(T, E)$",
    ("economic_sciences", 2018, "Romer"): "Romer $\\dot{A} = \\delta L_A A$ endogenous growth",
    ("economic_sciences", 2021, "Card"): "Card DiD $E[Y_{1t}-Y_{0t}|D=1] - E[Y_{1t}-Y_{0t}|D=0]$",
    ("economic_sciences", 2021, "Angrist"): "Angrist IV $\\frac{E[Y|Z=1]-E[Y|Z=0]}{E[D|Z=1]-E[D|Z=0]}$",
    ("economic_sciences", 2021, "Imbens"): "Imbens causal $E[Y(1)-Y(0)|D=1]$",
    ("economic_sciences", 2022, "Bernanke"): "Bernanke financial accelerator",
    ("economic_sciences", 2022, "Diamond"): "Diamond-Dybvig $c_1^* > c_2^*$ bank runs",
    ("economic_sciences", 2022, "Dybvig"): "Diamond-Dybvig $r_1 < r_2$ liquidity",
    ("economic_sciences", 2024, "Acemoglu"): "Acemoglu $y = A \\cdot k^\\alpha$ institutions",
    ("economic_sciences", 2025, "Aghion"): "Aghion-Howitt $g = \\lambda \\cdot \\gamma \\cdot n$",
    ("economic_sciences", 2025, "Howitt"): "Schumpeterian $\\dot{A} = \\gamma n A$",
    ("economic_sciences", 2025, "Mokyr"): "Mokyr $A(t)$ knowledge growth",
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
