/**
 * Скрипт для приёма ответов из формы свадебного сайта.
 * Куда вставлять и как настроить — см. инструкцию ниже (в самом низу файла).
 */

// Открытие ссылки /exec в браузере вызывает эту функцию —
// если видишь надпись ниже, значит приложение доступно всем (это хорошо).
function doGet() {
  return ContentService.createTextOutput('Сайт подключён. Приложение работает.');
}

// Запусти эту функцию вручную в редакторе (кнопка ▶ Run),
// чтобы проверить, что скрипт может писать в таблицу.
// После запуска в таблице появится тестовая строка.
function testWrite() {
  doPost({ postData: { contents: JSON.stringify({
    timestamp: new Date().toLocaleString('ru-RU'),
    name: 'ТЕСТ (можно удалить)',
    attend: 'Придёт',
    drinks_guest: 'Шампанское',
    drinks_guest_other: '',
    withPartner: 'Один(а)',
    partnerName: '',
    drinks_partner: '',
    drinks_partner_other: '',
    comment: 'проверка записи'
  }) } });
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Если таблица пустая — добавляем строку заголовков
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата ответа', 'Имя и фамилия', 'Придёт?',
        'Напитки гостя', 'Другой напиток (гость)',
        'Партнёр?', 'Имя партнёра',
        'Напитки партнёра', 'Другой напиток (партнёр)',
        'Комментарий'
      ]);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp,
      data.name,
      data.attend,
      data.drinks_guest,
      data.drinks_guest_other,
      data.withPartner,
      data.partnerName,
      data.drinks_partner,
      data.drinks_partner_other,
      data.comment
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}


/* ═══════════════════════════════════════════════════════════════
   ИНСТРУКЦИЯ ПО ПОДКЛЮЧЕНИЮ
   ═══════════════════════════════════════════════════════════════

   1. Создай таблицу: https://sheets.new
      Назови её, например, «Свадьба — ответы гостей».

   2. В меню таблицы: Расширения → Apps Script.

   3. Удали весь код, который там есть, и вставь ВЕСЬ код из этого
      файла (всё, что выше инструкции). Нажми значок дискеты (Сохранить).

   4. Нажми синюю кнопку «Развернуть» (Deploy) → «Новое развёртывание».
      • Тип (шестерёнка) → «Веб-приложение» (Web app).
      • «У кого есть доступ» (Who has access) → выбери «Все» (Anyone).
      • Нажми «Развернуть».

   5. Google попросит разрешения — разреши доступ своему аккаунту
      (на экране «Google не проверил это приложение» нажми
      «Дополнительно» → «Перейти к проекту (небезопасно)» — это
      твой собственный скрипт, всё ок).

   6. Скопируй «URL веб-приложения» (заканчивается на /exec).

   7. Пришли этот URL мне — я вставлю его в сайт.
      (Или сам: в index.html найди строку
       const SHEET_URL = 'PASTE_YOUR_WEB_APP_URL_HERE';
       и вставь ссылку между кавычками.)

   Готово! После этого каждый ответ гостя будет появляться
   новой строкой в твоей таблице.
   ═══════════════════════════════════════════════════════════════ */
