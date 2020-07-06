/**
 * state
 * initialized to the value of localstorage if not null
 * or else to a simple object that shall be built upon
 */
let state = localStorage.getItem('state')
  ? JSON.parse(localStorage.getItem('state'))
  : {
      eventsAppliedFor: []
    };

// list all events, on load
listAllEvents();

/**
 * listAllEvents
 * @function
 */
function listAllEvents() {
  // grid of event cards
  const eventCardWrapper = document.createElement('div');
  eventCardWrapper.setAttribute('id', 'event-card-wrapper');

  // loop through list of events, adding each to the wrapper
  for (const event of getEvents()) {
    const eventCard = EventCard(event);

    eventCardWrapper.appendChild(eventCard);
  }

  document.querySelector('main').innerHTML = '';
  document.querySelector('main').appendChild(eventCardWrapper);
}

/**
 * seeEventDetails
 * @function
 * @param {string} eventId
 */
function seeEventDetails(eventId) {
  // filter list of events for one with this ID
  const eventDetails = getEvents().filter(event => event.id === eventId);

  // render in place - replace eventCardWrapper
  document.querySelector('main').innerHTML = '';
  document.querySelector('main').appendChild(EventPage(...eventDetails));
}

/**
 * applyForEvent
 * @function
 * @param {string} eventId
 */
function applyForEvent(eventId) {
  /*
  a network request could be appropriate at this point
  will just update state for now
  */
  state = {
    ...state,
    eventsAppliedFor: [
      ...state.eventsAppliedFor,
      eventId
    ]
  };

  // maybe persist state
  localStorage.setItem('state', JSON.stringify(state));
}

/**
 * EventCard - component
 * @function
 * @param {object} event - data for this event
 * @returns {HTMLDivElement} card
 */
function EventCard(event) {
  const card = document.createElement('div');
  card.classList.add('event-card');

  // highlighted event - Leap, Recruiting Mission or VanHackathon
  if (
    event.type === 'Leap'
      || event.type === 'Recruiting Mission'
      || event.type === 'VanHackathon'
  ) {
    card.classList.add('event-card-highlighted');
  }

  card.innerHTML = `
    <div class="event-card-thumbnail">
      <img src="${event.images[0]}" alt="${event.title}" />
    </div>
    ${
      event.type === 'Premium-only Webinar'
        ? `<div class="event-card-premium-icon-wrapper">${PremiumIcon()}</div>`
        : ''
    }
    <div class="event-card-main">
      <div class="event-card-title">${event.title}</div>
      <div class="event-card-datetime">
        <div class="event-card-date">${date(event.startDate)}</div>
        <div class="event-card-time">${time(event.startDate)} (${event.timezone})</div>
      </div>
      <div class="
        event-card-location ${
          event.location === 'online'
            ? 'event-card-location-online'
            : ''
        }
      ">
        ${event.location}
      </div>
      <div class="event-card-overlay">
        ${PrimaryButton({ label: 'more', disabled: false })}
      </div>
    </div>
  `;

  // see event details when button is clicked
  card.querySelector('button').addEventListener('click', function() {
    seeEventDetails(event.id);
  });
  
  return card;
};

/**
 * EventPage - component
 * @function
 * @param {object} event - data for this event
 * @returns {HTMLDivElement} page
 */
function EventPage(event) {
  const page = document.createElement('div');
  page.setAttribute('id', 'event-page');

  page.innerHTML = `
    ${
      event.type === 'Premium-only Webinar'
        ? `<div class="event-page-premium-icon-wrapper">${PremiumIcon()}</div>`
        : ''
    }
    <div class="back-button-icon-wrapper">${BackIcon()}</div>
    <div class="event-page-header">
      <div class="event-page-thumbnail">
        <img src="${event.images[0]}" alt="${event.title}" />
      </div>
      <div class="event-page-details-cta-wrapper">
        <div class="event-page-header-details">
          <div class="event-page-title">${event.title}</div>
          <div class="event-page-datetime event-page-start-datetime">
            <div class="event-page-header-details-icon event-page-start-datetime-icon">
              ${LaunchIcon()}
            </div>
            <div class="event-page-date">${date(event.startDate)}</div>
            <div class="event-page-time">${time(event.startDate)} (${event.timezone})</div>
          </div>
          <div class="event-page-datetime event-page-end-datetime">
          <div class="event-page-header-details-icon event-page-end-datetime-icon">
            ${FlagIcon()}
          </div>
            <div class="event-page-date">${date(event.endDate)}</div>
            <div class="event-page-time">${time(event.endDate)} (${event.timezone})</div>
          </div>
          <div class="event-page-location">
            <div class="event-page-header-details-icon event-page-location-icon">
              ${PinIcon()}
            </div>
            <div>${event.location}</div>
          </div>
        </div>
        <div class="event-page-cta-wrapper">
          ${
            PrimaryButton(
              state.eventsAppliedFor.includes(event.id)
                ? { label: 'applied', disabled: true }
                : { label: 'apply', disabled: false }
            )
          }
          <a
            href="https://twitter.com/intent/tweet?text=${
              event.description
            }&url=${location.href}"
            target="_NEW"
            class="share-icon-wrapper"
          >
            ${TwitterIcon()}
          </a>
        </div>
      </div>
    </div>
    <div class="event-page-main">
      <div class="event-page-description">
        <div class="heading-standard">About this Event</div>
        <div class="event-page-type">${event.type}</div>
        <div class="event-page-description-main">${event.description}</div>
      </div>
    </div>
    <div class="event-page-overlay">
      <div class="event-feedback-modal">
        <div class="event-feedback-modal-header">
          <div class="event-feedback-modal-header-icon-wrapper">${CancelIcon()}</div>
        </div>
        <div class="event-feedback-modal-main">
          <div class="event-feedback-modal-success-wrapper">
            <div class="event-feedback-modal-main-icon-wrapper">${DoneIcon()}</div>
            <div class="event-feedback-modal-main-message">Application successful.</div>
          </div>
          <div class="event-feedback-modal-failure-wrapper">
            <div class="event-feedback-modal-main-icon-wrapper">${ErrorIcon()}</div>
            <div class="event-feedback-modal-main-message">
              Members only event.
              <a href="https://vanhack.com/premium" target="_NEW">Buy a plan.</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // back to all events
  page.querySelector('.back-button-icon-wrapper').addEventListener('click', function() {
    listAllEvents();
  });

  // apply for event, if not already
  page.querySelector('button').addEventListener('click', function() {
    if (!state.eventsAppliedFor.includes(event.id)) {
      page.querySelector('.event-page-overlay').classList.add('show-event-page-overlay');

      if (event.type === 'Premium-only Webinar') {
        page.querySelector(
          '.event-feedback-modal-failure-wrapper'
        ).classList.add('show-event-feedback-modal-failure-wrapper');
      } else {
        page.querySelector(
          '.event-feedback-modal-success-wrapper'
        ).classList.add('show-event-feedback-modal-success-wrapper');

        applyForEvent(event.id);
      } 
    }
  });

  // hide overlay
  page.querySelector(
    '.event-feedback-modal-header-icon-wrapper'
  ).addEventListener('click', function() {
    page.querySelector('.event-page-overlay').classList.remove('show-event-page-overlay');
  });

  return page;
}

/**
 * PrimaryButton - component
 * @function
 * @param {string} label
 * @returns {HTMLButtonElement} button
 */
function PrimaryButton({ label, disabled }) {
  return `
    <button class="primary-button ${disabled ? 'primary-button-disabled' : ''}">
      ${label}
    </button>
  `;
}

/**
 * date - helper
 * @function
 * @param {string} dateTimeString
 * @returns {string} date
 */
function date(dateTimeString) {
  const date = new Date(dateTimeString);

  const day = date.getDate();

  // map month-number to name
  const month = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ].filter((month, index) => index === date.getMonth());

  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

/**
 * time - helper
 * @function
 * @param {string} dateTimeString
 * @returns {string} time
 */
function time(dateTimeString) {
  const date = new Date(dateTimeString);

  const hours = date.getHours();

  // add leading zero to values less than 10
  const minutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

  return `${hours}:${minutes}`;
};

/**
 * BackIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function BackIcon () {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M21 11H6.83l3.58-3.59L9 6l-6 6 6 6 1.41-1.41L6.83 13H21z"/></svg>
  `;
}

/**
 * DoneIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function DoneIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>
  `;
}

/**
 * CancelIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function CancelIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
  `;
}

/**
 * ErrorIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function ErrorIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
  `;
}

/**
 * TwitterIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function TwitterIcon() {
  return `
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26ZM13.2728 11.2871L13.2449 10.8274C13.1613 9.63586 13.8955 8.54755 15.0571 8.12537C15.4846 7.97525 16.2094 7.95648 16.6834 8.08783C16.8693 8.14413 17.2224 8.33177 17.4733 8.50064L17.9286 8.81024L18.4305 8.65076C18.7093 8.56631 19.081 8.42558 19.2483 8.33177C19.4062 8.24733 19.5457 8.20042 19.5457 8.22856C19.5457 8.38806 19.2018 8.93221 18.9137 9.23244C18.5234 9.65462 18.6349 9.69215 19.4249 9.41069C19.8988 9.25121 19.9081 9.25121 19.8152 9.42946C19.7594 9.52327 19.4713 9.85164 19.1646 10.1519C18.6442 10.6679 18.6164 10.7242 18.6164 11.1557C18.6164 11.8219 18.3004 13.2104 17.9844 13.9703C17.399 15.3964 16.1444 16.8693 14.8898 17.6105C13.1241 18.6519 10.773 18.9146 8.79356 18.3048C8.13376 18.0984 7 17.573 7 17.4792C7 17.451 7.34384 17.4135 7.76204 17.4041C8.63559 17.3853 9.50912 17.1414 10.2526 16.7099L10.7544 16.4096L10.1782 16.2126C9.36044 15.9312 8.6263 15.2838 8.44043 14.674C8.38467 14.4769 8.40326 14.4676 8.92368 14.4676L9.46266 14.4582L9.00731 14.2424C8.46831 13.9703 7.97577 13.5106 7.73415 13.0415C7.55759 12.7038 7.33455 11.85 7.3996 11.7843C7.41818 11.7562 7.61334 11.8125 7.83638 11.8875C8.4776 12.1221 8.56123 12.0658 8.18951 11.6717C7.49254 10.9587 7.27879 9.89856 7.61334 8.89468L7.77133 8.44435L8.38467 9.05418C9.63924 10.2832 11.1168 11.015 12.8082 11.2308L13.2728 11.2871Z"/>
</svg>
  `;
}

/**
 * LaunchIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function LaunchIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><path d="m511.4 38.222c-1.109-20.338-17.284-36.511-37.622-37.621-41.038-2.242-121.342-.061-198.13 39.656-39.145 20.248-80.545 54.577-113.584 94.185-.407.488-.803.979-1.207 1.468l-74.98 5.792c-12.342.954-23.335 7.423-30.161 17.747l-51.154 77.372c-5.177 7.83-6 17.629-2.203 26.212 3.798 8.584 11.602 14.566 20.877 16.003l63.171 9.784c-.223 1.228-.447 2.455-.652 3.683-2.103 12.58 2.065 25.514 11.151 34.599l87.992 87.993c7.533 7.533 17.712 11.686 28.142 11.686 2.148 0 4.308-.177 6.458-.536 1.228-.205 2.455-.429 3.683-.652l9.784 63.172c1.437 9.275 7.419 17.08 16.001 20.877 3.571 1.58 7.35 2.36 11.112 2.36 5.283-.001 10.529-1.539 15.101-4.562l77.372-51.155c10.325-6.827 16.793-17.82 17.745-30.161l5.792-74.979c.489-.404.981-.8 1.469-1.207 39.609-33.039 73.939-74.439 94.186-113.585 39.719-76.791 41.896-157.096 39.657-198.131zm-175.394 393.037-74.011 48.933-9.536-61.565c31.28-9.197 62.223-23.927 91.702-43.66l-3.773 48.845c-.235 3.047-1.833 5.762-4.382 7.447zm-129.895-37.377-87.993-87.993c-2.245-2.246-3.283-5.401-2.774-8.44 2.616-15.643 6.681-30.534 11.713-44.562l132.028 132.028c-16.848 6.035-31.939 9.635-44.534 11.741-3.044.506-6.195-.529-8.44-2.774zm-117.923-222.269 48.844-3.773c-19.734 29.479-34.464 60.422-43.661 91.702l-61.564-9.535 48.934-74.012c1.686-2.55 4.401-4.147 7.447-4.382zm270.155 155.286c-24.233 20.213-47.756 34.833-69.438 45.412l-149.221-149.221c13.858-28.304 30.771-51.873 45.417-69.431 30.575-36.655 68.602-68.276 104.331-86.756 70.474-36.453 144.725-38.416 182.713-36.348 5.028.274 9.027 4.273 9.301 9.302 2.071 37.988.104 112.238-36.349 182.713-18.479 35.728-50.1 73.754-86.754 104.329z"/><path d="m350.721 236.243c19.202-.002 38.412-7.312 53.031-21.931 14.166-14.165 21.966-32.999 21.966-53.031s-7.801-38.866-21.966-53.031c-29.242-29.243-76.822-29.241-106.062 0-14.166 14.165-21.967 32.999-21.967 53.031s7.802 38.866 21.967 53.031c14.622 14.622 33.822 21.933 53.031 21.931zm-31.82-106.781c8.772-8.773 20.295-13.159 31.818-13.159 11.524 0 23.047 4.386 31.819 13.159 8.499 8.499 13.179 19.799 13.179 31.818s-4.68 23.32-13.179 31.819c-17.544 17.545-46.093 17.544-63.638 0-8.499-8.499-13.18-19.799-13.18-31.818s4.682-23.32 13.181-31.819z"/><path d="m15.301 421.938c3.839 0 7.678-1.464 10.606-4.394l48.973-48.973c5.858-5.858 5.858-15.355 0-21.213-5.857-5.858-15.355-5.858-21.213 0l-48.972 48.973c-5.858 5.858-5.858 15.355 0 21.213 2.928 2.929 6.767 4.394 10.606 4.394z"/><path d="m119.761 392.239c-5.857-5.858-15.355-5.858-21.213 0l-94.154 94.155c-5.858 5.858-5.858 15.355 0 21.213 2.929 2.929 6.767 4.393 10.606 4.393s7.678-1.464 10.606-4.394l94.154-94.154c5.859-5.858 5.859-15.355.001-21.213z"/><path d="m143.429 437.12-48.973 48.973c-5.858 5.858-5.858 15.355 0 21.213 2.929 2.929 6.768 4.394 10.606 4.394s7.678-1.464 10.606-4.394l48.973-48.973c5.858-5.858 5.858-15.355 0-21.213-5.857-5.858-15.355-5.858-21.212 0z"/></svg>
  `;
}

/**
 * FlagIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function FlagIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512" height="512" viewBox="0 0 512 512" width="512"><g><circle cx="256.002" cy="306" r="10"/><path d="m326.343 178 107.162-121.38c2.59-2.94 3.23-7.16 1.609-10.73-1.609-3.58-5.19-5.89-9.109-5.89h-330.005v-30c0-5.523-4.478-10-10-10s-10 4.477-10 10v492c0 5.523 4.478 10 10 10s10-4.477 10-10v-186h115.001c5.51 0 10-4.49 10-10s-4.49-10-10-10h-115.001v-236h307.834l-98.331 111.38c-3.33 3.77-3.33 9.46 0 13.24l98.331 111.38h-102.831c-5.521 0-10 4.49-10 10s4.48 10 10 10h125.002c3.92 0 7.5-2.31 9.109-5.89 1.62-3.57.98-7.79-1.609-10.73z"/></g></svg>
  `;
}

/**
 * PinIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function PinIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
  <g>
    <path d="M256,0C156.748,0,76,80.748,76,180c0,33.534,9.289,66.26,26.869,94.652l142.885,230.257    c2.737,4.411,7.559,7.091,12.745,7.091c0.04,0,0.079,0,0.119,0c5.231-0.041,10.063-2.804,12.75-7.292L410.611,272.22    C427.221,244.428,436,212.539,436,180C436,80.748,355.252,0,256,0z M384.866,256.818L258.272,468.186l-129.905-209.34    C113.734,235.214,105.8,207.95,105.8,180c0-82.71,67.49-150.2,150.2-150.2S406.1,97.29,406.1,180    C406.1,207.121,398.689,233.688,384.866,256.818z"/>
  </g>
</g>
<g>
  <g>
    <path d="M256,90c-49.626,0-90,40.374-90,90c0,49.309,39.717,90,90,90c50.903,0,90-41.233,90-90C346,130.374,305.626,90,256,90z     M256,240.2c-33.257,0-60.2-27.033-60.2-60.2c0-33.084,27.116-60.2,60.2-60.2s60.1,27.116,60.1,60.2    C316.1,212.683,289.784,240.2,256,240.2z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>
  `;
}

/**
 * PremiumIcon - component
 * @function
 * @returns {SVGElement} icon
 */
function PremiumIcon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512.002 512.002" height="512" viewBox="0 0 512.002 512.002" width="512"><g><g clip-rule="evenodd" fill-rule="evenodd"><g><path d="m209.37 235.174 20.822-74.043h-42.29c-3.676 0-6.882 2.121-8.58 5.265l-41.556 62.842c-1.181 1.783-1.763 3.863-1.766 5.935h73.37z" fill="#00ccf2"/><path d="m281.786 161.132 20.822 74.043h73.392c-.001-2.296-.719-4.587-2.141-6.467l-41.728-63.103c-1.853-2.798-4.86-4.469-8.055-4.473z" fill="#00ccf2"/><path d="m302.608 235.174-20.822-74.042h-51.594l-20.822 74.042z" fill="#66e0f7"/><path d="m302.608 235.174h-93.238l46.619 134.1z" fill="#00ccf2"/><path d="m255.989 369.274-46.619-134.1h-73.369c-.003 2.562.879 5.111 2.614 7.074l110.168 125.315c3.9 4.421 10.518 4.402 14.414 0 37.148-40.965 73.574-83.69 110.167-125.315 1.765-2.001 2.638-4.54 2.637-7.074h-73.392z" fill="#66e0f7"/></g><path d="m66.001 256.001c0-104.934 85.066-190 190-190s190 85.066 190 190-85.066 190-190 190-190-85.066-190-190zm236.625-227.466-27.164-13.626c-11.694-6.276-26.205-6.782-38.793-.068l-24.38 13.068-30.062-2.175c-13.436-1.51-27.34 3.612-36.539 14.854l-17.738 21.663-26.173 8.688c-13.892 3.238-25.719 13.607-30.14 28.243l-8.08 26.745-23.477 20.311c-9.92 8.434-15.682 21.432-14.311 35.372l2.766 27.765-13.626 27.164c-6.276 11.694-6.782 26.205-.068 38.793l13.068 24.38-2.175 30.062c-1.51 13.436 3.612 27.34 14.854 36.539l21.663 17.738 8.688 26.173c3.238 13.892 13.607 25.719 28.243 30.14l26.745 8.08 20.311 23.478c8.434 9.92 21.432 15.682 35.372 14.311l27.762-2.767 27.165 13.626c11.692 6.277 26.205 6.784 38.793.069l24.381-13.068 30.062 2.175c13.436 1.51 27.34-3.612 36.539-14.854l17.738-21.663 26.173-8.688c13.892-3.238 25.719-13.608 30.141-28.243l8.08-26.745 23.478-20.311c9.92-8.435 15.682-21.432 14.311-35.372l-2.767-27.762 13.626-27.165c6.277-11.692 6.784-26.205.069-38.792l-13.068-24.381 2.175-30.062c1.51-13.436-3.612-27.34-14.854-36.539l-21.663-17.738-8.688-26.173c-3.238-13.892-13.607-25.719-28.243-30.141l-26.745-8.08-20.311-23.479c-8.435-9.92-21.432-15.682-35.372-14.311z" fill="#ffc144"/><path d="m256.001 66.001c-104.934 0-190 85.066-190 190s85.066 190 190 190 190-85.066 190-190-85.066-190-190-190zm-118.234 163.238 41.556-62.842c1.698-3.144 4.904-5.264 8.579-5.264l136.174-.001c3.195.003 6.202 1.674 8.055 4.472l41.728 63.103c2.991 3.954 2.869 9.727-.496 13.541-36.594 41.626-73.019 84.351-110.167 125.315-3.896 4.402-10.514 4.421-14.414 0l-110.167-125.315c-3.138-3.55-3.488-9.023-.848-13.009z" fill="#fff2a0"/></g><g><path d="m303.036 61.58c-5.377-1.295-10.771 2.01-12.065 7.378-1.294 5.369 2.009 10.771 7.378 12.065 81.048 19.541 137.652 91.495 137.652 174.979 0 99.252-80.748 179.999-180 179.999s-180-80.747-180-179.999c0-83.486 56.607-155.44 137.659-174.979 5.369-1.294 8.672-6.696 7.378-12.065-1.294-5.368-6.692-8.673-12.065-7.378-42.882 10.338-81.732 35.124-109.395 69.794-28.509 35.729-43.577 78.826-43.577 124.629 0 110.28 89.72 199.999 200 199.999s200-89.719 200-199.999c0-45.802-15.067-88.896-43.574-124.626-27.661-34.671-66.511-59.459-109.391-69.797z"/><path d="m505.974 231.947-11.698-21.826 1.952-26.984c1.874-17.297-5.025-34.175-18.479-45.184l-19.42-15.902-7.639-23.012c-4.278-17.595-17.642-31.736-34.979-36.973l-23.971-7.242-18.358-21.221c-10.863-12.777-27.305-19.421-43.982-17.785l-24.881 2.479-24.456-12.268c-15.072-8.034-33.042-8.04-48.118-.001l-21.825 11.698-26.983-1.951c-17.296-1.883-34.176 5.024-45.185 18.479l-15.902 19.42-23.012 7.639c-17.595 4.277-31.736 17.64-36.974 34.977l-7.24 23.971-21.223 18.359c-12.775 10.864-19.424 27.302-17.783 43.982l2.479 24.88-12.268 24.458c-8.035 15.071-8.042 33.041-.002 48.115l11.698 21.827-1.951 26.983c-1.876 17.295 5.023 34.174 18.479 45.184l19.42 15.901 7.639 23.014c4.278 17.595 17.641 31.736 34.979 36.974l23.971 7.24 18.358 21.221c10.862 12.776 27.297 19.42 43.983 17.785l24.879-2.48 24.455 12.268c7.539 4.021 15.801 6.031 24.065 6.03 8.258 0 16.518-2.008 24.053-6.027l21.827-11.698 26.981 1.951c17.296 1.879 34.178-5.021 45.186-18.478l15.902-19.421 23.013-7.639c17.595-4.276 31.735-17.64 36.974-34.979l7.24-23.97 21.221-18.358c12.776-10.863 19.426-27.301 17.785-43.983l-2.479-24.879 12.267-24.455c8.037-15.072 8.044-33.042.002-48.119zm-17.693 38.788c-.044.081-.087.163-.128.246l-13.626 27.164c-.849 1.692-1.2 3.591-1.013 5.475l2.766 27.75c.998 10.148-3.053 20.158-10.902 26.832l-23.478 20.311c-1.432 1.238-2.482 2.858-3.03 4.671l-8.079 26.744c-3.221 10.665-11.972 18.863-22.838 21.396-.297.069-.591.152-.88.248l-26.173 8.688c-1.797.597-3.388 1.691-4.587 3.155l-17.742 21.667c-6.737 8.234-17.086 12.444-27.679 11.248-.132-.015-.265-.027-.396-.036l-30.063-2.174c-1.896-.141-3.776.265-5.445 1.16l-24.363 13.058c-9.189 4.898-20.164 4.878-29.357-.056-.081-.044-.163-.087-.245-.128l-27.164-13.627c-1.396-.7-2.932-1.062-4.484-1.062-.33 0-.661.017-.992.049l-27.75 2.767c-10.135.992-20.156-3.053-26.831-10.902l-20.312-23.478c-1.238-1.432-2.858-2.482-4.671-3.03l-26.745-8.079c-10.664-3.221-18.862-11.972-21.396-22.838-.069-.297-.152-.591-.248-.88l-8.688-26.174c-.597-1.797-1.69-3.387-3.155-4.587l-21.666-17.74c-8.235-6.739-12.441-17.087-11.249-27.68.015-.132.027-.265.036-.396l2.174-30.063c.137-1.889-.266-3.777-1.16-5.445l-13.058-24.363c-4.9-9.188-4.879-20.162.057-29.356.043-.081.086-.163.127-.246l13.626-27.165c.849-1.692 1.2-3.591 1.013-5.475l-2.765-27.751c-.998-10.147 3.053-20.157 10.9-26.832l23.478-20.311c1.433-1.238 2.483-2.858 3.031-4.671l8.079-26.745c3.221-10.664 11.972-18.862 22.838-21.396.297-.069.591-.152.88-.248l26.173-8.688c1.797-.597 3.388-1.691 4.587-3.155l17.741-21.666c6.738-8.235 17.086-12.444 27.68-11.249.132.015.265.027.396.036l30.063 2.174c1.892.134 3.777-.265 5.446-1.16l24.361-13.058c9.187-4.9 20.162-4.88 29.358.056.081.043.162.086.244.127l27.164 13.627c1.693.85 3.594 1.196 5.476 1.013l27.752-2.766c10.141-.993 20.157 3.053 26.831 10.902l20.312 23.478c1.238 1.432 2.858 2.482 4.67 3.029l26.745 8.081c10.665 3.221 18.863 11.972 21.396 22.838.069.297.152.591.248.88l8.688 26.173c.597 1.797 1.691 3.388 3.155 4.587l21.666 17.74c8.235 6.738 12.44 17.087 11.249 27.682-.015.132-.027.264-.036.396l-2.175 30.062c-.137 1.889.266 3.777 1.16 5.445l13.059 24.364c4.901 9.187 4.88 20.161-.056 29.357z"/><path d="m170.775 161.193-41.347 62.524c-5.18 7.822-4.482 18.165 1.676 25.133l110.178 125.328c3.748 4.249 9.1 6.688 14.684 6.693h.016c5.565 0 10.905-2.417 14.661-6.634 24.841-27.394 49.703-55.968 73.749-83.603 11.956-13.741 24.319-27.95 36.471-41.771 6.402-7.258 6.881-18.089 1.191-25.896l-41.584-62.884c-3.705-5.599-9.829-8.945-16.394-8.953h-136.174c-7.049.001-13.564 3.843-17.127 10.063zm31.484 83.981 31.238 89.856-78.994-89.856zm71.951-74.043 15.199 54.043h-66.839l15.198-54.043zm14.335 74.043-32.556 93.646-32.556-93.646zm40.759 32.332c-16.74 19.238-33.878 38.927-51.104 58.333l31.519-90.665h47.776c-9.459 10.805-18.946 21.707-28.191 32.332zm30.231-52.332h-49.351l-15.198-54.043h28.811zm-171.403-54.043h28.86l-15.198 54.043h-49.351l35.221-53.262c.165-.248.317-.504.459-.766.003-.005.006-.01.009-.015z"/><path d="m256.008 76.001c5.522 0 10-4.478 10-10s-4.478-10-10-10h-.007c-5.522 0-9.996 4.478-9.996 10s4.48 10 10.003 10z"/></g></g></svg>
  `;
}

/**
 * mock data
 * this is equivalent to the result of a JSON.parse()
 * on a JSON string response from an API call
 * @function
 * @returns {object} array - list of events
 */
function getEvents() {
  return [
    {
      id: '1534a879-bad4-4220-9b03-ae18bc21e883',
      type: 'MeetUp',
      title: 'Kampala JS',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2020-07-10T09:30',
      endDate: '2020-07-11T14:00',
      location: 'Plus256 Gallery, Kampala, UGA',
      applicationDeadline: '2020-07-09T24:00',
      timezone: 'eat',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593518021/md-duran-rE9vgD_TXgM-unsplash.jpg'
      ],
      tags: ['africa', 'js', 'meetup']
    },
    {
      id: '0096891a-e6a7-4a91-92ce-e5a5631caab5',
      type: 'Leap',
      title: 'ProductCon EU',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2020-08-10T10:30',
      endDate: '2020-08-10T17:00',
      location: 'The Science Museum, London, UK',
      applicationDeadline: '2020-07-10T24:00',
      timezone: 'bst',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593518028/product-school-cd7i9vYIyeY-unsplash.jpg'
      ],
      tags: []
    },
    {
      id: '91a11db2-0452-493f-a199-2dd661dfc104',
      type: 'Recruiting Mission',
      title: 'Jazz Safari Kenya',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2020-08-10T09:30',
      endDate: '2020-08-10T13:30',
      location: 'Kasarani Stadium, Nairobi, KE',
      applicationDeadline: '2020-07-10T24:00',
      timezone: 'eat',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593518025/slim-emcee-W5NNCfT7EFc-unsplash.jpg'
      ],
      tags: []
    },
    {
      id: 'ddb6be8d-0c52-40f5-8aa8-4f3b5fe78e83',
      type: 'VanHackathon',
      title: 'AWS re:Invent',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2020-07-10T09:30',
      endDate: '2020-07-14T19:00',
      location: 'online',
      applicationDeadline: '2020-06-10T24:00',
      timezone: 'pst',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593518004/hello-i-m-nik-73_kRzs9sqo-unsplash.jpg'
      ],
      tags: []
    },
    {
      id: 'a43ae5d3-fcff-45a5-8e18-261d84ea6917',
      type: 'Premium-only Webinar',
      title: 'KubeCon North America 2020',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2020-11-17T09:30',
      endDate: '2020-11-20T18:30',
      location: 'Boston Convention Center, Boston, MA',
      applicationDeadline: '2020-06-10T24:00',
      timezone: 'est',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593518000/alex-kotliarskyi-ourQHRTE2IM-unsplash.jpg'
      ],
      tags: []
    },
    {
      id: 'efffdb82-e2fd-46c0-b111-a95508af0b2d',
      type: 'Open Webinar',
      title: 'DockerCon',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2020-09-10T14:00',
      endDate: '2020-09-13T19:30',
      location: 'online',
      applicationDeadline: '2020-08-10T24:00',
      timezone: 'cst',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593518011/markus-spiske-UCbMZ0S-w28-unsplash.jpg'
      ],
      tags: []
    },
    {
      id: 'e8595356-106f-446f-b095-7dd40e5290ec',
      type: 'MeetUp',
      title: 'Wine & Food Festival',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2020-07-10T12:00',
      endDate: '2020-07-10T19:30',
      location: 'Webster Hall, New York City, NY',
      applicationDeadline: '2020-06-10T24:00',
      timezone: 'est',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593517977/dave-lastovskiy-RygIdTavhkQ-unsplash.jpg'
      ],
      tags: []
    },
    {
      id: '7232f160-4269-45c7-ac91-155474379efc',
      type: 'Premium-only Webinar',
      title: 'Startup Grind',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2021-12-10T09:30',
      endDate: '2021-12-10T16:30',
      location: 'Fox Theater, Redwood City, CA',
      applicationDeadline: '2021-11-10T24:00',
      timezone: 'pst',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593517977/austin-distel-mpN7xjKQ_Ns-unsplash.jpg'
      ],
      tags: []
    },
    {
      id: '81b28c0f-f5aa-4f00-8e6a-b4a1ef445755',
      type: 'VanHackathon',
      title: 'Cisco Live',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2021-10-10T09:30',
      endDate: '2021-10-10T17:00',
      location: 'Fira de Barcelona, Barcelona, ESP',
      applicationDeadline: '2021-09-10T24:00',
      timezone: 'cet',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593517995/evangeline-shaw-nwLTVwb7DbU-unsplash.jpg'
      ],
      tags: []
    },
    {
      id: '17c0f36a-3f4c-4c2d-9625-910c2dc597bc',
      type: 'Open Webinar',
      title: 'CES 2021',
      description: 'The Cloud Native Computing Foundation’s flagship conference gathers adopters and technologists from leading open source and cloud native communities in Boston, Massachusetts from November 17 – 20, 2020. <br/><br/>Join Kubernetes, Prometheus, Envoy, CoreDNS, containerd, Fluentd, TUF, Jaeger, Vitess, OpenTracing, gRPC, CNI, Notary, NATS, Linkerd, Helm, Rook, Harbor, etcd, Open Policy Agent, CRI-O, TiKV, CloudEvents and Falco as the community gathers for four days to further the education and advancement of cloud native computing.',
      startDate: '2021-06-10T09:30',
      endDate: '2021-06-15T15:30',
      location: 'Convention Center, Las Vegas, NV',
      applicationDeadline: '2021-01-10T24:00',
      timezone: 'pst',
      images: [
        'https://res.cloudinary.com/plus256/image/upload/v1593518020/sj-baren-lGZSEBx3GYo-unsplash.jpg'
      ],
      tags: []
    }
  ];
}