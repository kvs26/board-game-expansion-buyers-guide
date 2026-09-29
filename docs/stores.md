# Stores used for buy links

Links come from `raw-source/buy-links/<game>.csv`, plus the verified Amazon ASINs in `raw-source/build_catalog.py` (`VERIFIED_ASINS`).
Counts below are rows in the CSVs as of 2026-09-29. Amazon has 10 CSV rows plus the ASIN-based links (82 expansions have Amazon in total).

## Marketplace (`kind=amazon`)
| Store | Domain | CSV rows |
|---|---|---|
| Amazon | amazon.com | 10 (+ verified ASINs) |

## Publisher stores (`kind=publisher`)
| Store | Domain | Rows | Games |
|---|---|---|---|
| Rio Grande Games | riograndegames.com | 22 | Dominion, Race for the Galaxy |
| Days of Wonder | daysofwonder.com | 19 | Ticket to Ride, Small World |
| Stonemaier Games | store.stonemaiergames.com | 16 | Scythe, Wingspan, Viticulture |
| Leder Games | ledergames.com | 15 | Root |
| Z-Man Games | zmangames.com | 12 | Carcassonne, Pandemic |
| CATAN Shop | catanshop.com | 11 | CATAN |
| Dire Wolf | shop.direwolfdigital.com | 10 | Dune: Imperium, Clank! |
| Asmodee Store | store.asmodee.com | 8 | 7 Wonders, Carcassonne, Pandemic |
| Tabletop Tycoon | tycoongames.com | 7 | Everdell |
| Stronghold Games | strongholdgames.com | 6 | Terraforming Mars |
| Greater Than Games | shop.greaterthangames.com | 6 | Spirit Island |
| IELLO | iellogames.com | 5 | King of Tokyo |
| Czech Games Edition | czechgames.com | 4 | Lost Ruins of Arnak |
| AEG Store | alderacstore.com | 2 | Cascadia |

## Game stores / retailers (`kind=retailer`)
| Store | Domain | Rows |
|---|---|---|
| Miniature Market | miniaturemarket.com | 41 |
| GameNerdz | gamenerdz.com | 31 |
| CoolStuffInc | coolstuffinc.com | 8 |
| Walmart | walmart.com | 2 |
| Target | target.com | 1 |
| Pandemonium Books & Games | pandemoniumbooks.com | 1 |

## Notes
- Rio Grande Games and Days of Wonder block bots, so their links were verified through their sitemaps or listing pages only.
- Affiliate programs to look into later: Amazon Associates, plus Miniature Market and GameNerdz, which may have affiliate programs.
