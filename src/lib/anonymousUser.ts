// 匿名ログイン

export const getAnonymousId = () => {
  const storageKey = 'anonymous_id';

  let userId = localStorage.getItem(storageKey);

  if(!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem(storageKey, userId);
  }

  return userId;
}
