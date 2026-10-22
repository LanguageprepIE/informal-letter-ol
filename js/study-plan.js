/* Progress for the six-block study route belongs to this browser. */
(() => {
  const status = document.getElementById('study-save-status');
  function bindProgress(selector, key, counter, onUpdate) {
    const boxes = [...document.querySelectorAll(selector)];
    let saved = [];
    try {
      const value = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(value)) saved = value.filter(item => typeof item === 'string');
    } catch (_) {
      // A malformed or unavailable store must not prevent studying or using the timer.
    }
    function update() {
      const complete = boxes.filter(box => box.checked).length;
      document.getElementById(counter).textContent = complete + ' / ' + boxes.length +
        ' tasks completed / tareas completadas';
      if (onUpdate) onUpdate(boxes);
    }
    boxes.forEach(box => {
      box.checked = saved.includes(box.dataset.task);
      box.addEventListener('change', () => {
        try {
          localStorage.setItem(key, JSON.stringify(boxes.filter(item => item.checked).map(item => item.dataset.task)));
          status.textContent = 'Progress saved on this device. / Progreso guardado en este dispositivo.';
        } catch (_) {
          status.textContent = 'Progress could not be saved. Keep a note before leaving. / No se ha podido guardar; anota tu progreso antes de salir.';
        }
        update();
      });
    });
    update();
  }
  bindProgress('[data-task]', 'ol-study-plan-six-blocks-v1', 'study-progress', boxes => {
    document.querySelectorAll('[data-block-progress]').forEach(counter => {
      const group = boxes.filter(box => box.dataset.block === counter.dataset.blockProgress);
      counter.textContent = group.filter(box => box.checked).length + ' / ' + group.length + ' tasks / tareas';
    });
  });


  // Pace preferences never read or write the existing progress key.
  const paceKey = 'ol-study-plan-weekly-pace-v1';
  const paces = {
    quiet: {time: '20 min Monday–Thursday + 10 min weekend · 90 min/week', extra: 'Use the 20-minute main tasks with help. Weekend (10 min): revisit three useful words in the review group and check one difficult answer.'},
    balanced: {time: '25 min Monday–Thursday + 15 min weekend · 115 min/week', extra: 'Extra 5 min/session: check mistakes, then recall three earlier words. Weekend (15 min): use the review group below and revisit one difficult answer.'},
    intensive: {time: '30 min Monday–Thursday + 20 min weekend · 140 min/week', extra: 'Extra 10 min/session: recall without help, check errors and apply two phrases in your own sentences. Weekend (20 min): use the review group without help first, correct it and retry difficult items.'}
  };
  let preferences = {};
  try {
    const saved = JSON.parse(localStorage.getItem(paceKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (let week = 1; week <= 24; week++) {
        if (Object.hasOwn(paces, saved[week])) preferences[week] = saved[week];
      }
    }
  } catch (_) { /* Studying remains available without storage. */ }
  document.querySelectorAll('[data-week-pace]').forEach(select => {
    const week = select.dataset.weekPace;
    function showPace() {
      const pace = paces[select.value];
      document.getElementById('pace-time-' + week).textContent = pace.time;
      document.getElementById('pace-extra-' + week).textContent = pace.extra;
    }
    select.value = preferences[week] || 'balanced';
    showPace();
    select.addEventListener('change', () => {
      if (!Object.hasOwn(paces, select.value)) select.value = 'balanced';
      preferences[week] = select.value;
      showPace();
      try {
        localStorage.setItem(paceKey, JSON.stringify(preferences));
        status.textContent = 'Week ' + week + ' pace saved on this device. Task ticks are unchanged.';
      } catch (_) {
        status.textContent = 'Pace could not be saved. Note your choice before leaving. Task ticks are unchanged.';
      }
    });
  });

  function openTarget() {
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (_) { return; }
    if (!target) return;
    const block = target.closest('.study-block');
    if (block) {
      block.open = true;
      target.scrollIntoView({block: 'start'});
    }
  }
  window.addEventListener('hashchange', openTarget);
  openTarget();
})();
