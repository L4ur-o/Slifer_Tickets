import { initTheme }   from './modules/theme.js';
import { initHeader }  from './modules/header.js';
import { initSelects } from './modules/selects.js';
import { initForm }    from './modules/form.js';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeader();
  initSelects();
  initForm();
});
