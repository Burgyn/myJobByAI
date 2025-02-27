import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';

export const NoPreflightInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Pre GET požiadavky môžeme optimalizovať hlavičky
  if (req.method === 'GET') {
    // Pre GET požiadavky nepotrebujeme Content-Type, ale môžeme použiť Accept
    const simpleReq = req.clone({
      headers: req.headers
        .set('Content-Type', 'application/json') // Nastavíme Content-Type na JSON
        .set('Accept', 'application/json') // Povie serveru, že očakávame JSON odpoveď
        .set('X-Requested-With', 'XMLHttpRequest'), // Táto hlavička je bezpečná
    });
    return next(simpleReq);
  }

  // Pre ostatné požiadavky (POST, PUT, atď.) ponecháme Content-Type: application/json
  return next(req);
};
