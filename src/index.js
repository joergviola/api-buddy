function API(cfg) {
  if (!cfg || !cfg.calls) return;
  const jsonpath = require("jsonpath");

  cfg.calls.forEach((call) => {
    perform(cfg, call);
  });

  async function perform(cfg, call) {
    const url = getUrl(cfg.base, call.url);

    const response = await fetch(url, getFetchOptions(call));

    const data = await response.json();

    if (call.permanent) {
      localStorage.setItem(call.name, JSON.stringify(data));
    } else {
      applyData(document, call.name, { [call.name]: data });
    }

    if (call.callback) {
      call.callback(response.status, data);
    }
  }

  function getUrl(base, url) {
    if (!base || url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    } else {
      return base + url;
    }
  }

  function getFetchOptions(call) {
    const options = {
      method: call.method || "GET",
      mode: call.mode || "cors",
      cache: call.cache || "no-cache",
      credentials: call.credentials || "same-origin",
      headers: call.headers || {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
      redirect: call.redirect || "follow",
      referrerPolicy: call.referrerPolicy || "no-referrer",
    };
    if (call.body) {
      options.body = JSON.stringify(call.body);
    }
    if (call.authenticated) {
      const data = localStorage.getItem(call.authenticated);
      const json = JSON.parse(data);
      options.headers.Authorization = `Bearer ${json.token}`;
    }

    return options;
  }

  function applyData(element, name, data) {
    const elements = element.querySelectorAll("[data-api]");
    elements.forEach((el) => applyToElement(el, name, data));
  }

  function applyToElement(element, name, data) {
    const selector = element.dataset.api;

    if (name != null && selector.startsWith(".")) return;

    if (!selector.startsWith(".")) {
      if (!selector.startsWith(name)) return;
    }
    const content = jsonpath.query(data, "$." + selector);

    if (content.length == 0) {
      element.remove();
      return;
    }
    applyContent(element, content[0]);
    for (var i = 1; i < content.length; i++) {
      const newNode = element.cloneNode(true);
      applyContent(newNode, content[i]);
      insertAfter(element, newNode);
      element = newNode;
    }
  }

  function applyContent(element, content) {
    if (typeof content != "object") {
      applyPrimitiveContent(element, content);
    } else {
      applyData(element, null, content);
    }
  }

  function applyPrimitiveContent(element, content) {
    if (element.dataset.apiIterateFrom) {
      element.dataset.api = "";
      const from = element.dataset.apiIterateFrom;
      element.innerHTML = from;
      for (var i = +from + 1; i <= +content; i++) {
        const newNode = element.cloneNode(true);
        newNode.innerHTML = i;
        insertAfter(element, newNode);
        element = newNode;
      }
    } else {
      element.innerHTML = content;
    }
  }

  function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
}

window.API = API;
