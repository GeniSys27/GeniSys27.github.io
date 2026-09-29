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

function replaceSlot(text, name, replacement) {
  const start = `<!-- box:${name} -->`;
  const end = `<!-- /box:${name} -->`;
  const first = text.indexOf(start);
  const last = text.indexOf(end);
  if (first < 0 || last < first || text.indexOf(start, first + start.length) !== -1 ||
      text.indexOf(end, last + end.length) !== -1) {
    throw new Error(`Missing or duplicate Box content marker: ${name}`);
  }
  return text.slice(0, first + start.length) + replacement + text.slice(last);
}

export async function updateSubmission(root) {
  const configuration = JSON.parse(await readFile(path.join(root, 'workshop.json'), 'utf8'));
  const url = uploadUrl(configuration.boxUploadUrl);
  const escapedUrl = escapeHtml(url);
  const externalLink = (label, className = '') =>
    `<a${className ? ` class="${className}"` : ''} href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const paths = ['dist/index.html', 'dist/poster.html', 'dist/genisys-2027-call-for-posters.txt'];
  let [index, poster, call] = await Promise.all(paths.map(file => readFile(path.join(root, file), 'utf8')));

  index = replaceSlot(index, 'status', url ? 'Box upload available' : 'Box upload link forthcoming');
  index = replaceSlot(index, 'actions',
    (url ? '<a class="button button-dark" href="#poster-upload">Upload your poster</a>' : '') +
    `<a class="button ${url ? 'button-outline' : 'button-dark'}" href="genisys-2027-call-for-posters.txt" download>Download the call</a>` +
    '<a class="button button-outline" href="poster.html">Print event poster</a>');
  index = replaceSlot(index, 'note', url
    ? 'Submission deadline: to be announced.'
    : 'Submit your research poster through the Box upload link. The link and submission deadline will be announced.');
  index = replaceSlot(index, 'url', url ? externalLink('Rice Box upload form') : 'Box · Link forthcoming');
  index = replaceSlot(index, 'panel-note', url
    ? 'Box handles your file upload. Follow the instructions in the form to complete your submission.'
    : 'Upload your research poster using the Box link that will be provided here. Recent research and previously published work are both welcome.');
  index = replaceSlot(index, 'embed', url
    ? `<section class="box-upload" id="poster-upload" aria-labelledby="box-upload-title"><div class="upload-heading"><div><p class="eyebrow">POSTER SUBMISSION</p><h3 id="box-upload-title">Submit your poster</h3><p>Upload your recent research or previously published work.</p></div>${externalLink('Open in Box')}</div><iframe src="${escapedUrl}" height="550" width="800" title="GeniSys research poster upload form on Box" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="upload-help">Having trouble with the form? ${externalLink('Open it directly in Box')}.</p></section>`
    : '');
  index = replaceSlot(index, 'step-three', url
    ? 'Use the submission form below and follow the instructions in Box to complete your upload.'
    : 'The Box upload link will appear here when it is available. Check back for submission instructions.');
  index = replaceSlot(index, 'prepare',
    'Start with a clear research question, your approach, and the results or insights you would like to discuss. ' +
    'We recommend a 36 in wide × 48 in tall poster (portrait; approximately 91 × 122 cm). ' +
    (url ? 'Submit your research poster using the Box form below. File requirements will be announced.'
      : 'You will submit your research poster through a provided Box upload link. File requirements and the upload link will be announced.'));
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
  for (const [i, content] of [index, poster, call].entries()) {
    await writeFile(path.join(root, paths[i]), content);
  }
  return { configured: Boolean(url), files: paths };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await updateSubmission(fileURLToPath(new URL('../', import.meta.url)));
    console.log(result.configured
      ? 'Box upload link updated in the website, printable poster, and downloadable call.'
      : 'Box upload link is pending. All materials show that the link is forthcoming.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
