import worldCountries from "world-countries";
import dialCodes from "../json/dialCodes";

/* build flag image url */
const getFlag = (iso) => `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;

export const countries = worldCountries
  .map((c) => ({
    name: c.name.common,
    iso: c.cca2,
    dial: dialCodes[c.cca2] || "",
    flag: getFlag(c.cca2),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));