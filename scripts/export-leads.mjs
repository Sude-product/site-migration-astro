// Form lead'lerini D1'den CSV'ye aktarır (2026-09-22).
//
// NEDEN: lead'ler artık `/api/lead` tarafından Cloudflare D1'e yazılıyor
// (bkz. `migrations/0001_create_leads.sql`), ama pazarlama/satış ekibinin
// "açıp bakacağı" bir yüzey yok. Bu script, eski Google Sheet'in yerini
// tutacak şekilde veriyi Excel'in doğrudan açabildiği bir CSV'ye döker.
//
// KULLANIM:
//   node scripts/export-leads.mjs
//   node scripts/export-leads.mjs --form-type hrMaturityReport
//   node scripts/export-leads.mjs --since 2026-09-01 --out /tmp/eylul.csv
//   node scripts/export-leads.mjs --failed        # yalnızca e-postası gitmeyenler
//   node scripts/export-leads.mjs --crm-failed    # Satış CRM'e aktarılamayanlar (failed/skipped)
//   node scripts/export-leads.mjs --local         # canlı yerine YEREL D1 (test)
//
// GEREKSİNİM: `wrangler`'ın Cloudflare kimliği (CLOUDFLARE_API_TOKEN +
// CLOUDFLARE_ACCOUNT_ID ortam değişkenleri ya da `wrangler login`).

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const DB_NAME = 'idenfit-leads';

const COLUMNS = [
  ['created_at', 'Tarih (UTC)'],
  ['form_type', 'Form'],
  ['full_name', 'Ad Soyad'],
  ['email', 'E-posta'],
  ['phone', 'Telefon'],
  ['company', 'Firma'],
  ['employee_count', 'Çalışan Sayısı'],
  ['sector', 'Sektör'],
  ['locale', 'Dil'],
  // İlk-giriş kaynağı (2026-10-09, migrations/0002) — 'bizi nereden buldu?'
  ['channel', 'Kanal'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['utm_term', 'utm_term'],
  ['utm_content', 'utm_content'],
  ['gclid', 'gclid'],
  ['referrer_host', 'Geldiği Site'],
  ['landing_path', 'İlk Girdiği Sayfa'],
  ['message', 'Mesaj'],
  ['maturity_total_score', 'Olgunluk Skoru'],
  ['maturity_level_title', 'Olgunluk Seviyesi'],
  ['maturity_category_scores', 'Kategori Skorları (JSON)'],
  ['maturity_group_scores', 'Grup Skorları (JSON)'],
  ['maturity_answers', 'Cevaplar (JSON)'],
  ['email_status', 'E-posta Durumu'],
  ['email_error', 'E-posta Hatası'],
  ['crm_status', 'CRM Aktarımı'],
  ['crm_lead_id', 'CRM Lead ID'],
  ['crm_error', 'CRM Hatası'],
  ['page_url', 'Sayfa'],
];

function parseArgs(argv) {
  const out = { formType: null, since: null, failed: false, crmFailed: false, outPath: null, limit: 5000, local: false };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--form-type') out.formType = argv[++i];
    else if (a === '--since') out.since = argv[++i];
    else if (a === '--out') out.outPath = argv[++i];
    else if (a === '--limit') out.limit = Number(argv[++i]);
    else if (a === '--failed') out.failed = true;
    else if (a === '--crm-failed') out.crmFailed = true;
    // Yalnızca geliştirme/test için: `wrangler dev`'in yerel D1 kopyası.
    else if (a === '--local') out.local = true;
    else throw new Error(`Bilinmeyen argüman: ${a}`);
  }
  return out;
}

// SQL string literal'i — değerler CLI üzerinden geçtiği için bind
// kullanılamıyor, tek tırnak ikilenerek kaçışlanıyor. Girdiler yalnızca
// operatörün kendi yazdığı filtreler (kullanıcı verisi DEĞİL) ama yine de
// kaçışlanıyor.
function sqlLiteral(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function buildQuery({ formType, since, failed, crmFailed, limit }) {
  const where = [];
  if (formType) where.push(`form_type = ${sqlLiteral(formType)}`);
  if (since) where.push(`created_at >= ${sqlLiteral(since)}`);
  if (failed) where.push(`email_status = 'failed'`);
  if (crmFailed) where.push(`crm_status IN ('failed', 'skipped')`);
  const cols = COLUMNS.map(([c]) => c).join(', ');
  const clause = where.length ? ` WHERE ${where.join(' AND ')}` : '';
  const n = Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 5000;
  return `SELECT ${cols} FROM leads${clause} ORDER BY created_at DESC LIMIT ${n};`;
}

function runQuery(sql, { local = false, configPath = null } = {}) {
  const args = ['wrangler', 'd1', 'execute', DB_NAME, '--json', '--command', sql];
  if (!local) args.splice(4, 0, '--remote');
  if (configPath) args.push('--config', configPath);
  const stdout = execFileSync(
    'npx',
    args,
    { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'] },
  );
  // wrangler JSON'dan önce banner/uyarı basabiliyor — ilk `[`'ten itibaren al.
  const start = stdout.indexOf('[');
  if (start === -1) throw new Error('wrangler çıktısında JSON bulunamadı');
  const parsed = JSON.parse(stdout.slice(start));
  return parsed[0]?.results ?? [];
}

// CSV ENJEKSİYONU — `=`, `+`, `-`, `@` ile başlayan bir hücre Excel/Sheets
// tarafından FORMÜL olarak yorumlanır. Firma adı/sektör/mesaj serbest metin
// olduğu için saldırgan kontrolünde; tek tırnak öneki hücreyi metne sabitler.
//
// BEKLENEN YAN ETKİ: `+90…` ile başlayan telefon numaraları da bu korumaya
// takılır ve başlarına `'` gelir. Excel ve Google Sheets bu öneki KENDİ metin
// işaretçileri olarak yorumlayıp GÖSTERMEZ; yalnızca CSV'yi düz metin
// düzenleyicide açarsanız görünür. `+` bilinçli olarak listede tutuluyor —
// Excel'de DDE saldırılarının gerçek tetikleyicilerinden biri.
function csvCell(value) {
  if (value === null || value === undefined) return '';
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  const header = COLUMNS.map(([, label]) => csvCell(label)).join(',');
  const body = rows.map((r) => COLUMNS.map(([col]) => csvCell(r[col])).join(',')).join('\r\n');
  // BOM — Excel'in UTF-8'i doğru algılaması için (Türkçe karakterler).
  return `﻿${header}\r\n${body}\r\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sql = buildQuery(args);
  console.log(`Sorgu: ${sql}`);
  const rows = runQuery(sql, { local: args.local, configPath: process.env.WRANGLER_CONFIG ?? null });
  if (rows.length === 0) {
    console.log('Kayıt bulunamadı — CSV yazılmadı.');
    return;
  }
  const outPath = args.outPath ?? `leads-${new Date().toISOString().slice(0, 10)}.csv`;
  writeFileSync(outPath, toCsv(rows), 'utf8');
  console.log(`${rows.length} kayıt yazıldı: ${outPath}`);

  const failed = rows.filter((r) => r.email_status === 'failed').length;
  const pending = rows.filter((r) => r.email_status === 'pending').length;
  if (failed > 0) console.log(`⚠️  ${failed} kaydın e-postası GİTMEDİ (email_status='failed') — elle takip gerekir.`);
  if (pending > 0) console.log(`ℹ️  ${pending} kayıt hâlâ 'pending' (gönderim sonucu işlenmemiş).`);
}

main();
