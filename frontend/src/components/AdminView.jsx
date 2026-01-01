import React, { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import Papa from "papaparse";
import "../styles/AdminView.css";

const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

function normalizeName(s) {
  return String(s || "")
    .toUpperCase()
    .replace(/^KABUPATEN\s+/i, "")
    .replace(/^KOTA\s+/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function pickFeatureCode(props) {
  const candidates = [
    "city_district_code",
    "kode_kab",
    "kode_kota",
    "KODE_KAB",
    "KODE_KOTA",
    "KODE",
    "kode",
    "id",
  ];
  for (const k of candidates) {
    const v = props?.[k];
    if (v !== undefined && v !== null && String(v).trim() !== "") return String(v).trim();
  }
  return null;
}

function pickFeatureName(props) {
  const candidates = [
    "city_district_name",
    "nama_kab",
    "nama_kota",
    "NAMOBJ",
    "name",
    "NAME",
    "nama",
    "NAMA",
  ];
  for (const k of candidates) {
    if (props?.[k]) return String(props[k]);
  }
  return "";
}

function makeBins(maxVal) {
  const m = Math.max(0, Number(maxVal) || 0);
  if (m <= 0) return [0, 1, 2, 3, 4];
  return [0, m * 0.2, m * 0.4, m * 0.6, m * 0.8];
}

function getColor(value, bins) {
  if (value === null || value === undefined) return "#eeeeee";
  const v = Number(value) || 0;

  if (v >= bins[4]) return "#1b5e20";
  if (v >= bins[3]) return "#2e7d32";
  if (v >= bins[2]) return "#66bb6a";
  if (v >= bins[1]) return "#a5d6a7";
  return "#e8f5e9";
}

export default function AdminView() {
  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const geoLayerRef = useRef(null);

  const [geo, setGeo] = useState(null);
  const [rows, setRows] = useState([]);
  const [year, setYear] = useState(2024);

  // selected disimpan hanya code+name (value dihitung dari yearData)
  const [selected, setSelected] = useState(null); // { code, name }

  // load geojson (1x)
  useEffect(() => {
    (async () => {
      const res = await fetch("/geo/west_java_boundary.geojson");
      if (!res.ok) throw new Error(`GeoJSON fetch failed: ${res.status}`);
      const gj = await res.json();
      setGeo(gj);
    })().catch((e) => console.error("Failed to load geojson:", e));
  }, []);

  // load csv (1x)
  useEffect(() => {
    (async () => {
      const res = await fetch("/data/admin.csv");
      if (!res.ok) throw new Error(`CSV fetch failed: ${res.status}`);
      const text = await res.text();
      const parsed = Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      });
      setRows(parsed.data || []);
    })().catch((e) => console.error("Failed to load csv:", e));
  }, []);

  const yearData = useMemo(() => {
    const byCode = new Map();
    const byName = new Map();
    const filtered = rows.filter((r) => Number(r.year) === Number(year));

    for (const r of filtered) {
      const code = r.city_district_code != null ? String(r.city_district_code).trim() : null;
      const name = normalizeName(r.city_district_name);
      const val = Number(r.number_of_power_plants) || 0;

      if (code) byCode.set(code, val);
      if (name) byName.set(name, val);
    }
    return { byCode, byName, filtered };
  }, [rows, year]);

  const selectedValue = useMemo(() => {
    if (!selected) return null;

    const code = selected.code ? String(selected.code).trim() : null;
    const nameNorm = normalizeName(selected.name);

    if (code && yearData.byCode.has(code)) return yearData.byCode.get(code);
    if (nameNorm && yearData.byName.has(nameNorm)) return yearData.byName.get(nameNorm);

    return 0;
  }, [selected, yearData]);

  const total = useMemo(
    () => yearData.filtered.reduce((acc, r) => acc + (Number(r.number_of_power_plants) || 0), 0),
    [yearData.filtered]
  );

  const maxVal = useMemo(() => {
    let m = 0;
    for (const r of yearData.filtered) m = Math.max(m, Number(r.number_of_power_plants) || 0);
    return m;
  }, [yearData.filtered]);

  const bins = useMemo(() => makeBins(maxVal), [maxVal]);

  // init map once
  useEffect(() => {
    if (!mapDivRef.current || mapRef.current) return;

    const map = L.map(mapDivRef.current, {
      center: [-6.95, 107.6],
      zoom: 8,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      geoLayerRef.current = null;
    };
  }, []);

  // draw / redraw geo layer whenever geo/year/yearData/selected changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !geo) return;

    // remove old layer
    if (geoLayerRef.current) {
      geoLayerRef.current.remove();
      geoLayerRef.current = null;
    }

    const styleFn = (feature) => {
      const props = feature?.properties || {};
      const code = pickFeatureCode(props);
      const nameNorm = normalizeName(pickFeatureName(props));

      let value = null;
      if (code && yearData.byCode.has(code)) value = yearData.byCode.get(code);
      else if (nameNorm && yearData.byName.has(nameNorm)) value = yearData.byName.get(nameNorm);

      const isSelected =
        !!selected &&
        ((code && selected.code && String(selected.code).trim() === String(code).trim()) ||
          (nameNorm && normalizeName(selected.name) === nameNorm));

      return {
        weight: isSelected ? 3 : 1,
        color: isSelected ? "#000000" : "#263238",
        fillOpacity: isSelected ? 0.85 : 0.65,
        fillColor: getColor(value, bins),
        dashArray: value === null ? "4 4" : undefined,
      };
    };

    const layer = L.geoJSON(geo, {
      style: styleFn,
      onEachFeature: (feature, l) => {
        const props = feature?.properties || {};
        const code = pickFeatureCode(props);
        const rawName = pickFeatureName(props);
        const nameNorm = normalizeName(rawName);

        let value = null;
        if (code && yearData.byCode.has(code)) value = yearData.byCode.get(code);
        else if (nameNorm && yearData.byName.has(nameNorm)) value = yearData.byName.get(nameNorm);

        const tooltipHtml = [
          `<div class="tt">`,
          `<div class="ttTitle">Year: ${year}</div>`,
          `<div class="ttRow"><b>City/Regency:</b> ${rawName || "Wilayah"}</div>`,
          `<div class="ttRow"><b>Number of Power Plants:</b> ${value ?? "-"}</div>`,
          `</div>`,
        ].join("");

        l.bindTooltip(tooltipHtml, {
          sticky: true,
          direction: "top",
          className: "adminMapTooltip",
        });

        l.on("mouseover", () => l.setStyle({ weight: 2, fillOpacity: 0.8 }));
        l.on("mouseout", () => {
          // balik ke style normal + selected-highlight (Leaflet akan panggil styleFn)
          layer.resetStyle(l);
        });

        l.on("click", () => {
          setSelected({
            code,
            name: rawName || "Wilayah",
          });
        });
      },
    });

    layer.addTo(map);
    geoLayerRef.current = layer;

    // fit bounds sekali ketika pertama kali ada geo
    try {
      const b = layer.getBounds();
      if (b.isValid()) map.fitBounds(b, { padding: [20, 20] });
    } catch {
      // ignore
    }
  }, [geo, yearData, bins, year, selected]);

  return (
    <div className="adminViewWrap">
      <div className="adminMapWrap">
        <div className="adminMapHeader">
          <div>
            <div className="adminTitle">Power Plant Map (District/City)</div>
            <div className="adminSubtitle">Year: {year} • Hover for tooltip • Click for detail</div>
          </div>
        </div>

        <div className="adminMapCanvas">
          <div ref={mapDivRef} style={{ height: "100%", width: "100%" }} />
        </div>
      </div>

      <aside className="adminSideWrap">
        <div className="adminPanelTitle">Adjust Map Display</div>

        <div className="adminPanelSection">
          <div className="adminPanelLabel">Year</div>
          <div className="yearGrid">
            {YEARS.map((y) => (
              <button
                key={y}
                className={`yearBtn ${y === year ? "yearBtnActive" : ""}`}
                onClick={() => setYear(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        <div className="adminPanelSection">
          <div className="infoCard">
            <div className="infoLabel">Total Power Plant Count</div>
            <div className="bigNumber">{total}</div>
            <div className="infoHint">Year {year} • Unit</div>
          </div>
        </div>

        <div className="adminPanelSection">
          <div className="infoCard">
            <div className="infoLabel">Region Details</div>

            {!selected ? (
              <div className="infoHint" style={{ marginTop: 8 }}>
                Click district/city on the map to display details here.
              </div>
            ) : (
              <div style={{ marginTop: 8 }}>
                <div className="selectedName">{selected.name}</div>
                <div className="selectedValue">
                  Number of Power Plants: <strong>{selectedValue ?? 0}</strong>
                </div>
                <button className="clearSelectionBtn" onClick={() => setSelected(null)}>
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="adminPanelSection">
          <div className="legendCard">
            <div className="infoLabel">Legend</div>
            <div className="legendRow">
              {["Low", "", "", "", "High"].map((t, i) => (
                <div key={i} className="legendItem">
                  <span
                    className="legendSwatch"
                    style={{
                      background: getColor(i === 0 ? bins[1] * 0.5 : bins[i] + 0.0001, bins),
                    }}
                  />
                  <span className="legendText">{t}</span>
                </div>
              ))}
            </div>
            <div className="infoHint" style={{ marginTop: 6 }}>
              Darker color = greater number of generators.
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}