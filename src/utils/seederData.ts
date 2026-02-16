/**
 * Seeder Data Constants
 * Extracted from seeder.ts per CLAUDE.md §3.2
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
export const TITLES = stryMutAct_9fa48("1918") ? [] : (stryCov_9fa48("1918"), [stryMutAct_9fa48("1919") ? "" : (stryCov_9fa48("1919"), 'Groceries'), stryMutAct_9fa48("1920") ? "" : (stryCov_9fa48("1920"), 'Rent'), stryMutAct_9fa48("1921") ? "" : (stryCov_9fa48("1921"), 'Salary'), stryMutAct_9fa48("1922") ? "" : (stryCov_9fa48("1922"), 'Netflix'), stryMutAct_9fa48("1923") ? "" : (stryCov_9fa48("1923"), 'Coffee'), stryMutAct_9fa48("1924") ? "" : (stryCov_9fa48("1924"), 'Gym'), stryMutAct_9fa48("1925") ? "" : (stryCov_9fa48("1925"), 'Internet'), stryMutAct_9fa48("1926") ? "" : (stryCov_9fa48("1926"), 'Electricity'), stryMutAct_9fa48("1927") ? "" : (stryCov_9fa48("1927"), 'Dining Out'), stryMutAct_9fa48("1928") ? "" : (stryCov_9fa48("1928"), 'Freelance Project'), stryMutAct_9fa48("1929") ? "" : (stryCov_9fa48("1929"), 'Gas'), stryMutAct_9fa48("1930") ? "" : (stryCov_9fa48("1930"), 'Insurance'), stryMutAct_9fa48("1931") ? "" : (stryCov_9fa48("1931"), 'Phone Bill'), stryMutAct_9fa48("1932") ? "" : (stryCov_9fa48("1932"), 'School Fees'), stryMutAct_9fa48("1933") ? "" : (stryCov_9fa48("1933"), 'Books'), stryMutAct_9fa48("1934") ? "" : (stryCov_9fa48("1934"), 'Amazon'), stryMutAct_9fa48("1935") ? "" : (stryCov_9fa48("1935"), 'Apple'), stryMutAct_9fa48("1936") ? "" : (stryCov_9fa48("1936"), 'Spotify'), stryMutAct_9fa48("1937") ? "" : (stryCov_9fa48("1937"), 'Pharmacy'), stryMutAct_9fa48("1938") ? "" : (stryCov_9fa48("1938"), 'Vet')]);
export const ACCOUNT_NAMES = stryMutAct_9fa48("1939") ? [] : (stryCov_9fa48("1939"), [stryMutAct_9fa48("1940") ? "" : (stryCov_9fa48("1940"), 'Main Checking'), stryMutAct_9fa48("1941") ? "" : (stryCov_9fa48("1941"), 'Savings Goal'), stryMutAct_9fa48("1942") ? "" : (stryCov_9fa48("1942"), 'Emergency Fund'), stryMutAct_9fa48("1943") ? "" : (stryCov_9fa48("1943"), 'Travel Card'), stryMutAct_9fa48("1944") ? "" : (stryCov_9fa48("1944"), 'Investment Portfolio'), stryMutAct_9fa48("1945") ? "" : (stryCov_9fa48("1945"), 'Joint Account'), stryMutAct_9fa48("1946") ? "" : (stryCov_9fa48("1946"), 'House Fund')]);
export const TASK_TITLES = stryMutAct_9fa48("1947") ? [] : (stryCov_9fa48("1947"), [stryMutAct_9fa48("1948") ? "" : (stryCov_9fa48("1948"), 'Morning Jog'), stryMutAct_9fa48("1949") ? "" : (stryCov_9fa48("1949"), 'Read 30 mins'), stryMutAct_9fa48("1950") ? "" : (stryCov_9fa48("1950"), 'Weekly Review'), stryMutAct_9fa48("1951") ? "" : (stryCov_9fa48("1951"), 'Pay Bills'), stryMutAct_9fa48("1952") ? "" : (stryCov_9fa48("1952"), 'Call Mom'), stryMutAct_9fa48("1953") ? "" : (stryCov_9fa48("1953"), 'Gym Workout'), stryMutAct_9fa48("1954") ? "" : (stryCov_9fa48("1954"), 'Meal Prep'), stryMutAct_9fa48("1955") ? "" : (stryCov_9fa48("1955"), 'Clean House'), stryMutAct_9fa48("1956") ? "" : (stryCov_9fa48("1956"), 'Check Stocks'), stryMutAct_9fa48("1957") ? "" : (stryCov_9fa48("1957"), 'Plan Vacation'), stryMutAct_9fa48("1958") ? "" : (stryCov_9fa48("1958"), 'Bible Study'), stryMutAct_9fa48("1959") ? "" : (stryCov_9fa48("1959"), 'Code Review'), stryMutAct_9fa48("1960") ? "" : (stryCov_9fa48("1960"), 'Stretching')]);
export const CATEGORIES = stryMutAct_9fa48("1961") ? [] : (stryCov_9fa48("1961"), [stryMutAct_9fa48("1962") ? "" : (stryCov_9fa48("1962"), 'Living'), stryMutAct_9fa48("1963") ? "" : (stryCov_9fa48("1963"), 'Food'), stryMutAct_9fa48("1964") ? "" : (stryCov_9fa48("1964"), 'Entertainment'), stryMutAct_9fa48("1965") ? "" : (stryCov_9fa48("1965"), 'Health'), stryMutAct_9fa48("1966") ? "" : (stryCov_9fa48("1966"), 'Transport'), stryMutAct_9fa48("1967") ? "" : (stryCov_9fa48("1967"), 'Utilities'), stryMutAct_9fa48("1968") ? "" : (stryCov_9fa48("1968"), 'Personal'), stryMutAct_9fa48("1969") ? "" : (stryCov_9fa48("1969"), 'Income'), stryMutAct_9fa48("1970") ? "" : (stryCov_9fa48("1970"), 'Transfer')]);
export const DOMAINS = stryMutAct_9fa48("1971") ? [] : (stryCov_9fa48("1971"), [stryMutAct_9fa48("1972") ? "" : (stryCov_9fa48("1972"), 'Health'), stryMutAct_9fa48("1973") ? "" : (stryCov_9fa48("1973"), 'Fitness'), stryMutAct_9fa48("1974") ? "" : (stryCov_9fa48("1974"), 'Work'), stryMutAct_9fa48("1975") ? "" : (stryCov_9fa48("1975"), 'Bible'), stryMutAct_9fa48("1976") ? "" : (stryCov_9fa48("1976"), 'Personal Development'), stryMutAct_9fa48("1977") ? "" : (stryCov_9fa48("1977"), 'Financial')]);
export const ACCOUNT_COLORS = stryMutAct_9fa48("1978") ? [] : (stryCov_9fa48("1978"), [stryMutAct_9fa48("1979") ? "" : (stryCov_9fa48("1979"), '#3b82f6'), stryMutAct_9fa48("1980") ? "" : (stryCov_9fa48("1980"), '#10b981'), stryMutAct_9fa48("1981") ? "" : (stryCov_9fa48("1981"), '#f59e0b'), stryMutAct_9fa48("1982") ? "" : (stryCov_9fa48("1982"), '#8b5cf6'), stryMutAct_9fa48("1983") ? "" : (stryCov_9fa48("1983"), '#ef4444'), stryMutAct_9fa48("1984") ? "" : (stryCov_9fa48("1984"), '#ec4899'), stryMutAct_9fa48("1985") ? "" : (stryCov_9fa48("1985"), '#6366f1')]);

/**
 * Unbiased cryptographic random integer in [0, max) via rejection sampling.
 * Satisfies both js/insecure-randomness and js/biased-cryptographic-random.
 */
export const secureRandomInt = (max: number): number => {
  if (stryMutAct_9fa48("1986")) {
    {}
  } else {
    stryCov_9fa48("1986");
    if (stryMutAct_9fa48("1990") ? max > 0 : stryMutAct_9fa48("1989") ? max < 0 : stryMutAct_9fa48("1988") ? false : stryMutAct_9fa48("1987") ? true : (stryCov_9fa48("1987", "1988", "1989", "1990"), max <= 0)) return 0;
    const maxUint32PlusOne = 0x100000000;
    const maxSafeIntegerPlusOne = 0x20000000000000;
    if (stryMutAct_9fa48("1994") ? max < maxUint32PlusOne : stryMutAct_9fa48("1993") ? max > maxUint32PlusOne : stryMutAct_9fa48("1992") ? false : stryMutAct_9fa48("1991") ? true : (stryCov_9fa48("1991", "1992", "1993", "1994"), max >= maxUint32PlusOne)) {
      if (stryMutAct_9fa48("1995")) {
        {}
      } else {
        stryCov_9fa48("1995");
        const buf = new Uint32Array(2);
        const limit = stryMutAct_9fa48("1996") ? maxSafeIntegerPlusOne + maxSafeIntegerPlusOne % max : (stryCov_9fa48("1996"), maxSafeIntegerPlusOne - (stryMutAct_9fa48("1997") ? maxSafeIntegerPlusOne * max : (stryCov_9fa48("1997"), maxSafeIntegerPlusOne % max)));
        let value: number;
        do {
          if (stryMutAct_9fa48("1998")) {
            {}
          } else {
            stryCov_9fa48("1998");
            crypto.getRandomValues(buf);
            value = stryMutAct_9fa48("1999") ? buf[0] * 0x200000 - (buf[1] >>> 11) : (stryCov_9fa48("1999"), (stryMutAct_9fa48("2000") ? buf[0] / 0x200000 : (stryCov_9fa48("2000"), buf[0] * 0x200000)) + (buf[1] >>> 11));
          }
        } while (stryMutAct_9fa48("2003") ? value < limit : stryMutAct_9fa48("2002") ? value > limit : stryMutAct_9fa48("2001") ? false : (stryCov_9fa48("2001", "2002", "2003"), value >= limit));
        return stryMutAct_9fa48("2004") ? value * max : (stryCov_9fa48("2004"), value % max);
      }
    }
    const buf = new Uint32Array(1);
    const limit = stryMutAct_9fa48("2005") ? maxUint32PlusOne + maxUint32PlusOne % max : (stryCov_9fa48("2005"), maxUint32PlusOne - (stryMutAct_9fa48("2006") ? maxUint32PlusOne * max : (stryCov_9fa48("2006"), maxUint32PlusOne % max))); // largest multiple of max in uint32 range
    let value: number;
    do {
      if (stryMutAct_9fa48("2007")) {
        {}
      } else {
        stryCov_9fa48("2007");
        crypto.getRandomValues(buf);
        value = buf[0];
      }
    } while (stryMutAct_9fa48("2010") ? value < limit : stryMutAct_9fa48("2009") ? value > limit : stryMutAct_9fa48("2008") ? false : (stryCov_9fa48("2008", "2009", "2010"), value >= limit));
    return stryMutAct_9fa48("2011") ? value * max : (stryCov_9fa48("2011"), value % max);
  }
};
export const randomDate = (start: Date, end: Date): Date => {
  if (stryMutAct_9fa48("2012")) {
    {}
  } else {
    stryCov_9fa48("2012");
    const range = stryMutAct_9fa48("2013") ? end.getTime() + start.getTime() : (stryCov_9fa48("2013"), end.getTime() - start.getTime());
    return new Date(stryMutAct_9fa48("2014") ? start.getTime() - secureRandomInt(range) : (stryCov_9fa48("2014"), start.getTime() + secureRandomInt(range)));
  }
};
export const randomItem = stryMutAct_9fa48("2015") ? () => undefined : (stryCov_9fa48("2015"), (() => {
  const randomItem = <T,>(arr: T[]): T => arr[secureRandomInt(arr.length)];
  return randomItem;
})());