import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
const source = readFileSync(new URL('../lib/job-publication.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { isPublicJob, jobContentError, schemaEmploymentType, QUARANTINED_JOB_SLUGS } = await import('data:text/javascript;base64,' + Buffer.from(compiled).toString('base64'));
test('audited test records remain hidden, while a real vacancy remains public', () => {
  for (const slug of QUARANTINED_JOB_SLUGS) assert.equal(isPublicJob({slug, status:'published'}), false);
  assert.equal(isPublicJob({slug:'warehouse-assistant-real', status:'published'}), true);
});
test('expired, invalid-dated and draft jobs never become public', () => {
  const now = Date.parse('2026-10-21T12:00:00Z');
  for (const expires_at of ['2026-10-20', 'invalid', '2026-10-21T12:00:00Z']) assert.equal(isPublicJob({expires_at},now),false);
  assert.equal(isPublicJob({expires_at:'2026-10-22'},now),true);
  assert.equal(isPublicJob({status:'draft'},now),false);
});
test('publication rejects repeated placeholders but accepts real technical responsibilities', () => {
  assert.ok(jobContentError('Amazon seller', 'amazon seller'.repeat(20)));
  assert.ok(jobContentError('sell', 'cd /d C:\\Users\\Dell\\Desktop\\ukjobalert-new-theme npm run build '.repeat(6)));
  assert.equal(jobContentError('Frontend developer', 'Build accessible web interfaces, review pull requests and run npm run build to verify production bundles. Collaborate with designers and maintain automated tests.'),null);
});
test('employment type uses Google enumeration, never mislabels remote', () => {
  assert.equal(schemaEmploymentType('Full Time'),'FULL_TIME');
  assert.equal(schemaEmploymentType('Part Time'),'PART_TIME');
  assert.equal(schemaEmploymentType('Internship'),'INTERN');
  assert.equal(schemaEmploymentType('Remote'),undefined);
});
