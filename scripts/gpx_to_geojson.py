"""Merge GPX track logs into one simplified GeoJSON, split by local day.

Usage: python scripts/gpx_to_geojson.py GPX_DIR OUT.geojson [--utc-offset 2]
       [--tolerance-m 15] [--break-km 5]

Points from every *.gpx in GPX_DIR are merged in time order, then split into
one LineString feature per local calendar day. Each line is simplified with
Douglas-Peucker. Where consecutive points are further apart than --break-km
(the logger was off) the line is split, and the jump is written as a separate
feature with properties.kind == "gap" so it can be drawn dashed.
"""

import argparse
import datetime as dt
import json
import math
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

NS = {"g": "http://www.topografix.com/GPX/1/1"}
R_EARTH = 6371008.8


def read_points(gpx_dir):
    pts = []
    for path in sorted(gpx_dir.glob("*.gpx")):
        for p in ET.parse(path).getroot().iterfind(".//g:trkpt", NS):
            t = p.find("g:time", NS)
            if t is None:
                continue
            e = p.find("g:ele", NS)
            when = dt.datetime.fromisoformat(t.text.replace("Z", "+00:00"))
            pts.append(
                (
                    when,
                    float(p.get("lat")),
                    float(p.get("lon")),
                    float(e.text) if e is not None else 0.0,
                )
            )
    pts.sort()
    return pts


def dist_m(a, b):
    p1, p2 = math.radians(a[0]), math.radians(b[0])
    h = (
        math.sin((p2 - p1) / 2) ** 2
        + math.cos(p1) * math.cos(p2) * math.sin(math.radians(b[1] - a[1]) / 2) ** 2
    )
    return 2 * R_EARTH * math.asin(math.sqrt(h))


def simplify(line, tol_m):
    """Iterative Douglas-Peucker on (lat, lon) in a local equirectangular frame."""
    if len(line) < 3:
        return line
    lat0 = math.radians(line[0][0])
    xy = [
        (math.radians(lon) * math.cos(lat0) * R_EARTH, math.radians(lat) * R_EARTH)
        for lat, lon in line
    ]
    keep = {0, len(line) - 1}
    stack = [(0, len(line) - 1)]
    while stack:
        i, j = stack.pop()
        (x1, y1), (x2, y2) = xy[i], xy[j]
        dx, dy = x2 - x1, y2 - y1
        norm = math.hypot(dx, dy)
        best, k = -1.0, None
        for m in range(i + 1, j):
            x, y = xy[m]
            d = (
                math.hypot(x - x1, y - y1)
                if norm == 0
                else abs(dy * (x - x1) - dx * (y - y1)) / norm
            )
            if d > best:
                best, k = d, m
        if best > tol_m:
            keep.add(k)
            stack += [(i, k), (k, j)]
    return [line[i] for i in sorted(keep)]


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("gpx_dir", type=Path)
    ap.add_argument("out", type=Path)
    ap.add_argument("--utc-offset", type=float, default=2, help="hours, for day split")
    ap.add_argument("--tolerance-m", type=float, default=15)
    ap.add_argument("--break-km", type=float, default=5)
    args = ap.parse_args()

    pts = read_points(args.gpx_dir)
    if not pts:
        sys.exit(f"no track points found in {args.gpx_dir}")
    off = dt.timedelta(hours=args.utc_offset)

    days = {}
    for p in pts:
        days.setdefault((p[0] + off).date(), []).append(p)

    features = []
    prev_end = None
    for n, (day, dpts) in enumerate(sorted(days.items()), start=1):
        # Split the day into runs wherever the logger jumped.
        runs, run = [], [dpts[0]]
        for a, b in zip(dpts, dpts[1:]):
            if dist_m(a[1:3], b[1:3]) > args.break_km * 1000:
                runs.append(run)
                run = []
            run.append(b)
        runs.append(run)

        km = sum(dist_m(a[1:3], b[1:3]) for r in runs for a, b in zip(r, r[1:])) / 1000
        lines = [
            [
                [round(lon, 5), round(lat, 5)]
                for lat, lon in simplify([q[1:3] for q in r], args.tolerance_m)
            ]
            for r in runs
        ]
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "kind": "day",
                    "day": n,
                    "date": day.isoformat(),
                    "km": round(km, 1),
                    "max_ele": round(max(q[3] for q in dpts)),
                },
                "geometry": {"type": "MultiLineString", "coordinates": lines},
            }
        )
        # Straight-line jump across a logging gap (this run's start vs the
        # previous run's end, which may be on the previous day).
        for r in runs:
            if (
                prev_end is not None
                and dist_m(prev_end[1:3], r[0][1:3]) > args.break_km * 1000
            ):
                features.append(
                    {
                        "type": "Feature",
                        "properties": {"kind": "gap", "day": n},
                        "geometry": {
                            "type": "LineString",
                            "coordinates": [
                                [round(prev_end[2], 5), round(prev_end[1], 5)],
                                [round(r[0][2], 5), round(r[0][1], 5)],
                            ],
                        },
                    }
                )
            prev_end = r[-1]

    args.out.write_text(
        json.dumps(
            {"type": "FeatureCollection", "features": features}, separators=(",", ":")
        )
    )
    n_pts = sum(
        len(seg)
        for f in features
        if f["properties"]["kind"] == "day"
        for seg in f["geometry"]["coordinates"]
    )
    kb = args.out.stat().st_size / 1024
    print(
        f"{len(pts)} points -> {n_pts} vertices, {len(features)} features, {kb:.0f} KB"
    )


if __name__ == "__main__":
    main()
