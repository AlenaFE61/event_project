document.addEventListener('DOMContentLoaded', function() {
  const eventList = document.getElementById('event-list');
  const eventIdInput = document.getElementById('selected-event-id');

  window.loadEvents = function(sortBy = '') {
    eventList.innerHTML = '<option>Loading events...</option>'; // Відображення стану завантаження
    fetch(`/events?sort=${sortBy}`)
        .then(response => response.json())
        .then(events => {
            eventList.innerHTML = ''; // Очистити список перед додаванням нових подій
            events.forEach(event => {
                const option = document.createElement('option');
                option.textContent = `${event.title} - ${new Date(event.date).toLocaleDateString()} (${event.organizer})`;
                option.value = event._id;
                eventList.appendChild(option);
            });
            // Встановлення значення eventId першої події за замовчуванням
            if (events.length > 0) {
                eventIdInput.value = events[0]._id; 
            }
        })
        .catch(error => {
            console.error('Failed to load events:', error);
            eventList.innerHTML = '<option>Failed to load events</option>';
        });
  };

  window.sortEvents = function() {
      const sortBy = document.getElementById('sort-options').value;
      loadEvents(sortBy);
  };

  eventList.addEventListener('change', function() {
      eventIdInput.value = this.value; // Оновлення вибраної події
  });

  // Завантаження подій при завантаженні сторінки
  loadEvents();

  // Реєстраційна форма
  const form = document.getElementById('registration-form');
  form.addEventListener('submit', function(event) {
      event.preventDefault();
      const formData = new FormData(form);
      const data = {
          eventId: eventIdInput.value,
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          dob: formData.get('dob'),
          source: formData.get('source')
      };

      fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          document.getElementById('response-message').textContent = 'Registration successful!';
          console.log('Registration data:', data);
          loadEvents(); // Перезавантажити список подій після реєстрації
      })
      .catch(error => {
          console.error('Registration failed:', error);
          document.getElementById('response-message').textContent = 'Registration failed. Please try again.';
      });
  });
});
