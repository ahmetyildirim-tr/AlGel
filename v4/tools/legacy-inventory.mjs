#!/usr/bin/env node
/**
 * AlGel legacy inventory: READ ONLY. No writes, deletes, or exports of personal records.
 * Usage: GOOGLE_APPLICATION_CREDENTIALS=/secure/service-account.json \
 *   ALGEL_SOURCE_PROJECT=your-project node v4/tools/legacy-inventory.mjs
 * Requires: npm install --no-save firebase-admin
 */
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.ALGEL_SOURCE_PROJECT;
if (!projectId) {
  console.error('Missing ALGEL_SOURCE_PROJECT. No database was accessed.');
  process.exit(2);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.GOOGLE_CLOUD_PROJECT) {
  console.error('Provide Application Default Credentials. No database was accessed.');
  process.exit(2);
}
initializeApp({ credential: applicationDefault(), projectId });
const db = getFirestore();
const root = db.doc('shoppingLists/family');
const report = {
  sourceProject: projectId,
  sourcePath: root.path,
  generatedAt: new Date().toISOString(),
  readOnly: true,
  rootExists: false,
  rootFields: [],
  catalogEntries: 0,
  hiddenCatalogEntries: 0,
  baseItems: 0,
  customLists: 0,
  customListItems: 0,
  reminders: 0,
  explicitMembers: 0,
  missingRequiredItemFields: 0,
  duplicateCatalogNames: 0,
  listCounts: []
};
const base = await root.get();
report.rootExists = base.exists;
if (base.exists) {
  const data = base.data() || {};
  report.rootFields = Object.keys(data).sort();
  const catalog = Array.isArray(data.catalog) ? data.catalog : [];
  report.catalogEntries = catalog.length;
  report.hiddenCatalogEntries = Array.isArray(data.hiddenCatalog) ? data.hiddenCatalog.length : 0;
  const names = catalog.map(p => String(p?.name || '').trim().toLocaleLowerCase('tr'));
  report.duplicateCatalogNames = names.length - new Set(names).size;
}
async function countItems(ref) {
  let count = 0, missing = 0;
  const pageSize = 300;
  let last = null;
  for (;;) {
    let q = ref.orderBy('__name__').limit(pageSize);
    if (last) q = q.startAfter(last);
    const snap = await q.get();
    for (const d of snap.docs) {
      count++;
      const item = d.data();
      if (!item.name || typeof item.name !== 'string') missing++;
    }
    if (snap.size < pageSize) break;
    last = snap.docs[snap.docs.length - 1];
  }
  return { count, missing };
}
const baseItems = await countItems(root.collection('items'));
report.baseItems = baseItems.count;
report.missingRequiredItemFields += baseItems.missing;
const listRefs = await root.collection('listMeta').listDocuments();
report.customLists = listRefs.length;
for (const ref of listRefs) {
  const result = await countItems(ref.collection('items'));
  report.customListItems += result.count;
  report.missingRequiredItemFields += result.missing;
  // IDs only, no list names or personal content.
  report.listCounts.push({ id: ref.id, items: result.count });
}
report.reminders = (await countItems(root.collection('reminders'))).count;
report.explicitMembers = (await countItems(root.collection('members'))).count;
console.log(JSON.stringify(report, null, 2));
console.error('READ-ONLY inventory complete. No Firestore data was modified.');
