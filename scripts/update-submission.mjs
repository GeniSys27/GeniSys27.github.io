import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function uploadUrl(value) {
  if (typeof value !== 'string') throw new Error('boxUploadUrl must be a string. Leave it empty while the link is pending.');
  if (!value.trim()) return '';
  let url;
  try { url = new URL(value.trim()); }
  catch { throw new Error('boxUploadUrl must be a complete HTTPS Box upload URL.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port ||
      !(url.hostname === 'box.com' || url.hostname.endsWith('.box.com')) || url.pathname === '/') {
    throw new Error('Use an HTTPS upload link on box.com or a Box subdomain, without embedded credentials.');
  }
  return url.href;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function presentationUrl(value = '') {
  if (typeof value !== 'string') throw new Error('studentPresentationUrl must be a string. Leave it empty while the link is pending.');
  if (!value.trim()) return '';
  let url;
  try { url = new URL(value.trim()); }
  catch { throw new Error('studentPresentationUrl must be a complete HTTPS submission URL.'); }
  if (url.protocol !== 'https:' || url.username || url.password) {
    throw new Error('Use an HTTPS student presentation submission link without embedded credentials.');
  }
  return url.href;
}

function replaceSlot(text, name, replacement, namespace = 'box') {
  const start = `<!-- ${namespace}:${name} -->`;
  const end = `<!-- /${namespace}:${name} -->`;
  const first = text.indexOf(start);
  const last = text.indexOf(end);
  if (first < 0 || last < first || text.indexOf(start, first + start.length) !== -1 ||
      text.indexOf(end, last + end.length) !== -1) {
    throw new Error(`Missing or duplicate submission content marker: ${namespace}:${name}`);
  }
  return text.slice(0, first + start.length) + replacement + text.slice(last);
}

export async function updateSubmission(root) {
  const configuration = JSON.parse(await readFile(path.join(root, 'workshop.json'), 'utf8'));
  const url = uploadUrl(configuration.boxUploadUrl);
  const studentUrl = presentationUrl(configuration.studentPresentationUrl);
  const escapedUrl = escapeHtml(url);
  const externalLink = (label, className = '') =>
    `<a${className ? ` class="${className}"` : ''} href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const paths = ['index.html', 'poster.html', 'genisys-2027-call-for-posters.txt', 'schedule.html'];
  let [index, poster, call, schedule] = await Promise.all(paths.map(file => readFile(path.join(root, file), 'utf8')));

  schedule = replaceSlot(schedule, 'actions', studentUrl
    ? `<a class="button button-dark" href="${escapeHtml(studentUrl)}" target="_blank" rel="noopener noreferrer">Submit a research presentation <span aria-hidden="true">↗</span></a>`
    : '<button class="button button-dark" type="button" disabled aria-describedby="presentation-link-status">Submit a research presentation</button><p id="presentation-link-status" class="submission-link-status">Submission link to be announced.</p>', 'presentation');

  index = replaceSlot(index, 'status', url ? 'Box upload available' : 'Submission link coming soon');
  index = replaceSlot(index, 'actions',
    (url ? externalLink('Submit via Box <span aria-hidden="true">↗</span>', 'button button-dark') : '') +
    '<a class="text-link" href="genisys-2027-call-for-posters.txt" download>Download the call <span aria-hidden="true">↓</span></a>');
  index = replaceSlot(index, 'embed', url
    ? `<details class="upload-panel" id="poster-upload"><summary>Upload on this page</summary><div class="upload-content"><iframe src="${escapedUrl}" height="550" width="800" title="GeniSys research poster upload form on Box" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="upload-help">Form not loading? ${externalLink('Open in Box')}.</p></div></details>`
    : '');
  poster = replaceSlot(poster, 'poster', url
    ? `Upload through Box<br>${externalLink(escapedUrl, 'poster-upload-link')}<br>Deadline to be announced`
    : 'Upload through Box<br>Link and deadline to be announced');

  if (!/^Box upload link: .+$/m.test(call) || !/\nSUBMISSION INFORMATION\n[\s\S]*?\nORGANIZERS\n/.test(call)) {
    throw new Error('The downloadable call is missing its Box link or submission information section.');
  }
  call = call.replace(/^Box upload link: .+$/m, () => `Box upload link: ${url || 'To be announced'}`);
  call = call.replace(/\nSUBMISSION INFORMATION\n[\s\S]*?\nORGANIZERS\n/, () =>
    '\nSUBMISSION INFORMATION\n' +
    (url ? `Upload your research poster to Box: ${url}\n\n` : 'Submit your research poster by uploading it through the Box link provided on the workshop website. ') +
    'Recent research and previously published work are both welcome.\n\n' +
    'Recommended poster size: 36 in wide × 48 in tall (portrait; approximately 91 × 122 cm).\n\n' +
    (url ? 'The submission deadline and file requirements will be announced. Follow the instructions on the Box upload page and check the workshop website for updates.'
      : 'The Box upload link, submission deadline, and file requirements will be announced. Please check the workshop website for the upload link and final instructions.') +
    '\n\nORGANIZERS\n');

  // Validate all inputs and render all outputs before changing any file.
  for (const [i, content] of [index, poster, call, schedule].entries()) {
    await writeFile(path.join(root, paths[i]), content);
  }
  return { configured: Boolean(url), presentationConfigured: Boolean(studentUrl), files: paths };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await updateSubmission(fileURLToPath(new URL('../', import.meta.url)));
    console.log(`Poster submission link ${result.configured ? 'updated' : 'pending'}; student presentation submission link ${result.presentationConfigured ? 'updated' : 'pending'}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
