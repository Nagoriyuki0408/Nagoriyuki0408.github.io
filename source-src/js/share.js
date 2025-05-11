function generate(url, opts) {
  // 替换 URL 中的占位符为实际的分享信息
  var url = url.replace(/<%-sUrl%>/g, encodeURIComponent(opts.sUrl)) // 替换 <%-sUrl%> 为编码后的分享链接
    .replace(/<%-sTitle%>/g, encodeURIComponent(opts.sTitle)) // 替换 <%-sTitle%> 为编码后的分享标题
    .replace(/<%-sDesc%>/g, encodeURIComponent(opts.sDesc)) // 替换 <%-sDesc%> 为编码后的分享描述
    .replace(/<%-sPic%>/g, encodeURIComponent(opts.sPic)); // 替换 <%-sPic%> 为编码后的分享图片链接
  window.open(url); // 在新窗口打开分享链接
}

function showWX() {
  // 显示微信分享模态框
  $('.wx-share-modal').addClass('in ready') // 添加 'in' 和 'ready' 类名，用于显示和动画控制
  $('#share-mask').show() // 显示遮罩层
}

function hideWX() {
  // 隐藏微信分享模态框
  $('.wx-share-modal').removeClass('in ready') // 移除 'in' 和 'ready' 类名，用于隐藏和动画控制
  $('#share-mask').hide() // 隐藏遮罩层
}

function handleClick(type, opts) {
  // 根据分享类型生成对应的分享链接并打开
  if (type === 'weibo') {
    generate('http://service.weibo.com/share/share.php?url=<%-sUrl%>&title=<%-sTitle%>&pic=<%-sPic%>', opts)
  } else if (type === 'qq') {
    generate('http://connect.qq.com/widget/shareqq/index.html?url=<%-sUrl%>&title=<%-sTitle%>&source=<%-sDesc%>', opts)
  } else if (type === 'douban') {
    generate('https://www.douban.com/share/service?image=<%-sPic%>&href=<%-sUrl%>&name=<%-sTitle%>&text=<%-sDesc%>', opts)
  } else if (type === 'qzone') {
    generate('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=<%-sUrl%>&title=<%-sTitle%>&pics=<%-sPic%>&summary=<%-sDesc%>', opts)
  } else if (type === 'facebook') {
    generate('https://www.facebook.com/sharer/sharer.php?u=<%-sUrl%>', opts)
  } else if (type === 'twitter') {
    generate('https://twitter.com/intent/tweet?text=<%-sTitle%>&url=<%-sUrl%>', opts)
  } else if (type === 'google') {
    generate('https://plus.google.com/share?url=<%-sUrl%>', opts)
  } else if (type === 'weixin') {
    showWX(); // 如果是微信分享，则显示微信分享模态框
  }
}

const share_init = () => {
  // 初始化分享功能
  let $sns = document.querySelectorAll('.share-sns'); // 获取所有带有 'share-sns' 类名的元素（分享按钮）
  if (!$sns || $sns.length === 0) return; // 如果没有找到分享按钮，则直接返回

  let sUrl = window.location.href; // 获取当前页面的 URL
  let sTitle = document.querySelector('title').innerHTML; // 获取当前页面的标题
  let $img = document.querySelectorAll('.article-entry img'); // 获取文章内容中的所有图片
  let sPic = $img.length ? document.querySelector('.article-entry img').getAttribute('src') : ''; // 如果文章中有图片，则获取第一张图片的 'src' 属性作为分享图片，否则为空

  // 处理分享图片链接，如果不是完整的 URL，则添加网站域名
  if ((sPic !== '') && !/^(http:|https:)?\/\//.test(sPic)) {
    sPic = window.location.origin + sPic
  }

  // 遍历每个分享按钮
  $sns.forEach(($em) => {
    $em.onclick = (e) => {
      // 为每个分享按钮添加点击事件监听器
      let type = $em.getAttribute('data-type') // 获取当前点击的分享按钮的 'data-type' 属性，用于判断分享类型
      handleClick(type, {
        // 调用 handleClick 函数处理分享
        sUrl: sUrl, // 传入当前页面 URL
        sPic: sPic, // 传入分享图片 URL
        sTitle: sTitle, // 传入页面标题
        sDesc: sTitle // 传入分享描述，这里使用了页面标题
      })
    }
  })

  // 为遮罩层和模态框关闭按钮添加点击事件监听器，用于隐藏微信分享模态框
  document.querySelector('#mask').onclick = hideWX
  document.querySelector('.modal-close').onclick = hideWX
}

share_init() // 调用 share_init 函数，初始化分享功能