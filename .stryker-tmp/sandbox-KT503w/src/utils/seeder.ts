/**
 * Data Seeder Utility
 * Refactored per CLAUDE.md §3.2 - data constants extracted to seederData.ts
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
import { collection, doc, writeBatch, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, APP_ID } from '../config/firebase';
import type { AnchorAccount, AnchorTask, TimeOfDay } from '../types';
import { TITLES, ACCOUNT_NAMES, TASK_TITLES, CATEGORIES, DOMAINS, ACCOUNT_COLORS, randomDate, randomItem } from './seederData';
export const seedData = async (userId: string) => {
  if (stryMutAct_9fa48("9455")) {
    {}
  } else {
    stryCov_9fa48("9455");
    if (stryMutAct_9fa48("9458") ? false : stryMutAct_9fa48("9457") ? true : stryMutAct_9fa48("9456") ? userId : (stryCov_9fa48("9456", "9457", "9458"), !userId)) throw new Error(stryMutAct_9fa48("9459") ? "" : (stryCov_9fa48("9459"), 'User ID required'));
    console.log(stryMutAct_9fa48("9460") ? "" : (stryCov_9fa48("9460"), '🌱 Starting Enhanced Data Seeding...'));
    let batch = writeBatch(db);
    let opCount = 0;
    const MAX_BATCH_SIZE = 450;
    const commitAndResetBatch = async () => {
      if (stryMutAct_9fa48("9461")) {
        {}
      } else {
        stryCov_9fa48("9461");
        if (stryMutAct_9fa48("9465") ? opCount <= 0 : stryMutAct_9fa48("9464") ? opCount >= 0 : stryMutAct_9fa48("9463") ? false : stryMutAct_9fa48("9462") ? true : (stryCov_9fa48("9462", "9463", "9464", "9465"), opCount > 0)) {
          if (stryMutAct_9fa48("9466")) {
            {}
          } else {
            stryCov_9fa48("9466");
            await batch.commit();
            console.log(stryMutAct_9fa48("9467") ? "" : (stryCov_9fa48("9467"), 'Batch committed.'));
            batch = writeBatch(db);
            opCount = 0;
          }
        }
      }
    };

    // Fetch User Profile for Family Mode
    let spouseId: string | undefined;
    const userProfileRef = doc(db, stryMutAct_9fa48("9468") ? "" : (stryCov_9fa48("9468"), 'artifacts'), APP_ID, stryMutAct_9fa48("9469") ? "" : (stryCov_9fa48("9469"), 'users'), userId);
    const userProfileSnap = await getDoc(userProfileRef);
    if (stryMutAct_9fa48("9471") ? false : stryMutAct_9fa48("9470") ? true : (stryCov_9fa48("9470", "9471"), userProfileSnap.exists())) {
      if (stryMutAct_9fa48("9472")) {
        {}
      } else {
        stryCov_9fa48("9472");
        const data = userProfileSnap.data();
        if (stryMutAct_9fa48("9474") ? false : stryMutAct_9fa48("9473") ? true : (stryCov_9fa48("9473", "9474"), data.familyMode)) {
          if (stryMutAct_9fa48("9475")) {
            {}
          } else {
            stryCov_9fa48("9475");
            const familyConfigRef = doc(db, stryMutAct_9fa48("9476") ? "" : (stryCov_9fa48("9476"), 'artifacts'), APP_ID, stryMutAct_9fa48("9477") ? "" : (stryCov_9fa48("9477"), 'users'), userId, stryMutAct_9fa48("9478") ? "" : (stryCov_9fa48("9478"), 'family'), stryMutAct_9fa48("9479") ? "" : (stryCov_9fa48("9479"), 'config'));
            const familySnap = await getDoc(familyConfigRef);
            if (stryMutAct_9fa48("9481") ? false : stryMutAct_9fa48("9480") ? true : (stryCov_9fa48("9480", "9481"), familySnap.exists())) spouseId = familySnap.data().spouseId;
          }
        }
      }
    }
    const accounts: AnchorAccount[] = stryMutAct_9fa48("9482") ? ["Stryker was here"] : (stryCov_9fa48("9482"), []);
    const accountsRef = collection(db, stryMutAct_9fa48("9483") ? "" : (stryCov_9fa48("9483"), 'artifacts'), APP_ID, stryMutAct_9fa48("9484") ? "" : (stryCov_9fa48("9484"), 'users'), userId, stryMutAct_9fa48("9485") ? "" : (stryCov_9fa48("9485"), 'accounts'));

    // Create 5 Accounts
    for (let i = 0; stryMutAct_9fa48("9488") ? i >= 5 : stryMutAct_9fa48("9487") ? i <= 5 : stryMutAct_9fa48("9486") ? false : (stryCov_9fa48("9486", "9487", "9488"), i < 5); stryMutAct_9fa48("9489") ? i-- : (stryCov_9fa48("9489"), i++)) {
      if (stryMutAct_9fa48("9490")) {
        {}
      } else {
        stryCov_9fa48("9490");
        const accType = (stryMutAct_9fa48("9493") ? i !== 0 : stryMutAct_9fa48("9492") ? false : stryMutAct_9fa48("9491") ? true : (stryCov_9fa48("9491", "9492", "9493"), i === 0)) ? stryMutAct_9fa48("9494") ? "" : (stryCov_9fa48("9494"), 'checking') : (stryMutAct_9fa48("9497") ? i !== 1 : stryMutAct_9fa48("9496") ? false : stryMutAct_9fa48("9495") ? true : (stryCov_9fa48("9495", "9496", "9497"), i === 1)) ? stryMutAct_9fa48("9498") ? "" : (stryCov_9fa48("9498"), 'savings') : stryMutAct_9fa48("9499") ? "" : (stryCov_9fa48("9499"), 'checking');
        const currency = (stryMutAct_9fa48("9503") ? Math.random() <= 0.8 : stryMutAct_9fa48("9502") ? Math.random() >= 0.8 : stryMutAct_9fa48("9501") ? false : stryMutAct_9fa48("9500") ? true : (stryCov_9fa48("9500", "9501", "9502", "9503"), Math.random() > 0.8)) ? stryMutAct_9fa48("9504") ? "" : (stryCov_9fa48("9504"), 'USD') : stryMutAct_9fa48("9505") ? "" : (stryCov_9fa48("9505"), 'NGN');
        const isShared = stryMutAct_9fa48("9508") ? spouseId || i === 4 : stryMutAct_9fa48("9507") ? false : stryMutAct_9fa48("9506") ? true : (stryCov_9fa48("9506", "9507", "9508"), spouseId && (stryMutAct_9fa48("9510") ? i !== 4 : stryMutAct_9fa48("9509") ? true : (stryCov_9fa48("9509", "9510"), i === 4)));
        const newDocRef = doc(accountsRef);
        const newAccount: AnchorAccount = stryMutAct_9fa48("9511") ? {} : (stryCov_9fa48("9511"), {
          id: newDocRef.id,
          name: stryMutAct_9fa48("9514") ? ACCOUNT_NAMES[i] && `Account ${i}` : stryMutAct_9fa48("9513") ? false : stryMutAct_9fa48("9512") ? true : (stryCov_9fa48("9512", "9513", "9514"), ACCOUNT_NAMES[i] || (stryMutAct_9fa48("9515") ? `` : (stryCov_9fa48("9515"), `Account ${i}`))),
          type: accType,
          currency,
          balanceCents: stryMutAct_9fa48("9516") ? Math.floor(Math.random() * 800000) - 5000 : (stryCov_9fa48("9516"), Math.floor(stryMutAct_9fa48("9517") ? Math.random() / 800000 : (stryCov_9fa48("9517"), Math.random() * 800000)) + 5000),
          color: ACCOUNT_COLORS[i],
          scope: isShared ? stryMutAct_9fa48("9518") ? "" : (stryCov_9fa48("9518"), 'family') : stryMutAct_9fa48("9519") ? "" : (stryCov_9fa48("9519"), 'personal'),
          ownerId: userId,
          shares: (stryMutAct_9fa48("9522") ? isShared || spouseId : stryMutAct_9fa48("9521") ? false : stryMutAct_9fa48("9520") ? true : (stryCov_9fa48("9520", "9521", "9522"), isShared && spouseId)) ? stryMutAct_9fa48("9523") ? {} : (stryCov_9fa48("9523"), {
            [spouseId]: stryMutAct_9fa48("9524") ? "" : (stryCov_9fa48("9524"), 'read')
          }) : {},
          isArchived: stryMutAct_9fa48("9525") ? true : (stryCov_9fa48("9525"), false)
        });
        batch.set(newDocRef, newAccount);
        accounts.push(newAccount);
        stryMutAct_9fa48("9526") ? opCount-- : (stryCov_9fa48("9526"), opCount++);
      }
    }
    await commitAndResetBatch();
    console.log(stryMutAct_9fa48("9527") ? "" : (stryCov_9fa48("9527"), '✅ Accounts Created'));

    // Create Transactions
    const financeRef = collection(db, stryMutAct_9fa48("9528") ? "" : (stryCov_9fa48("9528"), 'artifacts'), APP_ID, stryMutAct_9fa48("9529") ? "" : (stryCov_9fa48("9529"), 'users'), userId, stryMutAct_9fa48("9530") ? "" : (stryCov_9fa48("9530"), 'finance'));
    const now = new Date();
    const oneWeekAgo = new Date(stryMutAct_9fa48("9531") ? now.getTime() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("9531"), now.getTime() - (stryMutAct_9fa48("9532") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("9532"), (stryMutAct_9fa48("9533") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("9533"), (stryMutAct_9fa48("9534") ? 7 * 24 / 60 : (stryCov_9fa48("9534"), (stryMutAct_9fa48("9535") ? 7 / 24 : (stryCov_9fa48("9535"), 7 * 24)) * 60)) * 60)) * 1000))));
    const twoWeeksAgo = new Date(stryMutAct_9fa48("9536") ? now.getTime() + 14 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("9536"), now.getTime() - (stryMutAct_9fa48("9537") ? 14 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("9537"), (stryMutAct_9fa48("9538") ? 14 * 24 * 60 / 60 : (stryCov_9fa48("9538"), (stryMutAct_9fa48("9539") ? 14 * 24 / 60 : (stryCov_9fa48("9539"), (stryMutAct_9fa48("9540") ? 14 / 24 : (stryCov_9fa48("9540"), 14 * 24)) * 60)) * 60)) * 1000))));
    const oneMonthAgo = new Date(stryMutAct_9fa48("9541") ? now.getTime() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("9541"), now.getTime() - (stryMutAct_9fa48("9542") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("9542"), (stryMutAct_9fa48("9543") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("9543"), (stryMutAct_9fa48("9544") ? 30 * 24 / 60 : (stryCov_9fa48("9544"), (stryMutAct_9fa48("9545") ? 30 / 24 : (stryCov_9fa48("9545"), 30 * 24)) * 60)) * 60)) * 1000))));
    for (let i = 0; stryMutAct_9fa48("9548") ? i >= 60 : stryMutAct_9fa48("9547") ? i <= 60 : stryMutAct_9fa48("9546") ? false : (stryCov_9fa48("9546", "9547", "9548"), i < 60); stryMutAct_9fa48("9549") ? i-- : (stryCov_9fa48("9549"), i++)) {
      if (stryMutAct_9fa48("9550")) {
        {}
      } else {
        stryCov_9fa48("9550");
        if (stryMutAct_9fa48("9554") ? opCount < MAX_BATCH_SIZE : stryMutAct_9fa48("9553") ? opCount > MAX_BATCH_SIZE : stryMutAct_9fa48("9552") ? false : stryMutAct_9fa48("9551") ? true : (stryCov_9fa48("9551", "9552", "9553", "9554"), opCount >= MAX_BATCH_SIZE)) await commitAndResetBatch();
        const account = randomItem(accounts);
        const date = (stryMutAct_9fa48("9558") ? i >= 20 : stryMutAct_9fa48("9557") ? i <= 20 : stryMutAct_9fa48("9556") ? false : stryMutAct_9fa48("9555") ? true : (stryCov_9fa48("9555", "9556", "9557", "9558"), i < 20)) ? randomDate(oneWeekAgo, now) : (stryMutAct_9fa48("9562") ? i >= 40 : stryMutAct_9fa48("9561") ? i <= 40 : stryMutAct_9fa48("9560") ? false : stryMutAct_9fa48("9559") ? true : (stryCov_9fa48("9559", "9560", "9561", "9562"), i < 40)) ? randomDate(twoWeeksAgo, oneWeekAgo) : randomDate(oneMonthAgo, twoWeeksAgo);
        const isTransfer = stryMutAct_9fa48("9566") ? Math.random() <= 0.85 : stryMutAct_9fa48("9565") ? Math.random() >= 0.85 : stryMutAct_9fa48("9564") ? false : stryMutAct_9fa48("9563") ? true : (stryCov_9fa48("9563", "9564", "9565", "9566"), Math.random() > 0.85);
        if (stryMutAct_9fa48("9569") ? isTransfer || accounts.length > 1 : stryMutAct_9fa48("9568") ? false : stryMutAct_9fa48("9567") ? true : (stryCov_9fa48("9567", "9568", "9569"), isTransfer && (stryMutAct_9fa48("9572") ? accounts.length <= 1 : stryMutAct_9fa48("9571") ? accounts.length >= 1 : stryMutAct_9fa48("9570") ? true : (stryCov_9fa48("9570", "9571", "9572"), accounts.length > 1)))) {
          if (stryMutAct_9fa48("9573")) {
            {}
          } else {
            stryCov_9fa48("9573");
            const toAccount = stryMutAct_9fa48("9576") ? accounts.find(a => a.id !== account.id) && accounts[0] : stryMutAct_9fa48("9575") ? false : stryMutAct_9fa48("9574") ? true : (stryCov_9fa48("9574", "9575", "9576"), accounts.find(stryMutAct_9fa48("9577") ? () => undefined : (stryCov_9fa48("9577"), a => stryMutAct_9fa48("9580") ? a.id === account.id : stryMutAct_9fa48("9579") ? false : stryMutAct_9fa48("9578") ? true : (stryCov_9fa48("9578", "9579", "9580"), a.id !== account.id))) || accounts[0]);
            const amount = stryMutAct_9fa48("9581") ? Math.floor(Math.random() * 50000) - 1000 : (stryCov_9fa48("9581"), Math.floor(stryMutAct_9fa48("9582") ? Math.random() / 50000 : (stryCov_9fa48("9582"), Math.random() * 50000)) + 1000);
            const linkId = crypto.randomUUID();
            const txId1 = doc(financeRef).id,
              txId2 = doc(financeRef).id;
            batch.set(doc(financeRef, txId1), stryMutAct_9fa48("9583") ? {} : (stryCov_9fa48("9583"), {
              id: txId1,
              title: stryMutAct_9fa48("9584") ? `` : (stryCov_9fa48("9584"), `Transfer to ${toAccount.name}`),
              amountCents: amount,
              type: stryMutAct_9fa48("9585") ? "" : (stryCov_9fa48("9585"), 'expense'),
              category: stryMutAct_9fa48("9586") ? "" : (stryCov_9fa48("9586"), 'Transfer'),
              accountId: account.id,
              accountName: account.name,
              currency: account.currency,
              scope: account.scope,
              date: date.toISOString(),
              createdBy: userId,
              linkId,
              isSoftDeleted: stryMutAct_9fa48("9587") ? true : (stryCov_9fa48("9587"), false),
              accountShares: stryMutAct_9fa48("9590") ? account.shares && {} : stryMutAct_9fa48("9589") ? false : stryMutAct_9fa48("9588") ? true : (stryCov_9fa48("9588", "9589", "9590"), account.shares || {})
            }));
            batch.set(doc(financeRef, txId2), stryMutAct_9fa48("9591") ? {} : (stryCov_9fa48("9591"), {
              id: txId2,
              title: stryMutAct_9fa48("9592") ? `` : (stryCov_9fa48("9592"), `Transfer from ${account.name}`),
              amountCents: amount,
              type: stryMutAct_9fa48("9593") ? "" : (stryCov_9fa48("9593"), 'income'),
              category: stryMutAct_9fa48("9594") ? "" : (stryCov_9fa48("9594"), 'Transfer'),
              accountId: toAccount.id,
              accountName: toAccount.name,
              currency: toAccount.currency,
              scope: toAccount.scope,
              date: date.toISOString(),
              createdBy: userId,
              linkId,
              isSoftDeleted: stryMutAct_9fa48("9595") ? true : (stryCov_9fa48("9595"), false),
              accountShares: stryMutAct_9fa48("9598") ? toAccount.shares && {} : stryMutAct_9fa48("9597") ? false : stryMutAct_9fa48("9596") ? true : (stryCov_9fa48("9596", "9597", "9598"), toAccount.shares || {})
            }));
            stryMutAct_9fa48("9599") ? opCount -= 2 : (stryCov_9fa48("9599"), opCount += 2);
          }
        } else {
          if (stryMutAct_9fa48("9600")) {
            {}
          } else {
            stryCov_9fa48("9600");
            const type = (stryMutAct_9fa48("9604") ? Math.random() <= 0.3 : stryMutAct_9fa48("9603") ? Math.random() >= 0.3 : stryMutAct_9fa48("9602") ? false : stryMutAct_9fa48("9601") ? true : (stryCov_9fa48("9601", "9602", "9603", "9604"), Math.random() > 0.3)) ? stryMutAct_9fa48("9605") ? "" : (stryCov_9fa48("9605"), 'expense') : stryMutAct_9fa48("9606") ? "" : (stryCov_9fa48("9606"), 'income');
            const title = randomItem(TITLES);
            const category = (stryMutAct_9fa48("9609") ? type !== 'income' : stryMutAct_9fa48("9608") ? false : stryMutAct_9fa48("9607") ? true : (stryCov_9fa48("9607", "9608", "9609"), type === (stryMutAct_9fa48("9610") ? "" : (stryCov_9fa48("9610"), 'income')))) ? stryMutAct_9fa48("9611") ? "" : (stryCov_9fa48("9611"), 'Income') : randomItem(stryMutAct_9fa48("9612") ? CATEGORIES : (stryCov_9fa48("9612"), CATEGORIES.slice(0, stryMutAct_9fa48("9613") ? +2 : (stryCov_9fa48("9613"), -2))));
            const isSharedActivity = stryMutAct_9fa48("9616") ? account.scope === 'family' && spouseId || Math.random() > 0.5 : stryMutAct_9fa48("9615") ? false : stryMutAct_9fa48("9614") ? true : (stryCov_9fa48("9614", "9615", "9616"), (stryMutAct_9fa48("9618") ? account.scope === 'family' || spouseId : stryMutAct_9fa48("9617") ? true : (stryCov_9fa48("9617", "9618"), (stryMutAct_9fa48("9620") ? account.scope !== 'family' : stryMutAct_9fa48("9619") ? true : (stryCov_9fa48("9619", "9620"), account.scope === (stryMutAct_9fa48("9621") ? "" : (stryCov_9fa48("9621"), 'family')))) && spouseId)) && (stryMutAct_9fa48("9624") ? Math.random() <= 0.5 : stryMutAct_9fa48("9623") ? Math.random() >= 0.5 : stryMutAct_9fa48("9622") ? true : (stryCov_9fa48("9622", "9623", "9624"), Math.random() > 0.5)));
            const newTxRef = doc(financeRef);
            batch.set(newTxRef, stryMutAct_9fa48("9625") ? {} : (stryCov_9fa48("9625"), {
              id: newTxRef.id,
              title,
              amountCents: stryMutAct_9fa48("9626") ? Math.floor(Math.random() * 20000) - 500 : (stryCov_9fa48("9626"), Math.floor(stryMutAct_9fa48("9627") ? Math.random() / 20000 : (stryCov_9fa48("9627"), Math.random() * 20000)) + 500),
              type,
              category,
              accountId: account.id,
              accountName: account.name,
              currency: account.currency,
              scope: account.scope,
              date: date.toISOString(),
              createdBy: isSharedActivity ? spouseId : userId,
              isSoftDeleted: stryMutAct_9fa48("9628") ? true : (stryCov_9fa48("9628"), false),
              accountShares: stryMutAct_9fa48("9631") ? account.shares && {} : stryMutAct_9fa48("9630") ? false : stryMutAct_9fa48("9629") ? true : (stryCov_9fa48("9629", "9630", "9631"), account.shares || {})
            }));
            if (stryMutAct_9fa48("9634") ? isSharedActivity || spouseId : stryMutAct_9fa48("9633") ? false : stryMutAct_9fa48("9632") ? true : (stryCov_9fa48("9632", "9633", "9634"), isSharedActivity && spouseId)) {
              if (stryMutAct_9fa48("9635")) {
                {}
              } else {
                stryCov_9fa48("9635");
                const notifRef = doc(collection(db, stryMutAct_9fa48("9636") ? "" : (stryCov_9fa48("9636"), 'artifacts'), APP_ID, stryMutAct_9fa48("9637") ? "" : (stryCov_9fa48("9637"), 'users'), userId, stryMutAct_9fa48("9638") ? "" : (stryCov_9fa48("9638"), 'notifications')));
                batch.set(notifRef, stryMutAct_9fa48("9639") ? {} : (stryCov_9fa48("9639"), {
                  type: stryMutAct_9fa48("9640") ? "" : (stryCov_9fa48("9640"), 'transaction'),
                  message: stryMutAct_9fa48("9641") ? `` : (stryCov_9fa48("9641"), `Spouse added ${title}`),
                  accountId: account.id,
                  transactionId: newTxRef.id,
                  timestamp: date.toISOString(),
                  read: stryMutAct_9fa48("9642") ? true : (stryCov_9fa48("9642"), false)
                }));
                stryMutAct_9fa48("9643") ? opCount-- : (stryCov_9fa48("9643"), opCount++);
              }
            }
            stryMutAct_9fa48("9644") ? opCount-- : (stryCov_9fa48("9644"), opCount++);
          }
        }
      }
    }

    // Create Commitments
    const tasksRef = collection(db, stryMutAct_9fa48("9645") ? "" : (stryCov_9fa48("9645"), 'artifacts'), APP_ID, stryMutAct_9fa48("9646") ? "" : (stryCov_9fa48("9646"), 'users'), userId, stryMutAct_9fa48("9647") ? "" : (stryCov_9fa48("9647"), 'commitments'));
    for (let i = 0; stryMutAct_9fa48("9650") ? i >= 11 : stryMutAct_9fa48("9649") ? i <= 11 : stryMutAct_9fa48("9648") ? false : (stryCov_9fa48("9648", "9649", "9650"), i < 11); stryMutAct_9fa48("9651") ? i-- : (stryCov_9fa48("9651"), i++)) {
      if (stryMutAct_9fa48("9652")) {
        {}
      } else {
        stryCov_9fa48("9652");
        const title = randomItem(TASK_TITLES);
        const taskType = (stryMutAct_9fa48("9656") ? i >= 4 : stryMutAct_9fa48("9655") ? i <= 4 : stryMutAct_9fa48("9654") ? false : stryMutAct_9fa48("9653") ? true : (stryCov_9fa48("9653", "9654", "9655", "9656"), i < 4)) ? stryMutAct_9fa48("9657") ? "" : (stryCov_9fa48("9657"), 'daily') : (stryMutAct_9fa48("9661") ? i >= 8 : stryMutAct_9fa48("9660") ? i <= 8 : stryMutAct_9fa48("9659") ? false : stryMutAct_9fa48("9658") ? true : (stryCov_9fa48("9658", "9659", "9660", "9661"), i < 8)) ? stryMutAct_9fa48("9662") ? "" : (stryCov_9fa48("9662"), 'weekly') : (stryMutAct_9fa48("9666") ? i >= 10 : stryMutAct_9fa48("9665") ? i <= 10 : stryMutAct_9fa48("9664") ? false : stryMutAct_9fa48("9663") ? true : (stryCov_9fa48("9663", "9664", "9665", "9666"), i < 10)) ? stryMutAct_9fa48("9667") ? "" : (stryCov_9fa48("9667"), 'monthly') : stryMutAct_9fa48("9668") ? "" : (stryCov_9fa48("9668"), 'todo');
        const domain = randomItem(DOMAINS);
        const timeOfDay = ['morning', 'afternoon', 'evening', 'any'][Math.floor(Math.random() * 4)] as TimeOfDay;
        const taskData: Omit<AnchorTask, 'createdAt'> & {
          createdAt: any;
        } = stryMutAct_9fa48("9669") ? {} : (stryCov_9fa48("9669"), {
          id: doc(tasksRef).id,
          title,
          type: taskType,
          completed: stryMutAct_9fa48("9673") ? Math.random() <= 0.6 : stryMutAct_9fa48("9672") ? Math.random() >= 0.6 : stryMutAct_9fa48("9671") ? false : stryMutAct_9fa48("9670") ? true : (stryCov_9fa48("9670", "9671", "9672", "9673"), Math.random() > 0.6),
          category: stryMutAct_9fa48("9674") ? "" : (stryCov_9fa48("9674"), 'personal'),
          createdAt: serverTimestamp(),
          domain,
          reminderTime: stryMutAct_9fa48("9675") ? "" : (stryCov_9fa48("9675"), '08:00')
        });
        if (stryMutAct_9fa48("9678") ? taskType !== 'daily' : stryMutAct_9fa48("9677") ? false : stryMutAct_9fa48("9676") ? true : (stryCov_9fa48("9676", "9677", "9678"), taskType === (stryMutAct_9fa48("9679") ? "" : (stryCov_9fa48("9679"), 'daily')))) taskData.timeOfDay = timeOfDay;else if (stryMutAct_9fa48("9682") ? taskType !== 'weekly' : stryMutAct_9fa48("9681") ? false : stryMutAct_9fa48("9680") ? true : (stryCov_9fa48("9680", "9681", "9682"), taskType === (stryMutAct_9fa48("9683") ? "" : (stryCov_9fa48("9683"), 'weekly')))) taskData.daysOfWeek = stryMutAct_9fa48("9684") ? [] : (stryCov_9fa48("9684"), [stryMutAct_9fa48("9685") ? "" : (stryCov_9fa48("9685"), 'Monday'), stryMutAct_9fa48("9686") ? "" : (stryCov_9fa48("9686"), 'Wednesday'), stryMutAct_9fa48("9687") ? "" : (stryCov_9fa48("9687"), 'Friday')]);else if (stryMutAct_9fa48("9690") ? taskType !== 'monthly' : stryMutAct_9fa48("9689") ? false : stryMutAct_9fa48("9688") ? true : (stryCov_9fa48("9688", "9689", "9690"), taskType === (stryMutAct_9fa48("9691") ? "" : (stryCov_9fa48("9691"), 'monthly')))) taskData.dayOfMonth = 15;
        batch.set(doc(tasksRef, taskData.id), taskData);
        stryMutAct_9fa48("9692") ? opCount-- : (stryCov_9fa48("9692"), opCount++);
      }
    }
    await commitAndResetBatch();
    console.log(stryMutAct_9fa48("9693") ? "" : (stryCov_9fa48("9693"), '✅ Seeding Complete!'));
    return stryMutAct_9fa48("9694") ? false : (stryCov_9fa48("9694"), true);
  }
};