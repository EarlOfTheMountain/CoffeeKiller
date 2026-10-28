/**
 * Level 01 — "Deadbrew Heights"
 * The first map: a small plaza with the ruined Café Aroma at the top,
 * a road crossing, a decorative fountain nobody drinks from (it's decaf),
 * and the emergency bean sacks by the café door.
 *
 * Legend (see LEGEND in config.js):
 *   T tree   . grass   f flowers   - road   # wall   R roof
 *   D door   ~ water   = fence     S coffee-bean sack
 *
 * Spawn is a tile coordinate (column, row).
 */
export const level01 = {
  name: 'Deadbrew Heights',
  spawn: { x: 15, y: 10 },
  map: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'T............................T',
    'T...RRRRRRRRR................T',
    'T...RRRRRRRRR................T',
    'T...####D####.SS.............T',
    'T...f..--....................T',
    'T......--.............TTTTT..T',
    'T..f...--.............TTTTT..T',
    'T......--....................T',
    'T----------------------------T',
    'T----------------------------T',
    'T........f...........f.......T',
    'T...................~~~......T',
    'T...................~~~......T',
    'T..=....=....................T',
    'T..=....=....................T',
    'T..======....................T',
    'T..T......................T..T',
    'T.......f.............f......T',
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
  ],
};
