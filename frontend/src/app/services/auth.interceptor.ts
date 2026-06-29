import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Busca o token que foi salvo no localStorage após o login
  const token = localStorage.getItem('token');

  // Se o token existir, clona a requisição e adiciona o cabeçalho de autorização
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }

  // Se não houver token, segue com a requisição normal (ex: na própria tela de login)
  return next(req);
};
