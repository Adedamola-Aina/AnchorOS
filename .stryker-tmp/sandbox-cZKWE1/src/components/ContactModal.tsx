/**
 * ContactModal - User feedback form with dual-delivery strategy
 * Refactored per CLAUDE.md §3.2 (200-line rule).
 * Form components extracted to ContactModalParts.tsx
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
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import { db, APP_ID } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import pkg from '../../package.json';
import { ContactSuccessMessage, ContactHeader, SubjectSelect, MessageInput, IdentityFields, SubmitButton, SUBJECTS } from './ContactModalParts';
const APP_VERSION = (pkg as unknown as {
  version: string;
}).version;
type SubjectType = 'question' | 'problem' | 'feature' | 'testimonial' | 'feedback' | 'other';
interface ContactModalProps {
  onClose: () => void;
  currentPage?: string;
  initialSubject?: SubjectType;
}
const ContactModal: React.FC<ContactModalProps> = ({
  onClose,
  currentPage = stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), 'unknown'),
  initialSubject = stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), 'feedback')
}) => {
  if (stryMutAct_9fa48("42")) {
    {}
  } else {
    stryCov_9fa48("42");
    const {
      user,
      profile
    } = useAuth();
    const [subject, setSubject] = useState<SubjectType>(initialSubject);
    const [message, setMessage] = useState(stryMutAct_9fa48("43") ? "Stryker was here!" : (stryCov_9fa48("43"), ''));
    const [name, setName] = useState(stryMutAct_9fa48("46") ? profile?.name && '' : stryMutAct_9fa48("45") ? false : stryMutAct_9fa48("44") ? true : (stryCov_9fa48("44", "45", "46"), (stryMutAct_9fa48("47") ? profile.name : (stryCov_9fa48("47"), profile?.name)) || (stryMutAct_9fa48("48") ? "Stryker was here!" : (stryCov_9fa48("48"), ''))));
    const [email, setEmail] = useState(stryMutAct_9fa48("51") ? user?.email && '' : stryMutAct_9fa48("50") ? false : stryMutAct_9fa48("49") ? true : (stryCov_9fa48("49", "50", "51"), (stryMutAct_9fa48("52") ? user.email : (stryCov_9fa48("52"), user?.email)) || (stryMutAct_9fa48("53") ? "Stryker was here!" : (stryCov_9fa48("53"), ''))));
    const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("54") ? true : (stryCov_9fa48("54"), false));
    const [isSubmitted, setIsSubmitted] = useState(stryMutAct_9fa48("55") ? true : (stryCov_9fa48("55"), false));
    const [error, setError] = useState(stryMutAct_9fa48("56") ? "Stryker was here!" : (stryCov_9fa48("56"), ''));
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("57")) {
        {}
      } else {
        stryCov_9fa48("57");
        e.preventDefault();
        if (stryMutAct_9fa48("60") ? false : stryMutAct_9fa48("59") ? true : stryMutAct_9fa48("58") ? message.trim() : (stryCov_9fa48("58", "59", "60"), !(stryMutAct_9fa48("61") ? message : (stryCov_9fa48("61"), message.trim())))) return;
        setIsSubmitting(stryMutAct_9fa48("62") ? false : (stryCov_9fa48("62"), true));
        setError(stryMutAct_9fa48("63") ? "Stryker was here!" : (stryCov_9fa48("63"), ''));
        const metadata = stryMutAct_9fa48("64") ? {} : (stryCov_9fa48("64"), {
          userId: stryMutAct_9fa48("67") ? user?.uid && 'anonymous' : stryMutAct_9fa48("66") ? false : stryMutAct_9fa48("65") ? true : (stryCov_9fa48("65", "66", "67"), (stryMutAct_9fa48("68") ? user.uid : (stryCov_9fa48("68"), user?.uid)) || (stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), 'anonymous'))),
          appVersion: APP_VERSION,
          deviceType: navigator.userAgent,
          platform: navigator.platform,
          currentPage,
          timestamp: new Date().toISOString()
        });
        const payload = stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
          subject: stryMutAct_9fa48("73") ? SUBJECTS.find(s => s.value === subject)?.label && subject : stryMutAct_9fa48("72") ? false : stryMutAct_9fa48("71") ? true : (stryCov_9fa48("71", "72", "73"), (stryMutAct_9fa48("74") ? SUBJECTS.find(s => s.value === subject).label : (stryCov_9fa48("74"), SUBJECTS.find(stryMutAct_9fa48("75") ? () => undefined : (stryCov_9fa48("75"), s => stryMutAct_9fa48("78") ? s.value !== subject : stryMutAct_9fa48("77") ? false : stryMutAct_9fa48("76") ? true : (stryCov_9fa48("76", "77", "78"), s.value === subject)))?.label)) || subject),
          message,
          name,
          email,
          ...metadata
        });
        try {
          if (stryMutAct_9fa48("79")) {
            {}
          } else {
            stryCov_9fa48("79");
            let firestoreSuccess = stryMutAct_9fa48("80") ? true : (stryCov_9fa48("80"), false),
              emailSuccess = stryMutAct_9fa48("81") ? true : (stryCov_9fa48("81"), false);
            try {
              if (stryMutAct_9fa48("82")) {
                {}
              } else {
                stryCov_9fa48("82");
                await addDoc(collection(db, stryMutAct_9fa48("83") ? "" : (stryCov_9fa48("83"), 'artifacts'), APP_ID, stryMutAct_9fa48("84") ? "" : (stryCov_9fa48("84"), 'feedback')), stryMutAct_9fa48("85") ? {} : (stryCov_9fa48("85"), {
                  ...payload,
                  createdAt: serverTimestamp(),
                  status: stryMutAct_9fa48("86") ? "" : (stryCov_9fa48("86"), 'new')
                }));
                firestoreSuccess = stryMutAct_9fa48("87") ? false : (stryCov_9fa48("87"), true);
              }
            } catch (fsErr) {
              if (stryMutAct_9fa48("88")) {
                {}
              } else {
                stryCov_9fa48("88");
                console.error(stryMutAct_9fa48("89") ? "" : (stryCov_9fa48("89"), '[Contact] Firestore backup failed:'), fsErr);
              }
            }
            const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
            if (stryMutAct_9fa48("91") ? false : stryMutAct_9fa48("90") ? true : (stryCov_9fa48("90", "91"), FORMSPREE_ID)) {
              if (stryMutAct_9fa48("92")) {
                {}
              } else {
                stryCov_9fa48("92");
                try {
                  if (stryMutAct_9fa48("93")) {
                    {}
                  } else {
                    stryCov_9fa48("93");
                    const response = await fetch(stryMutAct_9fa48("94") ? `` : (stryCov_9fa48("94"), `https://formspree.io/f/${FORMSPREE_ID}`), stryMutAct_9fa48("95") ? {} : (stryCov_9fa48("95"), {
                      method: stryMutAct_9fa48("96") ? "" : (stryCov_9fa48("96"), 'POST'),
                      headers: stryMutAct_9fa48("97") ? {} : (stryCov_9fa48("97"), {
                        'Content-Type': stryMutAct_9fa48("98") ? "" : (stryCov_9fa48("98"), 'application/json'),
                        'Accept': stryMutAct_9fa48("99") ? "" : (stryCov_9fa48("99"), 'application/json')
                      }),
                      body: JSON.stringify(stryMutAct_9fa48("100") ? {} : (stryCov_9fa48("100"), {
                        _subject: stryMutAct_9fa48("101") ? `` : (stryCov_9fa48("101"), `[Anchor OS] ${payload.subject}`),
                        name: payload.name,
                        email: payload.email,
                        message: payload.message,
                        userId: payload.userId,
                        appVersion: payload.appVersion,
                        page: payload.currentPage,
                        platform: payload.platform,
                        timestamp: payload.timestamp
                      }))
                    }));
                    if (stryMutAct_9fa48("103") ? false : stryMutAct_9fa48("102") ? true : (stryCov_9fa48("102", "103"), response.ok)) emailSuccess = stryMutAct_9fa48("104") ? false : (stryCov_9fa48("104"), true);else console.error(stryMutAct_9fa48("105") ? "" : (stryCov_9fa48("105"), '[Contact] Formspree error:'), await response.json().catch(stryMutAct_9fa48("106") ? () => undefined : (stryCov_9fa48("106"), () => ({}))));
                  }
                } catch (emailErr) {
                  if (stryMutAct_9fa48("107")) {
                    {}
                  } else {
                    stryCov_9fa48("107");
                    console.error(stryMutAct_9fa48("108") ? "" : (stryCov_9fa48("108"), '[Contact] Email delivery failed:'), emailErr);
                  }
                }
              }
            }
            if (stryMutAct_9fa48("111") ? firestoreSuccess && emailSuccess : stryMutAct_9fa48("110") ? false : stryMutAct_9fa48("109") ? true : (stryCov_9fa48("109", "110", "111"), firestoreSuccess || emailSuccess)) {
              if (stryMutAct_9fa48("112")) {
                {}
              } else {
                stryCov_9fa48("112");
                setIsSubmitted(stryMutAct_9fa48("113") ? false : (stryCov_9fa48("113"), true));
                setTimeout(stryMutAct_9fa48("114") ? () => undefined : (stryCov_9fa48("114"), () => onClose()), 3000);
              }
            } else throw new Error(stryMutAct_9fa48("115") ? "" : (stryCov_9fa48("115"), 'All delivery methods failed'));
          }
        } catch (err) {
          if (stryMutAct_9fa48("116")) {
            {}
          } else {
            stryCov_9fa48("116");
            setError(stryMutAct_9fa48("117") ? "" : (stryCov_9fa48("117"), 'Failed to send. Please try again later.'));
            console.error(stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), '[Contact] Submission error:'), err);
          }
        } finally {
          if (stryMutAct_9fa48("119")) {
            {}
          } else {
            stryCov_9fa48("119");
            setIsSubmitting(stryMutAct_9fa48("120") ? true : (stryCov_9fa48("120"), false));
          }
        }
      }
    };
    if (stryMutAct_9fa48("122") ? false : stryMutAct_9fa48("121") ? true : (stryCov_9fa48("121", "122"), isSubmitted)) return createPortal(<ContactSuccessMessage />, document.body);
    const modalContent = <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto" onClick={onClose}>
            <div className="w-full sm:max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-500 sm:my-8" onClick={stryMutAct_9fa48("123") ? () => undefined : (stryCov_9fa48("123"), e => e.stopPropagation())}>
                <ContactHeader onClose={onClose} />
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <SubjectSelect value={subject} onChange={setSubject} />
                    <MessageInput value={message} onChange={setMessage} />
                    <IdentityFields name={name} email={email} onNameChange={setName} onEmailChange={setEmail} />
                    {stryMutAct_9fa48("126") ? error || <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs text-center">{error}</div> : stryMutAct_9fa48("125") ? false : stryMutAct_9fa48("124") ? true : (stryCov_9fa48("124", "125", "126"), error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-xs text-center">{error}</div>)}
                    <SubmitButton isSubmitting={isSubmitting} disabled={stryMutAct_9fa48("129") ? isSubmitting && !message.trim() : stryMutAct_9fa48("128") ? false : stryMutAct_9fa48("127") ? true : (stryCov_9fa48("127", "128", "129"), isSubmitting || (stryMutAct_9fa48("130") ? message.trim() : (stryCov_9fa48("130"), !(stryMutAct_9fa48("131") ? message : (stryCov_9fa48("131"), message.trim())))))} />
                </form>
            </div>
        </div>;
    return createPortal(modalContent, document.body);
  }
};
export default ContactModal;