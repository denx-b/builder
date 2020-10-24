#### Критерии вёрстки, описание работы со сборщиком и процесса деплоя

- Именуем классы по [бэму](https://htmlacademy.ru/blog/boost/frontend/short-5 "бэму");
- Используем [критерии](https://docs.google.com/document/d/1A4V9wLNRJVntDdqfaqC7hzCE8BrgKVefxAxB88VEnLo/edit?usp=sharing "критерии");
- Шаблонизатор [twig](https://www.npmjs.com/package/gulp-twig "twig").

Приводим код в соответствии с правилами линтера `npm run lint-fix`
Но также выполняем и чек `npm run lint-check`, так как не все правила могут быть исправлены автоматически. В случае уведомления о несоответствии, надо пофиксить ручками.

Основные команды сборщика:
```bash
npm ci или npm i
npm run start
npm run build
```
Всегда, при налчии package-lock.json, производим установку командой `npm ci`, при отсутствии package-lock.json или изменении зависимостей в package.json, установку производим командой `npm i`  
Различие команд в том, что `npm ci` производит установку в соответсвии с файлом package-lock.json, что более стабильно и быстро — [статья](https://habr.com/ru/post/350762/ "статья")

Разделы `/public` и `/node_modules` в исключении .gitignore. После слияния основной ветки, деплой и сборка на дев-сервере происходит автоматически.
