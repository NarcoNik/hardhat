### babyushi

autoDistribute - функция автоматического распределения профита, испульзует макисмальный газ в 300_000, можно менять, тем самым, после реинвеста можно обновлять информацию для всех юзеров, в том числе неактивных долгие периоды, и плата за газ для каждого из юзеров будет минимальной и ее можно будет регулировать самим

# reinvest

основной рабочий файл current.js

идеальный расчет в файле ideal.js

сейчас у меня реализован сквозной просчет по весу юзера, основываясь на его вложенной сумме и временем владения этих активов, но расчеты не верны

К примеру:
юзер 2 вложил 100 монет
прошло 3 реинвестирования и юзер захотел добавить 0 монет, просто, чтобы обновить свою информацию о доходах
для него необходимо посчитать сложный процент
что в момент первого реинвестирования у него было вложено 100 монет
за период до первого реинвестирования он заработал n количество монет
начиная с момента после первого реинвестирования и до второго реинвестирования юзер зарабатывал с суммы его вложений + n заработаных монет в первое реинвестирование
после второго реинвестирования так же получает награды в количестве m монет
аналогично, он начинает зарабатывать с его вложенной суммы + n монет + m монет
после 3 реинвестирования получает b монет
и вот тут как раз его итоговая сумма состоит из: вложенная сумма + n монет + m монет + b монет

Необходимо изменить код так, чтобы я мог достоверно и точно просчитать сколько будет наград у пользователя

Необходимо посчитать сколько человек вложил + заработал за все периоды реинвестирования.

Но тут есть проблема, сейчас я могу просчитать точно, только если пользователь активен

Необходимо просчитать для 1 пользователя так, даже если он не активен на протяжении нескольких реинвестирований