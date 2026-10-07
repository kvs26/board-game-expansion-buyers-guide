#!/usr/bin/env python3
"""Merge the research CSVs in raw-source/ into the site's data files.

Inputs (all in this folder):
  research-batch*.csv        one row per expansion (researched 2026-09-27)
  research-batch*-games.csv  one row per base game
Outputs:
  ../src/data/catalog.json   what the site renders
  ../src/data/games.txt      plain list of game names (one per line)

Run from anywhere:  python3 raw-source/build_catalog.py
Nothing here invents data: blanks stay null. The only things added are
Amazon links whose product page was fetched and title-checked (VERIFIED_ASINS).
"""
import csv
import glob
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, '..', 'src', 'data')

# ASINs whose amazon.com/dp page returned 200 with a matching product title.
VERIFIED_ON = '2026-09-27'
VERIFIED_ASINS = {
    'B0859N3BJ4', 'B07GJWQP7S', 'B0BQNDF2YV', 'B07DFYKQ15', 'B0C6MT8WM9',
    'B08LZSZXF2', 'B0BH72GXZ5', 'B098M3TXFH', 'B0BZJCKX69', 'B00CAG5LJ2',
    'B00CE3IA44', 'B00SDUQ3LE', 'B0779M8YF5', 'B07888RJSX', 'B07887YDTC',
    'B01LGRTKBK', 'B0B783N2T6', 'B01I5RNQUK', 'B01N4PYI1T', 'B0799BNL8R',
    'B0CB9BRD5N', 'B000YLAOEW', 'B08F65MX4L', 'B07F454YF3', 'B01MUHP51S',
    # audit pass 2026-09-27
    'B015GF1C1Y', 'B015GF2ZTM', 'B01M6W5IBZ', 'B00BJLUGMG', 'B06Y5L48XT',
    'B07194GD7R', 'B07C8R45GV', 'B07CQ9FK8K', 'B07HFHX33K', 'B077697S51',
    'B005OQ2ZY4', 'B0D2LNSPXR',
    'B08F5MD2Y6', 'B08FRSYGXM', 'B0BSR43PY1', 'B01LYLIS2U', 'B01LWYVDA8',
    'B0B1VXPX6H', 'B003D3OD4K', 'B0B5B2BP7D', 'B0B59XK9CS', 'B008GRI010',
    'B00TF7YMVW', 'B01C9E3TUC', 'B075VJBHLY', 'B083PJH4R7', 'B09HR2Z62B',
    'B0BMM56M88', 'B0D424D44S', 'B00XUMZC9E',
    'B01IPUGYK6', 'B072HZSLL6', 'B01L0VX6CG', 'B07RX6XR6Z', 'B0H92CY1JJ',
    'B0C33VPTTC', 'B0BNCNCB4W', 'B0C9DL1TH7', 'B0859NHVRD', 'B07GN812Q5',
    'B0BBSHZFLB', 'B06VWBP1NS', 'B085DLZRFQ', 'B09RL12VK7',
    'B09XX2PQ3B', 'B09XWPH6FK', 'B096N452TR', 'B0BFZ3RPBQ', 'B07YVMSCSV',
    'B01MT7TRXI', 'B073WN3JK6', 'B0FSF479PH', 'B003Q5SS5K',
    'B0DD9ZWSM6', 'B0B7JQ8T7H',
}

VERDICTS = {'buy_first', 'worth_it', 'depends', 'skip_unless'}


def blank(v):
    v = (v or '').strip()
    return v or None


def to_int(v):
    v = blank(v)
    if v is None:
        return None
    m = re.match(r'^\d+', v)
    return int(m.group()) if m else None


def to_float(v):
    v = blank(v)
    try:
        return round(float(v.replace('$', '')), 2) if v else None
    except ValueError:
        return None


def urls(v):
    return [u.strip() for u in (v or '').split(';') if u.strip().startswith('http')]


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def link(asin):
    asin = blank(asin)
    if asin and asin in VERIFIED_ASINS:
        return f'https://www.amazon.com/dp/{asin}'
    return ''


KIND_ORDER = {'amazon': 0, 'publisher': 1, 'retailer': 2}


def read_buy_links():
    """buy-links/<game-slug>.csv: target,store,kind,url,edition_note,checked_on,how_verified.
    target is an expansion slug or '_base' for the base game."""
    out = {}
    for f in sorted(glob.glob(os.path.join(HERE, 'buy-links', '*.csv'))):
        game = os.path.splitext(os.path.basename(f))[0]
        with open(f, encoding='utf-8') as fh:
            for r in csv.DictReader(fh):
                url = (r.get('url') or '').strip()
                kind = (r.get('kind') or '').strip()
                if not url.startswith('https://'):
                    raise SystemExit(f'{f}: bad url {url!r}')
                if kind not in KIND_ORDER:
                    raise SystemExit(f'{f}: bad kind {kind!r}')
                out.setdefault((game, r['target'].strip()), []).append({
                    'store': r['store'].strip(),
                    'kind': kind,
                    'url': url,
                    'note': blank(r.get('edition_note')),
                })
    return out


def merge_links(asin_url, extra):
    links = [{'store': 'Amazon', 'kind': 'amazon', 'url': asin_url, 'note': None}] if asin_url else []
    seen = {l['url'] for l in links}
    for l in extra or []:
        if l['url'] in seen or (l['kind'] == 'amazon' and asin_url):
            continue
        seen.add(l['url'])
        links.append(l)
    return sorted(links, key=lambda l: KIND_ORDER[l['kind']])


def read(pattern):
    rows = []
    batch = re.compile(r'research-batch\d+(-games)?\.csv$')
    for f in sorted(glob.glob(os.path.join(HERE, pattern))):
        name = os.path.basename(f)
        if not batch.match(name) or name.endswith('-games.csv') != pattern.endswith('-games.csv'):
            continue
        with open(f, encoding='utf-8') as fh:
            rows.extend(csv.DictReader(fh))
    return rows


def main():
    buy = read_buy_links()
    used = set()
    games = []
    for r in read('research-batch*-games.csv'):
        slug = r['base_game_slug'].strip()
        used.add((slug, '_base'))
        links = merge_links(link(r['amazon_asin']), buy.get((slug, '_base')))
        games.append({
            'buyLinks': links,
            'slug': r['base_game_slug'].strip(),
            'name': r['base_game'].strip(),
            'publisher': blank(r['publisher']),
            'minPlayers': to_int(r['min_players']),
            'maxPlayers': to_int(r['max_players']),
            'playTime': blank(r['play_time']),
            'oneLine': blank(r['one_line']),
            'priceUsd': to_float(r['price_usd']),
            'sources': urls(r['source_urls']),
            'checkedOn': blank(r['checked_on']),
            'affiliate': {
                'affiliate_url': next((l['url'] for l in links if l['kind'] == 'amazon'), ''),
                'affiliate_enabled': False,
                'requires_disclosure': True,
            },
        })
    game_slugs = {g['slug'] for g in games}

    expansions = []
    for r in read('research-batch*.csv'):
        game = r['base_game_slug'].strip()
        assert game in game_slugs, f'unknown game {game}'
        exp_slug = blank(r['expansion_slug']) or slugify(r['expansion_name'])
        verdict = blank(r['verdict'])
        if verdict and verdict not in VERDICTS:
            raise SystemExit(f'bad verdict {verdict!r} on {r["expansion_name"]}')
        used.add((game, exp_slug))
        links = merge_links(link(r['amazon_asin']), buy.get((game, exp_slug)))
        expansions.append({
            'buyLinks': links,
            'id': f'{game}--{exp_slug}',
            'slug': exp_slug,
            'game': game,
            'name': r['expansion_name'].strip(),
            'type': blank(r['product_type']),
            'publisher': blank(r['publisher']),
            'releaseYear': to_int(r['release_year']),
            'baseRequired': blank(r['base_game_required']),
            '_requiresNames': [n.strip() for n in (r['requires_also'] or '').split(';') if n.strip()],
            'prerequisiteRule': blank(r['prerequisite_rule']),
            'minPlayers': to_int(r['min_players']),
            'maxPlayers': to_int(r['max_players']),
            'adds': blank(r['what_it_adds']),
            'fixes': blank(r['what_it_fixes']),
            'complexity': blank(r['complexity_change']),
            'groupStyle': {'cooperative': 'mixed'}.get(blank(r['group_style']), blank(r['group_style'])),
            'verdict': verdict,
            'buyOrder': to_int(r['buy_order']) if verdict else None,
            'reason': blank(r['verdict_reason']),
            'verdictStatus': 'draft' if verdict else None,
            'priceUsd': to_float(r['price_usd']),
            'priceKind': blank(r['price_kind']),
            'sources': {
                'facts': urls(r['fact_source_urls']),
                'verdict': urls(r['verdict_sources']),
                'price': urls(r['price_source_url']),
            },
            'checkedOn': blank(r['checked_on']),
            'affiliate': {
                'affiliate_url': next((l['url'] for l in links if l['kind'] == 'amazon'), ''),
                'affiliate_enabled': False,
                'requires_disclosure': True,
            },
        })

    unknown = set(buy) - used
    if unknown:
        raise SystemExit(f'buy-links targets not in catalog: {sorted(unknown)}')

    # Resolve requires_also names -> ids within the same game. Names that don't
    # resolve (e.g. "A or B" alternatives) are dropped; prerequisiteRule keeps
    # the plain-English explanation.
    by_name = {(e['game'], e['name']): e['id'] for e in expansions}
    ids = set()
    for e in expansions:
        assert e['id'] not in ids, f'duplicate id {e["id"]}'
        ids.add(e['id'])
        req = []
        unresolved = []
        for n in e.pop('_requiresNames'):
            rid = by_name.get((e['game'], n))
            if rid:
                req.append(rid)
            else:
                unresolved.append(n)
                print(f'  note: unresolved requirement on {e["id"]}: {n!r} (kept in prerequisiteRule only)')
        e['requires'] = req
        rule = e['prerequisiteRule'] or ''
        # A one-word rule ("either") isn't plain English — spell it out from the names.
        if unresolved and len(rule.split()) < 3:
            e['prerequisiteRule'] = rule = 'You need ' + ' and '.join(unresolved) + '.'
        # Show the rule on the buy-order list when it says more than "you need the base game".
        special = unresolved or e['baseRequired'] != 'yes' or ' or ' in rule or ' plus ' in rule
        e['listNote'] = rule if rule and not req and special else None

    catalog = {
        'generatedFrom': 'raw-source/research-batch*.csv',
        'linksVerifiedOn': VERIFIED_ON,
        'games': sorted(games, key=lambda g: g['name'].lower()),
        'expansions': expansions,
    }
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(os.path.join(OUT_DIR, 'catalog.json'), 'w', encoding='utf-8') as fh:
        json.dump(catalog, fh, ensure_ascii=False, indent=2)
        fh.write('\n')
    with open(os.path.join(OUT_DIR, 'games.txt'), 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(g['name'] for g in catalog['games']) + '\n')

    rated = sum(1 for e in expansions if e['verdict'])
    linked = sum(1 for e in expansions if e['affiliate']['affiliate_url'])
    any_link = sum(1 for e in expansions if e['buyLinks'])
    missing = [e['id'] for e in expansions if e['verdict'] and not e['buyLinks']]
    print(f'{len(games)} games, {len(expansions)} expansions, {rated} rated, '
          f'{linked} with Amazon links, {any_link} with any buy link')
    for m in missing:
        print(f'  ranked but no buy link: {m}')


if __name__ == '__main__':
    main()
