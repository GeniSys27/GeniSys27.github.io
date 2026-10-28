# Participant information-list endpoint

The public website is static, so it cannot securely write registrations or manage a mailing group by itself. This Google Apps Script endpoint connects the on-page form to a private Google Sheet and, when the organizer has the required Google Workspace permission, a Google Group. It uses double opt-in: the request is recorded first, and group enrollment happens only after the participant confirms through a one-time link sent to the submitted address.

Until an endpoint is configured, the website uses a safe fallback: it opens a pre-addressed email containing the participant’s form details. The participant must send that email to complete the request.

## Set up the endpoint

1. Create a private Google Sheet owned by the organizer. Copy the ID between `/d/` and `/edit` in its URL.
2. Create a standalone Apps Script project at <https://script.google.com/> and replace its editor contents with [`Code.gs`](Code.gs).
3. In **Project settings → Script properties**, add:
   - `SPREADSHEET_ID` — required; the private Sheet ID.
   - `SHEET_NAME` — optional; defaults to `Participants`.
   - `NOTIFY_EMAIL` — recommended; organizer address for new-request notices.
   - `GROUP_EMAIL` — optional; the Google Group address for automatic membership.
4. If `GROUP_EMAIL` is set, open **Services** in Apps Script, add **Admin SDK API**, and ensure the account deploying the script may manage that Group. If permission is unavailable, leave `GROUP_EMAIL` unset; requests are still recorded for manual review.
5. Select **Deploy → New deployment → Web app**. Execute as the organizer and allow anyone to access the web app so public visitors can submit. Authorize only the permissions shown by Apps Script.
6. Copy the deployed `/exec` URL into `workshop.json` as `registration.endpoint`.
7. Preview and test with a designated test address. Confirm the pending row, confirmation email, one-time link, consent value, duplicate-email update behavior, and Group membership before publishing.

## Data handling

The endpoint stores name, email, affiliation, role, requested update categories, consent, source, group status, timestamps, a temporary one-time token hash, and confirmation time. It never stores the usable confirmation token. It does not place participant information in the public repository. Restrict access to the destination Sheet and remove records when they are no longer needed.

The form includes a honeypot field and deduplicates by normalized email address. For a high-volume public campaign, add an enterprise form service or stronger abuse controls before circulation.

