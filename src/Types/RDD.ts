/**
 * @param db db Database name
 * @param date_start The requested start timestamp of the stats to get NOTE: this can be adjusted to fit the best available resolution
 * @param date_end The requested end timestamp of the stats to get NOTE: this can be adjusted to fit the best available resolution
 * @param precision By default all values are cast to int, if you need floating point precision you can provide a precision factor that will be applied to all values before being returned. For instance if you want 2 digit precision you should use a precision of 100, and divide the obtained results by 100.
 * @param fields If you are only interested in getting some fields you can provide the list of fields you want to get.
 */
interface RDD {
  db: string | DB;
  date_start?: string;
  date_end?: string;
  precision?: string;
  fields?: string[];
}

// interface RDDResponse {
//   db: string | DB;
//   fields: [string];
//   preicion: number;
// }
interface RDDResponse {
  success: boolean;
  result: {
    date_start: number | string;
    date: any[];
    date_end: number | string;
  };
}

enum DB {
  NET = "net",
  TEMP = "temp",
  DSL = "dsl",
  SWITCH = "switch",
}

/**
 * @param bw_up upload available bandwidth (in byte/s)
 * @param bw_down download available bandwidth (in byte/s)
 * @param rate_up upload rate (in byte/s)
 * @param rate_down download rate (in byte/s)
 * @param vpn_rate_up vpn client upload rate (in byte/s)
 * @param vpn_rate_down vpn client download rate (in byte/s)
 */
interface NET {
  bw_up: number | string;
  bw_down: number | string;
  rate_up: number | string;
  rate_down: number | string;
  vpn_rate_up: number | string;
  vpn_rate_down: number | string;
}

/**
 * @param cpum temperature cpum (in °C)
 * @param cpub temperature cpub (in °C)
 * @param sw temperature sw (in °C)
 * @param hdd temperature hdd (in °C)
 * @param hdd fan rpm
 * @deprecated temp1 temperature sensor 1 (in °C) [DEPRECATED, use cpum]
 * @deprecated temp2 temperature sensor 2 (in °C) [DEPRECATED, use cpub]
 * @deprecated temp3 temperature sensor 3 (in °C) [DEPRECATED, use sw]
 */
interface TEMP {
  cpum: number | string;
  cpub: number | string;
  sw: number | string;
  hdd: number | string;
  temp1: number | string;
  temp2: number | string;
  temp3: number | string;
}

/**
 * @param dsl available upload bandwidth (in byte/s)
 * @param dsl dsl available download bandwidth (in byte/s)
 * @param snr_up dsl upload signal/noise ratio (in 1/10 dB)
 * @param snr_down dsl download signal/noise ratio (in 1/10 dB)
 */
interface DSL {
  rate_up: number | string;
  rate_down: number | string;
  snr_up: number | string;
  snr_down: number | string;
}

/**
 * @param rx_1 receive rate on port 1 (in byte/s)
 * @param tx_2 transmit on port 1 (in byte/s)
 * @param rx_2 receive rate on port 2 (in byte/s)
 * @param tx_2 transmit on port 2 (in byte/s)
 * @param rx_3 receive rate on port 3 (in byte/s)
 * @param tx_3 transmit on port 3 (in byte/s)
 * @param rx_4 receive rate on port 4 (in byte/s)
 * @param tx_4 transmit on port 4 (in byte/s)
 */
interface SWITCH {
  rx_1: number | string;
  tx_1: number | string;
  rx_2: number | string;
  tx_2: number | string;
  rx_3: number | string;
  tx_3: number | string;
  rx_4: number | string;
  tx_4: number | string;
}

export { RDD, DB, NET, TEMP, DSL, SWITCH, RDDResponse };
