import React, { useEffect, useMemo, useState } from "react";
import "../styles/SchoolView.css";

function parseCSV(csvText) {
  const lines = csvText.replace(/\r/g, "").split("\n").filter(Boolean);
  if (!lines.length) return [];

  const splitLine = (line) => {
    const out = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      if (ch === '"') {
        inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const headers = splitLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] ?? "";
    });
    rows.push(obj);
  }
  return rows;
}

function toNumber(v) {
  const n = Number(String(v ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : 0;
}

function monthLabel(yyyyMm) {
  const [, m] = String(yyyyMm).split("-");
  const mm = Number(m);
  const names = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  return names[mm - 1] || String(yyyyMm);
}

function getMaxYearFromLogs(logArr) {
  let maxY = 0;
  for (const l of logArr) {
    const m = String(l.month || "");
    const y = Number(m.slice(0, 4));
    if (Number.isFinite(y)) maxY = Math.max(maxY, y);
  }
  return maxY || new Date().getFullYear();
}

function buildYearMonths(year) {
  const out = [];
  for (let mm = 1; mm <= 12; mm++) out.push(`${year}-${String(mm).padStart(2, "0")}`);
  return out;
}

function formatAxis(n) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatKWh(n) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
}

function formatIDR(n) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

function sortCompare(a, b, key, dir) {
  const va = a[key];
  const vb = b[key];
  let res = 0;

  if (typeof va === "string" || typeof vb === "string") {
    res = String(va).localeCompare(String(vb));
  } else {
    res = (va ?? 0) - (vb ?? 0);
  }

  return dir === "asc" ? res : -res;
}

function AreaChart({ title, series, valueKey, yTitle = "", height = 220 }) {
  const [tip, setTip] = useState(null);

  const width = 560;

  const padL = 52;
  const padR = 18;
  const padT = 18;
  const padB = 72;

  const values = series.map((d) => toNumber(d[valueKey]));
  const minRaw = Math.min(...values);
  const maxRaw = Math.max(...values);

  const rawRange = Math.max(1, maxRaw - minRaw);

  const padV = Math.max(rawRange * 0.25, Math.max(5, Math.abs(maxRaw) * 0.05));

  const minAxis = minRaw - padV;
  const maxAxis = maxRaw + padV;
  const axisRange = Math.max(1, maxAxis - minAxis);

  const xStep = series.length > 1 ? (width - padL - padR) / (series.length - 1) : 0;

  const yFor = (v) => {
    const t = (v - minAxis) / axisRange; // 0..1
    return padT + (1 - t) * (height - padT - padB);
  };

  const points = series.map((d, i) => {
    const x = padL + i * xStep;
    const v = toNumber(d[valueKey]);
    return { x, y: yFor(v), v, m: d.month };
  });

  const lineD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");

  const baselineY = yFor(minAxis);
  const areaD =
    `${lineD} ` +
    `L ${(points[points.length - 1]?.x ?? padL).toFixed(2)} ${baselineY.toFixed(2)} ` +
    `L ${(points[0]?.x ?? padL).toFixed(2)} ${baselineY.toFixed(2)} Z`;

  const ticks = [
    { v: minAxis, label: formatAxis(minAxis) },
    { v: (minAxis + maxAxis) / 2, label: formatAxis((minAxis + maxAxis) / 2) },
    { v: maxAxis, label: formatAxis(maxAxis) },
  ];

  return (
    <div className="svCard">
      <div className="svCardHead">
        <div className="svCardTitle">{title}</div>
      </div>

      <div className="svChartWrap">
        <svg
          className="svChart"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
          role="img"
        >
          {yTitle ? (
            <text
              x="16"
              y={height / 2}
              className="svAxisText"
              textAnchor="middle"
              transform={`rotate(-90 16 ${height / 2})`}
            >
              {yTitle}
            </text>
          ) : null}

          {ticks.map((t) => {
            const y = yFor(t.v);
            return (
              <g key={`tick-${t.v}`}>
                <line x1={padL} y1={y} x2={width - padR} y2={y} className="svGridLine" />
                <text x={padL - 8} y={y + 4} className="svAxisText" textAnchor="end">
                  {t.label}
                </text>
              </g>
            );
          })}

          <path d={areaD} className="svArea" />
          <path d={lineD} className="svLine" />

          {points.map((p, idx) => (
            <circle
              key={`${p.m}-${idx}`}
              cx={p.x}
              cy={p.y}
              r="3.2"
              className="svDot"
              onMouseEnter={() => setTip({ x: p.x, y: p.y, m: p.m, v: p.v })}
              onMouseLeave={() => setTip(null)}
            />
          ))}

          {tip && (
            <g transform={`translate(${Math.min(width - 200, tip.x + 10)}, ${Math.max(40, tip.y - 18)})`}>
              <rect x="0" y="-28" rx="10" ry="10" width="190" height="54" fill="#fff" stroke="rgba(0,0,0,0.14)" />
              <text x="12" y="-8" className="svAxisText">
                {monthLabel(tip.m)}
              </text>
              <text x="12" y="14" className="svAxisText">
                {formatKWh(tip.v)} kWh
              </text>
            </g>
          )}

          {/* x labels full month, miring */}
          {series.map((d, i) => {
            const x = padL + i * xStep;
            const y = height - 45;
            return (
              <text
                key={`${d.month}-${i}`}
                x={x}
                y={y}
                className="svAxisText svAxisTextX"
                textAnchor="end"
                transform={`rotate(-35 ${x} ${y})`}
              >
                {monthLabel(d.month)}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

export default function SchoolView() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [schools, setSchools] = useState([]);
  const [logs, setLogs] = useState([]);

  const [selectedSchoolId, setSelectedSchoolId] = useState(null);

  // table sorting
  const [sortKey, setSortKey] = useState("sum_saving");
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "/");

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        const [schoolsRes, logsRes] = await Promise.all([
          fetch(`${base}data/schools.csv`),
          fetch(`${base}data/school_energy_log.csv`),
        ]);

        if (!schoolsRes.ok) throw new Error(`Failed to load schools.csv (${schoolsRes.status})`);
        if (!logsRes.ok) throw new Error(`Failed to load school_energy_log.csv (${logsRes.status})`);

        const schoolsText = await schoolsRes.text();
        const logsText = await logsRes.text();

        const schoolsRows = parseCSV(schoolsText);
        const logsRows = parseCSV(logsText);

        const schoolsNorm = schoolsRows.map((r) => ({
          ...r,
          school_id: String(r.school_id ?? "").trim(),
          school_name: String(r.school_name ?? "").trim(),
          city: String(r.city ?? "").trim(),
          district: String(r.district ?? "").trim(),
          address: String(r.address ?? "").trim(),
          installation_date: String(r.installation_date ?? "").trim(),
          latitude: toNumber(r.latitude),
          longitude: toNumber(r.longitude),
          installation_cost: toNumber(r.installation_cost),
          panel_capacity_kw: toNumber(r.panel_capacity_kw),
        }));

        const logsNorm = logsRows.map((r) => ({
          ...r,
          school_id: String(r.school_id ?? "").trim(),
          month: String(r.month ?? "").trim(),
          energy_generated_kwh: toNumber(r.energy_generated_kwh),
          energy_used_kwh: toNumber(r.energy_used_kwh),
          grid_energy_kwh: toNumber(r.grid_energy_kwh),
          cost_saving_idr: toNumber(r.cost_saving_idr),
        }));

        setSchools(schoolsNorm);
        setLogs(logsNorm);
        setSelectedSchoolId(null);
      } catch (e) {
        setErr(e?.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const schoolsById = useMemo(() => {
    const m = new Map();
    for (const s of schools) m.set(s.school_id, s);
    return m;
  }, [schools]);

  const selectedSchool = useMemo(() => {
    if (!selectedSchoolId) return null;
    return schoolsById.get(selectedSchoolId) || null;
  }, [selectedSchoolId, schoolsById]);

  const scopeLogs = useMemo(() => {
    if (!selectedSchoolId) return logs;
    return logs.filter((l) => l.school_id === selectedSchoolId);
  }, [logs, selectedSchoolId]);

  const monthsInScope = useMemo(() => {
    const y = getMaxYearFromLogs(scopeLogs);
    return buildYearMonths(y);
  }, [scopeLogs]);

  const kpis = useMemo(() => {
    let totalGen = 0;
    let totalUse = 0;
    let totalGrid = 0;
    let totalSave = 0;

    for (const l of scopeLogs) {
      totalGen += l.energy_generated_kwh;
      totalUse += l.energy_used_kwh;
      totalGrid += l.grid_energy_kwh;
      totalSave += l.cost_saving_idr;
    }

    return {
      totalGen,
      totalUse,
      totalGrid,
      totalSave,
      totalSchools: schools.length,
    };
  }, [scopeLogs, schools.length]);

  const globalTotals = useMemo(() => {
    let totalGen = 0;
    let totalUse = 0;
    let totalSave = 0;
    for (const l of logs) {
      totalGen += l.energy_generated_kwh;
      totalUse += l.energy_used_kwh;
      totalSave += l.cost_saving_idr;
    }
    return { totalGen, totalUse, totalSave };
  }, [logs]);

  const seriesByMonth = useMemo(() => {
    const byMonth = new Map();

    for (const m of monthsInScope) {
      byMonth.set(m, {
        month: m,
        energy_generated_kwh: 0,
        energy_used_kwh: 0,
        grid_energy_kwh: 0,
        cost_saving_idr: 0,
      });
    }

    for (const l of scopeLogs) {
      if (!byMonth.has(l.month)) continue;
      const row = byMonth.get(l.month);
      row.energy_generated_kwh += l.energy_generated_kwh;
      row.energy_used_kwh += l.energy_used_kwh;
      row.grid_energy_kwh += l.grid_energy_kwh;
      row.cost_saving_idr += l.cost_saving_idr;
    }

    return Array.from(byMonth.values()).sort((a, b) => a.month.localeCompare(b.month));
  }, [scopeLogs, monthsInScope]);

  const tableRows = useMemo(() => {
    const acc = new Map();

    for (const l of logs) {
      const id = l.school_id;
      const prev = acc.get(id) || { sum_generated: 0, sum_used: 0, sum_saving: 0 };
      prev.sum_generated += l.energy_generated_kwh;
      prev.sum_used += l.energy_used_kwh;
      prev.sum_saving += l.cost_saving_idr;
      acc.set(id, prev);
    }

    const rows = schools.map((s) => {
      const sums = acc.get(s.school_id) || { sum_generated: 0, sum_used: 0, sum_saving: 0 };
      return {
        school_id: s.school_id,
        school_name: s.school_name,
        sum_generated: sums.sum_generated,
        sum_used: sums.sum_used,
        sum_saving: sums.sum_saving,
      };
    });

    rows.sort((a, b) => sortCompare(a, b, sortKey, sortDir));
    return rows;
  }, [schools, logs, sortKey, sortDir]);

  const title = selectedSchool
    ? `Schools Dashboard - ${selectedSchool.school_name}`
    : "Schools Dashboard - West Java";

  const subtitle = selectedSchool
    ? `${selectedSchool.city} • ${selectedSchool.district}`
    : `Total schools tracked: ${schools.length}`;

  const toggleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortIcon = (key) => {
    if (key !== sortKey) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  if (loading) {
    return (
      <div className="svWrap">
        <div className="svLoading">Loading dashboard…</div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="svWrap">
        <div className="svError">
          <div className="svErrorTitle">Failed to load S Dynamic</div>
          <div className="svErrorText">{err}</div>
          <div className="svErrorHint">
            Pastikan file ada di <code>public/data/schools.csv</code> dan{" "}
            <code>public/data/school_energy_log.csv</code>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="svWrap">
      <div className="svBoard">
        <div className="svBoardHead">
          <div>
            <div className="svBoardTitle">{title}</div>
            <div className="svBoardSub">{subtitle}</div>
          </div>

          {selectedSchoolId && (
            <button type="button" className="svClearBtn" onClick={() => setSelectedSchoolId(null)}>
              Clear selection
            </button>
          )}
        </div>

        {/* KPI strip (scope-based) */}
        <div className="svKpiGrid">
          <div className="svKpi">
            <div className="svKpiLabel">Total Generation</div>
            <div className="svKpiValue">{formatKWh(kpis.totalGen)} kWh</div>
          </div>
          <div className="svKpi">
            <div className="svKpiLabel">Total Usage</div>
            <div className="svKpiValue">{formatKWh(kpis.totalUse)} kWh</div>
          </div>
          <div className="svKpi">
            <div className="svKpiLabel">Total Savings</div>
            <div className="svKpiValue">{formatIDR(kpis.totalSave)}</div>
          </div>
          <div className="svKpi svKpiSmall">
            <div className="svKpiLabel">{selectedSchoolId ? "Panel Capacity" : "Total Schools"}</div>
            <div className="svKpiValue">
              {selectedSchoolId ? `${selectedSchool?.panel_capacity_kw ?? 0} kW` : String(kpis.totalSchools)}
            </div>
          </div>
        </div>

        <div className="svGrid2">
          <AreaChart
            title="School Total Grid Energy by Month"
            series={seriesByMonth}
            valueKey="grid_energy_kwh"
            yTitle="Total Grid Energy"
          />

          <AreaChart
            title="School Total Generation by Month"
            series={seriesByMonth}
            valueKey="energy_generated_kwh"
            yTitle="Total Generation"
          />
        </div>

        {/* Bottom row */}
        <div className="svGridBottom">
          <div className="svCard">
            <div className="svCardHead">
              <div className="svCardTitle">Selected School Details</div>
            </div>

            {!selectedSchool ? (
              <div className="svDetails">
                <div className="svDetailsMuted">
                  Click on any school in the table to view details + filter all data.
                </div>
                <div className="svDetailsRow">
                  <span className="svDetailsKey">Scope</span>
                  <span className="svDetailsVal">All Schools (West Java)</span>
                </div>
              </div>
            ) : (
              <>
                <div className="svMap">
                  <iframe
                    className="svMapFrame"
                    title={`Map: ${selectedSchool.school_name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${selectedSchool.latitude},${selectedSchool.longitude}&z=14&output=embed`}
                  />
                </div>

                <div className="svDetails">
                  <div className="svDetailsRow">
                    <span className="svDetailsKey">School</span>
                    <span className="svDetailsVal">{selectedSchool.school_name}</span>
                  </div>
                  <div className="svDetailsRow">
                    <span className="svDetailsKey">City / District</span>
                    <span className="svDetailsVal">
                      {selectedSchool.city} / {selectedSchool.district}
                    </span>
                  </div>
                  <div className="svDetailsRow">
                    <span className="svDetailsKey">Address</span>
                    <span className="svDetailsVal">{selectedSchool.address}</span>
                  </div>
                  <div className="svDetailsRow">
                    <span className="svDetailsKey">Installation Date</span>
                    <span className="svDetailsVal">{selectedSchool.installation_date}</span>
                  </div>
                  <div className="svDetailsRow">
                    <span className="svDetailsKey">Installation Cost</span>
                    <span className="svDetailsVal">{formatIDR(selectedSchool.installation_cost)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="svCard svTableCard">
            <div className="svCardHead svCardHeadTight">
              <div className="svCardTitle">Schools Table</div>
              <div className="svCardHint">Click header to sort • Click row to filter</div>
            </div>

            <div className="svTableWrap">
              <table className="svTable">
                <thead>
                  <tr>
                    <th
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleSort("school_name")}
                      onKeyDown={(e) => e.key === "Enter" && toggleSort("school_name")}
                      className="isSortable"
                    >
                      <div className="svTh">
                        <div className="svThText svThOneLine">school_name</div>
                        <span className="svThSort">{sortIcon("school_name")}</span>
                      </div>
                    </th>

                    <th
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleSort("sum_generated")}
                      onKeyDown={(e) => e.key === "Enter" && toggleSort("sum_generated")}
                      className="isSortable isRight"
                    >
                      <div className="svTh svThCenter">
                        <div className="svThText">
                          <span className="svThTop">Sum of</span>
                          <span className="svThBottom">energy_generated_kwh</span>
                        </div>
                        <span className="svThSort">{sortIcon("sum_generated")}</span>
                      </div>
                    </th>

                    <th
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleSort("sum_used")}
                      onKeyDown={(e) => e.key === "Enter" && toggleSort("sum_used")}
                      className="isSortable isRight"
                    >
                      <div className="svTh svThCenter">
                        <div className="svThText">
                          <span className="svThTop">Sum of</span>
                          <span className="svThBottom">energy_used_kwh</span>
                        </div>
                        <span className="svThSort">{sortIcon("sum_used")}</span>
                      </div>
                    </th>

                    <th
                      role="button"
                      tabIndex={0}
                      onClick={() => toggleSort("sum_saving")}
                      onKeyDown={(e) => e.key === "Enter" && toggleSort("sum_saving")}
                      className="isSortable isRight"
                    >
                      <div className="svTh svThCenter">
                        <div className="svThText">
                          <span className="svThTop">Sum of</span>
                          <span className="svThBottom">cost_saving_idr</span>
                        </div>
                        <span className="svThSort">{sortIcon("sum_saving")}</span>
                      </div>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {tableRows.map((r) => {
                    const active = r.school_id === selectedSchoolId;
                    return (
                      <tr
                        key={r.school_id}
                        className={active ? "isActive" : ""}
                        onClick={() => setSelectedSchoolId(r.school_id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && setSelectedSchoolId(r.school_id)}
                        title="Click to filter dashboard"
                      >
                        <td className="svSchool">{r.school_name}</td>
                        <td className="isRight">{formatKWh(r.sum_generated)}</td>
                        <td className="isRight">{formatKWh(r.sum_used)}</td>
                        <td className="isRight">{formatIDR(r.sum_saving)}</td>
                      </tr>
                    );
                  })}
                </tbody>

                <tfoot>
                  <tr>
                    <td>Total (All schools)</td>
                    <td className="isRight">{formatKWh(globalTotals.totalGen)}</td>
                    <td className="isRight">{formatKWh(globalTotals.totalUse)}</td>
                    <td className="isRight">{formatIDR(globalTotals.totalSave)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="svTableFooterNote">
              * Charts + KPIs follow current scope: {selectedSchoolId ? "Selected school" : "All schools"}. Table total is always global.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}