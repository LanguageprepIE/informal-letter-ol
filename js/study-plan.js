/* Progress belongs to this browser. Keep legacy ticks separate from the new route. */
(() => {
  const status = document.getElementById('study-save-status');
  function bindProgress(selector, attribute, key, counter, onUpdate) {
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
        (attribute === 'task' ? ' tasks completed / tareas completadas' : ' previous tasks completed / tareas anteriores completadas');
      if (onUpdate) onUpdate(boxes);
    }
    boxes.forEach(box => {
      box.checked = saved.includes(box.dataset[attribute]);
      box.addEventListener('change', () => {
        try {
          localStorage.setItem(key, JSON.stringify(boxes.filter(item => item.checked).map(item => item.dataset[attribute])));
          status.textContent = 'Progress saved on this device. / Progreso guardado en este dispositivo.';
        } catch (_) {
          status.textContent = 'Progress could not be saved. Keep a note before leaving. / No se ha podido guardar; anota tu progreso antes de salir.';
        }
        update();
      });
    });
    update();
  }
  bindProgress('[data-task]', 'task', 'ol-study-plan-six-blocks-v1', 'study-progress', boxes => {
    document.querySelectorAll('[data-block-progress]').forEach(counter => {
      const group = boxes.filter(box => box.dataset.block === counter.dataset.blockProgress);
      counter.textContent = group.filter(box => box.checked).length + ' / ' + group.length + ' tasks / tareas';
    });
  });
  bindProgress('[data-legacy-task]', 'legacyTask', 'ol-study-plan-four-weeks-v2', 'legacy-progress');

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
