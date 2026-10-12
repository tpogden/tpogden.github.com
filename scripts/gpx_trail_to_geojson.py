"""Split a long-distance trail GPX into per-day GeoJSON lines.

Usage: python scripts/gpx_trail_to_geojson.py TRAIL.gpx DAYS.json OUT.geojson
       [--tolerance-m 25]

TRAIL.gpx: a GPX whose first <trk> is the main trail (extra tracks such as
alternative loops are ignored). DAYS.json: [{"to": "Place", "km": 27.5}, ...]
walked distances, in order. The trail is cut at the same fraction of its
length as each day's share of the total walked distance, so day boundaries are
approximate (typically within a km or two). Each line is simplified with
Douglas-Peucker.
"""

import argparse
import json
import math
import sys
from pathlib import Path
from xml.etree import ElementTree as ET

R_EARTH = 6371008.8


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
    ap.add_argument("gpx", type=Path)
    ap.add_argument("days", type=Path)
    ap.add_argument("out", type=Path)
    ap.add_argument("--tolerance-m", type=float, default=25)
    args = ap.parse_args()

    root = ET.parse(args.gpx).getroot()
    trk = next((e for e in root if e.tag.endswith("}trk") or e.tag == "trk"), None)
    if trk is None:
        sys.exit("no <trk> found")
    pts = [
        (float(p.get("lat")), float(p.get("lon")))
        for p in trk.iter()
        if p.tag.endswith("trkpt")
    ]
    days = json.loads(args.days.read_text())

    cum = [0.0]
    for a, b in zip(pts, pts[1:]):
        cum.append(cum[-1] + dist_m(a, b))
    total = cum[-1]
    walked = sum(d["km"] for d in days)

    features, start, c = [], 0, 0.0
    prev = "Edale"
    for n, d in enumerate(days, start=1):
        c += d["km"]
        target = total * c / walked
        end = (
            len(pts) - 1
            if n == len(days)
            else min(range(start, len(pts)), key=lambda i: abs(cum[i] - target))
        )
        seg = simplify(pts[start : end + 1], args.tolerance_m)
        features.append(
            {
                "type": "Feature",
                "properties": {"day": n, "from": prev, "to": d["to"], "km": d["km"]},
                "geometry": {
                    "type": "LineString",
                    "coordinates": [[round(lon, 5), round(lat, 5)] for lat, lon in seg],
                },
            }
        )
        prev, start = d["to"], end

    args.out.write_text(
        json.dumps(
            {"type": "FeatureCollection", "features": features}, separators=(",", ":")
        )
    )
    n_pts = sum(len(f["geometry"]["coordinates"]) for f in features)
    kb = args.out.stat().st_size / 1024
    print(f"{len(pts)} points ({total / 1000:.0f} km) -> {n_pts} vertices, {kb:.0f} KB")


if __name__ == "__main__":
    main()
