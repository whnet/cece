
/*
 * 跳转链接，带有时间延迟功能
 */
export function go (url, $router, time) {
  if (!url) return
  const useRouter = typeof url === 'object' || ($router && typeof url === 'string' && !/http/.test(url))
  if (useRouter) {
    setTimeout(() => {
      url === 'BACK' ? $router.go(-1) : $router.push(url)
    }, time)
  } else {
    setTimeout(() => {
      window.location.href = url
    }, time)
  }
}
export function concat(jsonbject1, jsonbject2){
  var resultJsonObject = {}
    for (var attr in jsonbject1) {
        resultJsonObject[attr] = jsonbject1[attr]
    }
    for (var attr in jsonbject2) {
        resultJsonObject[attr] = jsonbject2[attr]
    }
    return resultJsonObject
}
