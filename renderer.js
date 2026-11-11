const loadBtn = document.getElementById('loadBtn');
const filterType = document.getElementById('filterType');
const extensionInput = document.getElementById('extensionInput');
const fileList = document.getElementById('fileList');
const statusText = document.getElementById('status');

let allEntries = [];

function renderEntries() {
  const filter = filterType.value;
  const extension = extensionInput.value.trim().toLowerCase();

  let entries = allEntries;

  if (filter === 'files') {
    entries = entries.filter(entry => !entry.isDir);
  }

  if (filter === 'folders') {
    entries = entries.filter(entry => entry.isDir);
  }

  if (filter === 'extension') {
    const normalized = extension.startsWith('.')
      ? extension
      : '.' + extension;

    entries = entries.filter(entry =>
      !entry.isDir &&
      extension.length > 0 &&
      entry.name.toLowerCase().endsWith(normalized)
    );
  }

  fileList.replaceChildren();

  entries.forEach(entry => {
    const item = document.createElement('li');

    item.className = entry.isDir ? 'folder' : 'file';

    const icon = document.createElement('span');
    icon.textContent = entry.isDir ? '📁' : '📄';

    const name = document.createElement('span');
    name.textContent = entry.name;

    item.append(icon, name);
    fileList.appendChild(item);
  });

  statusText.textContent =
    `Показано элементов: ${entries.length} из ${allEntries.length}`;
}

loadBtn.addEventListener('click', async () => {
  statusText.textContent = 'Загрузка каталога...';
  loadBtn.disabled = true;

  try {
    allEntries = await window.api.listDir('.');
    renderEntries();
  } catch (error) {
    statusText.textContent = 'Ошибка: ' + error.message;
  } finally {
    loadBtn.disabled = false;
  }
});

filterType.addEventListener('change', () => {
  extensionInput.disabled = filterType.value !== 'extension';
  renderEntries();
});

extensionInput.addEventListener('input', renderEntries);
