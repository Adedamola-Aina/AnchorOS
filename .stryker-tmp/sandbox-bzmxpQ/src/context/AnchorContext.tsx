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
import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
type TabType = 'dashboard' | 'finance' | 'commitments' | 'settings';
interface AppContextType {
  activeTab: TabType;
  navigateTo: (tab: TabType, params?: Record<string, string | number | undefined>) => void;
}
export const AppContext = createContext<AppContextType | undefined>(undefined);
export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  if (stryMutAct_9fa48("1480")) {
    {}
  } else {
    stryCov_9fa48("1480");
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>(() => {
      if (stryMutAct_9fa48("1481")) {
        {}
      } else {
        stryCov_9fa48("1481");
        const saved = localStorage.getItem(stryMutAct_9fa48("1482") ? "" : (stryCov_9fa48("1482"), 'anchor_active_tab'));
        return stryMutAct_9fa48("1485") ? saved as TabType && 'dashboard' : stryMutAct_9fa48("1484") ? false : stryMutAct_9fa48("1483") ? true : (stryCov_9fa48("1483", "1484", "1485"), saved as TabType || (stryMutAct_9fa48("1486") ? "" : (stryCov_9fa48("1486"), 'dashboard')));
      }
    });
    const navigateTo = (tab: TabType, params?: Record<string, string | number | undefined>) => {
      if (stryMutAct_9fa48("1487")) {
        {}
      } else {
        stryCov_9fa48("1487");
        setActiveTab(tab);
        localStorage.setItem(stryMutAct_9fa48("1488") ? "" : (stryCov_9fa48("1488"), 'anchor_active_tab'), tab);
        // Map internal tab names to routes
        const routeMap: Record<TabType, string> = stryMutAct_9fa48("1489") ? {} : (stryCov_9fa48("1489"), {
          'dashboard': stryMutAct_9fa48("1490") ? "" : (stryCov_9fa48("1490"), '/dashboard'),
          'finance': stryMutAct_9fa48("1491") ? "" : (stryCov_9fa48("1491"), '/finance'),
          'commitments': stryMutAct_9fa48("1492") ? "" : (stryCov_9fa48("1492"), '/commitments'),
          'settings': stryMutAct_9fa48("1493") ? "" : (stryCov_9fa48("1493"), '/settings')
        });
        let path = routeMap[tab];

        // Append query params if present
        if (stryMutAct_9fa48("1495") ? false : stryMutAct_9fa48("1494") ? true : (stryCov_9fa48("1494", "1495"), params)) {
          if (stryMutAct_9fa48("1496")) {
            {}
          } else {
            stryCov_9fa48("1496");
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
              if (stryMutAct_9fa48("1497")) {
                {}
              } else {
                stryCov_9fa48("1497");
                if (stryMutAct_9fa48("1500") ? value === undefined : stryMutAct_9fa48("1499") ? false : stryMutAct_9fa48("1498") ? true : (stryCov_9fa48("1498", "1499", "1500"), value !== undefined)) {
                  if (stryMutAct_9fa48("1501")) {
                    {}
                  } else {
                    stryCov_9fa48("1501");
                    searchParams.append(key, String(value));
                  }
                }
              }
            });
            const queryString = searchParams.toString();
            if (stryMutAct_9fa48("1503") ? false : stryMutAct_9fa48("1502") ? true : (stryCov_9fa48("1502", "1503"), queryString)) {
              if (stryMutAct_9fa48("1504")) {
                {}
              } else {
                stryCov_9fa48("1504");
                path += stryMutAct_9fa48("1505") ? `` : (stryCov_9fa48("1505"), `?${queryString}`);
              }
            }
          }
        }
        navigate(path);
        window.scrollTo(stryMutAct_9fa48("1506") ? {} : (stryCov_9fa48("1506"), {
          top: 0,
          behavior: stryMutAct_9fa48("1507") ? "" : (stryCov_9fa48("1507"), 'smooth')
        }));
      }
    };
    return <AppContext.Provider value={stryMutAct_9fa48("1508") ? {} : (stryCov_9fa48("1508"), {
      activeTab,
      navigateTo
    })}>
      {children}
    </AppContext.Provider>;
  }
};
export const useApp = () => {
  if (stryMutAct_9fa48("1509")) {
    {}
  } else {
    stryCov_9fa48("1509");
    const context = useContext(AppContext);
    if (stryMutAct_9fa48("1512") ? false : stryMutAct_9fa48("1511") ? true : stryMutAct_9fa48("1510") ? context : (stryCov_9fa48("1510", "1511", "1512"), !context)) throw new Error(stryMutAct_9fa48("1513") ? "" : (stryCov_9fa48("1513"), 'useApp must be used within AppProvider'));
    return context;
  }
};