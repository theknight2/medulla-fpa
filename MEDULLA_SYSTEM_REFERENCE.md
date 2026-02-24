# Medulla FP&A Intelligence Platform — System Reference

**Company:** TVG-Medulla (PE-backed by Vistria Group, $16B AUM)
**Period:** January 2026
**Scope:** 30 chiropractic clinics across 6 regions
**Data Source:** `Medulla_FPA_DataRoom_Jan2026.xlsx` (9 sheets, 1,091 rows)

---

## 1. Data Extracted (All 9 Sheets)

| # | Sheet | Rows | Fields | What It Contains |
|---|-------|------|--------|------------------|
| 1 | Data Room Index | 24 | 1 | Table of contents / metadata |
| 2 | Clinic Export | 30 | 15 | Core clinic financials: revenue budget/actual, visits, denial rate, collection rate, prepaid cash, deferred revenue, new patients, blended CAC |
| 3 | Expense Detail | 240 | 7 | Line-item expenses per clinic aggregated into 8 categories: Doctor Comp, Clinical Tech, Front Desk, Benefits, Rent, Marketing, Supplies, Technology |
| 4 | Denial Log | 372 | 11 | Individual denied claims: Claim ID, clinic, service date, CPT code + description, payer, charge amount, denial reason code + reason, remediation |
| 5 | Payer Mix | 180 | 9 | Per-clinic payer breakdown: gross charges, contractual adjustments, net revenue, claims count, denial count, denial rate |
| 6 | Provider Productivity | 65 | 15 | Per-provider: visits completed, revenue generated, compensation, comp ratio, avg RPV, new/returning patients, utilization %, tech-to-doc ratio, schedule slots |
| 7 | Monthly Trend | 120 | 14 | 4-month time series per clinic: visits, net revenue, denial rate, collection rate, RPV, prepaid cash, deferred revenue, new patients, acquisition cost, CAC |
| 8 | Budget Assumptions | 30 | 14 | Per-clinic annual targets: FY2026 annual + monthly revenue budget, visits budget, RPV assumption, denial/collection targets, doctor count, breakeven revenue, EBITDA margin target, notes |
| 9 | AR Aging | 30 | 11 | Per-clinic aging buckets: 0-30, 31-60, 61-90, 90+ days, total AR, % over 90, DSO |

---

## 2. The 6 Agents

### Maya — FP&A Director
- **Data Access:** None (routing only)
- **Skills:** route_query, decompose_task, synthesize_responses, executive_brief
- **Can Call:** Raj, Priya, Alex, Sam, Jordan
- **Role:** Orchestrates the team. Routes queries to specialists. Cannot access raw data directly. Synthesizes specialist outputs into executive briefs.
- **System Prompt:** "You are Maya, FP&A Director at TVG-Medulla (30 chiropractic clinics, 6 regions, PE-backed by Vistria $16B AUM). You ORCHESTRATE the analyst team. Below is ROUTING METADATA showing which specialists were engaged and their pre-computed outputs. You do NOT recalculate. Synthesize into a concise executive brief using markdown. When decomposing complex queries, explain which specialists you routed to and why."

### Raj — Variance Analyst
- **Data Access:** Variance_Data
- **Skills:** variance_bridge, volume_decomposition, rate_analysis, expense_variance
- **Can Call:** Priya, Jordan
- **Role:** Every dollar missed, decomposed deterministically.
- **System Prompt:** "You are Raj, Variance Analyst at TVG-Medulla. SKILL FILE: data_access=[Variance_Data], skills=[variance_bridge, volume_decomposition, rate_analysis, expense_variance]. Below is MATHEMATICALLY VERIFIED variance data from your authorized access. DO NOT access denial or forecast data. Format into clear executive variance commentary with markdown tables."

### Priya — Revenue Cycle Specialist
- **Data Access:** AR_Aging, Denial_Logs
- **Skills:** denial_analysis, cpt_code_audit, recovery_modeling, collection_optimization
- **Can Call:** Raj, Jordan
- **Role:** Denial expert. Every code quantified in dollars.
- **Now receives:** Denial Log detail (CPT breakdown, payer breakdown) + Payer Mix summary (gross charges, adjustments, net revenue by payer)
- **System Prompt:** "You are Priya, Revenue Cycle Specialist at TVG-Medulla. SKILL FILE: data_access=[AR_Aging, Denial_Logs], skills=[denial_analysis, cpt_code_audit, recovery_modeling, collection_optimization]. Below is MATHEMATICALLY VERIFIED denial/AR data from your authorized access. DO NOT access variance bridge or forecast data. Format into an executive denial report with CPT codes and recovery opportunity."

### Alex — Forecasting Analyst
- **Data Access:** Forecast_Models
- **Skills:** scenario_modeling, driver_based_forecast, sensitivity_analysis, trend_projection
- **Can Call:** Raj, Jordan
- **Role:** Driver-based forecasts. Three scenarios.
- **Now receives:** Monthly Trend historical data (4-month time series) + Budget Assumptions context (annual budget, avg RPV, denial/EBITDA targets)
- **System Prompt:** "You are Alex, Forecasting Analyst at TVG-Medulla. SKILL FILE: data_access=[Forecast_Models], skills=[scenario_modeling, driver_based_forecast, sensitivity_analysis]. Below is MATHEMATICALLY VERIFIED forecast data. DO NOT access raw clinic data or denial logs. Format into a clear forecast summary with tables."

### Sam — Board Reporter
- **Data Access:** PE_Metrics, SSS, CAC
- **Skills:** pe_commentary, board_package, investor_narrative, kpi_formatting
- **Can Call:** Maya, Raj
- **Role:** PE-grade commentary for Vistria.
- **Max tokens:** 2,200 (vs 1,500 for others)
- **System Prompt:** "You are Sam, Board Reporter at TVG-Medulla. SKILL FILE: data_access=[PE_Metrics, SSS, CAC], skills=[pe_commentary, board_package, investor_narrative]. Below is MATHEMATICALLY VERIFIED PE metrics. DO NOT access raw denial logs or clinic-level data. Write 3 paragraphs of PE-style commentary. Lead with the number, explain the driver, state the corrective action."

### Jordan — Ops Intelligence
- **Data Access:** Clinic_Health, Ops_Metrics
- **Skills:** clinic_health_scoring, regional_ranking, risk_flagging, comp_analysis
- **Can Call:** Raj, Priya
- **Role:** Clinic vital signs. Health scores from real metrics.
- **Now receives:** Provider Productivity summary (total providers, avg utilization, avg comp ratio, total revenue/comp)
- **System Prompt:** "You are Jordan, Ops Intelligence at TVG-Medulla. SKILL FILE: data_access=[Clinic_Health, Ops_Metrics], skills=[clinic_health_scoring, regional_ranking, risk_flagging, comp_analysis]. Below is MATHEMATICALLY VERIFIED clinic health data. DO NOT access forecast models or PE metrics. Format into a report with rankings, risk flags, and recommendations."

---

## 3. Task Routing — How Maya Routes Queries

Maya scans the query (lowercased) for keywords. Multiple agents can be routed per query.

| Keywords in Query | Routed To | Task | Data Scope |
|---|---|---|---|
| `variance`, `revenue`, `budget` | **Raj** | Variance bridge analysis | Variance_Data |
| `denial`, `ar `, `collection`, `kentucky`, `ky` | **Priya** | Denial/AR analysis | AR_Aging, Denial_Logs |
| `forecast`, `scenario`, `projection` | **Alex** | Forecast modeling | Forecast_Models |
| `board`, `vistria`, `pe `, `investor` | **Sam** | PE commentary | PE_Metrics, SSS, CAC |
| `clinic`, `health`, `ops`, `region` | **Jordan** | Clinic health scoring | Clinic_Health, Ops_Metrics |
| *(no match)* | **Raj + Jordan + Sam** | Variance overview + Health scoring + Executive summary | *(default)* |

**Example:** "What is the Kentucky denial impact on revenue?" triggers both **Priya** (keyword: "denial", "kentucky") AND **Raj** (keyword: "revenue").

---

## 4. Clickable Quick Actions (Per Agent)

### Maya
| Button | Sends |
|--------|-------|
| Executive summary | "Write January 2026 executive summary for CFO." |
| Board checklist | "What does Vistria need in the board package?" |

### Raj
| Button | Sends |
|--------|-------|
| Revenue variance bridge | "Full variance bridge: volume, rate, denial by region." |
| Expense variance | "Analyze all expense lines vs budget." |

### Priya
| Button | Sends |
|--------|-------|
| KY denial deep dive | "Root cause analysis on Kentucky 16% denial rate." |
| Recovery model | "If all regions hit 8% target, what is the annual recovery?" |

### Alex
| Button | Sends |
|--------|-------|
| 12-month forecast | "Show base, upside, and downside scenarios." |
| Upside detail | "What happens if we fix denials AND grow 2% organically?" |

### Sam
| Button | Sends |
|--------|-------|
| Board commentary | "3-paragraph variance commentary for Vistria board package." |
| Email to VP Finance | "Email to Sean McMahon: January findings + 3 next steps." |

### Jordan
| Button | Sends |
|--------|-------|
| Clinic health rankings | "Rank all regions by health score with risk flags." |
| Doctor comp impact | "Revenue miss impact on quarterly doctor comp." |

---

## 5. FinanceEngine — All Calculations

### revenueSummary()
Aggregates all regions and expenses into a single summary.
- **Revenue:** sum of region budget/actual (in $K)
- **Expenses:** sum of expense budget/actual (in $K)
- **EBITDA:** Revenue - Expenses (budget and actual)
- **EBITDA Margin:** EBITDA / Revenue * 100
- **Denial:** weighted average denial rate across all clinics
- **Denial Target:** 8.0% (hardcoded)

### varianceBridge(regionId?)
Decomposes revenue variance into drivers. If regionId provided, filters to that region.
- **Volume Impact** = (Actual Visits - Budget Visits) x Budget RPV / 1000
- **Rate Impact** = (Actual RPV - Budget RPV) x Actual Visits / 1000
- **Denial Impact** = -(Actual Revenue x max(0, Current Denial - Target Denial) / 100)
- **Total Variance** = Actual Revenue - Budget Revenue
- **Residual** = Total Variance - Volume - Rate - Denial

### denialAnalysis(regionId?)
Quantifies denial losses and recovery opportunity.
- **Excess Rate** = max(0, Current Denial Rate - 8.0% Target)
- **Monthly Loss** = Actual Revenue x Excess Rate / 100
- **Annual Loss** = Monthly Loss x 12
- **Recoverable (80%)** = Monthly Loss x 0.8 *(assumes 80% of excess denials are recoverable)*

### expenseVariance()
Compares budget vs actual for each expense category.
- **Variance** = Actual - Budget
- **Variance %** = Variance / Budget x 100
- **Favorable** = Variance <= 0 (under budget = good)

### forecast()
12-month projection with 3 scenarios.
- **Base monthly revenue** = current month actual revenue
- **Denial fix potential** = total monthly denial loss from denialAnalysis()
- **Downside** ("5% reimbursement cut"): Revenue declines 0.4%/month compound
  - Formula: `base x 0.996^month`
- **Base** ("Current trajectory"): Gradual denial recovery at 5%/month
  - Formula: `base + denialLoss x 0.05 x month`
- **Upside** ("Full denial fix + 2% growth"): 10% denial recovery + organic growth
  - Formula: `base + denialLoss x 0.1 x month + base x 0.002 x month`

### clinicHealth()
Scores each region on a 0-100 health index.
- **Visit Score** = Actual Visits / Budget Visits x 100 (weight: 30%)
- **Revenue Score** = Actual Revenue / Budget Revenue x 100 (weight: 30%)
- **Denial Score** = max(0, 100 - (Current Denial - Target) x 10) (weight: 20%)
- **Collection Score** = Collection Rate % (weight: 20%)
- **Health Score** = round(Visit x 0.3 + Revenue x 0.3 + Denial x 0.2 + Collection x 0.2)
- **Status:** >= 90 Healthy, >= 80 Watch, < 80 At Risk

### doctorCompImpact()
Links revenue miss to doctor compensation.
- **Comp Ratio** = Doctor Comp Expense / Total Revenue (fallback: 30%)
- **Comp Impact** = Revenue Miss x Comp Ratio
- **Quarterly Impact** = Comp Impact x 3

### clinicDetail(clinicId)
Full deep-dive on a single clinic: revenue variance, denial loss, AR aging, providers.

### executiveSummary()
Bundles: revenueSummary + varianceBridge (all regions) + denialAnalysis (KY only) + expenseVariance + forecast.

---

## 6. Region Metadata

| Code | Name | Tag | Denial Target | Top Denial Codes |
|------|------|-----|---------------|------------------|
| IL | Illinois | Core | 8.0% | CO-16 (35% - Medical necessity), CO-4 (25% - Modifier issue) |
| IN | Indiana | — | 8.0% | CO-16 (30% - Medical necessity) |
| KY | Kentucky | Acquired | 8.0% | CO-4 (42% - Missing AT modifier), CO-16 (30% - CPT mismatch), PR-1 (12% - Deductible) |
| PNW | Pacific NW | — | 8.0% | — |
| AZ | Arizona | — | 8.0% | CO-16 (40% - Medical necessity), CO-4 (20% - Modifier) |
| MOKS | MO-KS | — | 8.0% | — |

---

## 7. Hardcoded Assumptions

| Assumption | Value | Where Used |
|------------|-------|------------|
| Denial target | 8.0% all regions | denialAnalysis, clinicHealth, clinicDetail |
| Recovery rate | 80% of excess denial losses | denialAnalysis |
| Doctor comp ratio fallback | 30% of revenue | doctorCompImpact |
| Downside monthly decline | 0.4% compound | forecast |
| Base denial recovery rate | 5% of loss/month | forecast |
| Upside denial recovery | 10% of loss/month | forecast |
| Upside organic growth | 0.2%/month | forecast |
| Sam max tokens | 2,200 | send() |
| Other agents max tokens | 1,500 | send() |
| Health score weights | Visit 30%, Revenue 30%, Denial 20%, Collection 20% | clinicHealth |
| API model | claude-sonnet-4-20250514 | send() |
| PE sponsor | Vistria Group | system prompts |
| VP Finance | Sean McMahon | quick action |

---

## 8. Proactive Insights (Auto-Generated)

| Severity | Title | Metric Source | Actions |
|----------|-------|---------------|---------|
| Critical | Kentucky denial rate 16%+ | denialAnalysis("KY").totals.monthlyLoss | 1. Standardize billing codes (migrate KY to CPT library) 2. Pre-submission scrubbing (auto-catch 60-70% errors) |
| Warning | Arizona volumes below budget | varianceBridge("AZ").totals.totalVariance | 1. Targeted marketing (reallocate to AZ) 2. Referral audit (re-engage top 10 PCPs) |
| Info | Marketing over budget | expenseVariance Marketing row | 1. Attribution tracking (UTM for cost per patient) 2. Consolidate agencies (centralize buying) |

---

## 9. Expense Categories

| Code | Name | Category |
|------|------|----------|
| DRCOMP | Doctor Compensation | Labor |
| CTECH | Clinical Technician Wages | Labor |
| STAFF | Front Desk & Admin Staff | Labor |
| BEN | Employee Benefits | Labor |
| RENT | Facility Rent | Occupancy |
| MKT | Marketing & Patient Acquisition | Growth |
| SUPPLY | Medical Supplies | Ops |
| TECH | Technology & EMR | Ops |

---

## 10. Denial CPT Code Reference

| CPT Code | Description | Avg Charge |
|----------|-------------|------------|
| 98940 | CMT 1-2 spinal regions | $52 |
| 98941 | CMT 3-4 spinal regions | $76 |
| 98942 | CMT 5 spinal regions | $92 |
| 97140 | Manual therapy | $45 |

---

## 11. What Each Agent Receives (Compute Boundary)

| Agent | Compute Function | Data Received |
|-------|-----------------|---------------|
| Maya | Routes to specialists, collects their outputs | Routing metadata + specialist outputs (no raw data) |
| Raj | varianceBridge(region?) OR expenseVariance() OR clinicDetail subset | Variance bridge rows, expense rows |
| Priya | denialAnalysis(region?) + Denial Log CPT/payer breakdown + Payer Mix summary | Denial region analysis, claim-level CPT breakdown (top 10), payer breakdown (top 8), payer mix aggregation |
| Alex | forecast() + Monthly Trend time series + Budget Assumptions context | 12-month 3-scenario forecast, historical 4-month trend, budget targets |
| Sam | executiveSummary() | Bundled: revenue summary, variance bridge, KY denial, expense variance, forecast |
| Jordan | clinicHealth() OR doctorCompImpact() + Provider Productivity summary | Health scores by region, provider aggregation (total providers, avg utilization, comp ratio) |

---

## 12. Map & Clinic Coloring

- **Green (On/Above Budget):** Revenue variance >= 0%
- **Amber (Watch):** Revenue variance between -5% and 0%
- **Red (Missed Budget):** Revenue variance below -5%

Clinic dots on the US map are sized by visit volume and colored by budget performance.

---

## 13. Sandbox Revenue Estimation (Map View)

When editing clinic values in the map sandbox:
```
New Revenue Estimate = New Visits x (Current Revenue / Current Visits) x (1 - (New Denial - Target) / 100) x (New Collection / Current Collection)
Uplift = New Revenue Estimate - Current Revenue
```
