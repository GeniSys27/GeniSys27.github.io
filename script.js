const printButton = document.getElementById('print-poster');
printButton?.addEventListener('click', () => {
  window.print();
});

// Preserve direct links to the embedded upload form while keeping it compact by default.
const uploadPanel = document.getElementById('poster-upload');
if (uploadPanel instanceof HTMLDetailsElement) {
  const revealUpload = () => {
    if (window.location.hash !== '#poster-upload') return;
    uploadPanel.open = true;
    requestAnimationFrame(() => uploadPanel.scrollIntoView({ block: 'start' }));
  };
  window.addEventListener('hashchange', revealUpload);
  revealUpload();
}

const header = document.querySelector('.site-header');
if (header && 'ResizeObserver' in window) {
  let previousHeight = 0;
  const headerSize = new ResizeObserver(() => {
    const height = header.offsetHeight;
    if (height === previousHeight) return;
    previousHeight = height;
    document.documentElement.style.setProperty('--header-height', `${height}px`);
  });
  headerSize.observe(header);
}

// Observe only local section links; preserve aria-current="page" on standalone pages.
const navigation = [...document.querySelectorAll('.section-nav a')].filter(link =>
  link.getAttribute('href')?.startsWith('#') && link.hash.length > 1
);
if (navigation.length) {
  const sections = navigation.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
  let updatePending = false;
  let previousSection;
  const updateNavigation = () => {
    updatePending = false;
    const readingLine = Math.max(0, header?.getBoundingClientRect().bottom ?? 0) + 60;
    const current = sections.find(section => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= readingLine && bounds.bottom > readingLine;
    })?.id;
    if (current === previousSection) return;
    previousSection = current;
    navigation.forEach(link => {
      if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const queueNavigationUpdate = () => {
    if (updatePending) return;
    updatePending = true;
    requestAnimationFrame(updateNavigation);
  };
  window.addEventListener('scroll', queueNavigationUpdate, { passive: true });
  window.addEventListener('resize', queueNavigationUpdate);
  window.addEventListener('load', queueNavigationUpdate);
  updateNavigation();
}

const participantForm = document.getElementById('participant-form');
const participantStatus = document.getElementById('participant-form-status');
const participantTarget = document.getElementById('participant-submit-target');

if (participantForm instanceof HTMLFormElement && participantStatus) {
  const submitButton = participantForm.querySelector('button[type="submit"]');
  const defaultContact = 'yuke.wang@rice.edu';
  let registration = { endpoint: '', contactEmail: defaultContact, groupName: 'GeniSys 2027 event information list' };
  let submittedToEndpoint = false;
  let submissionTimer;

  const setStatus = (message, type = '') => {
    participantStatus.textContent = message;
    participantStatus.classList.toggle('is-success', type === 'success');
    participantStatus.classList.toggle('is-error', type === 'error');
  };

  const safeEndpoint = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value.trim());
      return url.protocol === 'https:' && !url.username && !url.password ? url.href : '';
    } catch {
      return '';
    }
  };

  const initializeRegistration = async () => {
    try {
      const response = await fetch('workshop.json', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Configuration returned ${response.status}`);
      const configuration = await response.json();
      if (configuration.registration && typeof configuration.registration === 'object') {
        registration = { ...registration, ...configuration.registration };
      }
    } catch (error) {
      console.warn('Participant registration configuration could not be loaded.', error);
    }

    const endpoint = safeEndpoint(registration.endpoint);
    if (endpoint) {
      participantForm.action = endpoint;
      participantForm.method = 'post';
      participantForm.target = 'participant-submit-target';
      setStatus(`Your request will be sent to the ${registration.groupName || 'event information list'}.`);
    } else {
      setStatus('Your request will open as an email to the organizers for review.');
    }
  };

  participantTarget?.addEventListener('load', () => {
    if (!submittedToEndpoint) return;
    setStatus('Your request was sent. Waiting for confirmation…');
  });

  window.addEventListener('message', event => {
    if (!submittedToEndpoint || event.source !== participantTarget?.contentWindow ||
        !event.data || event.data.type !== 'genisys-registration') return;
    submittedToEndpoint = false;
    window.clearTimeout(submissionTimer);
    submitButton?.removeAttribute('disabled');
    if (event.data.ok) participantForm.reset();
    setStatus(String(event.data.message || (event.data.ok ? 'Your request was received.' : 'The request could not be recorded.')),
      event.data.ok ? 'success' : 'error');
  });

  participantForm.addEventListener('submit', event => {
    participantStatus.classList.remove('is-success', 'is-error');
    if (!participantForm.checkValidity()) {
      event.preventDefault();
      participantForm.reportValidity();
      setStatus('Please complete the required fields before submitting.', 'error');
      return;
    }

    const data = new FormData(participantForm);
    if (data.get('website')) {
      event.preventDefault();
      participantForm.reset();
      setStatus('Thank you — your request was received.', 'success');
      return;
    }

    const endpoint = safeEndpoint(registration.endpoint);
    if (endpoint) {
      submittedToEndpoint = true;
      submitButton?.setAttribute('disabled', '');
      setStatus('Sending your request…');
      window.clearTimeout(submissionTimer);
      submissionTimer = window.setTimeout(() => {
        if (!submittedToEndpoint) return;
        submittedToEndpoint = false;
        submitButton?.removeAttribute('disabled');
        setStatus('The request was sent, but confirmation took too long. Please contact the organizers if you do not receive an update.', 'error');
      }, 15000);
      return;
    }

    event.preventDefault();
    const fullName = String(data.get('fullName') || '').trim();
    const email = String(data.get('email') || '').trim();
    const affiliation = String(data.get('affiliation') || '').trim() || 'Not provided';
    const role = String(data.get('role') || '').trim();
    const interests = data.getAll('interests').map(String);
    const subject = 'GeniSys 2027 event updates request';
    const body = [
      'Please add me to the GeniSys 2027 event information list.',
      '',
      `Name: ${fullName}`,
      `Email: ${email}`,
      `University or organization: ${affiliation}`,
      `Role: ${role}`,
      `Requested updates: ${interests.length ? interests.join(', ') : 'General event updates'}`,
      '',
      'Consent: I agree that the GeniSys organizers may use this information to add me to the event information list and send relevant workshop updates.'
    ].join('\n');
    const contact = typeof registration.contactEmail === 'string' && registration.contactEmail.includes('@')
      ? registration.contactEmail.trim() : defaultContact;
    window.location.href = `mailto:${encodeURIComponent(contact)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('Your email app is ready. Send the message to complete your request.', 'success');
  });

  initializeRegistration();
}
