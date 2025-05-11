(function ($) {
  // Search (搜索功能)
  let $searchWrap = $(".search-form-wrap"), // 搜索框的包裹元素
    isSearchAnim = false, // 标记搜索动画是否正在进行
    searchAnimDuration = 200; // 搜索动画的持续时间（毫秒）

  const startSearchAnim = () => {
    isSearchAnim = true; // 设置搜索动画为正在进行
  };

  const stopSearchAnim = (callback) => {
    setTimeout(function () {
      isSearchAnim = false; // 延迟一段时间后设置搜索动画为停止
      callback && callback(); // 如果提供了回调函数，则执行它
    }, searchAnimDuration);
  };

  // 点击导航栏的搜索图标时触发
  $(".nav-item-search").on("click", () => {
    if (isSearchAnim) return; // 如果搜索动画正在进行，则直接返回，防止重复触发
    startSearchAnim(); // 开始搜索动画
    $searchWrap.addClass("on"); // 给搜索框包裹元素添加 "on" 类，用于显示搜索框（通过 CSS 控制）
    stopSearchAnim(function () {
      $(".local-search-input").focus(); // 搜索框显示动画结束后，自动聚焦到输入框
    });
  });

  // 监听文档的鼠标mouseup事件（鼠标按键抬起）
  $(document).on("mouseup", (e) => {
    const _con = $(".local-search"); // 搜索框容器元素
    // 如果点击的区域不是搜索框本身，也不是搜索框的子元素
    if (!_con.is(e.target) && _con.has(e.target).length === 0) {
      $searchWrap.removeClass("on"); // 移除搜索框包裹元素的 "on" 类，用于隐藏搜索框（通过 CSS 控制）
    }
  });

  // 本地搜索功能（如果页面中存在 ".local-search" 元素）
  if ($(".local-search").length) {
    // 动态加载 "/js/search.js" 文件
    $.getScript("/js/search.js", function () {
      // 加载完成后执行 searchFunc 函数，传入搜索数据路径、输入框选择器和结果显示区域选择器
      searchFunc("/search.xml", "local-search-input", "local-search-result");
    });
  }

  // Mobile Detect（移动设备检测）
  const isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i); // 检测 User Agent 是否包含 "Android"
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i); // 检测 User Agent 是否包含 "BlackBerry"
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i); // 检测 User Agent 是否包含 "iPhone"、"iPad" 或 "iPod"
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i); // 检测 User Agent 是否包含 "Opera Mini"
    },
    Windows: function () {
      return navigator.userAgent.match(/IEMobile/i); // 检测 User Agent 是否包含 "IEMobile" (Windows Phone)
    },
    any: function () {
      // 检测是否为任意一种移动设备
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  // Share（分享功能）
  $(".share-outer").on("click", () => $(".share-wrap").fadeToggle()); // 点击分享按钮时，切换显示/隐藏分享面板

  // Lazyload（图片懒加载）
  $("img.lazy").lazyload({
    effect: "fadeIn", // 图片加载后的显示效果为淡入
  });

  // JustifiedGallery（图片自适应画廊）
  $("#gallery").justifiedGallery({
    rowHeight: 200, // 每行的高度为 200 像素
    margins: 5, // 图片之间的外边距为 5 像素
  });

  // ScrollDown（滚动到内容区域）
  $(document).ready(function ($) {
    $(".anchor").on("click", function (e) {
      e.preventDefault(); // 阻止默认的链接跳转行为
      $("main").animate({ scrollTop: $(".cover").height() }, "smooth"); // 平滑滚动到 ".cover" 元素底部（通常是封面区域）
    });
  });

  // To Top（返回顶部）
  (() => {
    // When to show the scroll link（何时显示返回顶部链接）
    // higher number = scroll link appears further down the page（数字越大，链接出现在页面更下方）
    const upperLimit = 1000;

    // Our scroll link element（返回顶部链接元素）
    const scrollElem = $("#totop");

    // Scroll to top speed（返回顶部动画速度）
    const scrollSpeed = 1000;

    // Show and hide the scroll to top link based on scroll position（根据滚动位置显示和隐藏返回顶部链接）
    scrollElem.hide(); // 初始时隐藏返回顶部链接
    $(".content").on("scroll", () => {
      const scrollTop = $(".content").scrollTop(); // 获取 ".content" 元素的垂直滚动距离
      if (scrollTop > upperLimit) {
        $(scrollElem).stop().fadeTo(200, 0.6); // 如果滚动距离超过上限，则淡入显示返回顶部链接
      } else {
        $(scrollElem).stop().fadeTo(200, 0); // 否则，淡出隐藏返回顶部链接
      }
    });

    // Scroll to top animation on click（点击返回顶部链接时的动画）
    $(scrollElem).on("click", () => {
      $(".content").animate({ scrollTop: 0 }, scrollSpeed); // 平滑滚动 ".content" 元素到顶部
      return false; // 阻止默认的链接跳转行为
    });
  })();

  // Caption（图片标题）
  $(".article-entry").each(function (i) {
    $(this)
      .find("img") // 查找当前 ".article-entry" 下的所有图片
      .each(function () {
        if ($(this).parent().is("a")) return; // 如果图片的父元素是链接，则跳过（通常是图片链接）

        const { alt } = this; // 获取图片的 alt 属性值

        if (alt) $(this).after('<span class="caption">' + alt + "</span>"); // 如果 alt 属性存在，则在图片后面添加一个带有 alt 文本的 ".caption" span 元素
      });
  });

  // Mobile Nav（移动端导航）
  const $content = $(".content"), // 内容区域元素
    $sidebar = $(".sidebar"); // 侧边栏元素

  $(".navbar-toggle").on("click", () => {
    $(".content,.sidebar").addClass("anim"); // 给内容区域和侧边栏添加 "anim" 类，用于启用过渡动画（通过 CSS 控制）
    $content.toggleClass("on"); // 切换内容区域的 "on" 类，用于显示/隐藏内容（配合移动端布局 CSS）
    $sidebar.toggleClass("on"); // 切换侧边栏的 "on" 类，用于显示/隐藏侧边栏（配合移动端布局 CSS）
  });

  // Reward（打赏功能）
  $("#reward-btn").on("click", () => {
    $("#reward").fadeIn(150); // 淡入显示打赏弹窗
    $("#mask").fadeIn(150); // 淡入显示遮罩层
  });
  $("#reward .close, #mask").on("click", () => {
    $("#mask").fadeOut(100); // 淡出隐藏遮罩层
    $("#reward").fadeOut(100); // 淡出隐藏打赏弹窗
  });

  // DarkMode（暗黑模式）
  if (sessionStorage.getItem("darkmode") == 1) {
    $("body").addClass("darkmode"); // 如果 sessionStorage 中 "darkmode" 的值为 1，则给 body 添加 "darkmode" 类
    $("#todark i").removeClass("ri-moon-line").addClass("ri-sun-line"); // 切换暗黑模式切换按钮的图标为太阳
  } else {
    $("body").removeClass("darkmode"); // 否则，移除 body 的 "darkmode" 类
    $("#todark i").removeClass("ri-sun-line").addClass("ri-moon-line"); // 切换暗黑模式切换按钮的图标为月亮
  }
  $("#todark").on("click", () => {
    // 点击暗黑模式切换按钮时
    if (sessionStorage.getItem("darkmode") == 1) {
      $("body").removeClass("darkmode"); // 移除 body 的 "darkmode" 类
      $("#todark i").removeClass("ri-sun-line").addClass("ri-moon-line"); // 切换图标为月亮
      sessionStorage.removeItem("darkmode"); // 移除 sessionStorage 中的 "darkmode" 项
    } else {
      $("body").addClass("darkmode"); // 给 body 添加 "darkmode" 类
      $("#todark i").removeClass("ri-moon-line").addClass("ri-sun-line"); // 切换图标为太阳
      sessionStorage.setItem("darkmode", 1); // 在 sessionStorage 中设置 "darkmode" 的值为 1
    }
  });

  // ShowThemeInConsole（在控制台显示主题信息）
  const ayerInfo = "主题不错？⭐star 支持一下 ->";
  const ayerURL = "https://github.com/Shen-Yu/hexo-theme-ayer";
  const ayerNameStr =
    "\n\n     _ __   _______ _____    \n    / \\ \\ \\ / / ____|  _  \\  \n   / _ \\ \\ V /|  _| | |_) |  \n  / ___ \\ | | | |___|  _ <   \n /_/   \\_\\ _| |_____|_| \\__\\ \n";
  const ayerInfoStyle =
    "background-color: #49b1f5; color: #fff; padding: 8px; font-size: 14px;";
  const ayerURLStyle =
    "background-color: #ffbca2; padding: 8px; font-size: 14px;";
  const ayerNameStyle = "background-color: #eaf8ff;";

  console.log(
    "%c%s%c%s%c%s",
    ayerInfoStyle,
    ayerInfo,
    ayerURLStyle,
    ayerURL,
    ayerNameStyle,
    ayerNameStr
  );
})(jQuery);

// Tracking（网站统计代码，通常用于追踪用户行为）
!(function (p) {
  "use strict";
  !(function (t) {
    var s = window,
      e = document,
      i = p,
      c = "".concat(
        "https:" === e.location.protocol ? "https://" : "http://",
        "sdk.51.la/js-sdk-pro.min.js"
      ),
      n = e.createElement("script"),
      r = e.getElementsByTagName("script")[0];
    (n.type = "text/javascript"),
      n.setAttribute("charset", "UTF-8"),
      (n.async = !0),
      (n.src = c),
      (n.id = "LA_COLLECT"),
      (i.d = n);
    var o = function () {
      s.LA.ids.push(i);
    };
    s.LA ? s.LA.ids && o() : ((s.LA = p), (s.LA.ids = []), o()),
      r.parentNode.insertBefore(n, r);
  })();
})({ id: "JGjrOr2rebvP6q2a", ck: "JGjrOr2rebvP6q2a" });