Именуем классы по [бэму](https://htmlacademy.ru/blog/boost/frontend/short-5 "бэму")
Используем критерии от [htmlacademy](https://docs.google.com/document/d/1A4V9wLNRJVntDdqfaqC7hzCE8BrgKVefxAxB88VEnLo/edit?usp=sharing "htmlacademy")
Шаблонизатор [twig](https://www.npmjs.com/package/gulp-twig "twig")

Сборщик на gulp, основные команды:
```bash
npm i
npm run start
npm run build
```
Перед коммитом, код чекает [линтер](https://blog.csssr.ru/2018/12/05/lint-your-css "линтером"). 
Чекнуть самостоятельно `npx stylelint --syntax scss "src/**/*.scss"`
Пофиксить автоматом `npx stylelint --fix scss "src/**/*.scss"`, но автоматом фиксится не всё.

Папку `/public` коммитим только из основной (main) ветки. После слияния делаем npm run build > commit -m "Build" > push master.
