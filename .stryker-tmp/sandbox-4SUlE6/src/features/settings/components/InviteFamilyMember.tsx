/**
 * Family Mode v2 - Invite Family Member Component
 * 
 * Orchestrates the multi-step family invitation flow:
 * 1. Enter invitee's email
 * 2. Re-enter password to confirm intent
 * 3. MFA verification (if enabled)
 * 4. Display verification code to share
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
import { useState } from 'react';
import { useNotifications } from '../../../context/NotificationContext';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { EmailAuthProvider, reauthenticateWithCredential, getMultiFactorResolver, TotpMultiFactorGenerator } from 'firebase/auth';
import type { MultiFactorResolver } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { EmailVerificationWarning } from './EmailVerificationWarning';
import { InviteEmailStep } from './InviteEmailStep';
import { InvitePasswordStep } from './InvitePasswordStep';
import { InviteMfaStep } from './InviteMfaStep';
import { InviteSuccessStep } from './InviteSuccessStep';
interface InviteFamilyMemberProps {
  userEmail: string;
  isEmailVerified: boolean;
  onInviteSent: () => void;
}
type Step = 'email' | 'password' | 'mfa' | 'code';
interface CreateInvitationResult {
  success: boolean;
  verificationCode: string;
  inviteId: string;
}
export function InviteFamilyMember({
  userEmail,
  isEmailVerified,
  onInviteSent
}: InviteFamilyMemberProps) {
  if (stryMutAct_9fa48("5830")) {
    {}
  } else {
    stryCov_9fa48("5830");
    const {
      showToast
    } = useNotifications();
    const [step, setStep] = useState<Step>(stryMutAct_9fa48("5831") ? "" : (stryCov_9fa48("5831"), 'email'));
    const [inviteeEmail, setInviteeEmail] = useState(stryMutAct_9fa48("5832") ? "Stryker was here!" : (stryCov_9fa48("5832"), ''));
    const [password, setPassword] = useState(stryMutAct_9fa48("5833") ? "Stryker was here!" : (stryCov_9fa48("5833"), ''));
    const [verificationCode, setVerificationCode] = useState(stryMutAct_9fa48("5834") ? "Stryker was here!" : (stryCov_9fa48("5834"), ''));
    const [loading, setLoading] = useState(stryMutAct_9fa48("5835") ? true : (stryCov_9fa48("5835"), false));
    const [error, setError] = useState(stryMutAct_9fa48("5836") ? "Stryker was here!" : (stryCov_9fa48("5836"), ''));
    const [copied, setCopied] = useState(stryMutAct_9fa48("5837") ? true : (stryCov_9fa48("5837"), false));
    const [mfaCode, setMfaCode] = useState(stryMutAct_9fa48("5838") ? "Stryker was here!" : (stryCov_9fa48("5838"), ''));
    const [mfaResolver, setMfaResolver] = useState<MultiFactorResolver | null>(null);
    if (stryMutAct_9fa48("5841") ? false : stryMutAct_9fa48("5840") ? true : stryMutAct_9fa48("5839") ? isEmailVerified : (stryCov_9fa48("5839", "5840", "5841"), !isEmailVerified)) {
      if (stryMutAct_9fa48("5842")) {
        {}
      } else {
        stryCov_9fa48("5842");
        return <EmailVerificationWarning />;
      }
    }
    const handleEmailSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("5843")) {
        {}
      } else {
        stryCov_9fa48("5843");
        e.preventDefault();
        setError(stryMutAct_9fa48("5844") ? "Stryker was here!" : (stryCov_9fa48("5844"), ''));
        if (stryMutAct_9fa48("5847") ? false : stryMutAct_9fa48("5846") ? true : stryMutAct_9fa48("5845") ? inviteeEmail.includes('@') : (stryCov_9fa48("5845", "5846", "5847"), !inviteeEmail.includes(stryMutAct_9fa48("5848") ? "" : (stryCov_9fa48("5848"), '@')))) {
          if (stryMutAct_9fa48("5849")) {
            {}
          } else {
            stryCov_9fa48("5849");
            setError(stryMutAct_9fa48("5850") ? "" : (stryCov_9fa48("5850"), 'Please enter a valid email address'));
            return;
          }
        }
        if (stryMutAct_9fa48("5853") ? inviteeEmail.toLowerCase() !== userEmail.toLowerCase() : stryMutAct_9fa48("5852") ? false : stryMutAct_9fa48("5851") ? true : (stryCov_9fa48("5851", "5852", "5853"), (stryMutAct_9fa48("5854") ? inviteeEmail.toUpperCase() : (stryCov_9fa48("5854"), inviteeEmail.toLowerCase())) === (stryMutAct_9fa48("5855") ? userEmail.toUpperCase() : (stryCov_9fa48("5855"), userEmail.toLowerCase())))) {
          if (stryMutAct_9fa48("5856")) {
            {}
          } else {
            stryCov_9fa48("5856");
            setError(stryMutAct_9fa48("5857") ? "" : (stryCov_9fa48("5857"), 'You cannot invite yourself'));
            return;
          }
        }
        setStep(stryMutAct_9fa48("5858") ? "" : (stryCov_9fa48("5858"), 'password'));
      }
    };
    const completeInvitation = async () => {
      if (stryMutAct_9fa48("5859")) {
        {}
      } else {
        stryCov_9fa48("5859");
        const functions = getFunctions();
        const createInvitation = httpsCallable<{
          inviteeEmail: string;
          password: string;
        }, CreateInvitationResult>(functions, stryMutAct_9fa48("5860") ? "" : (stryCov_9fa48("5860"), 'createFamilyInvitation'));
        const result = await createInvitation(stryMutAct_9fa48("5861") ? {} : (stryCov_9fa48("5861"), {
          inviteeEmail,
          password
        }));
        if (stryMutAct_9fa48("5863") ? false : stryMutAct_9fa48("5862") ? true : (stryCov_9fa48("5862", "5863"), result.data.success)) {
          if (stryMutAct_9fa48("5864")) {
            {}
          } else {
            stryCov_9fa48("5864");
            setVerificationCode(result.data.verificationCode);
            setStep(stryMutAct_9fa48("5865") ? "" : (stryCov_9fa48("5865"), 'code'));
            showToast(stryMutAct_9fa48("5866") ? "" : (stryCov_9fa48("5866"), 'Invitation sent! Share the code below with your family member.'), stryMutAct_9fa48("5867") ? "" : (stryCov_9fa48("5867"), 'success'));
          }
        }
      }
    };
    const handlePasswordSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("5868")) {
        {}
      } else {
        stryCov_9fa48("5868");
        e.preventDefault();
        setError(stryMutAct_9fa48("5869") ? "Stryker was here!" : (stryCov_9fa48("5869"), ''));
        setLoading(stryMutAct_9fa48("5870") ? false : (stryCov_9fa48("5870"), true));
        try {
          if (stryMutAct_9fa48("5871")) {
            {}
          } else {
            stryCov_9fa48("5871");
            const user = auth.currentUser;
            if (stryMutAct_9fa48("5874") ? !user && !user.email : stryMutAct_9fa48("5873") ? false : stryMutAct_9fa48("5872") ? true : (stryCov_9fa48("5872", "5873", "5874"), (stryMutAct_9fa48("5875") ? user : (stryCov_9fa48("5875"), !user)) || (stryMutAct_9fa48("5876") ? user.email : (stryCov_9fa48("5876"), !user.email)))) throw new Error(stryMutAct_9fa48("5877") ? "" : (stryCov_9fa48("5877"), 'Not authenticated'));
            const credential = EmailAuthProvider.credential(user.email, password);
            try {
              if (stryMutAct_9fa48("5878")) {
                {}
              } else {
                stryCov_9fa48("5878");
                await reauthenticateWithCredential(user, credential);
              }
            } catch (authErr: unknown) {
              if (stryMutAct_9fa48("5879")) {
                {}
              } else {
                stryCov_9fa48("5879");
                const authError = authErr as {
                  code?: string;
                };
                if (stryMutAct_9fa48("5882") ? authError.code !== 'auth/multi-factor-auth-required' : stryMutAct_9fa48("5881") ? false : stryMutAct_9fa48("5880") ? true : (stryCov_9fa48("5880", "5881", "5882"), authError.code === (stryMutAct_9fa48("5883") ? "" : (stryCov_9fa48("5883"), 'auth/multi-factor-auth-required')))) {
                  if (stryMutAct_9fa48("5884")) {
                    {}
                  } else {
                    stryCov_9fa48("5884");
                    const resolver = getMultiFactorResolver(auth, authErr as Parameters<typeof getMultiFactorResolver>[1]);
                    setMfaResolver(resolver);
                    setStep(stryMutAct_9fa48("5885") ? "" : (stryCov_9fa48("5885"), 'mfa'));
                    setLoading(stryMutAct_9fa48("5886") ? true : (stryCov_9fa48("5886"), false));
                    return;
                  }
                }
                throw authErr;
              }
            }
            await completeInvitation();
          }
        } catch (err) {
          if (stryMutAct_9fa48("5887")) {
            {}
          } else {
            stryCov_9fa48("5887");
            const error = err as Error & {
              code?: string;
            };
            if (stryMutAct_9fa48("5890") ? error.code === 'auth/wrong-password' && error.code === 'auth/invalid-credential' : stryMutAct_9fa48("5889") ? false : stryMutAct_9fa48("5888") ? true : (stryCov_9fa48("5888", "5889", "5890"), (stryMutAct_9fa48("5892") ? error.code !== 'auth/wrong-password' : stryMutAct_9fa48("5891") ? false : (stryCov_9fa48("5891", "5892"), error.code === (stryMutAct_9fa48("5893") ? "" : (stryCov_9fa48("5893"), 'auth/wrong-password')))) || (stryMutAct_9fa48("5895") ? error.code !== 'auth/invalid-credential' : stryMutAct_9fa48("5894") ? false : (stryCov_9fa48("5894", "5895"), error.code === (stryMutAct_9fa48("5896") ? "" : (stryCov_9fa48("5896"), 'auth/invalid-credential')))))) {
              if (stryMutAct_9fa48("5897")) {
                {}
              } else {
                stryCov_9fa48("5897");
                setError(stryMutAct_9fa48("5898") ? "" : (stryCov_9fa48("5898"), 'Incorrect password'));
              }
            } else if (stryMutAct_9fa48("5901") ? error.message.includes('already have') : stryMutAct_9fa48("5900") ? false : stryMutAct_9fa48("5899") ? true : (stryCov_9fa48("5899", "5900", "5901"), error.message?.includes(stryMutAct_9fa48("5902") ? "" : (stryCov_9fa48("5902"), 'already have')))) {
              if (stryMutAct_9fa48("5903")) {
                {}
              } else {
                stryCov_9fa48("5903");
                setError(error.message);
              }
            } else if (stryMutAct_9fa48("5906") ? error.message.includes('Maximum') : stryMutAct_9fa48("5905") ? false : stryMutAct_9fa48("5904") ? true : (stryCov_9fa48("5904", "5905", "5906"), error.message?.includes(stryMutAct_9fa48("5907") ? "" : (stryCov_9fa48("5907"), 'Maximum')))) {
              if (stryMutAct_9fa48("5908")) {
                {}
              } else {
                stryCov_9fa48("5908");
                setError(stryMutAct_9fa48("5909") ? "" : (stryCov_9fa48("5909"), 'You have reached the daily limit of 10 invitations. Please try again tomorrow.'));
              }
            } else {
              if (stryMutAct_9fa48("5910")) {
                {}
              } else {
                stryCov_9fa48("5910");
                setError(stryMutAct_9fa48("5911") ? "" : (stryCov_9fa48("5911"), 'Failed to create invitation. Please try again.'));
              }
            }
          }
        } finally {
          if (stryMutAct_9fa48("5912")) {
            {}
          } else {
            stryCov_9fa48("5912");
            setLoading(stryMutAct_9fa48("5913") ? true : (stryCov_9fa48("5913"), false));
          }
        }
      }
    };
    const handleMfaSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("5914")) {
        {}
      } else {
        stryCov_9fa48("5914");
        e.preventDefault();
        setError(stryMutAct_9fa48("5915") ? "Stryker was here!" : (stryCov_9fa48("5915"), ''));
        setLoading(stryMutAct_9fa48("5916") ? false : (stryCov_9fa48("5916"), true));
        try {
          if (stryMutAct_9fa48("5917")) {
            {}
          } else {
            stryCov_9fa48("5917");
            if (stryMutAct_9fa48("5920") ? false : stryMutAct_9fa48("5919") ? true : stryMutAct_9fa48("5918") ? mfaResolver : (stryCov_9fa48("5918", "5919", "5920"), !mfaResolver)) throw new Error(stryMutAct_9fa48("5921") ? "" : (stryCov_9fa48("5921"), 'MFA session expired. Please start over.'));
            const totpHint = mfaResolver.hints.find(stryMutAct_9fa48("5922") ? () => undefined : (stryCov_9fa48("5922"), hint => stryMutAct_9fa48("5925") ? hint.factorId !== 'totp' : stryMutAct_9fa48("5924") ? false : stryMutAct_9fa48("5923") ? true : (stryCov_9fa48("5923", "5924", "5925"), hint.factorId === (stryMutAct_9fa48("5926") ? "" : (stryCov_9fa48("5926"), 'totp')))));
            if (stryMutAct_9fa48("5929") ? false : stryMutAct_9fa48("5928") ? true : stryMutAct_9fa48("5927") ? totpHint : (stryCov_9fa48("5927", "5928", "5929"), !totpHint)) throw new Error(stryMutAct_9fa48("5930") ? "" : (stryCov_9fa48("5930"), 'TOTP not found. Please use your authenticator app.'));
            const assertion = TotpMultiFactorGenerator.assertionForSignIn(totpHint.uid, mfaCode);
            await mfaResolver.resolveSignIn(assertion);
            await completeInvitation();
          }
        } catch (err) {
          if (stryMutAct_9fa48("5931")) {
            {}
          } else {
            stryCov_9fa48("5931");
            const error = err as Error & {
              code?: string;
            };
            if (stryMutAct_9fa48("5934") ? error.code !== 'auth/invalid-verification-code' : stryMutAct_9fa48("5933") ? false : stryMutAct_9fa48("5932") ? true : (stryCov_9fa48("5932", "5933", "5934"), error.code === (stryMutAct_9fa48("5935") ? "" : (stryCov_9fa48("5935"), 'auth/invalid-verification-code')))) {
              if (stryMutAct_9fa48("5936")) {
                {}
              } else {
                stryCov_9fa48("5936");
                setError(stryMutAct_9fa48("5937") ? "" : (stryCov_9fa48("5937"), 'Invalid code. Please check your authenticator app.'));
              }
            } else {
              if (stryMutAct_9fa48("5938")) {
                {}
              } else {
                stryCov_9fa48("5938");
                setError(stryMutAct_9fa48("5941") ? error.message && 'MFA verification failed. Please try again.' : stryMutAct_9fa48("5940") ? false : stryMutAct_9fa48("5939") ? true : (stryCov_9fa48("5939", "5940", "5941"), error.message || (stryMutAct_9fa48("5942") ? "" : (stryCov_9fa48("5942"), 'MFA verification failed. Please try again.'))));
              }
            }
          }
        } finally {
          if (stryMutAct_9fa48("5943")) {
            {}
          } else {
            stryCov_9fa48("5943");
            setLoading(stryMutAct_9fa48("5944") ? true : (stryCov_9fa48("5944"), false));
          }
        }
      }
    };
    const copyCode = async () => {
      if (stryMutAct_9fa48("5945")) {
        {}
      } else {
        stryCov_9fa48("5945");
        await navigator.clipboard.writeText(verificationCode);
        setCopied(stryMutAct_9fa48("5946") ? false : (stryCov_9fa48("5946"), true));
        showToast(stryMutAct_9fa48("5947") ? "" : (stryCov_9fa48("5947"), 'Code copied to clipboard'), stryMutAct_9fa48("5948") ? "" : (stryCov_9fa48("5948"), 'success'));
        setTimeout(stryMutAct_9fa48("5949") ? () => undefined : (stryCov_9fa48("5949"), () => setCopied(stryMutAct_9fa48("5950") ? true : (stryCov_9fa48("5950"), false))), 2000);
      }
    };
    if (stryMutAct_9fa48("5953") ? step !== 'email' : stryMutAct_9fa48("5952") ? false : stryMutAct_9fa48("5951") ? true : (stryCov_9fa48("5951", "5952", "5953"), step === (stryMutAct_9fa48("5954") ? "" : (stryCov_9fa48("5954"), 'email')))) {
      if (stryMutAct_9fa48("5955")) {
        {}
      } else {
        stryCov_9fa48("5955");
        return <InviteEmailStep inviteeEmail={inviteeEmail} setInviteeEmail={setInviteeEmail} error={error} onSubmit={handleEmailSubmit} />;
      }
    }
    if (stryMutAct_9fa48("5958") ? step !== 'password' : stryMutAct_9fa48("5957") ? false : stryMutAct_9fa48("5956") ? true : (stryCov_9fa48("5956", "5957", "5958"), step === (stryMutAct_9fa48("5959") ? "" : (stryCov_9fa48("5959"), 'password')))) {
      if (stryMutAct_9fa48("5960")) {
        {}
      } else {
        stryCov_9fa48("5960");
        return <InvitePasswordStep inviteeEmail={inviteeEmail} password={password} setPassword={setPassword} error={error} loading={loading} onSubmit={handlePasswordSubmit} onBack={() => {
          if (stryMutAct_9fa48("5961")) {
            {}
          } else {
            stryCov_9fa48("5961");
            setStep(stryMutAct_9fa48("5962") ? "" : (stryCov_9fa48("5962"), 'email'));
            setPassword(stryMutAct_9fa48("5963") ? "Stryker was here!" : (stryCov_9fa48("5963"), ''));
            setError(stryMutAct_9fa48("5964") ? "Stryker was here!" : (stryCov_9fa48("5964"), ''));
          }
        }} />;
      }
    }
    if (stryMutAct_9fa48("5967") ? step !== 'mfa' : stryMutAct_9fa48("5966") ? false : stryMutAct_9fa48("5965") ? true : (stryCov_9fa48("5965", "5966", "5967"), step === (stryMutAct_9fa48("5968") ? "" : (stryCov_9fa48("5968"), 'mfa')))) {
      if (stryMutAct_9fa48("5969")) {
        {}
      } else {
        stryCov_9fa48("5969");
        return <InviteMfaStep mfaCode={mfaCode} setMfaCode={setMfaCode} error={error} loading={loading} onSubmit={handleMfaSubmit} onBack={() => {
          if (stryMutAct_9fa48("5970")) {
            {}
          } else {
            stryCov_9fa48("5970");
            setStep(stryMutAct_9fa48("5971") ? "" : (stryCov_9fa48("5971"), 'password'));
            setMfaCode(stryMutAct_9fa48("5972") ? "Stryker was here!" : (stryCov_9fa48("5972"), ''));
            setMfaResolver(null);
            setError(stryMutAct_9fa48("5973") ? "Stryker was here!" : (stryCov_9fa48("5973"), ''));
          }
        }} />;
      }
    }
    return <InviteSuccessStep inviteeEmail={inviteeEmail} verificationCode={verificationCode} copied={copied} onCopyCode={copyCode} onDone={onInviteSent} />;
  }
}