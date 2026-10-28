/**
 * GeniSys 2027 participant information-list endpoint with double opt-in.
 *
 * Required script property:
 *   SPREADSHEET_ID  Destination Google Sheet ID.
 *
 * Optional script properties:
 *   SHEET_NAME      Defaults to "Participants".
 *   GROUP_EMAIL     Google Group address. Confirmed participants are added
 *                   through the Admin SDK Directory service when permitted.
 *   NOTIFY_EMAIL    Organizer address that receives status notices.
 */

const HEADERS = [
  'Submitted at',
  'Email',
  'Full name',
  'Affiliation',
  'Role',
  'Requested updates',
  'Consent',
  'Source',
  'Group status',
  'Last updated',
  'Confirmation token hash',
  'Confirmed at'
];

function doGet(e) {
  const parameters = (e && e.parameter) || {};
  const email = clean_(parameters.email, 254).toLowerCase();
  const token = clean_(parameters.token, 200);
  if (!email || !token) {
    return response_(false, 'This confirmation link is incomplete. Please submit the GeniSys updates form again.');
  }

  try {
    const properties = PropertiesService.getScriptProperties();
    const sheet = getSheet_(properties);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    let participant;
    let groupStatus;
    try {
      const row = findParticipantRow_(sheet, email);
      if (!row) throw new Error('No matching registration was found.');
      const expectedHash = String(sheet.getRange(row, 11).getValue() || '');
      if (!expectedHash || expectedHash !== hashToken_(token)) {
        throw new Error('The confirmation link is invalid or has already been used.');
      }

      participant = {
        email: email,
        fullName: String(sheet.getRange(row, 3).getValue() || ''),
        affiliation: String(sheet.getRange(row, 4).getValue() || ''),
        role: String(sheet.getRange(row, 5).getValue() || ''),
        interests: String(sheet.getRange(row, 6).getValue() || '')
      };
      groupStatus = addToGroup_(participant, properties.getProperty('GROUP_EMAIL'));
      const now = new Date();
      sheet.getRange(row, 9, 1, 4).setValues([[groupStatus, now, '', now]]);
    } finally {
      lock.releaseLock();
    }

    notifyOrganizer_(participant, groupStatus, properties.getProperty('NOTIFY_EMAIL'));
    return response_(true, groupStatus === 'Added to group' || groupStatus === 'Already in group'
      ? 'Your email is confirmed and you are on the GeniSys 2027 information list.'
      : 'Your email is confirmed. The organizers will complete your information-list request.');
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return response_(false, 'This confirmation link is invalid, expired, or already used. Please submit the form again.');
  }
}

function doPost(e) {
  try {
    const parameters = (e && e.parameter) || {};
    const parameterLists = (e && e.parameters) || {};

    // Quietly accept honeypot submissions so bots receive no useful feedback.
    if (clean_(parameters.website, 200)) {
      return response_(true, 'Thank you.');
    }

    const participant = {
      fullName: clean_(parameters.fullName, 100),
      email: clean_(parameters.email, 254).toLowerCase(),
      affiliation: clean_(parameters.affiliation, 120),
      role: clean_(parameters.role, 80),
      interests: (parameterLists.interests || []).map(function (value) {
        return clean_(value, 100);
      }).filter(Boolean).join('; '),
      consent: clean_(parameters.consent, 10),
      source: clean_(parameters.source, 100) || 'GeniSys 2027 website'
    };

    validate_(participant);
    const properties = PropertiesService.getScriptProperties();
    const sheet = getSheet_(properties);
    const token = Utilities.getUuid() + Utilities.getUuid();
    const tokenHash = hashToken_(token);
    const groupStatus = 'Awaiting email confirmation';

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      upsertParticipant_(sheet, participant, groupStatus, tokenHash);
    } finally {
      lock.releaseLock();
    }

    sendConfirmationEmail_(participant, token);
    notifyOrganizer_(participant, groupStatus, properties.getProperty('NOTIFY_EMAIL'));
    return response_(true, 'Check your email and use the confirmation link to complete your request.');
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return response_(false, 'We could not record the request. Please email the GeniSys organizers.');
  }
}

function validate_(participant) {
  if (!participant.fullName) throw new Error('Full name is required.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(participant.email)) throw new Error('A valid email address is required.');
  if (!participant.role) throw new Error('Role is required.');
  if (participant.consent !== 'yes') throw new Error('Consent is required.');
}

function getSheet_(properties) {
  const spreadsheetId = properties.getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID is not configured.');
  const sheetName = properties.getProperty('SHEET_NAME') || 'Participants';
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
  ensureHeaders_(sheet);
  return sheet;
}

function ensureHeaders_(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function upsertParticipant_(sheet, participant, groupStatus, tokenHash) {
  const now = new Date();
  const values = [
    now,
    participant.email,
    participant.fullName,
    participant.affiliation,
    participant.role,
    participant.interests || 'General event updates',
    'Yes',
    participant.source,
    groupStatus,
    now,
    tokenHash,
    ''
  ];

  const lastRow = sheet.getLastRow();
  const existingRow = findParticipantRow_(sheet, participant.email);
  const targetRow = existingRow || lastRow + 1;
  if (existingRow) values[0] = sheet.getRange(existingRow, 1).getValue() || now;
  sheet.getRange(targetRow, 1, 1, values.length).setValues([values]);
}

function findParticipantRow_(sheet, email) {
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) return 0;
  const emails = sheet.getRange(2, 2, lastRow - 1, 1).getDisplayValues();
  const index = emails.findIndex(function (row) {
    return String(row[0]).trim().toLowerCase() === email;
  });
  return index < 0 ? 0 : index + 2;
}

function sendConfirmationEmail_(participant, token) {
  const endpoint = ScriptApp.getService().getUrl();
  if (!endpoint) throw new Error('Deploy the script as a web app before accepting registrations.');
  const confirmationUrl = endpoint + '?email=' + encodeURIComponent(participant.email) + '&token=' + encodeURIComponent(token);
  const subject = 'Confirm your GeniSys 2027 event updates request';
  const text = [
    'Hello ' + participant.fullName + ',',
    '',
    'Confirm that you want to receive GeniSys 2027 workshop updates:',
    confirmationUrl,
    '',
    'If you did not submit this request, you can ignore this email.'
  ].join('\n');
  const html = '<p>Hello ' + escapeHtml_(participant.fullName) + ',</p>' +
    '<p>Confirm that you want to receive GeniSys 2027 workshop updates.</p>' +
    '<p><a href="' + escapeHtml_(confirmationUrl) + '" style="display:inline-block;padding:12px 18px;background:#071e3b;color:#fff;text-decoration:none;border-radius:5px">Confirm event updates</a></p>' +
    '<p>If you did not submit this request, you can ignore this email.</p>';
  MailApp.sendEmail({
    to: participant.email,
    subject: subject,
    body: text,
    htmlBody: html,
    name: 'GeniSys 2027 organizers'
  });
}

function hashToken_(token) {
  const digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token, Utilities.Charset.UTF_8);
  return digest.map(function (value) {
    return ('0' + ((value + 256) % 256).toString(16)).slice(-2);
  }).join('');
}

function addToGroup_(participant, groupEmail) {
  if (!groupEmail) return 'Email confirmed; pending organizer review';
  try {
    AdminDirectory.Members.insert({
      email: participant.email,
      role: 'MEMBER',
      type: 'USER'
    }, groupEmail);
    return 'Added to group';
  } catch (error) {
    const message = String(error && error.message ? error.message : error);
    if (/already exists|duplicate|member exists/i.test(message)) return 'Already in group';
    console.error('Google Group addition failed: ' + message);
    return 'Email confirmed; group addition needs review';
  }
}

function notifyOrganizer_(participant, groupStatus, notifyEmail) {
  if (!notifyEmail) return;
  const subject = 'GeniSys 2027 information-list status: ' + participant.fullName;
  const lines = [
    '<p>A participant information-list status changed.</p>',
    '<table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse">',
    row_('Name', participant.fullName),
    row_('Email', participant.email),
    row_('Affiliation', participant.affiliation || 'Not provided'),
    row_('Role', participant.role),
    row_('Requested updates', participant.interests || 'General event updates'),
    row_('Group status', groupStatus),
    '</table>'
  ];
  MailApp.sendEmail({
    to: notifyEmail,
    replyTo: participant.email,
    subject: subject,
    body: 'Name: ' + participant.fullName + '\nEmail: ' + participant.email + '\nGroup status: ' + groupStatus,
    htmlBody: lines.join(''),
    name: 'GeniSys 2027 website'
  });
}

function row_(label, value) {
  return '<tr><th align="left">' + escapeHtml_(label) + '</th><td>' + escapeHtml_(value) + '</td></tr>';
}

function response_(ok, message) {
  const payload = JSON.stringify({
    type: 'genisys-registration',
    ok: Boolean(ok),
    message: String(message)
  }).replace(/</g, '\\u003c');
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>GeniSys 2027</title></head><body>' +
    '<p>' + escapeHtml_(message) + '</p>' +
    '<script>if(parent!==window){parent.postMessage(' + payload + ', "*");}<\/script>' +
    '</body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function clean_(value, maximumLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maximumLength);
}

function escapeHtml_(value) {
  return String(value || '').replace(/[&<>"']/g, function (character) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
  });
}
