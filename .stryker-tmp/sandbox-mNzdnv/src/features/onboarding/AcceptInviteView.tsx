/**
 * Family Mode v2 - Accept Invitation View
 * 
 * Orchestrates the invitation acceptance flow.
 * 
 * Refactored per CLAUDE.md 200-line rule.
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
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { InviteStatusDisplay } from './components/InviteStatusDisplay';
import { InviteDetails } from './components/InviteDetails';
import { InviteCodeEntry } from './components/InviteCodeEntry';
interface ValidateTokenResult {
  valid: boolean;
  error?: string;
  ownerDisplayName?: string;
  ownerEmail?: string;
  status?: string;
  isLocked?: boolean;
}
interface AcceptInvitationResult {
  success: boolean;
  attemptsRemaining?: number;
}
type InviteStatus = 'validating' | 'valid' | 'invalid' | 'code_entry' | 'verifying' | 'awaiting_confirmation' | 'locked';
export const AcceptInviteView = () => {
  if (stryMutAct_9fa48("5113")) {
    {}
  } else {
    stryCov_9fa48("5113");
    const {
      user
    } = useAuth();
    const [status, setStatus] = useState<InviteStatus>(stryMutAct_9fa48("5114") ? "" : (stryCov_9fa48("5114"), 'validating'));
    const [inviteData, setInviteData] = useState<ValidateTokenResult | null>(null);
    const [inviteId, setInviteId] = useState<string>(stryMutAct_9fa48("5115") ? "Stryker was here!" : (stryCov_9fa48("5115"), ''));
    const [error, setError] = useState<string>(stryMutAct_9fa48("5116") ? "Stryker was here!" : (stryCov_9fa48("5116"), ''));
    const [verificationCode, setVerificationCode] = useState<string>(stryMutAct_9fa48("5117") ? "Stryker was here!" : (stryCov_9fa48("5117"), ''));
    const [attemptsRemaining, setAttemptsRemaining] = useState<number>(5);
    useEffect(() => {
      if (stryMutAct_9fa48("5118")) {
        {}
      } else {
        stryCov_9fa48("5118");
        const checkToken = async () => {
          if (stryMutAct_9fa48("5119")) {
            {}
          } else {
            stryCov_9fa48("5119");
            const params = new URLSearchParams(window.location.search);
            const token = params.get(stryMutAct_9fa48("5120") ? "" : (stryCov_9fa48("5120"), 'token'));
            const code = params.get(stryMutAct_9fa48("5121") ? "" : (stryCov_9fa48("5121"), 'code'));
            if (stryMutAct_9fa48("5124") ? false : stryMutAct_9fa48("5123") ? true : stryMutAct_9fa48("5122") ? token : (stryCov_9fa48("5122", "5123", "5124"), !token)) {
              if (stryMutAct_9fa48("5125")) {
                {}
              } else {
                stryCov_9fa48("5125");
                setStatus(stryMutAct_9fa48("5126") ? "" : (stryCov_9fa48("5126"), 'invalid'));
                setError(stryMutAct_9fa48("5127") ? "" : (stryCov_9fa48("5127"), 'No invitation token provided.'));
                return;
              }
            }
            setInviteId(token);
            if (stryMutAct_9fa48("5129") ? false : stryMutAct_9fa48("5128") ? true : (stryCov_9fa48("5128", "5129"), code)) setVerificationCode(code);
            try {
              if (stryMutAct_9fa48("5130")) {
                {}
              } else {
                stryCov_9fa48("5130");
                const functions = getFunctions();
                const validateToken = httpsCallable<{
                  token: string;
                }, ValidateTokenResult>(functions, stryMutAct_9fa48("5131") ? "" : (stryCov_9fa48("5131"), 'validateInvitationToken'));
                const result = await validateToken(stryMutAct_9fa48("5132") ? {} : (stryCov_9fa48("5132"), {
                  token
                }));
                const data = result.data;
                if (stryMutAct_9fa48("5134") ? false : stryMutAct_9fa48("5133") ? true : (stryCov_9fa48("5133", "5134"), data.valid)) {
                  if (stryMutAct_9fa48("5135")) {
                    {}
                  } else {
                    stryCov_9fa48("5135");
                    setInviteData(data);
                    setStatus((stryMutAct_9fa48("5138") ? data.status !== 'awaiting_confirmation' : stryMutAct_9fa48("5137") ? false : stryMutAct_9fa48("5136") ? true : (stryCov_9fa48("5136", "5137", "5138"), data.status === (stryMutAct_9fa48("5139") ? "" : (stryCov_9fa48("5139"), 'awaiting_confirmation')))) ? stryMutAct_9fa48("5140") ? "" : (stryCov_9fa48("5140"), 'awaiting_confirmation') : stryMutAct_9fa48("5141") ? "" : (stryCov_9fa48("5141"), 'valid'));
                  }
                } else {
                  if (stryMutAct_9fa48("5142")) {
                    {}
                  } else {
                    stryCov_9fa48("5142");
                    setStatus(data.isLocked ? stryMutAct_9fa48("5143") ? "" : (stryCov_9fa48("5143"), 'locked') : stryMutAct_9fa48("5144") ? "" : (stryCov_9fa48("5144"), 'invalid'));
                    setError(stryMutAct_9fa48("5147") ? data.error && 'Invalid invitation.' : stryMutAct_9fa48("5146") ? false : stryMutAct_9fa48("5145") ? true : (stryCov_9fa48("5145", "5146", "5147"), data.error || (stryMutAct_9fa48("5148") ? "" : (stryCov_9fa48("5148"), 'Invalid invitation.'))));
                  }
                }
              }
            } catch (err) {
              if (stryMutAct_9fa48("5149")) {
                {}
              } else {
                stryCov_9fa48("5149");
                console.error(err);
                setStatus(stryMutAct_9fa48("5150") ? "" : (stryCov_9fa48("5150"), 'invalid'));
                setError(stryMutAct_9fa48("5151") ? "" : (stryCov_9fa48("5151"), 'Failed to validate invitation.'));
              }
            }
          }
        };
        checkToken();
      }
    }, stryMutAct_9fa48("5152") ? ["Stryker was here"] : (stryCov_9fa48("5152"), []));
    const handleProceedToCode = () => {
      if (stryMutAct_9fa48("5153")) {
        {}
      } else {
        stryCov_9fa48("5153");
        if (stryMutAct_9fa48("5156") ? verificationCode.length !== 6 : stryMutAct_9fa48("5155") ? false : stryMutAct_9fa48("5154") ? true : (stryCov_9fa48("5154", "5155", "5156"), verificationCode.length === 6)) {
          if (stryMutAct_9fa48("5157")) {
            {}
          } else {
            stryCov_9fa48("5157");
            handleVerifyCode({
              preventDefault: () => {}
            } as React.FormEvent);
          }
        } else {
          if (stryMutAct_9fa48("5158")) {
            {}
          } else {
            stryCov_9fa48("5158");
            setStatus(stryMutAct_9fa48("5159") ? "" : (stryCov_9fa48("5159"), 'code_entry'));
          }
        }
      }
    };
    const handleVerifyCode = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("5160")) {
        {}
      } else {
        stryCov_9fa48("5160");
        e.preventDefault();
        if (stryMutAct_9fa48("5163") ? (!user || !inviteId) && verificationCode.length !== 6 : stryMutAct_9fa48("5162") ? false : stryMutAct_9fa48("5161") ? true : (stryCov_9fa48("5161", "5162", "5163"), (stryMutAct_9fa48("5165") ? !user && !inviteId : stryMutAct_9fa48("5164") ? false : (stryCov_9fa48("5164", "5165"), (stryMutAct_9fa48("5166") ? user : (stryCov_9fa48("5166"), !user)) || (stryMutAct_9fa48("5167") ? inviteId : (stryCov_9fa48("5167"), !inviteId)))) || (stryMutAct_9fa48("5169") ? verificationCode.length === 6 : stryMutAct_9fa48("5168") ? false : (stryCov_9fa48("5168", "5169"), verificationCode.length !== 6)))) return;
        setStatus(stryMutAct_9fa48("5170") ? "" : (stryCov_9fa48("5170"), 'verifying'));
        setError(stryMutAct_9fa48("5171") ? "Stryker was here!" : (stryCov_9fa48("5171"), ''));
        try {
          if (stryMutAct_9fa48("5172")) {
            {}
          } else {
            stryCov_9fa48("5172");
            const functions = getFunctions();
            const acceptInvitation = httpsCallable<{
              inviteId: string;
              verificationCode: string;
            }, AcceptInvitationResult>(functions, stryMutAct_9fa48("5173") ? "" : (stryCov_9fa48("5173"), 'acceptInvitation'));
            const result = await acceptInvitation(stryMutAct_9fa48("5174") ? {} : (stryCov_9fa48("5174"), {
              inviteId,
              verificationCode
            }));
            if (stryMutAct_9fa48("5176") ? false : stryMutAct_9fa48("5175") ? true : (stryCov_9fa48("5175", "5176"), result.data.success)) {
              if (stryMutAct_9fa48("5177")) {
                {}
              } else {
                stryCov_9fa48("5177");
                setStatus(stryMutAct_9fa48("5178") ? "" : (stryCov_9fa48("5178"), 'awaiting_confirmation'));
              }
            } else {
              if (stryMutAct_9fa48("5179")) {
                {}
              } else {
                stryCov_9fa48("5179");
                const remaining = stryMutAct_9fa48("5182") ? result.data.attemptsRemaining && 0 : stryMutAct_9fa48("5181") ? false : stryMutAct_9fa48("5180") ? true : (stryCov_9fa48("5180", "5181", "5182"), result.data.attemptsRemaining || 0);
                setAttemptsRemaining(remaining);
                if (stryMutAct_9fa48("5185") ? remaining !== 0 : stryMutAct_9fa48("5184") ? false : stryMutAct_9fa48("5183") ? true : (stryCov_9fa48("5183", "5184", "5185"), remaining === 0)) {
                  if (stryMutAct_9fa48("5186")) {
                    {}
                  } else {
                    stryCov_9fa48("5186");
                    setStatus(stryMutAct_9fa48("5187") ? "" : (stryCov_9fa48("5187"), 'locked'));
                    setError(stryMutAct_9fa48("5188") ? "" : (stryCov_9fa48("5188"), 'Too many failed attempts. This invitation has been locked.'));
                  }
                } else {
                  if (stryMutAct_9fa48("5189")) {
                    {}
                  } else {
                    stryCov_9fa48("5189");
                    setStatus(stryMutAct_9fa48("5190") ? "" : (stryCov_9fa48("5190"), 'code_entry'));
                    setError(stryMutAct_9fa48("5191") ? `` : (stryCov_9fa48("5191"), `Incorrect code. ${remaining} attempt${(stryMutAct_9fa48("5194") ? remaining !== 1 : stryMutAct_9fa48("5193") ? false : stryMutAct_9fa48("5192") ? true : (stryCov_9fa48("5192", "5193", "5194"), remaining === 1)) ? stryMutAct_9fa48("5195") ? "Stryker was here!" : (stryCov_9fa48("5195"), '') : stryMutAct_9fa48("5196") ? "" : (stryCov_9fa48("5196"), 's')} remaining.`));
                    setVerificationCode(stryMutAct_9fa48("5197") ? "Stryker was here!" : (stryCov_9fa48("5197"), ''));
                  }
                }
              }
            }
          }
        } catch (err) {
          if (stryMutAct_9fa48("5198")) {
            {}
          } else {
            stryCov_9fa48("5198");
            const error = err as Error & {
              code?: string;
            };
            console.error(err);
            if (stryMutAct_9fa48("5201") ? error.message.includes('locked') : stryMutAct_9fa48("5200") ? false : stryMutAct_9fa48("5199") ? true : (stryCov_9fa48("5199", "5200", "5201"), error.message?.includes(stryMutAct_9fa48("5202") ? "" : (stryCov_9fa48("5202"), 'locked')))) {
              if (stryMutAct_9fa48("5203")) {
                {}
              } else {
                stryCov_9fa48("5203");
                setStatus(stryMutAct_9fa48("5204") ? "" : (stryCov_9fa48("5204"), 'locked'));
                setError(stryMutAct_9fa48("5205") ? "" : (stryCov_9fa48("5205"), 'This invitation has been locked due to too many failed attempts.'));
              }
            } else {
              if (stryMutAct_9fa48("5206")) {
                {}
              } else {
                stryCov_9fa48("5206");
                setStatus(stryMutAct_9fa48("5207") ? "" : (stryCov_9fa48("5207"), 'code_entry'));
                setError(stryMutAct_9fa48("5208") ? "" : (stryCov_9fa48("5208"), 'Failed to verify code. Please try again.'));
              }
            }
          }
        }
      }
    };
    const handleBack = () => {
      if (stryMutAct_9fa48("5209")) {
        {}
      } else {
        stryCov_9fa48("5209");
        setStatus(stryMutAct_9fa48("5210") ? "" : (stryCov_9fa48("5210"), 'valid'));
        if (stryMutAct_9fa48("5213") ? false : stryMutAct_9fa48("5212") ? true : stryMutAct_9fa48("5211") ? new URLSearchParams(window.location.search).get('code') : (stryCov_9fa48("5211", "5212", "5213"), !new URLSearchParams(window.location.search).get(stryMutAct_9fa48("5214") ? "" : (stryCov_9fa48("5214"), 'code')))) {
          if (stryMutAct_9fa48("5215")) {
            {}
          } else {
            stryCov_9fa48("5215");
            setVerificationCode(stryMutAct_9fa48("5216") ? "Stryker was here!" : (stryCov_9fa48("5216"), ''));
          }
        }
        setError(stryMutAct_9fa48("5217") ? "Stryker was here!" : (stryCov_9fa48("5217"), ''));
      }
    };
    const ownerName = stryMutAct_9fa48("5220") ? (inviteData?.ownerDisplayName || inviteData?.ownerEmail) && '' : stryMutAct_9fa48("5219") ? false : stryMutAct_9fa48("5218") ? true : (stryCov_9fa48("5218", "5219", "5220"), (stryMutAct_9fa48("5222") ? inviteData?.ownerDisplayName && inviteData?.ownerEmail : stryMutAct_9fa48("5221") ? false : (stryCov_9fa48("5221", "5222"), (stryMutAct_9fa48("5223") ? inviteData.ownerDisplayName : (stryCov_9fa48("5223"), inviteData?.ownerDisplayName)) || (stryMutAct_9fa48("5224") ? inviteData.ownerEmail : (stryCov_9fa48("5224"), inviteData?.ownerEmail)))) || (stryMutAct_9fa48("5225") ? "Stryker was here!" : (stryCov_9fa48("5225"), '')));

    // Status display states
    if (stryMutAct_9fa48("5227") ? false : stryMutAct_9fa48("5226") ? true : (stryCov_9fa48("5226", "5227"), (stryMutAct_9fa48("5228") ? [] : (stryCov_9fa48("5228"), [stryMutAct_9fa48("5229") ? "" : (stryCov_9fa48("5229"), 'validating'), stryMutAct_9fa48("5230") ? "" : (stryCov_9fa48("5230"), 'invalid'), stryMutAct_9fa48("5231") ? "" : (stryCov_9fa48("5231"), 'locked'), stryMutAct_9fa48("5232") ? "" : (stryCov_9fa48("5232"), 'awaiting_confirmation')])).includes(status))) {
      if (stryMutAct_9fa48("5233")) {
        {}
      } else {
        stryCov_9fa48("5233");
        return <InviteStatusDisplay status={status as 'validating' | 'invalid' | 'locked' | 'awaiting_confirmation'} error={error} ownerName={ownerName} />;
      }
    }

    // Main view
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl max-w-md w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

                {(stryMutAct_9fa48("5236") ? status === 'valid' && status === 'verifying' : stryMutAct_9fa48("5235") ? false : stryMutAct_9fa48("5234") ? true : (stryCov_9fa48("5234", "5235", "5236"), (stryMutAct_9fa48("5238") ? status !== 'valid' : stryMutAct_9fa48("5237") ? false : (stryCov_9fa48("5237", "5238"), status === (stryMutAct_9fa48("5239") ? "" : (stryCov_9fa48("5239"), 'valid')))) || (stryMutAct_9fa48("5241") ? status !== 'verifying' : stryMutAct_9fa48("5240") ? false : (stryCov_9fa48("5240", "5241"), status === (stryMutAct_9fa48("5242") ? "" : (stryCov_9fa48("5242"), 'verifying')))))) ? <InviteDetails user={user} ownerName={ownerName} isVerifying={stryMutAct_9fa48("5245") ? status !== 'verifying' : stryMutAct_9fa48("5244") ? false : stryMutAct_9fa48("5243") ? true : (stryCov_9fa48("5243", "5244", "5245"), status === (stryMutAct_9fa48("5246") ? "" : (stryCov_9fa48("5246"), 'verifying')))} hasVerificationCode={stryMutAct_9fa48("5249") ? verificationCode.length !== 6 : stryMutAct_9fa48("5248") ? false : stryMutAct_9fa48("5247") ? true : (stryCov_9fa48("5247", "5248", "5249"), verificationCode.length === 6)} onProceed={handleProceedToCode} /> : <InviteCodeEntry verificationCode={verificationCode} setVerificationCode={setVerificationCode} attemptsRemaining={attemptsRemaining} error={error} onSubmit={handleVerifyCode} onBack={handleBack} />}
            </div>
        </div>;
  }
};