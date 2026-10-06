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

function submissionDeadline(value = '') {
  if (typeof value !== 'string') throw new Error('submissionDeadline must be a YYYY-MM-DD string or empty while pending.');
  if (!value.trim()) return null;
  const iso = value.trim();
  const date = new Date(`${iso}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== iso) {
    throw new Error('submissionDeadline must be a valid date in YYYY-MM-DD format.');
  }
  return { iso, label: new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(date) };
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
  const deadline = submissionDeadline(configuration.submissionDeadline);
  const deadlineText = deadline?.label ?? 'To be announced';
  const deadlineHtml = deadline ? `<time datetime="${deadline.iso}">${deadline.label}</time>` : deadlineText;
  const escapedUrl = escapeHtml(url);
  const externalLink = (label, className = '') =>
    `<a${className ? ` class="${className}"` : ''} href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const paths = ['index.html', 'poster.html', 'genisys-2027-call-for-posters.txt', 'schedule.html'];
  let [index, poster, call, schedule] = await Promise.all(paths.map(file => readFile(path.join(root, file), 'utf8')));

  const filenames = '<div class="submission-filenames"><p><strong>Submission filenames</strong></p>' +
    '<code>Presentation_<wbr>First_<wbr>Lastname_<wbr>Level.pptx</code>' +
    '<code>Poster_<wbr>First_<wbr>Lastname_<wbr>Level.pptx</code>' +
    '<p>Replace First and Lastname with your name. Use Undergrad, Master, or PhD for Level.</p></div>';
  index = replaceSlot(index, 'filenames', filenames, 'submission');
  schedule = replaceSlot(schedule, 'filenames', filenames, 'submission');
  index = replaceSlot(index, 'deadline', deadlineHtml, 'submission');
  schedule = replaceSlot(schedule, 'requirements', `<strong>Submission deadline:</strong> ${deadlineHtml}. Posters: PPTX. Presentations: PPTX.`, 'submission');
  poster = replaceSlot(poster, 'deadline', deadlineHtml, 'submission');

  schedule = replaceSlot(schedule, 'actions', studentUrl
    ? `<a class="button button-dark" href="${escapeHtml(studentUrl)}" target="_blank" rel="noopener noreferrer">Submit a presentation <span aria-hidden="true">↗</span></a>`
    : '<button class="button button-dark" type="button" disabled aria-describedby="presentation-link-status">Submit a presentation</button><p id="presentation-link-status" class="submission-link-status">Submission link to be announced.</p>', 'presentation');

  const homepagePresentation = studentUrl
    ? `<a class="button button-dark" href="${escapeHtml(studentUrl)}" target="_blank" rel="noopener noreferrer">Submit a presentation <span aria-hidden="true">↗</span></a>`
    : '<button class="button button-dark" type="button" disabled aria-describedby="homepage-presentation-link-status">Submit a presentation</button>';
  index = replaceSlot(index, 'status', url && studentUrl ? 'Poster and presentation links available'
    : url ? 'Poster submission link available'
    : studentUrl ? 'Presentation submission link available' : 'Submission links coming soon');
  index = replaceSlot(index, 'actions',
    '<div class="submission-buttons">' +
    (url ? externalLink('Submit a poster <span aria-hidden="true">↗</span>', 'button button-dark') : '') +
    homepagePresentation + '</div>' +
    (studentUrl ? '' : '<p id="homepage-presentation-link-status" class="submission-link-status">Presentation submission link to be announced.</p>') +
    '<a class="text-link" href="output/pdf/genisys-2027-call-for-submissions.pdf?v=0.8.22" download="genisys-2027-call-for-submissions.pdf">Download the call for contribution (PDF) <span aria-hidden="true">↓</span></a>');
  index = replaceSlot(index, 'embed', url || studentUrl
    ? '<details class="upload-panel" id="poster-upload"><summary>Upload your research</summary><div class="upload-content">' +
      '<p class="upload-help"><strong>Presentations (PPTX)</strong><br>' +
      (studentUrl ? `<a href="${escapeHtml(studentUrl)}" target="_blank" rel="noopener noreferrer">Submit a presentation <span aria-hidden="true">↗</span></a>` : 'Presentation submission link to be announced.') + '</p>' +
      (url ? `<p class="upload-help"><strong>Posters (PPTX)</strong><br>Upload your poster using the form below.</p><iframe src="${escapedUrl}" height="550" width="800" title="GeniSys research poster upload form on Box" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><p class="upload-help">Form not loading? ${externalLink('Open the poster form in Box')}.</p>`
        : '<p class="upload-help"><strong>Posters (PPTX)</strong><br>Poster submission link to be announced.</p>') + '</div></details>'
    : '');
  poster = replaceSlot(poster, 'poster', url
    ? `PPTX format · Upload through Box<br>${externalLink(escapedUrl, 'poster-upload-link')}`
    : 'PPTX format · Poster submission link to be announced');
  poster = replaceSlot(poster, 'poster', studentUrl
    ? `<a class="poster-upload-link" href="${escapeHtml(studentUrl)}" target="_blank" rel="noopener noreferrer">Submit a presentation</a>`
    : 'Presentation submission link to be announced', 'presentation');

  if (!/^Submission deadlines?: .+$/m.test(call) || !/^Poster submission link: .+$/m.test(call) || !/^Research presentation submission link: .+$/m.test(call) || !/\nSUBMISSION INFORMATION\n[\s\S]*?\nORGANIZERS\n/.test(call)) {
    throw new Error('The downloadable call is missing its submission links or submission information section.');
  }
  call = call.replace(/^Submission deadlines?: .+$/m, () => `Submission deadline: ${deadlineText}`);
  call = call.replace(/^Poster submission link: .+$/m, () => `Poster submission link: ${url || 'To be announced'}`);
  call = call.replace(/^Research presentation submission link: .+$/m, () => `Research presentation submission link: ${studentUrl || 'To be announced'}`);
  call = call.replace(/\nSUBMISSION INFORMATION\n[\s\S]*?\nORGANIZERS\n/, () =>
    '\nSUBMISSION INFORMATION\nResearch posters\n' +
    (url ? `Upload your research poster to Box: ${url}\n\n` : 'The poster upload link will be announced on the workshop website.\n\n') +
    'Recent research and previously published work are both welcome.\n\n' +
    'Recommended poster size: 36 in wide × 48 in tall (portrait; approximately 91 × 122 cm).\n\n' +
    `File format: PPTX. Submission deadline: ${deadlineText}.\n\n` +
    'Filename: Poster_First_Lastname_Level.pptx. Replace First and Lastname with your name. Use Undergrad, Master, or PhD for Level.\n\n' +
    'Research presentations\nOpen to undergraduate, master’s, and PhD students.\n\n' +
    (studentUrl ? `Submit your research presentation: ${studentUrl}\n\n` : 'The presentation submission link will be announced on the workshop website.\n\n') +
    'File format: PPTX. Presentation decks must contain fewer than 15 slides (maximum 14). Presentation slots are 15 minutes, including Q&A and transitions.\n\n' +
    'Filename: Presentation_First_Lastname_Level.pptx. Replace First and Lastname with your name. Use Undergrad, Master, or PhD for Level.\n\n' +
    `Submission deadline: ${deadlineText}. Check the workshop website for updates: https://genisys27.github.io/#posters` +
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
    console.log('Before publishing, rebuild the PDF: python3 scripts/build-call-pdf.py');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
