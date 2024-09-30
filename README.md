[HELP](HELP.md)


Сервер с игрой

БЭК
http://everything-subscribe.gl.at.ply.gg:54577 - мини пк с win 11
http://cloud.novaris.ru:8080 - отдельный сервер
ui
http://146.0.79.151:8080/ 

Развернуть UI
```
git clone https://github.com/lwd997/express-static-server.git &&
cd express-static-server/ &&
npm i &&
git clone https://github.com/sumenkov/SiberianSeaBattle.git -b stable &&
cd SiberianSeaBattle/front/ &&
npm i --omit=dev && npm run build &&
mv dist ../.. && cd ../.. &&
ls &&
pm2 start index.js
```

